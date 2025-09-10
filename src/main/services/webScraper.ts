import { BrowserWindow } from 'electron';
import { EventEmitter } from 'events';
import * as cheerio from 'cheerio';
import { URL } from 'url';
import axios from 'axios';

interface ScrapedContent {
  url: string;
  title: string;
  text: string;
  html: string;
  links: Array<{ href: string; text: string }>;
  codeBlocks: Array<{ language: string; code: string }>;
  metadata: {
    description?: string;
    keywords?: string[];
    author?: string;
  };
}

interface CrawlOptions {
  maxPages?: number;
  maxDepth?: number;
  allowedDomains?: string[];
  excludePatterns?: string[];
  respectRobotsTxt?: boolean;
  delay?: number;
}

export class WebScraperService extends EventEmitter {
  private scrapingWindow: BrowserWindow | null = null;
  private isCrawling: boolean = false;
  private crawlQueue: string[] = [];
  private visitedUrls: Set<string> = new Set();
  private normalizedUrls: Set<string> = new Set(); // Track normalized URLs to prevent duplicates
  private crawlAbortController: AbortController | null = null;

  // Helper to normalize URLs for deduplication
  private normalizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      // Remove trailing slashes
      let normalized = parsed.href.replace(/\/$/, '');
      // Remove fragment
      normalized = normalized.split('#')[0];
      // Handle /stable/ redirects for Rust docs specifically
      if (normalized.includes('doc.rust-lang.org')) {
        normalized = normalized.replace('/stable/', '/');
      }
      return normalized;
    } catch {
      return url;
    }
  }

  async initialize() {
    // Create a hidden window for scraping
    this.scrapingWindow = new BrowserWindow({
      show: false,
      width: 1920,
      height: 1080,
      webPreferences: {
        offscreen: true,
        contextIsolation: true,
        nodeIntegration: false,
        webSecurity: false, // Allow cross-origin requests
        images: false, // Don't load images for performance
        javascript: true, // Need JS for dynamic content
        partition: 'persist:webcrawler' // Use persistent session for cookies
      }
    });

    // Prevent window from being garbage collected
    this.scrapingWindow.on('closed', () => {
      this.scrapingWindow = null;
    });
  }

  async scrapeUrl(url: string): Promise<ScrapedContent> {
    if (!this.scrapingWindow) {
      throw new Error('Scraper not initialized');
    }

    try {
      // Set a proper user agent to avoid blocking
      const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
      
      // Load the URL with retry logic
      let retries = 3;
      let lastError: any;
      
      while (retries > 0) {
        try {
          await this.scrapingWindow.loadURL(url, {
            userAgent,
            extraHeaders: 'Accept-Language: en-US,en;q=0.9'
          });
          break; // Success, exit retry loop
        } catch (error: any) {
          lastError = error;
          retries--;
          
          // Check if it's a network error
          if (error.code === 'ERR_NAME_NOT_RESOLVED' || error.errno === -105) {
            console.error(`DNS resolution failed for ${url}. Retrying...`);
            await this.sleep(2000); // Wait 2 seconds before retry
          } else if (error.code === 'ERR_CONNECTION_REFUSED') {
            console.error(`Connection refused for ${url}`);
            throw error;
          } else {
            throw error;
          }
        }
      }
      
      if (retries === 0 && lastError) {
        throw lastError;
      }

      // Wait for content to load
      await this.waitForContent();

      // Extract content using JavaScript injection with better content detection
      const content = await this.scrapingWindow.webContents.executeJavaScript(`
        (function() {
          // Try to find main content area using common selectors
          const mainSelectors = [
            'main',
            '[role="main"]',
            'article',
            '.content',
            '#content',
            '.main-content',
            '#main-content',
            '.post-content',
            '.entry-content',
            '.page-content',
            '.documentation',
            '.markdown-body',
            '[class*="content"]',
            '[id*="content"]'
          ];
          
          let mainContent = null;
          for (const selector of mainSelectors) {
            const element = document.querySelector(selector);
            if (element && element.innerText && element.innerText.length > 100) {
              mainContent = element;
              break;
            }
          }
          
          // If no main content found, try to find the largest text block
          if (!mainContent) {
            const textElements = Array.from(document.querySelectorAll('div, section, article'))
              .filter(el => {
                const text = el.innerText || '';
                // Exclude navigation, header, footer elements
                const isNav = el.tagName === 'NAV' || 
                             el.tagName === 'HEADER' || 
                             el.tagName === 'FOOTER' ||
                             el.classList.contains('nav') ||
                             el.classList.contains('menu') ||
                             el.classList.contains('header') ||
                             el.classList.contains('footer') ||
                             el.id === 'nav' ||
                             el.id === 'menu' ||
                             el.id === 'header' ||
                             el.id === 'footer';
                return !isNav && text.length > 200;
              })
              .sort((a, b) => (b.innerText?.length || 0) - (a.innerText?.length || 0));
            
            mainContent = textElements[0];
          }
          
          // Get text content - prefer main content if found, otherwise full body
          const textContent = mainContent ? mainContent.innerText : document.body.innerText || '';
          
          // Get all links - focus on content area if found
          const linkContainer = mainContent || document.body;
          const links = Array.from(linkContainer.querySelectorAll('a')).map(a => {
            // Get absolute URL (browser automatically resolves relative URLs)
            const absoluteHref = a.href;
            return {
              href: absoluteHref,
              text: (a.textContent || '').trim()
            };
          }).filter(link => {
            // Filter valid HTTP/HTTPS links and exclude javascript
            if (!link.href || !link.href.startsWith('http') || link.href.startsWith('javascript:')) {
              return false;
            }
            return true;
          }).map(link => {
            // Normalize URLs
            return {
              href: this.normalizeUrl ? this.normalizeUrl(link.href) : link.href,
              text: link.text
            };
          });
          
          // Deduplicate links based on normalized href
          const uniqueLinks = Array.from(
            new Map(links.map(l => [l.href, l])).values()
          );
          
          // Get code blocks from content area
          const codeContainer = mainContent || document.body;
          const codeBlocks = Array.from(codeContainer.querySelectorAll('pre code, pre, code'))
            .map(el => {
              const language = el.className?.match(/language-(\\w+)/)?.[1] || 
                             el.getAttribute('data-language') || 
                             'unknown';
              return {
                language,
                code: el.textContent || ''
              };
            })
            .filter(block => block.code.trim().length > 20); // Filter out tiny snippets
          
          // Get metadata
          const getMetaContent = (name) => {
            const el = document.querySelector(\`meta[name="\${name}"], meta[property="\${name}"]\`);
            return el?.getAttribute('content') || '';
          };
          
          // Extract structured content if available
          const structuredData = [];
          document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
            try {
              structuredData.push(JSON.parse(script.textContent || '{}'));
            } catch (e) {}
          });
          
          return {
            title: document.title || '',
            text: textContent,
            html: document.documentElement.outerHTML,
            links: uniqueLinks,
            codeBlocks: codeBlocks,
            metadata: {
              description: getMetaContent('description') || getMetaContent('og:description'),
              keywords: getMetaContent('keywords').split(',').filter(k => k.trim()),
              author: getMetaContent('author'),
              structuredData: structuredData
            }
          };
        })();
      `);

      return {
        url,
        ...content
      };
    } catch (error: any) {
      console.error(`Failed to scrape ${url} with BrowserWindow:`, error);
      
      // Fallback to axios/cheerio for simple HTML scraping
      if (error.code === 'ERR_NAME_NOT_RESOLVED' || error.errno === -105) {
        console.log(`Attempting fallback scraping with axios for ${url}`);
        return this.scrapeUrlWithAxios(url);
      }
      
      throw error;
    }
  }

  // Fallback scraping method using axios and cheerio
  private async scrapeUrlWithAxios(url: string): Promise<ScrapedContent> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Extract content with cheerio
      const title = $('title').text() || '';
      const textContent = $('body').text() || '';
      
      // Extract links and resolve relative URLs
      const links: Array<{ href: string; text: string }> = [];
      const baseUrl = new URL(url);
      $('a').each((_, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().trim();
        if (href) {
          try {
            // Resolve relative URLs to absolute
            const absoluteUrl = new URL(href, baseUrl).href;
            // Filter out javascript links
            if (absoluteUrl.startsWith('http') && !absoluteUrl.startsWith('javascript:')) {
              // Remove anchor part for crawling
              const urlWithoutAnchor = absoluteUrl.includes('#') ? absoluteUrl.split('#')[0] : absoluteUrl;
              links.push({ href: urlWithoutAnchor, text });
            }
          } catch (e) {
            // Invalid URL, skip it
          }
        }
      });
      
      // Extract code blocks
      const codeBlocks: Array<{ language: string; code: string }> = [];
      $('pre code, pre, code').each((_, el) => {
        const $el = $(el);
        const classNames = $el.attr('class') || '';
        const language = classNames.match(/language-(\w+)/)?.[1] || 
                        $el.attr('data-language') || 
                        'unknown';
        const code = $el.text();
        if (code.trim().length > 20) {
          codeBlocks.push({ language, code });
        }
      });
      
      // Extract metadata
      const description = $('meta[name="description"]').attr('content') || 
                         $('meta[property="og:description"]').attr('content') || '';
      const keywords = ($('meta[name="keywords"]').attr('content') || '').split(',').filter(k => k.trim());
      const author = $('meta[name="author"]').attr('content') || '';
      
      return {
        url,
        title,
        text: textContent,
        html: response.data,
        links,
        codeBlocks,
        metadata: {
          description,
          keywords,
          author
        }
      };
    } catch (error) {
      console.error(`Fallback scraping also failed for ${url}:`, error);
      throw error;
    }
  }

  async crawl(startUrl: string, options: CrawlOptions = {}) {
    if (this.isCrawling) {
      throw new Error('Crawl already in progress');
    }

    const {
      maxPages = 100,
      maxDepth = 3,
      allowedDomains = [],
      excludePatterns = [],
      delay = 1000
    } = options;

    this.isCrawling = true;
    this.crawlAbortController = new AbortController();
    this.visitedUrls.clear();
    this.normalizedUrls.clear();
    
    // Normalize the start URL
    const normalizedStart = this.normalizeUrl(startUrl);
    this.crawlQueue = [normalizedStart];
    this.normalizedUrls.add(normalizedStart);

    const startDomain = new URL(startUrl).hostname;
    if (allowedDomains.length === 0) {
      allowedDomains.push(startDomain);
    }

    let pagesScraped = 0;
    const urlDepthMap = new Map<string, number>();
    urlDepthMap.set(normalizedStart, 0);

    try {
      while (this.crawlQueue.length > 0 && pagesScraped < maxPages && this.isCrawling) {
        const currentUrl = this.crawlQueue.shift()!;
        
        if (this.visitedUrls.has(currentUrl)) continue;
        
        const currentDepth = urlDepthMap.get(currentUrl) || 0;
        if (currentDepth > maxDepth) continue;

        // Check if URL should be excluded
        if (this.shouldExclude(currentUrl, excludePatterns)) continue;

        try {
          // Emit progress
          this.emit('progress', {
            current: pagesScraped + 1,
            total: Math.min(this.crawlQueue.length + pagesScraped + 1, maxPages),
            currentUrl,
            queueSize: this.crawlQueue.length,
            visited: this.visitedUrls.size
          });

          // Scrape the page
          const content = await this.scrapeUrl(currentUrl);
          this.visitedUrls.add(currentUrl);
          pagesScraped++;

          // Emit scraped content
          console.log(`Emitting pageScraped event for: ${currentUrl}`);
          this.emit('pageScraped', {
            url: currentUrl,
            content,
            depth: currentDepth
          });

          // Extract and queue new links
          if (currentDepth < maxDepth) {
            for (const link of content.links) {
              // Links are already normalized from scrapeUrl
              const normalizedHref = link.href;
              
              if (this.shouldCrawl(normalizedHref, allowedDomains, excludePatterns)) {
                // Check if not already visited or queued (using normalized URLs)
                if (!this.visitedUrls.has(normalizedHref) && 
                    !this.normalizedUrls.has(normalizedHref) && 
                    !this.crawlQueue.includes(normalizedHref)) {
                  this.crawlQueue.push(normalizedHref);
                  urlDepthMap.set(normalizedHref, currentDepth + 1);
                  this.normalizedUrls.add(normalizedHref);
                }
              }
            }
          }

          // Delay between requests
          if (delay > 0) {
            await this.sleep(delay);
          }
        } catch (error) {
          console.error(`Failed to crawl ${currentUrl}:`, error);
          this.emit('error', { url: currentUrl, error });
        }
      }

      this.emit('complete', {
        pagesScraped,
        totalVisited: this.visitedUrls.size
      });
    } finally {
      this.isCrawling = false;
      this.crawlAbortController = null;
    }
  }

  stopCrawling() {
    this.isCrawling = false;
    this.crawlAbortController?.abort();
    this.crawlQueue = [];
    this.emit('stopped');
  }

  private shouldCrawl(url: string, allowedDomains: string[], excludePatterns: string[]): boolean {
    try {
      const urlObj = new URL(url);
      
      // Check if domain is allowed
      if (allowedDomains.length > 0 && !allowedDomains.includes(urlObj.hostname)) {
        return false;
      }

      // Check exclude patterns
      if (this.shouldExclude(url, excludePatterns)) {
        return false;
      }

      // Skip non-HTTP(S) protocols
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return false;
      }

      // Skip common file extensions
      const fileExtensions = ['.pdf', '.zip', '.exe', '.dmg', '.jpg', '.png', '.gif', '.mp4', '.mp3'];
      if (fileExtensions.some(ext => url.toLowerCase().endsWith(ext))) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  private shouldExclude(url: string, excludePatterns: string[]): boolean {
    return excludePatterns.some(pattern => {
      try {
        const regex = new RegExp(pattern);
        return regex.test(url);
      } catch {
        return url.includes(pattern);
      }
    });
  }

  private async waitForContent(timeout: number = 8000): Promise<void> {
    if (!this.scrapingWindow) return;

    await this.scrapingWindow.webContents.executeJavaScript(`
      new Promise((resolve) => {
        // Wait for DOM to be ready
        const waitForReady = () => {
          if (document.readyState === 'complete') {
            // Check for dynamic content indicators
            let checkAttempts = 0;
            const checkContent = () => {
              checkAttempts++;
              const hasMainContent = document.querySelector('main, article, [role="main"], .content, #content, .documentation');
              const hasSubstantialText = document.body.innerText && document.body.innerText.length > 300;
              
              // If we have content or exceeded attempts, resolve
              if (hasMainContent || hasSubstantialText || checkAttempts > 10) {
                resolve();
              } else {
                // Keep checking for dynamic content
                setTimeout(checkContent, 300);
              }
            };
            
            // Give initial time for JS frameworks to render
            setTimeout(checkContent, 1500);
          } else {
            // Document not ready yet, wait for it
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', waitForReady);
            } else {
              window.addEventListener('load', waitForReady);
            }
            // Fallback timeout
            setTimeout(resolve, ${timeout});
          }
        };
        
        waitForReady();
      });
    `);
    
    // Additional wait for really slow sites
    await this.sleep(500);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async cleanup() {
    this.stopCrawling();
    if (this.scrapingWindow && !this.scrapingWindow.isDestroyed()) {
      this.scrapingWindow.close();
    }
    this.scrapingWindow = null;
  }

  // Advanced scraping strategies for different content types
  async scrapeDocumentation(url: string): Promise<ScrapedContent> {
    const content = await this.scrapeUrl(url);
    
    // Enhanced extraction for documentation sites
    if (this.scrapingWindow) {
      const enhancedContent = await this.scrapingWindow.webContents.executeJavaScript(`
        (function() {
          // Look for API definitions
          const apiElements = Array.from(document.querySelectorAll('[class*="api"], [class*="method"], [class*="function"]'));
          
          // Extract navigation/sidebar for structure
          const navigation = Array.from(document.querySelectorAll('nav a, aside a, [class*="sidebar"] a'))
            .map(a => ({ href: a.href, text: a.textContent?.trim() }));
          
          // Look for example sections
          const examples = Array.from(document.querySelectorAll('[class*="example"], [id*="example"]'))
            .map(el => el.textContent);
          
          return {
            apis: apiElements.map(el => el.textContent),
            navigation,
            examples
          };
        })();
      `);
      
      Object.assign(content, enhancedContent);
    }
    
    return content;
  }

  async scrapeGitHub(url: string): Promise<ScrapedContent> {
    const content = await this.scrapeUrl(url);
    
    // Enhanced extraction for GitHub repos
    if (this.scrapingWindow && url.includes('github.com')) {
      const githubContent = await this.scrapingWindow.webContents.executeJavaScript(`
        (function() {
          // Extract README content
          const readme = document.querySelector('[data-target="readme-toc.content"]')?.innerHTML || '';
          
          // Get file tree if on repo page
          const files = Array.from(document.querySelectorAll('.js-navigation-item'))
            .map(item => ({
              name: item.querySelector('.js-navigation-open')?.textContent?.trim(),
              type: item.querySelector('svg')?.getAttribute('aria-label')
            }));
          
          // Get languages
          const languages = Array.from(document.querySelectorAll('.BorderGrid-cell .ml-3'))
            .map(el => el.textContent?.trim());
          
          return {
            readme,
            files,
            languages
          };
        })();
      `);
      
      Object.assign(content.metadata, githubContent);
    }
    
    return content;
  }
}
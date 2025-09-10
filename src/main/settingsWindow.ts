import { BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';

let settingsWindow: BrowserWindow | null = null;

export function createSettingsWindow(parent: BrowserWindow): void {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 500,
    height: 400,
    parent,
    modal: true,
    show: false,
    resizable: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  settingsWindow.on('ready-to-show', () => {
    settingsWindow?.show();
  });

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });

  // Load settings HTML
  const settingsHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Settings</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #ffffff;
            padding: 30px;
          }
          h1 {
            font-size: 24px;
            font-weight: 300;
            margin-bottom: 30px;
            color: #333;
          }
          .setting-group {
            margin-bottom: 25px;
          }
          label {
            display: block;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #999;
            margin-bottom: 8px;
          }
          input {
            width: 100%;
            padding: 10px;
            border: 1px solid #e6e6e6;
            background: #f9f9f9;
            font-size: 14px;
            font-family: monospace;
          }
          input:focus {
            outline: none;
            border-color: #ff6b00;
            background: #fff;
          }
          .help-text {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
          .button-group {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e6e6e6;
          }
          button {
            padding: 8px 20px;
            border: 1px solid #e6e6e6;
            background: #fff;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
          }
          button:hover {
            background: #f9f9f9;
          }
          button.primary {
            background: #ff6b00;
            border-color: #ff6b00;
            color: white;
          }
          button.primary:hover {
            background: #e55a00;
          }
          .status {
            padding: 10px;
            margin-top: 10px;
            border-radius: 4px;
            font-size: 12px;
            display: none;
          }
          .status.success {
            background: #d4edda;
            color: #155724;
            display: block;
          }
          .status.error {
            background: #f8d7da;
            color: #721c24;
            display: block;
          }
        </style>
      </head>
      <body>
        <h1>DevDigger Settings</h1>
        
        <div class="setting-group">
          <label>OpenAI API Key</label>
          <input type="password" id="openai-key" placeholder="sk-...">
          <div class="help-text">Used for generating embeddings when Ollama is not available</div>
        </div>

        <div class="setting-group">
          <label>Embedding Model</label>
          <select id="embedding-model" style="width: 100%; padding: 10px; border: 1px solid #e6e6e6; background: #f9f9f9;">
            <option value="auto">Auto (Ollama if available, then OpenAI)</option>
            <option value="ollama">Ollama Only</option>
            <option value="openai">OpenAI Only</option>
            <option value="simple">Simple (No API required)</option>
          </select>
          <div class="help-text">Choose which embedding service to use</div>
        </div>

        <div id="status" class="status"></div>

        <div class="button-group">
          <button onclick="window.close()">Cancel</button>
          <button class="primary" onclick="saveSettings()">Save Settings</button>
        </div>

        <script>
          async function loadSettings() {
            try {
              const apiKey = await window.electronAPI.database.getSetting('openai_api_key');
              const model = await window.electronAPI.database.getSetting('embedding_model');
              
              if (apiKey) {
                document.getElementById('openai-key').value = apiKey;
              }
              if (model) {
                document.getElementById('embedding-model').value = model;
              }
            } catch (error) {
              console.error('Failed to load settings:', error);
            }
          }

          async function saveSettings() {
            const apiKey = document.getElementById('openai-key').value;
            const model = document.getElementById('embedding-model').value;
            const status = document.getElementById('status');

            try {
              await window.electronAPI.database.setSetting('openai_api_key', apiKey);
              await window.electronAPI.database.setSetting('embedding_model', model);
              
              // Notify main process to reload settings
              if (window.electronAPI.settings) {
                await window.electronAPI.settings.updated();
              }
              
              status.className = 'status success';
              status.textContent = 'Settings saved successfully!';
              
              setTimeout(() => {
                window.close();
              }, 1000);
            } catch (error) {
              status.className = 'status error';
              status.textContent = 'Failed to save settings: ' + error.message;
            }
          }

          // Load settings on window load
          loadSettings();
        </script>
      </body>
    </html>
  `;

  settingsWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(settingsHTML)}`);
}

export function getSettingsWindow(): BrowserWindow | null {
  return settingsWindow;
}
# Claude Configuration

## Setup Instructions

To enable Claude to search your entire system's knowledge base:

1. Copy `settings.local.json.template` to `settings.local.json`
2. Replace `{YOUR_USERNAME}` with your actual username
3. Customize the paths according to your system

## Important Notes

- The `settings.local.json` file is gitignored for security
- This configuration enables system-wide search capabilities
- Required for DevDigger's global CLI functionality

## Permissions Explained

- **Read permissions**: Allow Claude to search documents across your system
- **Bash permissions**: Enable DevDigger CLI commands
- **MCP servers**: Provide enhanced AI coordination capabilities

## Global Search Features

With proper configuration, DevDigger can:
- Search your entire Documents folder
- Access system libraries and caches
- Execute global CLI commands from any directory
- Coordinate with Claude-Flow and ruv-swarm for advanced features
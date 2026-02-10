# m0x-context MCP Server

**Up-to-date documentation and code examples for any programming library, right in your AI coding assistant.**

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

---

## Why m0x-context?

AI coding assistants often generate outdated code because they rely on old training data. **m0x-context** solves this by providing real-time access to current library documentation.

### The Problem
- ❌ Outdated code examples from year-old training data
- ❌ Hallucinated APIs that don't exist
- ❌ Generic answers for old package versions

### The Solution
- ✅ Current, version-specific documentation
- ✅ Real working code examples from official sources
- ✅ No hallucinations - actual API documentation

---

## Features

- **🔍 Library Search** - Find any programming library or framework
- **📚 Current Documentation** - Fetch up-to-date docs and code examples
- **🎯 Version-Specific** - Get documentation for specific library versions
- **🔌 MCP Protocol** - Works with any MCP-compatible AI assistant
- **🚀 Multiple Transports** - Supports both stdio and HTTP modes

---

## Installation

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/xlyres-00/m0x-context.git
cd m0x-context
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Build the packages**
```bash
pnpm build
```

4. **Run the MCP server**

**HTTP Mode:**
```bash
node packages/mcp/dist/index.js --transport http --port 3000
```

**stdio Mode (for direct MCP integration):**
```bash
node packages/mcp/dist/index.js --transport stdio
```

---

## Integration with AI Assistants

### LM Studio

Add to your LM Studio MCP configuration:

**studio mode:**
```json
{
  "mcpServers": {
    "m0x-context": {
      "command": "node",
      "args": ["/path/to/m0x-context/packages/mcp/dist/index.js", "--transport", "stdio"]
    }
  }
}
```

**HTTP mode:**
```json
{
  "mcpServers": {
    "m0x-context": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

### Cursor

Add to `~/.cursor/mcp.json` or `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "m0x-context": {
      "command": "node",
      "args": ["/absolute/path/to/m0x-context/packages/mcp/dist/index.js", "--transport", "stdio"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add m0x-context -- node /path/to/m0x-context/packages/mcp/dist/index.js --transport stdio
```

---

## Usage

Once integrated with your AI assistant, simply mention it in your prompts:

**Example prompts:**
```
How do I create middleware in Next.js? use m0x-context
```

```
Show me React useState hook examples. use m0x-context
```

```
Configure Cloudflare Worker with KV storage. use m0x-context
```

The AI will automatically:
1. Search for the relevant library
2. Fetch current documentation
3. Provide accurate, up-to-date code examples

---

## Available Tools

### `resolve-library-id`
Searches for libraries and returns matching results with metadata.

**Parameters:**
- `query` - Your question or task (used for relevance ranking)
- `libraryName` - Name of the library to search for

**Returns:**
- Library ID (e.g., `/vercel/next.js`)
- Description and metadata
- Available versions
- Quality scores

### `query-docs`
Retrieves documentation for a specific library.

**Parameters:**
- `libraryId` - m0x-context-compatible library ID (from resolve-library-id)
- `query` - Specific question about the library

**Returns:**
- Current documentation
- Code examples
- Best practices

---

## Deploy to Railway

Deploy m0x-context to Railway for unlimited cloud access!

### Quick Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template)

### Manual Deployment

1. **Fork/Clone this repository**

2. **Create a new Railway project**
```bash
railway login
railway init
```

3. **Set environment variables** (Optional - for higher rate limits)

**Single API Key:**
```bash
railway variables set CONTEXT7_API_KEY=your_key_here
```

**Multiple API Keys (Recommended for "unlimited" usage):**
```bash
railway variables set CONTEXT7_API_KEYS=key1,key2,key3,key4,key5
```

> **Pro Tip:** Create multiple free Context7 accounts and use all their API keys for automatic rotation!

4. **Deploy**
```bash
railway up
```

5. **Connect from your AI assistant**

Use the Railway URL in your MCP configuration:
```json
{
  "mcpServers": {
    "m0x-context": {
      "url": "https://your-app.up.railway.app/mcp"
    }
  }
}
```

### API Key Rotation

The server automatically rotates through multiple API keys when one gets rate-limited (429 error). This gives you effectively unlimited usage with free accounts!

**How it works:**
- Automatically switches to the next key on rate limit
- Retries failed requests with different keys
- Resets failed keys after 1 hour cooldown

---

## Configuration

### Environment Variables

**`CONTEXT7_API_KEY`** (optional)
- API key for higher rate limits
- Set via environment or `--api-key` flag (stdio mode only)

**`CLIENT_IP_ENCRYPTION_KEY`** (optional)
- 64-character hex string for IP encryption
- Defaults to a standard key if not set

### Command-Line Options

**`--transport <stdio|http>`**
- Communication transport type
- Default: `stdio`

**`--port <number>`**
- Port for HTTP transport
- Default: `3000`

**`--api-key <key>`**
- API key for authentication (stdio mode only)

---

## Development

### Project Structure

```
m0x-context/
├── packages/
│   ├── mcp/           # MCP server implementation
│   ├── sdk/           # JavaScript/TypeScript SDK
│   ├── tools-ai-sdk/  # Vercel AI SDK integration
│   └── cli/           # CLI tools
├── docs/              # Documentation
└── public/            # Static assets
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build:mcp
pnpm build:sdk

# Development mode (watch)
cd packages/mcp
pnpm dev
```

### Testing

```bash
# Run all tests
pnpm test

# Test specific package
pnpm test:sdk
```

---

## Supported Libraries

m0x-context works with thousands of libraries across different ecosystems:

- **Frontend:** React, Vue, Angular, Svelte, Next.js
- **Backend:** Express, NestJS, FastAPI, Django, Flask
- **Databases:** MongoDB, PostgreSQL, Supabase, Prisma
- **Cloud:** Cloudflare Workers, Vercel, AWS SDK, Azure
- **Build Tools:** Vite, Webpack, Rollup, esbuild
- **And many more...**

---

## How It Works

1. **AI Assistant** receives your coding question
2. **m0x-context** searches for the relevant library using `resolve-library-id`
3. **Documentation Retrieval** fetches current docs via `query-docs`
4. **AI Response** uses the fresh documentation to provide accurate answers

The server connects to external documentation APIs to retrieve real-time information, ensuring you always get the latest library documentation.

---

## Troubleshooting

### Server won't start
- Check Node.js version (18+)
- Ensure all dependencies are installed: `pnpm install`
- Verify the build completed: `pnpm build`

### AI assistant doesn't use the tools
- Verify MCP configuration is correct
- Restart your AI assistant
- Try explicitly mentioning "use m0x-context" in prompts

### Rate limiting
- The free tier has rate limits
- Consider setting up an API key for higher limits

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built with [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- Uses the Context7 documentation API as data source
- Inspired by the need for current, accurate AI coding assistance

---

## Links

- **Issues:** [Report a bug](https://github.com/yourusername/m0x-context/issues)
- **Discussions:** [Join the conversation](https://github.com/yourusername/m0x-context/discussions)

---

Made with ❤️ by m0x

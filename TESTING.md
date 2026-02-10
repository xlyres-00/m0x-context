# 🧪 Testing m0x-context MCP Server

## ✅ Server is Running!

Your server should now be running at: `http://localhost:3000/mcp`

---

## Quick Tests

### 1️⃣ Test Ping (In Browser)

Open in browser: http://localhost:3000/ping

Should show: `pong`

---

### 2️⃣ Test with Script

Open **new terminal** and run:

```bash
node test-server.js
```

This will test:
- ✅ Server ping
- ✅ List available tools
- ✅ Search for React library

---

### 3️⃣ Test with LM Studio (Best Test)

**Step 1:** Keep the server running (`pnpm start:local`)

**Step 2:** Open LM Studio → Settings → MCP

**Step 3:** Add this configuration:

```json
{
  "mcpServers": {
    "m0x-context-local": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

**Step 4:** Restart LM Studio

**Step 5:** Test with prompt:
```
How do I use React useEffect hook? use m0x-context
```

**Expected behavior:**
- 🔍 Searches for React library
- 📚 Fetches documentation
- 💡 Provides up-to-date answer

---

### 4️⃣ Test with Cursor IDE

**Step 1:** Create `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "m0x-context": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

**Step 2:** Restart Cursor

**Step 3:** Use in chat: "How to create Next.js API routes?"

---

## 🔍 What to Look For

**In Server Logs:**
```
[m0x-context] Initialized with 4 API key(s) for rotation
m0x-context Documentation MCP Server v2.1.1 running on HTTP at http://localhost:3000/mcp
```

**When API key rotates (on rate limit):**
```
[m0x-context] Rate limited, trying next API key (attempt 1/4)...
```

---

## ✅ Success Indicators

1. **Server starts** without errors
2. **Ping responds** with "pong"
3. **Tools list** shows 2 tools: `resolve-library-id` and `query-docs`
4. **LM Studio connects** and can query documentation
5. **API keys rotate** when one hits limit

---

## 🚀 Next: Deploy to Railway

Once local testing works:

```bash
railway login
railway init
railway up
```

Then set your custom domain: `mcp.m0x.in`

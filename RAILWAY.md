# Deploy to Railway - Quick Commands

## 🚀 Deploy in 3 Commands

```bash
# 1. Login
railway login

# 2. Initialize
railway init

# 3. Deploy
railway up
```

## 🔑 Add Your API Keys

```bash
railway variables set CONTEXT7_API_KEYS=ctx7sk-1c3904ab-8e09-4b47-8430-3e44f67a1286,ctx7sk-bc556ddd-73e7-436c-9925-ed418bed67db,ctx7sk-e2707737-1cf1-4ef6-9815-45016c230d13,ctx7sk-91515945-8812-4242-8762-4f2b86dd5d28
```

## 📡 Get Your Server URL

```bash
railway domain
```

## 🎯 Use with LM Studio

```json
{
  "mcpServers": {
    "m0x-context": {
      "url": "https://YOUR-URL.up.railway.app/mcp"
    }
  }
}
```

**Done!** 🎉

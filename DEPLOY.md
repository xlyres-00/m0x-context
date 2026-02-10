# 🚀 Deploy m0x-context to Railway

Super simple deployment guide - get your MCP server running in the cloud in 5 minutes!

## Quick Deploy (Easiest Way)

1. **Click here:** [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

2. **Add your API keys** in Railway dashboard:
   - Go to Variables tab
   - Add `CONTEXT7_API_KEYS` = `your,keys,here`

3. **Done!** Your server is live at `https://your-app.up.railway.app/mcp`

---

## Manual Deploy (5 Steps)

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway

```bash
railway login
```

### Step 3: Initialize Project

```bash
cd d:\code\ai\m0x-context7
railway init
```

When prompted:
- Select "Create a new project"
- Choose a project name (e.g., "m0x-context-mcp")

### Step 4: Add Your API Keys

```bash
railway variables set CONTEXT7_API_KEYS=ctx7sk-1c3904ab-8e09-4b47-8430-3e44f67a1286,ctx7sk-bc556ddd-73e7-436c-9925-ed418bed67db,ctx7sk-e2707737-1cf1-4ef6-9815-45016c230d13,ctx7sk-91515945-8812-4242-8762-4f2b86dd5d28
```

### Step 5: Deploy!

```bash
railway up
```

Wait 2-3 minutes for build to complete.

### Step 6: Get Your URL

```bash
railway domain
```

Copy the URL (e.g., `https://m0x-context-production.up.railway.app`)

---

## Connect from LM Studio

1. Open LM Studio
2. Go to MCP settings
3. Add this configuration:

```json
{
  "mcpServers": {
    "m0x-context": {
      "url": "https://YOUR-RAILWAY-URL.up.railway.app/mcp"
    }
  }
}
```

4. Restart LM Studio
5. Test: "How do I use React hooks? use m0x-context"

---

## Troubleshooting

**Build failed?**
```bash
railway logs
```

**Want to update?**
```bash
git push
railway up
```

**Check if it's running:**
```bash
curl https://your-app.up.railway.app/ping
```

Should return: `pong`

---

**That's it!** Your m0x-context server is now live 24/7 on Railway! 🎉

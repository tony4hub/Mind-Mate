# 🚀 Quick Deploy to Vercel

## Method 1: One-Click Deploy (Easiest)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tony4hub/Mind-Mate&env=GROQ_API_KEY,AI_PROVIDER&envDescription=Add%20your%20Groq%20API%20key&envLink=https://console.groq.com/keys)

## Method 2: Manual Deploy

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy
```bash
# In your mindmate-chatbot folder
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name? mindmate-chatbot
# - Directory? ./
# - Override settings? N
```

### Step 3: Add Environment Variables
```bash
vercel env add GROQ_API_KEY
# Paste your Groq API key when prompted

vercel env add AI_PROVIDER
# Type: groq
```

### Step 4: Redeploy
```bash
vercel --prod
```

## Your website is now live! 🎉

You'll get a URL like: `https://mindmate-chatbot-abc123.vercel.app`

## Custom Domain (Optional)

1. Go to Vercel dashboard
2. Project Settings → Domains
3. Add your custom domain
4. Follow DNS setup instructions

## Automatic Deployments

Once connected to GitHub:
- Every push to `main` branch = automatic deployment
- Pull requests get preview URLs
- Zero downtime deployments
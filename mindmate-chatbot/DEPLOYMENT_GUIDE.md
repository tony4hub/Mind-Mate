# 🌐 Deploy MindMate as a Website

## Option 1: Vercel (Recommended - FREE)

### Why Vercel?
- ✅ **FREE** hosting for personal projects
- ✅ **Perfect for Next.js** (made by the same team)
- ✅ **Automatic deployments** from GitHub
- ✅ **Custom domains** supported
- ✅ **Environment variables** built-in
- ✅ **Global CDN** for fast loading

### Steps:

1. **Push to GitHub**:
   ```bash
   # In your mindmate-chatbot folder
   git init
   git add .
   git commit -m "Initial commit"
   
   # Create repo on GitHub, then:
   git remote add origin https://github.com/yourusername/mindmate-chatbot.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to https://vercel.com
   - Sign up with GitHub
   - Click "New Project"
   - Import your `mindmate-chatbot` repository
   - Click "Deploy"

3. **Add Environment Variables**:
   - In Vercel dashboard → Settings → Environment Variables
   - Add: `GROQ_API_KEY` = `your_groq_key_here`
   - Add: `AI_PROVIDER` = `groq`
   - Redeploy

4. **Your website is live!** 🎉
   - URL: `https://mindmate-chatbot-yourusername.vercel.app`
   - Custom domain available in settings

---

## Option 2: Netlify (FREE Alternative)

### Steps:
1. **Build the app**:
   ```bash
   npm run build
   npm run export  # We need to add this script
   ```

2. **Deploy**:
   - Go to https://netlify.com
   - Drag & drop the `out` folder
   - Add environment variables in Site Settings

---

## Option 3: Railway (FREE with limits)

### Steps:
1. **Connect GitHub**:
   - Go to https://railway.app
   - Connect your GitHub repo
   - Auto-deploys on push

2. **Add environment variables** in Railway dashboard

---

## Option 4: Render (FREE tier)

### Steps:
1. **Connect GitHub**:
   - Go to https://render.com
   - Create new "Web Service"
   - Connect your repo

2. **Configure**:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Add environment variables

---

## 🔧 Prepare for Deployment

Let me add the necessary configuration files:
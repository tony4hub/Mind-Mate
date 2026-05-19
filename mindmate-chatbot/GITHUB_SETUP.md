# 📁 Push to GitHub

## Step 1: Initialize Git
```bash
# In your mindmate-chatbot folder
git init
git add .
git commit -m "Initial MindMate chatbot with Groq AI"
```

## Step 2: Create GitHub Repository

1. Go to https://github.com
2. Click "New repository"
3. Name: `mindmate-chatbot`
4. Description: `AI-powered mental health chatbot with Groq integration`
5. Make it **Public** (required for free Vercel hosting)
6. Don't initialize with README (we already have files)
7. Click "Create repository"

## Step 3: Connect and Push
```bash
# Replace 'yourusername' with your GitHub username
git remote add origin https://github.com/yourusername/mindmate-chatbot.git
git branch -M main
git push -u origin main
```

## Step 4: Verify Upload

Go to your GitHub repo URL and make sure you see:
- All your files uploaded
- `.env.local` should NOT be there (it's in .gitignore)
- README.md, package.json, etc. should be visible

## ⚠️ Important Security Note

**Never commit your API keys!**
- `.env.local` is automatically ignored by git
- Your Groq API key stays private
- You'll add it separately in Vercel dashboard

## Next: Deploy to Vercel

Once your code is on GitHub, you can deploy to Vercel in 2 minutes!
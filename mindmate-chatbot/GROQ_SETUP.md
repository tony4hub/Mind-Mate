# 🚀 Quick Groq Setup Guide

## Get Your FREE Groq API Key

1. **Go to Groq Console**: https://console.groq.com/keys
2. **Sign up/Login** with your email or GitHub
3. **Create API Key**: Click "Create API Key"
4. **Copy the key** (starts with `gsk_...`)

## Add API Key to MindMate

1. **Open** `mindmate-chatbot/.env.local`
2. **Replace** `your_groq_api_key_here` with your actual key:
   ```bash
   GROQ_API_KEY=gsk_your_actual_key_here
   ```
3. **Save** the file

## Test It!

1. **Restart** the dev server:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Open** http://localhost:3000

3. **Send a message** like:
   - "I'm feeling anxious"
   - "Help me with stress"
   - "I need someone to talk to"

4. **You should see** intelligent AI responses powered by Groq's Llama 3 model!

## Available Models

- `llama3-8b-8192` (default) - Fast and smart
- `llama3-70b-8192` - More powerful but slower
- `mixtral-8x7b-32768` - Good balance

## Why Groq?

- ✅ **FREE** - No credit card required
- ✅ **FAST** - Responses in 1-2 seconds
- ✅ **SMART** - Llama 3 is very capable
- ✅ **RELIABLE** - Good uptime and availability

## Troubleshooting

**"Groq API key not configured"**
- Make sure you added the key to `.env.local`
- Restart the dev server after adding the key

**"Rate limit exceeded"**
- Groq has generous free limits
- Wait a minute and try again

**Slow responses**
- Try switching to `llama3-8b-8192` model
- Check your internet connection

## Switch Providers

To use OpenAI instead:
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk_your_openai_key
```

To use Gemini instead:
```bash
AI_PROVIDER=gemini
GOOGLE_GEMINI_API_KEY=your_gemini_key
```
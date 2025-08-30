# 🚀 HealthAI Quick Start Guide

Get your AI-powered symptom analysis platform running in minutes with cloud-based AI APIs!

## ⚡ Quick Setup (2 minutes)

### 1. Get an AI API Key
Choose one of these providers:
- **OpenAI** (Recommended): [platform.openai.com](https://platform.openai.com)
- **Anthropic**: [console.anthropic.com](https://console.anthropic.com)
- **Google**: [makersuite.google.com](https://makersuite.google.com)

### 2. Configure the App
```bash
# Copy environment template
cp env.example .env

# Edit .env and add your API key
VITE_OPENAI_API_KEY=your_key_here
```

### 3. Start HealthAI
```bash
npm install
npm run dev
```

### 4. Open Your Browser
Navigate to `http://localhost:5173`

## 🔧 Alternative Setup Methods

### OpenAI (Easiest)
1. Visit [platform.openai.com](https://platform.openai.com)
2. Sign up and get API key
3. Add to `.env`: `VITE_OPENAI_API_KEY=sk-...`
4. Restart app

### Anthropic (Claude)
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up and get API key
3. Add to `.env`: `VITE_ANTHROPIC_API_KEY=sk-ant-...`
4. Restart app

### Google (Gemini)
1. Visit [makersuite.google.com](https://makersuite.google.com)
2. Sign up and get API key
3. Add to `.env`: `VITE_GOOGLE_API_KEY=AIza...`
4. Restart app

## 🧪 Test Your Setup

1. **Check AI Service Status**: Look for the green "AI Service Available" indicator on the dashboard
2. **Start Assessment**: Click "New Assessment" and describe symptoms
3. **Verify AI Response**: You should see AI-generated analysis and recommendations

## 🚨 Troubleshooting

### AI Service Unavailable?
- Check your API key in `.env` file
- Verify API key is valid and has credits
- Check API provider status
- Restart the application after adding keys

### Slow Responses?
- Check your internet connection
- Try a different AI provider
- Check API provider response times
- Adjust timeout settings

### Build Errors?
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (requires 18+)
- Verify environment variable syntax

## 📱 What You Can Do Now

✅ **AI-Powered Symptom Analysis**: Get intelligent health guidance  
✅ **Emergency Detection**: Automatic critical symptom identification  
✅ **Risk Assessment**: 0-100 risk scoring with recommendations  
✅ **Follow-up Questions**: AI-generated questions for better understanding  
✅ **Session History**: Track all your assessments  
✅ **Medical Safety**: Built-in disclaimers and conservative analysis  

## 🔒 Privacy Features

- **Cloud AI Processing**: Uses established, secure AI APIs
- **No Local Data Storage**: Symptom data processed by trusted providers
- **HIPAA Compliant**: Built with medical privacy standards
- **Secure Communication**: Encrypted data transmission

## 💰 Cost Information

- **OpenAI GPT-3.5**: ~$0.002 per 1K tokens (very affordable)
- **Anthropic Claude**: ~$0.25 per 1M tokens (very cheap)
- **Google Gemini**: ~$0.50 per 1M tokens (very cheap)

*Typical symptom analysis: 100-500 tokens per session*

## 🆘 Need Help?

- Check the full [README.md](README.md)
- Review [troubleshooting section](README.md#troubleshooting)
- Visit API provider documentation

---

**Ready to revolutionize your health guidance? Start your first AI-powered assessment now! 🏥✨**

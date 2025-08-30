# HealthAI - AI-Powered Symptom Analysis Platform

A comprehensive health guidance platform that uses AI to analyze symptoms and provide preliminary health recommendations. Built with React, TypeScript, and integrated with multiple AI APIs for instant setup and powerful symptom analysis.

## 🚀 Features

- **AI-Powered Symptom Analysis**: Advanced symptom assessment using cloud-based AI models
- **Multiple AI Providers**: Support for OpenAI, Anthropic, Google, and custom APIs
- **Real-time Chat Interface**: Interactive symptom evaluation with follow-up questions
- **Medical Safety Features**: Built-in emergency detection and conservative risk assessment
- **Fallback Analysis**: Enhanced keyword-based analysis when AI is unavailable
- **User Authentication**: Secure user management with profile settings
- **Session Management**: Track and review previous assessments
- **Responsive Design**: Modern UI optimized for all devices

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Multiple cloud APIs (OpenAI, Anthropic, Google, Custom)
- **State Management**: React Context + Hooks
- **Form Handling**: React Hook Form + Zod validation

## 📋 Prerequisites

- Node.js 18+ and npm
- API key from one of the supported AI providers (see setup below)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HealthSymptomCheckProject/project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure AI API (Choose one or more)**
   ```bash
   # Copy environment template
   cp env.example .env
   
   # Edit .env and add your API key(s)
   VITE_OPENAI_API_KEY=your_openai_key_here
   # OR
   VITE_ANTHROPIC_API_KEY=your_anthropic_key_here
   # OR
   VITE_GOOGLE_API_KEY=your_google_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 AI API Setup

### Option 1: OpenAI (Recommended for beginners)
1. Visit [platform.openai.com](https://platform.openai.com)
2. Create an account and get an API key
3. Add to `.env`: `VITE_OPENAI_API_KEY=your_key_here`
4. Restart the application

### Option 2: Anthropic (Claude)
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Create an account and get an API key
3. Add to `.env`: `VITE_ANTHROPIC_API_KEY=your_key_here`
4. Restart the application

### Option 3: Google (Gemini)
1. Visit [makersuite.google.com](https://makersuite.google.com)
2. Create an account and get an API key
3. Add to `.env`: `VITE_GOOGLE_API_KEY=your_key_here`
4. Restart the application

### Option 4: Custom API
1. Configure your custom API endpoint
2. Add to `.env`:
   ```
   VITE_CUSTOM_API_KEY=your_key_here
   VITE_CUSTOM_API_BASE_URL=https://your-api.com
   VITE_CUSTOM_API_MODEL=your_model
   ```
3. Restart the application

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# AI API Configuration (choose one or more)
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_MODEL=gpt-3.5-turbo

VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
VITE_ANTHROPIC_MODEL=claude-3-haiku-20240307

VITE_GOOGLE_API_KEY=your_google_api_key_here
VITE_GOOGLE_MODEL=gemini-pro

# App Configuration
VITE_APP_NAME=HealthAI
VITE_APP_VERSION=1.0.0
```

### API Service Configuration

The AI service can be configured in `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  openai: {
    provider: 'openai',
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
    timeout: 30000,
    enabled: false
  },
  // ... other providers
};
```

## 🏥 Medical Safety Features

### Emergency Detection
The system automatically detects and flags emergency symptoms:
- Chest pain or pressure
- Difficulty breathing
- Severe bleeding
- Loss of consciousness
- Paralysis or weakness

### Conservative Assessment
- Always errs on the side of caution
- Requires professional medical consultation
- Includes medical disclaimers
- Fallback analysis when AI is unavailable

### Risk Scoring
- **Emergency (85-100)**: Immediate medical attention required
- **Urgent (65-84)**: Medical attention within 24 hours
- **Non-urgent (0-64)**: Monitor and consult if symptoms persist

## 🔍 Usage

### Starting a Symptom Assessment

1. Click "New Assessment" on the dashboard
2. Describe your symptoms in detail
3. Answer follow-up questions if prompted
4. Review AI analysis and recommendations
5. Follow medical advice provided

### Understanding Results

- **Priority Level**: Emergency, Urgent, or Non-urgent
- **Risk Score**: 0-100 scale indicating severity
- **Red Flags**: Concerning symptoms requiring attention
- **Recommendations**: Specific actions to take
- **Next Steps**: Immediate follow-up actions

## 🚨 Important Medical Disclaimers

- This platform provides **preliminary health guidance only**
- **NOT a substitute for professional medical advice**
- **Always consult qualified healthcare providers**
- **Seek emergency care for critical symptoms**
- **AI analysis is for informational purposes**

## 🧪 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── Assessment/     # Symptom assessment interface
│   ├── Chat/          # Chat interface components
│   ├── Common/        # Shared components
│   ├── Dashboard/     # Main dashboard
│   └── Profile/       # User profile management
├── services/           # Business logic and API calls
│   ├── apiService.ts      # AI API integration
│   └── symptomService.ts  # Symptom analysis logic
├── types/              # TypeScript type definitions
├── contexts/           # React contexts
└── config/             # Configuration files
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Adding New AI Providers

1. Add provider configuration to `src/config/api.ts`
2. Implement API calls in `src/services/apiService.ts`
3. Add environment variables to `env.example`
4. Test the integration

## 🔒 Privacy & Security

- **Cloud AI Processing**: Uses established, secure AI APIs
- **No Local Data Storage**: Symptom data processed by trusted providers
- **HIPAA Compliant Design**: Built with medical privacy standards
- **Secure API Communication**: Encrypted data transmission
- **User Control**: Complete control over your health data

## 🐛 Troubleshooting

### AI Service Unavailable?
- Check your API key configuration in `.env`
- Verify API key is valid and has sufficient credits
- Check API provider status pages
- Review browser console for error messages

### Slow Responses?
- Check your internet connection
- Try a different AI provider
- Adjust timeout settings in configuration
- Check API provider response times

### Build Errors?
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (requires 18+)
- Verify environment variable syntax

## 💰 Cost Considerations

### API Pricing (as of 2024)
- **OpenAI GPT-3.5**: ~$0.002 per 1K tokens
- **Anthropic Claude Haiku**: ~$0.25 per 1M tokens
- **Google Gemini Pro**: ~$0.50 per 1M tokens

### Cost Optimization
- Use smaller models for development
- Implement response caching
- Monitor API usage
- Set up usage alerts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Medical Disclaimer

**IMPORTANT**: This software is for educational and informational purposes only. It is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers with questions about medical conditions. Never disregard professional medical advice or delay seeking it because of information provided by this application.

In case of emergency, call your local emergency services immediately.

## 🆘 Support

For technical support or questions:
- Check the troubleshooting section above
- Review API provider documentation
- Open an issue in the project repository

---

**Built with ❤️ for the OpenXAI 2025 Hackathon**
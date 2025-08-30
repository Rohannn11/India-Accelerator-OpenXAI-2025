# HealthAI - AI-Powered Symptom Checker Platform

A comprehensive, HIPAA-compliant health guidance platform that leverages Ollama's AI capabilities for intelligent symptom assessment and medical triage.

## 🏥 Features

### Core Functionality
- **Intelligent Triage System**: Three-tier priority classification (Emergency, Urgent, Non-Urgent)
- **AI-Powered Assessment**: Natural language symptom analysis using Ollama
- **Risk Scoring**: Dynamic 0-100 risk assessment with contextual factors
- **Red-Flag Detection**: Immediate identification of critical symptoms
- **Conversational Interface**: WhatsApp-style chat experience

### Safety & Compliance
- **Medical Disclaimers**: Prominent safety notices at every interaction
- **Fail-Safe Defaults**: Conservative recommendations when AI confidence is low
- **Explainable AI**: Clear rationales for all medical assessments
- **HIPAA Compliance**: Privacy-by-design architecture
- **Emergency Protocols**: Immediate escalation for critical symptoms

### User Management
- **Secure Profiles**: Encrypted medical history and personal data
- **Authentication**: Email/password with planned OAuth integration
- **Privacy Controls**: Data export and deletion capabilities
- **Medical History**: Comprehensive health background tracking

### Reporting & Analytics
- **PDF Generation**: Professional reports for healthcare providers
- **Session History**: Complete assessment tracking
- **Confidence Metrics**: Transparency in AI decision-making
- **Health Trends**: Pattern analysis over time

## 🚀 Technology Stack

### Frontend
- **React** with TypeScript for type-safe development
- **Tailwind CSS** for responsive, medical-grade design
- **Lucide React** for consistent iconography
- **React Router** for navigation management

### Backend Integration
- **Ollama Service**: Local AI model integration
- **Supabase**: Authentication and database management
- **Axios**: HTTP client for API communications

### AI & Machine Learning
- **Ollama Models**: Support for llama2, medllama, and custom models
- **Low Temperature**: Consistent, conservative medical responses
- **Confidence Scoring**: Transparency in AI assessments
- **Multi-Modal Analysis**: Text and structured data processing

## 📋 Prerequisites

### Required Software
1. **Node.js** (v18 or higher)
2. **Ollama** installed and running locally
3. **Supabase** project setup

### Ollama Setup
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull medical models
ollama pull llama2
ollama pull medllama2  # If available

# Start Ollama service
ollama serve
```

### Database Setup
Before using the application, set up your Supabase database by clicking the "Connect to Supabase" button in the top right corner of the interface.

## 🔧 Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:
Create a `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Start the development server**:
```bash
npm run dev
```

## 🏗️ Database Schema

The application requires the following database tables:

### Users Table
- Personal information and medical history
- Secure authentication data
- Privacy preferences

### Symptom Sessions
- Assessment tracking and results
- AI analysis and recommendations
- Priority and risk scoring

### Chat Messages
- Conversational history
- Message types and confidence scores
- Timestamp tracking

## ⚕️ Medical Safety Guidelines

### AI Decision Making
- **Conservative Approach**: Always err on the side of caution
- **Confidence Thresholds**: Automatic escalation when AI confidence < 70%
- **Red-Flag Detection**: Immediate emergency alerts for critical symptoms
- **Transparent Reasoning**: Clear explanations for all assessments

### Emergency Protocols
- **Immediate Alerts**: Visual and audio warnings for critical symptoms
- **Direct Emergency Access**: One-click 911 calling functionality
- **Escalation Pathways**: Clear guidance for different urgency levels

### Data Privacy
- **Encryption**: All health data encrypted at rest and in transit
- **Minimal Data**: Only collect essential health information
- **User Control**: Complete data export and deletion capabilities
- **Audit Trails**: Comprehensive logging for compliance

## 🔒 Security Features

- **Authentication**: Secure email/password with session management
- **Data Encryption**: End-to-end encryption for all health data
- **HIPAA Compliance**: Privacy-by-design architecture
- **Audit Logging**: Comprehensive activity tracking
- **Access Controls**: Role-based permissions and data access

## 📱 User Interface

### Design Principles
- **Medical-Grade Aesthetics**: Professional, trustworthy appearance
- **Accessibility First**: WCAG 2.1 AA compliance
- **Mobile-First**: Responsive design for all devices
- **Emergency UX**: Clear visual hierarchy for urgent situations

### Key Components
- **Chat Interface**: Intuitive symptom reporting
- **Confidence Meters**: Transparent AI assessment quality
- **Emergency Alerts**: Prominent critical symptom warnings
- **Report Generation**: Professional PDF outputs

## 🧪 Testing & Quality Assurance

### Medical Validation
- **Clinical Review**: All AI responses validated against medical guidelines
- **Edge Case Testing**: Comprehensive testing of unusual symptom combinations
- **Safety Protocols**: Verification of emergency detection accuracy

### Technical Testing
- **Unit Tests**: Individual component and service testing
- **Integration Tests**: Full workflow testing with AI models
- **Performance Tests**: Response time and scalability validation
- **Security Tests**: Penetration testing and vulnerability assessment

## 🚨 Important Legal Notice

This platform is designed for educational and informational purposes. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Users must always consult qualified healthcare providers for medical concerns.

**Emergency Disclaimer**: In case of medical emergencies, call 911 immediately. Do not rely solely on this platform for emergency medical situations.

## 📞 Support & Compliance

For technical support, medical concerns, or compliance inquiries:
- Technical Issues: [support@healthai.com]
- Medical Questions: Consult your healthcare provider
- Privacy Concerns: [privacy@healthai.com]
- Compliance: [compliance@healthai.com]

---

**Built with ❤️ for better healthcare access and AI-powered medical guidance.**
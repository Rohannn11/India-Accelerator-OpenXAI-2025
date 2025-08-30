#!/bin/bash

echo "========================================"
echo "HealthAI - API Setup Script"
echo "========================================"
echo

echo "Setting up HealthAI with AI APIs..."
echo

echo "Step 1: Copy environment template"
if [ ! -f .env ]; then
    cp env.example .env
    echo "✓ Created .env file"
else
    echo "✓ .env file already exists"
fi

echo
echo "Step 2: Get your AI API key"
echo
echo "Choose one of these providers:"
echo "1. OpenAI (Recommended): https://platform.openai.com"
echo "2. Anthropic: https://console.anthropic.com"
echo "3. Google: https://makersuite.google.com"
echo

echo "Step 3: Edit .env file"
echo "Open .env in your text editor and add your API key:"
echo
echo "For OpenAI:"
echo "  VITE_OPENAI_API_KEY=your_key_here"
echo
echo "For Anthropic:"
echo "  VITE_ANTHROPIC_API_KEY=your_key_here"
echo
echo "For Google:"
echo "  VITE_GOOGLE_API_KEY=your_key_here"
echo

echo "Step 4: Install dependencies"
echo "Running: npm install"
npm install

if [ $? -eq 0 ]; then
    echo
    echo "========================================"
    echo "Setup completed successfully!"
    echo "========================================"
    echo
    echo "Next steps:"
    echo "1. Edit .env and add your API key"
    echo "2. Start the app: npm run dev"
    echo "3. Open http://localhost:5173"
    echo
    echo "Note: You must restart the app after adding API keys"
    echo
else
    echo
    echo "========================================"
    echo "Setup failed!"
    echo "========================================"
    echo
    echo "There was an error installing dependencies."
    echo "Please check your Node.js installation and try again."
    echo
    exit 1
fi

#!/bin/bash

echo "========================================"
echo "HealthAI - Ollama Setup Script"
echo "========================================"
echo

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "Ollama is not installed."
    echo
    echo "Please install Ollama first:"
    echo "Visit: https://ollama.ai"
    echo "Or run: curl -fsSL https://ollama.ai/install.sh | sh"
    echo
    exit 1
fi

echo "Ollama is installed! Version:"
ollama --version
echo

# Check if Ollama is already running
if pgrep -f "ollama serve" > /dev/null; then
    echo "Ollama service is already running."
else
    echo "Starting Ollama service..."
    nohup ollama serve > /dev/null 2>&1 &
    echo "Waiting for Ollama to start..."
    sleep 5
fi

# Check if service is responding
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "Ollama service is running and responding."
else
    echo "Warning: Ollama service may not be fully started yet."
    echo "Please wait a moment and try again."
fi

echo
echo "Downloading recommended model (llama3.2:3b)..."
echo "This may take several minutes depending on your internet connection..."
ollama pull llama3.2:3b

if [ $? -eq 0 ]; then
    echo
    echo "========================================"
    echo "Setup completed successfully!"
    echo "========================================"
    echo
    echo "Ollama is now running with llama3.2:3b model."
    echo "You can now start the HealthAI application."
    echo
    echo "To start the app, run: npm run dev"
    echo
    echo "To keep Ollama running in the background:"
    echo "  ollama serve &"
    echo
    echo "To stop Ollama:"
    echo "  pkill -f 'ollama serve'"
    echo
else
    echo
    echo "========================================"
    echo "Setup failed!"
    echo "========================================"
    echo
    echo "There was an error downloading the model."
    echo "Please check your internet connection and try again."
    echo
    exit 1
fi

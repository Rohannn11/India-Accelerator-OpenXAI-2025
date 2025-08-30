@echo off
echo ========================================
echo HealthAI - Ollama Setup Script
echo ========================================
echo.

echo Checking if Ollama is installed...
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Ollama is not installed.
    echo.
    echo Please install Ollama from: https://ollama.ai
    echo Download the Windows installer and run it.
    echo.
    pause
    exit /b 1
)

echo Ollama is installed! Version:
ollama --version
echo.

echo Starting Ollama service...
start "Ollama Service" ollama serve
echo.
echo Waiting for Ollama to start...
timeout /t 5 /nobreak >nul

echo.
echo Downloading recommended model (llama3.2:3b)...
echo This may take several minutes depending on your internet connection...
ollama pull llama3.2:3b

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Setup completed successfully!
    echo ========================================
    echo.
    echo Ollama is now running with llama3.2:3b model.
    echo You can now start the HealthAI application.
    echo.
    echo To start the app, run: npm run dev
    echo.
    echo Keep this terminal open to keep Ollama running.
    echo.
) else (
    echo.
    echo ========================================
    echo Setup failed!
    echo ========================================
    echo.
    echo There was an error downloading the model.
    echo Please check your internet connection and try again.
    echo.
)

pause

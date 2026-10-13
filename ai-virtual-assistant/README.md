# Jarvis — AI Virtual Assistant

A beginner-friendly Python voice assistant prototype that listens for commands, speaks responses, tells the time/date, opens common websites, and performs a simple web search.

## Features
- Speech input using the microphone
- Text-to-speech responses
- Time and date commands
- Open YouTube, Google, Gmail, and GitHub
- Search the web from a spoken or typed query
- Typed-input fallback for environments without a microphone

## Requirements
- Python 3.10+
- A working microphone for voice mode
- Internet connection for speech recognition and web searches

## Run locally
```bash
cd ai-virtual-assistant
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

If microphone or speech-recognition setup fails, choose typed mode when prompted.

## Limitations
This is a student prototype, not a continuously running or fully autonomous AI. Speech recognition and search may use online services. It does not access private accounts, read messages, or send emails.

## Future improvements
- Add a local LLM through Ollama
- Add configurable skills and unit tests
- Add wake-word detection and a safer permission system

## Tech stack
Python, SpeechRecognition, pyttsx3, PyAudio, webbrowser, datetime

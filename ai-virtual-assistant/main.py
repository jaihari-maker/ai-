"""Jarvis: a simple voice / typed-command assistant for student demos."""
from datetime import datetime
import urllib.parse
import webbrowser

try:
    import pyttsx3
except ImportError:
    pyttsx3 = None

try:
    import speech_recognition as sr
except ImportError:
    sr = None


def speak(message: str) -> None:
    print(f"Jarvis: {message}")
    if pyttsx3:
        try:
            engine = pyttsx3.init()
            engine.say(message)
            engine.runAndWait()
        except Exception:
            pass


def listen_voice() -> str:
    if sr is None:
        speak("Voice input is not installed. Please use typed mode.")
        return input("You: ").strip().lower()
    recognizer = sr.Recognizer()
    try:
        with sr.Microphone() as source:
            print("Listening... speak now.")
            recognizer.adjust_for_ambient_noise(source, duration=0.4)
            audio = recognizer.listen(source, timeout=5, phrase_time_limit=8)
        return recognizer.recognize_google(audio).lower()
    except Exception as exc:
        print(f"Voice input unavailable ({exc}).")
        return input("Type your command instead: ").strip().lower()


def handle_command(command: str) -> bool:
    """Run one allow-listed command. Return False to stop the assistant."""
    command = command.strip().lower()
    if not command:
        speak("I didn't catch a command. Please try again.")
    elif command in {"exit", "quit", "stop", "goodbye"}:
        speak("Goodbye! Have a productive day.")
        return False
    elif "time" in command:
        speak(f"The time is {datetime.now().strftime('%I:%M %p')}.")
    elif "date" in command or "today" in command:
        speak(f"Today is {datetime.now().strftime('%A, %d %B %Y')}.")
    elif "open youtube" in command:
        webbrowser.open("https://www.youtube.com")
        speak("Opening YouTube.")
    elif "open google" in command:
        webbrowser.open("https://www.google.com")
        speak("Opening Google.")
    elif "open gmail" in command:
        webbrowser.open("https://mail.google.com")
        speak("Opening Gmail in your browser.")
    elif "open github" in command:
        webbrowser.open("https://github.com")
        speak("Opening GitHub.")
    elif command.startswith("search "):
        query = command.removeprefix("search ").strip()
        if query:
            webbrowser.open("https://www.google.com/search?q=" + urllib.parse.quote_plus(query))
            speak(f"Searching the web for {query}.")
        else:
            speak("Please say what you want to search for.")
    elif command in {"help", "commands"}:
        speak("You can ask for the time or date, say open YouTube, Google, Gmail, or GitHub, or say search followed by a topic. Say exit to quit.")
    else:
        speak("I don't have that skill yet. Say help to hear the available commands.")
    return True


def main() -> None:
    print("\n=== JARVIS: AI Virtual Assistant ===")
    print("Choose input mode: [v]oice or [t]yped")
    mode = input("Mode (v/t): ").strip().lower()
    voice_mode = mode == "v"
    speak("Hello! I am Jarvis, your virtual assistant. Say help to get started.")
    while True:
        command = listen_voice() if voice_mode else input("You: ")
        if not handle_command(command):
            break


if __name__ == "__main__":
    main()

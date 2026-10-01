from datetime import datetime
from typing import Optional

COMMAND_RESPONSES = {
    "help": "You can ask AK to answer questions, tell the current time, or use voice input/output controls.",
    "commands": "Try: time, date, help, who are you, say hello, model info.",
    "who are you": "I am AK, your local offline assistant.",
    "your name": "My name is AK.",
    "model info": "AK can use local engines like llama_cpp, gpt4all, or transformers when a model path is configured.",
}


def run_command(prompt: str) -> Optional[str]:
    normalized = prompt.strip().lower()
    if not normalized:
        return None

    if normalized in COMMAND_RESPONSES:
        return COMMAND_RESPONSES[normalized]

    if normalized.startswith("say "):
        return prompt[4:].strip() or "I didn't hear anything to say."

    if ("time" in normalized and "what" in normalized) or normalized == "time":
        return datetime.now().strftime("%H:%M:%S")

    if "date" in normalized:
        return datetime.now().strftime("%Y-%m-%d")

    if "who are you" in normalized or "your name" in normalized:
        return "I am AK, a local AI assistant running on your machine."

    if "model" in normalized and "info" in normalized:
        return "AK is configured to use a local model through llama_cpp, gpt4all, or transformers."

    return None

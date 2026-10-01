from typing import Iterable


def build_prompt_from_messages(messages: Iterable[dict]) -> str:
    prompt_parts = []
    for message in messages:
        role = message.get("role", "user")
        content = message.get("content", "")
        prompt_parts.append(f"{role}: {content}")
    return "\n".join(prompt_parts)

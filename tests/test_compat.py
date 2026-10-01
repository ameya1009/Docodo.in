from ak.compat import build_prompt_from_messages


def test_build_prompt_from_messages_standard():
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is Python?"},
    ]
    prompt = build_prompt_from_messages(messages)
    assert "system: You are a helpful assistant." in prompt
    assert "user: What is Python?" in prompt


def test_build_prompt_from_messages_empty():
    prompt = build_prompt_from_messages([])
    assert prompt == ""


def test_build_prompt_from_messages_default_role():
    messages = [{"content": "Hello"}]
    prompt = build_prompt_from_messages(messages)
    assert "user: Hello" in prompt

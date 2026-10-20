from unittest.mock import MagicMock
from fastapi.testclient import TestClient
from ak.server import app
from ak.config import AKConfig


def setup_mock_app():
    mock_model = MagicMock()
    mock_model.generate.return_value = "This is a mocked model response."

    app.state.config = AKConfig(engine="llama_cpp", model_path="models/test.gguf", port=8000)
    app.state.model = mock_model
    return TestClient(app), mock_model


def test_get_models():
    client, _ = setup_mock_app()
    resp = client.get("/api/models")
    assert resp.status_code == 200
    data = resp.json()
    assert data["engine"] == "llama_cpp"
    assert data["mode"] == "offline"


def test_api_chat_fast_command():
    client, mock_model = setup_mock_app()
    resp = client.post("/api/chat", json={"prompt": "help"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["command"] is True
    assert "You can ask AK" in data["response"]
    mock_model.generate.assert_not_called()


def test_api_chat_model_inference():
    client, mock_model = setup_mock_app()
    resp = client.post("/api/chat", json={"prompt": "Tell me a joke"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["command"] is False
    assert data["response"] == "This is a mocked model response."


def test_v1_completions_openai_format():
    client, _ = setup_mock_app()
    resp = client.post("/v1/completions", json={"prompt": "Hello OpenAI completion"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["object"] == "text_completion"
    assert len(data["choices"]) == 1
    assert data["choices"][0]["text"] == "This is a mocked model response."
    assert "usage" in data


def test_v1_chat_completions_openai_format():
    client, _ = setup_mock_app()
    resp = client.post(
        "/v1/chat/completions",
        json={"messages": [{"role": "user", "content": "What is AI?"}]},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["object"] == "chat.completion"
    assert len(data["choices"]) == 1
    assert data["choices"][0]["message"]["content"] == "This is a mocked model response."
    assert "usage" in data


def test_api_chat_proxy_when_model_is_none():
    import json
    import os
    from unittest.mock import patch

    app.state.config = AKConfig(engine="llama_cpp", model_path=None, port=8000)
    app.state.model = None
    client = TestClient(app)

    mock_resp = MagicMock()
    mock_resp.read.return_value = json.dumps({
        "id": "gen-123",
        "choices": [{"message": {"role": "assistant", "content": "Proxied response from OpenRouter"}}],
        "usage": {"prompt_tokens": 5, "completion_tokens": 5, "total_tokens": 10},
    }).encode("utf-8")
    mock_resp.__enter__.return_value = mock_resp

    with patch.dict(os.environ, {"OPENROUTER_API_KEY": "sk-or-test"}):
        with patch("urllib.request.urlopen", return_value=mock_resp) as mock_urlopen:
            resp = client.post("/api/chat", json={"prompt": "Explain quantum computing"})
            assert resp.status_code == 200
            data = resp.json()
            assert data["command"] is False
            assert data["response"] == "Proxied response from OpenRouter"
            mock_urlopen.assert_called_once()


def test_v1_chat_completions_proxy_when_model_is_none():
    import json
    import os
    from unittest.mock import patch

    app.state.config = AKConfig(engine="llama_cpp", model_path=None, port=8000)
    app.state.model = None
    client = TestClient(app)

    mock_resp = MagicMock()
    mock_resp.read.return_value = json.dumps({
        "id": "gen-456",
        "object": "chat.completion",
        "choices": [{"index": 0, "message": {"role": "assistant", "content": "OpenAI proxy completion"}, "finish_reason": "stop"}],
        "usage": {"prompt_tokens": 8, "completion_tokens": 4, "total_tokens": 12},
    }).encode("utf-8")
    mock_resp.__enter__.return_value = mock_resp

    with patch.dict(os.environ, {"OPENAI_API_KEY": "sk-proj-test"}):
        with patch("urllib.request.urlopen", return_value=mock_resp):
            resp = client.post("/v1/chat/completions", json={"messages": [{"role": "user", "content": "Hello via proxy"}]})
            assert resp.status_code == 200
            data = resp.json()
            assert data["choices"][0]["message"]["content"] == "OpenAI proxy completion"


def test_chat_when_model_none_and_no_keys_returns_503():
    import os
    from unittest.mock import patch

    app.state.config = AKConfig(engine="llama_cpp", model_path=None, port=8000)
    app.state.model = None
    client = TestClient(app)

    with patch.dict(os.environ, {}, clear=True):
        resp = client.post("/api/chat", json={"prompt": "Explain physics"})
        assert resp.status_code == 503
        assert "Model is not initialized" in resp.json()["detail"]


def test_v1_completions_proxy_when_model_is_none():
    import json
    import os
    from unittest.mock import patch

    app.state.config = AKConfig(engine="llama_cpp", model_path=None, port=8000)
    app.state.model = None
    client = TestClient(app)

    mock_resp = MagicMock()
    mock_resp.read.return_value = json.dumps({
        "id": "gen-789",
        "object": "chat.completion",
        "choices": [{"index": 0, "message": {"role": "assistant", "content": "Completion via proxy"}, "finish_reason": "stop"}],
        "usage": {"prompt_tokens": 4, "completion_tokens": 3, "total_tokens": 7},
    }).encode("utf-8")
    mock_resp.__enter__.return_value = mock_resp

    with patch.dict(os.environ, {"OPENROUTER_API_KEY": "sk-or-test", "OPENROUTER_BASE_URL": "https://openrouter.ai/api/v1"}):
        with patch("urllib.request.urlopen", return_value=mock_resp) as mock_urlopen:
            resp = client.post("/v1/completions", json={"prompt": "Write a haiku"})
            assert resp.status_code == 200
            data = resp.json()
            assert data["object"] == "text_completion"
            assert data["choices"][0]["text"] == "Completion via proxy"
            
            # Verify the URL used ended with /chat/completions even though base URL lacked it
            req_arg = mock_urlopen.call_args[0][0]
            assert req_arg.full_url == "https://openrouter.ai/api/v1/chat/completions"


def test_v1_chat_completions_with_rich_message_dicts():
    import json
    import os
    from unittest.mock import patch

    app.state.config = AKConfig(engine="llama_cpp", model_path=None, port=8000)
    app.state.model = None
    client = TestClient(app)

    mock_resp = MagicMock()
    mock_resp.read.return_value = json.dumps({
        "id": "gen-999",
        "object": "chat.completion",
        "choices": [{"index": 0, "message": {"role": "assistant", "content": "Rich message handled"}, "finish_reason": "stop"}],
        "usage": {"prompt_tokens": 10, "completion_tokens": 3, "total_tokens": 13},
    }).encode("utf-8")
    mock_resp.__enter__.return_value = mock_resp

    with patch.dict(os.environ, {"OPENAI_API_KEY": "sk-proj-test"}):
        with patch("urllib.request.urlopen", return_value=mock_resp):
            # Message with extra attributes and complex content
            messages = [
                {"role": "system", "content": "System prompt", "name": "system_bot"},
                {"role": "user", "content": "Hello with extra metadata", "meta": "test_meta"},
            ]
            resp = client.post("/v1/chat/completions", json={"messages": messages})
            assert resp.status_code == 200
            data = resp.json()
            assert data["choices"][0]["message"]["content"] == "Rich message handled"

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

import os
from unittest.mock import patch
from ak.config import AKConfig, DEFAULT_PORT, DEFAULT_HOST, DEFAULT_TEMPERATURE, DEFAULT_MAX_TOKENS


def test_config_defaults():
    config = AKConfig()
    assert config.host == DEFAULT_HOST
    assert config.port == DEFAULT_PORT
    assert config.temperature == DEFAULT_TEMPERATURE
    assert config.max_tokens == DEFAULT_MAX_TOKENS
    assert config.engine == "llama_cpp"
    assert config.model_path is None


def test_config_from_env():
    with patch.dict(
        os.environ,
        {
            "AK_PORT": "9000",
            "AK_HOST": "0.0.0.0",
            "AK_TEMPERATURE": "0.85",
            "AK_MAX_TOKENS": "2048",
            "AK_ENGINE": "gpt4all",
            "AK_THREADS": "4",
        },
    ):
        config = AKConfig.from_env()
        assert config.port == 9000
        assert config.host == "0.0.0.0"
        assert config.temperature == 0.85
        assert config.max_tokens == 2048
        assert config.engine == "gpt4all"
        assert config.threads == 4


def test_config_invalid_env_fallback():
    with patch.dict(
        os.environ,
        {
            "AK_PORT": "not-an-int",
            "AK_TEMPERATURE": "not-a-float",
            "AK_MAX_TOKENS": "bad",
            "AK_ENGINE": "invalid_engine_name",
        },
    ):
        config = AKConfig.from_env()
        assert config.port == DEFAULT_PORT
        assert config.temperature == DEFAULT_TEMPERATURE
        assert config.max_tokens == DEFAULT_MAX_TOKENS
        assert config.engine == "llama_cpp"


def test_config_rdp_port_collision():
    with patch.dict(os.environ, {"AK_PORT": "3389"}):
        config = AKConfig.from_env()
        assert config.port == DEFAULT_PORT == 8000

from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Literal

logger = logging.getLogger(__name__)

EngineType = Literal["llama_cpp", "gpt4all", "transformers"]

DEFAULT_PORT = 8000
DEFAULT_HOST = "127.0.0.1"
DEFAULT_TEMPERATURE = 0.7
DEFAULT_MAX_TOKENS = 1024
DEFAULT_ENGINE: EngineType = "llama_cpp"


class AKConfig:
    def __init__(
        self,
        engine: EngineType = DEFAULT_ENGINE,
        model_path: str | None = None,
        host: str = DEFAULT_HOST,
        port: int = DEFAULT_PORT,
        temperature: float = DEFAULT_TEMPERATURE,
        max_tokens: int = DEFAULT_MAX_TOKENS,
        threads: int | None = None,
    ):
        self.engine = engine
        self.model_path = Path(model_path) if model_path else None
        self.host = host
        self.port = port
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.threads = threads

    @staticmethod
    def _detect_model_path() -> str | None:
        search_root = Path(__file__).resolve().parent.parent
        candidate_dirs = [search_root / "models", search_root, search_root / "ak" / "models"]
        extensions = ["*.bin", "*.gguf", "*.safetensors", "*.pt", "*.pth"]
        for directory in candidate_dirs:
            if not directory.exists():
                continue
            for ext in extensions:
                for model_file in sorted(directory.glob(ext)):
                    return str(model_file)
        return None

    @classmethod
    def from_env(cls) -> AKConfig:
        model_path = os.getenv("AK_MODEL_PATH") or cls._detect_model_path()

        raw_port = os.getenv("AK_PORT")
        try:
            port = int(raw_port) if raw_port else DEFAULT_PORT
        except ValueError:
            logger.warning("Invalid AK_PORT %r, falling back to %d", raw_port, DEFAULT_PORT)
            port = DEFAULT_PORT

        raw_temp = os.getenv("AK_TEMPERATURE")
        try:
            temperature = float(raw_temp) if raw_temp else DEFAULT_TEMPERATURE
        except ValueError:
            logger.warning("Invalid AK_TEMPERATURE %r, falling back to %f", raw_temp, DEFAULT_TEMPERATURE)
            temperature = DEFAULT_TEMPERATURE

        raw_tokens = os.getenv("AK_MAX_TOKENS")
        try:
            max_tokens = int(raw_tokens) if raw_tokens else DEFAULT_MAX_TOKENS
        except ValueError:
            logger.warning("Invalid AK_MAX_TOKENS %r, falling back to %d", raw_tokens, DEFAULT_MAX_TOKENS)
            max_tokens = DEFAULT_MAX_TOKENS

        raw_threads = os.getenv("AK_THREADS")
        try:
            threads = int(raw_threads) if raw_threads and int(raw_threads) > 0 else None
        except ValueError:
            threads = None

        engine = os.getenv("AK_ENGINE", DEFAULT_ENGINE)
        if engine not in ("llama_cpp", "gpt4all", "transformers"):
            logger.warning("Unknown engine %r, defaulting to %r", engine, DEFAULT_ENGINE)
            engine = DEFAULT_ENGINE

        return cls(
            engine=engine,  # type: ignore[arg-type]
            model_path=model_path,
            host=os.getenv("AK_HOST", DEFAULT_HOST),
            port=port,
            temperature=temperature,
            max_tokens=max_tokens,
            threads=threads,
        )

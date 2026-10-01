from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)


class AKModel:
    def __init__(
        self,
        engine: str,
        model_path: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
        threads: int | None = None,
        context_size: int = 2048,
    ):
        self.engine = engine
        self.model_path = Path(model_path) if model_path else None
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.threads = threads or min(4, os.cpu_count() or 1)
        self.context_size = context_size
        self.model = self._load_model()

    def _load_model(self) -> Any:
        if self.engine == "llama_cpp":
            return self._load_llama_cpp()
        if self.engine == "gpt4all":
            return self._load_gpt4all()
        if self.engine == "transformers":
            return self._load_transformers()
        raise ValueError(f"Unsupported engine: {self.engine}")

    def _load_llama_cpp(self) -> Any:
        try:
            from llama_cpp import Llama
        except ImportError as exc:
            raise ImportError("llama-cpp-python is required for llama_cpp engine") from exc

        if not self.model_path:
            raise ValueError("AK_MODEL_PATH is required for llama_cpp")

        logger.info("Loading llama_cpp model from %s", self.model_path)
        return Llama(
            model_path=str(self.model_path),
            n_ctx=self.context_size,
            n_threads=self.threads,
            use_mlock=True,
        )

    def _load_gpt4all(self) -> Any:
        try:
            from gpt4all import GPT4All
        except ImportError as exc:
            raise ImportError("gpt4all is required for gpt4all engine") from exc

        if not self.model_path:
            raise ValueError("AK_MODEL_PATH is required for gpt4all")

        logger.info("Loading gpt4all model from %s", self.model_path)
        # GPT4All expects model_name to be the filename and model_path to be the directory
        return GPT4All(
            model_name=self.model_path.name,
            model_path=str(self.model_path.parent),
            allow_download=False,
        )

    def _load_transformers(self) -> Any:
        try:
            from transformers import pipeline
        except ImportError as exc:
            raise ImportError("transformers is required for transformers engine") from exc

        if not self.model_path:
            raise ValueError("AK_MODEL_PATH is required for transformers")

        logger.info("Loading transformers model from %s", self.model_path)
        return pipeline(
            "text-generation",
            model=str(self.model_path),
            max_length=self.max_tokens,
            temperature=self.temperature,
            device_map="auto",
            torch_dtype="auto",
        )

    def _estimate_complexity(self, prompt: str) -> dict[str, Any]:
        tokens = len(prompt.split())
        code_markers = [
            "def ", "class ", "import ", "return ", "for ", "while ", "if ", "else ",
            "{", "}", "<", ">", "function", "async ", "await ",
        ]
        analysis_keywords = [
            "analyze", "evaluate", "design", "optimize", "debug", "compare",
            "summarize", "explain", "architecture", "math", "code", "algorithm",
        ]

        code_bonus = sum(prompt.count(marker) for marker in code_markers)
        analysis_bonus = sum(prompt.lower().count(keyword) for keyword in analysis_keywords)
        score = tokens + code_bonus * 18 + analysis_bonus * 24

        if score < 120:
            return {
                "label": "simple",
                "max_tokens": min(self.max_tokens, max(128, tokens * 3)),
                "temperature": min(self.temperature, 0.6),
                "threads": min(self.threads, 2),
            }
        if score < 280:
            return {
                "label": "medium",
                "max_tokens": min(self.max_tokens, max(256, tokens * 4)),
                "temperature": min(self.temperature, 0.72),
                "threads": min(self.threads, 4),
            }
        return {
            "label": "complex",
            "max_tokens": min(self.max_tokens, max(512, tokens * 5)),
            "temperature": min(self.temperature, 0.85),
            "threads": min(self.threads, 8),
        }

    def generate(
        self,
        prompt: str,
        temperature: float | None = None,
        max_tokens: int | None = None,
    ) -> str:
        if self.engine == "llama_cpp":
            return self._generate_llama_cpp(prompt, temperature, max_tokens)
        if self.engine == "gpt4all":
            return self._generate_gpt4all(prompt, temperature, max_tokens)
        if self.engine == "transformers":
            return self._generate_transformers(prompt, temperature, max_tokens)
        raise ValueError(f"Unsupported engine: {self.engine}")

    def _generate_llama_cpp(
        self,
        prompt: str,
        temperature: float | None = None,
        max_tokens: int | None = None,
    ) -> str:
        policy = self._estimate_complexity(prompt)
        gen_tokens = max_tokens if max_tokens is not None else policy["max_tokens"]
        gen_temp = temperature if temperature is not None else policy["temperature"]

        # Handle both callable and create_completion on Llama instance
        if hasattr(self.model, "create_completion"):
            response = self.model.create_completion(
                prompt=prompt,
                max_tokens=gen_tokens,
                temperature=gen_temp,
                top_p=0.95,
                stream=False,
            )
        elif callable(self.model):
            response = self.model(
                prompt=prompt,
                max_tokens=gen_tokens,
                temperature=gen_temp,
                top_p=0.95,
                stream=False,
            )
        else:
            raise RuntimeError("Underlying llama_cpp model instance is not callable")

        # Response from llama-cpp-python is a dict: {"choices": [{"text": "...", ...}]}
        if isinstance(response, dict):
            choices = response.get("choices", [])
            if choices and isinstance(choices[0], dict):
                return choices[0].get("text", "").strip()
            return ""
        elif hasattr(response, "choices"):
            return response.choices[0].text.strip()
        return str(response).strip()

    def _generate_gpt4all(
        self,
        prompt: str,
        temperature: float | None = None,
        max_tokens: int | None = None,
    ) -> str:
        policy = self._estimate_complexity(prompt)
        gen_tokens = max_tokens if max_tokens is not None else policy["max_tokens"]
        gen_temp = temperature if temperature is not None else policy["temperature"]

        output = self.model.generate(
            prompt,
            max_tokens=gen_tokens,
            temp=gen_temp,
            streaming=False if hasattr(self.model, "generate") else None,
        )
        return str(output).strip()

    def _generate_transformers(
        self,
        prompt: str,
        temperature: float | None = None,
        max_tokens: int | None = None,
    ) -> str:
        policy = self._estimate_complexity(prompt)
        gen_tokens = max_tokens if max_tokens is not None else policy["max_tokens"]
        gen_temp = temperature if temperature is not None else policy["temperature"]

        outputs = self.model(
            prompt,
            max_new_tokens=gen_tokens,
            temperature=gen_temp,
            do_sample=True,
        )
        if isinstance(outputs, list) and len(outputs) > 0:
            text = outputs[0].get("generated_text", "")
            if text.startswith(prompt):
                return text[len(prompt):].strip()
            return text.strip()
        return ""

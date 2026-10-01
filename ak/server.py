import asyncio
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from .commands import run_command
from .compat import build_prompt_from_messages
from .config import AKConfig
from .model import AKModel


class ChatRequest(BaseModel):
    prompt: str | None = None
    messages: list[dict[str, str]] | None = None
    temperature: float | None = None
    max_tokens: int | None = None


class CompletionRequest(BaseModel):
    model: str | None = None
    prompt: str | list[str] | None = None
    max_tokens: int | None = None
    temperature: float | None = None
    n: int | None = 1


class ChatCompletionRequest(BaseModel):
    model: str | None = None
    messages: list[dict[str, str]]
    max_tokens: int | None = None
    temperature: float | None = None
    n: int | None = 1


@asynccontextmanager
async def lifespan(app: FastAPI):
    config = AKConfig.from_env()
    if config.model_path:
        app.state.config = config
        try:
            app.state.model = AKModel(
                engine=config.engine,
                model_path=str(config.model_path),
                temperature=config.temperature,
                max_tokens=config.max_tokens,
                threads=config.threads,
            )
        except Exception:
            app.state.model = None
    else:
        app.state.config = config
        app.state.model = None
    yield


app = FastAPI(title="AK Local AI", version="0.1.0", lifespan=lifespan)
base_dir = Path(__file__).resolve().parent
ui_dir = base_dir / "ui"
if ui_dir.exists():
    app.mount("/ui", StaticFiles(directory=str(ui_dir), html=True), name="ui")


@app.get("/", response_class=HTMLResponse)
async def get_index():
    index_file = ui_dir / "index.html"
    if not index_file.exists():
        raise HTTPException(status_code=404, detail="UI index.html not found")
    with open(index_file, "r", encoding="utf-8") as f:
        return HTMLResponse(f.read())


@app.get("/api/models")
async def list_models():
    cfg: AKConfig = getattr(app.state, "config", None) or AKConfig.from_env()
    return {
        "mode": "offline",
        "engine": cfg.engine,
        "model_path": str(cfg.model_path) if cfg.model_path else None,
        "temperature": cfg.temperature,
        "max_tokens": cfg.max_tokens,
        "threads": cfg.threads,
    }


@app.post("/api/chat")
async def chat(request: ChatRequest):
    # 1. Extract direct user query first
    raw_query = request.prompt
    if not raw_query and request.messages:
        # Check last user message for fast command matching
        for msg in reversed(request.messages):
            if msg.get("role") == "user":
                raw_query = msg.get("content", "")
                break
        if not raw_query and request.messages:
            raw_query = request.messages[-1].get("content", "")

    # 2. Check rule-based fast command routing before model check
    if raw_query:
        command_response = run_command(raw_query)
        if command_response is not None:
            return {"response": command_response, "command": True}

    # 3. Format full prompt for LLM inference
    prompt_text = request.prompt
    if not prompt_text and request.messages:
        prompt_text = build_prompt_from_messages(request.messages)
    if not prompt_text:
        raise HTTPException(status_code=400, detail="prompt or messages are required")

    # 4. Check model availability
    model: AKModel = getattr(app.state, "model", None)
    if not model:
        raise HTTPException(status_code=503, detail="Model is not initialized. Place a supported model in models/ or specify AK_MODEL_PATH.")

    try:
        # Offload synchronous model inference to thread pool to prevent blocking event loop
        text = await asyncio.to_thread(
            model.generate,
            prompt_text,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )
        return {"response": text, "command": False}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/v1/completions")
async def completions(request: CompletionRequest):
    prompt_value = request.prompt
    if isinstance(prompt_value, list):
        prompt_value = "\n".join(prompt_value)
    if prompt_value is None:
        raise HTTPException(status_code=400, detail="prompt is required")

    prompt_str = str(prompt_value)

    # Check fast commands before model check
    command_response = run_command(prompt_str)
    if command_response is not None:
        return {
            "id": "ak-command-1",
            "object": "text_completion",
            "choices": [{"text": command_response, "index": 0, "finish_reason": "stop"}],
            "usage": {
                "prompt_tokens": len(prompt_str.split()),
                "completion_tokens": len(command_response.split()),
                "total_tokens": len(prompt_str.split()) + len(command_response.split()),
            },
        }

    model: AKModel = getattr(app.state, "model", None)
    if not model:
        raise HTTPException(status_code=503, detail="Model is not initialized")

    try:
        text = await asyncio.to_thread(
            model.generate,
            prompt_str,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )
        return {
            "id": "ak-completion-1",
            "object": "text_completion",
            "choices": [{"text": text, "index": 0, "finish_reason": "stop"}],
            "usage": {
                "prompt_tokens": len(prompt_str.split()),
                "completion_tokens": len(text.split()),
                "total_tokens": len(prompt_str.split()) + len(text.split()),
            },
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/v1/chat/completions")
async def chat_completions(request: ChatCompletionRequest):
    # Extract last user message for fast command check
    raw_query = None
    for msg in reversed(request.messages):
        if msg.get("role") == "user":
            raw_query = msg.get("content", "")
            break

    if raw_query:
        command_response = run_command(raw_query)
        if command_response is not None:
            return {
                "id": "ak-chat-1",
                "object": "chat.completion",
                "choices": [{"index": 0, "message": {"role": "assistant", "content": command_response}, "finish_reason": "stop"}],
                "usage": {
                    "prompt_tokens": len(raw_query.split()),
                    "completion_tokens": len(command_response.split()),
                    "total_tokens": len(raw_query.split()) + len(command_response.split()),
                },
            }

    model: AKModel = getattr(app.state, "model", None)
    if not model:
        raise HTTPException(status_code=503, detail="Model is not initialized")

    prompt_text = build_prompt_from_messages(request.messages)
    try:
        text = await asyncio.to_thread(
            model.generate,
            prompt_text,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )
        return {
            "id": "ak-chat-1",
            "object": "chat.completion",
            "choices": [{"index": 0, "message": {"role": "assistant", "content": text}, "finish_reason": "stop"}],
            "usage": {
                "prompt_tokens": len(prompt_text.split()),
                "completion_tokens": len(text.split()),
                "total_tokens": len(prompt_text.split()) + len(text.split()),
            },
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": str(exc)})


def create_app() -> FastAPI:
    return app

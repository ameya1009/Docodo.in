import argparse
import os
import sys

from .config import AKConfig
from .model import AKModel

def serve(args: argparse.Namespace) -> None:
    from uvicorn import run

    os.environ.setdefault("AK_ENGINE", args.engine)
    model_path = args.model_path or os.getenv("AK_MODEL_PATH", "")
    if not model_path:
        config = AKConfig.from_env()
        if config.model_path:
            model_path = str(config.model_path)
    if model_path:
        os.environ["AK_MODEL_PATH"] = model_path
    os.environ.setdefault("AK_HOST", args.host)
    os.environ.setdefault("AK_PORT", str(args.port))
    os.environ.setdefault("AK_TEMPERATURE", str(args.temperature))
    os.environ.setdefault("AK_MAX_TOKENS", str(args.max_tokens))
    os.environ.setdefault("AK_THREADS", str(args.threads or 0))

    if not os.getenv("AK_MODEL_PATH"):
        print("Error: model path is required. Use --model-path or AK_MODEL_PATH, or place a supported model in the models/ folder.")
        sys.exit(1)

    run("ak.server:app", host=args.host, port=args.port, reload=False)

def chat(args: argparse.Namespace) -> None:
    config = AKConfig(
        engine=args.engine,
        model_path=args.model_path,
        temperature=args.temperature,
        max_tokens=args.max_tokens,
        threads=args.threads,
    )
    model = AKModel(
        engine=config.engine,
        model_path=str(config.model_path) if config.model_path else None,
        temperature=config.temperature,
        max_tokens=config.max_tokens,
        threads=config.threads,
    )

    print("AK local chat. Type 'exit' or 'quit' to stop.")
    while True:
        prompt = input("You: ").strip()
        if prompt.lower() in {"exit", "quit"}:
            break
        try:
            text = model.generate(prompt)
            print("AK:", text)
        except Exception as exc:
            print("Error:", exc)

def main() -> None:
    parser = argparse.ArgumentParser(prog="ak")
    subparsers = parser.add_subparsers(dest="command", required=True)

    serve_parser = subparsers.add_parser("serve", help="Start the AK local server")
    serve_parser.add_argument("--engine", default="llama_cpp", choices=["llama_cpp", "gpt4all", "transformers"])
    serve_parser.add_argument("--model-path", help="Local model file or directory path")
    serve_parser.add_argument("--host", default="127.0.0.1")
    serve_parser.add_argument("--port", type=int, default=3389)
    serve_parser.add_argument("--temperature", type=float, default=0.7)
    serve_parser.add_argument("--max-tokens", type=int, default=1024)
    serve_parser.add_argument("--threads", type=int, default=0, help="Number of CPU threads, 0 for auto")
    serve_parser.set_defaults(func=serve)

    chat_parser = subparsers.add_parser("chat", help="Start an interactive local chat session")
    chat_parser.add_argument("--engine", default="llama_cpp", choices=["llama_cpp", "gpt4all", "transformers"])
    chat_parser.add_argument("--model-path", required=True, help="Local model file or directory path")
    chat_parser.add_argument("--temperature", type=float, default=0.7)
    chat_parser.add_argument("--max-tokens", type=int, default=1024)
    chat_parser.add_argument("--threads", type=int, default=0, help="Number of CPU threads, 0 for auto")
    chat_parser.set_defaults(func=chat)

    args = parser.parse_args()
    args.func(args)

if __name__ == "__main__":
    main()

import argparse
import os
import sys

from .config import AKConfig, DEFAULT_PORT, DEFAULT_HOST, DEFAULT_TEMPERATURE, DEFAULT_MAX_TOKENS, DEFAULT_ENGINE
from .model import AKModel


def serve(args: argparse.Namespace) -> None:
    from uvicorn import run

    os.environ["AK_ENGINE"] = args.engine
    model_path = args.model_path or os.getenv("AK_MODEL_PATH", "")
    if not model_path:
        config = AKConfig.from_env()
        if config.model_path:
            model_path = str(config.model_path)
    if model_path:
        os.environ["AK_MODEL_PATH"] = model_path

    os.environ["AK_HOST"] = args.host
    os.environ["AK_PORT"] = str(args.port)
    os.environ["AK_TEMPERATURE"] = str(args.temperature)
    os.environ["AK_MAX_TOKENS"] = str(args.max_tokens)
    if args.threads:
        os.environ["AK_THREADS"] = str(args.threads)

    if not os.getenv("AK_MODEL_PATH"):
        print("Error: model path is required. Use --model-path or AK_MODEL_PATH, or place a supported model in the models/ folder.")
        sys.exit(1)

    run("ak.server:app", host=args.host, port=args.port, reload=False)


def chat(args: argparse.Namespace) -> None:
    model_path = args.model_path or os.getenv("AK_MODEL_PATH") or AKConfig._detect_model_path()
    if not model_path:
        print("Error: model path is required. Specify --model-path or place a model in models/ folder.")
        sys.exit(1)

    config = AKConfig(
        engine=args.engine,
        model_path=model_path,
        temperature=args.temperature,
        max_tokens=args.max_tokens,
        threads=args.threads or None,
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
        try:
            prompt = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nExiting chat.")
            break
        if prompt.lower() in {"exit", "quit"}:
            break
        try:
            text = model.generate(prompt)
            print("AK:", text)
        except Exception as exc:
            print("Error:", exc)


def create_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="ak", description="AK Local AI Engine CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    serve_parser = subparsers.add_parser("serve", help="Start the AK local server")
    serve_parser.add_argument("--engine", default=DEFAULT_ENGINE, choices=["llama_cpp", "gpt4all", "transformers"])
    serve_parser.add_argument("--model-path", help="Local model file or directory path")
    serve_parser.add_argument("--host", default=DEFAULT_HOST)
    serve_parser.add_argument("--port", type=int, default=DEFAULT_PORT)
    serve_parser.add_argument("--temperature", type=float, default=DEFAULT_TEMPERATURE)
    serve_parser.add_argument("--max-tokens", type=int, default=DEFAULT_MAX_TOKENS)
    serve_parser.add_argument("--threads", type=int, default=0, help="Number of CPU threads, 0 for auto")
    serve_parser.set_defaults(func=serve)

    chat_parser = subparsers.add_parser("chat", help="Start an interactive local chat session")
    chat_parser.add_argument("--engine", default=DEFAULT_ENGINE, choices=["llama_cpp", "gpt4all", "transformers"])
    chat_parser.add_argument("--model-path", help="Local model file or directory path")
    chat_parser.add_argument("--temperature", type=float, default=DEFAULT_TEMPERATURE)
    chat_parser.add_argument("--max-tokens", type=int, default=DEFAULT_MAX_TOKENS)
    chat_parser.add_argument("--threads", type=int, default=0, help="Number of CPU threads, 0 for auto")
    chat_parser.set_defaults(func=chat)

    return parser


def main() -> None:
    parser = create_parser()
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()

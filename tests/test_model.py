from unittest.mock import MagicMock, patch
from ak.model import AKModel


def test_estimate_complexity_simple():
    with patch.object(AKModel, "_load_model", return_value=MagicMock()):
        model = AKModel(engine="llama_cpp", model_path="models/dummy.gguf")
        policy = model._estimate_complexity("What is the capital of India?")
        assert policy["label"] == "simple"
        assert policy["temperature"] <= 0.6


def test_estimate_complexity_complex():
    with patch.object(AKModel, "_load_model", return_value=MagicMock()):
        model = AKModel(engine="llama_cpp", model_path="models/dummy.gguf")
        prompt = (
            "def analyze_architecture(code: str):\n"
            "    import ast\n"
            "    # optimize, debug, evaluate, compare, summarize, explain algorithm\n"
            "    # architecture math code function async await for while if else\n"
            "    for node in ast.walk(ast.parse(code)):\n"
            "        if isinstance(node, ast.FunctionDef):\n"
            "            return node.name\n"
            "    return None\n"
        )
        policy = model._estimate_complexity(prompt)
        assert policy["label"] == "complex"
        assert policy["threads"] >= 4


def test_generate_llama_cpp_dict_parsing():
    mock_engine = MagicMock()
    mock_engine.create_completion.return_value = {
        "choices": [{"text": "Paris is the capital of France."}]
    }

    with patch.object(AKModel, "_load_model", return_value=mock_engine):
        model = AKModel(engine="llama_cpp", model_path="models/dummy.gguf")
        result = model.generate("What is the capital of France?")
        assert result == "Paris is the capital of France."


def test_generate_gpt4all_delegation():
    mock_engine = MagicMock()
    mock_engine.generate.return_value = "Generated response from GPT4All"

    with patch.object(AKModel, "_load_model", return_value=mock_engine):
        model = AKModel(engine="gpt4all", model_path="models/dummy.gguf")
        result = model.generate("Hello GPT4All")
        assert result == "Generated response from GPT4All"

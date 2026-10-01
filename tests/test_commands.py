from ak.commands import run_command


def test_command_help():
    res = run_command("help")
    assert res is not None
    assert "You can ask AK" in res


def test_command_time():
    res = run_command("what is the time")
    assert res is not None
    assert len(res.split(":")) == 3


def test_command_date():
    res = run_command("what date is it today")
    assert res is not None
    assert len(res.split("-")) == 3


def test_command_say():
    res = run_command("say hello world")
    assert res == "hello world"


def test_command_unrecognized_returns_none():
    res = run_command("Explain how quantum computing works")
    assert res is None


def test_command_empty_returns_none():
    assert run_command("") is None
    assert run_command("   ") is None

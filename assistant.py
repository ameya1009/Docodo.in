"""AK Assistant desktop application.

Run this file to launch a modern local assistant interface with:
- offline local model chat
- online remote API fallback
- voice input and text-to-speech
- automatic compute scaling for simple vs complex tasks
- installable exe packaging support
"""

import json
import os
import queue
import sys
import threading
import time
import urllib.error
import urllib.request
import tkinter as tk
import tkinter.scrolledtext as scrolledtext
from tkinter import filedialog, messagebox
from typing import Any

from ak.config import AKConfig
from ak.model import AKModel

try:
    import pyttsx3
except ImportError:
    pyttsx3 = None

try:
    import speech_recognition as sr
except ImportError:
    sr = None

try:
    import pocketsphinx  # noqa: F401
    pocketsphinx_available = True
except ImportError:
    pocketsphinx_available = False

DEFAULT_ENGINE = "llama_cpp"
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8000
DEFAULT_ONLINE_URL = "https://api.example.com/v1/chat/completions"
DEFAULT_REMOTE_MODEL = "gpt-4"


class AKAssistantApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("AK Desktop AI Assistant")
        self.geometry("1100x720")
        self.minsize(960, 600)
        self.configure(bg="#07101d")

        self.voice_queue: queue.Queue = queue.Queue()
        self.voice_engine = None
        self.recognizer = None
        self.model = None

        self.online_mode = tk.BooleanVar(value=False)
        self.voice_mode = tk.BooleanVar(value=False)
        self.offline_recognition = tk.BooleanVar(value=False)

        self.init_voice_engine()
        self.create_widgets()
        self.lazy_load_model()
        self.protocol("WM_DELETE_WINDOW", self.on_close)

    def init_voice_engine(self):
        if pyttsx3 is not None:
            try:
                self.voice_engine = pyttsx3.init()
                self.voice_engine.setProperty("rate", 175)
            except Exception:
                self.voice_engine = None

    def create_widgets(self):
        container = tk.Frame(self, bg="#07101d")
        container.pack(fill=tk.BOTH, expand=True, padx=16, pady=16)

        left = tk.Frame(container, bg="#0e1727", width=340, padx=14, pady=14)
        left.pack(side=tk.LEFT, fill=tk.Y, padx=(0, 14))

        right = tk.Frame(container, bg="#07101d")
        right.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)

        tk.Label(left, text="AK Assistant", font=("Segoe UI", 18, "bold"), fg="#f8fafc", bg="#0e1727").pack(anchor="w", pady=(0, 4))
        tk.Label(left, text="Offline local intelligence & tools", font=("Segoe UI", 9), fg="#94a3b8", bg="#0e1727").pack(anchor="w", pady=(0, 16))

        self.model_frame = tk.LabelFrame(left, text="Local model setup", fg="#e2e8f0", bg="#0e1727", bd=0, padx=10, pady=10, labelanchor="n")
        self.model_frame.pack(fill=tk.X, pady=(0, 14))

        tk.Label(self.model_frame, text="Model path:", fg="#cbd5e1", bg="#0e1727", font=("Segoe UI", 9)).pack(anchor="w")
        detected_path = AKConfig._detect_model_path() or ""
        self.model_path_var = tk.StringVar(value=os.getenv("AK_MODEL_PATH", detected_path))
        self.model_entry = tk.Entry(self.model_frame, textvariable=self.model_path_var, bg="#1e293b", fg="#f8fafc", insertbackground="#f8fafc", relief=tk.FLAT)
        self.model_entry.pack(fill=tk.X, pady=(4, 6))

        btn_row = tk.Frame(self.model_frame, bg="#0e1727")
        btn_row.pack(fill=tk.X)
        tk.Button(btn_row, text="Browse", command=self.choose_model, bg="#334155", fg="white", relief=tk.FLAT, padx=10, pady=4).pack(side=tk.LEFT)
        tk.Button(btn_row, text="Reload model", command=self.lazy_load_model, bg="#2563eb", fg="white", relief=tk.FLAT, padx=10, pady=4).pack(side=tk.RIGHT)

        tk.Label(self.model_frame, text="Backend engine:", fg="#cbd5e1", bg="#0e1727", font=("Segoe UI", 9)).pack(anchor="w", pady=(8, 0))
        self.engine_var = tk.StringVar(value=os.getenv("AK_ENGINE", DEFAULT_ENGINE))
        tk.Entry(self.model_frame, textvariable=self.engine_var, bg="#1e293b", fg="#f8fafc", insertbackground="#f8fafc", relief=tk.FLAT).pack(fill=tk.X, pady=(4, 0))

        self.remote_frame = tk.LabelFrame(left, text="Remote API fallback", fg="#e2e8f0", bg="#0e1727", bd=0, padx=10, pady=10, labelanchor="n")
        self.remote_frame.pack(fill=tk.X, pady=(0, 14))

        tk.Checkbutton(self.remote_frame, text="Enable online API fallback", variable=self.online_mode, bg="#0e1727", fg="#cbd5e1", selectcolor="#1e293b", activebackground="#0e1727", activeforeground="#f8fafc").pack(anchor="w", pady=4)
        tk.Label(self.remote_frame, text="API URL:", fg="#cbd5e1", bg="#0e1727", font=("Segoe UI", 9)).pack(anchor="w")
        self.remote_url_var = tk.StringVar(value=os.getenv("AK_ONLINE_URL", DEFAULT_ONLINE_URL))
        tk.Entry(self.remote_frame, textvariable=self.remote_url_var, bg="#1e293b", fg="#f8fafc", insertbackground="#f8fafc", relief=tk.FLAT).pack(fill=tk.X, pady=(4, 6))

        tk.Label(self.remote_frame, text="API Key:", fg="#cbd5e1", bg="#0e1727", font=("Segoe UI", 9)).pack(anchor="w")
        self.remote_key_var = tk.StringVar(value=os.getenv("AK_ONLINE_KEY", ""))
        tk.Entry(self.remote_frame, textvariable=self.remote_key_var, show="*", bg="#1e293b", fg="#f8fafc", insertbackground="#f8fafc", relief=tk.FLAT).pack(fill=tk.X, pady=(4, 0))

        self.voice_frame = tk.LabelFrame(left, text="Voice assistant", fg="#e2e8f0", bg="#0e1727", bd=0, padx=10, pady=10, labelanchor="n")
        self.voice_frame.pack(fill=tk.X, pady=(0, 14))
        tk.Checkbutton(self.voice_frame, text="Enable voice output", variable=self.voice_mode, bg="#0e1727", fg="#cbd5e1", selectcolor="#1e293b", activebackground="#0e1727", activeforeground="#f8fafc").pack(anchor="w", pady=4)
        tk.Checkbutton(self.voice_frame, text="Offline speech recognition", variable=self.offline_recognition, bg="#0e1727", fg="#cbd5e1", selectcolor="#1e293b", activebackground="#0e1727", activeforeground="#f8fafc").pack(anchor="w", pady=4)
        tk.Button(self.voice_frame, text="Speak and listen", command=self.start_listening, bg="#7c3aed", fg="white", relief=tk.FLAT, padx=12, pady=8).pack(anchor="w", pady=(10, 0))

        left.pack_propagate(False)

        header = tk.Frame(right, bg="#07101d")
        header.pack(fill=tk.X)
        tk.Label(header, text="AK Assistant Chat", bg="#07101d", fg="#f8fafc", font=("Segoe UI", 18, "bold")).pack(side=tk.LEFT)
        self.compute_label = tk.Label(header, text="Ready for questions", bg="#07101d", fg="#94a3b8", font=("Segoe UI", 10))
        self.compute_label.pack(side=tk.RIGHT)

        self.chat_area = scrolledtext.ScrolledText(right, bg="#0e1727", fg="#e2e8f0", bd=0, padx=14, pady=14, wrap=tk.WORD, state=tk.DISABLED)
        self.chat_area.pack(fill=tk.BOTH, expand=True, pady=(10, 8))

        prompt_container = tk.Frame(right, bg="#07101d")
        prompt_container.pack(fill=tk.X)
        self.prompt_box = tk.Text(prompt_container, height=5, bg="#0f172a", fg="#e2e8f0", bd=0, padx=14, pady=14, wrap=tk.WORD, insertbackground="#e2e8f0")
        self.prompt_box.pack(fill=tk.BOTH, expand=True, pady=(0, 10))

        actions = tk.Frame(prompt_container, bg="#07101d")
        actions.pack(fill=tk.X)
        tk.Button(actions, text="Send request", command=self.submit_message, bg="#2563eb", fg="white", relief=tk.FLAT, padx=14, pady=10).pack(side=tk.RIGHT)
        tk.Button(actions, text="Clear chat", command=self.clear_chat, bg="#334155", fg="white", relief=tk.FLAT, padx=14, pady=10).pack(side=tk.RIGHT, padx=(0, 10))
        tk.Button(actions, text="Smart solve", command=lambda: self.submit_preset("Solve this problem with analysis and code examples."), bg="#8b5cf6", fg="white", relief=tk.FLAT, padx=14, pady=10).pack(side=tk.LEFT)

        self.add_message("Welcome to AK Assistant. Ask anything in chat or speak to start.", "assistant")
        self.update_status("Loaded assistant interface.")

    def choose_model(self):
        path = filedialog.askopenfilename(
            title="Select a local model file",
            filetypes=[("Model files", "*.bin *.gguf *.safetensors *.pt *.pth"), ("All files", "*.*")],
        )
        if path:
            self.model_path_var.set(path)
            self.lazy_load_model()

    def start_listening(self):
        if sr is None:
            messagebox.showwarning("Voice disabled", "Install SpeechRecognition to use voice capture.")
            return

        def _listen_worker():
            try:
                recognizer = sr.Recognizer()
                with sr.Microphone() as source:
                    self.after(0, lambda: self.update_status("Listening... speak now."))
                    audio = recognizer.listen(source, timeout=6)

                if self.offline_recognition.get() and pocketsphinx_available:
                    text = recognizer.recognize_sphinx(audio)
                else:
                    text = recognizer.recognize_google(audio)

                def _update_ui():
                    self.prompt_box.delete("1.0", tk.END)
                    self.prompt_box.insert(tk.END, text)
                    self.update_status(f"Captured voice input: {text}")
                    self.submit_message()

                self.after(0, _update_ui)
            except sr.RequestError as exc:
                self.after(0, lambda: self.update_status(f"Speech recognition request failed: {exc}"))
            except sr.UnknownValueError:
                self.after(0, lambda: self.update_status("Could not understand audio. Try again."))
            except Exception as exc:
                self.after(0, lambda: self.update_status(f"Voice capture failed: {exc}"))

        threading.Thread(target=_listen_worker, daemon=True).start()

    def speak(self, text: str):
        if not self.voice_mode.get() or pyttsx3 is None:
            return

        def _worker():
            try:
                engine = pyttsx3.init()
                engine.setProperty("rate", 175)
                engine.say(text)
                engine.runAndWait()
            except Exception:
                pass

        threading.Thread(target=_worker, daemon=True).start()

    def add_message(self, text: str, role: str):
        self.chat_area.configure(state=tk.NORMAL)
        prefix = "You" if role == "user" else "AK Assistant"
        self.chat_area.insert(tk.END, f"{prefix}:\n", "bold")
        self.chat_area.insert(tk.END, f"{text}\n\n")
        self.chat_area.see(tk.END)
        self.chat_area.configure(state=tk.DISABLED)

    def update_status(self, text: str):
        self.compute_label.configure(text=text)

    def clear_chat(self):
        self.chat_area.configure(state=tk.NORMAL)
        self.chat_area.delete("1.0", tk.END)
        self.chat_area.configure(state=tk.DISABLED)

    def submit_preset(self, prefix: str):
        prompt = self.prompt_box.get("1.0", tk.END).strip()
        if not prompt:
            self.prompt_box.insert(tk.END, prefix)
        else:
            self.prompt_box.delete("1.0", tk.END)
            self.prompt_box.insert(tk.END, f"{prefix}\n\nTask: {prompt}")
        self.submit_message()

    def submit_message(self):
        prompt = self.prompt_box.get("1.0", tk.END).strip()
        if not prompt:
            return
        self.prompt_box.delete("1.0", tk.END)
        self.add_message(prompt, "user")
        self.update_status("Processing query...")

        threading.Thread(target=self._process_message, args=(prompt,), daemon=True).start()

    def _process_message(self, prompt: str):
        start_time = time.time()
        try:
            from ak.commands import run_command

            command_output = run_command(prompt)
            if command_output is not None:
                self.after(0, lambda: self._on_result(command_output, {"label": "fast-command", "max_tokens": 0, "temperature": 0.0}, time.time() - start_time))
                return

            if self.online_mode.get() and self.remote_key_var.get().strip():
                result, policy = self.query_remote_api(prompt)
            else:
                if not self.model:
                    self.lazy_load_model()
                if not self.model:
                    raise RuntimeError("No local model available. Load a model file or configure remote API fallback.")
                policy = self.model._estimate_complexity(prompt)
                result = self.model.generate(prompt)

            duration = time.time() - start_time
            self.after(0, lambda: self._on_result(result, policy, duration))
        except Exception as exc:
            self.after(0, lambda: self._on_error(str(exc)))

    def _on_result(self, text: str, policy: dict[str, Any], duration: float):
        self.add_message(text, "assistant")
        label = policy.get("label", "standard")
        self.update_status(f"Completed in {duration:.2f}s | Policy: {label}")
        self.speak(text)

    def _on_error(self, message: str):
        self.add_message(f"Error: {message}", "assistant")
        self.update_status("Task encountered an error.")

    def lazy_load_model(self):
        path = self.model_path_var.get().strip()
        engine = self.engine_var.get().strip() or DEFAULT_ENGINE
        if not path or not os.path.exists(path):
            self.model = None
            self.update_status("No local model loaded.")
            return

        try:
            self.model = AKModel(engine=engine, model_path=path)
            self.update_status(f"Loaded {engine} model.")
        except Exception as exc:
            self.model = None
            self.update_status(f"Failed to load model: {exc}")

    def query_remote_api(self, prompt: str) -> tuple[str, dict[str, Any]]:
        url = self.remote_url_var.get().strip() or DEFAULT_ONLINE_URL
        payload = {
            "model": self.remote_model_name(),
            "messages": [
                {"role": "system", "content": "You are AK, a smart and concise local assistant."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.7,
            "max_tokens": 512,
        }
        headers = {"Content-Type": "application/json"}
        api_key = self.remote_key_var.get().strip()
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"

        request = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers)
        with urllib.request.urlopen(request, timeout=30) as response:
            data = json.loads(response.read().decode("utf-8"))

        choices = data.get("choices", [])
        if choices and isinstance(choices[0], dict):
            assistant_text = choices[0].get("message", {}).get("content", "") or choices[0].get("text", "")
        else:
            error_detail = data.get("error", {}).get("message") if isinstance(data.get("error"), dict) else data.get("error")
            raise RuntimeError(f"Remote API Error: {error_detail or 'No valid completion choices returned'}")

        return assistant_text, {"label": "online", "max_tokens": payload["max_tokens"], "temperature": payload["temperature"]}

    def remote_model_name(self) -> str:
        return os.getenv("AK_REMOTE_MODEL", DEFAULT_REMOTE_MODEL)

    def on_close(self):
        if self.voice_engine is not None:
            try:
                self.voice_engine.stop()
            except Exception:
                pass
        self.destroy()


if __name__ == "__main__":
    app = AKAssistantApp()
    app.mainloop()

"""AK Local Dashboard

Run this file to open a local desktop dashboard for AK.
The dashboard can start and stop the AK server and open the local UI.
"""

import os
import sys
import subprocess
import threading
import urllib.error
import urllib.request
import json
import webbrowser
import tkinter as tk
from tkinter import filedialog, messagebox

DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8000
DEFAULT_ENGINE = "llama_cpp"
DEFAULT_TEMPERATURE = "0.7"
DEFAULT_MAX_TOKENS = "512"


class AKDashboardApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("AK Local Dashboard")
        self.geometry("760x580")
        self.resizable(False, False)
        self.server_process = None

        self.create_widgets()
        self.protocol("WM_DELETE_WINDOW", self.on_close)

    def create_widgets(self):
        frame = tk.Frame(self, padx=12, pady=12)
        frame.pack(fill=tk.BOTH, expand=True)

        title_label = tk.Label(frame, text="AK Local Application Dashboard", font=("Segoe UI", 16, "bold"))
        title_label.grid(row=0, column=0, columnspan=3, sticky="w", pady=(0, 12))

        tk.Label(frame, text="Model Path:").grid(row=1, column=0, sticky="w")
        self.model_path_var = tk.StringVar(value=os.getenv("AK_MODEL_PATH", ""))
        self.model_path_entry = tk.Entry(frame, textvariable=self.model_path_var, width=70)
        self.model_path_entry.grid(row=1, column=1, sticky="w")
        tk.Button(frame, text="Browse...", command=self.browse_model).grid(row=1, column=2, sticky="w")

        tk.Label(frame, text="Engine:").grid(row=2, column=0, sticky="w", pady=(8, 0))
        self.engine_var = tk.StringVar(value=os.getenv("AK_ENGINE", DEFAULT_ENGINE))
        tk.Entry(frame, textvariable=self.engine_var, width=20).grid(row=2, column=1, sticky="w", pady=(8, 0))

        tk.Label(frame, text="Host:").grid(row=3, column=0, sticky="w", pady=(8, 0))
        self.host_var = tk.StringVar(value=os.getenv("AK_HOST", DEFAULT_HOST))
        tk.Entry(frame, textvariable=self.host_var, width=20).grid(row=3, column=1, sticky="w", pady=(8, 0))

        tk.Label(frame, text="Port:").grid(row=4, column=0, sticky="w", pady=(8, 0))
        self.port_var = tk.StringVar(value=os.getenv("AK_PORT", str(DEFAULT_PORT)))
        tk.Entry(frame, textvariable=self.port_var, width=20).grid(row=4, column=1, sticky="w", pady=(8, 0))

        tk.Label(frame, text="Temperature:").grid(row=5, column=0, sticky="w", pady=(8, 0))
        self.temperature_var = tk.StringVar(value=os.getenv("AK_TEMPERATURE", DEFAULT_TEMPERATURE))
        tk.Entry(frame, textvariable=self.temperature_var, width=20).grid(row=5, column=1, sticky="w", pady=(8, 0))

        tk.Label(frame, text="Max Tokens:").grid(row=6, column=0, sticky="w", pady=(8, 0))
        self.max_tokens_var = tk.StringVar(value=os.getenv("AK_MAX_TOKENS", DEFAULT_MAX_TOKENS))
        tk.Entry(frame, textvariable=self.max_tokens_var, width=20).grid(row=6, column=1, sticky="w", pady=(8, 0))

        button_frame = tk.Frame(frame)
        button_frame.grid(row=7, column=0, columnspan=3, pady=(16, 8), sticky="w")

        self.start_button = tk.Button(button_frame, text="Start AK Server", command=self.start_server, width=18)
        self.start_button.grid(row=0, column=0, padx=(0, 8))
        self.stop_button = tk.Button(button_frame, text="Stop AK Server", command=self.stop_server, width=18, state=tk.DISABLED)
        self.stop_button.grid(row=0, column=1, padx=(0, 8))
        tk.Button(button_frame, text="Open Local Web UI", command=self.open_dashboard, width=18).grid(row=0, column=2, padx=(0, 8))
        tk.Button(button_frame, text="Check Server Status", command=self.check_server_status, width=18).grid(row=0, column=3)

        tk.Label(frame, text="Server Log & Status Output:").grid(row=8, column=0, columnspan=3, sticky="w", pady=(14, 4))

        self.status_text = tk.Text(frame, height=18, width=90, wrap=tk.WORD)
        self.status_text.grid(row=9, column=0, columnspan=3, pady=(4, 0))
        self.status_text.configure(state=tk.DISABLED)

        self.update_status("Ready. Configure your model settings above and click 'Start AK Server'.")

    def browse_model(self):
        path = filedialog.askopenfilename(
            title="Select model file",
            filetypes=[("Model files", "*.bin *.gguf *.pt *.pth *.safetensors"), ("All files", "*.*")],
        )
        if path:
            self.model_path_var.set(path)

    def start_server(self):
        model_path = self.model_path_var.get().strip()
        if not model_path:
            messagebox.showwarning("Missing Model", "Please select a valid model path before starting the server.")
            return
        if not os.path.exists(model_path):
            messagebox.showwarning("Invalid Model Path", "The selected model path does not exist.")
            return
        if self.server_process and self.server_process.poll() is None:
            self.update_status("Server is already running.")
            return

        env = os.environ.copy()
        env["AK_MODEL_PATH"] = model_path
        env["AK_ENGINE"] = self.engine_var.get().strip() or DEFAULT_ENGINE
        env["AK_HOST"] = self.host_var.get().strip() or DEFAULT_HOST
        env["AK_PORT"] = self.port_var.get().strip() or str(DEFAULT_PORT)
        env["AK_TEMPERATURE"] = self.temperature_var.get().strip() or DEFAULT_TEMPERATURE
        env["AK_MAX_TOKENS"] = self.max_tokens_var.get().strip() or DEFAULT_MAX_TOKENS

        cmd = [
            sys.executable,
            "-m",
            "uvicorn",
            "ak.server:app",
            "--host",
            env["AK_HOST"],
            "--port",
            env["AK_PORT"],
            "--log-level",
            "info",
        ]
        self.update_status(f"Starting AK server on http://{env['AK_HOST']}:{env['AK_PORT']} ...")

        try:
            self.server_process = subprocess.Popen(
                cmd, env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
            )
        except Exception as exc:
            self.update_status(f"Failed to start server: {exc}")
            return

        self.start_button.config(state=tk.DISABLED)
        self.stop_button.config(state=tk.NORMAL)
        threading.Thread(target=self._read_server_output, daemon=True).start()

    def _read_server_output(self):
        if not self.server_process:
            return
        if self.server_process.stdout:
            for line in self.server_process.stdout:
                self.update_status(line.strip())
        if self.server_process.stderr:
            for line in self.server_process.stderr:
                self.update_status(line.strip())
        if self.server_process.poll() is not None:
            self.update_status("AK server stopped.")
            self.start_button.config(state=tk.NORMAL)
            self.stop_button.config(state=tk.DISABLED)

    def stop_server(self):
        if self.server_process and self.server_process.poll() is None:
            self.update_status("Stopping AK server...")
            self.server_process.terminate()
            try:
                self.server_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.server_process.kill()
            self.server_process = None
            self.update_status("AK server has been terminated.")
        else:
            self.update_status("AK server is not currently running.")
        self.start_button.config(state=tk.NORMAL)
        self.stop_button.config(state=tk.DISABLED)

    def open_dashboard(self):
        host = self.host_var.get().strip() or DEFAULT_HOST
        port = self.port_var.get().strip() or str(DEFAULT_PORT)
        url = f"http://{host}:{port}/"
        webbrowser.open(url)
        self.update_status(f"Opened web UI at {url}")

    def check_server_status(self):
        host = self.host_var.get().strip() or DEFAULT_HOST
        port = self.port_var.get().strip() or str(DEFAULT_PORT)
        url = f"http://{host}:{port}/api/models"

        def _check():
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "AKDashboard/1.0"})
                with urllib.request.urlopen(req, timeout=3) as resp:
                    data = json.loads(resp.read().decode("utf-8"))
                    self.update_status(f"Server Status: Online ✅\nDetails: {json.dumps(data, indent=2)}")
            except Exception as exc:
                self.update_status(f"Server Status: Unreachable or Offline ❌ ({exc})")

        threading.Thread(target=_check, daemon=True).start()

    def update_status(self, text: str):
        self.status_text.configure(state=tk.NORMAL)
        self.status_text.insert(tk.END, text + "\n")
        self.status_text.see(tk.END)
        self.status_text.configure(state=tk.DISABLED)

    def on_close(self):
        self.stop_server()
        self.destroy()


if __name__ == "__main__":
    app = AKDashboardApp()
    app.mainloop()

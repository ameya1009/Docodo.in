import React, { useState } from 'react';

export default function ECGTool() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('English');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ecg-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language })
      });
      const data = await res.json();
      setResult(data?.content ?? 'No response');
    } catch (e) {
      setResult('Error generating content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-8 bg-zinc-900/80 rounded-xl glass hover:glass-hover shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-gradient">ECG Content Generator</h2>
      <div className="grid gap-4">
        <textarea
          className="p-3 rounded-md bg-zinc-800 text-white focus:outline-none"
          rows={4}
          placeholder="Enter a topic or prompt"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <select
          className="p-2 rounded-md bg-zinc-800 text-white"
          value={language}
          onChange={e => setLanguage(e.target.value)}
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Hinglish</option>
        </select>
        <button
          className="btn-primary w-full"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? 'Generating…' : 'Generate'}
        </button>
        {result && (
          <div className="mt-4 p-4 bg-zinc-800/50 rounded-md text-white">
            {result}
          </div>
        )}
      </div>
    </section>
  );
}

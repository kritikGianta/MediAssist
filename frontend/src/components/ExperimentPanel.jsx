import { motion } from "framer-motion";

const modelOptions = ["llama-3.1-8b-instant", "llama-3.1-70b-versatile", "mixtral-8x7b-32768", "gemma2-9b-it"];

export default function ExperimentPanel({ settings, onChange, onSave, saving }) {
  return (
    <div className="glass rounded-[28px] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-['Space_Grotesk'] text-xs uppercase tracking-[0.32em] text-mist">
            Personalization
          </p>
          <h3 className="mt-2 text-lg font-semibold text-ink">Adjust response style and retrieval</h3>
        </div>
        <button
          onClick={onSave}
          className="rounded-2xl bg-gradient-to-r from-aqua to-glow px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-mist">Groq model</span>
          <select
            value={settings.model_name}
            onChange={(event) => onChange("model_name", event.target.value)}
            className="w-full rounded-2xl border border-[#18364014] bg-white px-4 py-3 text-ink outline-none"
          >
            {modelOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm">
          <span className="text-mist">Embedding model</span>
          <input
            value={settings.embedding_model}
            onChange={(event) => onChange("embedding_model", event.target.value)}
            className="w-full rounded-2xl border border-[#18364014] bg-white px-4 py-3 text-ink outline-none"
          />
        </label>

        {[
          ["top_k", "Top-k", 1, 8, 1],
          ["chunk_size", "Chunk size", 200, 1000, 50],
          ["temperature", "Temperature", 0, 1, 0.1],
          ["max_tokens", "Max tokens", 64, 512, 32]
        ].map(([field, label, min, max, step]) => (
          <motion.label key={field} className="space-y-2 text-sm" layout>
            <div className="flex items-center justify-between">
              <span className="text-mist">{label}</span>
              <span className="text-ink">{settings[field]}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={settings[field]}
              onChange={(event) =>
                onChange(field, field === "temperature" ? Number(event.target.value) : parseInt(event.target.value, 10))
              }
              className="w-full accent-aqua"
            />
          </motion.label>
        ))}
      </div>
    </div>
  );
}

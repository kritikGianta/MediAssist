import { Activity, FileHeart, LocateFixed, MessageSquareMore, Settings2 } from "lucide-react";
import { motion } from "framer-motion";

const quickPrompts = [
  "I have fever, headache, and sore throat",
  "Summarize my blood report and explain abnormal findings",
  "Find nearby hospitals and pharmacies"
];

export default function Sidebar({ history, onPromptClick }) {
  return (
    <aside className="dark-panel hidden w-[320px] shrink-0 rounded-[32px] p-5 xl:flex xl:flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-['Space_Grotesk'] text-xs uppercase tracking-[0.35em] text-[#c2d3cf]">
            MediAssist
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-pearl">A calmer way to get health guidance</h1>
          <p className="mt-3 text-sm leading-6 text-[#c8d7d3]">
            Designed to feel like a trustworthy care product, with clear actions and less visual noise.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <Activity className="text-blush" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-[#cfe0db]">
            <FileHeart size={16} />
            Try these prompts
          </div>
          <div className="space-y-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => onPromptClick(prompt)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-left text-sm text-[#edf4f1] transition hover:border-[#ffffff30] hover:bg-white/[0.1]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-[#cfe0db]">
            <MessageSquareMore size={16} />
            Recent history
          </div>
          <div className="panel-scroll max-h-[260px] space-y-2 overflow-y-auto pr-2">
            {history.length === 0 ? (
              <p className="text-sm text-[#afc4be]">Chats will appear here after your first conversation.</p>
            ) : (
              history
                .filter((item) => item.role === "user")
                .slice(-8)
                .reverse()
                .map((item, index) => (
                  <motion.div
                    key={`${item.timestamp}-${index}`}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-sm text-[#edf4f1]"
                  >
                    {item.content}
                  </motion.div>
                ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3 pt-5 text-sm text-[#d6e5e0]">
        <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
          <div className="mb-1 flex items-center gap-2">
            <LocateFixed size={15} />
            Nearby care
          </div>
          Clinic and pharmacy lookup
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
          <div className="mb-1 flex items-center gap-2">
            <Settings2 size={15} />
            Care settings
          </div>
          Local model controls
        </div>
      </div>
    </aside>
  );
}

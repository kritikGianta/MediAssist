import { motion } from "framer-motion";
import { Clock3, FileText, HeartPulse, LocateFixed } from "lucide-react";

const careSteps = [
  {
    title: "Describe symptoms",
    text: "Use natural language or voice input to explain what you are feeling."
  },
  {
    title: "Review guidance",
    text: "See possible causes, severity, precautions, and safe next steps."
  },
  {
    title: "Find nearby care",
    text: "Browse hospitals, clinics, and pharmacies around your location."
  }
];

const quickTiles = [
  { label: "Symptom check", icon: HeartPulse, tone: "bg-[#eef7f4] text-aqua" },
  { label: "Report review", icon: FileText, tone: "bg-[#f7f1eb] text-blush" },
  { label: "Visit timing", icon: Clock3, tone: "bg-[#f0f4f8] text-[#6f88a0]" },
  { label: "Nearby care", icon: LocateFixed, tone: "bg-[#eef7f4] text-aqua" }
];

export default function HeroScene() {
  return (
    <div className="grid gap-4 2xl:grid-cols-[1.05fr_0.95fr]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="dark-panel rounded-[32px] p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-['Space_Grotesk'] text-xs uppercase tracking-[0.26em] text-[#bed0cb]">Care journey</p>
            <h3 className="mt-2 text-3xl font-semibold leading-tight">Talk through symptoms and move to the next right step</h3>
          </div>
          <div className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#e2ece8]">
            Guided
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {careSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-[24px] border border-white/10 bg-white/5 p-4"
            >
              <div className="text-xs uppercase tracking-[0.22em] text-[#a9bdb7]">
                {index + 1}. {step.title}
              </div>
              <div className="mt-2 text-sm leading-6 text-[#eff5f2]">{step.text}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="surface rounded-[32px] p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-['Space_Grotesk'] text-xs uppercase tracking-[0.26em] text-mist">Quick access</p>
            <h3 className="mt-2 text-2xl font-semibold text-ink">Designed around real actions</h3>
          </div>
          <div className="rounded-full bg-[#eff7f4] px-4 py-2 text-xs uppercase tracking-[0.22em] text-aqua">Patient-first</div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {quickTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <motion.div
                key={tile.label}
                whileHover={{ y: -3 }}
                className="rounded-[24px] border border-[#18364014] bg-white p-4 shadow-card min-h-[180px]"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tile.tone}`}>
                  <Icon size={18} />
                </div>
                <div className="mt-4 text-base font-semibold text-ink">{tile.label}</div>
                <div className="mt-2 text-sm leading-6 text-mist">
                  Direct access from the main workspace without extra steps or clutter.
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

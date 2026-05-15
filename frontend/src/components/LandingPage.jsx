import { motion } from "framer-motion";
import { ArrowRight, FileText, HeartPulse, MapPinned, ShieldCheck, Sparkles } from "lucide-react";

const highlights = [
  {
    title: "Symptom guidance",
    text: "Describe what you feel and get calm, structured guidance.",
    icon: HeartPulse
  },
  {
    title: "Report summaries",
    text: "Upload prescriptions or blood reports for a quick summary.",
    icon: FileText
  },
  {
    title: "Nearby care",
    text: "Find clinics, hospitals, and pharmacies near you.",
    icon: MapPinned
  }
];

export default function LandingPage({ onPrimaryClick, onSecondaryClick }) {
  return (
    <section id="landing" className="glass overflow-hidden rounded-[36px] p-6 shadow-soft md:p-8">
      <div className="mb-10 flex flex-col gap-4 border-b border-[#18364010] pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-['Space_Grotesk'] text-sm uppercase tracking-[0.35em] text-aqua">MediAssist</p>
          <p className="mt-2 text-sm text-mist">Smarter symptom support, report summaries, and nearby care.</p>
        </div>
        <button
          onClick={onSecondaryClick}
          className="rounded-2xl border border-[#18364014] bg-white px-5 py-3 font-medium text-ink shadow-card transition hover:border-aqua/30"
        >
          Go to chat
        </button>
      </div>

      <div className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
        <div className="max-w-3xl">
          <div className="mb-5 flex items-center gap-2 rounded-full bg-[#eef7f4] px-4 py-2 text-xs font-medium uppercase tracking-[0.25em] text-aqua w-fit">
            <ShieldCheck size={14} />
            Healthcare companion
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-ink md:text-6xl">
            Clear healthcare guidance in one clean experience.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-mist md:text-lg">
            Check symptoms, understand uploaded reports, and quickly move to nearby hospitals or pharmacies through a focused healthcare chatbot experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={onPrimaryClick}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-aqua to-glow px-6 py-3.5 font-medium text-white transition hover:opacity-95"
            >
              Start symptom check
              <ArrowRight size={16} />
            </button>
            <button
              onClick={onSecondaryClick}
              className="rounded-2xl border border-[#18364014] bg-white px-6 py-3.5 font-medium text-ink shadow-card transition hover:border-aqua/30"
            >
              Open chatbot
            </button>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="surface rounded-[24px] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-mist">General guidance</div>
              <div className="mt-2 text-sm leading-6 text-ink">Possible causes, precautions, and when to see a doctor.</div>
            </div>
            <div className="surface rounded-[24px] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-mist">Report support</div>
              <div className="mt-2 text-sm leading-6 text-ink">Summaries for prescriptions, blood reports, and health PDFs.</div>
            </div>
            <div className="surface rounded-[24px] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-mist">Nearby medical care</div>
              <div className="mt-2 text-sm leading-6 text-ink">Quick access to clinics, hospitals, and pharmacies nearby.</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-8 top-8 h-28 w-28 rounded-full bg-[#dff2ec] blur-2xl" />
          <div className="pointer-events-none absolute bottom-10 right-10 h-24 w-24 rounded-full bg-[#f6dfd4] blur-2xl" />

          <div className="surface relative rounded-[34px] p-6 md:p-8">
            <div className="absolute right-6 top-6 hidden rounded-full bg-[#eef7f4] px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-aqua md:flex md:items-center md:gap-2">
              <Sparkles size={14} />
              Trusted helper
            </div>

            <div className="grid items-center gap-6 md:grid-cols-[0.9fr_1.1fr]">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mx-auto w-full max-w-[280px]"
              >
                <div className="absolute inset-x-6 bottom-2 h-10 rounded-full bg-[#d9ebe5] blur-xl" />
                <img
                  src="/medical-bot.png"
                  alt="Medical assistant bot"
                  className="relative z-10 mx-auto w-full object-contain drop-shadow-[0_24px_30px_rgba(20,38,47,0.12)]"
                />
              </motion.div>

              <div className="space-y-4">
                {highlights.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="rounded-[24px] border border-[#18364014] bg-white p-4 shadow-card"
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded-2xl bg-[#eef7f4] p-3 text-aqua">
                          <Icon size={18} />
                        </div>
                        <div>
                          <div className="font-semibold text-ink">{item.title}</div>
                          <p className="mt-2 text-sm leading-6 text-mist">{item.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

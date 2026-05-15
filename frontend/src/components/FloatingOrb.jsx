import { motion } from "framer-motion";

export default function FloatingOrb({ className, delay = 0, size = 220, tint = "seafoam" }) {
  const palettes = {
    seafoam:
      "radial-gradient(circle at 30% 28%, rgba(255,255,255,0.72), rgba(155,214,207,0.28) 32%, rgba(123,198,180,0.12) 60%, transparent 72%)",
    blush:
      "radial-gradient(circle at 30% 28%, rgba(255,255,255,0.72), rgba(240,182,168,0.3) 30%, rgba(240,182,168,0.12) 60%, transparent 72%)",
    pearl:
      "radial-gradient(circle at 30% 28%, rgba(255,255,255,0.78), rgba(246,239,232,0.22) 32%, rgba(155,214,207,0.08) 60%, transparent 72%)"
  };
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.3, scale: 0.92 }}
      animate={{ opacity: [0.35, 0.72, 0.35], y: [0, -30, 0], rotate: [0, 12, 0] }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: "easeInOut" }}
      style={{
        width: size,
        height: size,
        borderRadius: "999px",
        background: palettes[tint],
        boxShadow: "0 18px 60px rgba(12, 30, 36, 0.2)"
      }}
    />
  );
}

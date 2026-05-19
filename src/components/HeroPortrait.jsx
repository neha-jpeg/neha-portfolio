import { motion } from "framer-motion";
import { ProfilePhoto } from "./ProfilePhoto";

const BUBBLES = [
  { className: "left-[8%] top-[12%] h-28 w-28 bg-[#dce3c8]/70", delay: 0 },
  { className: "right-[6%] top-[18%] h-20 w-20 bg-[#f2dbe2]/80", delay: 0.05 },
  { className: "bottom-[10%] left-[14%] h-24 w-24 bg-[#efe2b7]/90", delay: 0.1 },
  { className: "bottom-[16%] right-[12%] h-32 w-32 bg-[#c5a34a]/35", delay: 0.15 },
  { className: "left-[42%] top-[4%] h-16 w-16 bg-[#8d6572]/25", delay: 0.08 },
];

export function HeroPortrait({ profile }) {
  const src = profile.avatarUrl || "/neha-pfp.jpeg";
  const position = profile.avatarPosition || "center 20%";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center"
    >
      {BUBBLES.map((bubble) => (
        <motion.div
          key={bubble.className}
          className={`absolute rounded-full border border-[#d8c89e]/40 blur-[0.5px] ${bubble.className}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: bubble.delay }}
          whileHover={{ scale: 1.08, x: 6, y: 6 }}
        />
      ))}

      <motion.div
        className="relative z-10"
        whileHover={{ scale: 1.03, x: 4, y: 4 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        <div className="rounded-full bg-gradient-to-br from-[#f2dbe2]/60 via-white/40 to-[#dce3c8]/60 p-3 shadow-xl ring-1 ring-[#e6ddc7]">
          <ProfilePhoto src={src} alt={profile.name} size="xl" position={position} className="shadow-inner" />
        </div>
      </motion.div>
    </motion.div>
  );
}

"use client"

import { motion } from "framer-motion"

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        delay: i * 0.2,
        type: "spring",
        duration: 1.5,
        bounce: 0.2,
        ease: "easeInOut",
      },
      opacity: { delay: i * 0.2, duration: 0.2 },
    },
  }),
}

// Animation sequence for morphing from checkmark to $ sign
const morphToMoney = {
  initial: {
    d: "M30 50L45 65L70 35", // Checkmark path
  },
  animate: {
    d: "M50 25C42 25 35 30 35 38C35 45 40 48 50 52C60 56 65 59 65 66C65 74 58 79 50 79C42 79 35 74 35 66", // $ sign vertical line
    transition: {
      delay: 1.8,
      duration: 0.8,
      ease: "easeInOut",
    },
  },
}

const verticalLine = {
  initial: {
    pathLength: 0,
    opacity: 0,
  },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      delay: 2.2,
      duration: 0.6,
      ease: "easeInOut",
    },
  },
}

export default function IntroAnimation() {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
          scale: {
            type: "spring",
            damping: 15,
            stiffness: 200,
          },
        }}
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 blur-xl bg-emerald-500/10 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.2,
              duration: 0.8,
              ease: "easeOut",
            }}
          />
          <motion.svg
            width={100}
            height={100}
            viewBox="0 0 100 100"
            initial="hidden"
            animate="visible"
            className="relative z-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]"
          >
            <title>$MUNNY PROXY$ Logo</title>
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgb(16 185 129)"
              variants={draw}
              custom={0}
              style={{
                strokeWidth: 4,
                strokeLinecap: "round",
                fill: "transparent",
              }}
            />

            {/* This path morphs from checkmark to $ curve */}
            <motion.path
              initial={morphToMoney.initial}
              animate={morphToMoney.animate}
              stroke="rgb(16 185 129)"
              variants={draw}
              custom={1}
              style={{
                strokeWidth: 4,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                fill: "transparent",
              }}
            />

            {/* Vertical line for $ sign */}
            <motion.path
              d="M50 25L50 79"
              stroke="rgb(16 185 129)"
              initial={verticalLine.initial}
              animate={verticalLine.animate}
              style={{
                strokeWidth: 4,
                strokeLinecap: "round",
                strokeLinejoin: "round",
                fill: "transparent",
              }}
            />
          </motion.svg>
        </div>
      </motion.div>
      <motion.h1
        className="text-2xl font-bold text-emerald-500 mt-4 tracking-tight"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.4 }}
      >
        $MUNNY PROXY$
      </motion.h1>
    </div>
  )
}

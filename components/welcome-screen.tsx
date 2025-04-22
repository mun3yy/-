"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DollarSign, LogOut, BookOpen } from "lucide-react"
import ParticleBackground from "./particle-background"

interface WelcomeScreenProps {
  onExplore: () => void
}

export default function WelcomeScreen({ onExplore }: WelcomeScreenProps) {
  const [isExiting, setIsExiting] = useState(false)

  const handleExplore = () => {
    onExplore()
  }

  const handleExit = () => {
    setIsExiting(true)
    // Redirect to Google after a short delay
    setTimeout(() => {
      window.location.href = "https://www.google.com"
    }, 500)
  }

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 p-4 overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
    >
      <ParticleBackground />

      <motion.div
        className="text-center max-w-md relative z-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className="mb-6 flex justify-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{
            duration: 0.8,
            type: "spring",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <DollarSign className="h-24 w-24 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.7)]" />
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl font-bold text-emerald-500 mb-4 drop-shadow-[0_0_10px_rgba(16,185,129,0.7)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          $MUNNY PROXY$
        </motion.h1>

        <motion.p
          className="text-zinc-200 mb-8 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Your ultimate unblocked games and proxy solution
        </motion.p>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Button
            className="w-full py-6 text-lg bg-emerald-600 hover:bg-emerald-700 transition-all hover:scale-105 border-none shadow-[0_0_15px_rgba(16,185,129,0.5)]"
            onClick={handleExplore}
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Explore The Library
          </Button>

          <Button
            variant="outline"
            className="w-full py-6 text-lg bg-purple-700 hover:bg-purple-800 text-white border-purple-500 transition-all hover:scale-105 shadow-[0_0_15px_rgba(147,51,234,0.5)]"
            onClick={handleExit}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Exit Site
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

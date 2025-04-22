"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bot, User, Send, Sparkles } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function ChatGPTInterface() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm your AI assistant. How can I help you today?",
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    // Add user message
    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI thinking and response
    setTimeout(() => {
      generateResponse(input)
    }, 500)
  }

  const generateResponse = (userInput: string) => {
    // Simple response generation based on keywords
    let response = ""
    const lowercaseInput = userInput.toLowerCase()

    if (lowercaseInput.includes("hello") || lowercaseInput.includes("hi")) {
      response = "Hello! How can I assist you today?"
    } else if (lowercaseInput.includes("how are you")) {
      response = "I'm just a program, but thanks for asking! How can I help you?"
    } else if (lowercaseInput.includes("game") || lowercaseInput.includes("play")) {
      response =
        "We have many games available in our library! You can check them out in the Games tab. Any specific type of game you're interested in?"
    } else if (lowercaseInput.includes("proxy")) {
      response =
        "Our proxy feature allows you to browse websites that might be blocked. You can access it from the Proxy tab in the main navigation."
    } else if (lowercaseInput.includes("help")) {
      response = "I can help you navigate the site, find games, or answer questions. What do you need assistance with?"
    } else if (lowercaseInput.includes("thank")) {
      response = "You're welcome! Let me know if you need anything else."
    } else {
      // Generate a more generic response
      const genericResponses = [
        "That's an interesting question. Let me think about that...",
        "I understand what you're asking. Here's what I know about that topic...",
        "Great question! Based on my knowledge...",
        "I'd be happy to help with that. Here's some information that might be useful...",
        "Let me provide some insights on that topic...",
      ]

      response = genericResponses[Math.floor(Math.random() * genericResponses.length)]
      response +=
        " Actually, I'm a simplified AI assistant for demonstration purposes. For more complex questions, you might want to use a full-featured AI service."
    }

    // Simulate typing delay based on response length
    const typingDelay = Math.min(1000 + response.length * 10, 3000)

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsTyping(false)
    }, typingDelay)
  }

  return (
    <Card className="flex flex-col h-[80vh] bg-zinc-800/80 border-zinc-700 backdrop-blur-sm overflow-hidden relative">
      {/* Particle effects in the background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-purple-500/30"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              x: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
              y: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="p-4 border-b border-zinc-700 flex items-center gap-2 bg-zinc-900/50">
        <Bot className="h-5 w-5 text-purple-400" />
        <h2 className="font-semibold text-lg">ChatGPT</h2>
        <div className="ml-auto flex items-center gap-1 text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
          <Sparkles className="h-3 w-3" />
          <span>AI Powered</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start gap-2 max-w-[80%]">
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}

              <div
                className={`rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-emerald-600 text-white ml-2"
                    : "bg-zinc-700 text-zinc-100 border border-zinc-600"
                }`}
              >
                {message.content}
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-zinc-700 rounded-lg p-3 flex items-center space-x-2 border border-zinc-600">
                <div
                  className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-700 flex gap-2 bg-zinc-900/50">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-zinc-700 border-zinc-600 focus-visible:ring-purple-500"
        />
        <Button type="submit" disabled={isTyping || !input.trim()} className="bg-purple-600 hover:bg-purple-700">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  )
}

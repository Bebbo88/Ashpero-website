import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, Send, Bot, User, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { DoctorBotIcon } from "@/svgs/FloatingActions.svgs";

const CHAT_STORAGE_KEY = "ashpero_ai_chat_history";

export default function AIChatBox({ onClose, alignment = "end" }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    } else {
      // Default greeting
      setMessages([
        {
          id: "sys-1",
          role: "model",
          text: "أهلاً بك! أنا Dr. ASH، مساعدك الذكي للعناية بالبشرة. كيف يمكنني مساعدتك اليوم؟",
          timestamp: Date.now(),
        },
      ]);
    }
  }, []);

  // Save to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const chatMutation = useMutation({
    mutationFn: async ({ message, history }) => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to send message to AI.");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `model-${Date.now()}`,
          role: "model",
          text: data.response,
          timestamp: Date.now(),
        },
      ]);
    },
    onError: (error) => {
      let friendlyError = "Oops, something went wrong. Please try again.";
      const errStr = error.message?.toLowerCase() || "";
      if (
        errStr.includes("503") ||
        errStr.includes("demand") ||
        errStr.includes("quota")
      ) {
        friendlyError =
          "I'm currently assisting many customers and my system is very busy. Please try again in a few minutes!";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "model",
          text: friendlyError,
          isError: true,
          timestamp: Date.now(),
        },
      ]);
    },
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || chatMutation.isPending) return;

    const userText = inputValue.trim();
    const newUserMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      text: userText,
      timestamp: Date.now(),
    };

    // Filter out system and error messages to keep context pure
    const validHistory = messages.filter((m) => m.id !== "sys-1" && !m.isError);

    // Take the last 10 valid messages, but ensure the first message handed to Gemini is ALWAYS from a "user"
    const recentHistory = validHistory.slice(-10);
    while (recentHistory.length > 0 && recentHistory[0].role !== "user") {
      recentHistory.shift();
    }

    const apiHistory = recentHistory;

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    chatMutation.mutate({ message: userText, history: apiHistory });
  };

  const alignmentClasses =
    alignment === "start"
      ? "start-0 origin-bottom-left"
      : "end-0 origin-bottom-right";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`absolute bottom-20 w-[340px] md:w-[380px] h-[500px] max-h-[70vh] bg-bg-primary border border-border-color shadow-2xl rounded-2xl flex flex-col overflow-hidden z-[200] ${alignmentClasses}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-brand-mint to-brand-dark text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/20 bg-white/10">
            <DoctorBotIcon className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-playfair font-bold text-lg">Dr. ASH</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close Chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-bg-secondary/50 scrollbar-thin">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 max-w-[85%] ${isUser ? "self-end flex-row-reverse" : "self-start"
                }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${isUser
                  ? "bg-brand-mint text-white"
                  : "bg-bg-primary border border-border-color text-brand-mint"
                  }`}
              >
                {isUser ? (
                  <User className="w-4 h-4" />
                ) : (
                  <DoctorBotIcon className="w-4 h-4" />
                )}
              </div>

              <div
                className={`px-4 py-2.5 rounded-2xl text-sm font-montserrat shadow-sm ${isUser
                  ? "bg-brand-mint text-white rounded-tr-sm"
                  : msg.isError
                    ? "bg-status-error-soft text-status-error border border-status-error/20 rounded-tl-sm"
                    : "bg-bg-primary text-text-primary border border-border-color rounded-tl-sm"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {chatMutation.isPending && (
          <div className="flex items-start gap-2 max-w-[85%] self-start text-brand-mint">
            <div className="w-8 h-8 rounded-full bg-bg-primary border border-border-color flex items-center justify-center shrink-0 shadow-sm text-brand-mint">
              <DoctorBotIcon className="w-4 h-4" />
            </div>

            <div className="px-4 py-3 bg-bg-primary border border-border-color rounded-2xl font-montserrat rounded-tl-sm flex items-center gap-2 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-brand-mint" />
              <span className="text-xs text-text-secondary">
                Ash is thinking...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-bg-primary border-t border-border-color">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={chatMutation.isPending}
            placeholder="Ask about skincare..."
            className="w-full pl-4 pr-12 py-3 bg-bg-secondary border border-border-color rounded-full text-sm font-montserrat text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-brand-mint/50 transition-colors disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || chatMutation.isPending}
            className="absolute right-1 w-10 h-10 flex items-center justify-center rounded-full bg-brand-mint text-white hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>

        <div className="text-center mt-2">
          <span className="text-[10px] text-text-secondary">
            Powered by Ashperoo
          </span>
        </div>
      </div>
    </motion.div>
  );
}

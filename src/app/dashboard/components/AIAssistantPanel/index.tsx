"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, RotateCcw, Download, ChevronRight, X } from "lucide-react";
import { useQueryLog } from "../../../hooks/useQueryLog";

interface Message {
  id: number;
  text: string | undefined;
  sender: "user" | "bot";
  loading?: boolean;
}

let globalId = Date.now();
function uniqueId() {
  return ++globalId;
}

function BouncingDots() {
  return (
    <div className="flex justify-center space-x-1">
      <span className="inline-block animate-bounce text-base" style={{ color: "var(--color-primary)", animationDelay: "0ms" }}>.</span>
      <span className="inline-block animate-bounce text-base" style={{ color: "var(--color-primary)", animationDelay: "150ms" }}>.</span>
      <span className="inline-block animate-bounce text-base" style={{ color: "var(--color-primary)", animationDelay: "300ms" }}>.</span>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
      return (
        <li key={i} className="ml-4 list-disc text-gray-900 text-sm leading-relaxed">
          {renderInline(line.trim().slice(2))}
        </li>
      );
    }
    if (line.trim() === "") return <br key={i} />;
    return (
      <p key={i} className="text-gray-900 text-sm leading-relaxed">
        {renderInline(line)}
      </p>
    );
  });
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-primary-dark">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function AIAssistantPanel() {
  const { submitQuery } = useQueryLog();
  const [input, setInput] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [greeted, setGreeted] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const suggestions = [
    "Which regions in East Africa face the highest maternal mortality risk due to conflict?",
    "How has healthcare access deteriorated in Tigray since the war?",
    "What infectious disease outbreaks are linked to displacement camps in Somalia?",
    "Compare malnutrition rates in active vs. post-conflict zones in South Sudan",
    "What mental health burden is expected in northern Ethiopia over the next 5 years?",
  ];

  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed);
      setGreeted(true);
      const hasConversation = parsed.some((msg: Message) => !isGreeting(msg));
      if (!hasConversation) {
        setShowSuggestions(true);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (open && !greeted && messages.length === 0) {
      const greeting: Message = {
        id: uniqueId(),
        text: "Hi, I'm Tesfa AI — I provide health risk assessments for conflict-affected regions in East Africa.",
        sender: "bot",
      };
      setMessages([greeting]);
      setGreeted(true);
      setShowSuggestions(true);
    }
  }, [open, greeted, messages.length]);

  const handleSuggestionClick = (question: string) => {
    setInput(question);
    setShowSuggestions(false);
    setTimeout(() => {
      handleSendWithText(question);
    }, 0);
  };

  const handleSendWithText = useCallback(async (queryText: string) => {
    setInput("");
    setSending(true);
    setMessages((prev) =>
      prev.filter((msg) => !msg.text?.includes("Hi, I'm Tesfa"))
    );
    const userMessage: Message = {
      id: uniqueId(),
      text: queryText,
      sender: "user",
    };
    const botLoading: Message = {
      id: uniqueId(),
      text: undefined,
      sender: "bot",
      loading: true,
    };
    setMessages((prev) => [...prev, userMessage, botLoading]);
    try {
      const result = await submitQuery(queryText);
      const responseText = result?.response ?? "No response received";
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botLoading.id
            ? { ...msg, text: responseText, loading: false }
            : msg
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botLoading.id
            ? { ...msg, text: "Failed to load response", loading: false }
            : msg
        )
      );
    } finally {
      setSending(false);
    }
  }, [submitQuery]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || sending) return;
    setShowSuggestions(false);
    await handleSendWithText(input);
  }, [input, sending, handleSendWithText]);

  const handleReset = () => {
    const greeting: Message = {
      id: uniqueId(),
      text: "Hi, I'm Tesfa AI — I provide health risk assessments for conflict-affected regions in East Africa.",
      sender: "bot",
    };
    setMessages([greeting]);
    localStorage.setItem("chatHistory", JSON.stringify([greeting]));
    setGreeted(true);
    setShowSuggestions(true);
  };

  const handleDownload = () => {
    const chatText = messages
      .map((msg) => `${msg.sender === "user" ? "You" : "Bot"}: ${msg.text}`)
      .join("\n\n");
    const blob = new Blob([chatText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Toggle tab — right edge, only when panel is closed */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={() => setOpen(true)}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-[1150]
                       w-14 h-32 flex flex-col items-center justify-center gap-2
                       shadow-lg cursor-pointer group
                       bg-accent text-primary-dark
                       rounded-l-xl"
            aria-label="Open AI Assistant"
          >
            <MessageCircle size={22} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ writingMode: "vertical-rl" }}>
              Chat
            </span>
            <ChevronRight size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Side panel */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            className="fixed right-0 top-0 z-[1160] h-screen w-[420px] flex flex-col bg-surface border-l border-border-light"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 shrink-0 bg-primary text-white">
              <div>
                <h2 className="text-lg font-bold">Tesfa AI</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-surface/10 transition-colors cursor-pointer rounded-md"
                aria-label="Close panel"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-surface-secondary">
              {messages.map((msg, index) => (
                <div key={msg.id}>
                  <div
                    className={`flex ${
                      isGreeting(msg) ? "justify-center" : msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-3 max-w-[85%] break-words rounded-xl text-sm
                        ${isGreeting(msg)
                          ? "bg-primary-light text-primary-dark font-medium text-center px-5"
                          : msg.sender === "user"
                          ? "bg-primary text-white"
                          : "bg-surface text-gray-900 border border-border-light shadow-sm"
                        }`}
                    >
                      {msg.loading ? (
                        <BouncingDots />
                      ) : isGreeting(msg) ? (
                        <span>{msg.text}</span>
                      ) : msg.sender === "bot" ? (
                        <div className="space-y-1">
                          {renderMarkdown(msg.text || "")}
                        </div>
                      ) : (
                        <span>{msg.text}</span>
                      )}
                    </div>
                  </div>
                  {msg.sender === "bot" && !msg.loading && !isGreeting(msg) && index === messages.length - 1 && (
                    <div className="flex justify-start mt-2 space-x-3 pl-2">
                      <button
                        onClick={handleReset}
                        className="flex cursor-pointer items-center space-x-1 text-xs text-gray-400 transition-colors"
                        title="New chat"
                      >
                        <RotateCcw size={14} />
                      </button>
                      <button
                        onClick={handleDownload}
                        className="flex cursor-pointer items-center space-x-1 text-xs text-gray-400 transition-colors"
                        title="Download chat"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {showSuggestions && (
                <div className="flex flex-col gap-2 px-1">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Try asking</p>
                  {suggestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(q)}
                      className="text-left px-4 py-2.5 text-sm text-primary-dark bg-surface border border-border rounded-xl hover:border-primary hover:bg-primary-light transition-all cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="p-4 shrink-0 border-t border-border-light bg-surface">
              <div className="relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="w-full px-5 py-3 pr-12 outline-none text-sm rounded-full bg-surface-secondary border border-border text-gray-900"
                  placeholder="Ask about health risks..."
                  disabled={sending}
                  aria-label="Chat input"
                  autoComplete="off"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 transition-colors cursor-pointer disabled:opacity-40 rounded-full"
                  style={{ color: input.trim() ? "var(--color-accent)" : undefined }}
                  aria-label="Send message"
                >
                  <Send size={18} className="transform rotate-35" />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function isGreeting(msg: Message): boolean {
  return !!msg.text?.includes("Hi, I'm Tesfa");
}

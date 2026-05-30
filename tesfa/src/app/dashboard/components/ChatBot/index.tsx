"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, RotateCcw, Download } from "lucide-react";
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
    <div className="bouncing-loader flex justify-center space-x-1">
      <span className="dot animate-bounce delay-150">.</span>
      <span className="dot animate-bounce delay-300">.</span>
      <span className="dot animate-bounce delay-450">.</span>
      <style>{`
        .dot {
          font-size: 20px;
          color: var(--color-primary);
          animation-duration: 0.6s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          display: inline-block;
        }
        .delay-150 { animation-delay: 150ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-450 { animation-delay: 450ms; }
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
      const content = line.trim().slice(2);
      return (
        <li key={i} className="ml-4 list-disc text-base leading-relaxed text-gray-900">
          {renderInline(content)}
        </li>
      );
    }
    if (line.trim() === "") return <br key={i} />;
    return (
      <p key={i} className="text-base leading-relaxed text-gray-900">
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

function isGreeting(msg: Message): boolean {
  return !!msg.text?.includes("Hi, I'm Tesfa");
}

export default function ChatWidget() {
  const { submitQuery } = useQueryLog();
  const [input, setInput] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [localLogs, setLocalLogs] = useState<Message[]>([]);
  const [greeted, setGreeted] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) {
      setLocalLogs(JSON.parse(saved));
      setGreeted(true);
    }
  }, []);

  useEffect(() => {
    if (localLogs.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(localLogs));
    }
  }, [localLogs]);

  useEffect(() => {
    if (open && !greeted && localLogs.length === 0) {
      const greetingMessage: Message = {
        id: uniqueId(),
        text: "Hi, I'm Tesfa AI — I provide health risk assessments for conflict-affected regions in East Africa. Ask me about disease risks, recommended interventions, or general health topics related to conflict zones.",
        sender: "bot",
      };
      setLocalLogs([greetingMessage]);
      setGreeted(true);
    }
  }, [open, greeted, localLogs.length]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const queryText = input;
    setInput("");
    setSending(true);
    setLocalLogs((prev) =>
      prev.filter((msg) => !msg.text?.includes("Hi, I'm Tesfa"))
    );
    const userMessage: Message = {
      id: uniqueId(),
      text: queryText,
      sender: "user",
    };
    const botLoadingMessage: Message = {
      id: uniqueId(),
      text: undefined,
      sender: "bot",
      loading: true,
    };
    setLocalLogs((prev) => [...prev, userMessage, botLoadingMessage]);
    try {
      const result = await submitQuery(queryText);
      const responseText = result?.response ?? "No response received";
      setLocalLogs((prev) =>
        prev.map((msg) =>
          msg.id === botLoadingMessage.id
            ? { ...msg, text: responseText, loading: false }
            : msg
        )
      );
    } catch {
      setLocalLogs((prev) =>
        prev.map((msg) =>
          msg.id === botLoadingMessage.id
            ? { ...msg, text: "Failed to load response", loading: false }
            : msg
        )
      );
    } finally {
      setSending(false);
    }
  };

  const handleDownloadChat = () => {
    const chatText = localLogs
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

  const handleReloadChat = () => {
    const greetingMessage: Message = {
      id: uniqueId(),
      text: "Hi, I'm Tesfa AI — I provide health risk assessments for conflict-affected regions in East Africa. Ask me about disease risks, recommended interventions, or general health topics related to conflict zones.",
      sender: "bot",
    };
    setLocalLogs([greetingMessage]);
    localStorage.setItem("chatHistory", JSON.stringify([greetingMessage]));
    setGreeted(true);
  };

  return (
    <div className="fixed right-5 top-8 z-[1150] flex flex-col items-end space-y-2">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-16 cursor-pointer h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 bg-accent"
          aria-label="Open chat"
        >
          <MessageCircle size={32} />
        </button>
      )}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-[680px] h-[700px] shadow-2xl rounded-2xl flex flex-col relative bg-surface border border-border-light"
        >
          {/* Header */}
          <div className="p-4 flex justify-between items-center rounded-t-2xl bg-primary border-b border-border-light">
            <span className="font-bold text-xl text-white">Tesfa AI</span>
            <button
              onClick={() => setOpen(false)}
              className="text-white cursor-pointer hover:opacity-80 text-xl"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-secondary">
            {localLogs.map((msg, index) => (
              <div key={msg.id}>
                <div
                  className={`flex ${
                    isGreeting(msg)
                      ? "justify-center"
                      : msg.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[85%] break-words text-sm ${
                      isGreeting(msg)
                        ? "bg-primary-light text-primary-dark font-semibold text-center px-6"
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
                {msg.sender === "bot" &&
                  !msg.loading &&
                  !isGreeting(msg) &&
                  index === localLogs.length - 1 && (
                    <div className="flex justify-start mt-2 space-x-3 pl-2">
                      <button
                        onClick={handleReloadChat}
                        className="flex cursor-pointer items-center space-x-1 text-sm transition-colors text-gray-400"
                        title="New chat"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        onClick={handleDownloadChat}
                        className="flex cursor-pointer items-center space-x-1 text-sm transition-colors text-gray-400"
                        title="Download chat"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 rounded-b-2xl bg-surface border-t border-border-light">
            <div className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="w-full rounded-full px-4 py-3 pr-12 outline-none text-base border border-border bg-surface-secondary text-gray-900"
                placeholder="Ask about health risks..."
                disabled={sending}
                aria-label="Chat input"
                autoComplete="off"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors disabled:opacity-50 ${input.trim() ? 'text-accent' : 'text-gray-400'}`}
                aria-label="Send message"
              >
                <Send size={22} className="transform cursor-pointer rotate-35" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
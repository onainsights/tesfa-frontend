"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
export default function MapTitleCard() {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  return (
    <div className="absolute top-6 left-6 z-[1150] max-w-sm">
      <div className="bg-surface/90 backdrop-blur-sm rounded-2xl shadow-lg p-5">
        <h1 className="text-2xl font-bold text-accent-muted leading-tight">
          East Africa Health Risk Outlook
        </h1>
        <p className="text-base text-primary-dark/70 mt-2 leading-relaxed font-medium">
          What are the long-term health risks in conflict-affected regions?
        </p>
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
              expanded ? "text-primary" : "text-gray-400 hover:text-primary"
            }`}
          >
            <Info size={14} />
            {expanded ? "Hide details" : "How this works"}
          </button>
          <button
            onClick={() => router.push("/methodology")}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-primary transition-colors cursor-pointer"
          >
            <ExternalLink size={14} />
            View methodology
          </button>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-border text-xs text-gray-500 space-y-2">
                <p>
                  AI-generated health risk assessments based on historical
                  conflict data, displacement patterns, healthcare access
                  indicators, and disease surveillance records from 2000–2025.
                </p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#E8543A] inline-block"></span>
                    Active war
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#BA6D58] inline-block"></span>
                    Post-war
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#386c80ff] inline-block"></span>
                    No war
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

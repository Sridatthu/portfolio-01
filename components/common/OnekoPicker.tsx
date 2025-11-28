"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const variants = [
  ["classic", "Classic"],
  ["dog", "Dog"],
  ["tora", "Tora"],
  ["maia", "Maia"],
  ["vaporwave", "Vaporwave"],
];

export default function OnekoPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentVariant, setCurrentVariant] = useState("classic");

  useEffect(() => {
    // Check local storage for initial variant
    const stored = localStorage.getItem("oneko:variant");
    if (stored) {
      try {
        setCurrentVariant(JSON.parse(stored));
      } catch {}
    }

    const handleOpen = () => setIsOpen(true);
    window.addEventListener("oneko:open-picker", handleOpen);
    return () => window.removeEventListener("oneko:open-picker", handleOpen);
  }, []);

  const handleSelect = (variantId: string) => {
    setCurrentVariant(variantId);
    window.dispatchEvent(
      new CustomEvent("oneko:set-variant", { detail: variantId })
    );
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100000] bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Choose your companion
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
                {variants.map(([id, name]) => (
                  <button
                    key={id}
                    onClick={() => handleSelect(id)}
                    className={`
                      group relative flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-200
                      ${
                        currentVariant === id
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 ring-2 ring-blue-500/20"
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                      }
                    `}
                  >
                    <div className="relative w-12 h-12">
                      <div
                        className="w-[32px] h-[32px] mx-auto"
                        style={{
                          backgroundImage: `url('/oneko/oneko-${id}.gif')`,
                          backgroundPosition: "-32px -32px", // Show a specific frame (e.g., sitting/alert)
                          transform: "scale(1.5)",
                          transformOrigin: "center",
                          imageRendering: "pixelated",
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

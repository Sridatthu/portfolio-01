"use client";

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
    const stored = localStorage.getItem("oneko:variant");
    if (stored) {
      try {
        setCurrentVariant(JSON.parse(stored));
      } catch { }
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

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        data-state="open"
        onClick={() => setIsOpen(false)}
      />
      <div
        role="dialog"
        data-state="open"
        className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg"
        style={{ pointerEvents: "auto" }}
      >
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h2 className="text-lg leading-none font-semibold">
            Choose your neko
          </h2>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {variants.map(([id, name]) => (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive btn-inner-shadow hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 px-4 py-2 has-[>svg]:px-3 rounded-lg border ${currentVariant === id ? "ring-2 ring-primary border-primary" : ""
                }`}
              aria-label={name}
              style={{
                width: "32px",
                height: "32px",
                backgroundImage: `url('/oneko/oneko-${id}.gif')`,
                backgroundPosition: "-96px -96px",
                backgroundRepeat: "no-repeat",
                imageRendering: "pixelated",
              }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:cursor-pointer"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </>
  );
}

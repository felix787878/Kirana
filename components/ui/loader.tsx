"use client";

import React from "react";

type LoaderFiveProps = {
  text?: string;
  className?: string;
};

export function LoaderFive({ text = "Loading...", className = "" }: LoaderFiveProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 animate-bounce rounded-full bg-cyan-500 [animation-delay:-0.3s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-sky-500 [animation-delay:-0.15s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-cyan-700" />
      </div>
      <p className="text-sm font-medium text-slate-700">{text}</p>
    </div>
  );
}

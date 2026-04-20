"use client";

import { useState, useEffect, useCallback } from "react";
import { type Cell } from "@/lib/gameData";
import { ArrowLeft } from "lucide-react";

interface Props {
  cell: Cell;
  onResult: (success: boolean) => void;
  onBack: () => void;
}

const GRID = 16;
const EGGS_TO_FIND = 5;

export function MemoryGame({ cell, onResult, onBack }: Props) {
  const [phase, setPhase] = useState<"ready" | "reveal" | "hide" | "guess" | "done">("ready");
  const [eggPositions, setEggPositions] = useState<number[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>(Array(GRID).fill(false));
  const [found, setFound] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(cell.challenge.timeLimit);
  const [showTime, setShowTime] = useState(3);

  const generateEggs = useCallback(() => {
    const positions: number[] = [];
    while (positions.length < EGGS_TO_FIND) {
      const p = Math.floor(Math.random() * GRID);
      if (!positions.includes(p)) positions.push(p);
    }
    return positions;
  }, []);

  const start = () => {
    const eggs = generateEggs();
    setEggPositions(eggs);
    setFound([]);
    setWrong([]);
    setFlipped(Array(GRID).fill(true)); // show all
    setPhase("reveal");
    setShowTime(3);
  };

  // Countdown to hide
  useEffect(() => {
    if (phase !== "reveal") return;
    const t = setInterval(() => setShowTime(s => {
      if (s <= 1) {
        clearInterval(t);
        setFlipped(Array(GRID).fill(false));
        setPhase("guess");
        return 0;
      }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Game timer
  useEffect(() => {
    if (phase !== "guess") return;
    const t = setInterval(() => setTimeLeft(prev => {
      if (prev <= 1) { clearInterval(t); onResult(false); return 0; }
      return prev - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [phase, onResult]);

  const handleTap = (idx: number) => {
    if (phase !== "guess") return;
    if (found.includes(idx) || wrong.includes(idx)) return;

    if (eggPositions.includes(idx)) {
      const newFound = [...found, idx];
      setFound(newFound);
      if (newFound.length === EGGS_TO_FIND) {
        setPhase("done");
        setTimeout(() => onResult(true), 600);
      }
    } else {
      setWrong(prev => [...prev, idx]);
      setTimeout(() => setWrong(prev => prev.filter(i => i !== idx)), 500);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 flex items-center justify-between flex-shrink-0 border-b border-[#1a1a1a]">
        <button onClick={onBack} className="text-[#444] hover:text-white p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-6 text-center">
          {phase === "reveal" && (
            <p className="font-mono-game text-yellow-400 font-bold text-xl">MEMORIZE! {showTime}s</p>
          )}
          {phase === "guess" && (
            <>
              <div>
                <p className="font-mono-game text-orange-500 font-bold text-xl">{found.length}/{EGGS_TO_FIND}</p>
                <p className="font-mono-game text-[#444] text-[10px]">FOUND</p>
              </div>
              <div>
                <p className={`font-mono-game font-bold text-xl ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>{timeLeft}s</p>
                <p className="font-mono-game text-[#444] text-[10px]">TIME</p>
              </div>
            </>
          )}
        </div>
      </div>

      {phase === "ready" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <p className="text-5xl mb-4">🪺</p>
          <p className="font-mono-game text-[#666] text-sm text-center mb-8">{cell.challenge.instructions}</p>
          <button onClick={start} className="w-full bg-orange-500 text-white font-bold py-4 text-xl">
            SHOW ME THE EGGS
          </button>
        </div>
      )}

      {(phase === "reveal" || phase === "guess" || phase === "done") && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="grid grid-cols-4 gap-2 w-full max-w-xs">
            {Array(GRID).fill(0).map((_, idx) => {
              const isEgg = eggPositions.includes(idx);
              const isFound = found.includes(idx);
              const isWrong = wrong.includes(idx);
              const showing = phase === "reveal";

              return (
                <button
                  key={idx}
                  onPointerDown={() => handleTap(idx)}
                  className="aspect-square rounded-lg flex items-center justify-center text-2xl transition-all duration-300"
                  style={{
                    background: isFound ? "#15803d22" : isWrong ? "#ef444422" : "#0d0d0d",
                    border: `2px solid ${isFound ? "#22c55e" : isWrong ? "#ef4444" : "#1a1a1a"}`,
                    transform: isWrong ? "scale(0.9)" : "scale(1)",
                  }}
                >
                  {showing && isEgg ? "🥚" : isFound ? "🥚" : isWrong ? "❌" : "🐚"}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

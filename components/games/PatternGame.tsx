"use client";

import { useState, useMemo } from "react";
import { type Cell } from "@/lib/gameData";
import { ArrowLeft } from "lucide-react";

interface Props {
  cell: Cell;
  onResult: (success: boolean) => void;
  onBack: () => void;
}

const WIRE_COLORS = ["🔴", "🔵", "🟡", "🟢", "🟠"];
const WIRE_NAMES = ["Red", "Blue", "Yellow", "Green", "Orange"];

export function PatternGame({ cell, onResult, onBack }: Props) {
  const pairs = useMemo(() => {
    // 4 wire pairs to match
    const n = 4;
    const order = [...Array(n).keys()].sort(() => Math.random() - 0.5);
    return order;
  }, []);

  const [leftSelected, setLeftSelected] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrong, setWrong] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Left side: in order 0,1,2,3
  // Right side: pairs[i] = which left wire it connects to
  const rightOrder = useMemo(() => {
    const r = [...pairs];
    return r.sort(() => Math.random() - 0.5);
  }, [pairs]);

  const handleRight = (rightIdx: number) => {
    if (leftSelected === null) return;
    const correctRight = rightOrder.findIndex(v => v === leftSelected);
    setAttempts(a => a + 1);
    if (rightIdx === correctRight) {
      const newMatched = [...matched, leftSelected];
      setMatched(newMatched);
      setLeftSelected(null);
      if (newMatched.length === pairs.length) {
        setTimeout(() => onResult(true), 500);
      }
    } else {
      setWrong(true);
      setTimeout(() => { setWrong(false); setLeftSelected(null); }, 700);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#1a1a1a]">
        <button onClick={onBack} className="text-[#444] hover:text-white p-1"><ArrowLeft className="w-5 h-5" /></button>
        <p className="font-mono-game text-orange-500 text-sm">WIRE MATCHING</p>
      </div>
      <div className={`flex-1 flex flex-col p-6 gap-6 transition-colors ${wrong ? 'bg-red-900/10' : ''}`}>
        <p className="font-mono-game text-[#666] text-xs text-center">
          {leftSelected === null ? "TAP A LEFT WIRE TO SELECT" : `${WIRE_NAMES[leftSelected]} selected — tap matching right wire`}
        </p>

        <div className="flex gap-4 items-stretch flex-1">
          {/* Left side */}
          <div className="flex-1 flex flex-col gap-3">
            <p className="font-mono-game text-[#444] text-[10px] text-center tracking-widest">YOUR SIDE</p>
            {pairs.map((_, i) => {
              const isMatched = matched.includes(i);
              const isSelected = leftSelected === i;
              return (
                <button
                  key={i}
                  onClick={() => !isMatched && setLeftSelected(i)}
                  disabled={isMatched}
                  className="flex-1 flex items-center gap-2 px-3 py-3 border transition-all"
                  style={{
                    borderColor: isMatched ? "#22c55e" : isSelected ? "#f97316" : "#2a2a2a",
                    background: isMatched ? "#22c55e11" : isSelected ? "#f9731611" : "#0d0d0d",
                    opacity: isMatched ? 0.6 : 1,
                  }}
                >
                  <span className="text-2xl">{WIRE_COLORS[i]}</span>
                  <span className="font-mono-game text-sm">{WIRE_NAMES[i]}</span>
                  {isMatched && <span className="ml-auto text-green-400 text-sm">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Wire lines visual */}
          <div className="flex flex-col items-center justify-around py-6">
            {pairs.map((_, i) => (
              <div key={i} className="w-8 h-px" style={{ background: matched.includes(rightOrder[i]) ? WIRE_COLORS[rightOrder[i]] === "🔴" ? "#ef4444" : "#888" : "#2a2a2a" }} />
            ))}
          </div>

          {/* Right side */}
          <div className="flex-1 flex flex-col gap-3">
            <p className="font-mono-game text-[#444] text-[10px] text-center tracking-widest">PARTNER'S SIDE</p>
            {rightOrder.map((wireSrc, i) => {
              const isMatched = matched.includes(wireSrc);
              return (
                <button
                  key={i}
                  onClick={() => handleRight(i)}
                  disabled={isMatched || leftSelected === null}
                  className="flex-1 flex items-center gap-2 px-3 py-3 border transition-all"
                  style={{
                    borderColor: isMatched ? "#22c55e" : "#2a2a2a",
                    background: isMatched ? "#22c55e11" : "#0d0d0d",
                    opacity: isMatched ? 0.6 : leftSelected === null ? 0.5 : 1,
                  }}
                >
                  <span className="text-2xl">{WIRE_COLORS[wireSrc]}</span>
                  <span className="font-mono-game text-sm">Wire {i + 1}</span>
                  {isMatched && <span className="ml-auto text-green-400 text-sm">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        <p className="font-mono-game text-[#444] text-xs text-center">
          {matched.length}/{pairs.length} matched · {attempts} attempts
        </p>
      </div>
    </div>
  );
}

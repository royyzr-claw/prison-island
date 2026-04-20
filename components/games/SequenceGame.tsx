"use client";

import { useState, useEffect, useCallback } from "react";
import { type Cell } from "@/lib/gameData";
import { ArrowLeft } from "lucide-react";

interface Props {
  cell: Cell;
  onResult: (success: boolean) => void;
  onBack: () => void;
}

const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#eab308"];
const COLOR_LABELS = ["RED", "BLUE", "GREEN", "YELLOW"];

export function SequenceGame({ cell, onResult, onBack }: Props) {
  const [phase, setPhase] = useState<"ready" | "show" | "input" | "win" | "lose">("ready");
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(cell.challenge.timeLimit);
  const MAX_ROUNDS = 5;

  const generateSequence = useCallback((len: number) => {
    return Array.from({ length: len }, () => Math.floor(Math.random() * 4));
  }, []);

  const showSequence = useCallback(async (seq: number[]) => {
    setPhase("show");
    setPlayerInput([]);
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 500));
      setActiveIdx(seq[i]);
      await new Promise(r => setTimeout(r, 600));
      setActiveIdx(null);
    }
    await new Promise(r => setTimeout(r, 300));
    setPhase("input");
  }, []);

  const startRound = useCallback((r: number) => {
    const seq = generateSequence(r + 2);
    setSequence(seq);
    setRound(r);
    showSequence(seq);
  }, [generateSequence, showSequence]);

  const handleStart = () => {
    setTimeLeft(cell.challenge.timeLimit);
    startRound(1);
  };

  useEffect(() => {
    if (phase !== "input") return;
    const t = setInterval(() => setTimeLeft(prev => {
      if (prev <= 1) { clearInterval(t); setPhase("lose"); return 0; }
      return prev - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const handleInput = (idx: number) => {
    if (phase !== "input") return;
    const newInput = [...playerInput, idx];
    setActiveIdx(idx);
    setTimeout(() => setActiveIdx(null), 200);

    const correct = sequence.slice(0, newInput.length);
    if (newInput.some((v, i) => v !== correct[i])) {
      setPhase("lose");
      setTimeout(() => onResult(false), 800);
      return;
    }

    setPlayerInput(newInput);

    if (newInput.length === sequence.length) {
      if (round >= MAX_ROUNDS) {
        setPhase("win");
        setTimeout(() => onResult(true), 800);
      } else {
        setPhase("show");
        setTimeout(() => startRound(round + 1), 1000);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 flex items-center justify-between flex-shrink-0 border-b border-[#1a1a1a]">
        <button onClick={onBack} className="text-[#444] hover:text-white p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-6 text-center">
          <div>
            <p className="font-mono-game text-orange-500 font-bold text-lg">{round}/{MAX_ROUNDS}</p>
            <p className="font-mono-game text-[#444] text-[10px]">ROUND</p>
          </div>
          {phase === "input" && (
            <div>
              <p className={`font-mono-game font-bold text-lg ${timeLeft < 5 ? 'text-red-500' : 'text-white'}`}>{timeLeft}s</p>
              <p className="font-mono-game text-[#444] text-[10px]">TIME</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        {phase === "ready" && (
          <>
            <p className="text-4xl">🐱</p>
            <p className="font-mono-game text-[#666] text-sm text-center">{cell.challenge.instructions}</p>
            <button onClick={handleStart} className="w-full bg-orange-500 text-white font-bold py-4 text-xl">
              START
            </button>
          </>
        )}

        {(phase === "show" || phase === "input") && (
          <>
            <p className="font-mono-game text-[#666] text-xs tracking-widest">
              {phase === "show" ? "WATCH THE SEQUENCE..." : `YOUR TURN — ${sequence.length - playerInput.length} left`}
            </p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
              {COLORS.map((color, i) => (
                <button
                  key={i}
                  onPointerDown={() => handleInput(i)}
                  disabled={phase === "show"}
                  className="h-24 rounded-lg transition-all duration-100 active:scale-95 flex items-center justify-center font-mono-game font-bold text-sm"
                  style={{
                    backgroundColor: activeIdx === i ? color : color + "33",
                    border: `2px solid ${color}`,
                    color: activeIdx === i ? "#000" : color,
                    opacity: phase === "show" ? 0.7 : 1,
                    transform: activeIdx === i ? "scale(1.05)" : "scale(1)",
                    boxShadow: activeIdx === i ? `0 0 20px ${color}66` : "none",
                  }}
                >
                  {COLOR_LABELS[i]}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {sequence.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < playerInput.length ? 'bg-orange-500' : 'bg-[#333]'}`} />
              ))}
            </div>
          </>
        )}

        {phase === "win" && (
          <div className="text-center">
            <p className="text-5xl mb-3">✅</p>
            <p className="font-chakra font-bold text-2xl text-green-400">PERFECT!</p>
          </div>
        )}

        {phase === "lose" && (
          <div className="text-center">
            <p className="text-5xl mb-3">❌</p>
            <p className="font-chakra font-bold text-2xl text-red-500">WRONG!</p>
          </div>
        )}
      </div>
    </div>
  );
}

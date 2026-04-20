"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { type Cell } from "@/lib/gameData";
import { ArrowLeft } from "lucide-react";

interface Props {
  cell: Cell;
  onResult: (success: boolean) => void;
  onBack: () => void;
}

const GRID_SIZE = 9;
const TARGET_SCORE = 20;
const MAX_MISSES = 3;

export function WhackGame({ cell, onResult, onBack }: Props) {
  const [started, setStarted] = useState(false);
  const [moles, setMoles] = useState<boolean[]>(Array(GRID_SIZE).fill(false));
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(cell.challenge.timeLimit);
  const [whacked, setWhacked] = useState<number | null>(null);
  const moleTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const spawnTimer = useRef<NodeJS.Timeout | undefined>(undefined);
  const gameTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  const hideMole = useCallback((idx: number, missed: boolean) => {
    setMoles(prev => {
      const next = [...prev];
      next[idx] = false;
      return next;
    });
    if (missed) {
      setMisses(m => m + 1);
    }
    moleTimers.current.delete(idx);
  }, []);

  const spawnMole = useCallback(() => {
    const available: number[] = [];
    setMoles(prev => {
      for (let i = 0; i < GRID_SIZE; i++) {
        if (!prev[i]) available.push(i);
      }
      return prev;
    });

    if (available.length === 0) return;
    const idx = available[Math.floor(Math.random() * available.length)];
    setMoles(prev => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });

    const timer = setTimeout(() => hideMole(idx, true), 1200);
    moleTimers.current.set(idx, timer);
  }, [hideMole]);

  const start = () => {
    setStarted(true);
    setScore(0);
    setMisses(0);
    setTimeLeft(cell.challenge.timeLimit);
  };

  useEffect(() => {
    if (!started) return;
    spawnTimer.current = setInterval(spawnMole as () => void, 700);
    gameTimer.current = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => {
      clearInterval(spawnTimer.current);
      clearInterval(gameTimer.current);
      moleTimers.current.forEach(t => clearTimeout(t));
    };
  }, [started, spawnMole]);

  useEffect(() => {
    if (!started) return;
    if (score >= TARGET_SCORE) {
      clearInterval(spawnTimer.current);
      clearInterval(gameTimer.current);
      setTimeout(() => onResult(true), 400);
    }
    if (misses >= MAX_MISSES || timeLeft === 0) {
      clearInterval(spawnTimer.current);
      clearInterval(gameTimer.current);
      onResult(score >= TARGET_SCORE);
    }
  }, [score, misses, timeLeft, started, onResult]);

  const handleWhack = (idx: number) => {
    if (!moles[idx]) return;
    const timer = moleTimers.current.get(idx);
    if (timer) {
      clearTimeout(timer);
      moleTimers.current.delete(idx);
    }
    setMoles(prev => {
      const next = [...prev];
      next[idx] = false;
      return next;
    });
    setScore(s => s + 1);
    setWhacked(idx);
    setTimeout(() => setWhacked(null), 150);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 flex items-center justify-between flex-shrink-0 border-b border-[#1a1a1a]">
        <button onClick={onBack} className="text-[#444] hover:text-white p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-6 text-center">
          <div>
            <p className="font-mono-game text-orange-500 font-bold text-xl">{score}/{TARGET_SCORE}</p>
            <p className="font-mono-game text-[#444] text-[10px]">WHACKS</p>
          </div>
          <div>
            <p className={`font-mono-game font-bold text-xl ${timeLeft < 8 ? 'text-red-500' : 'text-white'}`}>{timeLeft}s</p>
            <p className="font-mono-game text-[#444] text-[10px]">TIME</p>
          </div>
          <div>
            <p className="font-mono-game text-red-400 font-bold text-xl">{misses}/{MAX_MISSES}</p>
            <p className="font-mono-game text-[#444] text-[10px]">MISS</p>
          </div>
        </div>
      </div>

      {!started ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <p className="text-5xl mb-4">🔨</p>
          <p className="font-mono-game text-[#666] text-sm text-center mb-8">{cell.challenge.instructions}</p>
          <button onClick={start} className="w-full bg-orange-500 text-white font-bold py-4 text-xl">
            START WHACKING
          </button>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
            {moles.map((active, idx) => (
              <button
                key={idx}
                onPointerDown={() => handleWhack(idx)}
                className="aspect-square rounded-xl flex items-center justify-center text-4xl transition-all"
                style={{
                  background: active ? "#1a1a0a" : "#0d0d0d",
                  border: `2px solid ${active ? "#eab308" : "#1a1a1a"}`,
                  transform: whacked === idx ? "scale(0.85)" : active ? "scale(1.05)" : "scale(1)",
                  boxShadow: active ? "0 0 15px rgba(234,179,8,0.3)" : "none",
                }}
              >
                {active ? "🐹" : whacked === idx ? "💥" : ""}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

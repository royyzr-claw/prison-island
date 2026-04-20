"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { type Cell } from "@/lib/gameData";
import { ArrowLeft } from "lucide-react";

interface Props {
  cell: Cell;
  onResult: (success: boolean) => void;
  onBack: () => void;
}

interface Target {
  id: number;
  x: number;
  y: number;
  active: boolean;
}

export function ReflexGame({ cell, onResult, onBack }: Props) {
  const [timeLeft, setTimeLeft] = useState(cell.challenge.timeLimit);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const [started, setStarted] = useState(false);
  const [flash, setFlash] = useState<"hit" | "miss" | null>(null);
  const nextId = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const spawnRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Game config based on cell
  const isJoker = cell.name === "Joker";
  const isPenalty = cell.name === "Penalty";
  const isHitman = cell.name === "Hitman";
  const isSharkyBay = cell.name === "Shark Bay";

  const TARGET_GOAL = isHitman ? 15 : isPenalty ? 5 : 10;
  const MAX_MISSES = isHitman ? 3 : 5;
  const SPAWN_INTERVAL = cell.stressLevel >= 80 ? 800 : cell.stressLevel >= 60 ? 1100 : 1400;

  const spawnTarget = useCallback(() => {
    const id = nextId.current++;
    setTargets(prev => {
      const next: Target = {
        id,
        x: 10 + Math.random() * 75,
        y: 15 + Math.random() * 65,
        active: true,
      };
      return [...prev.filter(t => t.active), next].slice(-6);
    });

    // Auto-expire
    setTimeout(() => {
      setTargets(prev => {
        const t = prev.find(t => t.id === id);
        if (t?.active) {
          setMisses(m => m + 1);
          setFlash("miss");
          setTimeout(() => setFlash(null), 200);
        }
        return prev.filter(t => t.id !== id);
      });
    }, SPAWN_INTERVAL * 1.5);
  }, [SPAWN_INTERVAL]);

  const start = () => {
    setStarted(true);
    setScore(0);
    setMisses(0);
    setTargets([]);
  };

  useEffect(() => {
    if (!started) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          clearInterval(spawnRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    spawnRef.current = setInterval(spawnTarget, SPAWN_INTERVAL);
    spawnTarget();
    return () => {
      clearInterval(timerRef.current);
      clearInterval(spawnRef.current);
    };
  }, [started, spawnTarget, SPAWN_INTERVAL]);

  useEffect(() => {
    if (!started) return;
    if (score >= TARGET_GOAL) {
      clearInterval(timerRef.current);
      clearInterval(spawnRef.current);
      setTimeout(() => onResult(true), 300);
    }
    if (misses >= MAX_MISSES) {
      clearInterval(timerRef.current);
      clearInterval(spawnRef.current);
      setTimeout(() => onResult(false), 300);
    }
    if (timeLeft === 0 && started) {
      onResult(score >= TARGET_GOAL);
    }
  }, [score, misses, timeLeft, started, TARGET_GOAL, MAX_MISSES, onResult]);

  const hitTarget = (id: number) => {
    setTargets(prev => prev.filter(t => t.id !== id));
    setScore(s => s + 1);
    setFlash("hit");
    setTimeout(() => setFlash(null), 150);
  };

  // Shark Bay - DON'T TAP
  if (isSharkyBay) {
    return <SharkBayGame cell={cell} onResult={onResult} onBack={onBack} />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between flex-shrink-0 transition-colors ${
        flash === "hit" ? "bg-green-500/20" : flash === "miss" ? "bg-red-500/20" : "bg-transparent"
      }`}>
        <button onClick={onBack} className="text-[#444] hover:text-white p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-6 text-center">
          <div>
            <p className="font-mono-game text-orange-500 font-bold text-xl">{score}/{TARGET_GOAL}</p>
            <p className="font-mono-game text-[#444] text-[10px]">HITS</p>
          </div>
          <div>
            <p className={`font-mono-game font-bold text-xl ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>{timeLeft}s</p>
            <p className="font-mono-game text-[#444] text-[10px]">TIME</p>
          </div>
          <div>
            <p className="font-mono-game text-red-400 font-bold text-xl">{misses}/{MAX_MISSES}</p>
            <p className="font-mono-game text-[#444] text-[10px]">MISS</p>
          </div>
        </div>
      </div>

      {!started ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
          <p className="font-mono-game text-[#666] text-sm text-center">{cell.challenge.instructions}</p>
          <button onClick={start} className="w-full bg-orange-500 text-white font-bold py-4 text-xl mt-4">
            START
          </button>
        </div>
      ) : (
        <div
          className="flex-1 relative bg-[#0a0a0a] cursor-crosshair"
          onClick={() => {
            if (!isJoker) {
              setMisses(m => m + 1);
            }
          }}
        >
          {targets.map(t => (
            <button
              key={t.id}
              style={{ position: 'absolute', left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%,-50%)' }}
              className="w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-400 active:scale-90 transition-transform flex items-center justify-center text-white font-bold text-xl pulse-orange touch-none"
              onPointerDown={(e) => { e.stopPropagation(); hitTarget(t.id); }}
            >
              {isJoker ? (Math.random() > 0.5 ? "🔴" : "🟢") : "⊕"}
            </button>
          ))}

          {targets.length === 0 && started && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-mono-game text-[#222] text-sm animate-pulse">WAITING FOR TARGET...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SharkBayGame({ cell, onResult, onBack }: Props) {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          setTimeout(() => onResult(true), 500);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, onResult]);

  const handleTap = () => {
    if (started && !failed) {
      setFailed(true);
      setTimeout(() => onResult(false), 800);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 flex items-center justify-between flex-shrink-0">
        <button onClick={onBack} className="text-[#444] hover:text-white p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        {started && (
          <p className={`font-mono-game font-bold text-2xl ${timeLeft < 4 ? 'text-red-500' : 'text-white'}`}>{timeLeft}s</p>
        )}
      </div>
      <div
        className={`flex-1 flex flex-col items-center justify-center p-8 transition-colors ${failed ? 'bg-red-900/20' : started ? 'bg-blue-900/10' : ''}`}
        onPointerDown={handleTap}
      >
        {!started ? (
          <>
            <p className="text-6xl mb-4">🦈</p>
            <p className="font-mono-game text-[#666] text-sm text-center mb-8">{cell.challenge.instructions}</p>
            <button onClick={(e) => { e.stopPropagation(); setStarted(true); }} className="w-full bg-orange-500 text-white font-bold py-4 text-xl">
              START — DON'T TAP!
            </button>
          </>
        ) : failed ? (
          <div className="text-center">
            <p className="text-6xl mb-4">🦈</p>
            <p className="font-chakra font-bold text-2xl text-red-500">SHARK DETECTED!</p>
            <p className="font-mono-game text-[#666] text-sm mt-2">You moved too much.</p>
          </div>
        ) : (
          <div className="text-center select-none">
            <p className="text-6xl mb-6">🌊</p>
            <p className="font-mono-game text-blue-400 text-lg tracking-widest animate-pulse">STAY STILL...</p>
            <p className="font-mono-game text-[#444] text-xs mt-4">DO NOT TAP ANYWHERE</p>
          </div>
        )}
      </div>
    </div>
  );
}

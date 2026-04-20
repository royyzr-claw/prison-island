"use client";

import { useState, useEffect, useRef } from "react";
import { type Cell } from "@/lib/gameData";
import { ArrowLeft } from "lucide-react";

interface Props {
  cell: Cell;
  onResult: (success: boolean) => void;
  onBack: () => void;
}

// Riot - tap as fast as possible
function RiotGame({ onResult, onBack }: { onResult: (s: boolean) => void; onBack: () => void }) {
  const [taps, setTaps] = useState(0);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const TARGET = 200;

  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => setTimeLeft(s => {
      if (s <= 1) {
        clearInterval(t);
        return 0;
      }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [started]);

  useEffect(() => {
    if (!started) return;
    if (taps >= TARGET) { setTimeout(() => onResult(true), 300); }
    if (timeLeft === 0) { onResult(taps >= TARGET); }
  }, [taps, timeLeft, started, onResult]);

  const pct = Math.min((taps / TARGET) * 100, 100);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#1a1a1a]">
        <button onClick={onBack} className="text-[#444] hover:text-white p-1"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex gap-6">
          <div className="text-center">
            <p className="font-mono-game text-orange-500 font-bold text-xl">{taps}/{TARGET}</p>
            <p className="font-mono-game text-[#444] text-[10px]">TAPS</p>
          </div>
          {started && (
            <div className="text-center">
              <p className={`font-mono-game font-bold text-xl ${timeLeft < 5 ? 'text-red-500' : 'text-white'}`}>{timeLeft}s</p>
              <p className="font-mono-game text-[#444] text-[10px]">TIME</p>
            </div>
          )}
        </div>
      </div>
      {!started ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
          <p className="text-5xl">🚨</p>
          <p className="font-mono-game text-[#666] text-sm text-center">ALL players tap as fast as possible together! Combined taps must reach 200 in 20 seconds!</p>
          <button onClick={() => setStarted(true)} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 text-xl">
            START RIOT
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-between p-4">
          <div className="w-full bg-[#1a1a1a] h-3 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-orange-500 transition-all duration-100" style={{ width: `${pct}%` }} />
          </div>
          <button
            onPointerDown={() => setTaps(t => t + 1)}
            className="w-full max-w-xs h-48 bg-red-600 hover:bg-red-500 active:bg-red-700 active:scale-95 text-white font-bold text-4xl rounded-2xl transition-all select-none touch-none"
            style={{ boxShadow: "0 0 30px rgba(220,38,38,0.4)" }}
          >
            TAP!<br />
            <span className="text-lg font-mono-game">{taps}</span>
          </button>
          <p className="font-mono-game text-[#555] text-xs">ALL 4 PLAYERS TAP SIMULTANEOUSLY</p>
        </div>
      )}
    </div>
  );
}

// Hands On / Vault / Catch - hold button for 3 seconds
function HoldGame({ cell, onResult, onBack }: { cell: Cell; onResult: (s: boolean) => void; onBack: () => void }) {
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const holdInterval = useRef<NodeJS.Timeout | undefined>(undefined);
  const HOLD_TIME = 3000;

  const startHold = () => {
    if (!started || failed) return;
    setHolding(true);
    const start = Date.now();
    holdInterval.current = setInterval(() => {
      const pct = ((Date.now() - start) / HOLD_TIME) * 100;
      setHoldProgress(pct);
      if (pct >= 100) {
        clearInterval(holdInterval.current);
        setTimeout(() => onResult(true), 300);
      }
    }, 50);
  };

  const endHold = () => {
    if (!started) return;
    clearInterval(holdInterval.current);
    if (holdProgress < 100 && holdProgress > 5) {
      setFailed(true);
      setHolding(false);
      setTimeout(() => onResult(false), 600);
    }
    setHolding(false);
    setHoldProgress(0);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#1a1a1a]">
        <button onClick={onBack} className="text-[#444] hover:text-white p-1"><ArrowLeft className="w-5 h-5" /></button>
        <p className="font-mono-game text-orange-500 text-sm">{cell.name.toUpperCase()}</p>
      </div>
      {!started ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
          <p className="text-5xl">{cell.emoji}</p>
          <p className="font-mono-game text-[#666] text-sm text-center">{cell.challenge.instructions}</p>
          <button onClick={() => setStarted(true)} className="w-full bg-orange-500 text-white font-bold py-4 text-xl">
            READY
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-between p-6">
          <div className="w-full bg-[#1a1a1a] h-4 rounded-full overflow-hidden mt-4">
            <div
              className="h-full bg-orange-500 transition-all duration-100"
              style={{ width: `${holdProgress}%` }}
            />
          </div>
          <div className="flex flex-col items-center gap-4">
            <p className="font-mono-game text-[#666] text-sm text-center">
              {failed ? "❌ RELEASED TOO SOON" : holding ? "HOLD IT! HOLD IT!" : "HOLD THE BUTTON FOR 3 SECONDS"}
            </p>
            <button
              className={`w-48 h-48 rounded-full font-bold text-xl transition-all select-none touch-none ${
                holding
                  ? "bg-orange-500 scale-95 shadow-[0_0_40px_rgba(249,115,22,0.6)]"
                  : failed
                  ? "bg-red-600/50"
                  : "bg-[#1a1a1a] border-2 border-orange-500"
              }`}
              onPointerDown={startHold}
              onPointerUp={endHold}
              onPointerLeave={endHold}
              style={{ userSelect: "none" }}
            >
              {holding ? "✋ HOLDING" : "HOLD"}
            </button>
          </div>
          <p className="font-mono-game text-[#444] text-xs">All players must hold simultaneously</p>
        </div>
      )}
    </div>
  );
}

// Submarine / Tower / Waterfall - cooperative button pressing game
function CoordGame({ cell, onResult, onBack }: { cell: Cell; onResult: (s: boolean) => void; onBack: () => void }) {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState(50); // 0-100
  const [timeLeft, setTimeLeft] = useState(cell.challenge.timeLimit);
  const GOAL = 10;

  // Player A presses UP, Player B presses DOWN
  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => setTimeLeft(s => {
      if (s <= 1) { clearInterval(t); onResult(score >= GOAL); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [started, score, onResult]);

  const pressUp = () => setPosition(p => Math.max(0, p - 15));
  const pressDown = () => setPosition(p => Math.min(100, p + 15));
  const confirm = () => {
    if (position > 40 && position < 60) {
      setScore(s => {
        const next = s + 1;
        if (next >= GOAL) setTimeout(() => onResult(true), 300);
        return next;
      });
      setPosition(50);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#1a1a1a]">
        <button onClick={onBack} className="text-[#444] hover:text-white p-1"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex gap-4">
          <div className="text-center">
            <p className="font-mono-game text-orange-500 font-bold">{score}/{GOAL}</p>
            <p className="font-mono-game text-[#444] text-[10px]">SCORE</p>
          </div>
          {started && <div className="text-center">
            <p className={`font-mono-game font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>{timeLeft}s</p>
            <p className="font-mono-game text-[#444] text-[10px]">TIME</p>
          </div>}
        </div>
      </div>
      {!started ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
          <p className="text-5xl">{cell.emoji}</p>
          <p className="font-mono-game text-[#666] text-sm text-center">{cell.challenge.instructions}</p>
          <button onClick={() => setStarted(true)} className="w-full bg-orange-500 text-white font-bold py-4">START</button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-between p-6">
          <div className="w-full relative h-8 bg-[#1a1a1a] rounded-full">
            <div className="absolute inset-y-0 left-[35%] right-[35%] bg-green-500/20 border border-green-500/40 rounded-full" />
            <div
              className="absolute top-1 w-6 h-6 rounded-full bg-orange-500 transition-all duration-200"
              style={{ left: `calc(${position}% - 12px)` }}
            />
          </div>
          <p className="font-mono-game text-[#666] text-xs">Keep the dot in the GREEN ZONE</p>
          <div className="flex gap-4 w-full">
            <button onPointerDown={pressUp} className="flex-1 py-10 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-2xl rounded-xl transition-all touch-none select-none">
              ↑ UP
            </button>
            <button onPointerDown={pressDown} className="flex-1 py-10 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-2xl rounded-xl transition-all touch-none select-none">
              ↓ DOWN
            </button>
          </div>
          <button onPointerDown={confirm} className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-xl">
            ✓ CONFIRM POSITION
          </button>
        </div>
      )}
    </div>
  );
}

export function CoopGame({ cell, onResult, onBack }: Props) {
  if (cell.name === "Riot") return <RiotGame onResult={onResult} onBack={onBack} />;
  if (["Hands On", "The Vault", "Catch"].includes(cell.name)) return <HoldGame cell={cell} onResult={onResult} onBack={onBack} />;
  return <CoordGame cell={cell} onResult={onResult} onBack={onBack} />;
}

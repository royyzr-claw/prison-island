"use client";

import { useState } from "react";
import { X, RotateCcw, Trophy } from "lucide-react";
import { type Cell } from "@/lib/gameData";
import { recordCellAttempt } from "@/lib/gameActions";
import { ReflexGame } from "./games/ReflexGame";
import { SequenceGame } from "./games/SequenceGame";
import { WhackGame } from "./games/WhackGame";
import { MemoryGame } from "./games/MemoryGame";
import { MathGame } from "./games/MathGame";
import { CodeGame } from "./games/CodeGame";
import { CoopGame } from "./games/CoopGame";
import { PatternGame } from "./games/PatternGame";
import { VoteGame } from "./games/VoteGame";

interface Props {
  cell: Cell;
  sessionId: string;
  playerId: string;
  existingAttempt?: { attempts: number; completed: boolean; score: number };
  onClose: () => void;
}

export function CellModal({ cell, sessionId, playerId, existingAttempt, onClose }: Props) {
  const [phase, setPhase] = useState<"info" | "playing" | "success" | "fail">(
    existingAttempt?.completed ? "success" : "info"
  );
  const [attempts, setAttempts] = useState(existingAttempt?.attempts || 0);

  const handleResult = async (success: boolean) => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    await recordCellAttempt(sessionId, playerId, cell.id, success, cell.maxPoints);
    setPhase(success ? "success" : "fail");
  };

  const handleRetry = () => {
    setPhase("playing");
  };

  const getStressColor = () => {
    if (cell.stressLevel >= 80) return "#ef4444";
    if (cell.stressLevel >= 60) return "#f97316";
    if (cell.stressLevel >= 40) return "#eab308";
    return "#22c55e";
  };

  const GameComponent = {
    reflex: ReflexGame,
    sequence: SequenceGame,
    whack: WhackGame,
    memory: MemoryGame,
    math: MathGame,
    code: CodeGame,
    cooperative: CoopGame,
    pattern: PatternGame,
    vote: VoteGame,
    laser: CoopGame,
    slider: PatternGame,
    word: MathGame,
  }[cell.challenge.type] || MathGame;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#080808]">
      {/* Header */}
      <div className="border-b border-[#1a1a1a] px-4 py-4 flex items-start justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono-game text-xs text-[#444]">CELL {String(cell.id).padStart(2, '0')}</span>
            <span
              className="font-mono-game text-[10px] px-2 py-0.5 rounded-full border"
              style={{ color: getStressColor(), borderColor: getStressColor() + '44' }}
            >
              STRESS {cell.stressLevel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{cell.emoji}</span>
            <h2 className="font-chakra font-bold text-xl">{cell.name}</h2>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-[#444] hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {phase === "info" && (
          <div className="p-6 flex flex-col h-full">
            <div className="flex-1">
              <p className="text-[#888] text-sm leading-relaxed mb-6">{cell.description}</p>

              <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-4 mb-6">
                <p className="font-mono-game text-[10px] text-[#444] mb-2 tracking-widest">MISSION BRIEF</p>
                <p className="font-chakra text-sm text-[#ccc] leading-relaxed">{cell.challenge.instructions}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-3">
                  <p className="font-mono-game text-orange-500 font-bold text-lg">{cell.maxPoints}</p>
                  <p className="font-mono-game text-[#444] text-[10px]">MAX PTS</p>
                </div>
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-3">
                  <p className="font-mono-game text-white font-bold text-lg">{cell.challenge.timeLimit}s</p>
                  <p className="font-mono-game text-[#444] text-[10px]">TIME</p>
                </div>
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-3">
                  <p className="font-mono-game text-white font-bold text-lg">{cell.minPlayers}+</p>
                  <p className="font-mono-game text-[#444] text-[10px]">PLAYERS</p>
                </div>
              </div>

              {attempts > 0 && (
                <div className="mt-4 font-mono-game text-[#444] text-xs text-center">
                  {attempts} attempt{attempts !== 1 ? 's' : ''} so far
                </div>
              )}
            </div>

            <button
              onClick={() => setPhase("playing")}
              className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 text-lg mt-6 transition-all"
            >
              {attempts > 0 ? "TRY AGAIN" : "ENTER CELL"}
            </button>
          </div>
        )}

        {phase === "playing" && (
          <GameComponent
            cell={cell}
            onResult={handleResult}
            onBack={() => setPhase("info")}
          />
        )}

        {phase === "success" && (
          <div className="p-6 flex flex-col items-center justify-center h-full text-center success-flash">
            <div className="text-6xl mb-4">🎉</div>
            <Trophy className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="font-chakra font-bold text-2xl mb-2">CELL CLEARED!</h3>
            <p className="font-mono-game text-orange-500 text-3xl font-bold mb-2">+{cell.maxPoints} pts</p>
            <p className="font-mono-game text-[#444] text-xs mb-8">
              {attempts > 0 ? `Completed in ${attempts} attempt${attempts !== 1 ? 's' : ''}` : 'First try!'}
            </p>
            <button onClick={onClose} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 transition-all">
              RETURN TO BLOCK
            </button>
          </div>
        )}

        {phase === "fail" && (
          <div className="p-6 flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">💀</div>
            <h3 className="font-chakra font-bold text-2xl mb-2 text-red-500">FAILED</h3>
            <p className="font-mono-game text-[#555] text-xs mb-8">
              Attempt {attempts} · Unlimited retries
            </p>
            <div className="w-full space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-5 h-5" /> RETRY
              </button>
              <button
                onClick={onClose}
                className="w-full border border-[#333] hover:border-[#555] text-[#888] hover:text-white font-bold py-4 transition-all"
              >
                DIFFERENT CELL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

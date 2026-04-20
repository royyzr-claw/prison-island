"use client";

import { useState, useEffect, useCallback } from "react";
import { CELLS, PLAYER_COLORS, type GameSession } from "@/lib/gameData";
import { setPlayerCurrentCell, startGame, endGame, keepAlive } from "@/lib/gameActions";
import { CellModal } from "./CellModal";
import { Timer } from "./Timer";
import { Leaderboard } from "./Leaderboard";
import { PlayerStatus } from "./PlayerStatus";
import { Trophy, Grid3X3, LogOut, Share2, Copy, Check } from "lucide-react";

const GAME_DURATION = 30 * 60; // 30 minutes in seconds

interface Props {
  session: GameSession;
  sessionId: string;
  playerId: string;
  onLeave: () => void;
}

export function GameScreen({ session, sessionId, playerId, onLeave }: Props) {
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [view, setView] = useState<"grid" | "leaderboard">("grid");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  const me = session.players?.[playerId];
  const players = Object.values(session.players || {});
  const isHost = players[0]?.id === playerId;

  // Keep-alive ping
  useEffect(() => {
    const interval = setInterval(() => {
      keepAlive(sessionId, playerId);
    }, 15000);
    return () => clearInterval(interval);
  }, [sessionId, playerId]);

  // Timer
  useEffect(() => {
    if (session.status !== "playing" || !session.startTime) return;
    const tick = () => {
      const elapsed = Math.floor((Date.now() - session.startTime!) / 1000);
      const remaining = Math.max(0, GAME_DURATION - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) {
        endGame(sessionId);
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [session.status, session.startTime, sessionId]);

  const openCell = useCallback(async (cellId: number) => {
    setActiveCell(cellId);
    await setPlayerCurrentCell(sessionId, playerId, cellId);
  }, [sessionId, playerId]);

  const closeCell = useCallback(async () => {
    setActiveCell(null);
    await setPlayerCurrentCell(sessionId, playerId, null);
  }, [sessionId, playerId]);

  const handleStart = async () => {
    await startGame(sessionId);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const myCompletedCells = me?.cellsCompleted || [];
  const totalPoints = me?.score || 0;

  const getStressColor = (stress: number) => {
    if (stress >= 80) return "text-red-500 border-red-500/30 bg-red-500/5";
    if (stress >= 60) return "text-orange-400 border-orange-500/30 bg-orange-500/5";
    if (stress >= 40) return "text-yellow-400 border-yellow-500/30 bg-yellow-500/5";
    return "text-green-400 border-green-500/30 bg-green-500/5";
  };

  // Who is in which cell
  const playerCellMap: Record<number, string[]> = {};
  players.forEach(p => {
    if (p.currentCell !== null && p.currentCell !== undefined && p.id !== playerId) {
      if (!playerCellMap[p.currentCell]) playerCellMap[p.currentCell] = [];
      playerCellMap[p.currentCell].push(p.name);
    }
  });

  return (
    <div className="scanlines min-h-screen bg-[#080808] flex flex-col max-w-md mx-auto">
      {/* Fixed background grid */}
      <div className="fixed inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(#ff6b1a 1px, transparent 1px), linear-gradient(90deg, #ff6b1a 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Header */}
      <div className="relative z-10 border-b border-[#1a1a1a] px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-chakra font-bold text-lg leading-none">PRISON <span className="text-orange-500">ISLAND</span></h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PLAYER_COLORS[me?.colorIndex || 0].hex }} />
              <span className="font-mono-game text-[#666] text-xs">{me?.name || "PLAYER"}</span>
              <button onClick={copyCode} className="flex items-center gap-1 font-mono-game text-[#444] hover:text-orange-500 text-xs transition-colors ml-2">
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                <span className="truncate max-w-[80px]"><span style={{fontSize:"10px"}}>{sessionId}</span></span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {session.status === "playing" && <Timer timeLeft={timeLeft} />}
            <div className="text-right">
              <p className="font-mono-game text-orange-500 font-bold text-lg leading-none">{totalPoints}</p>
              <p className="font-mono-game text-[#444] text-[10px]">PTS</p>
            </div>
          </div>
        </div>

        {/* Player status bar */}
        <div className="mt-3">
          <PlayerStatus players={players} myId={playerId} cellAttempts={session.cellAttempts || {}} />
        </div>
      </div>

      {/* Tab bar */}
      <div className="relative z-10 flex border-b border-[#1a1a1a]">
        <button
          onClick={() => setView("grid")}
          className={`flex-1 py-3 font-mono-game text-xs tracking-widest flex items-center justify-center gap-2 transition-all ${
            view === "grid" ? "text-orange-500 border-b-2 border-orange-500" : "text-[#555] hover:text-[#888]"
          }`}
        >
          <Grid3X3 className="w-4 h-4" /> CELLS
        </button>
        <button
          onClick={() => setView("leaderboard")}
          className={`flex-1 py-3 font-mono-game text-xs tracking-widest flex items-center justify-center gap-2 transition-all ${
            view === "leaderboard" ? "text-orange-500 border-b-2 border-orange-500" : "text-[#555] hover:text-[#888]"
          }`}
        >
          <Trophy className="w-4 h-4" /> SCORES
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        {session.status === "lobby" && (
          <div className="p-4 text-center">
            <div className="border border-[#2a2a2a] bg-[#0d0d0d] p-6 mb-4">
              <p className="font-mono-game text-[#666] text-xs tracking-widest mb-1">SESSION CODE</p>
              <p className="font-mono-game text-orange-500 text-2xl font-bold tracking-widest">{sessionId}</p>
              <button onClick={copyCode} className="mt-3 flex items-center gap-2 mx-auto font-mono-game text-xs text-[#555] hover:text-orange-500 transition-colors">
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Share2 className="w-3 h-3" />}
                {copied ? "COPIED!" : "SHARE CODE"}
              </button>
            </div>

            <div className="mb-4">
              <p className="font-mono-game text-[#444] text-xs mb-3 tracking-widest">INMATES IN BLOCK</p>
              <div className="space-y-2">
                {players.map(p => (
                  <div key={p.id} className="flex items-center gap-3 bg-[#111] border border-[#1a1a1a] px-4 py-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PLAYER_COLORS[p.colorIndex].hex }} />
                    <span className="font-chakra font-bold text-sm">{p.name}</span>
                    {p.id === players[0]?.id && <span className="font-mono-game text-[10px] text-orange-500 ml-auto">WARDEN</span>}
                  </div>
                ))}
              </div>
            </div>

            {isHost ? (
              <button
                onClick={handleStart}
                disabled={players.length < 1}
                className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 text-lg transition-all pulse-orange"
              >
                START PRISON RUN
              </button>
            ) : (
              <p className="font-mono-game text-[#444] text-xs tracking-widest py-4">
                WAITING FOR WARDEN TO START...
              </p>
            )}
          </div>
        )}

        {view === "grid" && session.status === "playing" && (
          <div className="p-3">
            <div className="grid grid-cols-3 gap-2">
              {CELLS.map(cell => {
                const completed = myCompletedCells.includes(cell.id);
                const attempts = session.cellAttempts?.[cell.id]?.[playerId];
                const othersHere = playerCellMap[cell.id] || [];
                const isOpen = activeCell === cell.id;

                return (
                  <button
                    key={cell.id}
                    onClick={() => openCell(cell.id)}
                    className={`cell-card relative border text-left p-2.5 transition-all ${
                      completed
                        ? "border-green-500/40 bg-green-500/10"
                        : isOpen
                        ? "border-orange-500 bg-orange-500/10"
                        : `border-[#1a1a1a] bg-[#0d0d0d] hover:border-[#333] ${getStressColor(cell.stressLevel).split(' ').slice(2).join(' ')}`
                    }`}
                  >
                    {/* Cell number */}
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-mono-game text-[10px] text-[#444]">{String(cell.id).padStart(2, '0')}</span>
                      {completed && (
                        <span className="font-mono-game text-[9px] text-green-400">✓</span>
                      )}
                      {othersHere.length > 0 && !completed && (
                        <div className="flex -space-x-1">
                          {othersHere.slice(0, 2).map((pName, i) => {
                            const p = players.find(pl => pl.name === pName);
                            return (
                              <div key={i} className="w-2.5 h-2.5 rounded-full border border-[#080808]"
                                style={{ backgroundColor: p ? PLAYER_COLORS[p.colorIndex].hex : '#666' }} />
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="text-lg leading-none mb-1">{cell.emoji}</div>
                    <p className="font-chakra font-bold text-[11px] leading-tight truncate">{cell.name}</p>

                    <div className="flex items-center justify-between mt-1.5">
                      <span className={`font-mono-game text-[9px] ${completed ? 'text-green-400' : 'text-[#444]'}`}>
                        {completed ? `+${cell.maxPoints}` : `${cell.maxPoints}pt`}
                      </span>
                      {attempts && !completed && (
                        <span className="font-mono-game text-[9px] text-[#555]">{attempts.attempts}x</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 p-3 border border-[#1a1a1a] bg-[#0a0a0a]">
              <div className="flex justify-between items-center">
                <span className="font-mono-game text-[#444] text-xs">CELLS CLEARED</span>
                <span className="font-mono-game text-orange-500 text-sm font-bold">{myCompletedCells.length} / 30</span>
              </div>
              <div className="mt-2 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-500"
                  style={{ width: `${(myCompletedCells.length / 30) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {view === "leaderboard" && session.status === "playing" && (
          <div className="p-4">
            <Leaderboard
              players={players}
              cellAttempts={session.cellAttempts || {}}
              myId={playerId}
            />
          </div>
        )}
      </div>

      {/* Leave button */}
      <div className="relative z-10 border-t border-[#1a1a1a] p-4">
        <button onClick={onLeave} className="w-full flex items-center justify-center gap-2 font-mono-game text-xs text-[#444] hover:text-red-500 py-2 transition-colors">
          <LogOut className="w-4 h-4" /> LEAVE SESSION
        </button>
      </div>

      {/* Cell Modal */}
      {activeCell !== null && (
        <CellModal
          cell={CELLS.find(c => c.id === activeCell)!}
          sessionId={sessionId}
          playerId={playerId}
          existingAttempt={session.cellAttempts?.[activeCell]?.[playerId]}
          onClose={closeCell}
        />
      )}
    </div>
  );
}

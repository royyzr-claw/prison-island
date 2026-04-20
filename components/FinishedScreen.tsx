"use client";

import { PLAYER_COLORS, type GameSession } from "@/lib/gameData";
import { Trophy, LogOut } from "lucide-react";

interface Props {
  session: GameSession;
  playerId: string;
  onLeave: () => void;
}

export function FinishedScreen({ session, playerId, onLeave }: Props) {
  const players = Object.values(session.players || {}).sort((a, b) => (b.score || 0) - (a.score || 0));
  const me = session.players?.[playerId];
  const myRank = players.findIndex(p => p.id === playerId) + 1;

  const totalTime = session.startTime && session.endTime
    ? Math.floor((session.endTime - session.startTime) / 1000)
    : 30 * 60;
  const mins = Math.floor(totalTime / 60);
  const secs = totalTime % 60;

  const medals = ["🥇", "🥈", "🥉", "4️⃣"];
  const winner = players[0];

  const totalCells = Object.values(session.cellAttempts || {}).filter(cell =>
    Object.values(cell).some(p => p.completed)
  ).length;

  return (
    <div className="scanlines min-h-screen bg-[#080808] flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#ff6b1a 1px, transparent 1px), linear-gradient(90deg, #ff6b1a 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative w-full max-w-sm space-y-4">
        {/* Header */}
        <div className="text-center">
          <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <h1 className="font-chakra font-bold text-4xl">PRISON RUN</h1>
          <p className="font-mono-game text-orange-500 tracking-widest">COMPLETE</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#111] border border-[#1a1a1a] p-3">
            <p className="font-mono-game text-white font-bold text-lg">{mins}:{String(secs).padStart(2, '0')}</p>
            <p className="font-mono-game text-[#444] text-[10px]">DURATION</p>
          </div>
          <div className="bg-[#111] border border-[#1a1a1a] p-3">
            <p className="font-mono-game text-orange-500 font-bold text-lg">{totalCells}</p>
            <p className="font-mono-game text-[#444] text-[10px]">CELLS CLEARED</p>
          </div>
          <div className="bg-[#111] border border-[#1a1a1a] p-3">
            <p className="font-mono-game text-white font-bold text-lg">{players.length}</p>
            <p className="font-mono-game text-[#444] text-[10px]">INMATES</p>
          </div>
        </div>

        {/* Winner */}
        {winner && (
          <div className="border border-yellow-500/30 bg-yellow-500/5 p-4 text-center">
            <p className="font-mono-game text-yellow-400 text-[10px] tracking-widest mb-1">TOP INMATE</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: PLAYER_COLORS[winner.colorIndex].hex }} />
              <p className="font-chakra font-bold text-2xl">{winner.name}</p>
            </div>
            <p className="font-mono-game text-yellow-400 text-xl mt-1">{winner.score} pts</p>
          </div>
        )}

        {/* Leaderboard */}
        <div className="space-y-2">
          {players.map((player, idx) => {
            const isMe = player.id === playerId;
            const color = PLAYER_COLORS[player.colorIndex];
            const completed = Object.values(session.cellAttempts || {}).filter(cell => cell[player.id]?.completed).length;

            return (
              <div
                key={player.id}
                className={`flex items-center gap-3 p-3 border ${isMe ? "border-orange-500/40 bg-orange-500/5" : "border-[#1a1a1a] bg-[#0d0d0d]"}`}
              >
                <span className="text-xl w-8">{medals[idx]}</span>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color.hex }} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-chakra font-bold text-sm">{player.name}</p>
                    {isMe && <span className="font-mono-game text-[9px] text-orange-500">YOU</span>}
                  </div>
                  <p className="font-mono-game text-[10px] text-[#444]">{completed} cells cleared</p>
                </div>
                <p className="font-mono-game text-orange-500 font-bold text-lg">{player.score || 0}</p>
              </div>
            );
          })}
        </div>

        {/* My result */}
        {me && (
          <div className="text-center py-2">
            <p className="font-mono-game text-[#555] text-xs">
              You placed <span className="text-orange-400">{myRank}{["st","nd","rd"][myRank-1] || "th"}</span> with{" "}
              <span className="text-orange-400">{me.score} points</span>
            </p>
          </div>
        )}

        <button
          onClick={onLeave}
          className="w-full flex items-center justify-center gap-2 border border-[#333] hover:border-orange-500 text-[#888] hover:text-white font-bold py-4 transition-all"
        >
          <LogOut className="w-5 h-5" /> BACK TO LOBBY
        </button>
      </div>
    </div>
  );
}

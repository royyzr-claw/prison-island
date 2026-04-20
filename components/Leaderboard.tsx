"use client";

import { PLAYER_COLORS, type PlayerData } from "@/lib/gameData";

interface Props {
  players: PlayerData[];
  cellAttempts: Record<number, Record<string, { attempts: number; completed: boolean; score: number }>>;
  myId: string;
}

export function Leaderboard({ players, cellAttempts, myId }: Props) {
  const sorted = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));

  const getPlayerStats = (playerId: string) => {
    let totalAttempts = 0;
    let completed = 0;
    Object.values(cellAttempts).forEach(cell => {
      if (cell[playerId]) {
        totalAttempts += cell[playerId].attempts;
        if (cell[playerId].completed) completed++;
      }
    });
    return { totalAttempts, completed };
  };

  const medals = ["🥇", "🥈", "🥉", "4️⃣"];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-mono-game text-xs tracking-widest text-[#666]">INMATE RANKINGS</h2>
        <span className="font-mono-game text-[10px] text-[#444]">LIVE</span>
      </div>

      {sorted.map((player, index) => {
        const stats = getPlayerStats(player.id);
        const isMe = player.id === myId;
        const color = PLAYER_COLORS[player.colorIndex];

        return (
          <div
            key={player.id}
            className={`border p-4 transition-all ${
              isMe
                ? "border-orange-500/50 bg-orange-500/5"
                : "border-[#1a1a1a] bg-[#0d0d0d]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-8">{medals[index] || "—"}</span>
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color.hex }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-chakra font-bold text-sm truncate">{player.name}</p>
                  {isMe && <span className="font-mono-game text-[9px] text-orange-500">YOU</span>}
                </div>
                <div className="flex gap-3 mt-1">
                  <span className="font-mono-game text-[10px] text-[#444]">
                    {stats.completed} cells
                  </span>
                  <span className="font-mono-game text-[10px] text-[#444]">
                    {stats.totalAttempts} tries
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono-game font-bold text-lg text-orange-500">{player.score || 0}</p>
                <p className="font-mono-game text-[10px] text-[#444]">pts</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-700"
                style={{
                  width: `${(stats.completed / 30) * 100}%`,
                  backgroundColor: color.hex
                }}
              />
            </div>
            <p className="font-mono-game text-[9px] text-[#444] mt-1">{stats.completed}/30 cells cleared</p>
          </div>
        );
      })}

      {players.length === 0 && (
        <p className="font-mono-game text-[#444] text-xs text-center py-8">NO PLAYERS YET</p>
      )}
    </div>
  );
}

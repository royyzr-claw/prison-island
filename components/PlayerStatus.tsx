"use client";

import { PLAYER_COLORS, CELLS, type PlayerData } from "@/lib/gameData";

interface Props {
  players: PlayerData[];
  myId: string;
  cellAttempts: Record<number, Record<string, { attempts: number; completed: boolean; score: number }>>;
}

export function PlayerStatus({ players, myId, cellAttempts }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {players.map(player => {
        const isMe = player.id === myId;
        const color = PLAYER_COLORS[player.colorIndex];
        const currentCell = player.currentCell !== null && player.currentCell !== undefined
          ? CELLS.find(c => c.id === player.currentCell)
          : null;
        const completed = Object.values(cellAttempts).filter(cell => cell[player.id]?.completed).length;

        return (
          <div
            key={player.id}
            className={`flex-shrink-0 flex items-center gap-2 px-2.5 py-1.5 border rounded-sm ${
              isMe ? "border-orange-500/30 bg-orange-500/5" : "border-[#1a1a1a] bg-[#0a0a0a]"
            }`}
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color.hex }} />
            <div className="min-w-0">
              <p className="font-chakra text-[10px] font-bold truncate max-w-[60px]">{player.name}</p>
              <p className="font-mono-game text-[9px] text-[#444] truncate max-w-[60px]">
                {currentCell ? `${currentCell.emoji} ${currentCell.name}` : `${completed} cells`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

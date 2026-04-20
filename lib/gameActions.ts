"use client";
import { db } from "./firebase";
import { ref, set, get, onValue, update, push, serverTimestamp } from "firebase/database";
import type { GameSession, PlayerData } from "./gameData";

export const createSession = async (): Promise<string> => {
  const sessionRef = push(ref(db, "sessions"));
  const id = sessionRef.key!;
  const session: GameSession = {
    id,
    status: "lobby",
    startTime: null,
    endTime: null,
    players: {},
    cellAttempts: {},
  };
  await set(sessionRef, session);
  return id;
};

export const joinSession = async (
  sessionId: string,
  player: Omit<PlayerData, "score" | "cellsCompleted" | "currentCell" | "lastSeen">
): Promise<void> => {
  const playerRef = ref(db, `sessions/${sessionId}/players/${player.id}`);
  const playerData: PlayerData = {
    ...player,
    score: 0,
    cellsCompleted: [],
    currentCell: null,
    lastSeen: Date.now(),
  };
  await set(playerRef, playerData);
};

export const startGame = async (sessionId: string): Promise<void> => {
  await update(ref(db, `sessions/${sessionId}`), {
    status: "playing",
    startTime: Date.now(),
  });
};

export const setPlayerCurrentCell = async (
  sessionId: string,
  playerId: string,
  cellId: number | null
): Promise<void> => {
  await update(ref(db, `sessions/${sessionId}/players/${playerId}`), {
    currentCell: cellId,
    lastSeen: Date.now(),
  });
};

export const recordCellAttempt = async (
  sessionId: string,
  playerId: string,
  cellId: number,
  success: boolean,
  points: number
): Promise<void> => {
  const attemptRef = ref(db, `sessions/${sessionId}/cellAttempts/${cellId}/${playerId}`);
  const existing = (await get(attemptRef)).val() || { attempts: 0, completed: false, score: 0 };
  
  const updated = {
    attempts: existing.attempts + 1,
    completed: success || existing.completed,
    score: success ? points : existing.score,
  };
  
  await set(attemptRef, updated);

  if (success && !existing.completed) {
    // Update player score and completed cells
    const playerRef = ref(db, `sessions/${sessionId}/players/${playerId}`);
    const playerSnap = (await get(playerRef)).val() as PlayerData;
    const completedCells = playerSnap.cellsCompleted || [];
    if (!completedCells.includes(cellId)) {
      await update(playerRef, {
        score: (playerSnap.score || 0) + points,
        cellsCompleted: [...completedCells, cellId],
        currentCell: null,
        lastSeen: Date.now(),
      });
    }
  }
};

export const subscribeToSession = (
  sessionId: string,
  callback: (session: GameSession | null) => void
): (() => void) => {
  const sessionRef = ref(db, `sessions/${sessionId}`);
  const unsub = onValue(sessionRef, (snap) => {
    callback(snap.val() as GameSession | null);
  });
  return unsub;
};

export const endGame = async (sessionId: string): Promise<void> => {
  await update(ref(db, `sessions/${sessionId}`), {
    status: "finished",
    endTime: Date.now(),
  });
};

export const keepAlive = async (sessionId: string, playerId: string): Promise<void> => {
  await update(ref(db, `sessions/${sessionId}/players/${playerId}`), {
    lastSeen: Date.now(),
  });
};

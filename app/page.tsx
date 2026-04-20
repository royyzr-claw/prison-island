"use client";

import { useState, useEffect, useCallback } from "react";
import { LobbyScreen } from "@/components/LobbyScreen";
import { GameScreen } from "@/components/GameScreen";
import { FinishedScreen } from "@/components/FinishedScreen";
import { subscribeToSession } from "@/lib/gameActions";
import type { GameSession } from "@/lib/gameData";

export default function Home() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [session, setSession] = useState<GameSession | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem("prisonIslandSession");
    const savedPlayer = localStorage.getItem("prisonIslandPlayer");
    if (savedSession && savedPlayer) {
      setSessionId(savedSession);
      setPlayerId(savedPlayer);
    }
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    const unsub = subscribeToSession(sessionId, (s) => {
      setSession(s);
    });
    return unsub;
  }, [sessionId]);

  const handleJoin = useCallback((sId: string, pId: string) => {
    localStorage.setItem("prisonIslandSession", sId);
    localStorage.setItem("prisonIslandPlayer", pId);
    setSessionId(sId);
    setPlayerId(pId);
  }, []);

  const handleLeave = useCallback(() => {
    localStorage.removeItem("prisonIslandSession");
    localStorage.removeItem("prisonIslandPlayer");
    setSessionId(null);
    setPlayerId(null);
    setSession(null);
  }, []);

  if (!sessionId || !playerId) {
    return <LobbyScreen onJoin={handleJoin} />;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono-game text-orange-500 tracking-widest text-sm">CONNECTING...</p>
        </div>
      </div>
    );
  }

  if (session.status === "finished") {
    return <FinishedScreen session={session} playerId={playerId} onLeave={handleLeave} />;
  }

  return (
    <GameScreen
      session={session}
      sessionId={sessionId}
      playerId={playerId}
      onLeave={handleLeave}
    />
  );
}

export const dynamic = "force-dynamic";

"use client";

import { useState } from "react";
import { createSession, joinSession } from "@/lib/gameActions";
import { PLAYER_COLORS } from "@/lib/gameData";
import { Lock, Users, ChevronRight, Zap } from "lucide-react";

interface Props {
  onJoin: (sessionId: string, playerId: string) => void;
}

export function LobbyScreen({ onJoin }: Props) {
  const [mode, setMode] = useState<"home" | "create" | "join">("home");
  const [name, setName] = useState("");
  const [colorIndex, setColorIndex] = useState(0);
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const playerId = typeof window !== "undefined"
    ? (localStorage.getItem("prisonIslandPid") || (() => {
        const id = Math.random().toString(36).slice(2, 10);
        localStorage.setItem("prisonIslandPid", id);
        return id;
      })())
    : "player";

  const handleCreate = async () => {
    if (!name.trim()) { setError("Enter your name"); return; }
    setLoading(true);
    try {
      const sessionId = await createSession();
      await joinSession(sessionId, { id: playerId, name: name.trim(), colorIndex });
      onJoin(sessionId, playerId);
    } catch (e) {
      setError("Failed to create session. Check Firebase config.");
    }
    setLoading(false);
  };

  const handleJoin = async () => {
    if (!name.trim()) { setError("Enter your name"); return; }
    if (!joinCode.trim()) { setError("Enter session code"); return; }
    setLoading(true);
    try {
      await joinSession(joinCode.trim(), { id: playerId, name: name.trim(), colorIndex });
      onJoin(joinCode.trim(), playerId);
    } catch (e) {
      setError("Session not found. Check the code.");
    }
    setLoading(false);
  };

  return (
    <div className="scanlines min-h-screen bg-[#080808] flex flex-col items-center justify-center p-4">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#ff6b1a 1px, transparent 1px), linear-gradient(90deg, #ff6b1a 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Lock className="w-5 h-5 text-orange-500" />
            <span className="font-mono-game text-orange-500 text-xs tracking-[0.3em]">MAXIMUM SECURITY</span>
            <Lock className="w-5 h-5 text-orange-500" />
          </div>
          <h1 className="font-chakra text-5xl font-bold tracking-tight glitch-text flicker leading-none">
            PRISON<br />
            <span className="text-orange-500">ISLAND</span>
          </h1>
          <p className="mt-3 font-mono-game text-[#666] text-xs tracking-widest">30 CELLS · 4 PLAYERS · 30 MINUTES</p>
        </div>

        {mode === "home" && (
          <div className="space-y-3">
            <button
              onClick={() => setMode("create")}
              className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 px-6 flex items-center justify-between group transition-all"
            >
              <span className="flex items-center gap-3">
                <Zap className="w-5 h-5" />
                CREATE SESSION
              </span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setMode("join")}
              className="w-full border border-[#333] hover:border-orange-500 text-white font-bold py-4 px-6 flex items-center justify-between group transition-all"
            >
              <span className="flex items-center gap-3">
                <Users className="w-5 h-5" />
                JOIN SESSION
              </span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-6 border-t border-[#1a1a1a]">
              <p className="font-mono-game text-[#444] text-xs text-center leading-relaxed">
                One player creates a session,<br />
                others join with the session code.<br />
                Up to 4 players per session.
              </p>
            </div>
          </div>
        )}

        {(mode === "create" || mode === "join") && (
          <div className="space-y-4">
            <button onClick={() => { setMode("home"); setError(""); }} className="font-mono-game text-[#555] text-xs hover:text-orange-500 transition-colors">
              ← BACK
            </button>

            {/* Name input */}
            <div>
              <label className="font-mono-game text-xs text-[#666] tracking-widest block mb-2">YOUR NAME</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="INMATE NAME..."
                maxLength={12}
                className="w-full bg-[#111] border border-[#333] focus:border-orange-500 outline-none text-white font-bold px-4 py-3 font-chakra tracking-wider placeholder:text-[#333] transition-colors"
              />
            </div>

            {/* Color picker */}
            <div>
              <label className="font-mono-game text-xs text-[#666] tracking-widest block mb-2">PLAYER COLOR</label>
              <div className="flex gap-3">
                {PLAYER_COLORS.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setColorIndex(i)}
                    className={`w-12 h-12 transition-all ${colorIndex === i ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#111]' : 'opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Join code (join mode only) */}
            {mode === "join" && (
              <div>
                <label className="font-mono-game text-xs text-[#666] tracking-widest block mb-2">SESSION CODE</label>
                <input
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value)}
                  placeholder="PASTE CODE..."
                  className="w-full bg-[#111] border border-[#333] focus:border-orange-500 outline-none text-white font-bold px-4 py-3 font-mono-game tracking-widest placeholder:text-[#333] transition-colors"
                />
              </div>
            )}

            {error && (
              <p className="font-mono-game text-red-500 text-xs">{error}</p>
            )}

            <button
              onClick={mode === "create" ? handleCreate : handleJoin}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold py-4 px-6 transition-all mt-2"
            >
              {loading ? "CONNECTING..." : mode === "create" ? "CREATE & ENTER" : "JOIN SESSION"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

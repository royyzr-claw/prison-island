"use client";

import { useState, useMemo } from "react";
import { type Cell } from "@/lib/gameData";
import { ArrowLeft } from "lucide-react";

interface Props {
  cell: Cell;
  onResult: (success: boolean) => void;
  onBack: () => void;
}

const MM_COLORS = ["🔴", "🔵", "🟢", "🟡", "🟠", "🟣"];
const CODE_LEN = 4;
const MAX_GUESSES = 8;

function MastermindGame({ onResult, onBack }: { onResult: (s: boolean) => void; onBack: () => void }) {
  const secret = useMemo(() => Array.from({ length: CODE_LEN }, () => Math.floor(Math.random() * 6)), []);
  const [guesses, setGuesses] = useState<{ guess: number[]; blacks: number; whites: number }[]>([]);
  const [current, setCurrent] = useState<number[]>([]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  const grade = (guess: number[]) => {
    let blacks = 0, whites = 0;
    const sLeft: (number | null)[] = [...secret];
    const gLeft: (number | null)[] = [...guess];
    for (let i = 0; i < CODE_LEN; i++) {
      if (guess[i] === secret[i]) { blacks++; sLeft[i] = null; gLeft[i] = null; }
    }
    for (let i = 0; i < CODE_LEN; i++) {
      if (gLeft[i] === null) continue;
      const j = sLeft.findIndex(v => v === gLeft[i]);
      if (j !== -1) { whites++; sLeft[j] = null; }
    }
    return { blacks, whites };
  };

  const submit = () => {
    if (current.length < CODE_LEN) return;
    const { blacks, whites } = grade(current);
    const newGuesses = [...guesses, { guess: current, blacks, whites }];
    setGuesses(newGuesses);
    setCurrent([]);
    if (blacks === CODE_LEN) {
      setWon(true);
      setTimeout(() => onResult(true), 800);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setLost(true);
      setTimeout(() => onResult(false), 800);
    }
  };

  const addColor = (c: number) => {
    if (current.length < CODE_LEN && !won && !lost) setCurrent(prev => [...prev, c]);
  };
  const removeLast = () => setCurrent(prev => prev.slice(0, -1));

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#1a1a1a]">
        <button onClick={onBack} className="text-[#444] hover:text-white p-1"><ArrowLeft className="w-5 h-5" /></button>
        <div className="text-center">
          <p className="font-mono-game text-orange-500 text-sm">MASTERMIND</p>
          <p className="font-mono-game text-[#444] text-[10px]">{MAX_GUESSES - guesses.length} guesses left</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Past guesses */}
        {guesses.map((g, i) => (
          <div key={i} className="flex items-center gap-3 bg-[#0d0d0d] border border-[#1a1a1a] px-3 py-2">
            <div className="flex gap-1">
              {g.guess.map((c, j) => <span key={j} className="text-xl">{MM_COLORS[c]}</span>)}
            </div>
            <div className="ml-auto flex gap-1 items-center">
              {Array(g.blacks).fill("⬛").map((x, i) => <span key={i} className="text-xs">{x}</span>)}
              {Array(g.whites).fill("⬜").map((x, i) => <span key={i} className="text-xs">{x}</span>)}
              <span className="font-mono-game text-[#444] text-[10px] ml-1">
                {g.blacks}B {g.whites}W
              </span>
            </div>
          </div>
        ))}

        {/* Current input */}
        {!won && !lost && (
          <div className="border-2 border-orange-500/50 bg-orange-500/5 px-3 py-3">
            <div className="flex gap-2 h-8 items-center">
              {Array(CODE_LEN).fill(0).map((_, i) => (
                <div key={i} className="w-8 h-8 flex items-center justify-center text-xl border border-[#333]">
                  {current[i] !== undefined ? MM_COLORS[current[i]] : "·"}
                </div>
              ))}
            </div>
          </div>
        )}

        {won && <p className="text-center font-chakra font-bold text-xl text-green-400 py-4">🎉 CRACKED IT!</p>}
        {lost && (
          <div className="text-center py-4">
            <p className="font-chakra font-bold text-xl text-red-500">💀 FAILED</p>
            <p className="font-mono-game text-[#444] text-xs mt-1">Secret: {secret.map(c => MM_COLORS[c]).join("")}</p>
          </div>
        )}
      </div>

      {!won && !lost && (
        <div className="border-t border-[#1a1a1a] p-4 space-y-3">
          <div className="grid grid-cols-6 gap-2">
            {MM_COLORS.map((c, i) => (
              <button key={i} onClick={() => addColor(i)} className="aspect-square text-2xl flex items-center justify-center bg-[#111] hover:bg-[#222] border border-[#2a2a2a] transition-all active:scale-90">
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={removeLast} className="flex-1 border border-[#333] text-[#666] py-3 font-mono-game text-sm">
              ← UNDO
            </button>
            <button
              onClick={submit}
              disabled={current.length < CODE_LEN}
              className="flex-[2] bg-orange-500 disabled:opacity-40 text-white font-bold py-3"
            >
              SUBMIT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple 3-digit code cracker for The Prison / Devils Island
function CodeCrackerGame({ cell, onResult, onBack }: Props) {
  const codeLen = cell.name === "The Prison" ? 3 : 4;
  const secret = useMemo(() => Array.from({ length: codeLen }, () => Math.floor(Math.random() * 10)).join(""), [codeLen]);
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState<string[]>([
    `Clue: One digit is ${secret[0]}`,
    `Clue: Sum of all digits is ${secret.split("").reduce((a, b) => a + parseInt(b), 0)}`,
    `Clue: The last digit is ${secret[secret.length - 1]}`,
  ]);
  const [shownHints, setShownHints] = useState(1);

  const tryCode = () => {
    if (input.length !== codeLen) return;
    setAttempts(a => a + 1);
    if (input === secret) {
      setTimeout(() => onResult(true), 500);
    } else {
      if (shownHints < hints.length) setShownHints(s => s + 1);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#1a1a1a]">
        <button onClick={onBack} className="text-[#444] hover:text-white p-1"><ArrowLeft className="w-5 h-5" /></button>
        <p className="font-mono-game text-orange-500 text-sm">CRACK THE CODE</p>
      </div>
      <div className="flex-1 p-6 flex flex-col gap-4">
        <div className="space-y-2">
          {hints.slice(0, shownHints).map((h, i) => (
            <div key={i} className="bg-[#0d0d0d] border border-[#1a1a1a] px-4 py-3 font-mono-game text-sm text-[#aaa]">
              🔑 {h}
            </div>
          ))}
        </div>

        <div className="flex gap-2 justify-center my-4">
          {Array(codeLen).fill(0).map((_, i) => (
            <div key={i} className="w-12 h-14 bg-[#0d0d0d] border-2 border-[#333] flex items-center justify-center font-mono-game font-bold text-2xl text-orange-400">
              {input[i] || "·"}
            </div>
          ))}
        </div>

        <p className="font-mono-game text-[#444] text-xs text-center">{attempts} attempts</p>

        <div className="grid grid-cols-3 gap-2 mt-auto">
          {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((k, i) => (
            <button
              key={i}
              onClick={() => {
                if (k === "⌫") setInput(s => s.slice(0,-1));
                else if (k !== "" && input.length < codeLen) setInput(s => s + k);
              }}
              className={`py-4 text-xl font-mono-game font-bold border transition-all active:scale-95 ${
                k === "" ? "invisible" : "border-[#2a2a2a] bg-[#111] hover:bg-[#1a1a1a] text-white"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
        <button onClick={tryCode} disabled={input.length < codeLen} className="w-full bg-orange-500 disabled:opacity-40 text-white font-bold py-4 mt-2">
          ENTER CODE
        </button>
      </div>
    </div>
  );
}

export function CodeGame({ cell, onResult, onBack }: Props) {
  if (cell.name === "Mastermind") return <MastermindGame onResult={onResult} onBack={onBack} />;
  return <CodeCrackerGame cell={cell} onResult={onResult} onBack={onBack} />;
}

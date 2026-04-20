"use client";

import { useState } from "react";
import { type Cell } from "@/lib/gameData";
import { ArrowLeft } from "lucide-react";

interface Props {
  cell: Cell;
  onResult: (success: boolean) => void;
  onBack: () => void;
}

// Each player is secretly assigned a color. They must mix them to get the right output.
const COMBOS = [
  { inputs: ["Red", "Blue"], output: "Purple", emoji: "🟣" },
  { inputs: ["Blue", "Yellow"], output: "Green", emoji: "🟢" },
  { inputs: ["Red", "Yellow"], output: "Orange", emoji: "🟠" },
  { inputs: ["Red", "Blue", "Yellow"], output: "Brown", emoji: "🟤" },
];

const ANSWER_OPTIONS = ["Purple", "Green", "Orange", "Brown", "Pink", "Cyan"];

export function VoteGame({ cell, onResult, onBack }: Props) {
  const [combo] = useState(() => COMBOS[Math.floor(Math.random() * COMBOS.length)]);
  const [myColor] = useState(() => {
    const all = ["Red", "Blue", "Yellow", "Green"];
    return all[Math.floor(Math.random() * all.length)];
  });
  const [answer, setAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const submit = () => {
    if (!answer) return;
    setAttempts(a => a + 1);
    setSubmitted(true);
    const correct = answer === combo.output;
    setTimeout(() => {
      if (correct) onResult(true);
      else { setSubmitted(false); setAnswer(null); }
    }, 800);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#1a1a1a]">
        <button onClick={onBack} className="text-[#444] hover:text-white p-1"><ArrowLeft className="w-5 h-5" /></button>
        <p className="font-mono-game text-orange-500 text-sm">COLOR BLIND</p>
      </div>
      <div className="flex-1 flex flex-col p-6 gap-6">
        {/* Player's secret color */}
        <div className="bg-[#0d0d0d] border border-orange-500/30 p-4 text-center">
          <p className="font-mono-game text-[#666] text-[10px] tracking-widest mb-2">YOUR SECRET COLOR</p>
          <p className="font-chakra font-bold text-3xl text-orange-400">{myColor}</p>
          <p className="font-mono-game text-[#444] text-xs mt-2">Tell your team, but don't show your screen!</p>
        </div>

        <div className="text-center">
          <p className="font-mono-game text-[#666] text-xs tracking-widest mb-1">MIX ALL COLORS TO GET...</p>
          <p className="font-chakra font-bold text-xl">What color does your team make?</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {ANSWER_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => !submitted && setAnswer(opt)}
              className="py-4 border font-mono-game font-bold transition-all"
              style={{
                borderColor: answer === opt ? "#f97316" : "#2a2a2a",
                background: answer === opt ? "#f9731611" : "#0d0d0d",
                color: answer === opt ? "#f97316" : "#888",
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {submitted && (
          <div className="text-center">
            {answer === combo.output ? (
              <p className="font-chakra text-xl font-bold text-green-400">✅ CORRECT!</p>
            ) : (
              <p className="font-chakra text-xl font-bold text-red-500">❌ Wrong — try again</p>
            )}
          </div>
        )}

        <button
          onClick={submit}
          disabled={!answer || submitted}
          className="w-full bg-orange-500 disabled:opacity-40 text-white font-bold py-4 mt-auto"
        >
          SUBMIT ANSWER
        </button>

        {attempts > 0 && !submitted && (
          <p className="font-mono-game text-[#444] text-xs text-center">{attempts} attempt{attempts > 1 ? 's' : ''}</p>
        )}
      </div>
    </div>
  );
}

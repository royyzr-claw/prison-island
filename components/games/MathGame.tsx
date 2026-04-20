"use client";

import { useState, useEffect } from "react";
import { type Cell } from "@/lib/gameData";
import { ArrowLeft } from "lucide-react";

interface Props {
  cell: Cell;
  onResult: (success: boolean) => void;
  onBack: () => void;
}

// Studio 21 - hit exactly 21
function Studio21({ onResult, onBack }: { onResult: (s: boolean) => void; onBack: () => void }) {
  const [deck] = useState(() => {
    const cards = [];
    for (let i = 1; i <= 10; i++) {
      cards.push(i, i, i, i);
    }
    return cards.sort(() => Math.random() - 0.5);
  });
  const [hand, setHand] = useState<number[]>([]);
  const [deckIdx, setDeckIdx] = useState(0);
  const [done, setDone] = useState(false);

  const total = hand.reduce((a, b) => a + b, 0);
  const draws = hand.length;
  const MAX_DRAWS = 5;

  const drawCard = () => {
    if (done || draws >= MAX_DRAWS || deckIdx >= deck.length) return;
    const card = deck[deckIdx];
    const newHand = [...hand, card];
    setHand(newHand);
    setDeckIdx(i => i + 1);
    const newTotal = newHand.reduce((a, b) => a + b, 0);
    if (newTotal > 21) {
      setDone(true);
      setTimeout(() => onResult(false), 800);
    }
  };

  const stand = () => {
    setDone(true);
    setTimeout(() => onResult(total === 21), 600);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#1a1a1a]">
        <button onClick={onBack} className="text-[#444] hover:text-white p-1"><ArrowLeft className="w-5 h-5" /></button>
        <p className="font-mono-game text-[#666] text-xs">STUDIO 21 — HIT EXACTLY 21</p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        <div className={`text-center ${total > 21 ? 'text-red-500' : total === 21 ? 'text-green-400' : 'text-white'}`}>
          <p className="font-mono-game text-6xl font-bold">{total}</p>
          <p className="font-mono-game text-[#444] text-sm mt-1">TOTAL · {draws}/{MAX_DRAWS} draws</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {hand.map((card, i) => (
            <div key={i} className="w-12 h-16 bg-[#1a1a1a] border border-[#333] flex items-center justify-center font-mono-game font-bold text-lg text-orange-400">
              {card}
            </div>
          ))}
        </div>
        {!done && (
          <div className="flex gap-3 w-full">
            <button onClick={drawCard} disabled={draws >= MAX_DRAWS || total > 21} className="flex-1 bg-orange-500 disabled:opacity-40 text-white font-bold py-4">
              DRAW ({MAX_DRAWS - draws} left)
            </button>
            <button onClick={stand} className="flex-1 border border-[#333] text-white font-bold py-4">
              STAND
            </button>
          </div>
        )}
        {done && (
          <p className={`font-chakra font-bold text-2xl ${total === 21 ? 'text-green-400' : 'text-red-500'}`}>
            {total === 21 ? "BLACKJACK! 🎰" : total > 21 ? "BUST! 💥" : `${total} ≠ 21 ❌`}
          </p>
        )}
      </div>
    </div>
  );
}

// Einstein - logic puzzles
const PUZZLES = [
  {
    q: "I have 3 apples. I eat 1. I give 1 away. How many do I have?",
    options: ["0", "1", "2", "3"],
    answer: 1, // "1"
  },
  {
    q: "A rooster lays an egg on a roof. Which way does it roll?",
    options: ["Left", "Right", "Down", "Roosters don't lay eggs"],
    answer: 3,
  },
  {
    q: "There are 3 switches for 3 bulbs. You can only enter the room once. How do you find out which is which?",
    options: ["Guess", "Turn one on, wait, then turn it off", "Use a mirror", "Call someone"],
    answer: 1,
  },
  {
    q: "A man walks into a bar and asks for a glass of water. The bartender pulls out a gun. The man says 'Thank you' and leaves. Why?",
    options: ["He was thirsty", "He had hiccups", "He was afraid of water", "He was a criminal"],
    answer: 1,
  },
  {
    q: "If it takes 5 machines 5 min to make 5 widgets, how long does it take 100 machines to make 100 widgets?",
    options: ["100 min", "5 min", "50 min", "1 min"],
    answer: 1,
  },
];

function EinsteinGame({ onResult, onBack }: { onResult: (s: boolean) => void; onBack: () => void }) {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [wrong, setWrong] = useState(false);
  const [correct, setCorrect] = useState(0);
  const TOTAL = 5;

  const puzzle = PUZZLES[puzzleIdx % PUZZLES.length];

  const pick = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === puzzle.answer) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setTimeout(() => {
        if (puzzleIdx + 1 >= TOTAL) {
          onResult(true);
        } else {
          setPuzzleIdx(p => p + 1);
          setSelected(null);
          setWrong(false);
        }
      }, 700);
    } else {
      setWrong(true);
      setTimeout(() => { setSelected(null); setWrong(false); }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#1a1a1a]">
        <button onClick={onBack} className="text-[#444] hover:text-white p-1"><ArrowLeft className="w-5 h-5" /></button>
        <p className="font-mono-game text-orange-500 text-sm">{puzzleIdx + 1} / {TOTAL}</p>
      </div>
      <div className="flex-1 flex flex-col p-6 gap-6">
        <div className="bg-[#0d0d0d] border border-[#2a2a2a] p-5 rounded">
          <p className="font-mono-game text-[#444] text-[10px] mb-3 tracking-widest">PUZZLE {puzzleIdx + 1}</p>
          <p className="font-chakra text-base leading-relaxed">{puzzle.q}</p>
        </div>
        <div className="space-y-3">
          {puzzle.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => pick(i)}
              className="w-full text-left border px-4 py-3 font-chakra text-sm transition-all"
              style={{
                borderColor: selected === i
                  ? (i === puzzle.answer ? "#22c55e" : "#ef4444")
                  : "#1a1a1a",
                background: selected === i
                  ? (i === puzzle.answer ? "#22c55e11" : "#ef444411")
                  : "#0d0d0d",
                color: selected === i
                  ? (i === puzzle.answer ? "#22c55e" : "#ef4444")
                  : "#ccc",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MathGame({ cell, onResult, onBack }: Props) {
  if (cell.name === "Studio 21") return <Studio21 onResult={onResult} onBack={onBack} />;
  return <EinsteinGame onResult={onResult} onBack={onBack} />;
}

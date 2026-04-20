export type CellType = "puzzle" | "reflex" | "memory" | "physical" | "sequence" | "trivia" | "cooperative";

export interface Cell {
  id: number;
  name: string;
  minPlayers: number;
  maxPoints: number;
  stressLevel: number;
  type: CellType;
  emoji: string;
  description: string;
  challenge: ChallengeConfig;
}

export interface ChallengeConfig {
  type: "code" | "sequence" | "whack" | "laser" | "memory" | "word" | "math" | "reflex" | "cooperative" | "slider" | "pattern" | "vote";
  instructions: string;
  timeLimit: number; // seconds
}

export const CELLS: Cell[] = [
  {
    id: 1, name: "Basket", minPlayers: 1, maxPoints: 100, stressLevel: 75,
    type: "reflex", emoji: "🏀",
    description: "Tap the moving basket to score before time runs out!",
    challenge: { type: "reflex", instructions: "Tap the basket every time it glows orange. Score 10 hits to win!", timeLimit: 30 }
  },
  {
    id: 2, name: "Butchers Lane", minPlayers: 1, maxPoints: 100, stressLevel: 70,
    type: "sequence", emoji: "🔪",
    description: "Find the hidden pattern in the chaos.",
    challenge: { type: "pattern", instructions: "Memorize the sequence, then repeat it exactly. Three rounds to win.", timeLimit: 45 }
  },
  {
    id: 3, name: "Catch", minPlayers: 3, maxPoints: 100, stressLevel: 80,
    type: "cooperative", emoji: "🎯",
    description: "All players must tap their target at the exact same moment!",
    challenge: { type: "cooperative", instructions: "Coordinate with your team — all 3+ players must tap CATCH simultaneously. Watch the countdown!", timeLimit: 60 }
  },
  {
    id: 4, name: "ColorBlind", minPlayers: 3, maxPoints: 100, stressLevel: 75,
    type: "cooperative", emoji: "🎨",
    description: "Each player sees one color. Work together to mix the right shade.",
    challenge: { type: "vote", instructions: "Each player votes for their color. The team must agree on the correct combination to unlock the cell.", timeLimit: 45 }
  },
  {
    id: 5, name: "Copy Cat", minPlayers: 1, maxPoints: 100, stressLevel: 90,
    type: "memory", emoji: "🐱",
    description: "Mirror the flashing sequence perfectly.",
    challenge: { type: "sequence", instructions: "Watch the pattern flash, then repeat it exactly. Gets faster each round — 5 rounds to win!", timeLimit: 60 }
  },
  {
    id: 6, name: "Devils Island", minPlayers: 3, maxPoints: 100, stressLevel: 50,
    type: "puzzle", emoji: "😈",
    description: "Decode the devil's cipher together.",
    challenge: { type: "code", instructions: "Crack the 4-digit code. Your team gets clues — share them to find the answer!", timeLimit: 90 }
  },
  {
    id: 7, name: "Dive", minPlayers: 3, maxPoints: 100, stressLevel: 50,
    type: "cooperative", emoji: "🤿",
    description: "Guide the diver through the ocean floor as a team.",
    challenge: { type: "cooperative", instructions: "Players take turns tapping LEFT or RIGHT to steer the diver. Don't hit the rocks!", timeLimit: 60 }
  },
  {
    id: 8, name: "Einstein", minPlayers: 1, maxPoints: 100, stressLevel: 25,
    type: "puzzle", emoji: "🧠",
    description: "Pure logic. No tricks. Just think.",
    challenge: { type: "math", instructions: "Solve 5 increasingly hard logic puzzles. Take your time — stress level is low but the problems are tricky!", timeLimit: 120 }
  },
  {
    id: 9, name: "Green Mile", minPlayers: 3, maxPoints: 100, stressLevel: 50,
    type: "cooperative", emoji: "🌿",
    description: "Navigate the green mile — one wrong step and you restart.",
    challenge: { type: "sequence", instructions: "The team must agree on each step of the path. Vote on LEFT, RIGHT, or FORWARD — unanimous decisions only!", timeLimit: 90 }
  },
  {
    id: 10, name: "Hands On", minPlayers: 3, maxPoints: 100, stressLevel: 90,
    type: "physical", emoji: "✋",
    description: "Every player must hold their button at exactly the same time!",
    challenge: { type: "cooperative", instructions: "ALL players must hold their button simultaneously for 3 seconds. Communicate and coordinate!", timeLimit: 45 }
  },
  {
    id: 11, name: "Hitman", minPlayers: 1, maxPoints: 75, stressLevel: 60,
    type: "reflex", emoji: "🎯",
    description: "Tap the target before it disappears. One shot, one kill.",
    challenge: { type: "reflex", instructions: "Tap targets the moment they appear. Miss 3 and it's over. Score 15 hits to complete the mission!", timeLimit: 40 }
  },
  {
    id: 12, name: "Joker", minPlayers: 2, maxPoints: 100, stressLevel: 90,
    type: "reflex", emoji: "🃏",
    description: "The rules change every 5 seconds. Stay sharp!",
    challenge: { type: "reflex", instructions: "Tap RED when the screen says GREEN and GREEN when it says RED. Rules may flip — read carefully!", timeLimit: 30 }
  },
  {
    id: 13, name: "Laser Gun", minPlayers: 3, maxPoints: 100, stressLevel: 50,
    type: "cooperative", emoji: "🔫",
    description: "Players take turns firing — hit all targets without missing.",
    challenge: { type: "cooperative", instructions: "Take turns shooting targets in order. Each player fires once per round — coordinate your shots!", timeLimit: 60 }
  },
  {
    id: 14, name: "Maps", minPlayers: 2, maxPoints: 100, stressLevel: 50,
    type: "puzzle", emoji: "🗺️",
    description: "One player has the map. One player has the compass. Navigate together.",
    challenge: { type: "cooperative", instructions: "Player 1 sees the map, Player 2 sees the directions. Communicate to find the X!", timeLimit: 90 }
  },
  {
    id: 15, name: "Mastermind", minPlayers: 1, maxPoints: 100, stressLevel: 90,
    type: "puzzle", emoji: "🧩",
    description: "Crack the code with logic and deduction.",
    challenge: { type: "code", instructions: "Guess the 4-color code in 8 tries. Black peg = right color, right place. White peg = right color, wrong place.", timeLimit: 120 }
  },
  {
    id: 16, name: "Penalty", minPlayers: 1, maxPoints: 100, stressLevel: 75,
    type: "reflex", emoji: "⚽",
    description: "Score the penalty — aim and shoot before the keeper dives!",
    challenge: { type: "reflex", instructions: "Watch the goalkeeper, then tap your shot direction at the perfect moment. Score 5 penalties to win!", timeLimit: 45 }
  },
  {
    id: 17, name: "Riot", minPlayers: 2, maxPoints: 100, stressLevel: 90,
    type: "reflex", emoji: "🚨",
    description: "Total chaos. All players smash their screens as fast as possible.",
    challenge: { type: "cooperative", instructions: "ALL players tap as fast as possible! Combined taps fill the riot meter — reach 200 taps in 20 seconds!", timeLimit: 20 }
  },
  {
    id: 18, name: "Shark Bay", minPlayers: 3, maxPoints: 75, stressLevel: 50,
    type: "cooperative", emoji: "🦈",
    description: "Stay still — the shark detects movement. Don't tap!",
    challenge: { type: "reflex", instructions: "DON'T TAP. Hold perfectly still for 10 seconds. Any player who taps fails the team!", timeLimit: 15 }
  },
  {
    id: 19, name: "Shipyard", minPlayers: 3, maxPoints: 100, stressLevel: 80,
    type: "cooperative", emoji: "⚓",
    description: "Build the ship together — each player has different parts.",
    challenge: { type: "sequence", instructions: "Players must tap their pieces in the correct build order. Coordinate without revealing your piece — describe it!", timeLimit: 75 }
  },
  {
    id: 20, name: "Studio 21", minPlayers: 1, maxPoints: 100, stressLevel: 90,
    type: "puzzle", emoji: "🎰",
    description: "Hit exactly 21. Not more, not less.",
    challenge: { type: "math", instructions: "Add or subtract cards to reach exactly 21. You have 5 draws — finish on 21 to win!", timeLimit: 60 }
  },
  {
    id: 21, name: "Submarine", minPlayers: 2, maxPoints: 75, stressLevel: 50,
    type: "cooperative", emoji: "🚢",
    description: "Two players control the submarine's depth together.",
    challenge: { type: "cooperative", instructions: "Player 1 presses UP, Player 2 presses DOWN — together you steer. Navigate through the gaps!", timeLimit: 60 }
  },
  {
    id: 22, name: "The Gym", minPlayers: 3, maxPoints: 100, stressLevel: 90,
    type: "physical", emoji: "💪",
    description: "Pure speed. Tap the glowing spots faster than anyone.",
    challenge: { type: "reflex", instructions: "Tap every glowing circle as fast as you can. All players contribute — combined speed score must hit 500!", timeLimit: 30 }
  },
  {
    id: 23, name: "The Nest", minPlayers: 2, maxPoints: 75, stressLevel: 90,
    type: "memory", emoji: "🪺",
    description: "Remember where the eggs are hidden — the nest shifts!",
    challenge: { type: "memory", instructions: "Watch the eggs get hidden under shells. The shells shuffle — tap to reveal all 5 eggs!", timeLimit: 45 }
  },
  {
    id: 24, name: "The Prison", minPlayers: 2, maxPoints: 50, stressLevel: 80,
    type: "puzzle", emoji: "🔒",
    description: "The cell within the cell. Find the 3-digit combination.",
    challenge: { type: "code", instructions: "Decode clues to find the 3-digit combination. Each player has one clue. Share them wisely!", timeLimit: 90 }
  },
  {
    id: 25, name: "The Vault", minPlayers: 3, maxPoints: 100, stressLevel: 90,
    type: "cooperative", emoji: "🏦",
    description: "Everyone must enter their key simultaneously to crack the vault.",
    challenge: { type: "cooperative", instructions: "On GO, all players press their unique symbol at the SAME time. Any mistimed press resets the vault!", timeLimit: 60 }
  },
  {
    id: 26, name: "Tilt", minPlayers: 1, maxPoints: 50, stressLevel: 50,
    type: "puzzle", emoji: "⚖️",
    description: "Balance the scales to find the odd weight.",
    challenge: { type: "math", instructions: "Use the balance scale to find the one heavy ball in the fewest weighings. 3 chances to identify it!", timeLimit: 90 }
  },
  {
    id: 27, name: "Tower", minPlayers: 2, maxPoints: 100, stressLevel: 50,
    type: "cooperative", emoji: "🗼",
    description: "Stack the blocks together — don't let the tower fall!",
    challenge: { type: "cooperative", instructions: "Players take turns placing blocks. Time your taps to place them perfectly — misalignment makes the tower wobble!", timeLimit: 90 }
  },
  {
    id: 28, name: "Waterfall", minPlayers: 3, maxPoints: 50, stressLevel: 60,
    type: "cooperative", emoji: "💧",
    description: "Channel the water — each player controls one gate.",
    challenge: { type: "cooperative", instructions: "Players open/close their gates in sequence to guide water to the bucket. Coordinate timing perfectly!", timeLimit: 60 }
  },
  {
    id: 29, name: "Whack-a-Mole", minPlayers: 1, maxPoints: 100, stressLevel: 90,
    type: "physical", emoji: "🔨",
    description: "Whack every mole before it hides. Classic, brutal, fast.",
    challenge: { type: "whack", instructions: "Tap moles the moment they pop up. Don't miss — 3 misses and you're done. Get 20 moles to win!", timeLimit: 35 }
  },
  {
    id: 30, name: "Wire", minPlayers: 2, maxPoints: 75, stressLevel: 50,
    type: "puzzle", emoji: "⚡",
    description: "Match the wires — connect the right pairs before the circuit blows.",
    challenge: { type: "pattern", instructions: "Connect matching colored wires. Each player sees different ends — describe yours to find the pairs!", timeLimit: 75 }
  },
];

export const PLAYER_COLORS = [
  { name: "Red", bg: "bg-red-500", text: "text-red-400", hex: "#ef4444", border: "border-red-500" },
  { name: "Blue", bg: "bg-blue-500", text: "text-blue-400", hex: "#3b82f6", border: "border-blue-500" },
  { name: "Green", bg: "bg-green-500", text: "text-green-400", hex: "#22c55e", border: "border-green-500" },
  { name: "Yellow", bg: "bg-yellow-500", text: "text-yellow-400", hex: "#eab308", border: "border-yellow-500" },
];

export type GameStatus = "lobby" | "playing" | "finished";

export interface PlayerData {
  id: string;
  name: string;
  colorIndex: number;
  score: number;
  cellsCompleted: number[];
  currentCell: number | null;
  lastSeen: number;
}

export interface GameSession {
  id: string;
  status: GameStatus;
  startTime: number | null;
  endTime: number | null;
  players: Record<string, PlayerData>;
  cellAttempts: Record<number, Record<string, { attempts: number; completed: boolean; score: number }>>;
}

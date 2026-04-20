"use client";

interface Props {
  timeLeft: number;
}

export function Timer({ timeLeft }: Props) {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isWarning = timeLeft < 300; // 5 min
  const isCritical = timeLeft < 60;

  return (
    <div className={`text-right ${isCritical ? 'timer-warning' : isWarning ? 'text-red-400' : 'text-white'}`}>
      <p className={`font-mono-game font-bold text-xl leading-none tracking-widest`}>
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </p>
      <p className="font-mono-game text-[10px] text-[#444]">REMAINING</p>
    </div>
  );
}

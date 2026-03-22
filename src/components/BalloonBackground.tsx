import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const BALLOON_COLORS = ['#ec4899', '#a855f7', '#3b82f6', '#eab308', '#f97316'];

export default function BalloonBackground() {
  const [balloons, setBalloons] = useState<{ id: number; left: string; color: string; delay: number; size: number }[]>([]);

  useEffect(() => {
    const newBalloons = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      delay: Math.random() * 20,
      size: 20 + Math.random() * 40
    }));
    setBalloons(newBalloons);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
      {balloons.map((b) => (
        <div
          key={b.id}
          className="balloon"
          style={{
            left: b.left,
            animationDelay: `${b.delay}s`,
            width: `${b.size}px`,
            height: `${b.size * 1.2}px`,
          }}
        >
          <svg viewBox="0 0 100 120" fill={b.color} style={{ opacity: 0.6 }}>
            <ellipse cx="50" cy="50" rx="40" ry="50" />
            <path d="M50 100 L45 115 L55 115 Z" />
            <path d="M50 115 Q55 125 50 135" stroke={b.color} fill="none" strokeWidth="2" />
          </svg>
        </div>
      ))}
    </div>
  );
}

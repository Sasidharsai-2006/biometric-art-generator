import React, { useState, useRef, useEffect } from 'react';
import { Keyboard } from 'lucide-react';

export type TypingMetrics = {
  wpm: number;
  rhythm: string;
  intensity: number;
};

type TypingTrackerProps = {
  onTypingDataChange: (data: TypingMetrics) => void;
  isActive: boolean;
};

const TypingTracker: React.FC<TypingTrackerProps> = ({ onTypingDataChange, isActive }) => {
  const [typingMetrics, setTypingMetrics] = useState<TypingMetrics>({
    wpm: 0,
    rhythm: 'steady',
    intensity: 0.5
  });

  const keyTimings = useRef<number[]>([]);
  const lastKeyTime = useRef<number>(Date.now());

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = () => {
      const now = Date.now();
      const timeSinceLastKey = now - lastKeyTime.current;
      
      keyTimings.current.push(timeSinceLastKey);
      if (keyTimings.current.length > 20) {
        keyTimings.current.shift();
      }
      
      lastKeyTime.current = now;
      
      // Calculate metrics
      const avgInterval = keyTimings.current.reduce((a, b) => a + b, 0) / keyTimings.current.length;
      const wpm = Math.round(60000 / avgInterval / 5); // Approximate WPM
      
      const variance = keyTimings.current.reduce((sum, time) => 
        sum + Math.pow(time - avgInterval, 2), 0) / keyTimings.current.length;
      
      const rhythm = variance > 10000 ? 'erratic' : variance < 2000 ? 'steady' : 'moderate';
      const intensity = Math.min(1, wpm / 100);
      
      const newMetrics: TypingMetrics = { wpm, rhythm, intensity };
      setTypingMetrics(newMetrics);
      onTypingDataChange(newMetrics);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onTypingDataChange]);

  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2 mb-2">
        <Keyboard className="w-5 h-5 text-blue-500" />
        <span className="font-medium text-blue-700">Typing Analysis</span>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <div className="text-blue-600 font-bold">{typingMetrics.wpm}</div>
          <div className="text-blue-500">WPM</div>
        </div>
        <div>
          <div className="text-blue-600 font-bold capitalize">{typingMetrics.rhythm}</div>
          <div className="text-blue-500">Rhythm</div>
        </div>
        <div>
          <div className="text-blue-600 font-bold">{Math.round(typingMetrics.intensity * 100)}%</div>
          <div className="text-blue-500">Intensity</div>
        </div>
      </div>
    </div>
  );
};

export default TypingTracker;

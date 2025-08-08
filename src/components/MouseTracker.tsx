import React, { useState, useRef, useEffect } from 'react';
import { Mouse } from 'lucide-react';

export type MouseMetrics = {
  speed: number;
  smoothness: number;
  activity: string;
};

type MouseTrackerProps = {
  onMouseDataChange: (data: MouseMetrics) => void;
  isActive: boolean;
};

type MousePosition = {
  x: number;
  y: number;
  time: number;
};

const MouseTracker: React.FC<MouseTrackerProps> = ({ onMouseDataChange, isActive }) => {
  const [mouseMetrics, setMouseMetrics] = useState<MouseMetrics>({
    speed: 0,
    smoothness: 0.5,
    activity: 'idle'
  });

  const mousePositions = useRef<MousePosition[]>([]);
  const lastMouseTime = useRef<number>(Date.now());

  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const position: MousePosition = { x: e.clientX, y: e.clientY, time: now };
      
      mousePositions.current.push(position);
      if (mousePositions.current.length > 10) {
        mousePositions.current.shift();
      }
      
      if (mousePositions.current.length > 1) {
        const recent = mousePositions.current.slice(-2);
        const distance = Math.sqrt(
          Math.pow(recent[1].x - recent[0].x, 2) + 
          Math.pow(recent[1].y - recent[0].y, 2)
        );
        const timeDiff = recent[1].time - recent[0].time;
        const speed = distance / (timeDiff || 1);
        
        // Calculate smoothness based on direction changes
        let smoothness = 0.5;
        if (mousePositions.current.length >= 3) {
          const directions: number[] = [];
          for (let i = 1; i < mousePositions.current.length; i++) {
            const dx = mousePositions.current[i].x - mousePositions.current[i-1].x;
            const dy = mousePositions.current[i].y - mousePositions.current[i-1].y;
            directions.push(Math.atan2(dy, dx));
          }
          
          let directionChanges = 0;
          for (let i = 1; i < directions.length; i++) {
            if (Math.abs(directions[i] - directions[i-1]) > 0.5) {
              directionChanges++;
            }
          }
          
          smoothness = Math.max(0, 1 - (directionChanges / directions.length));
        }
        
        const activity = speed > 2 ? 'active' : speed > 0.5 ? 'moderate' : 'idle';
        
        const newMetrics: MouseMetrics = { speed: Math.round(speed), smoothness, activity };
        setMouseMetrics(newMetrics);
        onMouseDataChange(newMetrics);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isActive, onMouseDataChange]);

  return (
    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
      <div className="flex items-center gap-2 mb-2">
        <Mouse className="w-5 h-5 text-green-500" />
        <span className="font-medium text-green-700">Mouse Behavior</span>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <div className="text-green-600 font-bold">{mouseMetrics.speed}</div>
          <div className="text-green-500">Speed</div>
        </div>
        <div>
          <div className="text-green-600 font-bold">{Math.round(mouseMetrics.smoothness * 100)}%</div>
          <div className="text-green-500">Smooth</div>
        </div>
        <div>
          <div className="text-green-600 font-bold capitalize">{mouseMetrics.activity}</div>
          <div className="text-green-500">Activity</div>
        </div>
      </div>
    </div>
  );
};

export default MouseTracker;

export type TypingData = {
  wpm: number;
  rhythm: string;
  intensity: number;
};

export type MouseData = {
  speed: number;
  smoothness: number;
  activity: string;
};

export const classifyEmotion = (
  heartRate: number,
  typingData: TypingData,
  mouseData: MouseData
): string => {
  const { rhythm, intensity } = typingData;
  const { speed, smoothness } = mouseData;
  
  if (heartRate > 90 && rhythm === 'erratic' && speed > 3) return 'stress';
  if (heartRate < 65 && smoothness > 0.7 && intensity < 0.3) return 'calm';
  if (smoothness > 0.8 && rhythm === 'steady' && heartRate > 70 && heartRate < 85) return 'flow';
  if (intensity > 0.7 && speed > 2) return 'focus';
  if (heartRate > 85 && intensity > 0.6) return 'excitement';
  
  return 'neutral';
};

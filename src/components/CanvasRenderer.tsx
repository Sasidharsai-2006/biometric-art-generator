import React, { useRef, useCallback, useEffect } from 'react';
import { classifyEmotion } from '../utils/emotionClassifier';
import { TypingMetrics } from './TypingTracker';
import { MouseMetrics } from './MouseTracker';

// You should import the actual Particle class from its file if you extracted it
import Particle from '../utils/Particle'; // Adjust path if needed

type CanvasRendererProps = {
  heartRate: number;
  typingData: TypingMetrics;
  mouseData: MouseMetrics;
  isActive: boolean;
};

const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  heartRate,
  typingData,
  mouseData,
  isActive
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const emotion = classifyEmotion(heartRate, typingData, mouseData);

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      stress: '#ff4444',
      calm: '#44ff88',
      flow: '#4488ff',
      focus: '#ff8844',
      excitement: '#ff44ff',
      neutral: '#888888'
    };
    return colors[emotion] || colors.neutral;
  };

  const spawnParticles = useCallback((canvas: HTMLCanvasElement, emotion: string) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const color = getEmotionColor(emotion);
    
    for (let i = 0; i < (emotion === 'stress' ? 8 : 3); i++) {
      const angle = (Math.PI * 2 / (emotion === 'stress' ? 8 : 3)) * i;
      const radius = emotion === 'focus' ? 50 : 100;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      particles.current.push(new Particle(x, y, color, emotion));
    }
    
    // Remove old particles
    particles.current = particles.current.filter(p => p.life > 0);
    if (particles.current.length > 200) {
      particles.current = particles.current.slice(-150);
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with fade effect
    ctx.fillStyle = `rgba(${emotion === 'calm' ? '240, 248, 255' : '20, 20, 30'}, 0.1)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.current.forEach(particle => {
      particle.update(heartRate, emotion);
      particle.draw(ctx);
    });
    
    // Draw emotion-specific background effects
    if (emotion === 'flow') {
      ctx.strokeStyle = getEmotionColor(emotion);
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 100 + Math.sin(Date.now() / 1000) * 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    
    // Spawn new particles periodically
    if (isActive && Math.random() < 0.1) {
      spawnParticles(canvas, emotion);
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [heartRate, emotion, isActive, spawnParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    if (isActive) {
      animate();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, animate]);

  return (
    <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '400px' }}>
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: emotion === 'calm' ? 'linear-gradient(45deg, #001122, #003344)' : '#1a1a2e' }}
      />
      
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
        <div className="text-sm">Current State</div>
        <div className="text-lg font-bold capitalize" style={{ color: getEmotionColor(emotion) }}>
          {emotion}
        </div>
      </div>
    </div>
  );
};

export default CanvasRenderer;

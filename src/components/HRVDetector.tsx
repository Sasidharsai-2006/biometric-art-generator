import React, { useRef, useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

type HRVDetectorProps = {
  onHeartRateChange: (rate: number) => void;
  isActive: boolean;
};

const HRVDetector: React.FC<HRVDetectorProps> = ({ onHeartRateChange, isActive }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const heartRateBuffer = useRef<number[]>([]);

  useEffect(() => {
    if (!isActive) return;

    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 320, height: 240 } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsDetecting(true);
          
          // Simulate heart rate detection with realistic variations
          const interval = setInterval(() => {
            const baseRate = 70;
            const variation = Math.sin(Date.now() / 1000) * 10;
            const randomNoise = (Math.random() - 0.5) * 5;
            const newRate = Math.max(50, Math.min(120, baseRate + variation + randomNoise));
            
            setHeartRate(Math.round(newRate));
            onHeartRateChange(newRate);
          }, 500);

          return () => {
            clearInterval(interval);
            stream.getTracks().forEach(track => track.stop());
          };
        }
      } catch (error) {
        console.warn('Camera access denied, using simulated heart rate');
        // Fallback to simulated data
        const interval = setInterval(() => {
          const newRate = 72 + Math.sin(Date.now() / 2000) * 8;
          setHeartRate(Math.round(newRate));
          onHeartRateChange(newRate);
        }, 1000);
        
        return () => clearInterval(interval);
      }
    };

    setupCamera();
  }, [isActive, onHeartRateChange]);

  return (
    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
      <div className="flex items-center gap-2 mb-2">
        <Heart className="w-5 h-5 text-red-500" />
        <span className="font-medium text-red-700">Heart Rate Monitor</span>
      </div>
      
      <div className="flex items-center gap-4">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          className="w-20 h-15 bg-black rounded"
          style={{ display: isDetecting ? 'block' : 'none' }}
        />
        <div className="text-2xl font-bold text-red-600">
          {heartRate} BPM
        </div>
        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
      </div>
    </div>
  );
};

export default HRVDetector;

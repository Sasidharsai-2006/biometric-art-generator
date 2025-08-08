import React, { useState, useEffect } from 'react';
import { Play, Pause, Settings, Download, Camera } from 'lucide-react';
import HRVDetector from './components/HRVDetector';
import TypingTracker from './components/TypingTracker';
import MouseTracker from './components/MouseTracker';
import CanvasRenderer from './components/CanvasRenderer';
import { classifyEmotion } from './utils/emotionClassifier';
import { TypingMetrics } from './components/TypingTracker';
import { MouseMetrics } from './components/MouseTracker';
import './App.css';

const App: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [typingData, setTypingData] = useState<TypingMetrics>({
    wpm: 0,
    rhythm: 'steady',
    intensity: 0.5
  });
  const [mouseData, setMouseData] = useState<MouseMetrics>({
    speed: 0,
    smoothness: 0.5,
    activity: 'idle'
  });
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadArt = () => {
    alert('Art export feature - would save current canvas as image');
  };

  return (
    <div className="app-container">
      <div className="header">
        <div>
          <h1>Biometric Art Generator</h1>
          <p>Transform your biometric data into beautiful, real-time generative art</p>
        </div>
        <div className="header-controls">
          <div className="time-display">
            <div className="time">{formatTime(sessionTime)}</div>
            <div className="label">Session Time</div>
          </div>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`start-btn ${isRunning ? 'pause' : 'start'}`}
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
        </div>
      </div>

      <div className="main-grid">
        <div className="side-panel">
          <div className="metrics-stack">
  <div className="metric-card heart-rate">
    <HRVDetector onHeartRateChange={setHeartRate} isActive={isRunning} />
  </div>

  <div className="metric-card typing-analysis">
    <TypingTracker onTypingDataChange={setTypingData} isActive={isRunning} />
  </div>

  <div className="metric-card mouse-behavior">
    <MouseTracker onMouseDataChange={setMouseData} isActive={isRunning} />
  </div>
</div>
          <div className="card">
            <h3>Controls</h3>
            <button 
              onClick={downloadArt}
              disabled={!isRunning}
              className="primary-btn"
            >
              <Download size={16} /> Export Art
            </button>
            <button className="secondary-btn">
              <Settings size={16} /> Settings
            </button>
          </div>

          <div className="instructions">
            <h3>How to Use</h3>
            <ul>
              <li>• Allow camera access for heart rate detection</li>
              <li>• Type and move your mouse naturally</li>
              <li>• Watch your emotions become art in real-time</li>
              <li>• Different emotional states create unique visuals</li>
            </ul>
          </div>
        </div>

        <div className="canvas-panel">
          <div className="card">
            <div className="canvas-header">
              <h2>Live Art Generation</h2>
              <div className="status">
                <Camera size={16} />
                <span>{isRunning ? 'Recording...' : 'Paused'}</span>
              </div>
            </div>

            <CanvasRenderer
              heartRate={heartRate}
              typingData={typingData}
              mouseData={mouseData}
              isActive={isRunning}
            />

            <div className="status-bar">
              <strong>Current Emotion:</strong> {classifyEmotion(heartRate, typingData, mouseData)} |
              <strong> Heart Rate:</strong> {heartRate} BPM |
              <strong> Typing:</strong> {typingData.wpm} WPM |
              <strong> Mouse:</strong> {mouseData.activity}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

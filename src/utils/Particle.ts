// src/utils/Particle.ts
export default class Particle {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  emotion: string;
  pulse: number;

  constructor(x: number, y: number, color: string, emotion: string) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.color = color;
    this.size = Math.random() * 4 + 2;
    this.life = 100;
    this.emotion = emotion;
    this.pulse = 0;
  }

  update(heartRate: number, emotion: string) {
    this.x += this.vx;
    this.y += this.vy;

    if (emotion === "calm") {
      this.pulse = Math.sin(Date.now() / 500) * 2;
    } else if (emotion === "stress") {
      this.pulse = Math.sin(Date.now() / 100) * 5;
    }

    this.life -= 0.5;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size + this.pulse, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

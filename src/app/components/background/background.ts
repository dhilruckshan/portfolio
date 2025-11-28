import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-background',
  standalone: true,
  template: '<canvas #bgCanvas id="bg-canvas"></canvas>',
  styles: [`
    #bg-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.4;
    }
  `]
})
export class BackgroundComponent implements AfterViewInit {
  @ViewChild('bgCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private particlesArray: Particle[] = [];

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.initParticles();
    this.animateParticles();
  }

  @HostListener('window:resize')
  onResize(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.initParticles();
  }

  private initParticles(): void {
    this.particlesArray = [];
    const canvas = this.canvasRef.nativeElement;
    const numberOfParticles = (canvas.height * canvas.width) / 15000;
    for (let i = 0; i < numberOfParticles; i++) {
      this.particlesArray.push(new Particle(canvas.width, canvas.height));
    }
  }

  private animateParticles(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < this.particlesArray.length; i++) {
      this.particlesArray[i].update(canvas.width, canvas.height);
      this.particlesArray[i].draw(this.ctx);

      for (let j = i; j < this.particlesArray.length; j++) {
        const dx = this.particlesArray[i].x - this.particlesArray[j].x;
        const dy = this.particlesArray[i].y - this.particlesArray[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(112, 0, 255, ${1 - distance / 100})`;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(this.particlesArray[i].x, this.particlesArray[i].y);
          this.ctx.lineTo(this.particlesArray[j].x, this.particlesArray[j].y);
          this.ctx.stroke();
        }
      }
    }
    requestAnimationFrame(() => this.animateParticles());
  }
}

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.color = 'rgba(112, 0, 255, 0.3)';
  }

  update(canvasWidth: number, canvasHeight: number): void {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvasWidth || this.x < 0) {
      this.speedX = -this.speedX;
    }
    if (this.y > canvasHeight || this.y < 0) {
      this.speedY = -this.speedY;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Gamify Pure Canvas Confetti Particle Shower
 * High-performance, zero external dependencies, 60fps physics-based confetti.
 */

let confettiCanvas = null;
let confettiCtx = null;
let animationFrameId = null;
let particles = [];

const COLORS = [
  '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
  '#ec4899', '#ef4444', '#06b6d4', '#eab308'
];

function initCanvas() {
  if (!confettiCanvas) {
    confettiCanvas = document.createElement('canvas');
    confettiCanvas.id = 'gamify-confetti-canvas';
    confettiCanvas.style.position = 'fixed';
    confettiCanvas.style.top = '0';
    confettiCanvas.style.left = '0';
    confettiCanvas.style.width = '100vw';
    confettiCanvas.style.height = '100vh';
    confettiCanvas.style.pointerEvents = 'none';
    confettiCanvas.style.zIndex = '999999';
    document.body.appendChild(confettiCanvas);
    confettiCtx = confettiCanvas.getContext('2d');
  }

  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

export function launchConfetti(count = 120) {
  initCanvas();
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  const width = confettiCanvas.width;
  const height = confettiCanvas.height;

  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: width * 0.5 + (Math.random() - 0.5) * (width * 0.4),
      y: height * 0.45 + (Math.random() - 0.5) * 50,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 14 - 6,
      gravity: 0.38 + Math.random() * 0.12,
      drag: 0.965,
      size: Math.random() * 8 + 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      shape: Math.random() > 0.4 ? 'rect' : 'circle',
      opacity: 1,
    });
  }

  let frames = 0;
  function render() {
    frames++;
    confettiCtx.clearRect(0, 0, width, height);

    let activeCount = 0;
    for (let p of particles) {
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      if (frames > 70) {
        p.opacity = Math.max(0, p.opacity - 0.015);
      }

      if (p.y < height + 40 && p.opacity > 0) {
        activeCount++;
        confettiCtx.save();
        confettiCtx.globalAlpha = p.opacity;
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);
        confettiCtx.fillStyle = p.color;

        if (p.shape === 'rect') {
          confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          confettiCtx.beginPath();
          confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          confettiCtx.fill();
        }
        confettiCtx.restore();
      }
    }

    if (activeCount > 0 && frames < 240) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      confettiCtx.clearRect(0, 0, width, height);
      animationFrameId = null;
    }
  }

  animationFrameId = requestAnimationFrame(render);
}

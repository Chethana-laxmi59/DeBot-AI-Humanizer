import React, { useEffect, useRef } from 'react';

interface Particle3D {
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  vz: number;
}

interface Interactive3DCanvasProps {
  className?: string;
  particleCount?: number;
  variant?: 'neural' | 'cosmic' | 'cyber';
  interactive?: boolean;
}

export const Interactive3DCanvas: React.FC<Interactive3DCanvasProps> = ({
  className = '',
  particleCount = 90,
  variant = 'neural',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Color palettes
    const palette =
      variant === 'cosmic'
        ? ['#a855f7', '#ec4899', '#6366f1', '#38bdf8', '#c084fc']
        : variant === 'cyber'
        ? ['#10b981', '#06b6d4', '#3b82f6', '#34d399', '#6ee7b7']
        : ['#38bdf8', '#818cf8', '#60a5fa', '#06b6d4', '#c084fc'];

    // Spawn 3D particles
    const particles: Particle3D[] = [];
    const spread = Math.min(width, height) * 0.75;

    for (let i = 0; i < particleCount; i++) {
      // Golden spiral distribution on a 3D sphere/ellipsoid
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const r = spread * (0.4 + Math.random() * 0.6);

      particles.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        radius: 1.5 + Math.random() * 2,
        color: palette[i % palette.length],
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.3,
      });
    }

    // Mouse tracking & smooth interpolation
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;

    // Shockwave ripples
    interface Shockwave {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
    }
    const shockwaves: Shockwave[] = [];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left - width / 2;
      mouseY = e.clientY - rect.top - height / 2;

      targetRotY = (mouseX / width) * 1.2;
      targetRotX = -(mouseY / height) * 1.2;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      shockwaves.push({
        x: clickX,
        y: clickY,
        radius: 5,
        maxRadius: Math.min(width, height) * 0.45,
        opacity: 0.8,
      });
    };

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      canvas.addEventListener('click', handleClick);
    }
    window.addEventListener('resize', handleResize);

    // 3D Projection parameters
    const fov = 420;
    const cameraDistance = 550;
    let autoAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth camera rotation damping
      autoAngle += 0.003;
      currentRotY += (targetRotY + Math.sin(autoAngle) * 0.25 - currentRotY) * 0.05;
      currentRotX += (targetRotX + Math.cos(autoAngle * 0.7) * 0.15 - currentRotX) * 0.05;

      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

      const centerX = width / 2;
      const centerY = height / 2;

      // Projected points
      const projected = particles.map((p) => {
        // Slow particle drift
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Bounce within sphere boundary
        const dist = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
        if (dist > spread) {
          p.vx *= -1;
          p.vy *= -1;
          p.vz *= -1;
        }

        // 3D Rotation Y
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        // 3D Rotation X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        // Perspective projection
        const scale = fov / (fov + z2 + cameraDistance);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;
        const alpha = Math.max(0.1, Math.min(1, (z2 + spread) / (2 * spread)));

        return {
          projX,
          projY,
          scale,
          alpha,
          color: p.color,
          radius: p.radius * scale * 1.5,
          z2,
        };
      });

      // Draw connection lines in 3D
      const connectionDist = 80;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const pi = projected[i];
          const pj = projected[j];

          const dx = pi.projX - pj.projX;
          const dy = pi.projY - pj.projY;
          const dist2D = Math.sqrt(dx * dx + dy * dy);

          if (dist2D < connectionDist) {
            const lineAlpha = (1 - dist2D / connectionDist) * 0.22 * Math.min(pi.alpha, pj.alpha);
            ctx.beginPath();
            ctx.moveTo(pi.projX, pi.projY);
            ctx.lineTo(pj.projX, pj.projY);
            ctx.strokeStyle = `rgba(129, 140, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw particles (sorted back to front for depth)
      projected.sort((a, b) => a.z2 - b.z2);

      projected.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;

        // Soft outer glow
        const gradient = ctx.createRadialGradient(
          p.projX,
          p.projY,
          0,
          p.projX,
          p.projY,
          p.radius * 3
        );
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(0.5, p.color + '44');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, Math.max(1, p.radius * 0.7), 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // Render interactive shockwaves
      for (let k = shockwaves.length - 1; k >= 0; k--) {
        const sw = shockwaves[k];
        sw.radius += 5;
        sw.opacity *= 0.94;

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${sw.opacity})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();

        if (sw.radius >= sw.maxRadius || sw.opacity < 0.02) {
          shockwaves.splice(k, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('click', handleClick);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [particleCount, variant, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
};

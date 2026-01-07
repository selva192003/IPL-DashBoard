import React, { useEffect, useRef } from 'react';

const Confetti = ({ active = true, teamColor = null }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    // Only use winning team color - no mixed colors
    const colors = teamColor ? [teamColor] : ['#fbbf24', '#f97316', '#f43f5e', '#06b6d4', '#8b5cf6', '#ec4899'];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.vx = (Math.random() - 0.5) * 6;  // Reduced horizontal speed
        this.vy = Math.random() * 2 + 1.5;    // Reduced falling speed for slower descent
        this.size = Math.random() * 8 + 4;    // Slightly larger particles
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2; // Slower rotation
        this.life = 1;                        // For fade effect
        this.lifeDecay = 0.01;                // Slower fade
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.12; // Reduced gravity for slower fall
        this.rotation += this.rotationSpeed;
        this.life -= this.lifeDecay; // Fade out effect
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life); // Fade effect
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }

      isDone() {
        return this.y > canvas.height || this.life <= 0; // Either off-screen or faded out
      }
    }

    // Create initial burst (more particles for winner celebration)
    const particleCount = teamColor ? 150 : 100;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationId;
    let frameCount = 0;
    const maxFrames = 180; // Longer animation duration (3 seconds at 60fps)
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add burst of new particles every frame for extended effect
      if (frameCount < 100) {
        const newBurst = Math.floor((teamColor ? 8 : 5));
        for (let i = 0; i < newBurst; i++) {
          particles.push(new Particle());
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);

        if (particles[i].isDone()) {
          particles.splice(i, 1);
        }
      }

      frameCount++;
      if (frameCount < maxFrames || particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [active, teamColor]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden="true"
    />
  );
};

export default Confetti;

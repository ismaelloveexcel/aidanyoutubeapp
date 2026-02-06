import confetti from 'canvas-confetti';

// Premium confetti celebration with enhanced effects
export function celebrateSuccess(options?: { 
  emoji?: string; 
  colors?: string[];
  duration?: number;
}) {
  const colors = options?.colors || ['#2BD4FF', '#F3C94C', '#6DFF9C', '#A259FF', '#FF6B6B'];
  
  // Burst from center with emoji shapes
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: colors,
    ticks: 250,
    gravity: 1.2,
    scalar: 1.4,
    shapes: ['circle', 'square'],
    drift: 0.1,
  });

  // Side bursts with delay
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.7 },
      colors: colors,
      startVelocity: 45,
    });
  }, 150);

  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.7 },
      colors: colors,
      startVelocity: 45,
    });
  }, 150);
  
  // Top cascade
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 90,
      spread: 100,
      origin: { x: 0.5, y: 0 },
      colors: colors,
      gravity: 0.8,
    });
  }, 300);
}

export function celebrateMilestone() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const colors = ['#2BD4FF', '#F3C94C', '#6DFF9C', '#A259FF'];

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      particleCount,
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      origin: {
        x: randomInRange(0.1, 0.3),
        y: Math.random() - 0.2,
      },
      colors: colors,
    });

    confetti({
      particleCount,
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      origin: {
        x: randomInRange(0.7, 0.9),
        y: Math.random() - 0.2,
      },
      colors: colors,
    });
  }, 250);
}

export function celebrateQuick() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#2BD4FF', '#F3C94C', '#6DFF9C'],
    scalar: 1.2,
  });
}

// Premium stars celebration
export function celebrateStars() {
  const colors = ['#F3C94C', '#FFD700', '#FFA500'];
  
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 360,
        startVelocity: 30,
        origin: {
          x: 0.3 + Math.random() * 0.4,
          y: 0.3 + Math.random() * 0.4,
        },
        colors: colors,
        shapes: ['star'],
        scalar: 2,
      });
    }, i * 200);
  }
}

// Fireworks celebration
export function celebrateFireworks() {
  const colors = ['#2BD4FF', '#A259FF', '#FF6B6B', '#6DFF9C'];
  const count = 5;
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const x = 0.2 + Math.random() * 0.6;
      const y = 0.2 + Math.random() * 0.4;
      
      confetti({
        particleCount: 50,
        spread: 360,
        origin: { x, y },
        colors: colors,
        startVelocity: 25,
        gravity: 0.5,
        scalar: 1.5,
      });
    }, i * 400);
  }
}

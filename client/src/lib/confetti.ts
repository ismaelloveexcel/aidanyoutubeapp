import confetti from 'canvas-confetti';

// Fun confetti celebration for kid-friendly achievements
export function celebrateSuccess(options?: { 
  emoji?: string; 
  colors?: string[];
  duration?: number;
}) {
  const colors = options?.colors || ['#2BD4FF', '#F3C94C', '#6DFF9C', '#A259FF', '#FF6B6B'];
  
  // Burst from center
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: colors,
    ticks: 200,
    gravity: 1.2,
    scalar: 1.2,
  });

  // Add some stars
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
  }, 100);

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });
  }, 100);
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
  });
}

import { useMemo } from "react";
import "./meteor.css";

const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const createMeteors = () => {
  const count = random(2, 3);

  return Array.from({ length: count }, (_, index) => ({
    id: index,

    left: `${random(-10, 80)}%`,
    top: `${random(-20, 40)}%`,

    duration: `${random(4, 7)}s`,

    // Don't wait too long
    delay: `${random(0, 3)}s`,

    // Smaller = much better performance
    size: `${random(140, 260)}px`,
  }));
};

const createStars = () => {
  return Array.from({ length: 40 }, (_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${Math.random() * 2.5 + 0.5}px`,
    opacity: Math.random() * 0.7 + 0.2,
    duration: `${Math.random() * 3 + 2}s`,
    delay: `${Math.random() * 5}s`,
  }));
};

export default function MeteorBackground() {
  const meteors = useMemo(() => createMeteors(), []);
  const stars = useMemo(() => createStars(), []);

  return (
    <div className="space-background">

      {/* Random Stars */}
      <div className="space-stars">
        {stars.map((star) => (
          <span
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              "--star-duration": star.duration,
              "--star-delay": star.delay,
            }}
          />
        ))}
      </div>

      {/* Meteors */}
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="meteor"
          style={{
            left: meteor.left,
            top: meteor.top,
            "--meteor-duration": meteor.duration,
            "--meteor-delay": meteor.delay,
            "--meteor-size": meteor.size,
          }}
        />
      ))}
    </div>
  );
}
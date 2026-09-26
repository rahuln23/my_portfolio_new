import { useEffect, useRef } from "react";
import "./cursor.css";

const TRAIL_LENGTH = 14;

export default function CursorTrail() {
  const dotRef = useRef(null);
  const trailRefs = useRef([]);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const points = Array.from(
      { length: TRAIL_LENGTH },
      () => ({ x: 0, y: 0 })
    );

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let frame;

    const animate = () => {
      points[0].x += (mouseX - points[0].x) * 0.45;
      points[0].y += (mouseY - points[0].y) * 0.45;

      for (let i = 1; i < points.length; i++) {
        points[i].x +=
          (points[i - 1].x - points[i].x) * 0.35;

        points[i].y +=
          (points[i - 1].y - points[i].y) * 0.35;
      }

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate3d(${points[0].x}px, ${points[0].y}px, 0)`;
      }

      trailRefs.current.forEach((element, index) => {
        if (!element) return;

        const point = points[index + 1];

        element.style.transform =
          `translate3d(${point.x}px, ${point.y}px, 0)`;
      });

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  if (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
  ) {
    return null;
  }

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />

      {Array.from({ length: TRAIL_LENGTH - 1 }).map((_, index) => (
        <span
          key={index}
          ref={(element) => {
            trailRefs.current[index] = element;
          }}
          className="cursor-trail"
          style={{
            "--trail-size": `${Math.max(
              3,
              10 - index * 0.55
            )}px`,
            "--trail-opacity": Math.max(
              0.05,
              0.5 - index * 0.035
            ),
          }}
        />
      ))}
    </>
  );
}
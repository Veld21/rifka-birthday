import { useEffect, useRef } from "react";

const HEART_CHARS = ["♡", "♥", "✿", "✦"];

export default function FloatingHearts({ count = 12 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const hearts = [];
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      el.innerText = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
      el.className = "heart";

      const size = Math.random() * 14 + 10;
      const left = Math.random() * 100;
      const duration = Math.random() * 12 + 10;
      const delay = Math.random() * 12;
      const opacity = Math.random() * 0.4 + 0.15;

      el.style.cssText = `
        left: ${left}%;
        font-size: ${size}px;
        color: hsl(${330 + Math.random() * 30}, 70%, 70%);
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
      `;

      container.appendChild(el);
      hearts.push(el);
    }

    return () => hearts.forEach((h) => h.remove());
  }, [count]);

  return (
    <div
      ref={containerRef}
      className="hearts-container"
      aria-hidden="true"
    />
  );
}

import { useEffect, useState } from 'react';

export default function MouseGlow() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-accent-500/8 via-amber-500/8 to-yellow-500/8 blur-3xl -translate-x-1/2 -translate-y-1/2"
        style={{ left: pos.x, top: pos.y }}
      />
      <div
        className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-r from-blue-500/6 to-cyan-500/6 blur-3xl -translate-x-1/2 -translate-y-1/2"
        style={{ left: pos.x, top: pos.y, transition: 'left 0.15s ease-out, top 0.15s ease-out' }}
      />
    </div>
  );
}

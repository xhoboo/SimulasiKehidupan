import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

// Generate a soft ambient pad using Web Audio API
export function AmbienceToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    return () => { nodesRef.current?.stop(); ctxRef.current?.close(); };
  }, []);

  const start = () => {
    const Ctx = (window.AudioContext
      || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext) as typeof AudioContext;
    const ctx = new Ctx();
    ctxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.value = 0.0;
    master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2);

    const freqs = [110, 164.81, 220, 246.94]; // A2, E3, A3, B3 — soft pad
    const oscs: OscillatorNode[] = [];
    const lfos: OscillatorNode[] = [];
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 === 0 ? "sine" : "triangle";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.18;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + i * 0.03;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.05;
      lfo.connect(lfoGain).connect(g.gain);
      o.connect(g).connect(master);
      o.start(); lfo.start();
      oscs.push(o); lfos.push(lfo);
    });

    nodesRef.current = {
      stop: () => {
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
        setTimeout(() => { oscs.forEach((o) => o.stop()); lfos.forEach((o) => o.stop()); }, 1100);
      }
    };
  };

  const toggle = () => {
    if (on) { nodesRef.current?.stop(); nodesRef.current = null; ctxRef.current?.close(); ctxRef.current = null; }
    else { start(); }
    setOn(!on);
  };

  return (
    <button onClick={toggle} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Toggle ambience">
      {on ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
    </button>
  );
}

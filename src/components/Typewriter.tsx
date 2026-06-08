import { useEffect, useRef, useState } from "react";

interface Props {
  text: string;
  speed?: number;
  className?: string;
  onDone?: () => void;
}

export function Typewriter({ text, speed = 18, className, onDone }: Props) {
  const [i, setI] = useState(0);
  // Keep ref to latest onDone so it's never stale and never in the effect deps.
  // Without this, every parent re-render creates a new onDone reference, causing
  // the effect to re-run after completion and fire onDone multiple times.
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => { setI(0); }, [text]);

  useEffect(() => {
    if (i >= text.length) { onDoneRef.current?.(); return; }
    const t = setTimeout(() => setI((x) => x + 1), speed);
    return () => clearTimeout(t);
  }, [i, text, speed]);

  const done = i >= text.length;
  return (
    <span className={className}>
      {text.slice(0, i)}
      {!done && <span className="inline-block w-[2px] h-[1em] bg-primary align-middle animate-breathe ml-0.5" />}
    </span>
  );
}

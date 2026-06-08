import { GameState } from "@/game/types";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Journal({ state }: { state: GameState }) {
  return (
    <ScrollArea className="h-[60vh] pr-4">
      <div className="space-y-5">
        {state.memories.length === 0 && <p className="text-sm text-muted-foreground italic">Belum ada kenangan yang terpatri.</p>}
        {state.memories.map((m, i) => (
          <div key={i} className="border-l-2 border-primary/40 pl-4">
            <div className="text-[11px] font-mono text-muted-foreground mb-1">Umur {m.age} · {m.tag}</div>
            <p className="font-display italic text-foreground/90 leading-relaxed">"{m.text}"</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

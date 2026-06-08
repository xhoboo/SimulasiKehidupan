import { GameState } from "@/game/types";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Timeline({ state }: { state: GameState }) {
  return (
    <ScrollArea className="h-[60vh] pr-4">
      <ol className="relative border-l border-border ml-2 space-y-4">
        {state.history.map((h, i) => (
          <li key={`${h.age}-${h.eventId}-${i}`} className="ml-4">
            <div className={`absolute -left-[5px] mt-1.5 w-2.5 h-2.5 rounded-full ${moodDot(h.mood)}`} />
            <div className="text-[11px] font-mono text-muted-foreground">Umur {h.age}</div>
            <p className="text-sm text-foreground/85 leading-relaxed">{h.text}</p>
          </li>
        ))}
        {state.history.length === 0 && (
          <li className="ml-4 text-sm text-muted-foreground italic">Belum ada cerita.</li>
        )}
      </ol>
    </ScrollArea>
  );
}

function moodDot(m: string) {
  switch (m) {
    case "warm": return "bg-mood-warm";
    case "cold": return "bg-mood-cold";
    case "melancholy": return "bg-mood-melancholy";
    case "hope": return "bg-mood-hope";
    case "tragic": return "bg-mood-tragic";
    default: return "bg-muted-foreground";
  }
}

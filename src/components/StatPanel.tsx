import { GameState } from "@/game/types";

export function StatPanel({ state }: { state: GameState }) {
  return (
    <div className="space-y-5">
      {/* Relationships */}
      {state.relationships.length > 0 && (
        <div>
          <h3 className="font-display text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Orang</h3>
          <ul className="space-y-2 text-xs">
            {state.relationships.map((r) => (
              <li key={r.id} className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <span className={r.alive ? "text-foreground/80" : "text-muted-foreground line-through"}>{r.name}</span>
                  <span className="text-muted-foreground italic text-[10px] ml-1.5">{r.role}</span>
                </div>
                {r.alive && r.closeness > 0 && (
                  <div className="w-12 h-1 bg-border/50 rounded-full overflow-hidden shrink-0">
                    <div className="h-full bg-primary/50 rounded-full" style={{ width: `${Math.min(100, r.closeness)}%` }} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.relationships.length === 0 && (
        <p className="text-xs text-muted-foreground italic">Hidup baru dimulai.</p>
      )}
    </div>
  );
}

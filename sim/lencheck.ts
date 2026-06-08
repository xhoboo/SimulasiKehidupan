// Length audit over an authentic 15-life transcript.
// Flags prompts/outcomes that exceed the deadpan bar (>3 sentences OR long read),
// excluding death-pool beats (the deliberate exception).
import { readFileSync } from "fs";

type Beat = {
  age: number; eventId: string; pool?: string; mood?: string;
  prompt: string; outcomeText: string; secondary: boolean;
};
type Life = { beats: Beat[] };

const lives: Life[] = JSON.parse(readFileSync(new URL("./transcripts.json", import.meta.url), "utf8"));

// death events are exempt (momen kematian)
const isDeath = (id: string) => id.startsWith("death_");

const sentences = (s: string) =>
  s.split(/(?<=[.!?])\s+/).filter((x) => x.trim().length > 0).length;
// crude reading-time: ~17 chars/sec comfortable narrative read
const readSecs = (s: string) => +(s.length / 17).toFixed(1);

type Row = { id: string; kind: "prompt" | "outcome"; sent: number; chars: number; secs: number; text: string };
const seen = new Set<string>();
const rows: Row[] = [];
for (const L of lives) {
  for (const b of L.beats) {
    if (isDeath(b.eventId)) continue;
    for (const [kind, text] of [["prompt", b.prompt], ["outcome", b.outcomeText]] as const) {
      const key = `${b.eventId}:${kind}:${text.slice(0, 24)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      rows.push({ id: b.eventId, kind, sent: sentences(text), chars: text.length, secs: readSecs(text), text });
    }
  }
}

const over = rows.filter((r) => r.sent > 3 || r.chars > 240);
over.sort((a, b) => b.chars - a.chars);

console.log(`Distinct non-death prompt/outcome strings sampled: ${rows.length}`);
console.log(`Over bar (>3 sentences OR >240 chars / ~14s): ${over.length}\n`);
for (const r of over.slice(0, 30)) {
  console.log(`[${r.id}/${r.kind}] ${r.sent} sent, ${r.chars} ch, ~${r.secs}s`);
  console.log(`   ${r.text}\n`);
}

// distribution
const buckets = { "<=2 sent": 0, "3 sent": 0, "4 sent": 0, ">=5 sent": 0 };
for (const r of rows) {
  if (r.sent <= 2) buckets["<=2 sent"]++;
  else if (r.sent === 3) buckets["3 sent"]++;
  else if (r.sent === 4) buckets["4 sent"]++;
  else buckets[">=5 sent"]++;
}
console.log("Sentence-count distribution (non-death):", buckets);
const longest = [...rows].sort((a, b) => b.chars - a.chars)[0];
console.log(`Longest non-death string: ${longest.chars} ch (${longest.id}/${longest.kind})`);

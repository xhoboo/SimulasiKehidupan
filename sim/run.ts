// Headless player harness — replicates src/pages/Game.tsx's loop exactly
// (same RNG seed derivations, secondary events, death handling) so the
// transcripts reflect authentic playthroughs.
import { newGame, makeRng, evPrompt, evTitle, evChoices } from "../src/game/engine";
import {
  applyOutcome, maybeMemoryCallback, pickEvent, pickDeathEvent,
  rollOutcome, tickYear, syntheticFiller, pickSecondaryEvent,
} from "../src/game/runtime";
import { GameState, LifeEvent, Choice, Ctx } from "../src/game/types";
import { writeFileSync } from "fs";

type Beat = {
  age: number;
  eventId: string;
  pool?: string;
  category: string;
  mood?: string;
  ageMin: number;
  ageMax: number;
  title: string | null;
  prompt: string;
  callback: string | null;
  choiceLabel: string;
  choiceId: string;
  outcomeText: string;
  outcomeMood?: string;
  memory?: string;
  secondary: boolean;
  flagsSnapshot: string[];
  childAge: number | null;
};

type LifeLog = {
  run: number;
  persona: string;
  name: string;
  beats: Beat[];
  deathAge: number;
  causeOfDeath?: string;
  finalFlags: Record<string, boolean | number | string>;
  traits: string[];
  relationships: { name: string; role: string; alive: boolean }[];
  memoriesCount: number;
  achievements: string[];
};

// A "player persona" decides which choice to take. Different leanings branch
// lives apart (career, marriage, children, withdrawal, etc.).
type Persona = {
  name: string;
  // returns index into choices
  pick: (choices: Choice[], ev: LifeEvent, state: GameState, rand: () => number) => number;
};

function makePersonas(): Persona[] {
  // keyword-driven pickers so branch-defining choices (major, marriage, kids)
  // go the intended way, with a fallback lean for generic events.
  const prefer = (kws: string[], lean: "first" | "last" | "rand") =>
    (choices: Choice[], _ev: LifeEvent, _s: GameState, rand: () => number): number => {
      for (const kw of kws) {
        const i = choices.findIndex((c) => c.label.toLowerCase().includes(kw));
        if (i >= 0) return i;
      }
      if (lean === "first") return 0;
      if (lean === "last") return choices.length - 1;
      return Math.floor(rand() * choices.length);
    };

  return [
    { name: "Dokter empatik", pick: prefer(["dokter", "kedokteran", "rawat", "rumah sakit", "tetap", "temani", "jujur"], "first") },
    { name: "Seniman idealis", pick: prefer(["seni", "lukis", "gambar", "karya", "studio", "ikuti", "kejar"], "first") },
    { name: "Insinyur korporat", pick: prefer(["teknik", "kerja", "kantor", "aman", "stabil", "bertahan", "terima"], "first") },
    { name: "Pengembara (gap)", pick: prefer(["pergi", "jalan", "rehat", "berhenti", "tinggalkan", "coba"], "last") },
    { name: "Berkeluarga hangat", pick: prefer(["menikah", "anak", "keluarga", "pulang", "temani", "bersama", "rawat"], "first") },
    { name: "Penyendiri nihilis", pick: prefer(["sendiri", "diam", "abaikan", "tidak", "biarkan", "pergi"], "last") },
    { name: "Ambisius kaya", pick: prefer(["kerja", "uang", "lembur", "investasi", "terima", "naik"], "first") },
    { name: "Acak / impulsif A", pick: (c, _e, _s, r) => Math.floor(r() * c.length) },
    { name: "Acak / impulsif B", pick: (c, _e, _s, r) => Math.floor(r() * c.length) },
    { name: "Selalu pilihan pertama", pick: () => 0 },
    { name: "Selalu pilihan terakhir", pick: (c) => c.length - 1 },
    { name: "Penakut / aman", pick: prefer(["aman", "diam", "tetap", "tidak", "hati-hati", "pulang"], "first") },
    { name: "Pemberani / nekat", pick: prefer(["coba", "lawan", "kejar", "pergi", "ambil risiko", "iya"], "last") },
    { name: "Acak / impulsif C", pick: (c, _e, _s, r) => Math.floor(r() * c.length) },
    { name: "Empati & relasi", pick: prefer(["temani", "maaf", "telepon", "jujur", "bersama", "rawat", "dengar"], "first") },
  ];
}

function buildContent(ev: LifeEvent, s: GameState) {
  const rng = makeRng(s.rngSeed + s.age * 97 + ev.id.length * 3);
  const ctx: Ctx = { state: s, rand: rng };
  return {
    title: evTitle(ev, ctx),
    prompt: evPrompt(ev, ctx),
    choices: evChoices(ev, ctx),
  };
}

function childAgeOf(s: GameState): number | null {
  const b = s.flags.child_birth_age;
  return typeof b === "number" ? s.age - b : null;
}

function runLife(run: number, persona: Persona, seed: number): LifeLog {
  let state = newGame(`Hidup-${run}`);
  state.rngSeed = seed;
  const beats: Beat[] = [];
  let guard = 0;

  // advance(): choose the event for the current (already-aged) year
  const advanceEvent = (s: GameState): { ev: LifeEvent; callback: string | null } | null => {
    if (!s.alive) return null;
    const rand = makeRng(s.rngSeed + s.age * 31);
    if (s.pendingDeath) {
      const dev = pickDeathEvent(s, rand);
      return { ev: dev, callback: maybeMemoryCallback(s, rand, dev) };
    }
    let ev = pickEvent(s, rand);
    if (!ev) ev = syntheticFiller(s, rand);
    return { ev, callback: maybeMemoryCallback(s, rand, ev) };
  };

  const playEvent = (ev: LifeEvent, callback: string | null, secondary: boolean): GameState => {
    const content = buildContent(ev, state);
    const choices = content.choices;
    let idx = 0;
    if (choices.length > 0) {
      const pickRand = makeRng(state.rngSeed + state.age * 53 + run * 13);
      idx = persona.pick(choices, ev, state, pickRand);
      if (idx < 0 || idx >= choices.length) idx = 0;
    }
    const choice = choices[idx];
    const rand = makeRng(state.rngSeed + state.age * 131 + choice.id.length);
    const o = rollOutcome(choice, state, rand);
    const next = applyOutcome(state, ev, choice, o, rand);

    beats.push({
      age: state.age,
      eventId: ev.id,
      pool: ev.pool,
      category: ev.category,
      mood: ev.mood,
      ageMin: ev.ageMin,
      ageMax: ev.ageMax,
      title: content.title,
      prompt: content.prompt,
      callback,
      choiceLabel: choice.label,
      choiceId: choice.id,
      outcomeText: o.text,
      outcomeMood: o.mood,
      memory: o.memory?.text,
      secondary,
      flagsSnapshot: Object.keys(next.flags),
      childAge: childAgeOf(next),
    });
    return next;
  };

  // initial advance (age 0)
  let head = advanceEvent(state);

  while (state.alive && guard++ < 2000) {
    if (!head) break;
    const ev = head.ev;
    const next = playEvent(ev, head.callback, false);
    state = next;

    if (!state.alive) break;

    // secondary event (same year) — replicate Game.choose secondary logic
    if (!state.pendingDeath) {
      const secRand = makeRng(state.rngSeed + state.age * 17 + 333);
      const secEv = pickSecondaryEvent(state, ev.id, secRand);
      if (secEv) {
        state = playEvent(secEv, null, true);
        if (!state.alive) break;
      }
    }

    // nextYear
    state = tickYear(state);
    head = advanceEvent(state);
  }

  return {
    run,
    persona: persona.name,
    name: state.name,
    beats,
    deathAge: state.age,
    causeOfDeath: state.causeOfDeath,
    finalFlags: state.flags,
    traits: state.traits,
    relationships: state.relationships.map((r) => ({ name: r.name, role: r.role, alive: r.alive })),
    memoriesCount: state.memories.length,
    achievements: state.achievements,
  };
}

const personas = makePersonas();
const lives: LifeLog[] = [];
for (let i = 0; i < 15; i++) {
  const persona = personas[i % personas.length];
  // distinct seed per run
  const seed = 1000003 * (i + 1) + 7;
  lives.push(runLife(i + 1, persona, seed));
}

writeFileSync(new URL("./transcripts.json", import.meta.url), JSON.stringify(lives, null, 2));

// ---- Console digest ----
for (const L of lives) {
  console.log(`\n${"=".repeat(78)}`);
  console.log(`RUN ${L.run} — ${L.persona} — mati di umur ${L.deathAge} — sebab: ${L.causeOfDeath ?? "?"}`);
  console.log(`beats: ${L.beats.length}, kenangan: ${L.memoriesCount}, traits: [${L.traits.join(", ")}]`);
  console.log(`relasi: ${L.relationships.map((r) => `${r.name}${r.alive ? "" : "✝"}`).join(", ")}`);
  console.log("-".repeat(78));
  for (const b of L.beats) {
    const sec = b.secondary ? " (tahun yg sama)" : "";
    const ca = b.childAge !== null ? ` [anak ${b.childAge}th]` : "";
    console.log(`  [${b.age}]${sec}${ca} <${b.eventId}/${b.pool ?? "?"}/${b.category}> win ${b.ageMin}-${b.ageMax}`);
    if (b.callback) console.log(`     ↩ kenangan: "${b.callback}"`);
    if (b.title) console.log(`     # ${b.title}`);
    console.log(`     P: ${b.prompt.replace(/\s+/g, " ")}`);
    console.log(`     > ${b.choiceLabel}`);
    console.log(`     = ${b.outcomeText.replace(/\s+/g, " ")}`);
    if (b.memory) console.log(`     ✦ kenangan: "${b.memory.replace(/\s+/g, " ")}"`);
  }
}

console.log(`\n\n${"#".repeat(78)}`);
console.log("RINGKASAN UMUR KEMATIAN:");
for (const L of lives) console.log(`  Run ${L.run} (${L.persona}): ${L.deathAge} th — ${L.causeOfDeath ?? "?"}`);
const ages = lives.map((l) => l.deathAge).sort((a, b) => a - b);
console.log(`  min ${ages[0]}, max ${ages[ages.length - 1]}, median ${ages[Math.floor(ages.length / 2)]}`);

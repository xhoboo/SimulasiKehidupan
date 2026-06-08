// Static branch-integrity checker.
// Reads every pool .ts as text and cross-checks that each gating condition
// (requireFlag / forbidFlag / requireRelationship / requireMemoryTag) has at
// least one producer somewhere (flag set, relationship added, memory tag written).
// Textual (not runtime) so conditional choices are all covered.
import { readFileSync, readdirSync } from "fs";

const dir = new URL("../src/game/pools/", import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
const src: Record<string, string> = {};
for (const f of files) src[f] = readFileSync(new URL(f, dir), "utf8");
const all = Object.values(src).join("\n");

const collect = (re: RegExp, s = all): Set<string> => {
  const out = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) out.add(m[1]);
  return out;
};

// --- Required (consumers) ---
const reqFlag = collect(/requireFlag:\s*"([^"]+)"/g);
const forbidFlag = collect(/forbidFlag:\s*"([^"]+)"/g);
const reqRel = collect(/requireRelationship:\s*"([^"]+)"/g);
const reqTag = collect(/requireMemoryTag:\s*"([^"]+)"/g);
// requireFlagAge: { flag: "X", ... } — flag-umur yang dibaca sebagai syarat "N tahun setelah".
const reqFlagAge = collect(/requireFlagAge:\s*\{\s*flag:\s*"([^"]+)"/g);

// --- Produced (setters) ---
const setFlag = collect(/\bflag:\s*"([^"]+)"/g);
const setAgeFlag = collect(/setAgeFlag:\s*"([^"]+)"/g);
const extraFlags = new Set<string>();
{
  let m: RegExpExecArray | null;
  const re = /extraFlags:\s*\[([^\]]*)\]/g;
  while ((m = re.exec(all))) {
    for (const q of m[1].match(/"([^"]+)"/g) ?? []) extraFlags.add(q.replace(/"/g, ""));
  }
}
const addRelIds = collect(/addsRelationship:\s*\{[^}]*?\bid:\s*"([^"]+)"/g);
const memTags = collect(/\btag:\s*"([^"]+)"/g);

// runtime-injected / engine flags that never appear as literal setters
const ENGINE_FLAGS = new Set(["dying", "dead"]);
// relationships present from newGame()
const SEED_RELS = new Set(["ibu", "ayah"]);

const allProducedFlags = new Set([...setFlag, ...setAgeFlag, ...extraFlags, ...ENGINE_FLAGS]);
const allRels = new Set([...addRelIds, ...SEED_RELS]);

const missing = (need: Set<string>, have: Set<string>) =>
  [...need].filter((x) => !have.has(x)).sort();

console.log("=== BRANCH INTEGRITY ===\n");

const mFlag = missing(reqFlag, allProducedFlags);
console.log(`requireFlag without setter (${mFlag.length}):`, mFlag.length ? mFlag : "— none —");

const mFlagAge = missing(reqFlagAge, allProducedFlags);
console.log(`requireFlagAge without setter (${mFlagAge.length}):`, mFlagAge.length ? mFlagAge : "— none —");

const mForbid = missing(forbidFlag, allProducedFlags);
console.log(`forbidFlag without setter (dead condition, ${mForbid.length}):`, mForbid.length ? mForbid : "— none —");

const mRel = missing(reqRel, allRels);
console.log(`requireRelationship without producer (${mRel.length}):`, mRel.length ? mRel : "— none —");

const mTag = missing(reqTag, memTags);
console.log(`requireMemoryTag without producer (${mTag.length}):`, mTag.length ? mTag : "— none —");

// --- Memory-callback reachability: every forceCallbackTag must have a memory writer ---
// Kotak "Sebuah Kenangan Kembali" hanya muncul lewat forceCallbackTag, yang menampilkan
// kenangan terbaru bertag itu. Kalau tidak ada event yang pernah menulis kenangan bertag
// sama, kotak itu tidak akan pernah muncul (forceCallbackTag jadi sia-sia).
const runtime = readFileSync(new URL("../src/game/runtime.ts", import.meta.url), "utf8");
const forceTags = collect(/forceCallbackTag:\s*"([^"]+)"/g);
const danglingForce = [...forceTags].filter((t) => !memTags.has(t)).sort();
console.log(`\nforceCallbackTag without a memory writer (box never shows, ${danglingForce.length}):`, danglingForce.length ? danglingForce : "— none —");

// --- Flags set but never read (dead-weight, informational only) ---
const consumedFlags = new Set([...reqFlag, ...forbidFlag, ...reqFlagAge]);
// also flags read directly in code (helpers / Game.tsx / runtime)
const codeText = ["../_helpers.ts"].map(() => "").join("") +
  readFileSync(new URL("../src/game/pools/_helpers.ts", import.meta.url), "utf8") +
  readFileSync(new URL("../src/pages/Game.tsx", import.meta.url), "utf8") +
  runtime + all;
const reallyUnread = [...allProducedFlags]
  .filter((f) => !ENGINE_FLAGS.has(f))
  .filter((f) => !consumedFlags.has(f))
  .filter((f) => {
    // is it referenced via flags.X or flags["X"] or flags.f anywhere in code?
    const dot = new RegExp(`flags\\.${f}\\b`);
    const bracket = new RegExp(`flags\\["${f}"\\]`);
    const ctxState = new RegExp(`"${f}"`);
    // count occurrences beyond its own setter literal
    const occ = (all.match(new RegExp(`"${f}"`, "g")) ?? []).length +
      (codeText.match(dot) ? 1 : 0) + (codeText.match(bracket) ? 1 : 0);
    return occ <= 1 && !dot.test(codeText) && !bracket.test(codeText);
  })
  .sort();
console.log(`\nflags set but never gated/read (informational, ${reallyUnread.length}):`, reallyUnread.length ? reallyUnread : "— none —");

console.log("\nProduced flags:", [...allProducedFlags].sort().join(", "));
console.log("\nProduced relationship ids:", [...allRels].sort().join(", "));

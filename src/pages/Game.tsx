import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GameState, LifeEvent, Choice, Outcome, Mood } from "@/game/types";
import { newGame, makeRng, TRAIT_LABELS, deriveTraits, evPrompt, evTitle, evChoices } from "@/game/engine";
import { computeEnding } from "@/game/pools/ending";
import { applyOutcome, maybeMemoryCallback, pickEvent, pickDeathEvent, rollOutcome, tickYear, syntheticFiller, pickSecondaryEvent, pickCompanionEvent, resolveScheduledSynthetic, SYNTH_PENDING_FLAG } from "@/game/runtime";
import { autoSave, clearAutoSave, loadAutoSave } from "@/game/save";
import { ACHIEVEMENTS, loadUnlockedAchievements, recordAchievements, evaluateLifeEndAchievements, incrementLivesCompleted } from "@/game/achievements";
import { Typewriter } from "@/components/Typewriter";
import { StatPanel } from "@/components/StatPanel";
import { Timeline } from "@/components/Timeline";
import { Journal } from "@/components/Journal";
import { AmbienceToggle } from "@/components/AmbienceToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skull, Sparkles, User, LogOut, Share2, Download, Loader2, Smartphone, Trophy, Lock } from "lucide-react";
import { toast } from "sonner";
import { toPng } from "html-to-image";

type Phase = "menu" | "intro" | "playing" | "result" | "dead";

type EventContent = { title: string | null; prompt: string; choices: Choice[] };

// Antrean event lanjutan di tahun yang sama. Satu tahun dibatasi maks 2 event
// narasi, jadi antrean ini berisi paling banyak 1 item (sekunder ringan ATAU
// filler_synthetic terjadwal — bukan keduanya; lihat resolveScheduledSynthetic).
// Tetap dimodelkan sebagai antrean agar fleksibel dan logika "lanjut" tetap sama.
type Followup = { ev: LifeEvent; content: EventContent };

type Snapshot = {
  state: GameState;
  event: LifeEvent | null;
  eventContent: EventContent | null;
  outcome: { choice: Choice; outcome: Outcome } | null;
  callback: string | null;
  phase: Phase;
  pendingFollowups: Followup[];
  isSecondaryTurn: boolean;
};

const BIRTH_INTROS: ((name: string) => string)[] = [
  (n) => `Pada suatu pagi yang biasa saja, ${n} dilahirkan ke dunia.`,
  (n) => `${n} datang ke dunia tanpa diminta. Seperti semua orang.`,
  (n) => `Tangisan pertama ${n} adalah pertanyaan panjang yang tidak pernah selesai.`,
  (n) => `Dunia tidak berhenti berputar saat ${n} lahir. Tapi bagi dua orang, semuanya berubah.`,
  (n) => `${n} membuka mata untuk pertama kali. Cahaya itu terlalu terang, tapi tidak ada pilihan lain.`,
];

const moodBg: Record<Mood, string> = {
  warm: "from-mood-warm/15", cold: "from-mood-cold/15",
  melancholy: "from-mood-melancholy/20", hope: "from-mood-hope/15",
  tragic: "from-mood-tragic/25", neutral: "from-secondary/30",
};

const Game = () => {
  const [phase, setPhase] = useState<Phase>("menu");
  const [state, setState] = useState<GameState>(() => newGame());
  const [event, setEvent] = useState<LifeEvent | null>(null);
  const [eventContent, setEventContent] = useState<EventContent | null>(null);
  const [outcome, setOutcome] = useState<{ choice: Choice; outcome: Outcome } | null>(null);
  const [callback, setCallback] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [hasSave, setHasSave] = useState(() => Boolean(loadAutoSave()));
  // Pencapaian yang sudah terbuka lintas seluruh kehidupan (persisten, lihat
  // game/achievements). Berbeda dari state.achievements yang hanya satu kehidupan.
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => loadUnlockedAchievements());

  // Event lanjutan tahun ini: diantre setelah primary, ditampilkan sebagai event
  // penuh. Maks 1 item (lihat type Followup) → satu tahun maksimal 2 event narasi.
  const [pendingFollowups, setPendingFollowups] = useState<Followup[]>([]);
  const [isSecondaryTurn, setIsSecondaryTurn] = useState(false);

  const introTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const yearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingAdvanceRef = useRef<GameState | null>(null);

  useEffect(() => {
    return () => {
      if (introTimeoutRef.current) clearTimeout(introTimeoutRef.current);
      if (yearTimeoutRef.current) clearTimeout(yearTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase === "menu") setHasSave(Boolean(loadAutoSave()));
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" || phase === "result" || phase === "dead") autoSave(state);
  }, [state, phase]);

  // Setiap pencapaian baru pada kehidupan ini disetorkan ke daftar terbuka yang
  // persisten, agar tetap terpampang di beranda meski kehidupan ini berakhir.
  useEffect(() => {
    if (state.achievements.length > 0) {
      setUnlockedAchievements(recordAchievements(state.achievements));
    }
  }, [state.achievements]);

  const buildEventContent = (ev: LifeEvent, s: GameState): EventContent => {
    const rng = makeRng(s.rngSeed + s.age * 97 + ev.id.length * 3);
    const ctx = { state: s, rand: rng };
    return {
      title: evTitle(ev, ctx),
      prompt: evPrompt(ev, ctx),
      choices: evChoices(ev, ctx),
    };
  };

  const clearPending = () => {
    setPendingFollowups([]);
    setIsSecondaryTurn(false);
  };

  const pushHistory = () => {
    setHistory((h) => {
      const snap: Snapshot = {
        state, event, eventContent, outcome, callback, phase,
        pendingFollowups, isSecondaryTurn,
      };
      const next = [...h, snap];
      if (next.length > 30) next.shift();
      return next;
    });
  };

  const advance = (s: GameState) => {
    if (!s.alive) { setPhase("dead"); return; }
    const rand = makeRng(s.rngSeed + s.age * 31);
    if (s.pendingDeath) {
      const dev = pickDeathEvent(s, rand);
      setCallback(maybeMemoryCallback(s, rand, dev));
      setEventContent(buildEventContent(dev, s));
      setEvent(dev);
      setOutcome(null);
      clearPending();
      setPhase("playing");
      return;
    }
    let ev = pickEvent(s, rand);
    if (!ev) ev = syntheticFiller(s, rand);
    setCallback(maybeMemoryCallback(s, rand, ev));
    setEventContent(buildEventContent(ev, s));
    setEvent(ev);
    setOutcome(null);
    clearPending();
    setPhase("playing");
  };

  const startNew = (n: string) => {
    if (introTimeoutRef.current) clearTimeout(introTimeoutRef.current);
    const g = newGame(n.trim() || "Kamu");
    clearAutoSave();
    setHasSave(false);
    setHistory([]);
    pendingAdvanceRef.current = g;
    setState(g);
    setEvent(null);
    setEventContent(null);
    setOutcome(null);
    clearPending();
    setPhase("intro");
  };

  const continueGame = () => {
    const g = loadAutoSave();
    if (!g) { toast.error("Tidak ada autosave."); return; }
    setState(g);
    if (!g.alive) setPhase("dead");
    else advance(g);
  };

  const choose = (choice: Choice) => {
    if (!event) return;
    pushHistory();
    const rand = makeRng(state.rngSeed + state.age * 131 + choice.id.length);
    const o = rollOutcome(choice, state, rand);
    const next = applyOutcome(state, event, choice, o, rand);
    setOutcome({ choice, outcome: o });

    // Momen kematian: kehidupan ini baru saja tamat (alive: true → false). Hitung
    // sebagai satu kehidupan tamat lalu evaluasi pencapaian tersembunyi atas
    // keadaan akhir. Hanya terjadi sekali per hidup karena event kematian punya
    // satu pilihan dan tidak bisa diulang.
    if (state.alive && !next.alive) {
      const lives = incrementLivesCompleted();
      const hidden = evaluateLifeEndAchievements(next, lives);
      const merged = recordAchievements([...next.achievements, ...hidden]);
      setUnlockedAchievements(merged);
    }

    // Only primary events can trigger same-year follow-ups. Never after death: the
    // death event must be the final beat of a life, so if this choice ended it
    // (death event, or any outcome with flag "dead"), no follow-up may follow —
    // applyOutcome resets pendingDeath to false, so we gate on `alive`, not pendingDeath.
    if (!isSecondaryTurn && next.alive && !next.pendingDeath) {
      const secRand = makeRng(next.rngSeed + next.age * 17 + 333);
      const followups: Followup[] = [];

      // 1) Sekunder ringan: milestone boleh menyematkan companion tertentu di tahun
      //    yang sama (mis. malam terakhir sekolah menyertai pilih jurusan); kalau
      //    tidak, jatuh ke sekunder generik quiet/filler (30%).
      const secEv = pickCompanionEvent(next, event, secRand) ?? pickSecondaryEvent(next, event.id, secRand);
      if (secEv) followups.push({ ev: secEv, content: buildEventContent(secEv, next) });

      // 2) Filler_synthetic terjadwal (usia 6-59) DENGAN plafon maks 2 event/tahun:
      //    kalau tahun ini sudah punya sekunder, synthetic-nya ditunda ke tahun
      //    berikutnya (flag pending) alih-alih jadi event ke-3. Kalau belum ada
      //    sekunder, ia tampil sebagai event kedua. Flag pending disimpan ke state.
      const synth = resolveScheduledSynthetic(next, secRand, !!secEv, secEv ? [secEv.id] : []);
      next.flags = { ...next.flags, [SYNTH_PENDING_FLAG]: synth.pending };
      if (synth.event) followups.push({ ev: synth.event, content: buildEventContent(synth.event, next) });

      if (followups.length > 0) setPendingFollowups(followups);
      else clearPending();
    }

    setState(next);
    setPhase("result");
  };

  // Transition from the current result to the next queued follow-up — same year,
  // full event display. Pops one item; any remaining stay queued for after it.
  const advanceToNextFollowup = () => {
    if (pendingFollowups.length === 0) return;
    pushHistory(); // snapshot of current result state for undo
    const [head, ...rest] = pendingFollowups;
    setEvent(head.ev);
    setEventContent(head.content);
    setOutcome(null);
    setPendingFollowups(rest);
    setIsSecondaryTurn(true);
    setPhase("playing");
  };

  const nextYear = () => {
    if (!state.alive) { setPhase("dead"); return; }
    pushHistory();
    const next = tickYear(state);
    setState(next);
    setOutcome(null);
    setEvent(null);
    setEventContent(null);
    setCallback(null);
    clearPending();
    if (yearTimeoutRef.current) clearTimeout(yearTimeoutRef.current);
    yearTimeoutRef.current = setTimeout(() => advance(next), 200);
  };

  const exitToMenu = () => {
    if (introTimeoutRef.current) clearTimeout(introTimeoutRef.current);
    if (yearTimeoutRef.current) clearTimeout(yearTimeoutRef.current);
    // Progress is already autosaved during play, so it can be resumed from the menu.
    if (state.alive) autoSave(state);
    setHasSave(Boolean(loadAutoSave()));
    setPhase("menu");
  };

  const restart = () => {
    clearAutoSave();
    setHasSave(false);
    setHistory([]);
    setState(newGame());
    setPhase("menu");
    setName("");
    setEvent(null);
    setEventContent(null);
    setOutcome(null);
    clearPending();
  };

  const mood: Mood = (outcome?.outcome.mood ?? event?.mood ?? "neutral") as Mood;

  // Whether another event is queued for this same year after the current result
  const hasFollowupPending = pendingFollowups.length > 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className={`fixed inset-0 -z-10 bg-gradient-to-b ${moodBg[mood]} to-transparent transition-all duration-[1500ms]`} />
      <div className="vignette-layer" aria-hidden />
      <div className="grain-layer" aria-hidden />

      <header className="relative z-10 border-b border-border/50 backdrop-blur-sm">
        <div className="container max-w-6xl flex items-center justify-between py-4">
          <div>
            <h1 className="font-display text-xl tracking-tight">Simulasi Kehidupan</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {(phase === "playing" || phase === "result") && (
              <div className="text-right hidden sm:block">
                <div className="font-mono text-xs text-muted-foreground">UMUR</div>
                <div className="font-display text-2xl leading-none">{state.age}</div>
              </div>
            )}
            <AmbienceToggle />
            {(phase === "intro" || phase === "playing" || phase === "result" || phase === "dead") && (
              <ExitButton onExit={exitToMenu} confirm={phase !== "dead"} />
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 container max-w-6xl py-8 md:py-12">
        <AnimatePresence mode="wait">
          {phase === "menu" && (
            <motion.div key="menu" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto text-center pt-12 md:pt-20">
              <Sparkles className="w-8 h-8 mx-auto text-primary mb-6 animate-breathe" />
              <h2 className="font-display text-5xl md:text-6xl mb-4 tracking-tight">Hiduplah,<br/><span className="italic text-primary">satu kali saja.</span></h2>
              <p className="text-muted-foreground leading-relaxed mb-8">Setiap pilihan akan memupukmu menjadi orang yang akan kamu kenang sebelum mati. Atau tidak.</p>
              <div className="flex flex-col gap-3 max-w-sm mx-auto">
                <Input
                  placeholder="Siapa namamu?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && startNew(name)}
                  className="text-center bg-card"
                />
                <Button size="lg" onClick={() => startNew(name)} className="font-display tracking-wide">Mulai hidup baru</Button>
                {hasSave && (
                  <Button variant="ghost" onClick={continueGame} className="text-muted-foreground">Lanjutkan kehidupan terakhir</Button>
                )}
                <AchievementsDialog unlocked={unlockedAchievements} />
              </div>
              <p className="text-[11px] text-muted-foreground/60 mt-12 italic">"Hidup bisa dipahami dengan menengok ke belakang, tapi harus dijalani dengan melangkah ke depan."</p>
            </motion.div>
          )}

          {phase === "intro" && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center pt-32">
              <p className="font-display text-3xl md:text-4xl text-foreground/80 max-w-2xl mx-auto leading-snug">
                <Typewriter
                  text={BIRTH_INTROS[state.rngSeed % BIRTH_INTROS.length](state.name)}
                  speed={45}
                  onDone={() => {
                    const g = pendingAdvanceRef.current;
                    if (!g) return;
                    pendingAdvanceRef.current = null;
                    introTimeoutRef.current = setTimeout(() => advance(g), 1400);
                  }}
                />
              </p>
            </motion.div>
          )}

          {(phase === "playing" || phase === "result") && event && eventContent && (
            <motion.div
              key={`ev-${state.age}-${event.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-[1fr_280px] gap-8"
            >
              <div>
                {callback && phase === "playing" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 px-4 py-3 rounded-lg bg-secondary/40 border border-border/50">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Sebuah kenangan kembali</div>
                    <p className="font-display italic text-sm text-foreground/75">"{callback}"</p>
                  </motion.div>
                )}

                <div className="mb-2 text-xs font-mono text-muted-foreground flex items-center gap-2">
                  <span>Umur {state.age}</span>
                  {isSecondaryTurn && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/60 border border-border/40 text-muted-foreground/70">
                      masih tahun yang sama
                    </span>
                  )}
                </div>

                {eventContent.title && (
                  <h2 className="font-display text-3xl md:text-4xl mb-4 leading-tight">{eventContent.title}</h2>
                )}

                <Card className="p-6 md:p-8 bg-card/60 backdrop-blur shadow-card border-border/60">
                  <p className="text-base md:text-lg leading-relaxed text-foreground/90 font-display min-h-[5rem]">
                    <Typewriter text={eventContent.prompt} speed={14} />
                  </p>
                </Card>

                <div className="mt-6">
                  {phase === "playing" ? (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {eventContent.choices.map((c, i) => (
                        <motion.button
                          key={c.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.08 }}
                          whileHover={{ y: -2 }}
                          onClick={() => choose(c)}
                          className="text-left p-4 rounded-lg bg-card/80 border border-border hover:border-primary/60 hover:bg-card transition-all group"
                        >
                          <div className="text-[10px] font-mono text-muted-foreground mb-1 group-hover:text-primary transition-colors">PILIHAN {i + 1}</div>
                          <div className="font-display text-base leading-snug">{c.label}</div>
                        </motion.button>
                      ))}
                    </div>
                  ) : outcome && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Maka...</div>
                      <Card className="p-6 bg-secondary/40 border-primary/30">
                        <p className="font-display text-lg leading-relaxed text-foreground/95">
                          <Typewriter text={outcome.outcome.text} speed={16} />
                        </p>
                        {outcome.outcome.memory && (
                          <div className="mt-4 pt-4 border-t border-border/60 text-xs text-muted-foreground italic">
                            ✦ Sebuah kenangan baru tertulis: "{outcome.outcome.memory.text}"
                          </div>
                        )}
                        {outcome.outcome.achievement && (
                          <div className="mt-3 text-xs text-primary">🏆 {outcome.outcome.achievement}</div>
                        )}
                      </Card>

                      <div className="mt-6 flex justify-end">
                        {hasFollowupPending ? (
                          // There is another moment this year — show it as a full event
                          <Button onClick={advanceToNextFollowup} size="lg" variant="outline" className="font-display">
                            Selanjutnya →
                          </Button>
                        ) : (
                          <Button onClick={nextYear} size="lg" className="font-display">
                            {state.alive ? "Tahun berikutnya →" : "Tutup buku ini"}
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="lg:hidden mt-6">
                  <MobileStatsDialog state={state} />
                </div>
              </div>

              <aside className="hidden lg:block">
                <Card className="p-5 bg-card/60 backdrop-blur sticky top-24">
                  <Tabs defaultValue="stats">
                    <TabsList className="grid grid-cols-3 w-full mb-4">
                      <TabsTrigger value="stats">Relasi</TabsTrigger>
                      <TabsTrigger value="timeline">Lini</TabsTrigger>
                      <TabsTrigger value="journal">Jurnal</TabsTrigger>
                    </TabsList>
                    <TabsContent value="stats"><StatPanel state={state} /></TabsContent>
                    <TabsContent value="timeline"><Timeline state={state} /></TabsContent>
                    <TabsContent value="journal"><Journal state={state} /></TabsContent>
                  </Tabs>
                </Card>
              </aside>
            </motion.div>
          )}

          {phase === "dead" && <DeathScreen key="dead" state={state} onRestart={restart} />}
        </AnimatePresence>
      </main>
    </div>
  );
};

function MobileStatsDialog({ state }: { state: GameState }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full gap-2 text-muted-foreground">
          <User className="w-4 h-4" />
          Kenangan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Kenangan — Umur {state.age}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="stats">
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="stats">Relasi</TabsTrigger>
            <TabsTrigger value="timeline">Lini</TabsTrigger>
            <TabsTrigger value="journal">Jurnal</TabsTrigger>
          </TabsList>
          <TabsContent value="stats"><StatPanel state={state} /></TabsContent>
          <TabsContent value="timeline"><Timeline state={state} /></TabsContent>
          <TabsContent value="journal"><Journal state={state} /></TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function AchievementsDialog({ unlocked }: { unlocked: string[] }) {
  const unlockedSet = useMemo(() => new Set(unlocked), [unlocked]);
  const total = ACHIEVEMENTS.length;
  const count = ACHIEVEMENTS.filter((a) => unlockedSet.has(a.name)).length;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-muted-foreground gap-2">
          <Trophy className="w-4 h-4" />
          Pencapaian
          <span className="text-xs text-muted-foreground/70">{count}/{total}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-3 text-left">
          <DialogTitle className="font-display flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Pencapaian
          </DialogTitle>
          <DialogDescription>
            {count} dari {total} terbuka sepanjang kehidupan yang pernah kamu jalani.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-2">
          {ACHIEVEMENTS.map((a) => {
            const got = unlockedSet.has(a.name);
            // Pencapaian tersembunyi yang belum diraih disamarkan: nama & petunjuk
            // tidak diungkap, hanya ditandai sebagai rahasia yang menunggu ditemukan.
            const masked = a.hidden && !got;
            return (
              <div
                key={a.name}
                className={`flex items-start gap-3 rounded-md border px-3 py-2.5 transition-colors ${
                  got ? "border-primary/30 bg-secondary/30" : "border-border/40 bg-background/40"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {got ? (
                    <Trophy className="w-4 h-4 text-primary" />
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground/50" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className={`font-display text-sm leading-snug flex items-center gap-2 ${got ? "text-foreground" : "text-muted-foreground/70"}`}>
                    {masked ? "???" : a.name}
                    {a.hidden && (
                      <span className="text-[9px] uppercase tracking-wider font-mono px-1 py-0.5 rounded bg-secondary/60 border border-border/40 text-muted-foreground/70">
                        rahasia
                      </span>
                    )}
                  </div>
                  <p className={`text-xs leading-snug mt-0.5 ${got ? "text-muted-foreground" : "text-muted-foreground/50 italic"}`}>
                    {masked ? "Pencapaian tersembunyi — temukan sendiri." : a.hint}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DeathScreen({ state, onRestart }: { state: GameState; onRestart: () => void }) {
  const ending = useMemo(() => computeEnding(state), [state]);
  // Sifat di batu nisan diturunkan dari keadaan akhir hidup, bukan dari
  // sekumpulan addTrait sepanjang permainan (lihat deriveTraits di engine.ts).
  const deathTraits = useMemo(() => deriveTraits(state), [state]);
  // Area yang ditangkap sebagai screenshot saat dibagikan — meliputi seluruh
  // tampilan In Memoriam kecuali tombol aksi di bawah.
  const captureRef = useRef<HTMLDivElement>(null);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} className="max-w-3xl mx-auto pt-8">
      <div ref={captureRef} className="bg-background">
      <div className="text-center mb-10">
        <Skull className="w-8 h-8 mx-auto text-muted-foreground mb-4" />
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-3">In Memoriam</p>
        <h2 className="font-display text-5xl md:text-6xl tracking-tight mb-3">{state.name}</h2>
        <p className="text-muted-foreground italic">{state.age} tahun · {ending.causeOfDeath}</p>
        <p className="font-display text-2xl italic text-primary mt-8">"{ending.title}"</p>
        <p className="text-foreground/80 max-w-xl mx-auto mt-3 leading-relaxed">{ending.epitaph}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 bg-card/60">
          <h3 className="font-display text-lg mb-3">Yang Tertinggal</h3>
          <ul className="space-y-1.5 text-sm">
            {state.relationships.map((r) => (
              <li key={r.id} className="flex justify-between">
                <span className={r.alive ? "text-foreground/80" : "text-muted-foreground line-through"}>{r.name}</span>
                <span className="text-muted-foreground italic text-xs">{r.role}</span>
              </li>
            ))}
          </ul>
          {deathTraits.length > 0 && (
            <>
              <h3 className="font-display text-lg mt-5 mb-2">Sifat</h3>
              <div className="flex flex-wrap gap-1.5">
                {deathTraits.map((t) => (
                  <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary/80 border border-border/40 text-muted-foreground">
                    {TRAIT_LABELS[t]}
                  </span>
                ))}
              </div>
            </>
          )}
          {state.achievements.length > 0 && (
            <>
              <h3 className="font-display text-lg mt-5 mb-2">Pencapaian</h3>
              <ul className="text-xs text-primary space-y-1">
                {state.achievements.map((a) => <li key={a}>🏆 {a}</li>)}
              </ul>
            </>
          )}
        </Card>

        <Card className="p-6 bg-card/60">
          <h3 className="font-display text-lg mb-3">Kenangan</h3>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
            {state.memories.length === 0 && (
              <p className="text-sm text-muted-foreground italic">Tidak ada yang patut diingat.</p>
            )}
            {state.memories.slice().reverse().map((m, i) => (
              <div key={`${m.age}-${m.tag}-${i}`} className="border-l-2 border-primary/40 pl-3">
                <div className="text-[10px] font-mono text-muted-foreground">Umur {m.age}</div>
                <p className="font-display italic text-sm text-foreground/85">"{m.text}"</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-card/60 mb-8">
        <h3 className="font-display text-lg mb-4">Lini Hidup</h3>
        <Timeline state={state} />
      </Card>
      </div>

      <div className="flex items-center justify-center gap-3">
        <ShareDialog captureRef={captureRef} name={state.name} />
        <Button size="lg" onClick={onRestart} className="font-display">Mulai hidup yang lain</Button>
      </div>
    </motion.div>
  );
}

// Ikon brand untuk dialog bagikan. Lucide tidak menyediakan ikon X/Threads,
// jadi disisipkan sebagai SVG ringan agar konsisten dan dikenali pemain.
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12Z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.967 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.631 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89-.005 0-.012 0-.018 0-.844 0-1.992.232-2.721 1.32l-1.676-1.124c.976-1.448 2.586-2.252 4.397-2.252.011 0 .023 0 .033 0 3.04.022 4.852 1.886 5.033 5.135.103.043.205.087.305.133 1.439.677 2.491 1.703 3.043 2.965.77 1.762.84 4.632-1.491 6.927-1.78 1.747-3.94 2.535-7.01 2.557Zm1.044-12.408c-.18 0-.362.005-.547.016-1.838.103-2.985.946-2.921 2.148.067 1.262 1.459 1.85 2.8 1.776 1.235-.067 2.842-.55 3.112-3.769a10.04 10.04 0 0 0-2.444-.171Z" />
    </svg>
  );
}

type SharePlatform = "facebook" | "x" | "threads";

const SHARE_PLATFORMS: { id: SharePlatform; label: string; Icon: typeof FacebookIcon }[] = [
  { id: "facebook", label: "Facebook", Icon: FacebookIcon },
  { id: "x", label: "X", Icon: XIcon },
  { id: "threads", label: "Threads", Icon: ThreadsIcon },
];

function buildShareUrl(platform: SharePlatform, link: string, text: string): string {
  const u = encodeURIComponent(link);
  const t = encodeURIComponent(text);
  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${u}&quote=${t}`;
    case "x":
      return `https://twitter.com/intent/tweet?url=${u}&text=${t}`;
    case "threads":
      return `https://www.threads.net/intent/post?text=${encodeURIComponent(`${text} ${link}`)}`;
  }
}

async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const blob = await (await fetch(dataUrl)).blob();
  return new File([blob], filename, { type: "image/png" });
}

function ShareDialog({ captureRef, name }: { captureRef: React.RefObject<HTMLDivElement>; name: string }) {
  const [open, setOpen] = useState(false);
  const [shot, setShot] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [selected, setSelected] = useState<Record<SharePlatform, boolean>>({
    facebook: true,
    x: true,
    threads: true,
  });
  // Apakah perangkat mendukung berbagi berkas via Web Share API. Diuji dengan
  // berkas dummy karena navigator.canShare memerlukan objek File yang valid.
  const [canNativeShare, setCanNativeShare] = useState(false);

  const gameLink = typeof window !== "undefined" ? window.location.origin : "";
  const shareText = `Aku baru saja menamatkan satu kehidupan sebagai ${name} di Simulasi Kehidupan. Tulis kisah hidupmu sendiri:`;
  const fileName = `in-memoriam-${name.replace(/\s+/g, "-").toLowerCase() || "kehidupan"}.png`;

  useEffect(() => {
    try {
      const probe = new File([""], "probe.png", { type: "image/png" });
      setCanNativeShare(typeof navigator.canShare === "function" && navigator.canShare({ files: [probe] }));
    } catch {
      setCanNativeShare(false);
    }
  }, []);

  // Tangkap screenshot saat dialog dibuka. Render diberi jeda satu frame agar
  // konten dialog tidak menutupi area yang ditangkap.
  useEffect(() => {
    if (!open) {
      setShot(null);
      return;
    }
    const node = captureRef.current;
    if (!node) return;
    setCapturing(true);
    const id = requestAnimationFrame(() => {
      toPng(node, { backgroundColor: "#0e0e11", pixelRatio: 2, cacheBust: true })
        .then((url) => setShot(url))
        .catch(() => toast.error("Gagal membuat screenshot. Coba lagi."))
        .finally(() => setCapturing(false));
    });
    return () => cancelAnimationFrame(id);
  }, [open, captureRef]);

  const toggle = (id: SharePlatform) =>
    setSelected((s) => ({ ...s, [id]: !s[id] }));

  const downloadShot = () => {
    if (!shot) return;
    const a = document.createElement("a");
    a.href = shot;
    a.download = fileName;
    a.click();
  };

  // Jalur native: berbagi gambar + teks + tautan sekaligus lewat menu share
  // bawaan perangkat. OS yang menentukan target (termasuk FB/X/Threads bila
  // terpasang), jadi pemilihan checkbox tidak berlaku di sini.
  const handleNativeShare = async () => {
    if (!shot) return;
    try {
      const file = await dataUrlToFile(shot, fileName);
      const data: ShareData = { files: [file], title: "Simulasi Kehidupan", text: shareText, url: gameLink };
      if (typeof navigator.canShare === "function" && !navigator.canShare(data)) {
        toast.error("Perangkat tidak mendukung berbagi gambar ini.");
        return;
      }
      await navigator.share(data);
      setOpen(false);
    } catch (e) {
      // Pengguna membatalkan menu share bukan kegagalan yang perlu ditampilkan.
      if ((e as Error)?.name !== "AbortError") toast.error("Gagal membagikan.");
    }
  };

  const handleShare = async () => {
    const targets = SHARE_PLATFORMS.filter((p) => selected[p.id]);
    if (targets.length === 0) {
      toast.error("Pilih setidaknya satu platform.");
      return;
    }
    // Web intent platform tidak bisa menerima berkas gambar, jadi screenshot
    // diunduh agar pemain dapat melampirkannya pada postingan.
    downloadShot();
    targets.forEach((p) => {
      window.open(buildShareUrl(p.id, gameLink, shareText), "_blank", "noopener,noreferrer");
    });
    toast.success("Screenshot tersimpan — lampirkan ke postinganmu.");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className="font-display gap-2">
          <Share2 className="w-4 h-4" />
          Bagikan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md flex flex-col gap-0 p-0 max-h-[90dvh] overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-3 text-left">
          <DialogTitle className="font-display">Bagikan In Memoriam</DialogTitle>
          <DialogDescription>
            Bagikan screenshot kehidupan ini beserta tautan untuk bermain.
          </DialogDescription>
        </DialogHeader>

        {/* Badan dialog di-scroll agar tidak terpotong di layar pendek (mis. iPhone SE),
            sementara header dan tombol aksi tetap menempel. */}
        <div className="flex-1 overflow-y-auto px-6 space-y-4">
          <div className="rounded-md border border-border/50 overflow-hidden bg-background/60 flex items-center justify-center min-h-[140px] max-h-[40dvh]">
            {capturing && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm py-10">
                <Loader2 className="w-4 h-4 animate-spin" /> Membuat screenshot…
              </div>
            )}
            {!capturing && shot && (
              <img src={shot} alt="Pratinjau In Memoriam" className="w-auto max-h-[40dvh] object-contain" />
            )}
            {!capturing && !shot && (
              <span className="text-muted-foreground text-sm py-10">Pratinjau tidak tersedia.</span>
            )}
          </div>

          {canNativeShare && (
            <div className="space-y-2">
              <Button variant="secondary" className="w-full gap-2" onClick={handleNativeShare} disabled={!shot}>
                <Smartphone className="w-4 h-4" />
                Bagikan lewat perangkat
              </Button>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                <span className="h-px flex-1 bg-border/50" />
                atau pilih platform
                <span className="h-px flex-1 bg-border/50" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Bagikan ke</p>
            {SHARE_PLATFORMS.map(({ id, label, Icon }) => (
              <label
                key={id}
                htmlFor={`share-${id}`}
                className="flex items-center gap-3 rounded-md border border-border/40 px-3 py-2 cursor-pointer hover:bg-secondary/40 transition-colors"
              >
                <Checkbox id={`share-${id}`} checked={selected[id]} onCheckedChange={() => toggle(id)} />
                <Icon className="w-5 h-5 text-foreground/80" />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 px-6 py-4 border-t border-border/40">
          <Button variant="outline" className="gap-2" onClick={downloadShot} disabled={!shot}>
            <Download className="w-4 h-4" />
            Unduh
          </Button>
          <Button className="flex-1 gap-2 font-display" onClick={handleShare} disabled={!shot}>
            <Share2 className="w-4 h-4" />
            Bagikan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ExitButton({ onExit, confirm }: { onExit: () => void; confirm: boolean }) {
  if (!confirm) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground"
        title="Keluar ke beranda"
        aria-label="Keluar ke beranda"
        onClick={onExit}
      >
        <LogOut className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          title="Keluar ke beranda"
          aria-label="Keluar ke beranda"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display">Keluar ke beranda?</AlertDialogTitle>
          <AlertDialogDescription>
            Kehidupan ini tersimpan otomatis. Kamu bisa melanjutkannya nanti dari beranda.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={onExit}>Keluar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default Game;

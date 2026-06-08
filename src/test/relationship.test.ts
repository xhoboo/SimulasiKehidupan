import { describe, it, expect } from "vitest";
import { newGame } from "../game/engine";
import { applyOutcome } from "../game/runtime";
import { EVENTS } from "../game/events";
import { Choice, GameState, LifeEvent, Outcome, Relationship } from "../game/types";

// Bungkus tipis applyOutcome supaya tiap test cukup memberi outcome + relasi awal.
function apply(rels: Relationship[], outcome: Outcome): GameState {
  const state: GameState = { ...newGame(), relationships: rels };
  const ev: LifeEvent = {
    id: "test_ev", category: "cinta", ageMin: 0, ageMax: 99,
    prompt: "", choices: [],
  };
  const choice: Choice = { id: "c", label: "", outcomes: [outcome] };
  return applyOutcome(state, ev, choice, outcome, () => 0.5);
}

const lover = (over: Partial<Relationship>): Relationship => ({
  id: "kekasih", name: "Kekasih", role: "lover", closeness: 60, alive: true, ...over,
});

describe("Kekasih → Pasangan saat menikah", () => {
  it("menghapus kekasih yang masih hadir dan menggantinya dengan Pasangan", () => {
    const next = apply([lover({})], {
      weight: 1, text: "menikah",
      addsRelationship: { id: "pasangan", name: "Pasangan", role: "lover", closeness: 70, alive: true },
      flag: "menikah",
    });
    expect(next.relationships.find((r) => r.id === "kekasih")).toBeUndefined();
    const pasangan = next.relationships.find((r) => r.id === "pasangan");
    expect(pasangan?.alive).toBe(true);
    expect(next.flags.menikah).toBe(true);
  });

  it("membiarkan mantan yang sudah dicoret tetap sebagai riwayat", () => {
    const next = apply(
      [lover({ alive: false }), lover({ id: "kekasih2", name: "Kekasih 2" })],
      {
        weight: 1, text: "menikah",
        addsRelationship: { id: "pasangan", name: "Pasangan", role: "lover", closeness: 80, alive: true },
        flag: "menikah",
      },
    );
    // Kekasih aktif (kekasih2) naik status → hilang; mantan tercoret tetap ada.
    expect(next.relationships.find((r) => r.id === "kekasih2")).toBeUndefined();
    const mantan = next.relationships.find((r) => r.id === "kekasih");
    expect(mantan?.alive).toBe(false);
    expect(next.relationships.find((r) => r.id === "pasangan")).toBeDefined();
  });

  it("menikahi orang yang baru dikenal tidak menghapus apa pun saat tak ada kekasih aktif", () => {
    const next = apply([], {
      weight: 1, text: "menikah",
      addsRelationship: { id: "pasangan", name: "Pasangan", role: "lover", closeness: 55, alive: true },
      flag: "menikah",
    });
    expect(next.relationships.find((r) => r.id === "pasangan")).toBeDefined();
  });
});

describe("Kekasih baru setelah putus dinomori", () => {
  it("kekasih kedua jadi Kekasih 2 tanpa menimpa mantan yang dicoret", () => {
    const next = apply([lover({ alive: false })], {
      weight: 1, text: "cinta lagi",
      addsRelationship: { id: "kekasih", name: "Kekasih", role: "lover", closeness: 60, alive: true },
    });
    const baru = next.relationships.find((r) => r.id === "kekasih2");
    expect(baru).toBeDefined();
    expect(baru?.name).toBe("Kekasih 2");
    expect(baru?.alive).toBe(true);
    // Mantan tetap tercatat dan tercoret.
    const mantan = next.relationships.find((r) => r.id === "kekasih");
    expect(mantan?.alive).toBe(false);
  });

  it("kekasih ketiga jadi Kekasih 3", () => {
    const next = apply(
      [lover({ alive: false }), lover({ id: "kekasih2", name: "Kekasih 2", alive: false })],
      {
        weight: 1, text: "cinta lagi",
        addsRelationship: { id: "kekasih", name: "Kekasih", role: "lover", closeness: 60, alive: true },
      },
    );
    expect(next.relationships.find((r) => r.id === "kekasih3")?.name).toBe("Kekasih 3");
  });

  it("kekasih pertama tetap bernama Kekasih (tanpa nomor)", () => {
    const next = apply([], {
      weight: 1, text: "cinta pertama dewasa",
      addsRelationship: { id: "kekasih", name: "Kekasih", role: "lover", closeness: 65, alive: true },
    });
    const k = next.relationships.find((r) => r.id === "kekasih");
    expect(k?.name).toBe("Kekasih");
  });
});

describe("Anak hanya bisa lahir setelah menikah", () => {
  it("setiap event yang menambah anak / menyalakan flag punya_anak mensyaratkan menikah", () => {
    const childEvents = EVENTS.filter((ev) => {
      const choices = typeof ev.choices === "function" ? [] : ev.choices;
      return choices.some((c) =>
        c.outcomes.some((o) =>
          o.addsRelationship?.role === "child" || o.flag === "punya_anak",
        ),
      );
    });
    expect(childEvents.length).toBeGreaterThan(0);
    for (const ev of childEvents) {
      expect(ev.requireFlag).toBe("menikah");
    }
  });
});

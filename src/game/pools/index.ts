import { LifeEvent } from "../types";
import { AGE_POOL } from "./age";
import { EMOTION_POOL } from "./emotion";
import { RELATIONSHIP_POOL } from "./relationship";
import { ECONOMIC_POOL } from "./economic";
import { TRAUMA_POOL } from "./trauma";
import { RARE_POOL } from "./rare";
import { SATIRICAL_POOL } from "./satirical";
import { QUIET_POOL } from "./quiet";
import { CALLBACK_POOL } from "./callback";
import { REGRET_POOL } from "./regret";
import { FILLER_POOL } from "./filler";
import { DEATH_POOL } from "./death";
import { BRANCH_POOL } from "./branch";
import { LIFE_STAGES_POOL } from "./life_stages";
import { PARENT_LOSS_POOL } from "./parent_loss";

// Event reguler (tanpa death pool, yang dipilih terpisah).
// BRANCH_POOL didahulukan agar event hasil pilihan pemain punya prioritas relevansi.
export const ALL_EVENTS: LifeEvent[] = [
  ...BRANCH_POOL,
  ...AGE_POOL, ...LIFE_STAGES_POOL, ...EMOTION_POOL, ...RELATIONSHIP_POOL, ...ECONOMIC_POOL,
  ...TRAUMA_POOL, ...PARENT_LOSS_POOL, ...RARE_POOL, ...SATIRICAL_POOL, ...QUIET_POOL,
  ...CALLBACK_POOL, ...REGRET_POOL, ...FILLER_POOL,
];

export const DEATH_EVENTS: LifeEvent[] = DEATH_POOL;

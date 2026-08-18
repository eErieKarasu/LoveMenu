import { eq, sql } from "drizzle-orm";
import { getD1, getDb } from "../../../db";
import { appState } from "../../../db/schema";

const HOUSEHOLD_ID = "lovemenu-home";
const MAX_PAYLOAD_BYTES = 1_500_000;

type PersistentState = {
  version: number;
  recipes: unknown[];
  groceries: unknown[];
  selectedToday: unknown[];
  weekPlan: unknown[];
  addForm?: unknown;
};

async function ensureStore() {
  const d1 = getD1();
  await d1.prepare(`
    CREATE TABLE IF NOT EXISTS app_state (
      household_id TEXT PRIMARY KEY NOT NULL,
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

function isPersistentState(value: unknown): value is PersistentState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<PersistentState>;
  return candidate.version === 1
    && Array.isArray(candidate.recipes)
    && Array.isArray(candidate.groceries)
    && Array.isArray(candidate.selectedToday)
    && Array.isArray(candidate.weekPlan);
}

export async function GET() {
  try {
    await ensureStore();
    const [row] = await getDb()
      .select({ payload: appState.payload, updatedAt: appState.updatedAt })
      .from(appState)
      .where(eq(appState.householdId, HOUSEHOLD_ID))
      .limit(1);

    if (!row) return Response.json({ state: null, updatedAt: null });

    return Response.json({
      state: JSON.parse(row.payload),
      updatedAt: row.updatedAt,
    });
  } catch (error) {
    console.error("Unable to read LoveMenu state", error);
    return Response.json({ error: "暂时无法读取家庭菜单" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_PAYLOAD_BYTES) {
      return Response.json({ error: "数据过大" }, { status: 413 });
    }

    const payload = JSON.parse(raw) as unknown;
    if (!isPersistentState(payload)) {
      return Response.json({ error: "数据格式不正确" }, { status: 400 });
    }

    await ensureStore();
    const serialized = JSON.stringify(payload);
    await getDb()
      .insert(appState)
      .values({ householdId: HOUSEHOLD_ID, payload: serialized })
      .onConflictDoUpdate({
        target: appState.householdId,
        set: { payload: serialized, updatedAt: sql`CURRENT_TIMESTAMP` },
      });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Unable to save LoveMenu state", error);
    return Response.json({ error: "暂时无法保存家庭菜单" }, { status: 500 });
  }
}

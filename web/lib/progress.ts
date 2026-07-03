// Lightweight, account-free progress tracking in localStorage. A "bootcamp"
// affordance the site lacked: mark lessons/labs done, resume where you left
// off, and show per-path completion. No backend — this is intentionally local
// and private to the browser; clearing storage resets it.
//
// Keys are namespaced so a future account-backed sync can migrate them.

const KEY = "finguru:progress:v1";

export interface ProgressState {
  /** Completed items, keyed by "lesson:<kind>:<slug>" or "lab:<strategyId>". */
  done: Record<string, number>; // value = timestamp (ms) it was marked
}

function read(): ProgressState {
  if (typeof window === "undefined") return { done: {} };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { done: {} };
    const parsed = JSON.parse(raw) as ProgressState;
    return parsed && typeof parsed.done === "object" ? parsed : { done: {} };
  } catch {
    return { done: {} };
  }
}

function write(state: ProgressState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
    // Notify listeners in this tab (the storage event only fires cross-tab).
    window.dispatchEvent(new CustomEvent("finguru:progress"));
  } catch {
    // Storage full / disabled (private mode) — progress is best-effort.
  }
}

export function lessonId(kind: string, slug: string): string {
  return `lesson:${kind}:${slug}`;
}
export function labId(strategyId: string): string {
  return `lab:${strategyId}`;
}

export function isDone(id: string): boolean {
  return Boolean(read().done[id]);
}

export function setDone(id: string, done: boolean, now: number): void {
  const state = read();
  if (done) state.done[id] = now;
  else delete state.done[id];
  write(state);
}

/** Fraction 0..1 of the given item ids that are marked done. */
export function completion(ids: string[]): number {
  if (ids.length === 0) return 0;
  const { done } = read();
  const n = ids.filter((id) => done[id]).length;
  return n / ids.length;
}

/** Count of done items among the given ids. */
export function doneCount(ids: string[]): number {
  const { done } = read();
  return ids.filter((id) => done[id]).length;
}

export function assertCond(condition: unknown): asserts condition {
  if (!condition) {
    throw new Error(`assert failure`);
  }
}

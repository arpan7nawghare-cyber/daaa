// TSP Held-Karp (DP over subsets)
// Time: O(n^2 * 2^n)  Space: O(n * 2^n)
// Best/Avg/Worst: O(n^2 * 2^n)

export interface AlgoResult<T> {
  result: T;
  timeMs: number;
  operationsCount: number;
}

export function tspHeldKarp(dist: number[][]): AlgoResult<{ path: number[]; cost: number }> {
  const start = performance.now();
  let operationsCount = 0;
  const n = dist.length;
  if (n === 0) return { result: { path: [], cost: 0 }, timeMs: performance.now() - start, operationsCount };

  const FULL = (1 << n) - 1;
  const dp: number[][] = Array.from({ length: 1 << n }, () => new Array(n).fill(Infinity));
  const parent: number[][] = Array.from({ length: 1 << n }, () => new Array(n).fill(-1));

  for (let i = 1; i < n; i++) {
    dp[1 << i][i] = dist[0][i];
    operationsCount++;
  }

  for (let mask = 1; mask <= FULL; mask++) {
    for (let last = 0; last < n; last++) {
      if (!(mask & (1 << last))) continue;
      if (dp[mask][last] === Infinity) continue;
      for (let next = 0; next < n; next++) {
        if (mask & (1 << next)) continue;
        operationsCount++;
        const newMask = mask | (1 << next);
        const newCost = dp[mask][last] + dist[last][next];
        if (newCost < dp[newMask][next]) {
          dp[newMask][next] = newCost;
          parent[newMask][next] = last;
        }
      }
    }
  }

  let bestCost = Infinity;
  let bestLast = -1;
  for (let i = 1; i < n; i++) {
    operationsCount++;
    const cost = dp[FULL][i] + dist[i][0];
    if (cost < bestCost) {
      bestCost = cost;
      bestLast = i;
    }
  }

  const path: number[] = [0];
  let mask = FULL;
  let cur = bestLast;
  while (cur !== -1 && cur !== 0) {
    path.push(cur);
    const prev = parent[mask][cur];
    mask = mask ^ (1 << cur);
    cur = prev;
  }
  path.reverse();

  const timeMs = performance.now() - start;
  return { result: { path, cost: bestCost }, timeMs, operationsCount };
}

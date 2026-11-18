// Bellman-Ford Shortest Path (handles negative weights)
// Time: O(V * E)  Space: O(V)
// Best: O(E)  Avg: O(V*E)  Worst: O(V*E)

export interface AlgoResult<T> {
  result: T;
  timeMs: number;
  operationsCount: number;
}

export interface ShortestPathResult {
  dist: number[];
  prev: number[];
  paths: number[][];
  hasNegativeCycle: boolean;
}

export function bellmanFord(
  n: number,
  edges: { u: number; v: number; w: number }[],
  source: number
): AlgoResult<ShortestPathResult> {
  const start = performance.now();
  let operationsCount = 0;
  const dist = new Array(n).fill(Infinity);
  const prev = new Array(n).fill(-1);
  dist[source] = 0;

  for (let iter = 0; iter < n - 1; iter++) {
    let updated = false;
    for (const e of edges) {
      operationsCount++;
      if (dist[e.u] !== Infinity && dist[e.u] + e.w < dist[e.v]) {
        dist[e.v] = dist[e.u] + e.w;
        prev[e.v] = e.u;
        updated = true;
      }
    }
    if (!updated) break;
  }

  let hasNegativeCycle = false;
  for (const e of edges) {
    operationsCount++;
    if (dist[e.u] !== Infinity && dist[e.u] + e.w < dist[e.v]) {
      hasNegativeCycle = true;
      break;
    }
  }

  const paths: number[][] = [];
  for (let i = 0; i < n; i++) {
    const path: number[] = [];
    let cur = i;
    let guard = 0;
    while (cur !== -1 && guard++ < n) {
      path.unshift(cur);
      cur = prev[cur];
    }
    paths.push(path);
  }

  const timeMs = performance.now() - start;
  return { result: { dist, prev, paths, hasNegativeCycle }, timeMs, operationsCount };
}

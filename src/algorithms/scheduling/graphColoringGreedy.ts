// Graph Coloring — Greedy (Welsh-Powell)
// Time: O(n^2)  Space: O(n)
// Best: O(n)  Avg: O(n^2)  Worst: O(n^2)

export interface AlgoResult<T> {
  result: T;
  timeMs: number;
  operationsCount: number;
}

export function graphColoringGreedy(
  n: number,
  edges: [number, number][]
): AlgoResult<{ colors: number[]; slotsUsed: number }> {
  const start = performance.now();
  let operationsCount = 0;
  const adj: Set<number>[] = Array.from({ length: n }, () => new Set());
  for (const [u, v] of edges) {
    adj[u].add(v);
    adj[v].add(u);
  }

  const colors = new Array(n).fill(0);
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => adj[b].size - adj[a].size);

  for (const node of order) {
    operationsCount++;
    const used = new Set<number>();
    for (const nb of adj[node]) used.add(colors[nb]);
    let c = 1;
    while (used.has(c)) c++;
    colors[node] = c;
  }

  const slotsUsed = Math.max(...colors, 0) || 1;
  const timeMs = performance.now() - start;
  return { result: { colors, slotsUsed }, timeMs, operationsCount };
}

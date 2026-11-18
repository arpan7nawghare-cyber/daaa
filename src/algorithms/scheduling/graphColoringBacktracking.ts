// Graph Coloring — Backtracking
// Time: O(k^n) for k colors  Space: O(n)
// Best: O(n)  Avg: O(k^n)  Worst: O(k^n)

export interface AlgoResult<T> {
  result: T;
  timeMs: number;
  operationsCount: number;
}

export function graphColoringBacktracking(
  n: number,
  edges: [number, number][]
): AlgoResult<{ colors: number[]; slotsUsed: number }> {
  const start = performance.now();
  let operationsCount = 0;
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const colors = new Array(n).fill(0);

  function isSafe(node: number, c: number): boolean {
    operationsCount++;
    for (const nb of adj[node]) {
      if (colors[nb] === c) return false;
    }
    return true;
  }

  function solve(node: number, maxC: number): boolean {
    operationsCount++;
    if (node === n) return true;
    for (let c = 1; c <= maxC; c++) {
      if (isSafe(node, c)) {
        colors[node] = c;
        if (solve(node + 1, maxC)) return true;
        colors[node] = 0;
      }
    }
    return false;
  }

  let maxColors = 1;
  while (maxColors <= n) {
    operationsCount++;
    colors.fill(0);
    if (solve(0, maxColors)) break;
    maxColors++;
  }

  const timeMs = performance.now() - start;
  return { result: { colors, slotsUsed: maxColors }, timeMs, operationsCount };
}

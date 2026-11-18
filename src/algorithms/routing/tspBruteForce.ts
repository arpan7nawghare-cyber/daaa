// TSP Brute Force
// Time: O(n!)  Space: O(n)
// Best/Avg/Worst: O(n!) — tries every permutation of cities.

export interface AlgoResult<T> {
  result: T;
  timeMs: number;
  operationsCount: number;
}

export function tspBruteForce(dist: number[][]): AlgoResult<{ path: number[]; cost: number }> {
  const start = performance.now();
  let operationsCount = 0;
  const n = dist.length;
  if (n === 0) return { result: { path: [], cost: 0 }, timeMs: performance.now() - start, operationsCount };

  let bestCost = Infinity;
  let bestPath: number[] = [];
  const perm = Array.from({ length: n }, (_, i) => i);

  function permute(arr: number[], k: number) {
    if (k === 1) {
      operationsCount++;
      let cost = 0;
      for (let i = 0; i < arr.length; i++) {
        operationsCount++;
        const from = arr[i];
        const to = arr[(i + 1) % arr.length];
        cost += dist[from][to];
      }
      if (cost < bestCost) {
        bestCost = cost;
        bestPath = [...arr];
      }
      return;
    }
    for (let i = 0; i < k; i++) {
      [arr[i], arr[k - 1]] = [arr[k - 1], arr[i]];
      permute(arr, k - 1);
      [arr[i], arr[k - 1]] = [arr[k - 1], arr[i]];
    }
  }

  permute(perm, n);
  const timeMs = performance.now() - start;
  return { result: { path: bestPath, cost: bestCost }, timeMs, operationsCount };
}

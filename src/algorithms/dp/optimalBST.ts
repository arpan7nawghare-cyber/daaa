// Optimal Binary Search Tree (OBST) — Dynamic Programming
// Time: O(n^3)  Space: O(n^2)
// Best/Avg/Worst: O(n^3)

export interface AlgoResult<T> {
  result: T;
  timeMs: number;
  operationsCount: number;
}

export interface OBSTResult {
  minCost: number;
  root: number[][];
}

export function optimalBST(keys: number[], freqs: number[]): AlgoResult<OBSTResult> {
  const start = performance.now();
  let operationsCount = 0;
  const n = keys.length;
  if (n === 0) return { result: { minCost: 0, root: [] }, timeMs: performance.now() - start, operationsCount };

  const cost: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const root: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    cost[i][i] = freqs[i];
    root[i][i] = i;
  }

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      cost[i][j] = Infinity;
      const sum = freqs.slice(i, j + 1).reduce((a, b) => a + b, 0);
      for (let r = i; r <= j; r++) {
        operationsCount++;
        const left = r > i ? cost[i][r - 1] : 0;
        const right = r < j ? cost[r + 1][j] : 0;
        const c = left + right + sum;
        if (c < cost[i][j]) {
          cost[i][j] = c;
          root[i][j] = r;
        }
      }
    }
  }

  const timeMs = performance.now() - start;
  return { result: { minCost: cost[0][n - 1], root }, timeMs, operationsCount };
}

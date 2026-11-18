// Matrix Chain Multiplication — Dynamic Programming
// Time: O(n^3)  Space: O(n^2)
// Best/Avg/Worst: O(n^3)

export interface AlgoResult<T> {
  result: T;
  timeMs: number;
  operationsCount: number;
}

export interface MCMResult {
  minCost: number;
  splits: number[][];
  order: string;
}

export function matrixChainMultiplication(dims: number[]): AlgoResult<MCMResult> {
  const start = performance.now();
  let operationsCount = 0;
  const n = dims.length - 1;
  if (n <= 0) return { result: { minCost: 0, splits: [], order: '' }, timeMs: performance.now() - start, operationsCount };

  const m: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const s: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      m[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        operationsCount++;
        const cost = m[i][k] + m[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
        if (cost < m[i][j]) {
          m[i][j] = cost;
          s[i][j] = k;
        }
      }
    }
  }

  function orderStr(i: number, j: number): string {
    if (i === j) return `M${i + 1}`;
    return `(${orderStr(i, s[i][j])} × ${orderStr(s[i][j] + 1, j)})`;
  }

  const timeMs = performance.now() - start;
  return {
    result: { minCost: m[0][n - 1], splits: s, order: orderStr(0, n - 1) },
    timeMs,
    operationsCount,
  };
}

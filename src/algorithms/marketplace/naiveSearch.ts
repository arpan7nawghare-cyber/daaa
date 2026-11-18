// Naive String Search
// Time: O(n * m)  Space: O(1)
// Best: O(n)  Avg: O(n * m)  Worst: O(n * m)

export interface AlgoResult<T> {
  result: T;
  timeMs: number;
  operationsCount: number;
}

export function naiveSearch(text: string, pattern: string): AlgoResult<number[]> {
  const start = performance.now();
  let operationsCount = 0;
  const matches: number[] = [];
  const n = text.length;
  const m = pattern.length;
  if (m === 0 || n < m) {
    return { result: matches, timeMs: performance.now() - start, operationsCount };
  }

  for (let i = 0; i <= n - m; i++) {
    let j = 0;
    for (; j < m; j++) {
      operationsCount++;
      if (text[i + j] !== pattern[j]) break;
    }
    if (j === m) matches.push(i);
  }

  const timeMs = performance.now() - start;
  return { result: matches, timeMs, operationsCount };
}

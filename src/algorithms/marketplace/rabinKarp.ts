// Rabin-Karp String Matching (Rolling Hash)
// Time: O(n + m) average, O(n*m) worst
// Space: O(1)
// Best: O(n+m)  Avg: O(n+m)  Worst: O(n*m)

export interface AlgoResult<T> {
  result: T;
  timeMs: number;
  operationsCount: number;
}

export function rabinKarp(text: string, pattern: string): AlgoResult<number[]> {
  const start = performance.now();
  let operationsCount = 0;
  const matches: number[] = [];
  const n = text.length;
  const m = pattern.length;
  if (m === 0 || n < m) {
    return { result: matches, timeMs: performance.now() - start, operationsCount };
  }

  const BASE = 256;
  const MOD = 1000000007;
  let patHash = 0;
  let txtHash = 0;
  let h = 1;

  for (let i = 0; i < m - 1; i++) {
    h = (h * BASE) % MOD;
    operationsCount++;
  }

  for (let i = 0; i < m; i++) {
    patHash = (patHash * BASE + text.charCodeAt(i)) % MOD;
    txtHash = (txtHash * BASE + pattern.charCodeAt(i)) % MOD;
    operationsCount++;
  }

  for (let i = 0; i <= n - m; i++) {
    operationsCount++;
    if (patHash === txtHash) {
      let match = true;
      for (let j = 0; j < m; j++) {
        operationsCount++;
        if (text[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }
      if (match) matches.push(i);
    }
    if (i < n - m) {
      txtHash = ((txtHash - text.charCodeAt(i) * h) * BASE + text.charCodeAt(i + m)) % MOD;
      if (txtHash < 0) txtHash += MOD;
    }
  }

  const timeMs = performance.now() - start;
  return { result: matches, timeMs, operationsCount };
}

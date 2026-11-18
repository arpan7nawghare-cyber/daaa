// KMP String Search
// Time: O(n + m)  Space: O(m)
// Best: O(n)  Avg: O(n + m)  Worst: O(n + m)  (n = text length, m = pattern length)

export interface AlgoResult<T> {
  result: T;
  timeMs: number;
  operationsCount: number;
}

export function kmpSearch(text: string, pattern: string): AlgoResult<number[]> {
  const start = performance.now();
  let operationsCount = 0;
  const matches: number[] = [];
  const n = text.length;
  const m = pattern.length;
  if (m === 0 || n < m) {
    return { result: matches, timeMs: performance.now() - start, operationsCount };
  }

  const lps = new Array(m).fill(0);
  let len = 0;
  let i = 1;
  while (i < m) {
    operationsCount++;
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else if (len > 0) {
      len = lps[len - 1];
    } else {
      lps[i] = 0;
      i++;
    }
  }

  i = 0;
  let j = 0;
  while (i < n) {
    operationsCount++;
    if (text[i] === pattern[j]) {
      i++;
      j++;
    }
    if (j === m) {
      matches.push(i - j);
      j = lps[j - 1];
    } else if (i < n && text[i] !== pattern[j]) {
      if (j > 0) j = lps[j - 1];
      else i++;
    }
  }

  const timeMs = performance.now() - start;
  return { result: matches, timeMs, operationsCount };
}

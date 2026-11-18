// Longest Common Subsequence (LCS) — Dynamic Programming
// Time: O(n * m)  Space: O(n * m)
// Best/Avg/Worst: O(n * m)

export interface AlgoResult<T> {
  result: T;
  timeMs: number;
  operationsCount: number;
}

export interface LCSResult {
  length: number;
  subsequence: string;
}

export function longestCommonSubsequence(s1: string, s2: string): AlgoResult<LCSResult> {
  const start = performance.now();
  let operationsCount = 0;
  const n = s1.length;
  const m = s2.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      operationsCount++;
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  let i = n, j = m;
  const chars: string[] = [];
  while (i > 0 && j > 0) {
    operationsCount++;
    if (s1[i - 1] === s2[j - 1]) {
      chars.push(s1[i - 1]);
      i--; j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  const timeMs = performance.now() - start;
  return {
    result: { length: dp[n][m], subsequence: chars.reverse().join('') },
    timeMs,
    operationsCount,
  };
}

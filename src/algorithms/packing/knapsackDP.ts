// 0/1 Knapsack — Dynamic Programming
// Time: O(n * capacity)  Space: O(n * capacity)
// Best/Avg/Worst: O(n * capacity)

export interface AlgoResult<T> {
  result: T;
  timeMs: number;
  operationsCount: number;
}

export interface KnapsackItem {
  name: string;
  weight: number;
  value: number;
}

export function knapsackDP(
  items: KnapsackItem[],
  capacity: number
): AlgoResult<{ selected: number[]; totalValue: number }> {
  const start = performance.now();
  let operationsCount = 0;
  const n = items.length;
  const C = Math.floor(capacity);
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(C + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= C; w++) {
      operationsCount++;
      const wt = Math.floor(items[i - 1].weight);
      if (wt <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - wt] + items[i - 1].value);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  const selected: number[] = [];
  let w = C;
  for (let i = n; i > 0; i--) {
    operationsCount++;
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(i - 1);
      w -= Math.floor(items[i - 1].weight);
    }
  }
  selected.reverse();

  const timeMs = performance.now() - start;
  return { result: { selected, totalValue: dp[n][C] }, timeMs, operationsCount };
}

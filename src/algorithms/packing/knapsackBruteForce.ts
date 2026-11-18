// 0/1 Knapsack — Brute Force (all subsets)
// Time: O(2^n)  Space: O(n)
// Best/Avg/Worst: O(2^n)

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

export function knapsackBruteForce(
  items: KnapsackItem[],
  capacity: number
): AlgoResult<{ selected: number[]; totalValue: number }> {
  const start = performance.now();
  let operationsCount = 0;
  const n = items.length;

  let bestValue = 0;
  let bestSet: number[] = [];

  for (let mask = 0; mask < (1 << n); mask++) {
    let weight = 0;
    let value = 0;
    const current: number[] = [];
    for (let i = 0; i < n; i++) {
      operationsCount++;
      if (mask & (1 << i)) {
        weight += items[i].weight;
        value += items[i].value;
        current.push(i);
      }
    }
    if (weight <= capacity && value > bestValue) {
      bestValue = value;
      bestSet = current;
    }
  }

  const timeMs = performance.now() - start;
  return { result: { selected: bestSet, totalValue: bestValue }, timeMs, operationsCount };
}

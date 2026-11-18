// 0/1 Knapsack — Greedy by value/weight ratio
// Time: O(n log n)  Space: O(n)
// Best: O(n log n)  Avg: O(n log n)  Worst: O(n log n) — no guarantee of optimal.

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

export function knapsackGreedy(
  items: KnapsackItem[],
  capacity: number
): AlgoResult<{ selected: number[]; totalValue: number }> {
  const start = performance.now();
  let operationsCount = 0;
  const n = items.length;

  const ratios = items.map((it, i) => {
    operationsCount++;
    return { idx: i, ratio: it.value / it.weight, weight: it.weight, value: it.value };
  });
  ratios.sort((a, b) => b.ratio - a.ratio);

  const selected: number[] = [];
  let totalWeight = 0;
  let totalValue = 0;

  for (const r of ratios) {
    operationsCount++;
    if (totalWeight + r.weight <= capacity) {
      selected.push(r.idx);
      totalWeight += r.weight;
      totalValue += r.value;
    }
  }
  selected.sort((a, b) => a - b);

  const timeMs = performance.now() - start;
  return { result: { selected, totalValue }, timeMs, operationsCount };
}

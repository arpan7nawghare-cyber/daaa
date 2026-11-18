// Bubble Sort
// Time: O(n^2)  Space: O(1)
// Best: O(n)  Avg: O(n^2)  Worst: O(n^2)

export interface AlgoResult<T> {
  result: T;
  timeMs: number;
  operationsCount: number;
}

export function bubbleSort(arr: number[]): AlgoResult<number[]> {
  const start = performance.now();
  let operationsCount = 0;
  const result = [...arr];
  const n = result.length;
  let swapped = true;

  for (let i = 0; i < n - 1 && swapped; i++) {
    swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      operationsCount++;
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
        swapped = true;
      }
    }
  }

  const timeMs = performance.now() - start;
  return { result, timeMs, operationsCount };
}

// Merge Sort
// Time: O(n log n)  Space: O(n)
// Best/Avg/Worst: O(n log n)

export interface AlgoResult<T> {
  result: T;
  timeMs: number;
  operationsCount: number;
}

export function mergeSort(arr: number[]): AlgoResult<number[]> {
  const start = performance.now();
  let operationsCount = 0;

  function merge(left: number[], right: number[]): number[] {
    const out: number[] = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      operationsCount++;
      if (left[i] <= right[j]) out.push(left[i++]);
      else out.push(right[j++]);
    }
    while (i < left.length) out.push(left[i++]);
    while (j < right.length) out.push(right[j++]);
    return out;
  }

  function sort(a: number[]): number[] {
    if (a.length <= 1) return a;
    const mid = Math.floor(a.length / 2);
    return merge(sort(a.slice(0, mid)), sort(a.slice(mid)));
  }

  const result = sort([...arr]);
  const timeMs = performance.now() - start;
  return { result, timeMs, operationsCount };
}

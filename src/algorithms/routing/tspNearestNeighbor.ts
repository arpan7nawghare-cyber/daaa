// TSP Nearest Neighbor heuristic
// Time: O(n^2)  Space: O(n)
// Best/Avg/Worst: O(n^2)

export interface AlgoResult<T> {
  result: T;
  timeMs: number;
  operationsCount: number;
}

export function tspNearestNeighbor(dist: number[][]): AlgoResult<{ path: number[]; cost: number }> {
  const start = performance.now();
  let operationsCount = 0;
  const n = dist.length;
  if (n === 0) return { result: { path: [], cost: 0 }, timeMs: performance.now() - start, operationsCount };

  const visited = new Array(n).fill(false);
  const path: number[] = [0];
  visited[0] = true;
  let cost = 0;
  let current = 0;

  for (let step = 1; step < n; step++) {
    let nearest = -1;
    let minDist = Infinity;
    for (let j = 0; j < n; j++) {
      operationsCount++;
      if (!visited[j] && dist[current][j] < minDist) {
        minDist = dist[current][j];
        nearest = j;
      }
    }
    if (nearest === -1) break;
    visited[nearest] = true;
    path.push(nearest);
    cost += minDist;
    current = nearest;
  }
  cost += dist[current][0];

  const timeMs = performance.now() - start;
  return { result: { path, cost }, timeMs, operationsCount };
}

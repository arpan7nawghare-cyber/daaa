// Dijkstra's Shortest Path
// Time: O(V^2)  Space: O(V)
// Best/Avg/Worst: O(V^2) with adjacency matrix; O((V+E) log V) with heap.

export interface AlgoResult<T> {
  result: T;
  timeMs: number;
  operationsCount: number;
}

export interface ShortestPathResult {
  dist: number[];
  prev: number[];
  paths: number[][];
}

export function dijkstra(
  n: number,
  edges: { u: number; v: number; w: number }[],
  source: number
): AlgoResult<ShortestPathResult> {
  const start = performance.now();
  let operationsCount = 0;
  const adj: number[][] = Array.from({ length: n }, () => new Array(n).fill(Infinity));
  for (const e of edges) {
    if (e.w < 0) continue;
    adj[e.u][e.v] = Math.min(adj[e.u][e.v], e.w);
    adj[e.v][e.u] = Math.min(adj[e.v][e.u], e.w);
  }

  const dist = new Array(n).fill(Infinity);
  const prev = new Array(n).fill(-1);
  const visited = new Array(n).fill(false);
  dist[source] = 0;

  for (let count = 0; count < n; count++) {
    let u = -1;
    let minDist = Infinity;
    for (let v = 0; v < n; v++) {
      operationsCount++;
      if (!visited[v] && dist[v] < minDist) {
        minDist = dist[v];
        u = v;
      }
    }
    if (u === -1) break;
    visited[u] = true;
    for (let v = 0; v < n; v++) {
      operationsCount++;
      if (!visited[v] && adj[u][v] < Infinity && dist[u] + adj[u][v] < dist[v]) {
        dist[v] = dist[u] + adj[u][v];
        prev[v] = u;
      }
    }
  }

  const paths: number[][] = [];
  for (let i = 0; i < n; i++) {
    const path: number[] = [];
    let cur = i;
    while (cur !== -1) {
      path.unshift(cur);
      cur = prev[cur];
    }
    paths.push(path);
  }

  const timeMs = performance.now() - start;
  return { result: { dist, prev, paths }, timeMs, operationsCount };
}

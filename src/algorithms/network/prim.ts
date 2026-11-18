// Prim's MST
// Time: O(V^2)  Space: O(V)
// Best/Avg/Worst: O(V^2) with adjacency matrix; O(E log V) with heap.

export interface AlgoResult<T> {
  result: T;
  timeMs: number;
  operationsCount: number;
}

export interface PrimEdge {
  u: number;
  v: number;
  w: number;
}

export function prim(
  n: number,
  edges: { u: number; v: number; w: number }[]
): AlgoResult<{ edges: PrimEdge[]; totalWeight: number }> {
  const start = performance.now();
  let operationsCount = 0;
  const adj: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const e of edges) {
    adj[e.u][e.v] = e.w;
    adj[e.v][e.u] = e.w;
  }

  const inMST = new Array(n).fill(false);
  const key = new Array(n).fill(Infinity);
  const parent = new Array(n).fill(-1);
  key[0] = 0;

  const mstEdges: PrimEdge[] = [];
  let totalWeight = 0;

  for (let count = 0; count < n; count++) {
    let u = -1;
    let minKey = Infinity;
    for (let v = 0; v < n; v++) {
      operationsCount++;
      if (!inMST[v] && key[v] < minKey) {
        minKey = key[v];
        u = v;
      }
    }
    if (u === -1) break;
    inMST[u] = true;
    if (parent[u] !== -1) {
      mstEdges.push({ u: parent[u], v: u, w: key[u] });
      totalWeight += key[u];
    }
    for (let v = 0; v < n; v++) {
      operationsCount++;
      if (adj[u][v] > 0 && !inMST[v] && adj[u][v] < key[v]) {
        key[v] = adj[u][v];
        parent[v] = u;
      }
    }
  }

  const timeMs = performance.now() - start;
  return { result: { edges: mstEdges, totalWeight }, timeMs, operationsCount };
}

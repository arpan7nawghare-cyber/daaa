// Kruskal's MST (with Union-Find)
// Time: O(E log E)  Space: O(V)
// Best/Avg/Worst: O(E log E)

export interface AlgoResult<T> {
  result: T;
  timeMs: number;
  operationsCount: number;
}

export interface KruskalEdge {
  u: number;
  v: number;
  w: number;
}

export function kruskal(
  n: number,
  edges: KruskalEdge[]
): AlgoResult<{ edges: KruskalEdge[]; totalWeight: number }> {
  const start = performance.now();
  let operationsCount = 0;
  const sorted = [...edges].sort((a, b) => a.w - b.w);
  const parent = Array.from({ length: n }, (_, i) => i);

  function find(x: number): number {
    operationsCount++;
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(a: number, b: number): boolean {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return false;
    parent[ra] = rb;
    return true;
  }

  const mstEdges: KruskalEdge[] = [];
  let totalWeight = 0;
  for (const e of sorted) {
    operationsCount++;
    if (mstEdges.length >= n - 1) break;
    if (union(e.u, e.v)) {
      mstEdges.push(e);
      totalWeight += e.w;
    }
  }

  const timeMs = performance.now() - start;
  return { result: { edges: mstEdges, totalWeight }, timeMs, operationsCount };
}

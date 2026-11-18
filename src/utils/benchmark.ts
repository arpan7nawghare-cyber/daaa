// Benchmark runner: times any algorithm across a range of input sizes,
// returning Recharts-ready data points.

export interface BenchmarkPoint {
  size: number;
  timeMs: number;
  operationsCount: number;
}

export interface BenchmarkSeries {
  name: string;
  data: BenchmarkPoint[];
}

export interface ComplexityInfo {
  name: string;
  time: string;
  space: string;
  best: string;
  average: string;
  worst: string;
}

export const complexityTable: ComplexityInfo[] = [
  { name: 'TSP Brute Force', time: 'O(n!)', space: 'O(n)', best: 'O(n!)', average: 'O(n!)', worst: 'O(n!)' },
  { name: 'TSP Held-Karp', time: 'O(n²·2ⁿ)', space: 'O(n·2ⁿ)', best: 'O(n²·2ⁿ)', average: 'O(n²·2ⁿ)', worst: 'O(n²·2ⁿ)' },
  { name: 'TSP Nearest Neighbor', time: 'O(n²)', space: 'O(n)', best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
  { name: 'N-Queens (Backtracking)', time: 'O(N!)', space: 'O(N)', best: 'O(N)', average: 'O(N!)', worst: 'O(N!)' },
  { name: 'Knapsack DP', time: 'O(n·C)', space: 'O(n·C)', best: 'O(n·C)', average: 'O(n·C)', worst: 'O(n·C)' },
  { name: 'Knapsack Greedy', time: 'O(n log n)', space: 'O(n)', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  { name: 'Knapsack Brute Force', time: 'O(2ⁿ)', space: 'O(n)', best: 'O(2ⁿ)', average: 'O(2ⁿ)', worst: 'O(2ⁿ)' },
  { name: 'Graph Coloring Backtracking', time: 'O(kⁿ)', space: 'O(n)', best: 'O(n)', average: 'O(kⁿ)', worst: 'O(kⁿ)' },
  { name: 'Graph Coloring Greedy', time: 'O(n²)', space: 'O(n)', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  { name: 'Matrix Chain Multiplication', time: 'O(n³)', space: 'O(n²)', best: 'O(n³)', average: 'O(n³)', worst: 'O(n³)' },
  { name: 'Longest Common Subsequence', time: 'O(n·m)', space: 'O(n·m)', best: 'O(n·m)', average: 'O(n·m)', worst: 'O(n·m)' },
  { name: 'Optimal BST', time: 'O(n³)', space: 'O(n²)', best: 'O(n³)', average: 'O(n³)', worst: 'O(n³)' },
  { name: 'KMP Search', time: 'O(n+m)', space: 'O(m)', best: 'O(n)', average: 'O(n+m)', worst: 'O(n+m)' },
  { name: 'Naive Search', time: 'O(n·m)', space: 'O(1)', best: 'O(n)', average: 'O(n·m)', worst: 'O(n·m)' },
  { name: 'Rabin-Karp Search', time: 'O(n+m)', space: 'O(1)', best: 'O(n+m)', average: 'O(n+m)', worst: 'O(n·m)' },
  { name: 'Merge Sort', time: 'O(n log n)', space: 'O(n)', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  { name: 'Bubble Sort', time: 'O(n²)', space: 'O(1)', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  { name: "Kruskal's MST", time: 'O(E log E)', space: 'O(V)', best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)' },
  { name: "Prim's MST", time: 'O(V²)', space: 'O(V)', best: 'O(V²)', average: 'O(V²)', worst: 'O(V²)' },
  { name: "Dijkstra's SSSP", time: 'O(V²)', space: 'O(V)', best: 'O(V²)', average: 'O(V²)', worst: 'O(V²)' },
  { name: 'Bellman-Ford SSSP', time: 'O(V·E)', space: 'O(V)', best: 'O(E)', average: 'O(V·E)', worst: 'O(V·E)' },
];

export const complexityClasses = [
  { cls: 'P', desc: 'Problems solvable in polynomial time by a deterministic Turing machine.', examples: 'Sorting (Merge Sort), Shortest Path (Dijkstra), MST (Kruskal/Prim), LCS, MCM, OBST' },
  { cls: 'NP', desc: 'Solutions verifiable in polynomial time; may take exponential time to find.', examples: 'TSP (decision), Graph Coloring, Knapsack, N-Queens' },
  { cls: 'NP-Hard', desc: 'At least as hard as the hardest NP problems; not necessarily in NP.', examples: 'TSP (optimization), Halting Problem' },
  { cls: 'NP-Complete', desc: 'In NP AND as hard as any NP problem — the hardest in NP.', examples: 'TSP (decision variant), Graph Coloring (k-color), Knapsack (decision)' },
];

export type InputGenerator<TInput> = (size: number) => TInput;

export function runBenchmark<TInput>(
  fn: (input: TInput) => { timeMs: number; operationsCount: number },
  gen: InputGenerator<TInput>,
  sizes: number[],
  runs = 1
): BenchmarkSeries['data'] {
  const points: BenchmarkPoint[] = [];
  for (const size of sizes) {
    const input = gen(size);
    let timeMs = 0;
    let operationsCount = 0;
    for (let r = 0; r < runs; r++) {
      const out = fn(input);
      timeMs += out.timeMs;
      operationsCount = out.operationsCount;
    }
    points.push({ size, timeMs: timeMs / runs, operationsCount });
  }
  return points;
}

export function toSeries(name: string, data: BenchmarkPoint[]): BenchmarkSeries {
  return { name, data };
}

export function distMatrix(size: number): number[][] {
  const m: number[][] = Array.from({ length: size }, () => new Array(size).fill(0));
  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) {
      const d = Math.floor(Math.random() * 90) + 10;
      m[i][j] = d;
      m[j][i] = d;
    }
  }
  return m;
}

export function knapsackItems(size: number) {
  return Array.from({ length: size }, (_, i) => ({
    name: `Item ${i}`,
    weight: Math.floor(Math.random() * 20) + 1,
    value: Math.floor(Math.random() * 100) + 10,
  }));
}

export function graphEdges(size: number): [number, number][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) {
      if (Math.random() < 0.3) edges.push([i, j]);
    }
  }
  return edges;
}

export function kruskalEdges(size: number) {
  const edges: { u: number; v: number; w: number }[] = [];
  for (let i = 0; i < size; i++) {
    for (let j = i + 1; j < size; j++) {
      if (Math.random() < 0.4) edges.push({ u: i, v: j, w: Math.floor(Math.random() * 90) + 10 });
    }
  }
  return edges;
}

export function matrixDims(size: number): number[] {
  return Array.from({ length: size + 1 }, () => Math.floor(Math.random() * 20) + 5);
}

export function randomStrings(size: number): [string, string] {
  const chars = 'ACGT';
  const s1 = Array.from({ length: size }, () => chars[Math.floor(Math.random() * 4)]).join('');
  const s2 = Array.from({ length: size }, () => chars[Math.floor(Math.random() * 4)]).join('');
  return [s1, s2];
}

export function randomKeys(size: number): { keys: number[]; freqs: number[] } {
  const keys = Array.from({ length: size }, (_, i) => i + 1);
  const freqs = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
  return { keys, freqs };
}

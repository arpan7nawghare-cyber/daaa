import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { tspBruteForce } from '@/algorithms/routing/tspBruteForce';
import { tspHeldKarp } from '@/algorithms/routing/tspHeldKarp';
import { tspNearestNeighbor } from '@/algorithms/routing/tspNearestNeighbor';
import { knapsackDP } from '@/algorithms/packing/knapsackDP';
import { knapsackGreedy } from '@/algorithms/packing/knapsackGreedy';
import { knapsackBruteForce } from '@/algorithms/packing/knapsackBruteForce';
import { graphColoringBacktracking } from '@/algorithms/scheduling/graphColoringBacktracking';
import { graphColoringGreedy } from '@/algorithms/scheduling/graphColoringGreedy';
import { kmpSearch } from '@/algorithms/marketplace/kmpSearch';
import { naiveSearch } from '@/algorithms/marketplace/naiveSearch';
import { mergeSort } from '@/algorithms/marketplace/mergeSort';
import { bubbleSort } from '@/algorithms/marketplace/bubbleSort';
import { kruskal } from '@/algorithms/network/kruskal';
import {
  runBenchmark,
  distMatrix,
  knapsackItems,
  graphEdges,
  kruskalEdges,
  complexityTable,
} from '@/utils/benchmark';

interface ModuleChart {
  title: string;
  series: { name: string; data: { size: number; timeMs: number; operationsCount: number }[] }[];
}

export default function Benchmark() {
  const modules: ModuleChart[] = useMemo(() => {
    const routingSizes = [4, 5, 6, 7, 8, 9];
    return [
      {
        title: 'Route Optimizer (TSP)',
        series: [
          { name: 'Nearest Neighbor', data: runBenchmark(tspNearestNeighbor, distMatrix, routingSizes) },
          { name: 'Held-Karp', data: runBenchmark(tspHeldKarp, distMatrix, [4, 5, 6, 7, 8]) },
          { name: 'Brute Force', data: runBenchmark(tspBruteForce, distMatrix, [4, 5, 6, 7, 8, 9]) },
        ],
      },
      {
        title: 'Truck Loading (Knapsack)',
        series: [
          { name: 'DP', data: runBenchmark((items) => knapsackDP(items, 100), knapsackItems, [5, 10, 15, 20, 25]) },
          { name: 'Greedy', data: runBenchmark((items) => knapsackGreedy(items, 100), knapsackItems, [5, 10, 15, 20, 25]) },
          { name: 'Brute Force', data: runBenchmark((items) => knapsackBruteForce(items, 100), knapsackItems, [5, 8, 10, 12, 14]) },
        ],
      },
      {
        title: 'Scheduler (Graph Coloring)',
        series: [
          { name: 'Backtracking', data: runBenchmark((n) => graphColoringBacktracking(n, graphEdges(n)), (s) => s, [4, 5, 6, 7, 8]) },
          { name: 'Greedy', data: runBenchmark((n) => graphColoringGreedy(n, graphEdges(n)), (s) => s, [4, 5, 6, 7, 8, 10, 12]) },
        ],
      },
      {
        title: 'Marketplace (String Search)',
        series: [
          { name: 'KMP', data: runBenchmark((n) => kmpSearch('a'.repeat(n) + 'b', 'ab'), (s) => s, [100, 500, 1000, 2000, 4000]) },
          { name: 'Naive', data: runBenchmark((n) => naiveSearch('a'.repeat(n) + 'b', 'ab'), (s) => s, [100, 500, 1000, 2000, 4000]) },
        ],
      },
      {
        title: 'Marketplace (Sorting)',
        series: [
          { name: 'Merge Sort', data: runBenchmark(mergeSort, (s) => Array.from({ length: s }, () => Math.random()), [100, 500, 1000, 2000, 4000]) },
          { name: 'Bubble Sort', data: runBenchmark(bubbleSort, (s) => Array.from({ length: s }, () => Math.random()), [100, 500, 1000, 2000, 4000]) },
        ],
      },
      {
        title: 'Network (Kruskal MST)',
        series: [
          { name: 'Kruskal', data: runBenchmark((n) => kruskal(n, kruskalEdges(n)), (s) => s, [5, 8, 10, 12, 15]) },
        ],
      },
    ];
  }, []);

  const COLORS = ['#4ade80', '#38bdf8', '#fbbf24', '#f87171'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-eco-200">Benchmark</h1>
        <p className="mt-1 text-eco-400">
          Runtime versus input size for every module. Brute-force variants are shown against their
          optimized counterparts so the complexity gap is visible.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {modules.map((m) => {
          const merged = m.series[0].data.map((d) => {
            const row: Record<string, number> = { size: d.size };
            m.series.forEach((s) => {
              const pt = s.data.find((p) => p.size === d.size);
              if (pt) row[s.name] = pt.timeMs;
            });
            return row;
          });
          return (
            <div key={m.title} className="card p-5">
              <h2 className="mb-3 text-lg font-semibold text-eco-200">{m.title}</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={merged} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a4030" />
                    <XAxis dataKey="size" stroke="#4ade80" fontSize={12} label={{ value: 'input size', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#4ade80' }} />
                    <YAxis stroke="#4ade80" fontSize={12} label={{ value: 'ms', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#4ade80' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0e2820', border: '1px solid #1a4030', borderRadius: 8, color: '#dcfce7' }} />
                    <Legend wrapperStyle={{ color: '#86efac' }} />
                    {m.series.map((s, i) => (
                      <Line key={s.name} type="monotone" dataKey={s.name} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        <h2 className="border-b border-night-700 px-5 py-3 text-lg font-semibold text-eco-200">
          Complexity reference
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-night-800 text-left text-eco-400">
              <tr>
                <th className="px-5 py-2 font-semibold">Algorithm</th>
                <th className="px-5 py-2 font-semibold">Time</th>
                <th className="px-5 py-2 font-semibold">Space</th>
                <th className="px-5 py-2 font-semibold">Best</th>
                <th className="px-5 py-2 font-semibold">Average</th>
                <th className="px-5 py-2 font-semibold">Worst</th>
              </tr>
            </thead>
            <tbody>
              {complexityTable.map((c) => (
                <tr key={c.name} className="border-t border-night-700">
                  <td className="px-5 py-2 font-medium text-eco-100">{c.name}</td>
                  <td className="px-5 py-2 text-eco-300">{c.time}</td>
                  <td className="px-5 py-2 text-eco-300">{c.space}</td>
                  <td className="px-5 py-2 text-eco-300">{c.best}</td>
                  <td className="px-5 py-2 text-eco-300">{c.average}</td>
                  <td className="px-5 py-2 text-eco-300">{c.worst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

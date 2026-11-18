import { GitBranch, CheckCircle2, XCircle, Info } from 'lucide-react';
import { complexityClasses } from '@/utils/benchmark';

const reductions = [
  { from: '3-SAT', to: 'Clique', note: 'Polynomial reduction — SAT instances map to graph cliques.' },
  { from: 'Clique', to: 'Vertex Cover', note: 'Complement graph transforms clique to vertex cover.' },
  { from: 'Vertex Cover', to: 'Subset Sum', note: 'Graph structure encoded as number selection.' },
  { from: 'Subset Sum', to: 'Knapsack', note: 'Weights = values, capacity = target — direct encoding.' },
];

export default function Complexity() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-eco-200">Complexity Classification</h1>
        <p className="mt-1 text-eco-400">
          Problem classes P, NP, NP-Hard, and NP-Complete — the foundation for understanding which
          algorithms in EcoLoop are tractable and which require heuristics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {complexityClasses.map((c) => (
          <div key={c.cls} className="card p-5">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-12 w-16 items-center justify-center rounded-lg bg-eco-600/15 text-lg font-bold text-eco-400">
                {c.cls}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-eco-100">{c.cls}</h3>
                <p className="text-sm text-eco-400">{c.desc}</p>
              </div>
            </div>
            <div className="mt-3 rounded-lg border border-night-700 bg-night-800 p-3 text-sm">
              <span className="text-eco-500">EcoLoop examples: </span>
              <span className="text-eco-200">{c.examples}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-eco-200">
          <GitBranch className="h-5 w-5 text-eco-400" /> NP-Completeness Reductions
        </h2>
        <p className="mb-4 text-sm text-eco-400">
          A problem is NP-Complete if every NP problem reduces to it in polynomial time. The chain
          below shows classic reductions — each arrow means "can be transformed into in poly-time."
        </p>
        <div className="space-y-3">
          {reductions.map((r, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-night-700 bg-night-800 p-3">
              <span className="rounded-lg bg-eco-600/15 px-3 py-1.5 font-mono text-sm font-semibold text-eco-300">{r.from}</span>
              <span className="text-eco-500">→</span>
              <span className="rounded-lg bg-eco-600/15 px-3 py-1.5 font-mono text-sm font-semibold text-eco-300">{r.to}</span>
              <span className="ml-auto text-xs text-eco-500">{r.note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <CheckCircle2 className="mb-2 h-6 w-6 text-eco-400" />
          <h3 className="font-semibold text-eco-100">Tractable (P)</h3>
          <p className="mt-1 text-sm text-eco-400">
            Sorting, MST, shortest path, LCS, MCM, OBST — solved optimally in polynomial time.
            EcoLoop uses these for route optimization, scheduling, and search.
          </p>
        </div>
        <div className="card p-5">
          <Info className="mb-2 h-6 w-6 text-amber-400" />
          <h3 className="font-semibold text-eco-100">NP (verifiable)</h3>
          <p className="mt-1 text-sm text-eco-400">
            TSP, Knapsack, Graph Coloring, N-Queens — solutions are quickly verified but finding
            them may be exponential. EcoLoop uses DP, heuristics, and backtracking.
          </p>
        </div>
        <div className="card p-5">
          <XCircle className="mb-2 h-6 w-6 text-red-400" />
          <h3 className="font-semibold text-eco-100">NP-Hard / NP-Complete</h3>
          <p className="mt-1 text-sm text-eco-400">
            No known polynomial algorithm. EcoLoop caps brute force and offers Held-Karp, greedy,
            and nearest-neighbor as practical alternatives.
          </p>
        </div>
      </div>
    </div>
  );
}

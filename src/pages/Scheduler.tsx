import { useState } from 'react';
import { Clock, Play, RotateCcw } from 'lucide-react';
import { graphColoringBacktracking } from '@/algorithms/scheduling/graphColoringBacktracking';
import { graphColoringGreedy } from '@/algorithms/scheduling/graphColoringGreedy';
import { industries, industryEdges } from '@/data/seed';

const SLOT_COLORS = ['#22c55e', '#0ea5e9', '#f59e0b', '#ef4444', '#a855f7', '#14b8a6'];

interface Run {
  name: string;
  slotsUsed: number;
  colors: number[];
  timeMs: number;
  operationsCount: number;
}

export default function Scheduler() {
  const edges = industryEdges();
  const n = industries.length;
  const [runs, setRuns] = useState<Run[]>([]);

  const runAll = () => {
    const bt = graphColoringBacktracking(n, edges);
    const gr = graphColoringGreedy(n, edges);
    setRuns([
      { name: 'Backtracking', slotsUsed: bt.result.slotsUsed, colors: bt.result.colors, timeMs: bt.timeMs, operationsCount: bt.operationsCount },
      { name: 'Greedy', slotsUsed: gr.result.slotsUsed, colors: gr.result.colors, timeMs: gr.timeMs, operationsCount: gr.operationsCount },
    ]);
  };

  const reset = () => setRuns([]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-eco-200">Scheduler</h1>
        <p className="mt-1 text-eco-400">
          Assign pickup time slots to six industries so that conflicting industries never share a
          slot. Modeled as graph coloring — backtracking finds the minimum, greedy is a fast
          heuristic.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 card p-5">
          <h2 className="mb-3 text-lg font-semibold text-eco-200">Industries &amp; conflicts</h2>
          <div className="space-y-2">
            {industries.map((ind) => (
              <div key={ind.id} className="flex flex-col gap-1 rounded-lg border border-night-700 bg-night-800/60 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-medium text-eco-100">{ind.name}</span>
                <span className="text-sm text-eco-400">
                  Conflicts: {ind.conflicts.map((c) => industries[c]?.name ?? '').join(', ') || '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card space-y-4 p-5">
          <h2 className="text-lg font-semibold text-eco-200">Run</h2>
          <p className="text-sm text-eco-400">
            {n} industries, {edges.length} conflict edges.
          </p>
          <button className="btn-primary w-full" onClick={runAll}>
            <Play className="h-4 w-4" /> Assign slots
          </button>
          {runs.length > 0 && (
            <button className="btn-secondary w-full" onClick={reset}>
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          )}
        </div>
      </div>

      {runs.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {runs.map((r) => (
            <div key={r.name} className="card p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-eco-200">{r.name}</h3>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-eco-600/15 px-3 py-1 text-sm font-semibold text-eco-400">
                  <Clock className="h-4 w-4" /> {r.slotsUsed} slot{r.slotsUsed !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {industries.map((ind, i) => (
                  <div key={ind.id} className="flex items-center justify-between">
                    <span className="text-sm text-eco-300">{ind.name}</span>
                    <span
                      className="rounded-full px-3 py-0.5 text-xs font-semibold text-white"
                      style={{ backgroundColor: SLOT_COLORS[r.colors[i] % SLOT_COLORS.length] }}
                    >
                      Slot {r.colors[i] + 1}
                    </span>
                  </div>
                ))}
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-night-800 p-2">
                  <dt className="text-eco-500">Time</dt>
                  <dd className="font-semibold text-eco-200">{r.timeMs.toFixed(3)} ms</dd>
                </div>
                <div className="rounded-lg bg-night-800 p-2">
                  <dt className="text-eco-500">Operations</dt>
                  <dd className="font-semibold text-eco-200">{r.operationsCount}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

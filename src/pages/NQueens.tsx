import { useState } from 'react';
import { Play, RotateCcw, Crown } from 'lucide-react';
import { nQueens } from '@/algorithms/backtracking/nQueens';

export default function NQueens() {
  const [n, setN] = useState(8);
  const [solution, setSolution] = useState<number[] | null>(null);
  const [allSolutions, setAllSolutions] = useState<number[][]>([]);
  const [count, setCount] = useState(0);
  const [timeMs, setTimeMs] = useState(0);
  const [ops, setOps] = useState(0);
  const [viewIdx, setViewIdx] = useState(0);

  const run = () => {
    if (n > 12) {
      alert('N > 12 may freeze the browser. Capping at 12.');
      setN(12);
      return;
    }
    const out = nQueens(n);
    setSolution(out.result.board);
    setAllSolutions(out.result.solutions);
    setCount(out.result.count);
    setTimeMs(out.timeMs);
    setOps(out.operationsCount);
    setViewIdx(0);
  };

  const reset = () => {
    setSolution(null);
    setAllSolutions([]);
    setCount(0);
    setTimeMs(0);
    setOps(0);
    setViewIdx(0);
  };

  const currentBoard = allSolutions.length > 0 ? allSolutions[viewIdx] : solution;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-eco-200">N-Queens Problem</h1>
        <p className="mt-1 text-eco-400">
          Place N queens on an N×N chessboard so that no two queens attack each other — a classic
          backtracking problem.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 card p-5">
          {currentBoard && currentBoard[0] !== -1 ? (
            <div className="inline-block">
              {currentBoard.map((col, row) => (
                <div key={row} className="flex">
                  {Array.from({ length: n }, (_, c) => (
                    <div
                      key={c}
                      className={`flex h-9 w-9 items-center justify-center border border-night-700 text-sm ${
                        (row + c) % 2 === 0 ? 'bg-night-800' : 'bg-night-850'
                      }`}
                    >
                      {c === col && <Crown className="h-5 w-5 text-eco-400" />}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-eco-500">
              Run the algorithm to see a solution.
            </div>
          )}
        </div>

        <div className="card space-y-4 p-5">
          <div>
            <label className="label">Board size (N)</label>
            <input
              className="input"
              type="number"
              min={4}
              max={12}
              value={n}
              onChange={(e) => setN(Math.max(4, Math.min(12, Number(e.target.value))))}
            />
          </div>
          <div className="flex gap-2">
            <button className="btn-primary flex-1" onClick={run}>
              <Play className="h-4 w-4" /> Solve
            </button>
            {solution && (
              <button className="btn-secondary" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
          {allSolutions.length > 1 && (
            <div>
              <label className="label">Solution {viewIdx + 1} of {allSolutions.length}</label>
              <input
                type="range"
                min={0}
                max={allSolutions.length - 1}
                value={viewIdx}
                onChange={(e) => setViewIdx(Number(e.target.value))}
                className="w-full accent-eco-500"
              />
            </div>
          )}
          {solution && (
            <div className="space-y-2 rounded-lg border border-night-700 bg-night-800 p-4 text-sm">
              <div className="flex justify-between"><span className="text-eco-500">Solutions found</span><span className="font-semibold text-eco-200">{count}</span></div>
              <div className="flex justify-between"><span className="text-eco-500">Time</span><span className="font-semibold text-eco-200">{timeMs.toFixed(3)} ms</span></div>
              <div className="flex justify-between"><span className="text-eco-500">Operations</span><span className="font-semibold text-eco-200">{ops}</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

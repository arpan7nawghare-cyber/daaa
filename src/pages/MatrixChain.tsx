import { useState } from 'react';
import { Play, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { matrixChainMultiplication } from '@/algorithms/dp/matrixChainMultiplication';

export default function MatrixChain() {
  const [dims, setDims] = useState<number[]>([10, 20, 30, 40, 30]);
  const [newDim, setNewDim] = useState('');
  const [result, setResult] = useState<{ minCost: number; order: string } | null>(null);
  const [timeMs, setTimeMs] = useState(0);
  const [ops, setOps] = useState(0);

  const addDim = () => {
    const d = parseInt(newDim);
    if (!isNaN(d) && d > 0) {
      setDims([...dims, d]);
      setNewDim('');
    }
  };
  const removeDim = (i: number) => setDims(dims.filter((_, idx) => idx !== i));
  const reset = () => { setResult(null); setTimeMs(0); setOps(0); };

  const run = () => {
    const out = matrixChainMultiplication(dims);
    setResult({ minCost: out.result.minCost, order: out.result.order });
    setTimeMs(out.timeMs);
    setOps(out.operationsCount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-eco-200">Matrix Chain Multiplication</h1>
        <p className="mt-1 text-eco-400">
          Find the minimum-cost parenthesization for multiplying a chain of matrices using dynamic
          programming. Each pair of dimensions defines one matrix.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 card p-5">
          <h2 className="mb-3 text-lg font-semibold text-eco-200">Dimensions ({dims.length} values → {Math.max(0, dims.length - 1)} matrices)</h2>
          <div className="flex flex-wrap gap-2">
            {dims.map((d, i) => (
              <div key={i} className="inline-flex items-center gap-1 rounded-lg border border-night-700 bg-night-800 px-3 py-1.5">
                <span className="font-mono text-sm text-eco-200">{d}</span>
                {dims.length > 2 && (
                  <button onClick={() => removeDim(i)} className="text-eco-600 hover:text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input className="input flex-1" type="number" value={newDim} onChange={(e) => setNewDim(e.target.value)} placeholder="Add dimension" />
            <button className="btn-secondary" onClick={addDim}><Plus className="h-4 w-4" /></button>
          </div>
          {dims.length >= 2 && (
            <p className="mt-3 text-sm text-eco-400">
              Matrices: {dims.slice(0, -1).map((d, i) => `M${i + 1}(${d}×${dims[i + 1]})`).join(', ')}
            </p>
          )}
        </div>

        <div className="card space-y-4 p-5">
          <h2 className="text-lg font-semibold text-eco-200">Run</h2>
          <div className="flex gap-2">
            <button className="btn-primary flex-1" onClick={run} disabled={dims.length < 2}>
              <Play className="h-4 w-4" /> Compute
            </button>
            {result && <button className="btn-secondary" onClick={reset}><RotateCcw className="h-4 w-4" /></button>}
          </div>
          {result && (
            <div className="space-y-3 rounded-lg border border-night-700 bg-night-800 p-4">
              <div>
                <div className="text-xs text-eco-500">Minimum multiplications</div>
                <div className="text-2xl font-bold text-eco-400">{result.minCost.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <div className="text-xs text-eco-500">Optimal order</div>
                <div className="mt-1 font-mono text-sm text-eco-200">{result.order}</div>
              </div>
              <div className="flex justify-between text-sm border-t border-night-700 pt-2">
                <span className="text-eco-500">Time: <span className="font-semibold text-eco-200">{timeMs.toFixed(3)} ms</span></span>
                <span className="text-eco-500">Ops: <span className="font-semibold text-eco-200">{ops}</span></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

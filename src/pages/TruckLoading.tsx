import { useState } from 'react';
import { Plus, Trash2, Package, CheckCircle2 } from 'lucide-react';
import { knapsackDP } from '@/algorithms/packing/knapsackDP';
import { knapsackGreedy } from '@/algorithms/packing/knapsackGreedy';
import { knapsackBruteForce } from '@/algorithms/packing/knapsackBruteForce';
import type { KnapsackItem } from '@/algorithms/packing/knapsackDP';
import { truckItems } from '@/data/seed';

interface Run {
  name: string;
  totalValue: number;
  selected: number[];
  timeMs: number;
  operationsCount: number;
}

export default function TruckLoading() {
  const [items, setItems] = useState<KnapsackItem[]>(truckItems);
  const [capacity, setCapacity] = useState(120);
  const [newName, setNewName] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [newValue, setNewValue] = useState('');
  const [runs, setRuns] = useState<Run[]>([]);
  const [warning, setWarning] = useState('');

  const addItem = () => {
    const w = parseFloat(newWeight);
    const v = parseFloat(newValue);
    if (!newName.trim() || isNaN(w) || isNaN(v) || w <= 0 || v <= 0) return;
    setItems([...items, { name: newName.trim(), weight: w, value: v }]);
    setNewName('');
    setNewWeight('');
    setNewValue('');
  };

  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const resetItems = () => {
    setItems(truckItems);
    setRuns([]);
    setWarning('');
  };

  const runAll = () => {
    let warn = '';
    if (items.length > 20) warn = `Brute force skipped (cap 20, you have ${items.length}).`;
    setWarning(warn);

    const out: Run[] = [];
    const dp = knapsackDP(items, capacity);
    out.push({ name: 'DP', totalValue: dp.result.totalValue, selected: dp.result.selected, timeMs: dp.timeMs, operationsCount: dp.operationsCount });
    const gr = knapsackGreedy(items, capacity);
    out.push({ name: 'Greedy', totalValue: gr.result.totalValue, selected: gr.result.selected, timeMs: gr.timeMs, operationsCount: gr.operationsCount });
    if (items.length <= 20) {
      const bf = knapsackBruteForce(items, capacity);
      out.push({ name: 'Brute Force', totalValue: bf.result.totalValue, selected: bf.result.selected, timeMs: bf.timeMs, operationsCount: bf.operationsCount });
    }
    setRuns(out);
  };

  const selectedWeight = (r: Run) =>
    r.selected.reduce((s, idx) => s + (items[idx]?.weight ?? 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-eco-200">Truck Loading</h1>
        <p className="mt-1 text-eco-400">
          Pick the most valuable combination of e-waste and industrial items to fit a truck's weight
          capacity. Compares DP, greedy, and brute-force knapsack.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-eco-200">Items</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-eco-400">{items.length} items</span>
              <button className="btn-secondary" onClick={resetItems}>Reset</button>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-night-700">
            <table className="w-full text-sm">
              <thead className="bg-night-800 text-left text-eco-400">
                <tr>
                  <th className="px-4 py-2 font-semibold">Name</th>
                  <th className="px-4 py-2 font-semibold">Weight (kg)</th>
                  <th className="px-4 py-2 font-semibold">Value (₹)</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i} className="border-t border-night-700">
                    <td className="px-4 py-2 font-medium text-eco-100">{it.name}</td>
                    <td className="px-4 py-2 text-eco-300">{it.weight}</td>
                    <td className="px-4 py-2 text-eco-300">{it.value.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2 text-right">
                      <button onClick={() => removeItem(i)} className="text-eco-600 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card space-y-4 p-5">
          <h2 className="text-lg font-semibold text-eco-200">Add item</h2>
          <div>
            <label className="label">Name</label>
            <input className="input" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Server PSU" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Weight (kg)</label>
              <input className="input" type="number" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} />
            </div>
            <div>
              <label className="label">Value (₹)</label>
              <input className="input" type="number" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
            </div>
          </div>
          <button className="btn-secondary w-full" onClick={addItem}>
            <Plus className="h-4 w-4" /> Add item
          </button>
          <div>
            <label className="label">Truck capacity (kg)</label>
            <input
              className="input"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Math.max(1, Number(e.target.value)))}
            />
          </div>
          <button className="btn-primary w-full" onClick={runAll}>
            <Package className="h-4 w-4" /> Compare algorithms
          </button>
          {warning && (
            <p className="rounded-lg border border-amber-700/40 bg-amber-900/20 p-2 text-xs text-amber-300">{warning}</p>
          )}
        </div>
      </div>

      {runs.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {runs.map((r) => {
            const w = selectedWeight(r);
            const pct = Math.min(100, (w / capacity) * 100);
            return (
              <div key={r.name} className="card p-5">
                <h3 className="text-lg font-semibold text-eco-200">{r.name}</h3>
                <div className="mt-2 text-3xl font-bold text-eco-400">₹{r.totalValue.toLocaleString('en-IN')}</div>
                <p className="text-sm text-eco-500">total value recovered</p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-eco-400">
                    <span>{w.toFixed(1)} kg used</span>
                    <span>{capacity} kg cap</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-night-700">
                    <div className="h-full rounded-full bg-eco-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {r.selected.map((idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-sm text-eco-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-eco-500" />
                      {items[idx]?.name ?? `#${idx}`}
                    </div>
                  ))}
                </div>
                <dl className="mt-4 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-eco-500">Time</dt>
                    <dd className="font-medium text-eco-200">{r.timeMs.toFixed(3)} ms</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-eco-500">Operations</dt>
                    <dd className="font-medium text-eco-200">{r.operationsCount}</dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Shuffle, AlertTriangle, MapPin, Trash2, Play } from 'lucide-react';
import { tspBruteForce } from '@/algorithms/routing/tspBruteForce';
import { tspHeldKarp } from '@/algorithms/routing/tspHeldKarp';
import { tspNearestNeighbor } from '@/algorithms/routing/tspNearestNeighbor';

interface Pt {
  x: number;
  y: number;
}

const W = 600;
const H = 420;
const BRUTE_CAP = 9;
const HK_CAP = 15;

type AlgoKey = 'nearestNeighbor' | 'heldKarp' | 'bruteForce';
const ALGOS: { key: AlgoKey; label: string }[] = [
  { key: 'nearestNeighbor', label: 'Nearest Neighbor' },
  { key: 'heldKarp', label: 'Held-Karp (DP)' },
  { key: 'bruteForce', label: 'Brute Force' },
];

function euclideanDistMatrix(pts: Pt[]): number[][] {
  const n = pts.length;
  const m: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      m[i][j] = d;
      m[j][i] = d;
    }
  }
  return m;
}

export default function RouteOptimizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Pt[]>([]);
  const [algo, setAlgo] = useState<AlgoKey>('nearestNeighbor');
  const [comparison, setComparison] = useState<
    { name: string; cost: number; timeMs: number; operationsCount: number }[]
  >([]);
  const [bestPath, setBestPath] = useState<number[]>([]);
  const [warning, setWarning] = useState<string>('');

  const dist = useMemo(() => euclideanDistMatrix(points), [points]);

  const draw = (pts: Pt[], path: number[] = []) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0b1f17';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#133327';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y <= H; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    if (path.length > 1) {
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      path.forEach((idx, i) => {
        const p = pts[idx];
        if (!p) return;
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      if (pts[path[0]]) ctx.lineTo(pts[path[0]].x, pts[path[0]].y);
      ctx.stroke();
    }
    pts.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? '#16a34a' : '#22c55e';
      ctx.fill();
      ctx.strokeStyle = '#0b1f17';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#bbf7d0';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(String(i + 1), p.x + 10, p.y - 8);
    });
  };

  useEffect(() => {
    draw(points, bestPath);
  }, [points, bestPath]);

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    setPoints([...points, { x, y }]);
  };

  const randomPoints = () => {
    const n = 7;
    const pts: Pt[] = Array.from({ length: n }, () => ({
      x: Math.random() * (W - 60) + 30,
      y: Math.random() * (H - 60) + 30,
    }));
    setPoints(pts);
    setBestPath([]);
    setComparison([]);
    setWarning('');
  };

  const runSingle = () => {
    if (points.length < 2) return;
    let warn = '';
    if (algo === 'bruteForce' && points.length > BRUTE_CAP) {
      warn = `Brute force is capped at ${BRUTE_CAP} points (you have ${points.length}).`;
    }
    if (algo === 'heldKarp' && points.length > HK_CAP) {
      warn = `Held-Karp is capped at ${HK_CAP} points (you have ${points.length}).`;
    }
    setWarning(warn);
    const fn = { nearestNeighbor: tspNearestNeighbor, heldKarp: tspHeldKarp, bruteForce: tspBruteForce }[algo];
    const out = fn(dist);
    setBestPath(out.result.path);
  };

  const compareAll = () => {
    if (points.length < 2) return;
    let warn = '';
    if (points.length > BRUTE_CAP) warn = `Brute force skipped (cap ${BRUTE_CAP}, you have ${points.length}).`;
    if (!warn && points.length > HK_CAP) warn = `Held-Karp skipped (cap ${HK_CAP}, you have ${points.length}).`;
    setWarning(warn);

    const rows: typeof comparison = [];
    const nn = tspNearestNeighbor(dist);
    rows.push({ name: 'Nearest Neighbor', cost: nn.result.cost, timeMs: nn.timeMs, operationsCount: nn.operationsCount });
    if (points.length <= HK_CAP) {
      const hk = tspHeldKarp(dist);
      rows.push({ name: 'Held-Karp', cost: hk.result.cost, timeMs: hk.timeMs, operationsCount: hk.operationsCount });
    }
    if (points.length <= BRUTE_CAP) {
      const bf = tspBruteForce(dist);
      rows.push({ name: 'Brute Force', cost: bf.result.cost, timeMs: bf.timeMs, operationsCount: bf.operationsCount });
    }
    setComparison(rows);
    const best = rows.reduce((a, b) => (b.cost < a.cost ? b : a), rows[0]);
    const idx = ALGOS.findIndex((a) => a.label === best.name);
    const path = [tspNearestNeighbor, tspHeldKarp, tspBruteForce][idx]?.(dist).result.path ?? [];
    setBestPath(path);
  };

  const clearAll = () => {
    setPoints([]);
    setBestPath([]);
    setComparison([]);
    setWarning('');
  };

  const undoLast = () => {
    setPoints(points.slice(0, -1));
    setBestPath([]);
    setComparison([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-eco-200">Route Optimizer</h1>
        <p className="mt-1 text-eco-400">
          Click the canvas to add collection points, then compare TSP algorithms. The distance
          matrix is built from Euclidean distance between points.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card p-4">
            <canvas
              ref={canvasRef}
              width={W}
              height={H}
              onClick={onCanvasClick}
              className="w-full cursor-crosshair rounded-xl"
              style={{ aspectRatio: `${W}/${H}` }}
            />
            <p className="mt-2 flex items-center gap-1.5 text-xs text-eco-400">
              <MapPin className="h-3.5 w-3.5" /> {points.length} point{points.length !== 1 ? 's' : ''} placed
            </p>
          </div>
        </div>

        <div className="card space-y-4 p-5">
          <div>
            <label className="label">Algorithm</label>
            <select className="input" value={algo} onChange={(e) => setAlgo(e.target.value as AlgoKey)}>
              {ALGOS.map((a) => (
                <option key={a.key} value={a.key}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" onClick={runSingle} disabled={points.length < 2}>
              <Play className="h-4 w-4" /> Run
            </button>
            <button className="btn-secondary" onClick={compareAll} disabled={points.length < 2}>
              Compare All
            </button>
            <button className="btn-secondary" onClick={randomPoints}>
              <Shuffle className="h-4 w-4" /> Random
            </button>
            <button className="btn-secondary" onClick={undoLast} disabled={points.length === 0}>
              Undo
            </button>
            <button className="btn-secondary" onClick={clearAll}>
              <Trash2 className="h-4 w-4" /> Clear
            </button>
          </div>
          {warning && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-700/40 bg-amber-900/20 p-3 text-sm text-amber-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {warning}
            </div>
          )}
        </div>
      </div>

      {comparison.length > 0 && (
        <div className="card overflow-hidden">
          <h2 className="border-b border-night-700 px-5 py-3 text-lg font-semibold text-eco-200">
            Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-night-800 text-left text-eco-400">
                <tr>
                  <th className="px-5 py-2 font-semibold">Algorithm</th>
                  <th className="px-5 py-2 font-semibold">Route length</th>
                  <th className="px-5 py-2 font-semibold">Time (ms)</th>
                  <th className="px-5 py-2 font-semibold">Operations</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((r) => (
                  <tr key={r.name} className="border-t border-night-700">
                    <td className="px-5 py-2 font-medium text-eco-100">{r.name}</td>
                    <td className="px-5 py-2 text-eco-300">{r.cost.toFixed(2)}</td>
                    <td className="px-5 py-2 text-eco-300">{r.timeMs.toFixed(3)}</td>
                    <td className="px-5 py-2 text-eco-300">{r.operationsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

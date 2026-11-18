import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, MapPin } from 'lucide-react';
import { dijkstra } from '@/algorithms/network/dijkstra';
import { bellmanFord } from '@/algorithms/network/bellmanFord';
import { sites, siteEdges } from '@/data/seed';

const W = 600;
const H = 460;

export default function ShortestPath() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [source, setSource] = useState(0);
  const [dijResult, setDijResult] = useState<{ dist: number[]; paths: number[][]; timeMs: number; ops: number } | null>(null);
  const [bfResult, setBfResult] = useState<{ dist: number[]; paths: number[][]; hasNegativeCycle: boolean; timeMs: number; ops: number } | null>(null);
  const [highlightPath, setHighlightPath] = useState<number[]>([]);

  const draw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0b1f17';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#133327';
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    const sx = (x: number) => (x / 100) * (W - 60) + 30;
    const sy = (y: number) => (y / 100) * (H - 60) + 30;

    ctx.strokeStyle = '#1a4030';
    ctx.lineWidth = 1;
    siteEdges().forEach((e) => {
      const a = sites[e.u], b = sites[e.v];
      if (!a || !b) return;
      ctx.beginPath(); ctx.moveTo(sx(a.x), sy(a.y)); ctx.lineTo(sx(b.x), sy(b.y)); ctx.stroke();
    });

    if (highlightPath.length > 1) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      highlightPath.forEach((idx, i) => {
        const p = sites[idx];
        if (!p) return;
        if (i === 0) ctx.moveTo(sx(p.x), sy(p.y));
        else ctx.lineTo(sx(p.x), sy(p.y));
      });
      ctx.stroke();
    }

    sites.forEach((s, i) => {
      ctx.beginPath();
      ctx.arc(sx(s.x), sy(s.y), 7, 0, Math.PI * 2);
      ctx.fillStyle = i === source ? '#0ea5e9' : '#22c55e';
      ctx.fill();
      ctx.strokeStyle = '#0b1f17';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#dcfce7';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(s.name, sx(s.x) + 9, sy(s.y) - 7);
    });
  };

  useEffect(() => { draw(); }, [source, highlightPath]);

  const run = () => {
    const dOut = dijkstra(sites.length, siteEdges(), source);
    const bOut = bellmanFord(sites.length, siteEdges(), source);
    setDijResult({ dist: dOut.result.dist, paths: dOut.result.paths, timeMs: dOut.timeMs, ops: dOut.operationsCount });
    setBfResult({ dist: bOut.result.dist, paths: bOut.result.paths, hasNegativeCycle: bOut.result.hasNegativeCycle, timeMs: bOut.timeMs, ops: bOut.operationsCount });
    setHighlightPath([]);
  };

  const reset = () => { setDijResult(null); setBfResult(null); setHighlightPath([]); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-eco-200">Shortest Path</h1>
        <p className="mt-1 text-eco-400">
          Compute single-source shortest paths from a collection site to all others. Dijkstra handles
          non-negative weights; Bellman-Ford also detects negative cycles.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 card p-4">
          <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-xl" style={{ aspectRatio: `${W}/${H}` }} />
        </div>
        <div className="card space-y-4 p-5">
          <div>
            <label className="label">Source site</label>
            <select className="input" value={source} onChange={(e) => setSource(Number(e.target.value))}>
              {sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button className="btn-primary flex-1" onClick={run}><Play className="h-4 w-4" /> Run both</button>
            {dijResult && <button className="btn-secondary" onClick={reset}><RotateCcw className="h-4 w-4" /></button>}
          </div>
          {dijResult && (
            <div className="space-y-2 rounded-lg border border-night-700 bg-night-800 p-4 text-sm">
              <div className="flex justify-between"><span className="text-eco-500">Dijkstra time</span><span className="font-semibold text-eco-200">{dijResult.timeMs.toFixed(3)} ms</span></div>
              <div className="flex justify-between"><span className="text-eco-500">Dijkstra ops</span><span className="font-semibold text-eco-200">{dijResult.ops}</span></div>
              <div className="flex justify-between"><span className="text-eco-500">Bellman-Ford time</span><span className="font-semibold text-eco-200">{bfResult?.timeMs.toFixed(3)} ms</span></div>
              <div className="flex justify-between"><span className="text-eco-500">Bellman-Ford ops</span><span className="font-semibold text-eco-200">{bfResult?.ops}</span></div>
              {bfResult?.hasNegativeCycle && <div className="text-red-400 text-xs">Negative cycle detected!</div>}
            </div>
          )}
        </div>
      </div>

      {dijResult && (
        <div className="grid gap-4 md:grid-cols-2">
          {sites.map((s) => (
            <div key={s.id} className="card flex items-center justify-between p-4">
              <div>
                <div className="font-medium text-eco-100">{s.name}</div>
                <div className="text-xs text-eco-500">Path: {dijResult.paths[s.id].map((p) => sites[p]?.name).join(' → ') || '—'}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-eco-400">{dijResult.dist[s.id] === Infinity ? '∞' : dijResult.dist[s.id]}</span>
                <button
                  className="btn-secondary"
                  onClick={() => setHighlightPath(dijResult.paths[s.id])}
                  title="Show path on map"
                >
                  <MapPin className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

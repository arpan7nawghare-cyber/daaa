import { useEffect, useRef, useState } from 'react';
import { Network as NetworkIcon, Play, RotateCcw } from 'lucide-react';
import { kruskal } from '@/algorithms/network/kruskal';
import { sites, siteEdges } from '@/data/seed';
import type { KruskalEdge } from '@/algorithms/network/kruskal';

const W = 600;
const H = 460;

export default function Network() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mst, setMst] = useState<{ edges: KruskalEdge[]; totalWeight: number } | null>(null);
  const [timeMs, setTimeMs] = useState(0);
  const [ops, setOps] = useState(0);

  const draw = (mstEdges: KruskalEdge[] | null) => {
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

    const sx = (x: number) => (x / 100) * (W - 60) + 30;
    const sy = (y: number) => (y / 100) * (H - 60) + 30;

    ctx.strokeStyle = '#1a4030';
    ctx.lineWidth = 1;
    siteEdges().forEach((e) => {
      const a = sites[e.u];
      const b = sites[e.v];
      if (!a || !b) return;
      ctx.beginPath();
      ctx.moveTo(sx(a.x), sy(a.y));
      ctx.lineTo(sx(b.x), sy(b.y));
      ctx.stroke();
    });

    if (mstEdges) {
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 3;
      mstEdges.forEach((e) => {
        const a = sites[e.u];
        const b = sites[e.v];
        if (!a || !b) return;
        ctx.beginPath();
        ctx.moveTo(sx(a.x), sy(a.y));
        ctx.lineTo(sx(b.x), sy(b.y));
        ctx.stroke();
      });
    }

    sites.forEach((s, i) => {
      ctx.beginPath();
      ctx.arc(sx(s.x), sy(s.y), 7, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? '#16a34a' : '#22c55e';
      ctx.fill();
      ctx.strokeStyle = '#0b1f17';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#dcfce7';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(s.name, sx(s.x) + 9, sy(s.y) - 7);
    });
  };

  useEffect(() => {
    draw(mst?.edges ?? null);
  }, [mst]);

  const run = () => {
    const out = kruskal(sites.length, siteEdges());
    setMst({ edges: out.result.edges, totalWeight: out.result.totalWeight });
    setTimeMs(out.timeMs);
    setOps(out.operationsCount);
  };

  const reset = () => {
    setMst(null);
    setTimeMs(0);
    setOps(0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-eco-200">Collection Network</h1>
        <p className="mt-1 text-eco-400">
          Twelve seeded collection sites — from IT depots to transformer plants and scrap yards —
          are connected at minimum cost using Kruskal's minimum spanning tree. Bold green links form
          the MST; faint links are candidate connections.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 card p-4">
          <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-xl" style={{ aspectRatio: `${W}/${H}` }} />
        </div>
        <div className="card space-y-4 p-5">
          <h2 className="text-lg font-semibold text-eco-200">MST</h2>
          <p className="text-sm text-eco-400">{sites.length} sites, {siteEdges().length} candidate edges.</p>
          <div className="flex gap-2">
            <button className="btn-primary flex-1" onClick={run}>
              <Play className="h-4 w-4" /> Run Kruskal
            </button>
            {mst && (
              <button className="btn-secondary" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
          {mst && (
            <div className="space-y-3 rounded-lg border border-night-700 bg-night-800 p-4">
              <div className="flex items-center gap-2 text-eco-300">
                <NetworkIcon className="h-4 w-4" />
                <span className="font-semibold">{mst.edges.length} MST edges</span>
              </div>
              <div className="text-2xl font-bold text-eco-400">{mst.totalWeight.toFixed(1)}</div>
              <p className="text-xs text-eco-500">total connection cost</p>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-eco-500">Time</dt>
                  <dd className="font-semibold text-eco-200">{timeMs.toFixed(3)} ms</dd>
                </div>
                <div>
                  <dt className="text-eco-500">Operations</dt>
                  <dd className="font-semibold text-eco-200">{ops}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>

      {mst && (
        <div className="card overflow-hidden">
          <h2 className="border-b border-night-700 px-5 py-3 text-lg font-semibold text-eco-200">
            MST connections
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-night-800 text-left text-eco-400">
                <tr>
                  <th className="px-5 py-2 font-semibold">From</th>
                  <th className="px-5 py-2 font-semibold">To</th>
                  <th className="px-5 py-2 font-semibold">Cost</th>
                </tr>
              </thead>
              <tbody>
                {mst.edges.map((e, i) => (
                  <tr key={i} className="border-t border-night-700">
                    <td className="px-5 py-2 font-medium text-eco-100">{sites[e.u]?.name}</td>
                    <td className="px-5 py-2 font-medium text-eco-100">{sites[e.v]?.name}</td>
                    <td className="px-5 py-2 text-eco-300">{e.w}</td>
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

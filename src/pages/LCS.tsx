import { useState } from 'react';
import { Play, RotateCcw, GitCompare } from 'lucide-react';
import { longestCommonSubsequence } from '@/algorithms/dp/longestCommonSubsequence';

export default function LCS() {
  const [s1, setS1] = useState('AGGTAB');
  const [s2, setS2] = useState('GXTXAYB');
  const [result, setResult] = useState<{ length: number; subsequence: string } | null>(null);
  const [timeMs, setTimeMs] = useState(0);
  const [ops, setOps] = useState(0);

  const run = () => {
    const out = longestCommonSubsequence(s1, s2);
    setResult({ length: out.result.length, subsequence: out.result.subsequence });
    setTimeMs(out.timeMs);
    setOps(out.operationsCount);
  };

  const reset = () => { setResult(null); setTimeMs(0); setOps(0); };

  const highlight = (s: string, sub: string) => {
    if (!sub) return s;
    const chars: { c: string; inSub: boolean }[] = [];
    let si = 0;
    for (const c of s) {
      if (si < sub.length && c === sub[si]) {
        chars.push({ c, inSub: true });
        si++;
      } else {
        chars.push({ c, inSub: false });
      }
    }
    return chars;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-eco-200">Longest Common Subsequence</h1>
        <p className="mt-1 text-eco-400">
          Find the longest sequence of characters appearing in the same order in both strings (not
          necessarily contiguous) using dynamic programming.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 card p-5">
          <div className="space-y-4">
            <div>
              <label className="label">String 1</label>
              <input className="input font-mono" value={s1} onChange={(e) => setS1(e.target.value)} />
            </div>
            <div>
              <label className="label">String 2</label>
              <input className="input font-mono" value={s2} onChange={(e) => setS2(e.target.value)} />
            </div>
          </div>

          {result && (
            <div className="mt-6 space-y-3">
              <div className="text-xs text-eco-500">Matched characters highlighted:</div>
              <div className="space-y-2 font-mono text-lg">
                <div className="flex gap-0.5">
                  {highlight(s1, result.subsequence).map((ch, i) => (
                    <span key={i} className={ch.inSub ? 'rounded bg-eco-600/30 px-1 text-eco-300' : 'px-1 text-eco-500'}>{ch.c}</span>
                  ))}
                </div>
                <div className="flex gap-0.5">
                  {highlight(s2, result.subsequence).map((ch, i) => (
                    <span key={i} className={ch.inSub ? 'rounded bg-eco-600/30 px-1 text-eco-300' : 'px-1 text-eco-500'}>{ch.c}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card space-y-4 p-5">
          <h2 className="text-lg font-semibold text-eco-200">Run</h2>
          <div className="flex gap-2">
            <button className="btn-primary flex-1" onClick={run} disabled={!s1 || !s2}>
              <Play className="h-4 w-4" /> Find LCS
            </button>
            {result && <button className="btn-secondary" onClick={reset}><RotateCcw className="h-4 w-4" /></button>}
          </div>
          {result && (
            <div className="space-y-3 rounded-lg border border-night-700 bg-night-800 p-4">
              <div className="flex items-center gap-2 text-eco-400">
                <GitCompare className="h-4 w-4" />
                <span className="text-xs">LCS length</span>
              </div>
              <div className="text-2xl font-bold text-eco-400">{result.length}</div>
              <div>
                <div className="text-xs text-eco-500">Subsequence</div>
                <div className="font-mono text-lg text-eco-200">{result.subsequence || '—'}</div>
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

import { useMemo, useState } from 'react';
import { Search, ShoppingCart, Trash2, ShieldCheck, AlertTriangle, X, CheckCircle2, Filter } from 'lucide-react';
import { kmpSearch } from '@/algorithms/marketplace/kmpSearch';
import { naiveSearch } from '@/algorithms/marketplace/naiveSearch';
import { mergeSort } from '@/algorithms/marketplace/mergeSort';
import { bubbleSort } from '@/algorithms/marketplace/bubbleSort';
import { listings, HAZARDOUS_CATEGORIES, LISTING_CATEGORIES } from '@/data/seed';
import type { Listing } from '@/data/seed';

type SortKey = 'price' | 'condition';
type SortAlgo = 'merge' | 'bubble';

const CONDITION_ORDER: Record<string, number> = { A: 1, B: 2, C: 3 };

export default function Marketplace() {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('price');
  const [sortAlgo, setSortAlgo] = useState<SortAlgo>('merge');
  const [cart, setCart] = useState<Listing[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [category, setCategory] = useState<string>('All');
  const [searchInfo, setSearchInfo] = useState<{ algo: string; count: number; timeMs: number; ops: number } | null>(null);
  const [checkedOut, setCheckedOut] = useState(false);

  const filtered = useMemo(() => {
    const byCategory = category === 'All' ? listings : listings.filter((l) => l.category === category);

    if (!query.trim()) {
      setSearchInfo(null);
      return byCategory;
    }
    const hay = byCategory.map((l) => `${l.title} ${l.category}`.toLowerCase()).join('|');
    const pat = query.toLowerCase();
    const kmp = kmpSearch(hay, pat);
    const naive = naiveSearch(hay, pat);
    setSearchInfo({
      algo: 'KMP vs Naive',
      count: kmp.result.length,
      timeMs: kmp.timeMs + naive.timeMs,
      ops: kmp.operationsCount + naive.operationsCount,
    });
    return byCategory.filter((l) => `${l.title} ${l.category}`.toLowerCase().includes(pat));
  }, [query, category]);

  const sorted = useMemo(() => {
    const values = filtered.map((l) => (sortKey === 'price' ? l.price : CONDITION_ORDER[l.condition]));
    const sorter = sortAlgo === 'merge' ? mergeSort : bubbleSort;
    const out = sorter(values);
    const used = new Set<number>();
    return out.result.map((v) => {
      const idx = filtered.findIndex((l, i) => {
        if (used.has(i)) return false;
        const lv = sortKey === 'price' ? l.price : CONDITION_ORDER[l.condition];
        return lv === v;
      });
      if (idx >= 0) used.add(idx);
      return filtered[idx];
    });
  }, [filtered, sortKey, sortAlgo]);

  const addToCart = (l: Listing) => setCart([...cart, l]);
  const removeFromCart = (i: number) => setCart(cart.filter((_, idx) => idx !== i));
  const clearCart = () => setCart([]);
  const checkout = () => {
    setCheckedOut(true);
    setCart([]);
    setTimeout(() => setCheckedOut(false), 3000);
  };
  const cartTotal = cart.reduce((s, l) => s + l.price, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-eco-200">Marketplace</h1>
          <p className="mt-1 text-eco-400">
            Browse refurbished electronics and industrial scrap. Search with KMP, sort by price or
            condition. Hazardous items are blocked.
          </p>
        </div>
        <button className="btn-secondary relative" onClick={() => setShowCart(true)}>
          <ShoppingCart className="h-4 w-4" /> Cart ({cart.length})
        </button>
      </div>

      {checkedOut && (
        <div className="flex items-center gap-2 rounded-lg border border-eco-600/40 bg-eco-600/10 p-3 text-sm text-eco-300">
          <CheckCircle2 className="h-4 w-4 text-eco-400" /> Order placed successfully! Your items will be processed for refurbishment.
        </div>
      )}

      <div className="card flex flex-wrap items-end gap-4 p-5">
        <div className="flex-1 min-w-[200px]">
          <label className="label">Search (KMP)</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-eco-600" />
            <input
              className="input pl-9"
              placeholder="Search title or category…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="label"><Filter className="mr-1 inline h-3 w-3" />Category</label>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All categories</option>
            {LISTING_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Sort by</label>
          <select className="input" value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
            <option value="price">Price</option>
            <option value="condition">Condition</option>
          </select>
        </div>
        <div>
          <label className="label">Sort algorithm</label>
          <select className="input" value={sortAlgo} onChange={(e) => setSortAlgo(e.target.value as SortAlgo)}>
            <option value="merge">Merge Sort</option>
            <option value="bubble">Bubble Sort</option>
          </select>
        </div>
        {searchInfo && (
          <p className="text-xs text-eco-400">
            {searchInfo.algo}: {searchInfo.count} match(es) · {searchInfo.timeMs.toFixed(3)} ms · {searchInfo.ops} ops
          </p>
        )}
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-amber-700/40 bg-amber-900/20 p-3 text-sm text-amber-300">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>Hazardous categories cannot be listed: {HAZARDOUS_CATEGORIES.join(', ')}.</span>
      </div>

      {sorted.length === 0 ? (
        <div className="card p-10 text-center text-eco-400">No listings match your search.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((l) => (
            <div key={l.id} className="card flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-eco-100">{l.title}</h3>
                <span className="shrink-0 rounded-full bg-eco-600/15 px-2 py-0.5 text-xs font-semibold text-eco-400">
                  {l.category}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-eco-500">Condition</dt>
                  <dd className="font-semibold text-eco-200">{l.condition}</dd>
                </div>
                <div>
                  <dt className="text-eco-500">Price</dt>
                  <dd className="font-semibold text-eco-200">₹{l.price.toLocaleString('en-IN')}</dd>
                </div>
              </dl>
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                {l.dataWiped ? (
                  <span className="inline-flex items-center gap-1 text-eco-400">
                    <ShieldCheck className="h-3.5 w-3.5" /> Data wiped
                  </span>
                ) : (
                  <span className="text-eco-600">Data not wiped</span>
                )}
              </div>
              <button className="btn-primary mt-4 w-full" onClick={() => addToCart(l)}>
                Add to cart
              </button>
            </div>
          ))}
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setShowCart(false)}>
          <div className="h-full w-full max-w-md bg-night-900 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-night-700 p-4">
              <h2 className="text-lg font-semibold text-eco-200">Your cart</h2>
              <button onClick={() => setShowCart(false)} className="text-eco-500 hover:text-eco-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-4">
              {cart.length === 0 ? (
                <p className="text-sm text-eco-400">Your cart is empty.</p>
              ) : (
                <ul className="space-y-3">
                  {cart.map((l, i) => (
                    <li key={i} className="flex items-center justify-between rounded-lg border border-night-700 bg-night-850 p-3">
                      <div>
                        <p className="font-medium text-eco-100">{l.title}</p>
                        <p className="text-xs text-eco-500">{l.category} · Condition {l.condition}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-eco-300">₹{l.price.toLocaleString('en-IN')}</span>
                        <button onClick={() => removeFromCart(i)} className="text-eco-600 hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="absolute bottom-0 w-full max-w-md border-t border-night-700 bg-night-900 p-4">
              <div className="mb-3 flex items-center justify-between text-lg font-semibold text-eco-100">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary flex-1" onClick={clearCart} disabled={cart.length === 0}>
                  Clear cart
                </button>
                <button className="btn-primary flex-1" onClick={checkout} disabled={cart.length === 0}>
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

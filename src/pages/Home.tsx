import { Link } from 'react-router-dom';
import {
  Route as RouteIcon,
  Truck,
  CalendarClock,
  ShoppingCart,
  Network as NetworkIcon,
  BarChart3,
  Recycle,
  ArrowRight,
  Factory,
  Cpu,
  Wrench,
} from 'lucide-react';

const modules = [
  { to: '/route', title: 'Route Optimizer', desc: 'Plan the shortest pickup route across collection points using TSP algorithms.', icon: RouteIcon },
  { to: '/loading', title: 'Truck Loading', desc: 'Maximize recovered value per truck with knapsack-based packing strategies.', icon: Truck },
  { to: '/scheduler', title: 'Scheduler', desc: 'Assign conflict-free pickup slots to industries using graph coloring.', icon: CalendarClock },
  { to: '/marketplace', title: 'Marketplace', desc: 'Browse refurbished electronics and industrial scrap with fast search and sorting.', icon: ShoppingCart },
  { to: '/network', title: 'Network', desc: 'Connect collection sites at minimum cost with a Kruskal minimum spanning tree.', icon: NetworkIcon },
  { to: '/benchmark', title: 'Benchmark', desc: 'Compare runtime vs. input size across every algorithm with complexity tables.', icon: BarChart3 },
];

const stats = [
  { label: 'E-waste generated / year', value: '62 Mt', sub: 'globally, and rising' },
  { label: 'Formally recycled', value: '< 20%', sub: 'of total volume' },
  { label: 'Value of recoverable materials', value: '$57B', sub: 'copper, gold, cobalt, more' },
  { label: 'CO₂ saved per device reused', value: '~20 kg', sub: 'vs. new manufacturing' },
];

const scopes = [
  { icon: Cpu, title: 'Consumer Electronics', items: 'Laptops, phones, tablets, monitors, drives, accessories.' },
  { icon: Factory, title: 'Industrial Equipment', items: 'Transformers, distribution gear, control panels, server racks.' },
  { icon: Wrench, title: 'Scrap & Components', items: 'Motors, circuit boards, copper windings, aluminium heatsinks.' },
];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-night-700 bg-gradient-to-br from-night-800 via-night-850 to-eco-950 px-8 py-16 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-eco-600/40 bg-eco-600/10 px-3 py-1 text-xs font-semibold text-eco-300 backdrop-blur">
            <Recycle className="h-4 w-4" /> Smart E-Waste Management
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
            Turn electronic &amp; industrial waste into a loop, not a landfill.
          </h1>
          <p className="mt-4 text-lg text-eco-200/80">
            Every year over 60 million tonnes of e-waste are generated globally and less than a fifth
            is formally recycled. EcoLoop pairs classic algorithms with logistics to optimize pickup
            routes, truck loading, scheduling, resale, and the collection network — so more devices
            and industrial equipment get a second life.
          </p>
          <Link to="/route" className="btn-primary mt-6">
            Start optimizing <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-eco-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-eco-500/10 blur-3xl" />
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-eco-200">The problem at a glance</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card p-5">
              <div className="text-3xl font-bold text-eco-400">{s.value}</div>
              <div className="mt-1 text-sm font-semibold text-eco-200">{s.label}</div>
              <div className="text-xs text-eco-500">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-eco-200">What we handle</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {scopes.map(({ icon: Icon, title, items }) => (
            <div key={title} className="card p-6">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-eco-600/15 text-eco-400">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-eco-100">{title}</h3>
              <p className="mt-1 text-sm text-eco-400">{items}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-eco-200">Modules</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map(({ to, title, desc, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="card group p-6 transition hover:-translate-y-1 hover:border-eco-600/50"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-eco-600/15 text-eco-400 transition group-hover:bg-eco-600 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-eco-100">{title}</h3>
              <p className="mt-1 text-sm text-eco-400">{desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-eco-400 group-hover:text-eco-200">
                Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

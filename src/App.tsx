import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import {
  Home as HomeIcon,
  Route as RouteIcon,
  Truck,
  CalendarClock,
  ShoppingCart,
  Network as NetworkIcon,
  BarChart3,
  Recycle,
} from 'lucide-react';
import Home from '@/pages/Home';
import RouteOptimizer from '@/pages/RouteOptimizer';
import TruckLoading from '@/pages/TruckLoading';
import Scheduler from '@/pages/Scheduler';
import Marketplace from '@/pages/Marketplace';
import Network from '@/pages/Network';
import Benchmark from '@/pages/Benchmark';

const nav = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/route', label: 'Route Optimizer', icon: RouteIcon },
  { to: '/loading', label: 'Truck Loading', icon: Truck },
  { to: '/scheduler', label: 'Scheduler', icon: CalendarClock },
  { to: '/marketplace', label: 'Marketplace', icon: ShoppingCart },
  { to: '/network', label: 'Network', icon: NetworkIcon },
  { to: '/benchmark', label: 'Benchmark', icon: BarChart3 },
];

export default function App() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-night-950">
      <header className="sticky top-0 z-30 border-b border-night-700 bg-night-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
          <div className="flex items-center gap-2">
            <Recycle className="h-7 w-7 text-eco-400" />
            <span className="text-lg font-bold tracking-tight text-eco-300">EcoLoop</span>
          </div>
          <nav className="hidden flex-1 items-center gap-1 md:flex">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-eco-600 text-white' : 'text-eco-300 hover:bg-night-800 hover:text-eco-100'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
          <select
            className="input flex-1 md:hidden"
            onChange={(e) => navigate(e.target.value)}
            defaultValue="/"
          >
            {nav.map(({ to, label }) => (
              <option key={to} value={to}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/route" element={<RouteOptimizer />} />
          <Route path="/loading" element={<TruckLoading />} />
          <Route path="/scheduler" element={<Scheduler />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/network" element={<Network />} />
          <Route path="/benchmark" element={<Benchmark />} />
        </Routes>
      </main>
    </div>
  );
}

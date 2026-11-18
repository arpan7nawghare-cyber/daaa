import type { KnapsackItem } from '@/algorithms/packing/knapsackDP';
import type { KruskalEdge } from '@/algorithms/network/kruskal';

export const truckItems: KnapsackItem[] = [
  { name: 'CRT Monitor', weight: 15, value: 40 },
  { name: 'Laptop', weight: 4, value: 120 },
  { name: 'Smartphone', weight: 0.5, value: 80 },
  { name: 'Printer', weight: 12, value: 30 },
  { name: 'Server Rack', weight: 50, value: 200 },
  { name: 'Keyboard', weight: 1, value: 10 },
  { name: 'Copper Cable Bundle', weight: 8, value: 60 },
  { name: 'Hard Drive', weight: 2, value: 45 },
  { name: 'Industrial Transformer', weight: 120, value: 350 },
  { name: 'Scrap Motor (AC)', weight: 35, value: 90 },
  { name: 'Steel Scrap Bundle', weight: 80, value: 110 },
  { name: 'Circuit Board Lot', weight: 6, value: 150 },
];

export interface Industry {
  id: number;
  name: string;
  conflicts: number[];
}

// 6 seeded industries with pickup-time conflicts — mix of e-waste and industrial scrap.
export const industries: Industry[] = [
  { id: 0, name: 'EcoRecycle Co. (IT & Office)', conflicts: [1, 2] },
  { id: 1, name: 'GreenTech Disposals (Consumer E-waste)', conflicts: [0, 3] },
  { id: 2, name: 'Urban E-Scrap (Appliances)', conflicts: [0, 4] },
  { id: 3, name: 'Circuit Salvage (PCBs & Boards)', conflicts: [1, 5] },
  { id: 4, name: 'Metal Recovery Ltd. (Industrial Scrap)', conflicts: [2, 5] },
  { id: 5, name: 'DataWipe Partners (Storage & Drives)', conflicts: [3, 4] },
];

export function industryEdges(): [number, number][] {
  const edges: [number, number][] = [];
  industries.forEach((ind) => {
    ind.conflicts.forEach((c) => {
      if (ind.id < c) edges.push([ind.id, c]);
    });
  });
  return edges;
}

export interface Listing {
  id: number;
  title: string;
  category: string;
  condition: 'A' | 'B' | 'C';
  price: number;
  dataWiped: boolean;
}

export const HAZARDOUS_CATEGORIES = ['CRT Monitors', 'Damaged Lithium Batteries'];

export const LISTING_CATEGORIES = [
  'Laptops',
  'Phones',
  'Tablets',
  'Monitors',
  'Storage',
  'Networking',
  'Accessories',
  'Industrial Motors',
  'Transformers',
  'Scrap Metal',
  'Circuit Boards',
];

export const listings: Listing[] = [
  { id: 1, title: 'Dell Latitude E7470', category: 'Laptops', condition: 'A', price: 14500, dataWiped: true },
  { id: 2, title: 'HP ProBook 430', category: 'Laptops', condition: 'B', price: 9800, dataWiped: true },
  { id: 3, title: 'iPhone 11 64GB', category: 'Phones', condition: 'A', price: 12000, dataWiped: true },
  { id: 4, title: 'Samsung Galaxy S10', category: 'Phones', condition: 'B', price: 7200, dataWiped: true },
  { id: 5, title: 'iPad Air 3', category: 'Tablets', condition: 'A', price: 16000, dataWiped: true },
  { id: 6, title: 'Logitech MX Keys', category: 'Accessories', condition: 'A', price: 3600, dataWiped: false },
  { id: 7, title: 'Dell UltraSharp U2719', category: 'Monitors', condition: 'B', price: 8800, dataWiped: false },
  { id: 8, title: 'Samsung SSD 1TB', category: 'Storage', condition: 'A', price: 5600, dataWiped: true },
  { id: 9, title: 'Seagate HDD 4TB', category: 'Storage', condition: 'C', price: 2000, dataWiped: true },
  { id: 10, title: 'Cisco Catalyst Switch', category: 'Networking', condition: 'A', price: 12800, dataWiped: true },
  { id: 11, title: 'Raspberry Pi 4 Kit', category: 'Circuit Boards', condition: 'A', price: 4800, dataWiped: false },
  { id: 12, title: 'MacBook Air M1', category: 'Laptops', condition: 'A', price: 52000, dataWiped: true },
  { id: 13, title: 'Google Pixel 6', category: 'Phones', condition: 'B', price: 17600, dataWiped: true },
  { id: 14, title: 'Synology DS920+', category: 'Networking', condition: 'A', price: 24000, dataWiped: true },
  { id: 15, title: 'Anker Power Bank', category: 'Accessories', condition: 'B', price: 1600, dataWiped: false },
  { id: 16, title: 'Sony WH-1000XM4', category: 'Accessories', condition: 'A', price: 11200, dataWiped: false },
  { id: 17, title: '3-Phase AC Motor 5HP', category: 'Industrial Motors', condition: 'B', price: 8500, dataWiped: false },
  { id: 18, title: 'Distribution Transformer 25kVA', category: 'Transformers', condition: 'A', price: 35000, dataWiped: false },
  { id: 19, title: 'Copper Winding Scrap (10kg)', category: 'Scrap Metal', condition: 'C', price: 6800, dataWiped: false },
  { id: 20, title: 'Aluminium Heat Sink Lot', category: 'Scrap Metal', condition: 'B', price: 2400, dataWiped: false },
  { id: 21, title: 'Industrial Control Board Set', category: 'Circuit Boards', condition: 'B', price: 9200, dataWiped: true },
  { id: 22, title: 'Stepper Motor NEMA 23', category: 'Industrial Motors', condition: 'A', price: 3200, dataWiped: false },
  { id: 23, title: 'Step-Down Transformer 5kVA', category: 'Transformers', condition: 'C', price: 12500, dataWiped: false },
  { id: 24, title: 'Server Motherboard Lot', category: 'Circuit Boards', condition: 'B', price: 15600, dataWiped: true },
];

export interface Site {
  id: number;
  name: string;
  x: number;
  y: number;
}

// 12 seeded collection sites (normalized 0..100 coords for canvas).
export const sites: Site[] = [
  { id: 0, name: 'Central Hub', x: 50, y: 50 },
  { id: 1, name: 'North IT Depot', x: 48, y: 12 },
  { id: 2, name: 'South Scrap Yard', x: 52, y: 88 },
  { id: 3, name: 'East Industrial Park', x: 85, y: 52 },
  { id: 4, name: 'West Drop-off', x: 15, y: 48 },
  { id: 5, name: 'NE Transformer Plant', x: 78, y: 22 },
  { id: 6, name: 'NW Motor Workshop', x: 20, y: 20 },
  { id: 7, name: 'SE Metal Recycler', x: 80, y: 78 },
  { id: 8, name: 'SW Appliance Center', x: 18, y: 80 },
  { id: 9, name: 'Midtown Eco-Point', x: 60, y: 45 },
  { id: 10, name: 'Riverside PCB Yard', x: 35, y: 65 },
  { id: 11, name: 'Hilltop Collection', x: 65, y: 30 },
];

export function siteEdges(): KruskalEdge[] {
  // Complete-ish graph connecting nearby sites.
  return [
    { u: 0, v: 9, w: 10 },
    { u: 0, v: 10, w: 18 },
    { u: 0, v: 11, w: 22 },
    { u: 0, v: 1, w: 38 },
    { u: 0, v: 2, w: 38 },
    { u: 0, v: 3, w: 35 },
    { u: 0, v: 4, w: 35 },
    { u: 9, v: 11, w: 16 },
    { u: 9, v: 3, w: 26 },
    { u: 11, v: 5, w: 14 },
    { u: 11, v: 1, w: 22 },
    { u: 1, v: 5, w: 32 },
    { u: 1, v: 6, w: 30 },
    { u: 6, v: 4, w: 28 },
    { u: 4, v: 10, w: 22 },
    { u: 10, v: 8, w: 18 },
    { u: 8, v: 2, w: 35 },
    { u: 2, v: 7, w: 30 },
    { u: 7, v: 3, w: 28 },
    { u: 7, v: 9, w: 30 },
    { u: 5, v: 3, w: 32 },
    { u: 5, v: 7, w: 58 },
    { u: 6, v: 8, w: 60 },
    { u: 6, v: 1, w: 30 },
  ];
}

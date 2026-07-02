'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, MapPin, Weight, Package, IndianRupee, Clock, TrendingUp, Award, Truck } from 'lucide-react';

const mockResults = [
  { id: 'pu_fleet', name: 'Parcel Uncle Fleet', rate: 72, days: 1, success: 96.2, rto: 1.8, score: 98, tags: ['Cheapest', 'Fastest'] },
  { id: 'delhivery', name: 'Delhivery', rate: 83, days: 2, success: 91.5, rto: 4.2, score: 91, tags: ['Reliable'] },
  { id: 'xpressbees', name: 'Xpressbees', rate: 78, days: 2, success: 89.8, rto: 5.1, score: 87, tags: ['Wide Coverage'] },
  { id: 'bluedart', name: 'Blue Dart', rate: 110, days: 1, success: 94.0, rto: 2.5, score: 85, tags: ['Premium'] },
  { id: 'shadowfax', name: 'Shadowfax', rate: 68, days: 3, success: 87.3, rto: 6.8, score: 78, tags: ['Budget'] },
];

export default function RatesPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Rate Calculator</h1>
        <p className="text-sm text-slate-500 mt-0.5">Compare shipping rates across all courier partners</p>
      </div>

      <div className="bg-white border border-border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Origin Pincode</label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="110001" className="w-full pl-9 pr-3 py-2.5 bg-bg-input border border-border rounded-lg text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand-bg" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Destination Pincode</label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="201301" className="w-full pl-9 pr-3 py-2.5 bg-bg-input border border-border rounded-lg text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand-bg" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Weight (kg)</label>
            <div className="relative">
              <Weight size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="number" step="0.1" placeholder="0.5" className="w-full pl-9 pr-3 py-2.5 bg-bg-input border border-border rounded-lg text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand-bg" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Payment Mode</label>
            <select className="w-full px-3 py-2.5 bg-bg-input border border-border rounded-lg text-sm text-slate-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand-bg">
              <option>Prepaid</option>
              <option>COD</option>
            </select>
          </div>
        </div>
        <button onClick={() => setShowResults(true)} className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg shadow-md shadow-brand/20">
          <Calculator size={16} /> Calculate Rates
        </button>
      </div>

      {showResults && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">Available Couriers ({mockResults.length})</h2>
          {mockResults.map((c, i) => (
            <div key={c.id} className={`bg-white border rounded-xl p-4 flex items-center justify-between ${i === 0 ? 'border-brand shadow-md shadow-brand/10' : 'border-border hover:border-slate-300'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-brand text-white' : 'bg-bg-elevated text-slate-500'}`}>
                  {c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                    {i === 0 && <span className="px-1.5 py-0.5 bg-brand text-white rounded text-[10px] font-bold flex items-center gap-0.5"><Award size={10} /> Best</span>}
                    {c.tags.map(t => <span key={t} className="px-1.5 py-0.5 bg-bg-elevated rounded text-[10px] font-medium text-slate-500">{t}</span>)}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={11} /> {c.days}d</span>
                    <span className="flex items-center gap-1"><TrendingUp size={11} /> {c.success}%</span>
                    <span>RTO {c.rto}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-800">₹{c.rate}</p>
                  <p className="text-[10px] text-slate-400">incl. GST</p>
                </div>
                <button className="px-3 py-1.5 bg-brand-bg text-brand text-xs font-semibold rounded-lg hover:bg-brand hover:text-white transition-colors">Ship</button>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

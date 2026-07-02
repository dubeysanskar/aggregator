'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Package, IndianRupee, Download, Calendar } from 'lucide-react';

const volumeData = [
  { day: 'Mon', count: 245 }, { day: 'Tue', count: 312 }, { day: 'Wed', count: 287 },
  { day: 'Thu', count: 356 }, { day: 'Fri', count: 401 }, { day: 'Sat', count: 289 }, { day: 'Sun', count: 178 },
];
const maxCount = Math.max(...volumeData.map(d => d.count));

const topRoutes = [
  { from: 'Delhi', to: 'Noida', shipments: 2450, avgDays: 1.2, success: 97.1 },
  { from: 'Delhi', to: 'Gurgaon', shipments: 1890, avgDays: 1.0, success: 98.3 },
  { from: 'Delhi', to: 'Lucknow', shipments: 1240, avgDays: 2.1, success: 91.5 },
  { from: 'Delhi', to: 'Jaipur', shipments: 980, avgDays: 1.8, success: 93.2 },
  { from: 'Delhi', to: 'Chandigarh', shipments: 756, avgDays: 1.5, success: 95.8 },
];

const deliveryBreakdown = [
  { label: 'Delivered', value: 85.4, color: 'bg-success' },
  { label: 'In Transit', value: 9.6, color: 'bg-brand' },
  { label: 'NDR', value: 3.2, color: 'bg-warning' },
  { label: 'RTO', value: 1.8, color: 'bg-danger' },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState('7d');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-slate-800">Reports & Analytics</h1><p className="text-sm text-slate-500 mt-0.5">Shipment performance and business insights</p></div>
        <div className="flex items-center gap-2">
          <div className="flex bg-bg-elevated rounded-lg p-0.5">
            {[['7d','7 Days'],['30d','30 Days'],['90d','90 Days']].map(([v,l]) => (
              <button key={v} onClick={() => setPeriod(v)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${period === v ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>{l}</button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-sm text-slate-600 hover:bg-bg-elevated"><Download size={15} /> Export</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Shipments', value: '2,068', change: '+12%', icon: Package, color: 'bg-brand-bg text-brand' },
          { label: 'Revenue', value: '₹1,62,400', change: '+18%', icon: IndianRupee, color: 'bg-success-bg text-success' },
          { label: 'Avg Delivery Time', value: '1.8 days', change: '-0.3d', icon: TrendingUp, color: 'bg-info-bg text-info' },
          { label: 'Success Rate', value: '95.4%', change: '+1.2%', icon: BarChart3, color: 'bg-purple-bg text-purple' },
        ].map(s => { const Icon = s.icon; return (
          <div key={s.label} className="bg-white border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}><Icon size={18} /></div>
            </div>
            <p className="text-xl font-bold text-slate-800">{s.value}</p>
            <p className="text-[11px] text-success font-medium mt-0.5">{s.change}</p>
          </div>
        ); })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Shipment Volume</h3>
          <div className="flex items-end gap-3 h-44">
            {volumeData.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-500 font-medium">{d.count}</span>
                <div className="w-full rounded-t bg-gradient-to-t from-brand/30 to-brand/60 hover:from-brand/50 hover:to-brand/80 transition-colors cursor-default" style={{ height: `${(d.count / maxCount) * 100}%` }} />
                <span className="text-[10px] text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Delivery Breakdown</h3>
          <div className="space-y-3">
            {deliveryBreakdown.map(d => (
              <div key={d.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{d.label}</span>
                  <span className="text-slate-800 font-semibold">{d.value}%</span>
                </div>
                <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border"><h3 className="text-sm font-semibold text-slate-800">Top Routes</h3></div>
        <table className="w-full">
          <thead><tr className="border-b border-border bg-bg-elevated/50">
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Route</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Shipments</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Avg Days</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Success %</th>
          </tr></thead>
          <tbody className="divide-y divide-border">
            {topRoutes.map((r, i) => (
              <tr key={i} className="hover:bg-bg-elevated/50">
                <td className="px-4 py-3 text-sm text-slate-700">{r.from} → {r.to}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-800">{r.shipments.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{r.avgDays}d</td>
                <td className="px-4 py-3"><span className={`text-sm font-semibold ${r.success >= 95 ? 'text-success' : r.success >= 90 ? 'text-brand' : 'text-warning'}`}>{r.success}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

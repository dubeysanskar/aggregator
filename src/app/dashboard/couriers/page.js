'use client';

import { motion } from 'motion/react';
import { Truck, TrendingUp, TrendingDown, Clock, Package, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';

const couriers = [
  { name: 'Parcel Uncle Fleet', code: 'PU', orders: 8420, delivered: 8100, failed: 120, rto: 150, ndr: 50, success: 96.2, avg: 1.4, color: 'bg-brand' },
  { name: 'Delhivery', code: 'DL', orders: 2340, delivered: 2140, failed: 80, rto: 100, ndr: 20, success: 91.5, avg: 2.1, color: 'bg-red-500' },
  { name: 'Xpressbees', code: 'XB', orders: 1580, delivered: 1420, failed: 70, rto: 80, ndr: 10, success: 89.8, avg: 2.4, color: 'bg-emerald-500' },
  { name: 'Blue Dart', code: 'BD', orders: 850, delivered: 800, failed: 20, rto: 25, ndr: 5, success: 94.1, avg: 1.6, color: 'bg-blue-600' },
  { name: 'Shadowfax', code: 'SF', orders: 507, delivered: 443, failed: 30, rto: 34, ndr: 0, success: 87.3, avg: 2.8, color: 'bg-orange-500' },
];

export default function CouriersPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="text-xl font-bold text-slate-800">Courier Performance</h1><p className="text-sm text-slate-500 mt-0.5">Compare delivery performance across all courier partners</p></div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {couriers.map(c => (
          <div key={c.code} className="bg-white border border-border rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg ${c.color} flex items-center justify-center text-white text-xs font-bold`}>{c.code}</div>
              <p className="text-xs font-semibold text-slate-700 leading-tight">{c.name}</p>
            </div>
            <p className="text-2xl font-bold text-slate-800">{c.success}%</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{c.orders.toLocaleString()} orders</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border"><h3 className="text-sm font-semibold text-slate-800">Detailed Comparison</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-border bg-bg-elevated/50">
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Courier</th>
              <th className="text-right px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Total</th>
              <th className="text-right px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Delivered</th>
              <th className="text-right px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Failed</th>
              <th className="text-right px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">RTO</th>
              <th className="text-right px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">NDR</th>
              <th className="text-right px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Success %</th>
              <th className="text-right px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Avg Days</th>
            </tr></thead>
            <tbody className="divide-y divide-border">
              {couriers.map(c => (
                <tr key={c.code} className="hover:bg-bg-elevated/50">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-md ${c.color} flex items-center justify-center text-white text-[10px] font-bold`}>{c.code}</div>
                    <span className="text-sm font-medium text-slate-700">{c.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-slate-800">{c.orders.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right text-success font-medium">{c.delivered.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right text-danger">{c.failed}</td>
                  <td className="px-4 py-3 text-sm text-right text-warning">{c.rto}</td>
                  <td className="px-4 py-3 text-sm text-right text-slate-500">{c.ndr}</td>
                  <td className="px-4 py-3 text-right"><span className={`text-sm font-bold ${c.success >= 95 ? 'text-success' : c.success >= 90 ? 'text-brand' : 'text-warning'}`}>{c.success}%</span></td>
                  <td className="px-4 py-3 text-sm text-right text-slate-600">{c.avg}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Success Rate Comparison</h3>
        <div className="space-y-3">
          {couriers.map(c => (
            <div key={c.code} className="flex items-center gap-3">
              <div className="w-28 text-xs font-medium text-slate-600 shrink-0">{c.name}</div>
              <div className="flex-1 h-5 bg-bg-elevated rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${c.color} flex items-center justify-end pr-2`} style={{ width: `${c.success}%` }}>
                  <span className="text-[10px] font-bold text-white">{c.success}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

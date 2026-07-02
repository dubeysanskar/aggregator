'use client';

import { useState } from 'react';
import { Banknote, IndianRupee, Clock, Check, Search, Filter, Download, Calendar } from 'lucide-react';

const summary = [
  { label: 'Total COD Collected', value: '₹2,45,800', icon: Banknote, color: 'bg-brand-bg text-brand' },
  { label: 'Pending Settlement', value: '₹48,200', icon: Clock, color: 'bg-warning-bg text-warning' },
  { label: 'Settled This Month', value: '₹1,97,600', icon: Check, color: 'bg-success-bg text-success' },
];

const settlements = [
  { id: 'STL-001', amount: 32400, orders: 42, status: 'Settled', date: '30 Jun 2026', utr: 'UTR7284930182' },
  { id: 'STL-002', amount: 28750, orders: 38, status: 'Settled', date: '28 Jun 2026', utr: 'UTR6193720451' },
  { id: 'STL-003', amount: 48200, orders: 55, status: 'Pending', date: '01 Jul 2026', utr: '—' },
  { id: 'STL-004', amount: 41500, orders: 48, status: 'Processing', date: '29 Jun 2026', utr: '—' },
  { id: 'STL-005', amount: 22300, orders: 29, status: 'Settled', date: '25 Jun 2026', utr: 'UTR5082619374' },
];

const statusColors = { Settled: 'bg-success-bg text-success', Pending: 'bg-warning-bg text-warning', Processing: 'bg-info-bg text-info' };

export default function CODPage() {
  const [filter, setFilter] = useState('all');
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-slate-800">COD Settlements</h1><p className="text-sm text-slate-500 mt-0.5">Track your Cash on Delivery remittances</p></div>
        <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-border rounded-lg text-sm text-slate-600 hover:bg-bg-elevated"><Download size={15} /> Export</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summary.map(s => { const Icon = s.icon; return (
          <div key={s.label} className="bg-white border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}><Icon size={18} /></div>
            </div>
            <p className="text-xl font-bold text-slate-800">{s.value}</p>
          </div>
        ); })}
      </div>

      <div className="flex items-center gap-2">
        {['all', 'Settled', 'Pending', 'Processing'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === f ? 'bg-brand text-white' : 'text-slate-500 hover:bg-bg-elevated'}`}>
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead><tr className="border-b border-border bg-bg-elevated/50">
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Batch ID</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Amount</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Orders</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Status</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Date</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">UTR</th>
          </tr></thead>
          <tbody className="divide-y divide-border">
            {settlements.filter(s => filter === 'all' || s.status === filter).map(s => (
              <tr key={s.id} className="hover:bg-bg-elevated/50">
                <td className="px-4 py-3 text-sm font-medium text-brand">{s.id}</td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-700">₹{s.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{s.orders}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[s.status]}`}>{s.status}</span></td>
                <td className="px-4 py-3 text-sm text-slate-500">{s.date}</td>
                <td className="px-4 py-3 text-xs text-slate-400 font-mono">{s.utr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

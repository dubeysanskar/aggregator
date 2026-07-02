'use client';

import { motion } from 'framer-motion';
import { RotateCcw, Truck, Clock, TrendingDown, Search, Filter, MapPin } from 'lucide-react';

const rtoCases = [
  { id: 'PU6718203945', recipient: 'Mohit Agarwal', dest: 'Kanpur, UP', courier: 'Shadowfax', reason: 'Max attempts exceeded', rtoDate: '28 Jun', status: 'RTO In Transit', eta: '02 Jul' },
  { id: 'PU9182736405', recipient: 'Pooja Mishra', dest: 'Varanasi, UP', courier: 'Delhivery', reason: 'Customer refused', rtoDate: '26 Jun', status: 'Returned', eta: '—' },
  { id: 'PU3847291056', recipient: 'Suresh Yadav', dest: 'Bhopal, MP', courier: 'Xpressbees', reason: 'Wrong address', rtoDate: '29 Jun', status: 'RTO Initiated', eta: '04 Jul' },
  { id: 'PU5029384716', recipient: 'Deepak Gupta', dest: 'Indore, MP', courier: 'PU Fleet', reason: 'Customer not available', rtoDate: '27 Jun', status: 'Returned', eta: '—' },
];

const statusColors = { 'RTO Initiated': 'bg-warning-bg text-warning', 'RTO In Transit': 'bg-info-bg text-info', 'Returned': 'bg-success-bg text-success' };

export default function RTOPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="text-xl font-bold text-slate-800">RTO / Returns</h1><p className="text-sm text-slate-500 mt-0.5">Track return shipments and RTO analytics</p></div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total RTO', value: '42', icon: RotateCcw, color: 'bg-danger-bg text-danger' },
          { label: 'In Transit', value: '12', icon: Truck, color: 'bg-info-bg text-info' },
          { label: 'Returned', value: '28', icon: Clock, color: 'bg-success-bg text-success' },
          { label: 'RTO Rate', value: '3.2%', icon: TrendingDown, color: 'bg-warning-bg text-warning' },
        ].map(s => { const Icon = s.icon; return (
          <div key={s.label} className="bg-white border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}><Icon size={18} /></div>
            </div>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
          </div>
        ); })}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center bg-white border border-border rounded-lg">
          <Search size={15} className="text-slate-400 ml-3" />
          <input type="text" placeholder="Search by tracking ID..." className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 px-2.5 py-2 outline-none" />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-sm text-slate-500 hover:text-slate-700"><Filter size={14} /> Filters</button>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead><tr className="border-b border-border bg-bg-elevated/50">
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Tracking ID</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Recipient</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Destination</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Courier</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Reason</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Status</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">ETA</th>
          </tr></thead>
          <tbody className="divide-y divide-border">
            {rtoCases.map(c => (
              <tr key={c.id} className="hover:bg-bg-elevated/50">
                <td className="px-4 py-3 text-sm font-medium text-brand">{c.id}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{c.recipient}</td>
                <td className="px-4 py-3 text-sm text-slate-500 flex items-center gap-1"><MapPin size={12} className="text-slate-400" />{c.dest}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{c.courier}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{c.reason}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusColors[c.status]}`}>{c.status}</span></td>
                <td className="px-4 py-3 text-sm text-slate-500">{c.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

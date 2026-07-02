'use client';

import { useState } from 'react';
import { Tag, Search, Download, Printer, Package, Check } from 'lucide-react';

const shipments = [
  { id: 'PU9423508781', recipient: 'Rahul Kumar', dest: 'Noida, UP', status: 'In Transit', date: '30 Jun', selected: false },
  { id: 'PU8042777728', recipient: 'Priya Singh', dest: 'G. Noida, UP', status: 'Delivered', date: '30 Jun', selected: false },
  { id: 'PU7144123150', recipient: 'Amit Verma', dest: 'Delhi', status: 'Out for Delivery', date: '29 Jun', selected: false },
  { id: 'PU3977214030', recipient: 'Neha Sharma', dest: 'Gurgaon, HR', status: 'Picked Up', date: '29 Jun', selected: false },
  { id: 'PU8565086610', recipient: 'Sanjay Gupta', dest: 'Varanasi, UP', status: 'In Transit', date: '28 Jun', selected: false },
];

export default function LabelsPage() {
  const [selected, setSelected] = useState([]);
  const [format, setFormat] = useState('4x6');

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const selectAll = () => setSelected(selected.length === shipments.length ? [] : shipments.map(s => s.id));

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-slate-800">Label Generation</h1><p className="text-sm text-slate-500 mt-0.5">Generate and download shipping labels</p></div>
        <div className="flex items-center gap-2">
          <select value={format} onChange={e => setFormat(e.target.value)} className="bg-white border border-border rounded-lg px-3 py-2 text-sm text-slate-600 outline-none">
            <option value="4x6">4×6 inch</option><option value="A4">A4 Paper</option>
          </select>
          <button disabled={!selected.length} className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg shadow-md shadow-brand/20 disabled:opacity-40">
            <Download size={15} /> Download ({selected.length})
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center bg-white border border-border rounded-lg">
          <Search size={15} className="text-slate-400 ml-3" />
          <input type="text" placeholder="Search tracking IDs..." className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 px-2.5 py-2 outline-none" />
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead><tr className="border-b border-border bg-bg-elevated/50">
            <th className="w-10 px-4 py-3"><input type="checkbox" checked={selected.length === shipments.length} onChange={selectAll} className="w-3.5 h-3.5 accent-brand rounded" /></th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Tracking ID</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Recipient</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Destination</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Status</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Date</th>
            <th className="w-20"></th>
          </tr></thead>
          <tbody className="divide-y divide-border">
            {shipments.map(s => (
              <tr key={s.id} className={`hover:bg-bg-elevated/50 ${selected.includes(s.id) ? 'bg-brand-bg/30' : ''}`}>
                <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleSelect(s.id)} className="w-3.5 h-3.5 accent-brand rounded" /></td>
                <td className="px-4 py-3 text-sm font-medium text-brand">{s.id}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{s.recipient}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{s.dest}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{s.status}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{s.date}</td>
                <td className="px-4 py-3"><button className="p-1.5 rounded-lg hover:bg-bg-elevated text-slate-400 hover:text-brand"><Printer size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected.length > 0 && (
        <div className="bg-white border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Label Preview</h3>
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
            <Tag size={32} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Select shipments and click "Download" to generate labels</p>
            <p className="text-xs text-slate-300 mt-1">Format: {format === '4x6' ? '4×6 inch (thermal)' : 'A4 paper (4 labels per page)'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

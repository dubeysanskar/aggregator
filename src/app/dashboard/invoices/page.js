'use client';

import { useState } from 'react';
import { FileText, Download, IndianRupee, Calendar, Check, Clock } from 'lucide-react';

const invoices = [
  { id: 'INV-2026-061', period: 'Jun 2026 (Week 4)', amount: 12850, shipments: 156, status: 'Paid', date: '30 Jun', dueDate: '07 Jul' },
  { id: 'INV-2026-060', period: 'Jun 2026 (Week 3)', amount: 11200, shipments: 142, status: 'Paid', date: '23 Jun', dueDate: '30 Jun' },
  { id: 'INV-2026-059', period: 'Jun 2026 (Week 2)', amount: 9870, shipments: 128, status: 'Paid', date: '16 Jun', dueDate: '23 Jun' },
  { id: 'INV-2026-058', period: 'Jun 2026 (Week 1)', amount: 14300, shipments: 178, status: 'Paid', date: '09 Jun', dueDate: '16 Jun' },
  { id: 'INV-2026-057', period: 'May 2026 (Week 4)', amount: 10500, shipments: 134, status: 'Paid', date: '02 Jun', dueDate: '09 Jun' },
];

export default function InvoicesPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-slate-800">Invoices & Billing</h1><p className="text-sm text-slate-500 mt-0.5">View and download shipping invoices</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Billed', value: '₹58,720', sub: 'This month', color: 'bg-brand-bg text-brand', icon: IndianRupee },
          { label: 'Total Paid', value: '₹58,720', sub: 'All clear', color: 'bg-success-bg text-success', icon: Check },
          { label: 'Outstanding', value: '₹0', sub: 'No dues', color: 'bg-bg-elevated text-slate-400', icon: Clock },
        ].map(s => { const Icon = s.icon; return (
          <div key={s.label} className="bg-white border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}><Icon size={18} /></div>
            </div>
            <p className="text-xl font-bold text-slate-800">{s.value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
          </div>
        ); })}
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-slate-800">Invoice History</h2>
          <select className="bg-bg-input border border-border rounded-lg px-3 py-1.5 text-xs text-slate-600 outline-none">
            <option>All Months</option><option>June 2026</option><option>May 2026</option>
          </select>
        </div>
        <table className="w-full">
          <thead><tr className="border-b border-border bg-bg-elevated/50">
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Invoice #</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Period</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Amount</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Shipments</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Status</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase">Date</th>
            <th className="w-20"></th>
          </tr></thead>
          <tbody className="divide-y divide-border">
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-bg-elevated/50">
                <td className="px-4 py-3 text-sm font-medium text-brand">{inv.id}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{inv.period}</td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-700">₹{inv.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{inv.shipments}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-success-bg text-success">{inv.status}</span></td>
                <td className="px-4 py-3 text-sm text-slate-500">{inv.date}</td>
                <td className="px-4 py-3"><button className="p-1.5 rounded-lg hover:bg-bg-elevated text-slate-400 hover:text-brand"><Download size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

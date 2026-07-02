'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Package, Search, Filter, Download, Plus, MapPin, Truck, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

const statusFilters = [
  { label: 'All', value: 'all', count: 12847 },
  { label: 'In Transit', value: 'in_transit', count: 1234 },
  { label: 'Delivered', value: 'delivered', count: 10982 },
  { label: 'NDR', value: 'ndr', count: 89 },
  { label: 'RTO', value: 'rto', count: 42 },
];

const shipments = [
  { id: 'PU9423508781', customer: 'Rahul Kumar', dest: 'Noida, UP', weight: '1.2 kg', courier: 'PU Fleet', status: 'In Transit', amount: '₹82', date: '30 Jun', sc: 'bg-info-bg text-info' },
  { id: 'PU8042777728', customer: 'Priya Singh', dest: 'G. Noida, UP', weight: '0.5 kg', courier: 'PU Fleet', status: 'Delivered', amount: '₹65', date: '30 Jun', sc: 'bg-success-bg text-success' },
  { id: 'PU7144123150', customer: 'Amit Verma', dest: 'Delhi', weight: '2.8 kg', courier: 'Delhivery', status: 'Out for Delivery', amount: '₹110', date: '29 Jun', sc: 'bg-brand-bg text-brand' },
  { id: 'PU3977214030', customer: 'Neha Sharma', dest: 'Gurgaon, HR', weight: '0.8 kg', courier: 'PU Fleet', status: 'Picked Up', amount: '₹72', date: '29 Jun', sc: 'bg-purple-bg text-purple' },
  { id: 'PU7593996197', customer: 'Vikash Yadav', dest: 'Lucknow, UP', weight: '1.5 kg', courier: 'Xpressbees', status: 'NDR', amount: '₹95', date: '28 Jun', sc: 'bg-warning-bg text-warning' },
  { id: 'PU8565086610', customer: 'Sanjay Gupta', dest: 'Varanasi, UP', weight: '3.2 kg', courier: 'PU Fleet', status: 'In Transit', amount: '₹125', date: '28 Jun', sc: 'bg-info-bg text-info' },
];

export default function ShipmentsPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Shipments</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage all your orders across couriers</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-border rounded-lg text-sm text-slate-600 hover:bg-bg-elevated transition-colors"><Download size={15} /> Export</button>
          <Link href="/dashboard/shipments/create" className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg shadow-md shadow-brand/20"><Plus size={15} /> New Shipment</Link>
        </div>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {statusFilters.map((f) => (
          <button key={f.value} onClick={() => setActiveFilter(f.value)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeFilter === f.value ? 'bg-brand text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-bg-elevated'}`}>
            {f.label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeFilter === f.value ? 'bg-white/20' : 'bg-bg-elevated'}`}>{f.count.toLocaleString()}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center bg-white border border-border rounded-lg">
          <Search size={15} className="text-slate-400 ml-3" />
          <input type="text" placeholder="Search by tracking ID, customer, destination..." className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 px-2.5 py-2 outline-none" />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-sm text-slate-500 hover:text-slate-700 hover:bg-bg-elevated transition-colors"><Filter size={14} /> Filters</button>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-elevated/50">
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tracking ID</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Destination</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Courier</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {shipments.map((s) => (
              <tr key={s.id} className="hover:bg-bg-elevated/50 transition-colors group cursor-pointer">
                <td className="px-4 py-3 text-sm font-medium text-brand">{s.id}</td>
                <td className="px-4 py-3 text-sm text-slate-700">{s.customer}</td>
                <td className="px-4 py-3 text-sm text-slate-500 flex items-center gap-1.5"><MapPin size={12} className="text-slate-400" />{s.dest}</td>
                <td className="px-4 py-3 text-sm text-slate-600 flex items-center gap-1.5"><Truck size={12} className="text-slate-400" />{s.courier}</td>
                <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${s.sc}`}>{s.status}</span></td>
                <td className="px-4 py-3 text-sm font-medium text-slate-700">{s.amount}</td>
                <td className="px-4 py-3"><button className="p-1 rounded hover:bg-bg-elevated text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-all"><MoreHorizontal size={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-slate-500">Showing 1-6 of 12,847</p>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded text-xs bg-brand text-white font-medium">1</button>
            <button className="px-2.5 py-1 rounded text-xs text-slate-500 hover:bg-bg-elevated">2</button>
            <button className="px-2.5 py-1 rounded text-xs text-slate-500 hover:bg-bg-elevated">3</button>
            <button className="px-3 py-1 rounded text-xs text-slate-500 hover:bg-bg-elevated">Next</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import { useState } from 'react';
import { AlertTriangle, Phone, MapPin, RotateCcw, Truck, MessageSquare, Search, Filter } from 'lucide-react';

const ndrCases = [
  { id: 'PU7593996197', recipient: 'Vikash Yadav', phone: '98765xxxxx', dest: 'Lucknow, UP', courier: 'Xpressbees', reason: 'Customer not available', attempts: 1, maxAttempts: 3, lastAttempt: '28 Jun, 3:30 PM' },
  { id: 'PU4823901245', recipient: 'Ravi Kumar', phone: '91234xxxxx', dest: 'Patna, BR', courier: 'PU Fleet', reason: 'Incorrect address', attempts: 2, maxAttempts: 3, lastAttempt: '29 Jun, 11:00 AM' },
  { id: 'PU3910284756', recipient: 'Sneha Jain', phone: '99887xxxxx', dest: 'Jaipur, RJ', courier: 'Delhivery', reason: 'Customer refused delivery', attempts: 1, maxAttempts: 3, lastAttempt: '30 Jun, 9:45 AM' },
  { id: 'PU6718203945', recipient: 'Mohit Agarwal', phone: '87654xxxxx', dest: 'Kanpur, UP', courier: 'Shadowfax', reason: 'Phone unreachable', attempts: 3, maxAttempts: 3, lastAttempt: '27 Jun, 4:15 PM' },
  { id: 'PU2847391056', recipient: 'Anita Sharma', phone: '93210xxxxx', dest: 'Noida, UP', courier: 'PU Fleet', reason: 'Door locked', attempts: 1, maxAttempts: 3, lastAttempt: '30 Jun, 2:00 PM' },
];

export default function NDRPage() {
  const [activeAction, setActiveAction] = useState(null);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-slate-800">NDR Management</h1><p className="text-sm text-slate-500 mt-0.5">Handle failed delivery attempts and take action</p></div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-warning-bg text-warning rounded-lg text-xs font-semibold">{ndrCases.length} Active Cases</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total NDR', value: '89', color: 'bg-warning-bg text-warning' },
          { label: 'Action Required', value: '5', color: 'bg-danger-bg text-danger' },
          { label: 'Reattempt Scheduled', value: '23', color: 'bg-info-bg text-info' },
          { label: 'Resolved', value: '61', color: 'bg-success-bg text-success' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-border rounded-xl p-4">
            <p className="text-xs text-slate-500 font-medium mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center bg-white border border-border rounded-lg">
          <Search size={15} className="text-slate-400 ml-3" />
          <input type="text" placeholder="Search by tracking ID, recipient..." className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 px-2.5 py-2 outline-none" />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg text-sm text-slate-500 hover:text-slate-700"><Filter size={14} /> Filters</button>
      </div>

      <div className="space-y-3">
        {ndrCases.map(c => (
          <div key={c.id} className="bg-white border border-border rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning-bg flex items-center justify-center shrink-0"><AlertTriangle size={18} className="text-warning" /></div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-brand">{c.id}</p>
                    <span className="px-1.5 py-0.5 bg-bg-elevated rounded text-[10px] font-medium text-slate-500">{c.courier}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-0.5">{c.recipient}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Phone size={10} /> {c.phone}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} /> {c.dest}</span>
                  </div>
                  <div className="mt-2 px-2.5 py-1.5 bg-warning-bg/50 rounded-lg inline-block">
                    <p className="text-xs text-warning font-medium">Reason: {c.reason}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span>Attempts: <strong className={c.attempts >= c.maxAttempts ? 'text-danger' : 'text-slate-600'}>{c.attempts}/{c.maxAttempts}</strong></span>
                    <span>Last: {c.lastAttempt}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {c.attempts < c.maxAttempts && (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand-dark"><RotateCcw size={12} /> Reattempt</button>
                )}
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-danger-bg text-danger text-xs font-semibold rounded-lg hover:bg-danger hover:text-white"><Truck size={12} /> RTO</button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-elevated text-slate-500 text-xs font-semibold rounded-lg hover:bg-bg-page"><MessageSquare size={12} /> Contact</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

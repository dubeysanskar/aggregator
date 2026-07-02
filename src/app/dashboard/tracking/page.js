'use client';

import { Search, MapPin, Check, ArrowRight } from 'lucide-react';

const events = [
  { status: 'Delivered', time: '30 Jun, 2:45 PM', location: 'Noida, UP', desc: 'Package delivered. Signed by: Rahul K.', color: 'bg-success' },
  { status: 'Out for Delivery', time: '30 Jun, 10:30 AM', location: 'Noida Hub', desc: 'Out for delivery with rider Nitin.', color: 'bg-brand' },
  { status: 'Arrived at Hub', time: '29 Jun, 8:15 PM', location: 'Noida Sorting Center', desc: 'Package at local hub.', color: 'bg-info' },
  { status: 'In Transit', time: '29 Jun, 11:00 AM', location: 'Delhi Hub', desc: 'Dispatched to destination.', color: 'bg-purple' },
  { status: 'Picked Up', time: '28 Jun, 4:30 PM', location: 'South Delhi', desc: 'Picked up from seller.', color: 'bg-warning' },
  { status: 'Order Placed', time: '28 Jun, 2:00 PM', location: 'Online', desc: 'Shipment created.', color: 'bg-slate-400' },
];

export default function TrackingPage() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-slate-800">Track Shipment</h1>
        <p className="text-sm text-slate-500">Enter any tracking ID to see real-time status</p>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" placeholder="Enter tracking ID (e.g. PU9423508781)" className="w-full pl-11 pr-24 py-3.5 bg-white border border-border rounded-xl text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand-bg shadow-sm" />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-4 py-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg">Track <ArrowRight size={14} /></button>
      </div>

      <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-bg flex items-center justify-center"><Check size={20} className="text-success" /></div>
            <div><p className="text-sm font-semibold text-success">Delivered</p><p className="text-xs text-slate-500">PU9423508781</p></div>
          </div>
          <div className="text-right"><p className="text-xs text-slate-500">Courier</p><p className="text-sm font-medium text-slate-700">Parcel Uncle Fleet</p></div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
          <div><p className="text-[10px] text-slate-500 uppercase">From</p><p className="text-sm text-slate-700 mt-0.5">South Delhi</p></div>
          <div><p className="text-[10px] text-slate-500 uppercase">To</p><p className="text-sm text-slate-700 mt-0.5">Noida, UP</p></div>
          <div><p className="text-[10px] text-slate-500 uppercase">Time</p><p className="text-sm text-slate-700 mt-0.5">2 days</p></div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 mb-5">Shipment Timeline</h3>
        {events.map((e, i) => (
          <div key={i} className="flex gap-4 pb-6 last:pb-0">
            <div className="relative flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${e.color} ring-4 ring-white z-10 shrink-0`} />
              {i < events.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
            </div>
            <div className="-mt-1">
              <p className="text-sm font-medium text-slate-700">{e.status}</p>
              <p className="text-xs text-slate-500 mt-0.5">{e.time}</p>
              <p className="text-xs text-slate-500 mt-1">{e.desc}</p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {e.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

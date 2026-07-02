'use client';

import {
  Package, Truck, CheckCircle2, AlertTriangle, RotateCcw, Clock,
  TrendingUp, TrendingDown, IndianRupee, ArrowUpRight,
  Wallet, Calculator, Eye, Upload, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Total Shipments', value: '12,847', change: '+12.3%', up: true, icon: Package, iconBg: 'bg-brand-bg', iconColor: 'text-brand' },
  { label: 'In Transit', value: '1,234', change: '+8.1%', up: true, icon: Truck, iconBg: 'bg-info-bg', iconColor: 'text-info' },
  { label: 'Delivered', value: '10,982', change: '+15.2%', up: true, icon: CheckCircle2, iconBg: 'bg-success-bg', iconColor: 'text-success' },
  { label: 'NDR Cases', value: '89', change: '-4.5%', up: false, icon: AlertTriangle, iconBg: 'bg-warning-bg', iconColor: 'text-warning' },
  { label: 'RTO', value: '42', change: '-2.1%', up: false, icon: RotateCcw, iconBg: 'bg-danger-bg', iconColor: 'text-danger' },
  { label: 'Avg. Delivery', value: '1.8 days', change: '-0.3d', up: false, icon: Clock, iconBg: 'bg-purple-bg', iconColor: 'text-purple' },
];

const recentShipments = [
  { id: 'PU9423508781', status: 'In Transit', dest: 'Noida', date: 'Today', statusColor: 'bg-info-bg text-info' },
  { id: 'PU8042777728', status: 'Delivered', dest: 'Greater Noida', date: 'Today', statusColor: 'bg-success-bg text-success' },
  { id: 'PU7144123150', status: 'Out for Delivery', dest: 'Delhi', date: 'Today', statusColor: 'bg-brand-bg text-brand' },
  { id: 'PU3977214030', status: 'Picked Up', dest: 'Gurgaon', date: 'Yesterday', statusColor: 'bg-purple-bg text-purple' },
  { id: 'PU7593996197', status: 'NDR', dest: 'Lucknow', date: 'Yesterday', statusColor: 'bg-warning-bg text-warning' },
];

const courierPerformance = [
  { name: 'Parcel Uncle Fleet', deliveries: 8420, successRate: 96.2, avgDays: 1.4, color: 'bg-brand' },
  { name: 'Delhivery', deliveries: 2340, successRate: 91.5, avgDays: 2.1, color: 'bg-red-500' },
  { name: 'Xpressbees', deliveries: 1580, successRate: 89.8, avgDays: 2.4, color: 'bg-emerald-500' },
  { name: 'Shadowfax', deliveries: 507, successRate: 87.3, avgDays: 2.8, color: 'bg-orange-500' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function DashboardPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Welcome back. Here&apos;s your logistics overview.</p>
        </div>
        <select className="bg-white border border-border rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-brand focus:ring-2 focus:ring-brand-bg">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>This month</option>
        </select>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-border rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                  <Icon size={18} className={stat.iconColor} />
                </div>
                <span className={`flex items-center gap-0.5 text-[11px] font-semibold ${stat.up ? 'text-success' : 'text-danger'}`}>
                  {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stat.change}
                </span>
              </div>
              <p className="text-xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Revenue + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={item} className="lg:col-span-2 bg-white border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Revenue Overview</h2>
              <p className="text-xs text-slate-500 mt-0.5">Shipping charges collected this period</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-slate-500">This Month</p>
                <p className="text-lg font-bold text-slate-800 flex items-center gap-1"><IndianRupee size={16} />4,82,350</p>
              </div>
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-success-bg text-success text-xs font-semibold">
                <ArrowUpRight size={14} /> 18.2%
              </span>
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-40">
            {[40,65,45,80,55,95,70,85,60,90,75,100,50,88,72,93,68,82,55,78,95,88,70,60,85,92,80,75,98,72].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-brand/20 to-brand/50 hover:from-brand/40 hover:to-brand/70 transition-colors cursor-default" style={{ height: `${h}%` }} />
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white border border-border rounded-xl p-5 space-y-2">
          <h2 className="text-sm font-semibold text-slate-800 mb-2">Quick Actions</h2>
          {[
            { label: 'Create Shipment', desc: 'Book a new order', icon: Zap, href: '/dashboard/shipments/create', color: 'bg-brand-bg text-brand' },
            { label: 'Rate Calculator', desc: 'Compare courier rates', icon: Calculator, href: '/dashboard/rates', color: 'bg-success-bg text-success' },
            { label: 'Track Shipment', desc: 'Enter tracking ID', icon: Eye, href: '/dashboard/tracking', color: 'bg-purple-bg text-purple' },
            { label: 'Wallet Recharge', desc: 'Add funds to wallet', icon: Wallet, href: '/dashboard/wallet', color: 'bg-warning-bg text-warning' },
            { label: 'Bulk Upload', desc: 'Upload CSV/Excel', icon: Upload, href: '/dashboard/shipments/bulk', color: 'bg-info-bg text-info' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <a key={action.label} href={action.href} className="group flex items-center gap-3 p-2.5 rounded-lg hover:bg-bg-elevated transition-colors">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${action.color}`}><Icon size={18} /></div>
                <div>
                  <p className="text-[13px] font-medium text-slate-700 group-hover:text-slate-900">{action.label}</p>
                  <p className="text-[11px] text-slate-400">{action.desc}</p>
                </div>
              </a>
            );
          })}
        </motion.div>
      </div>

      {/* Recent Shipments + Courier Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={item} className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-slate-800">Recent Shipments</h2>
            <a href="/dashboard/shipments" className="text-xs text-brand hover:text-brand-dark font-medium">View all →</a>
          </div>
          <div className="divide-y divide-border">
            {recentShipments.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3 hover:bg-bg-elevated transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center"><Package size={14} className="text-slate-400" /></div>
                  <div>
                    <p className="text-[13px] font-medium text-slate-700">{s.id}</p>
                    <p className="text-[11px] text-slate-400">{s.dest} · {s.date}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${s.statusColor}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-slate-800">Courier Performance</h2>
            <a href="/dashboard/couriers" className="text-xs text-brand hover:text-brand-dark font-medium">Details →</a>
          </div>
          <div className="p-5 space-y-4">
            {courierPerformance.map((c) => (
              <div key={c.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${c.color}`} />
                    <span className="text-[13px] font-medium text-slate-700">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span>{c.deliveries.toLocaleString()} orders</span>
                    <span className="text-success font-semibold">{c.successRate}%</span>
                    <span>{c.avgDays}d avg</span>
                  </div>
                </div>
                <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.successRate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

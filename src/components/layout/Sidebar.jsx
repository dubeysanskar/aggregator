'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, Plus, Upload, MapPin, Wallet,
  Calculator, FileText, AlertTriangle, RotateCcw, Banknote,
  Settings, Tag, BarChart3, Truck, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Shipments', href: '/dashboard/shipments', icon: Package },
  { label: 'Create Shipment', href: '/dashboard/shipments/create', icon: Plus },
  { label: 'Bulk Upload', href: '/dashboard/shipments/bulk', icon: Upload },
  { label: 'Tracking', href: '/dashboard/tracking', icon: MapPin },
  { label: 'Rate Calculator', href: '/dashboard/rates', icon: Calculator },
  { type: 'divider', label: 'Financial' },
  { label: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
  { label: 'COD Settlements', href: '/dashboard/cod', icon: Banknote },
  { label: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  { type: 'divider', label: 'Operations' },
  { label: 'NDR Cases', href: '/dashboard/ndr', icon: AlertTriangle },
  { label: 'RTO / Returns', href: '/dashboard/rto', icon: RotateCcw },
  { label: 'Labels', href: '/dashboard/labels', icon: Tag },
  { type: 'divider', label: 'Insights' },
  { label: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { label: 'Courier Performance', href: '/dashboard/couriers', icon: Truck },
  { type: 'divider', label: 'System' },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`fixed top-0 left-0 h-screen bg-sidebar flex flex-col z-40 transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-[250px]'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-sm shrink-0">
          PU
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold text-white whitespace-nowrap">Parcel Uncle</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Aggregator</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
        {navItems.map((item, i) => {
          if (item.type === 'divider') {
            return (
              <div key={i} className="pt-4 pb-1.5 px-2">
                {!collapsed && (
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                    {item.label}
                  </span>
                )}
                {collapsed && <div className="h-px bg-white/10 mx-1" />}
              </div>
            );
          }

          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150
                ${isActive
                  ? 'bg-brand text-white shadow-lg shadow-brand/25'
                  : 'text-slate-400 hover:text-white hover:bg-sidebar-hover'
                }
                ${collapsed ? 'justify-center px-2' : ''}
              `}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-2.5 space-y-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-slate-500 hover:text-white hover:bg-sidebar-hover transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
        <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors ${collapsed ? 'justify-center px-2' : ''}`}>
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

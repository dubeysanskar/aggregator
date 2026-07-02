'use client';

import { Bell, Search, ChevronDown } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-border flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center flex-1 max-w-md">
        <div className="flex items-center w-full bg-bg-input border border-border rounded-lg">
          <Search size={15} className="text-slate-400 ml-3 shrink-0" />
          <input
            type="text"
            placeholder="Search shipments, tracking IDs..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 px-2.5 py-2 outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 mr-2 text-[10px] font-medium text-slate-400 bg-bg-page rounded border border-border">⌘K</kbd>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-bg-elevated transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-white" />
        </button>

        <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-bg-elevated transition-colors ml-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand to-purple flex items-center justify-center text-[11px] font-bold text-white">M</div>
          <div className="hidden sm:block text-left">
            <p className="text-[13px] font-medium text-slate-800 leading-tight">Merchant</p>
            <p className="text-[10px] text-slate-400 leading-tight">Pro Plan</p>
          </div>
          <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
        </button>
      </div>
    </header>
  );
}

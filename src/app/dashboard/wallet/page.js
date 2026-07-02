'use client';

import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight, Plus, IndianRupee, Clock } from 'lucide-react';

const transactions = [
  { id: 1, type: 'debit', desc: 'Shipment PU9423508781', amount: 82, date: '30 Jun, 2:00 PM', balance: 4918 },
  { id: 2, type: 'debit', desc: 'Shipment PU8042777728', amount: 65, date: '30 Jun, 11:30 AM', balance: 5000 },
  { id: 3, type: 'credit', desc: 'Wallet Recharge', amount: 5000, date: '29 Jun, 9:00 AM', balance: 5065 },
  { id: 4, type: 'credit', desc: 'COD Settlement #142', amount: 3200, date: '28 Jun, 5:00 PM', balance: 65 },
  { id: 5, type: 'debit', desc: 'Shipment PU7144123150', amount: 110, date: '28 Jun, 10:00 AM', balance: -3135 },
  { id: 6, type: 'credit', desc: 'Refund - Cancelled', amount: 72, date: '27 Jun, 3:00 PM', balance: -3025 },
];

export default function WalletPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Wallet</h1>
          <p className="text-sm text-slate-500">Manage your balance and transactions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg shadow-md shadow-brand/20"><Plus size={15} /> Add Money</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 bg-gradient-to-br from-sidebar via-slate-800 to-sidebar border border-slate-700 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <p className="text-xs text-slate-300 font-medium mb-1">Available Balance</p>
            <p className="text-3xl font-bold text-white flex items-center gap-1"><IndianRupee size={24} />4,918<span className="text-lg text-slate-400">.00</span></p>
            <div className="flex items-center gap-4 mt-4">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-brand hover:bg-brand-dark rounded-lg text-xs font-medium text-white"><Plus size={14} /> Recharge</button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white"><Clock size={14} /> History</button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 font-medium">Total Credited</p>
            <div className="w-8 h-8 rounded-lg bg-success-bg flex items-center justify-center"><ArrowDownRight size={16} className="text-success" /></div>
          </div>
          <p className="text-xl font-bold text-slate-800">₹52,340</p>
          <p className="text-[11px] text-slate-500 mt-1">+₹5,000 today</p>
        </div>

        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-500 font-medium">Total Debited</p>
            <div className="w-8 h-8 rounded-lg bg-danger-bg flex items-center justify-center"><ArrowUpRight size={16} className="text-danger" /></div>
          </div>
          <p className="text-xl font-bold text-slate-800">₹47,422</p>
          <p className="text-[11px] text-slate-500 mt-1">₹147 today</p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-slate-800">Recent Transactions</h2>
          <button className="text-xs text-brand hover:text-brand-dark font-medium">View all →</button>
        </div>
        <div className="divide-y divide-border">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-bg-elevated transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'credit' ? 'bg-success-bg' : 'bg-danger-bg'}`}>
                  {tx.type === 'credit' ? <ArrowDownRight size={14} className="text-success" /> : <ArrowUpRight size={14} className="text-danger" />}
                </div>
                <div>
                  <p className="text-sm text-slate-700">{tx.desc}</p>
                  <p className="text-[11px] text-slate-400">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-success' : 'text-danger'}`}>{tx.type === 'credit' ? '+' : '-'}₹{tx.amount}</p>
                <p className="text-[11px] text-slate-400">Bal: ₹{tx.balance.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

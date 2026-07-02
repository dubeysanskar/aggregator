'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, ArrowRight, Truck, Shield, Zap } from 'lucide-react';

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-sidebar items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple/10 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand/25">PU</div>
            <div>
              <h1 className="text-2xl font-bold text-white">Parcel Uncle</h1>
              <p className="text-xs text-blue-300/70 font-medium uppercase tracking-widest">Aggregator Platform</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Ship smarter with<br />
            <span className="text-blue-400">India&apos;s best couriers</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-10">
            One platform, multiple couriers. Automatically route every shipment to the fastest, cheapest, and most reliable courier partner.
          </p>

          <div className="space-y-5">
            {[
              { icon: Zap, label: 'Smart Courier Selection', desc: 'AI picks the best courier for every order' },
              { icon: Truck, label: 'Unified Tracking', desc: 'Track all couriers in one dashboard' },
              { icon: Shield, label: 'Secure & Reliable', desc: '99.9% uptime with enterprise security' },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5"><Icon size={16} className="text-blue-400" /></div>
                  <div>
                    <p className="text-sm font-medium text-white">{f.label}</p>
                    <p className="text-xs text-slate-400">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-bg-page">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white font-bold shadow-lg shadow-brand/25">PU</div>
            <h1 className="text-xl font-bold text-slate-800">Parcel Uncle</h1>
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-500 mb-8">Sign in to your merchant account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Email or Phone</label>
              <input type="text" placeholder="you@company.com" className="w-full px-3.5 py-2.5 bg-white border border-border rounded-lg text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand-bg transition-all" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" className="w-full px-3.5 py-2.5 bg-white border border-border rounded-lg text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand-bg transition-all pr-10" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-border accent-brand" />
                <span className="text-slate-500 text-xs">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-xs text-brand hover:text-brand-dark font-medium">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-brand/20 disabled:opacity-50">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Don&apos;t have an account?{' '}
            <a href="/register" className="text-brand hover:text-brand-dark font-medium">Sign up free</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

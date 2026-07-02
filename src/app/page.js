'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Truck, Shield, Zap, Package, Globe, BarChart3, Users, Building2, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [isLanding, setIsLanding] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const host = window.location.hostname;
    if (host.startsWith('landing')) {
      setIsLanding(true);
    } else {
      router.push('/dashboard');
    }
  }, [router]);

  if (!mounted || !isLanding) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
      </div>
    );
  }

  const portals = [
    {
      title: 'Merchant Portal',
      desc: 'Ship smarter with AI-powered courier selection. One dashboard for all your shipments.',
      href: 'https://merchant.lekyalogistics.com/login',
      badge: 'PU', badgeBg: 'bg-brand', color: 'text-blue-400', borderColor: 'hover:border-brand/40',
    },
    {
      title: 'Admin Console',
      desc: 'Full platform control. Manage merchants, carriers, billing, and system settings.',
      href: 'https://admin.lekyalogistics.com/login',
      badge: 'A', badgeBg: 'bg-red-600', color: 'text-red-400', borderColor: 'hover:border-red-500/40',
    },
    {
      title: 'Carrier Partner',
      desc: 'Connect your courier company. Accept shipments, manage fleet, and grow your business.',
      href: 'https://carrier.lekyalogistics.com/login',
      badge: 'CP', badgeBg: 'bg-emerald-600', color: 'text-emerald-400', borderColor: 'hover:border-emerald-500/40',
    },
  ];

  const features = [
    { icon: Zap, title: 'Smart Routing', desc: 'AI picks the best courier for every shipment based on speed, cost, and reliability.' },
    { icon: BarChart3, title: 'Real-time Analytics', desc: 'Track performance metrics, delivery rates, and revenue across all courier partners.' },
    { icon: Package, title: 'Multi-Carrier', desc: 'Delhivery, Xpressbees, Shadowfax, BlueDart and your own fleet — all in one place.' },
    { icon: Shield, title: 'Enterprise Security', desc: '99.9% uptime with bank-grade encryption and SOC2-compliant infrastructure.' },
    { icon: Globe, title: 'Pan-India Coverage', desc: '29,000+ pin codes covered with same-day, next-day, and express delivery options.' },
    { icon: Users, title: 'White Label Ready', desc: 'Custom branded tracking pages, notifications, and merchant dashboards.' },
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] text-white overflow-hidden">
      <div className="fixed inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-brand/8 rounded-full blur-[150px]" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-purple/8 rounded-full blur-[120px]" />

      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-16 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white font-bold shadow-lg shadow-brand/25">PU</div>
          <div>
            <h1 className="text-lg font-bold">Lekya Logistics</h1>
            <p className="text-[10px] text-blue-300/50 font-medium uppercase tracking-[0.2em]">Aggregator Platform</p>
          </div>
        </div>
        <a href="https://merchant.lekyalogistics.com/login" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-brand/20">
          Get Started <ArrowRight size={16} />
        </a>
      </nav>

      <section className="animate-fade-in relative z-10 px-6 lg:px-16 pt-16 pb-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-blue-300 font-medium mb-6">
          <Truck size={14} /> India&apos;s Smartest Shipping Aggregator
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
          Ship with the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">best courier</span> at the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">lowest cost</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          One platform to connect merchants, courier partners, and logistics operations. Automatically route every shipment to the fastest and most reliable carrier.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="https://merchant.lekyalogistics.com/register" className="flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl transition-all shadow-xl shadow-brand/25 text-sm">
            Start Shipping Free <ArrowRight size={16} />
          </a>
          <a href="https://carrier.lekyalogistics.com/login" className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all text-sm">
            Join as Carrier <Building2 size={16} />
          </a>
        </div>
      </section>

      <section className="animate-fade-in relative z-10 px-6 lg:px-16 py-16 max-w-5xl mx-auto">
        <h2 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">Choose Your Portal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {portals.map((p) => (
            <a key={p.title} href={p.href} className={`group p-5 bg-white/[0.03] border border-white/[0.06] ${p.borderColor} rounded-2xl transition-all hover:bg-white/[0.06] hover:-translate-y-1`}>
              <div className={`w-11 h-11 rounded-xl ${p.badgeBg} flex items-center justify-center text-white font-bold text-sm mb-4 shadow-lg`}>{p.badge}</div>
              <h3 className="text-base font-semibold text-white mb-1.5">{p.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">{p.desc}</p>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold ${p.color}`}>
                Open Portal <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="animate-fade-in relative z-10 px-6 lg:px-16 py-16 max-w-5xl mx-auto">
        <h2 className="text-center text-2xl font-bold mb-3">Why Lekya Logistics?</h2>
        <p className="text-center text-sm text-slate-400 mb-10 max-w-xl mx-auto">Everything you need to run a world-class shipping operation</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:bg-white/[0.04] transition-all">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="relative z-10 px-6 lg:px-16 py-8 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-xs">PU</div>
            <span className="text-sm text-slate-500">© 2026 Lekya Logistics. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <a href="https://merchant.lekyalogistics.com/login" className="hover:text-white transition-colors">Merchant</a>
            <a href="https://admin.lekyalogistics.com/login" className="hover:text-white transition-colors">Admin</a>
            <a href="https://carrier.lekyalogistics.com/login" className="hover:text-white transition-colors">Carrier</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

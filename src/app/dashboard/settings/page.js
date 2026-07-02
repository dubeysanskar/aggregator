'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, MapPin, Key, Bell, Plus, Pencil, Trash2, Copy, Eye, EyeOff, Save } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'addresses', label: 'Pickup Addresses', icon: MapPin },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const addresses = [
  { id: 1, label: 'Main Warehouse', contact: 'Rajesh Kumar', phone: '9876543210', address: '42, Sector 15, Noida', city: 'Noida', pincode: '201301', isDefault: true },
  { id: 2, label: 'South Delhi Office', contact: 'Ankit Singh', phone: '9123456789', address: 'B-12, Saket, New Delhi', city: 'New Delhi', pincode: '110017', isDefault: false },
];

const apiKeys = [
  { id: 1, name: 'Production Key', key: 'pu_live_k8Jd92mKx...', created: '15 Jun 2026', lastUsed: '30 Jun 2026', status: 'Active' },
  { id: 2, name: 'Test Key', key: 'pu_test_m3Nq84pLy...', created: '10 Jun 2026', lastUsed: '28 Jun 2026', status: 'Active' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div><h1 className="text-xl font-bold text-slate-800">Settings</h1><p className="text-sm text-slate-500 mt-0.5">Manage your account, addresses, and integrations</p></div>

      <div className="flex gap-6">
        <div className="w-52 shrink-0 space-y-1">
          {tabs.map(t => { const Icon = t.icon; return (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? 'bg-brand-bg text-brand' : 'text-slate-500 hover:bg-bg-elevated hover:text-slate-700'}`}>
              <Icon size={16} /> {t.label}
            </button>
          ); })}
        </div>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white border border-border rounded-xl p-6 space-y-5">
              <h3 className="text-sm font-semibold text-slate-800">Company Profile</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Company Name', 'Acme Store Pvt Ltd'], ['Brand Name', 'Acme Store'],
                  ['Email', 'admin@acmestore.com'], ['Phone', '+91 9876543210'],
                  ['GST Number', '07AABCU9603R1Z1'], ['Website', 'https://acmestore.com'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
                    <input type="text" defaultValue={value} className="w-full px-3 py-2.5 bg-bg-input border border-border rounded-lg text-sm text-slate-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand-bg" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Address</label>
                <textarea defaultValue="42, Sector 15, Industrial Area, Noida, UP 201301" className="w-full px-3 py-2.5 bg-bg-input border border-border rounded-lg text-sm text-slate-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand-bg resize-none" rows={2} />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg shadow-md shadow-brand/20"><Save size={15} /> Save Changes</button>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Pickup Addresses</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-brand hover:bg-brand-dark text-white text-xs font-semibold rounded-lg"><Plus size={14} /> Add Address</button>
              </div>
              {addresses.map(a => (
                <div key={a.id} className={`bg-white border rounded-xl p-4 ${a.isDefault ? 'border-brand shadow-sm' : 'border-border'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-700">{a.label}</p>
                        {a.isDefault && <span className="px-1.5 py-0.5 bg-brand-bg text-brand rounded text-[10px] font-bold">Default</span>}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{a.contact} · {a.phone}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{a.address}, {a.city} — {a.pincode}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-bg-elevated text-slate-400 hover:text-brand"><Pencil size={14} /></button>
                      {!a.isDefault && <button className="p-1.5 rounded-lg hover:bg-danger-bg text-slate-400 hover:text-danger"><Trash2 size={14} /></button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">API Keys</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-brand hover:bg-brand-dark text-white text-xs font-semibold rounded-lg"><Plus size={14} /> Generate Key</button>
              </div>
              {apiKeys.map(k => (
                <div key={k.id} className="bg-white border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{k.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs text-slate-500 bg-bg-elevated px-2 py-0.5 rounded font-mono">{k.key}</code>
                        <button className="p-1 hover:bg-bg-elevated rounded text-slate-400 hover:text-brand"><Copy size={12} /></button>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Created: {k.created} · Last used: {k.lastUsed}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-success-bg text-success">{k.status}</span>
                  </div>
                </div>
              ))}
              <div className="bg-bg-page border border-border rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-2 font-medium">API Documentation</p>
                <p className="text-sm text-slate-600">Base URL: <code className="text-brand bg-brand-bg px-1.5 py-0.5 rounded text-xs">https://api.aggregator.parceluncle.com/v1/</code></p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white border border-border rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-800">Notification Preferences</h3>
              {[
                ['Order Updates', 'Get notified when shipment status changes', true],
                ['NDR Alerts', 'Alert when delivery attempt fails', true],
                ['COD Settlement', 'Notification when COD is settled', true],
                ['Wallet Low Balance', 'Alert when balance drops below ₹500', false],
                ['Weekly Reports', 'Receive weekly performance summary', true],
                ['Marketing', 'Product updates and offers', false],
              ].map(([label, desc, enabled]) => (
                <div key={label} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{label}</p>
                    <p className="text-xs text-slate-400">{desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={enabled} className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-200 peer-checked:bg-brand rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

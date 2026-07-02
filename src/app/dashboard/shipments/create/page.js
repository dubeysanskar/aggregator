'use client';

import { useState } from 'react';
import { Package, MapPin, IndianRupee, Zap, Clock, Check, ChevronRight, ArrowLeft, Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const courierOptions = [
  { id: 'pu_fleet', name: 'Parcel Uncle Fleet', rate: 72, days: 1, success: 96.2, rto: 1.8, score: 98, recommended: true, tags: ['Cheapest', 'Fastest'], logo: 'PU' },
  { id: 'delhivery', name: 'Delhivery', rate: 83, days: 2, success: 91.5, rto: 4.2, score: 91, tags: ['Reliable'], logo: 'DL' },
  { id: 'xpressbees', name: 'Xpressbees', rate: 78, days: 2, success: 89.8, rto: 5.1, score: 87, tags: ['Wide Coverage'], logo: 'XB' },
  { id: 'bluedart', name: 'Blue Dart', rate: 110, days: 1, success: 94.0, rto: 2.5, score: 85, tags: ['Premium'], logo: 'BD' },
  { id: 'shadowfax', name: 'Shadowfax', rate: 68, days: 3, success: 87.3, rto: 6.8, score: 78, tags: ['Budget'], logo: 'SF' },
];

export default function CreateShipmentPage() {
  const [step, setStep] = useState(1);
  const [selectedCourier, setSelectedCourier] = useState('pu_fleet');
  const [paymentMode, setPaymentMode] = useState('prepaid');

  const Input = ({ label, placeholder, colSpan, type }) => (
    <div className={colSpan === 2 ? 'col-span-2' : ''}>
      <label className="block text-[11px] text-slate-500 mb-1 font-medium">{label}</label>
      <input type={type || 'text'} className="w-full px-3 py-2 bg-bg-input border border-border rounded-lg text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand-bg" placeholder={placeholder} />
    </div>
  );

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/shipments" className="p-2 rounded-lg hover:bg-bg-elevated text-slate-400 hover:text-slate-700 transition-colors"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Create Shipment</h1>
          <p className="text-sm text-slate-500">Fill details and choose the best courier</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {['Shipment Details', 'Choose Courier', 'Confirm & Ship'].map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg flex-1 ${step === i+1 ? 'bg-brand-bg border border-brand/20' : step > i+1 ? 'bg-success-bg' : 'bg-white border border-border'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === i+1 ? 'bg-brand text-white' : step > i+1 ? 'bg-success text-white' : 'bg-bg-elevated text-slate-400'}`}>
                {step > i+1 ? <Check size={12} /> : i+1}
              </div>
              <span className={`text-xs font-medium ${step === i+1 ? 'text-brand' : step > i+1 ? 'text-success' : 'text-slate-400'}`}>{s}</span>
            </div>
            {i < 2 && <ChevronRight size={14} className="text-slate-300 shrink-0" />}
          </div>
        ))}
      </div>

      
        {step === 1 && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-success-bg flex items-center justify-center"><MapPin size={16} className="text-success" /></div><h3 className="text-sm font-semibold text-slate-700">Pickup Address</h3></div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Full Address" placeholder="Street, building, area" colSpan={2} />
                <Input label="Pincode" placeholder="110001" />
                <Input label="City" placeholder="New Delhi" />
              </div>
            </div>
            <div className="bg-white border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-brand-bg flex items-center justify-center"><MapPin size={16} className="text-brand" /></div><h3 className="text-sm font-semibold text-slate-700">Delivery Address</h3></div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Recipient Name" placeholder="Full name" />
                <Input label="Phone" placeholder="9876543210" />
                <Input label="Full Address" placeholder="Street, building, area" colSpan={2} />
                <Input label="Pincode" placeholder="201301" />
                <Input label="City" placeholder="Noida" />
              </div>
            </div>
            <div className="bg-white border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-purple-bg flex items-center justify-center"><Package size={16} className="text-purple" /></div><h3 className="text-sm font-semibold text-slate-700">Package Details</h3></div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Weight (kg)" placeholder="0.5" type="number" />
                <Input label="Product Description" placeholder="Electronics, Clothing..." />
              </div>
            </div>
            <div className="bg-white border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-warning-bg flex items-center justify-center"><IndianRupee size={16} className="text-warning" /></div><h3 className="text-sm font-semibold text-slate-700">Payment</h3></div>
              <div className="flex gap-3">
                <button onClick={() => setPaymentMode('prepaid')} className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all ${paymentMode === 'prepaid' ? 'bg-brand-bg border-brand/30 text-brand' : 'bg-bg-input border-border text-slate-400'}`}>Prepaid</button>
                <button onClick={() => setPaymentMode('cod')} className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all ${paymentMode === 'cod' ? 'bg-warning-bg border-warning/30 text-warning' : 'bg-bg-input border-border text-slate-400'}`}>Cash on Delivery</button>
              </div>
              {paymentMode === 'cod' && <Input label="COD Amount (₹)" placeholder="1500" type="number" />}
            </div>
            <div className="lg:col-span-2 flex justify-end">
              <button onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg shadow-md shadow-brand/20">Choose Courier <ChevronRight size={16} /></button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in space-y-4">
            <div className="bg-gradient-to-r from-brand-bg via-purple-bg to-info-bg border border-brand/10 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shrink-0"><Zap size={20} className="text-white" /></div>
              <div>
                <p className="text-sm font-semibold text-slate-800">AI Courier Recommendation</p>
                <p className="text-xs text-slate-500">Based on cost, speed, success rate, and RTO history</p>
              </div>
            </div>
            <div className="space-y-3">
              {courierOptions.map((c) => (
                <div key={c.id} onClick={() => setSelectedCourier(c.id)} className={`relative bg-white border rounded-xl p-4 cursor-pointer transition-all ${selectedCourier === c.id ? 'border-brand shadow-md shadow-brand/10' : 'border-border hover:border-slate-300 hover:shadow-sm'}`}>
                  {c.recommended && <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 bg-brand rounded-full text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1"><Award size={10} /> Recommended</div>}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${selectedCourier === c.id ? 'bg-brand text-white' : 'bg-bg-elevated text-slate-500'}`}>{c.logo}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                          {c.tags.map((t) => <span key={t} className="px-1.5 py-0.5 bg-bg-elevated rounded text-[10px] font-medium text-slate-500">{t}</span>)}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Clock size={11} /> {c.days} day{c.days > 1 ? 's' : ''}</span>
                          <span className="flex items-center gap-1"><TrendingUp size={11} /> {c.success}%</span>
                          <span>RTO {c.rto}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-800">₹{c.rate}</p>
                        <p className="text-[10px] text-slate-500">incl. GST</p>
                      </div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${c.score >= 95 ? 'bg-success-bg text-success' : c.score >= 85 ? 'bg-brand-bg text-brand' : 'bg-warning-bg text-warning'}`}>{c.score}</div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedCourier === c.id ? 'border-brand bg-brand' : 'border-slate-300'}`}>{selectedCourier === c.id && <Check size={12} className="text-white" />}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-slate-700"><ArrowLeft size={16} /> Back</button>
              <button onClick={() => setStep(3)} className="flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg shadow-md shadow-brand/20">Confirm & Ship <ChevronRight size={16} /></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <div className="bg-white border border-border rounded-xl p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-success-bg flex items-center justify-center"><Check size={32} className="text-success" /></div>
              <h2 className="text-lg font-bold text-slate-800">Ready to Ship!</h2>
              <p className="text-sm text-slate-500">Your shipment will be booked with <span className="text-brand font-medium">{courierOptions.find(c => c.id === selectedCourier)?.name}</span> at <span className="text-slate-800 font-semibold">₹{courierOptions.find(c => c.id === selectedCourier)?.rate}</span></p>
              <div className="flex justify-center gap-3 pt-2">
                <button onClick={() => setStep(2)} className="px-4 py-2 bg-bg-elevated border border-border text-sm text-slate-600 rounded-lg hover:bg-bg-card-hover">Go Back</button>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-success hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-success/20"><Zap size={16} /> Ship Now</button>
              </div>
            </div>
          </div>
        )}
      
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Check, ArrowRight } from 'lucide-react';

export default function VerifyPage() {
  const [step, setStep] = useState('email'); // email → phone → done
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (i, value) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[i] = value;
    setCode(newCode);
    if (value && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (step === 'email') {
      setStep('phone');
      setCode(['', '', '', '', '', '']);
    } else {
      setStep('done');
      setTimeout(() => { window.location.href = '/dashboard'; }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white font-bold shadow-lg shadow-brand/25">PU</div>
          <h1 className="text-xl font-bold text-slate-800">Parcel Uncle</h1>
        </div>

        {step !== 'done' ? (
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <div className="text-center mb-6">
              <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 ${step === 'email' ? 'bg-brand-bg' : 'bg-success-bg'}`}>
                {step === 'email' ? <Mail size={24} className="text-brand" /> : <Phone size={24} className="text-success" />}
              </div>
              <h2 className="text-lg font-bold text-slate-800">
                {step === 'email' ? 'Verify your email' : 'Verify your phone'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {step === 'email'
                  ? 'We sent a 6-digit code to you@company.com'
                  : 'We sent an OTP to +91 98765•••10'
                }
              </p>
            </div>

            <div className="flex justify-center gap-2 mb-6">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-12 text-center text-lg font-bold bg-bg-input border border-border rounded-lg text-slate-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand-bg transition-all"
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg shadow-md shadow-brand/20"
            >
              Verify <ArrowRight size={16} />
            </button>

            <p className="text-center text-xs text-slate-500 mt-4">
              Didn&apos;t receive a code?{' '}
              <button className="text-brand hover:text-brand-dark font-medium">Resend</button>
            </p>

            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-border">
              <div className={`flex items-center gap-1.5 text-xs font-medium ${step === 'email' ? 'text-brand' : 'text-success'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 'email' ? 'bg-brand text-white' : 'bg-success text-white'}`}>
                  {step === 'email' ? '1' : <Check size={12} />}
                </div>
                Email
              </div>
              <div className="w-8 h-px bg-border" />
              <div className={`flex items-center gap-1.5 text-xs font-medium ${step === 'phone' ? 'text-brand' : 'text-slate-400'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 'phone' ? 'bg-brand text-white' : 'bg-bg-elevated text-slate-400'}`}>2</div>
                Phone
              </div>
            </div>
          </div>
        ) : (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border border-border rounded-xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-success-bg flex items-center justify-center mb-4">
              <Check size={32} className="text-success" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">Account Verified!</h2>
            <p className="text-sm text-slate-500">Redirecting to your dashboard...</p>
            <div className="mt-4 w-8 h-8 mx-auto border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

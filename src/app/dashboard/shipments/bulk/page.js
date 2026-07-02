'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, Check, AlertCircle, Download, X } from 'lucide-react';

export default function BulkUploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Bulk Upload</h1>
        <p className="text-sm text-slate-500 mt-0.5">Upload CSV or Excel file to create multiple shipments</p>
      </div>

      <div className="bg-white border border-border rounded-xl p-6">
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center hover:border-brand/40 transition-colors">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-bg flex items-center justify-center mb-4"><Upload size={24} className="text-brand" /></div>
          <h3 className="text-sm font-semibold text-slate-700 mb-1">Drop your file here or click to browse</h3>
          <p className="text-xs text-slate-400 mb-4">Supports CSV, XLSX (max 5MB, up to 500 orders)</p>
          <input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="bulk-file" />
          <label htmlFor="bulk-file" className="inline-flex items-center gap-2 px-4 py-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg cursor-pointer shadow-md shadow-brand/20">
            <FileSpreadsheet size={16} /> Choose File
          </label>
        </div>

        {file && (
          <div className="mt-4 flex items-center justify-between bg-bg-elevated rounded-lg p-3">
            <div className="flex items-center gap-3">
              <FileSpreadsheet size={18} className="text-brand" />
              <div>
                <p className="text-sm font-medium text-slate-700">{file.name}</p>
                <p className="text-[11px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="p-1 hover:bg-white rounded"><X size={16} className="text-slate-400" /></button>
          </div>
        )}
      </div>

      <div className="bg-white border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Download Template</h3>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-bg-elevated border border-border rounded-lg text-sm text-slate-600 hover:bg-bg-page"><Download size={15} /> CSV Template</button>
          <button className="flex items-center gap-2 px-4 py-2 bg-bg-elevated border border-border rounded-lg text-sm text-slate-600 hover:bg-bg-page"><Download size={15} /> Excel Template</button>
        </div>
        <div className="mt-4 bg-bg-page rounded-lg p-4">
          <p className="text-xs font-medium text-slate-600 mb-2">Required Columns:</p>
          <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500">
            {['recipient_name', 'recipient_phone', 'delivery_address', 'delivery_city', 'delivery_pincode', 'weight_kg', 'payment_mode', 'cod_amount', 'product_description'].map(c => (
              <span key={c} className="flex items-center gap-1"><Check size={10} className="text-success" /> {c}</span>
            ))}
          </div>
        </div>
      </div>

      <button disabled={!file} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-xl shadow-md shadow-brand/20 disabled:opacity-40 disabled:cursor-not-allowed">
        <Upload size={16} /> Upload & Create Shipments
      </button>
    </motion.div>
  );
}

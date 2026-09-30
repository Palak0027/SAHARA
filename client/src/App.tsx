import React from 'react';
import { HeartHandshake, Sparkles, Box, ArrowRight } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-rose-600/15 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 max-w-2xl w-full text-center space-y-8 backdrop-blur-xl bg-slate-900/60 p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>React + Vite + Tailwind CSS v4 Configured</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            SAHARA
          </h1>
          <p className="text-lg sm:text-xl text-slate-400">
            Give What You Can, Get What You Need
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-indigo-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-3">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-200 text-base mb-1">Mutual Aid Platform</h3>
            <p className="text-sm text-slate-400">Connect donors and beneficiaries with zero friction.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-rose-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 mb-3">
              <Box className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-slate-200 text-base mb-1">Resource Distribution</h3>
            <p className="text-sm text-slate-400">Transparent inventory tracking and request fulfillment.</p>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-center gap-4">
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/25 transition">
            <span>Explore Architecture</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}

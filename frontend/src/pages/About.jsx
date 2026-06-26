import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] border border-slate-800 bg-gradient-to-br from-slate-900/70 via-slate-950 to-emerald-950/40 p-6 sm:p-10">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-[#FF385C]/20 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#FF385C]/10 via-emerald-500/10 to-sky-500/10 blur-3xl" />
          </div>

          <div className="relative">
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
              jardiniHomes is an outstanding real estate website designed to help you discover the perfect home—whether you’re buying, renting, or exploring offers—with every listing clearly presented and easy to compare. ©{' '}
              {new Date().getFullYear()} jardiniHomes. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



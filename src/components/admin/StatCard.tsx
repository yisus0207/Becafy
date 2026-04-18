'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: string;
}

export default function StatCard({ label, value, icon: Icon, subtext, trend, color = 'var(--accent-primary)' }: StatCardProps) {
  return (
    <div className="glass-v2 p-7 flex flex-col gap-5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
      {/* Background Subtle Gradient */}
      <div
        className="absolute -right-10 -bottom-10 w-32 h-32 blur-[80px] opacity-10 transition-all duration-500 group-hover:opacity-30 group-hover:scale-150"
        style={{ background: color }}
      />

      <div className="flex justify-between items-start cursor-default">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon size={22} style={{ color: color }} />
        </div>

        {trend && (
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${trend.isUp
              ? 'bg-diff-easy/10 text-diff-easy border-diff-easy/20'
              : 'bg-diff-hard/10 text-diff-hard border-diff-hard/20'
            }`}>
            {trend.isUp ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 cursor-default">
        <p className="text-text-muted text-[11px] font-bold uppercase tracking-widest">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold font-display text-white tracking-tight">{value}</h3>
        </div>
        {subtext && <p className="text-[10px] text-text-muted font-medium mt-1 leading-relaxed">{subtext}</p>}
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 opacity-50"
        style={{ background: color }}
      />
    </div>
  );
}

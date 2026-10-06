import React from 'react';
import { cn } from '../lib/utils';
import { IconBonus, IconGcoin } from './shell/ShellSvgSymbols';

export function CurrencyIcon({ currency, className }: { currency: 'Gcoin' | 'Bonus' | 'Chip', className?: string }) {
  if (currency === 'Gcoin') {
    return <IconGcoin className={cn("w-4 h-4 text-[#ffc53d]", className)} />;
  }
  
  if (currency === 'Bonus') {
    return <IconBonus className={cn("w-4 h-4 text-[#38bdf8]", className)} />;
  }

  // Chip
  return (
    <div className={cn("rounded-full border border-white/50 bg-[#c0392b] flex items-center justify-center relative overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_1px_3px_rgba(0,0,0,0.6)]", className)}>
       <div className="absolute inset-0 rounded-full border-[2px] border-dashed border-white/30"></div>
       <div className="w-[40%] h-[40%] rounded-full bg-[#3498db] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] z-10"></div>
    </div>
  );
}

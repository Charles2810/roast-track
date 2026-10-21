import React from 'react';
import { Flame, BarChart3, ShoppingBag, DollarSign } from 'lucide-react';
import type { CashShift } from '../types';

interface NavbarProps {
  currentTab: 'pos' | 'analytics';
  onTabChange: (tab: 'pos' | 'analytics') => void;
  shift: CashShift;
  onOpenCashModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  shift,
  onOpenCashModal,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-amber-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white">Roast<span className="text-brand-500">Track</span></span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2 py-0.5 rounded-full">
                POS & Insights
              </span>
            </div>
            <p className="text-xs text-slate-400">Control de Ventas & Analista de Datos</p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onTabChange('pos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'pos'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Punto de Venta</span>
          </button>
          <button
            onClick={() => onTabChange('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'analytics'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Panel Analítico</span>
          </button>
        </div>

        {/* Shift / Cash status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCashModal}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition text-left"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-xs">
              <span className="text-slate-400 block text-[10px]">Caja: {shift.cashier_name}</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <DollarSign className="w-3 h-3 inline -mr-0.5" />
                {shift.total_cash_sales.toFixed(2)}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

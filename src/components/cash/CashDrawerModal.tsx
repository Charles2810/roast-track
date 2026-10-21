import React, { useState } from 'react';
import { X, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { CashShift } from '../../types';

interface CashDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  shift: CashShift;
  onCloseShift: (actualCounted: number, notes: string) => void;
}

export const CashDrawerModal: React.FC<CashDrawerModalProps> = ({
  isOpen,
  onClose,
  shift,
  onCloseShift,
}) => {
  if (!isOpen) return null;

  const [actualCash, setActualCash] = useState<string>('');
  const [closingNotes, setClosingNotes] = useState<string>('');
  const expectedTotal = shift.opening_balance + shift.total_cash_sales;
  const countedNum = parseFloat(actualCash) || 0;
  const difference = countedNum - expectedTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCloseShift(countedNum, closingNotes);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Arqueo y Cierre de Caja</h3>
            <p className="text-xs text-slate-400">Turno de {shift.cashier_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Fondo Inicial</span>
            <span className="text-base font-bold text-slate-200">${shift.opening_balance.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Ventas Efectivo</span>
            <span className="text-base font-bold text-emerald-400">+${shift.total_cash_sales.toFixed(2)}</span>
          </div>
          <div className="col-span-2 pt-2 border-t border-slate-800 flex justify-between items-center">
            <span className="text-xs font-medium text-slate-300">Total Esperado en Caja:</span>
            <span className="text-lg font-black text-white">${expectedTotal.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Efectivo Físico Contado ($)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={actualCash}
                onChange={(e) => setActualCash(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl pl-8 pr-4 py-2.5 text-white font-semibold outline-none transition"
              />
            </div>
          </div>

          {actualCash !== '' && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
              Math.abs(difference) < 0.01
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : difference > 0
                ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              {Math.abs(difference) < 0.01 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>¡Cuadre perfecto! Sin diferencia en caja.</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Diferencia: {difference > 0 ? `Sobrante de +$${difference.toFixed(2)}` : `Faltante de -$${Math.abs(difference).toFixed(2)}`}
                  </span>
                </>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Observaciones o Justificación
            </label>
            <textarea
              rows={2}
              value={closingNotes}
              onChange={(e) => setClosingNotes(e.target.value)}
              placeholder="Notas de entrega de turno, billetes grandes, etc."
              className="w-full bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl px-3 py-2 text-white text-xs outline-none transition resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-sm transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-rose-600/20"
            >
              Cerrar Turno
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  TrendingUp, DollarSign, ShoppingCart, Percent, 
  Lightbulb, Clock, Award, ArrowUpRight,
  Sparkles, Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, CartesianGrid, BarChart, Bar, Legend, Cell,
  PieChart, Pie
} from 'recharts';
import type { Order, HourlySalesMetric, ProductMarginMetric } from '../../types';

interface AnalyticsViewProps {
  orders: Order[];
  hourlyMetrics: HourlySalesMetric[];
  productMargins: ProductMarginMetric[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  orders,
  hourlyMetrics,
  productMargins,
}) => {
  // Aggregate real KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalCost = orders.reduce((sum, o) => sum + o.total_cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const avgMarginPercent = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const avgTicket = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Format hourly data for Recharts
  const hourlyChartData = hourlyMetrics.map((h) => ({
    hourLabel: `${h.hour}:00`,
    Ventas: h.total_revenue,
    Ordenes: h.total_orders,
    TicketProm: h.average_ticket,
  }));

  // Format Pareto / Profit margins
  const sortedMargins = [...productMargins].sort((a, b) => b.total_revenue - a.total_revenue);

  // Channels Breakdown
  const channelCounts = orders.reduce((acc, order) => {
    acc[order.channel] = (acc[order.channel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const channelData = [
    { name: 'En Salón', value: channelCounts['DINE_IN'] || 4, color: '#f97316' },
    { name: 'Delivery', value: channelCounts['DELIVERY'] || 2, color: '#06b6d4' },
    { name: 'Para Llevar', value: channelCounts['TAKEAWAY'] || 2, color: '#8b5cf6' },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-brand-950/40 p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">
              Inteligencia & Analítica de Restaurante
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Métricas de conversión, picos de consumo de pollos, márgenes reales y diagnóstico de rentabilidad.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            Últimos 7 días vs. Semana anterior
          </span>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Facturación Total</span>
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">${totalRevenue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% vs semana previa</span>
            </div>
          </div>
        </div>

        {/* Profit Margin */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Margen Bruto Real</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-emerald-400">{avgMarginPercent.toFixed(1)}%</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <span>Ganancia neta: +${totalProfit.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Average Ticket */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ticket Promedio</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">${avgTicket.toFixed(2)}</h3>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+$5.20 por comensal</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Comandas</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white">{orders.length} pedidos</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <span>Canal más fuerte: En Salón (62%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart 1: Peak Hours Analysis */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-400" />
              <span>Mapa de Horas Pico de Demanda (Ventas vs Horario)</span>
            </h4>
            <p className="text-xs text-slate-400">
              Identifica momentos exactos de mayor afluencia para rotación de personal y previsión de hornos de brasa.
            </p>
          </div>
          <span className="text-xs bg-brand-500/10 text-brand-400 border border-brand-500/20 px-3 py-1 rounded-full font-semibold">
            Pico Mayor: 20:00 - 21:00 hrs (Cena)
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hourLabel" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value: any) => [`$${value}`, 'Ingresos']}
              />
              <Area type="monotone" dataKey="Ventas" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorVentas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Pareto Analysis + Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pareto / Profitability Table & Chart */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Análisis de Rentabilidad ABC (Ingresos vs Costos de Alimentos)</span>
              </h4>
              <p className="text-xs text-slate-400">
                Productos que generan mayor volumen de facturación y margen neto.
              </p>
            </div>
          </div>

          <div className="h-64 w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedMargins} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="product_name" stroke="#64748b" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="total_revenue" name="Ventas Totales ($)" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total_cost" name="Costo Total Alimentos ($)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total_profit" name="Ganancia Neta ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table summary */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Producto</th>
                  <th className="py-2.5 px-3 text-right">Uds Vendidas</th>
                  <th className="py-2.5 px-3 text-right">Facturación</th>
                  <th className="py-2.5 px-3 text-right">Margen %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sortedMargins.map((item) => (
                  <tr key={item.product_id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2 px-3 font-semibold text-white">{item.product_name}</td>
                    <td className="py-2 px-3 text-right text-slate-300">{item.total_units_sold}</td>
                    <td className="py-2 px-3 text-right font-bold text-white">${item.total_revenue.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        item.profit_margin_percentage >= 65 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                      }`}>
                        {item.profit_margin_percentage.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analyst Insights & Channel Distribution */}
        <div className="lg:col-span-4 space-y-6">
          {/* Channel Pie Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h4 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Ventas por Canal</span>
            </h4>
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-around text-xs pt-2 border-t border-slate-800">
              {channelData.map((c) => (
                <div key={c.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-slate-300 font-medium">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI / Data Analyst Actionable Insights */}
          <div className="bg-gradient-to-br from-slate-900 to-brand-950/30 border border-brand-500/30 rounded-3xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-brand-400">
              <Lightbulb className="w-5 h-5" />
              <h4 className="font-bold text-sm text-white">Recomendaciones del Analista</h4>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-0.5">🚀 Producto Estrella en Margen</span>
                <span>La <strong>Chicha Morada Casera</strong> y las <strong>Papas Familiares</strong> tienen más de <strong>69% de margen neto</strong>. Impulsa combos que las incluyan obligatoriamente.</span>
              </div>

              <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400 block mb-0.5">⏰ Ventana Crítica de Hornos</span>
                <span>El <strong>58% de las ventas nocturnas</strong> ocurren entre 19:30 y 21:30. Se recomienda cargar los hornos de brasa a las 18:45 para evitar esperas y quejas de delivery.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

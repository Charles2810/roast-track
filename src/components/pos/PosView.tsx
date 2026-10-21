import React, { useState } from 'react';
import { 
  Plus, Minus, Trash2, ShoppingBag, Utensils, 
  Bike, CreditCard, QrCode, Banknote, CheckCircle, 
  Search, Percent, X
} from 'lucide-react';
import type { Product, Category, OrderItem, ChannelType, PaymentMethod, Order } from '../../types';

interface PosViewProps {
  products: Product[];
  categories: Category[];
  onCompleteOrder: (order: Omit<Order, 'id' | 'order_number' | 'created_at'>) => void;
}

export const PosView: React.FC<PosViewProps> = ({
  products,
  categories,
  onCompleteOrder,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [channel, setChannel] = useState<ChannelType>('DINE_IN');
  const [tableNumber, setTableNumber] = useState<string>('Mesa 1');
  const [customerName, setCustomerName] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [cashTendered, setCashTendered] = useState<string>('');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product_id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.unit_price }
            : item
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          product_name: product.name,
          unit_price: product.price,
          unit_cost: product.cost,
          quantity: 1,
          subtotal: product.price,
        },
      ];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product_id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty, subtotal: newQty * item.unit_price } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[];
    });
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const totalCost = cart.reduce((sum, item) => sum + item.unit_cost * item.quantity, 0);
  const total = subtotal;
  const grossMargin = total - totalCost;
  const marginPercent = total > 0 ? ((grossMargin / total) * 100).toFixed(1) : '0';

  const tenderedAmount = parseFloat(cashTendered) || 0;
  const changeDue = tenderedAmount >= total ? tenderedAmount - total : 0;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    onCompleteOrder({
      channel,
      table_number: channel === 'DINE_IN' ? tableNumber : undefined,
      customer_name: customerName || undefined,
      status: 'COMPLETED',
      payment_method: paymentMethod,
      subtotal,
      discount: 0,
      total,
      total_cost: totalCost,
      gross_margin: grossMargin,
      items: cart,
    });

    // Reset form
    setCart([]);
    setCustomerName('');
    setCashTendered('');
    setSuccessToast(`¡Pedido completado con éxito! Total: $${total.toFixed(2)}`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Catalog & Search Section */}
      <div className="lg:col-span-8 flex flex-col gap-5">
        {/* Channel Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-2 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setChannel('DINE_IN')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                channel === 'DINE_IN' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>En Salón (Mesa)</span>
            </button>
            <button
              onClick={() => setChannel('TAKEAWAY')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                channel === 'TAKEAWAY' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Para Llevar</span>
            </button>
            <button
              onClick={() => setChannel('DELIVERY')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                channel === 'DELIVERY' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Delivery</span>
            </button>
          </div>

          {channel === 'DINE_IN' && (
            <select
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-2 outline-none"
            >
              <option value="Mesa 1">Mesa 1 (Salón Principal)</option>
              <option value="Mesa 2">Mesa 2 (Salón Principal)</option>
              <option value="Mesa 3">Mesa 3 (Salón Principal)</option>
              <option value="Mesa 4">Mesa 4 (Terraza)</option>
              <option value="Mesa 5">Mesa 5 (Terraza)</option>
              <option value="Barra 1">Barra 1</option>
            </select>
          )}
        </div>

        {/* Search & Category Pills */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar pollo, combo, bebida, guarnición..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-500 transition"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Todos los Platos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-brand-500 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredProducts.map((product) => {
            const productMargin = ((product.price - product.cost) / product.price) * 100;
            return (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="group cursor-pointer bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-brand-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-sm hover:shadow-brand-500/10"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-bold text-sm text-slate-100 group-hover:text-brand-400 transition">
                      {product.name}
                    </h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                      {productMargin.toFixed(0)}% mg
                    </span>
                  </div>
                  {product.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {product.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-base font-extrabold text-white">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      costo: ${product.cost.toFixed(2)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-xl bg-brand-500/20 group-hover:bg-brand-500 text-brand-400 group-hover:text-white flex items-center justify-center transition shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart & Ticket Drawer */}
      <div className="lg:col-span-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sticky top-24 flex flex-col h-[calc(100vh-7.5rem)]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>Orden Actual</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-brand-400">
                  {cart.reduce((s, i) => s + i.quantity, 0)} items
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {channel === 'DINE_IN' ? tableNumber : channel === 'DELIVERY' ? 'Envío Delivery' : 'Mostrador'}
              </p>
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-slate-400 hover:text-rose-400 transition text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vaciar</span>
              </button>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-12 h-12 rounded-full bg-slate-800/60 flex items-center justify-center mb-2">
                  <ShoppingBag className="w-6 h-6 text-slate-600" />
                </div>
                <p className="text-sm font-medium text-slate-400">No hay productos en la comanda</p>
                <p className="text-xs text-slate-500 mt-1">Haz clic en cualquier plato o combo para agregarlo.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product_id}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-200 truncate">{item.product_name}</h5>
                    <span className="text-[11px] text-slate-400">${item.unit_price.toFixed(2)} c/u</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.product_id, -1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-xs font-black text-white w-14 text-right">
                      ${item.subtotal.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition"
                      title="Eliminar de comanda"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout & Summary Footer */}
          {cart.length > 0 && (
            <div className="pt-3 border-t border-slate-800 space-y-3">
              {/* Payment Methods */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`flex flex-col items-center justify-center py-2 rounded-xl text-[11px] font-bold transition border ${
                    paymentMethod === 'CASH'
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Banknote className="w-4 h-4 mb-0.5" />
                  <span>Efectivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`flex flex-col items-center justify-center py-2 rounded-xl text-[11px] font-bold transition border ${
                    paymentMethod === 'CARD'
                      ? 'bg-blue-500/15 border-blue-500/40 text-blue-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mb-0.5" />
                  <span>Tarjeta</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('QR_TRANSFER')}
                  className={`flex flex-col items-center justify-center py-2 rounded-xl text-[11px] font-bold transition border ${
                    paymentMethod === 'QR_TRANSFER'
                      ? 'bg-purple-500/15 border-purple-500/40 text-purple-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <QrCode className="w-4 h-4 mb-0.5" />
                  <span>Yape / QR</span>
                </button>
              </div>

              {/* Cash change calculator if Cash */}
              {paymentMethod === 'CASH' && (
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Paga con:</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder={`$${total.toFixed(2)}`}
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="w-20 bg-slate-900 border border-slate-700 text-white text-xs font-bold rounded px-2 py-1 outline-none text-right"
                  />
                  {tenderedAmount > total && (
                    <span className="text-xs font-bold text-emerald-400 ml-auto">
                      Vuelto: ${changeDue.toFixed(2)}
                    </span>
                  )}
                </div>
              )}

              {/* Totals & Analyst Insight preview */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Costo Estimado Alimentos:</span>
                  <span>${totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3 h-3" /> Margen de Ganancia:
                  </span>
                  <span>+${grossMargin.toFixed(2)} ({marginPercent}%)</span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-1 border-t border-slate-800">
                  <span>Total a Pagar:</span>
                  <span className="text-brand-400">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-black text-sm rounded-xl shadow-lg shadow-brand-500/25 transition duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Cobrar Pedido (${total.toFixed(2)})</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

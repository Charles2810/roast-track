import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PosView } from './components/pos/PosView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { CashDrawerModal } from './components/cash/CashDrawerModal';
import { 
  initialCategories, 
  initialProducts, 
  mockHistoricalOrders, 
  currentMockShift, 
  mockHourlySales, 
  mockProductMargins 
} from './data/mockData';
import type { Order, CashShift, HourlySalesMetric, ProductMarginMetric } from './types';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'pos' | 'analytics'>('pos');
  const [products] = useState(initialProducts);
  const [categories] = useState(initialCategories);
  const [orders, setOrders] = useState<Order[]>(mockHistoricalOrders);
  const [shift, setShift] = useState<CashShift>(currentMockShift);
  const [hourlyMetrics, setHourlyMetrics] = useState<HourlySalesMetric[]>(mockHourlySales);
  const [productMargins, setProductMargins] = useState<ProductMarginMetric[]>(mockProductMargins);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);

  // When cashier places an order
  const handleCompleteOrder = (orderData: Omit<Order, 'id' | 'order_number' | 'created_at'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      order_number: orders.length + 104,
      created_at: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update cash shift if paid with cash
    if (newOrder.payment_method === 'CASH') {
      setShift((prev) => ({
        ...prev,
        total_cash_sales: prev.total_cash_sales + newOrder.total,
      }));
    }

    // Live update analytics metrics
    const currentHour = new Date().getHours();
    setHourlyMetrics((prev) => {
      const exists = prev.find((h) => h.hour === currentHour);
      if (exists) {
        return prev.map((h) =>
          h.hour === currentHour
            ? {
                ...h,
                total_orders: h.total_orders + 1,
                total_revenue: h.total_revenue + newOrder.total,
                average_ticket: (h.total_revenue + newOrder.total) / (h.total_orders + 1),
              }
            : h
        );
      }
      return [
        ...prev,
        {
          day_of_week: new Date().getDay(),
          hour: currentHour,
          total_orders: 1,
          total_revenue: newOrder.total,
          average_ticket: newOrder.total,
        },
      ];
    });

    // Update product margins
    setProductMargins((prev) => {
      let updated = [...prev];
      newOrder.items.forEach((item) => {
        const idx = updated.findIndex((p) => p.product_id === item.product_id);
        if (idx >= 0) {
          const current = updated[idx];
          const newUnits = current.total_units_sold + item.quantity;
          const newRev = current.total_revenue + item.subtotal;
          const newCost = current.total_cost + item.unit_cost * item.quantity;
          const newProfit = newRev - newCost;
          updated[idx] = {
            ...current,
            total_units_sold: newUnits,
            total_revenue: newRev,
            total_cost: newCost,
            total_profit: newProfit,
            profit_margin_percentage: newRev > 0 ? (newProfit / newRev) * 100 : 0,
          };
        }
      });
      return updated;
    });
  };

  const handleCloseShift = (actualCounted: number, notes: string) => {
    alert(`Turno de ${shift.cashier_name} cerrado con éxito. Total contado: $${actualCounted.toFixed(2)}. ${notes}`);
    setIsCashModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        shift={shift}
        onOpenCashModal={() => setIsCashModalOpen(true)}
      />

      <main className="flex-1 pb-12">
        {currentTab === 'pos' ? (
          <PosView
            products={products}
            categories={categories}
            onCompleteOrder={handleCompleteOrder}
          />
        ) : (
          <AnalyticsView
            orders={orders}
            hourlyMetrics={hourlyMetrics}
            productMargins={productMargins}
          />
        )}
      </main>

      <CashDrawerModal
        isOpen={isCashModalOpen}
        onClose={() => setIsCashModalOpen(false)}
        shift={shift}
        onCloseShift={handleCloseShift}
      />
    </div>
  );
};

export default App;

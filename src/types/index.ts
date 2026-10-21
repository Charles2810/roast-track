export type ChannelType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
export type PaymentMethod = 'CASH' | 'CARD' | 'QR_TRANSFER' | 'MIXED';
export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
export type ShiftStatus = 'OPEN' | 'CLOSED';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  display_order: number;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  cost: number;
  image_url?: string;
  is_available: boolean;
}

export interface OrderItem {
  id?: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  unit_cost: number;
  quantity: number;
  subtotal: number;
  notes?: string;
}

export interface Order {
  id: string;
  order_number: number;
  shift_id?: string;
  channel: ChannelType;
  table_number?: string;
  customer_name?: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  discount: number;
  total: number;
  total_cost: number;
  gross_margin: number;
  created_at: string;
  items: OrderItem[];
}

export interface CashShift {
  id: string;
  cashier_name: string;
  opened_at: string;
  closed_at?: string;
  opening_balance: number;
  expected_closing_balance?: number;
  actual_closing_balance?: number;
  notes?: string;
  status: ShiftStatus;
  total_cash_sales: number;
}

export interface HourlySalesMetric {
  day_of_week: number; // 0 = Domingo, 6 = Sábado
  hour: number;
  total_orders: number;
  total_revenue: number;
  average_ticket: number;
}

export interface ProductMarginMetric {
  product_id: string;
  product_name: string;
  category_name?: string;
  total_units_sold: number;
  total_revenue: number;
  total_cost: number;
  total_profit: number;
  profit_margin_percentage: number;
}

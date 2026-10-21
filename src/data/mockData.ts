import type { Category, Product, Order, CashShift, HourlySalesMetric, ProductMarginMetric } from '../types';

export const initialCategories: Category[] = [
  { id: 'cat-1', name: 'Brasa & Asados', slug: 'brasa', display_order: 1, icon: 'Flame' },
  { id: 'cat-2', name: 'Combos Familiares', slug: 'combos', display_order: 2, icon: 'Package' },
  { id: 'cat-3', name: 'Guarniciones', slug: 'guarniciones', display_order: 3, icon: 'Soup' },
  { id: 'cat-4', name: 'Bebidas', slug: 'bebidas', display_order: 4, icon: 'CupSoda' },
  { id: 'cat-5', name: 'Salsas & Extras', slug: 'extras', display_order: 5, icon: 'Sparkles' },
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    category_id: 'cat-1',
    name: '1 Pollo a la Brasa + Papas + Ensalada',
    description: 'Pollo entero marinado con receta secreta, papas fritas crocantes y ensalada fresca con vinagreta.',
    price: 75.00,
    cost: 32.50,
    is_available: true,
  },
  {
    id: 'prod-2',
    category_id: 'cat-1',
    name: '1/2 Pollo a la Brasa + Papas + Ensalada',
    description: 'Medio pollo dorado al carbón, porción de papas y ensalada.',
    price: 42.00,
    cost: 18.00,
    is_available: true,
  },
  {
    id: 'prod-3',
    category_id: 'cat-1',
    name: '1/4 Pollo a la Brasa (Pierna o Pechuga)',
    description: 'Cuarto de pollo clásico acompañado de papas fritas y ensalada personal.',
    price: 24.00,
    cost: 10.00,
    is_available: true,
  },
  {
    id: 'prod-4',
    category_id: 'cat-2',
    name: 'Combo Banquete Pollero',
    description: '1 Pollo + 1/2 Pollo extra + Papas familiares + Chaufa + Gaseosa 2L + Salsas.',
    price: 119.00,
    cost: 51.00,
    is_available: true,
  },
  {
    id: 'prod-5',
    category_id: 'cat-2',
    name: 'Combo Alitas BBQ / Broaster (12 uds)',
    description: 'Alitas crocantes bañadas en salsa BBQ o estilo broaster con papas rústicas.',
    price: 38.00,
    cost: 15.50,
    is_available: true,
  },
  {
    id: 'prod-6',
    category_id: 'cat-3',
    name: 'Papas Fritas Especiales Familiares',
    description: 'Papas amarillas crocantes cortadas a mano con sal de maras.',
    price: 18.00,
    cost: 5.50,
    is_available: true,
  },
  {
    id: 'prod-7',
    category_id: 'cat-3',
    name: 'Porción Arroz Chaufa de Pollo',
    description: 'Arroz al wok con trozos de pollo a la brasa, cebollita china y sillao.',
    price: 16.00,
    cost: 4.80,
    is_available: true,
  },
  {
    id: 'prod-8',
    category_id: 'cat-4',
    name: 'Jarra de Chicha Morada Casera (1L)',
    description: 'Preparada diariamente con maíz morado, piña, manzana y canela.',
    price: 16.00,
    cost: 3.50,
    is_available: true,
  },
  {
    id: 'prod-9',
    category_id: 'cat-4',
    name: 'Gaseosa Inka Kola / Coca Cola 1.5L',
    description: 'Botella retornable fría.',
    price: 12.00,
    cost: 6.50,
    is_available: true,
  },
  {
    id: 'prod-10',
    category_id: 'cat-5',
    name: 'Pote Ají Pollero Artesanal Extra',
    description: 'Crema de ají amarillo con huacatay y especias.',
    price: 3.50,
    cost: 0.80,
    is_available: true,
  },
];

export const currentMockShift: CashShift = {
  id: 'shift-today',
  cashier_name: 'Carlos M.',
  opened_at: new Date().toISOString(),
  opening_balance: 200.00,
  status: 'OPEN',
  total_cash_sales: 648.00,
};

// Realistic mock orders for analytics
export const mockHistoricalOrders: Order[] = [
  {
    id: 'ord-101',
    order_number: 101,
    channel: 'DINE_IN',
    table_number: 'Mesa 4',
    status: 'COMPLETED',
    payment_method: 'CASH',
    subtotal: 91.00,
    discount: 0,
    total: 91.00,
    total_cost: 36.00,
    gross_margin: 55.00,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    items: [
      { product_id: 'prod-1', product_name: '1 Pollo a la Brasa + Papas + Ensalada', unit_price: 75, unit_cost: 32.5, quantity: 1, subtotal: 75 },
      { product_id: 'prod-8', product_name: 'Jarra de Chicha Morada Casera (1L)', unit_price: 16, unit_cost: 3.5, quantity: 1, subtotal: 16 }
    ]
  },
  {
    id: 'ord-102',
    order_number: 102,
    channel: 'DELIVERY',
    customer_name: 'María Suárez',
    status: 'COMPLETED',
    payment_method: 'QR_TRANSFER',
    subtotal: 119.00,
    discount: 0,
    total: 119.00,
    total_cost: 51.00,
    gross_margin: 68.00,
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    items: [
      { product_id: 'prod-4', product_name: 'Combo Banquete Pollero', unit_price: 119, unit_cost: 51, quantity: 1, subtotal: 119 }
    ]
  },
  {
    id: 'ord-103',
    order_number: 103,
    channel: 'TAKEAWAY',
    customer_name: 'Juan Perez',
    status: 'COMPLETED',
    payment_method: 'CARD',
    subtotal: 42.00,
    discount: 0,
    total: 42.00,
    total_cost: 18.00,
    gross_margin: 24.00,
    created_at: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
    items: [
      { product_id: 'prod-2', product_name: '1/2 Pollo a la Brasa + Papas + Ensalada', unit_price: 42, unit_cost: 18, quantity: 1, subtotal: 42 }
    ]
  }
];

export const mockHourlySales: HourlySalesMetric[] = [
  { day_of_week: 1, hour: 12, total_orders: 14, total_revenue: 840, average_ticket: 60.0 },
  { day_of_week: 1, hour: 13, total_orders: 32, total_revenue: 2240, average_ticket: 70.0 },
  { day_of_week: 1, hour: 14, total_orders: 28, total_revenue: 1820, average_ticket: 65.0 },
  { day_of_week: 1, hour: 15, total_orders: 9, total_revenue: 450, average_ticket: 50.0 },
  { day_of_week: 1, hour: 19, total_orders: 24, total_revenue: 1720, average_ticket: 71.6 },
  { day_of_week: 1, hour: 20, total_orders: 45, total_revenue: 3450, average_ticket: 76.6 }, // Pico noche
  { day_of_week: 1, hour: 21, total_orders: 38, total_revenue: 2850, average_ticket: 75.0 },
  { day_of_week: 1, hour: 22, total_orders: 16, total_revenue: 1050, average_ticket: 65.6 },
];

export const mockProductMargins: ProductMarginMetric[] = [
  {
    product_id: 'prod-1',
    product_name: '1 Pollo a la Brasa Completo',
    category_name: 'Brasa & Asados',
    total_units_sold: 142,
    total_revenue: 10650,
    total_cost: 4615,
    total_profit: 6035,
    profit_margin_percentage: 56.67
  },
  {
    product_id: 'prod-4',
    product_name: 'Combo Banquete Pollero',
    category_name: 'Combos Familiares',
    total_units_sold: 58,
    total_revenue: 6902,
    total_cost: 2958,
    total_profit: 3944,
    profit_margin_percentage: 57.14
  },
  {
    product_id: 'prod-2',
    product_name: '1/2 Pollo a la Brasa',
    category_name: 'Brasa & Asados',
    total_units_sold: 96,
    total_revenue: 4032,
    total_cost: 1728,
    total_profit: 2304,
    profit_margin_percentage: 57.14
  },
  {
    product_id: 'prod-8',
    product_name: 'Jarra Chicha Morada 1L',
    category_name: 'Bebidas',
    total_units_sold: 120,
    total_revenue: 1920,
    total_cost: 420,
    total_profit: 1500,
    profit_margin_percentage: 78.13 // High margin item!
  },
  {
    product_id: 'prod-3',
    product_name: '1/4 Pollo a la Brasa',
    category_name: 'Brasa & Asados',
    total_units_sold: 65,
    total_revenue: 1560,
    total_cost: 650,
    total_profit: 910,
    profit_margin_percentage: 58.33
  },
  {
    product_id: 'prod-6',
    product_name: 'Papas Fritas Familiares',
    category_name: 'Guarniciones',
    total_units_sold: 72,
    total_revenue: 1296,
    total_cost: 396,
    total_profit: 900,
    profit_margin_percentage: 69.44
  }
];

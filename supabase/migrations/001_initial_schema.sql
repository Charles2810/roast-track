-- ================================================================
-- ROAST-TRACK: Initial Schema Migration
-- POS & Analytics for Chicken Restaurant
-- ================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CATEGORIES TABLE
create table if not exists public.categories (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    slug text not null unique,
    icon text default 'Utensils',
    display_order int default 0,
    created_at timestamptz default now()
);

-- 2. PRODUCTS TABLE (Includes cost for margin calculation)
create table if not exists public.products (
    id uuid primary key default uuid_generate_v4(),
    category_id uuid references public.categories(id) on delete set null,
    name text not null,
    description text,
    price numeric(10,2) not null check (price >= 0),
    cost numeric(10,2) not null default 0 check (cost >= 0),
    image_url text,
    is_available boolean default true,
    created_at timestamptz default now()
);

-- 3. CASH SHIFTS (Apertura y Cierre de Caja)
create table if not exists public.cash_shifts (
    id uuid primary key default uuid_generate_v4(),
    cashier_name text not null,
    opened_at timestamptz default now(),
    closed_at timestamptz,
    opening_balance numeric(10,2) not null default 0 check (opening_balance >= 0),
    expected_closing_balance numeric(10,2),
    actual_closing_balance numeric(10,2),
    notes text,
    status text not null default 'OPEN' check (status in ('OPEN', 'CLOSED'))
);

-- 4. ORDERS TABLE (Ventas ticket a ticket)
create table if not exists public.orders (
    id uuid primary key default uuid_generate_v4(),
    order_number serial unique,
    shift_id uuid references public.cash_shifts(id) on delete set null,
    channel text not null check (channel in ('DINE_IN', 'TAKEAWAY', 'DELIVERY')),
    table_number text,
    customer_name text,
    status text not null default 'COMPLETED' check (status in ('PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED')),
    payment_method text not null check (payment_method in ('CASH', 'CARD', 'QR_TRANSFER', 'MIXED')),
    subtotal numeric(10,2) not null check (subtotal >= 0),
    discount numeric(10,2) not null default 0 check (discount >= 0),
    total numeric(10,2) not null check (total >= 0),
    total_cost numeric(10,2) not null default 0 check (total_cost >= 0),
    gross_margin numeric(10,2) generated always as (total - total_cost) stored,
    created_at timestamptz default now()
);

-- 5. ORDER ITEMS TABLE
create table if not exists public.order_items (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid not null references public.orders(id) on delete cascade,
    product_id uuid references public.products(id) on delete set null,
    product_name text not null,
    unit_price numeric(10,2) not null check (unit_price >= 0),
    unit_cost numeric(10,2) not null default 0 check (unit_cost >= 0),
    quantity int not null check (quantity > 0),
    subtotal numeric(10,2) not null check (subtotal >= 0),
    notes text,
    created_at timestamptz default now()
);

-- INDEXES for Analytics Query Performance
create index if not exists idx_orders_created_at on public.orders(created_at);
create index if not exists idx_orders_shift on public.orders(shift_id);
create index if not exists idx_order_items_product on public.order_items(product_id);
create index if not exists idx_order_items_order on public.order_items(order_id);

-- ANALYTICAL VIEW: Sales by Hour (Peak hours heatmap)
create or replace view public.view_sales_by_hour as
select
    extract(dow from created_at) as day_of_week,
    extract(hour from created_at) as hour_of_day,
    count(id) as total_orders,
    sum(total) as total_revenue,
    round(avg(total), 2) as average_ticket
from public.orders
where status = 'COMPLETED'
group by extract(dow from created_at), extract(hour from created_at)
order by day_of_week, hour_of_day;

-- ANALYTICAL VIEW: Product Profitability & Ranking (ABC / Pareto)
create or replace view public.view_product_margins as
select
    oi.product_id,
    oi.product_name,
    sum(oi.quantity) as total_units_sold,
    sum(oi.subtotal) as total_revenue,
    sum(oi.quantity * oi.unit_cost) as total_cost,
    sum(oi.subtotal - (oi.quantity * oi.unit_cost)) as total_profit,
    round(
        (sum(oi.subtotal - (oi.quantity * oi.unit_cost)) / nullif(sum(oi.subtotal), 0)) * 100, 
        2
    ) as profit_margin_percentage
from public.order_items oi
join public.orders o on oi.order_id = o.id
where o.status = 'COMPLETED'
group by oi.product_id, oi.product_name
order by total_revenue desc;

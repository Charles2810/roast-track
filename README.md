# 🍗 RoastTrack - POS & Analytics para Restaurantes de Pollo

Sistema integral de **Punto de Venta (POS) en tiempo real** y **Dashboard de Inteligencia / Analítica de Datos** diseñado especialmente para pollerías y restaurantes de pollo a la brasa/asado.

---

## 🚀 Características Principales

### 1. Punto de Venta Táctil (POS)
- **Canales de Atención**: Salón (asignación de mesas), Para Llevar (Mostrador) y Delivery.
- **Comandas en Tiempo Real**: Agregado ágil de pollos enteros, medios, cuartos, combos familiares, guarniciones, bebidas y salsas.
- **Medios de Pago**: Efectivo (con cálculo automático de vuelto), Tarjeta y Transferencia QR (Yape/Plin).
- **Márgenes en Vivo**: Vista previa de costo de insumos y porcentaje de ganancia bruta estimada por comanda.

### 2. Panel del Analista de Datos (Dashboard & Insights)
- **Mapa de Horas Pico**: Gráfico de curvas por hora para identificar ventanas de mayor afluencia (almuerzo vs. cena) y planificar la carga de los hornos de brasa.
- **Análisis de Rentabilidad ABC (Pareto)**: Comparativa de facturación vs. costo de alimentos y margen neto por producto.
- **Desglose por Canal**: Gráfico de distribución de pedidos entre salón, delivery y pedidos para llevar.
- **Recomendaciones Accionables**: Detección automática de productos estrella de alto margen (ej. chicha morada, papas familiares) y sugerencias estratégicas.

### 3. Control y Arqueo de Caja (Shifts)
- Fondo inicial de apertura.
- Monitoreo en vivo de ventas en efectivo.
- Arqueo con cálculo automático de sobrantes o faltantes al cierre de turno.

---

## 🛠️ Stack Tecnológico

- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Visualización de Datos**: [Recharts](https://recharts.org/)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Base de Datos & Backend**: [Supabase](https://supabase.com/) (PostgreSQL con vistas analíticas y soporte Realtime)

---

## 🗄️ Esquema de Base de Datos (PostgreSQL / Supabase)

El script SQL completo se encuentra en [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql) e incluye:
- `categories`: Clasificación de platos y combos.
- `products`: Catálogo con precio de venta y costo para cálculo de márgenes.
- `cash_shifts`: Registro de apertura y cierre de caja.
- `orders`: Ventas con canal, método de pago, costo y margen bruto generado.
- `order_items`: Detalle de productos por orden.
- Vistas analíticas optimizadas: `view_sales_by_hour` y `view_product_margins`.

---

## 📦 Puesta en Marcha Local

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abrir [http://localhost:5173](http://localhost:5173) en el navegador.

> **Nota:** La aplicación arranca por defecto en **Modo Demo Offline** con catálogo precargado y datos analíticos simulados, por lo que funciona al 100% de inmediato sin necesidad de credenciales. Para conectarla a tu propio Supabase, copia `.env.example` a `.env` y coloca tu `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

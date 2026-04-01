# Som Tam Thai — Restaurant Web App

A Next.js 16 + Tailwind CSS restaurant web app for Som Tam Thai, an authentic Thai restaurant based in Maafannu, Malé, Maldives. Features a customer-facing ordering experience and a comprehensive admin panel.

## Design System

- **Colors:** Cream `#FDFBF7`, Forest Green `#1A4D2E`, Terracotta `#E36414`, Gold `#FFB703`
- **Fonts:** Lora (display/headings via `font-lora` class), DM Sans (body, default `font-sans`)
- **Currency:** MVR (Maldivian Rufiyaa)
- **Icons:** `lucide-react` npm package

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Styling:** Tailwind CSS 3 with custom brand color tokens
- **Language:** TypeScript
- **Icons:** lucide-react

## Project Structure

```
/app
  layout.tsx              ← Root layout (fonts, global CSS)
  globals.css             ← Global styles + Tailwind directives

  /(customer)/            ← Customer route group (NavBar + Footer layout)
    layout.tsx            ← Wraps customer pages with NavBar, BottomNav, Footer
    page.tsx              ← Home / Menu page
    product/[id]/page.tsx ← Product detail
    login/page.tsx        ← Phone + OTP login
    cart/page.tsx         ← Shopping cart
    checkout/page.tsx     ← 3-step checkout
    reservations/page.tsx ← Book a table
    orders/page.tsx       ← Order status tracker
    account/page.tsx      ← Account dashboard

  /admin/                 ← Admin route group (AdminSidebar layout)
    layout.tsx            ← Wraps admin pages with AdminSidebar + MobileHeader
    page.tsx              ← Dashboard
    orders/page.tsx       ← Kanban order management
    reservations/page.tsx ← Reservation management
    menu/page.tsx         ← Menu item editor
    schedule/page.tsx     ← Hours & shift management
    customers/page.tsx    ← Customer CRM
    settings/page.tsx     ← Restaurant settings

/components               ← Shared components
  NavBar.tsx              ← Customer top navigation (uses cart context)
  BottomNav.tsx           ← Mobile bottom navigation
  Footer.tsx              ← Customer footer
  AdminSidebar.tsx        ← Admin sidebar (uses usePathname for active state)
  MobileHeader.tsx        ← Admin mobile header

/lib
  mockData.ts             ← All mock data (products, orders, reservations, customers, KPIs)
  cartContext.tsx          ← React context for cart state (items, add/remove, totals)
```

## Customer Pages

| Route | Title | Description |
|---|---|---|
| `/` | Home / Menu | Hero banner, sticky category tab bar, product card grid |
| `/product/[id]` | Product Detail | Spice level selector, add-ons, quantity stepper, live subtotal |
| `/login` | Login | Phone entry + 6-digit OTP flow (dummy code: `123456`) |
| `/cart` | Shopping Cart | Line items, qty stepper, order notes, sticky summary panel |
| `/checkout` | Checkout | 3-step flow: Delivery → Schedule → Payment; order confirmation |
| `/reservations` | Book a Table | Time slot grid, table availability, upcoming/past reservations |
| `/orders` | Your Orders | Live order status tracker (6 steps), expandable history |
| `/account` | Account Dashboard | Profile editor, quick-action cards, recent orders |

## Admin Pages

| Route | Title | Description |
|---|---|---|
| `/admin` | Dashboard | KPI cards, live Kanban queue, revenue chart, reservations, top items |
| `/admin/orders` | Order Management | Full Kanban board (5 stages), advance/cancel actions, completed orders |
| `/admin/reservations` | Reservations | Stats, table visualizer, filters, confirm/cancel actions, detail drawer |
| `/admin/menu` | Menu Management | Category tabs, availability toggles, add/edit item drawer |
| `/admin/schedule` | Schedule & Hours | Per-day lunch/dinner toggles, staff roster grid |
| `/admin/customers` | Customers | KPI row, search/filter, customer table, detail drawer |
| `/admin/settings` | Settings | Restaurant info, ordering, notification toggles, danger zone |

## Infrastructure

- **Dev Server:** Next.js dev on port 5000
- **Workflow:** `Start application` — runs `npm run dev`
- **Post-merge script:** `scripts/post-merge.sh` — runs `npm install`
- **Mock data only:** No backend; all data comes from `lib/mockData.ts`

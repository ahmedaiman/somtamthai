# Som Tam Thai — Restaurant Web App

A static multi-page wiremock/prototype for a Thai restaurant based in Maafannu, Malé, Maldives. No build step required — all pages are standalone HTML files using React 18, Tailwind CSS, Lucide icons, and Babel loaded via CDN.

## Design System

- **Colors:** Cream `#FDFBF7`, Forest Green `#1A4D2E`, Terracotta `#E36414`, Gold `#FFB703`
- **Fonts:** Lora (display/headings), DM Sans (body)
- **Currency:** MVR (Maldivian Rufiyaa)
- **Icons:** Lucide via CDN (`lucide.createIcons()` called in `React.useEffect`)

## File Structure

```
/                          ← Customer-facing pages
  index.html               ← Home / Menu
  product.html             ← Product detail
  login.html               ← Phone + OTP login (dummy code: 123456)
  cart.html                ← Shopping cart
  checkout.html            ← 3-step checkout flow
  reservations.html        ← Book a table
  orders.html              ← Order status tracker
  account.html             ← Account dashboard

/admin/                    ← Admin panel pages
  dashboard.html           ← KPI overview, live queue, reservations summary
  orders.html              ← (planned) Kanban order management
  reservations.html        ← (planned) Reservation management
  menu.html                ← (planned) Menu item editor
  schedule.html            ← (planned) Hours & shift management
  customers.html           ← (planned) Customer list
  settings.html            ← (planned) Restaurant settings
```

## Customer Pages

| File | Title | Description |
|---|---|---|
| `index.html` | Home / Menu | Hero banner, sticky category tab bar, product card grid, footer |
| `product.html` | Product Detail | Two-column layout, spice level selector, add-ons, quantity stepper, live subtotal |
| `login.html` | Login | Phone entry + 6-digit OTP verification flow (dummy code: `123456`) |
| `cart.html` | Shopping Cart | Line items with qty stepper, order notes, sticky summary panel, empty state |
| `checkout.html` | Checkout | 3-step flow: Delivery → Schedule → Payment; order confirmation screen |
| `reservations.html` | Book a Table | Time slot grid, table availability visualizer, upcoming/past reservations |
| `orders.html` | Your Orders | Live order status tracker (6 steps), expandable order history rows |
| `account.html` | Account Dashboard | Profile editor, quick-action cards, upcoming reservation card, recent orders |

## Admin Pages (`/admin/`)

| File | Title | Description |
|---|---|---|
| `dashboard.html` | Admin Dashboard | 4 KPI cards, live Kanban queue widget, revenue bar chart, today's reservations table, top-selling items |
| `orders.html` | Order Management | Full-screen Kanban board (5 stages), advance/cancel actions per card, manual order creation modal, completed orders table |
| `reservations.html` | Reservations | Summary stats, table layout visualizer, date/status filters, full table with confirm/cancel inline actions, detail side drawer |
| `menu.html` | Menu Management | Category tabs, item cards with availability toggle, inline edit/delete, add-new item drawer with spice level picker |
| `schedule.html` | Schedule & Hours | Per-day lunch/dinner toggles with time pickers, staff roster grid showing weekly shifts per employee |
| `customers.html` | Customers | KPI row, live search + tag filter, customer table with VIP/Regular/New badges, side drawer with spend stats and note field |
| `settings.html` | Settings | Sectioned panel (Restaurant Info, Ordering, Notifications, Danger Zone) with toggles, inputs, and save confirmation |

## Infrastructure

- **Server:** `static-web-server` on port 80
- **Workflow:** `Serve static` — starts the static server
- **Post-merge script:** `scripts/post-merge.sh` — no-op (static site, no build)
- **Admin sidebar:** Shared `AdminSidebar` component defined inline in each admin page; links use relative paths within `/admin/`

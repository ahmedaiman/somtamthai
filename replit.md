# Som Tam Thai — Restaurant Web App

A static multi-page wiremock/prototype for a Thai restaurant based in Maafannu, Malé, Maldives. No build step required — all pages are standalone HTML files using React 18, Tailwind CSS, Lucide icons, and Babel loaded via CDN.

## Design System

- **Colors:** Cream `#FDFBF7`, Forest Green `#1A4D2E`, Terracotta `#E36414`, Gold `#FFB703`
- **Fonts:** Lora (display/headings), DM Sans (body)
- **Currency:** MVR (Maldivian Rufiyaa)
- **Icons:** Lucide via CDN (`lucide.createIcons()` called in `React.useEffect`)

## Pages

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

## Infrastructure

- **Server:** `static-web-server` on port 80 (configured in `.replit`)
- **Workflow:** `Serve static` — run button starts the static server
- **Post-merge script:** `scripts/post-merge.sh` — no-op (static site, no build)
- **Deployment:** Static deployment, `publicDir = "/"`

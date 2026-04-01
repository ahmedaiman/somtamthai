// ─── Restaurant Info ───────────────────────────────────────────────────────────

export const RESTAURANT_INFO = {
  name: 'Som Tam Thai',
  phone: '+960 789 2616',
  address: 'Izzudhdheen Magu, Maafannu, Malé, Maldives',
  currency: 'MVR',
}

export const OPERATING_HOURS = {
  isOpen: true,
  closesAt: '15:30',
  lunch: { start: '11:30', end: '15:30' },
  dinner: 'By Reservation Only',
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

export const MENU_CATEGORIES = [
  'Salads',
  'Soups',
  'Curries',
  'Wok',
  'Specialty',
  'Noodles',
  'Rice',
  'Desserts',
  'Beverages',
]

export interface Product {
  id: number
  category: string
  name: string
  desc: string
  price: number
  isSoldOut: boolean
  spiceLevels?: string[]
  addOns?: { name: string; price: number }[]
  emoji?: string
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    category: 'Salads',
    name: 'Authentic Som Tam',
    desc: 'Green papaya salad with chili, peanuts, and lime.',
    price: 120,
    isSoldOut: false,
    spiceLevels: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
    addOns: [
      { name: 'Extra Peanuts', price: 10 },
      { name: 'Dried Shrimp', price: 15 },
      { name: 'Crab', price: 40 },
    ],
    emoji: '🥗',
  },
  {
    id: 2,
    category: 'Salads',
    name: 'Larb Gai',
    desc: 'Minced chicken salad with toasted rice powder.',
    price: 140,
    isSoldOut: false,
    spiceLevels: ['Mild', 'Medium', 'Hot'],
    addOns: [{ name: 'Extra Herbs', price: 10 }],
    emoji: '🥗',
  },
  {
    id: 3,
    category: 'Soups',
    name: 'Tom Yum Goong',
    desc: 'Spicy and sour prawn soup with fresh lemongrass.',
    price: 180,
    isSoldOut: false,
    spiceLevels: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
    addOns: [
      { name: 'Extra Prawns', price: 50 },
      { name: 'Mushrooms', price: 15 },
    ],
    emoji: '🍲',
  },
  {
    id: 4,
    category: 'Soups',
    name: 'Tom Kha Gai',
    desc: 'Coconut chicken soup with galangal.',
    price: 160,
    isSoldOut: false,
    spiceLevels: ['Mild', 'Medium'],
    addOns: [{ name: 'Extra Chicken', price: 30 }],
    emoji: '🍲',
  },
  {
    id: 5,
    category: 'Curries',
    name: 'Green Curry Chicken',
    desc: 'Classic green curry with Thai eggplant and basil.',
    price: 170,
    isSoldOut: false,
    spiceLevels: ['Mild', 'Medium', 'Hot'],
    addOns: [
      { name: 'Extra Chicken', price: 30 },
      { name: 'Tofu instead', price: 0 },
    ],
    emoji: '🍛',
  },
  {
    id: 6,
    category: 'Curries',
    name: 'Massaman Beef',
    desc: 'Rich and mild curry with tender beef and potatoes.',
    price: 220,
    isSoldOut: true,
    spiceLevels: ['Mild', 'Medium'],
    addOns: [{ name: 'Extra Beef', price: 50 }],
    emoji: '🍛',
  },
  {
    id: 7,
    category: 'Wok',
    name: 'Pad Kra Pao',
    desc: 'Holy basil stir-fry with minced pork and fried egg.',
    price: 150,
    isSoldOut: false,
    spiceLevels: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
    addOns: [
      { name: 'Fried Egg', price: 15 },
      { name: 'Extra Pork', price: 30 },
    ],
    emoji: '🍳',
  },
  {
    id: 8,
    category: 'Noodles',
    name: 'Pad Thai',
    desc: 'Stir-fried rice noodles with tamarind sauce and peanuts.',
    price: 160,
    isSoldOut: false,
    spiceLevels: ['Mild', 'Medium', 'Hot'],
    addOns: [
      { name: 'Extra Peanuts', price: 10 },
      { name: 'Extra Tofu', price: 15 },
      { name: 'Prawns', price: 40 },
    ],
    emoji: '🍜',
  },
  {
    id: 9,
    category: 'Rice',
    name: 'Pineapple Fried Rice',
    desc: 'Jasmine rice stir-fried with pineapple and cashews.',
    price: 145,
    isSoldOut: false,
    spiceLevels: ['Mild', 'Medium'],
    addOns: [
      { name: 'Chicken', price: 25 },
      { name: 'Prawns', price: 40 },
    ],
    emoji: '🍚',
  },
  {
    id: 10,
    category: 'Desserts',
    name: 'Mango Sticky Rice',
    desc: 'Sweet coconut sticky rice with fresh ripe mango.',
    price: 110,
    isSoldOut: false,
    emoji: '🥭',
  },
  {
    id: 11,
    category: 'Beverages',
    name: 'Thai Iced Tea',
    desc: 'Sweet creamy black tea over ice.',
    price: 65,
    isSoldOut: false,
    emoji: '🧋',
  },
]

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string
  product: Product
  quantity: number
  spiceLevel?: string
  addOns: string[]
}

export const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: 'seed-1',
    product: PRODUCTS[2],
    quantity: 1,
    spiceLevel: 'Hot',
    addOns: ['Extra Prawns'],
  },
  {
    id: 'seed-2',
    product: PRODUCTS[7],
    quantity: 2,
    spiceLevel: 'Medium',
    addOns: [],
  },
  {
    id: 'seed-3',
    product: PRODUCTS[10],
    quantity: 2,
    addOns: [],
  },
]

// ─── Orders ───────────────────────────────────────────────────────────────────

export const ORDER_STATUSES = [
  'Order Placed',
  'Confirmed',
  'Preparing',
  'Ready',
  'Out for Delivery',
  'Delivered',
]

export const MOCK_ACTIVE_ORDER = {
  id: '#0042',
  status: 'Preparing',
  statusIndex: 2,
  estimatedTime: '20-25 min',
  items: [
    { name: 'Tom Yum Goong', qty: 1, price: 180 },
    { name: 'Pad Thai', qty: 2, price: 160 },
    { name: 'Thai Iced Tea', qty: 2, price: 65 },
  ],
  subtotal: 630,
  deliveryFee: 30,
  total: 660,
  placedAt: '14:05',
}

export const MOCK_ORDER_HISTORY = [
  {
    id: '#0038',
    date: 'March 29, 2026',
    items: ['Authentic Som Tam', 'Green Curry Chicken'],
    total: 290,
    status: 'Delivered',
  },
  {
    id: '#0031',
    date: 'March 22, 2026',
    items: ['Pad Kra Pao', 'Tom Kha Gai', 'Mango Sticky Rice'],
    total: 420,
    status: 'Delivered',
  },
  {
    id: '#0024',
    date: 'March 15, 2026',
    items: ['Pineapple Fried Rice', 'Thai Iced Tea'],
    total: 210,
    status: 'Delivered',
  },
]

// ─── Reservations ─────────────────────────────────────────────────────────────

export const TABLE_OPTIONS = [
  { id: 'T1', label: 'Table 1', capacity: 2 },
  { id: 'T2', label: 'Table 2', capacity: 4 },
  { id: 'T3', label: 'Table 3', capacity: 6 },
]

export const DINNER_TIME_SLOTS = [
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
]

export const MOCK_UPCOMING_RESERVATIONS = [
  {
    id: 'R001',
    date: 'April 5, 2026',
    time: '19:00',
    party: 2,
    table: 'Table 2',
    status: 'Confirmed',
  },
]

export const MOCK_PAST_RESERVATIONS = [
  {
    id: 'R009',
    date: 'March 28, 2026',
    time: '18:30',
    party: 4,
    table: 'Table 1',
    status: 'Completed',
  },
  {
    id: 'R006',
    date: 'March 10, 2026',
    time: '20:00',
    party: 2,
    table: 'Table 2',
    status: 'Completed',
  },
]

// ─── Admin ────────────────────────────────────────────────────────────────────

export const KPI_DATA = [
  { id: 1, title: "Today's Revenue", value: 'MVR 2,840', icon: 'dollar-sign', trend: '+12.5%', isUp: true },
  { id: 2, title: 'Orders Today', value: '18', icon: 'shopping-bag', trend: '+4', isUp: true },
  { id: 3, title: 'Avg. Order Value', value: 'MVR 158', icon: 'trending-up', trend: '-2.1%', isUp: false },
  { id: 4, title: 'Tables Occupied', value: '2/3', icon: 'users', trend: 'Full Soon', isUp: true },
]

export const LIVE_QUEUE = [
  { id: '#0042', status: 'Received', customer: 'Ahmed', total: 496.8, time: '2 min' },
  { id: '#0043', status: 'Received', customer: 'Aishath', total: 120.0, time: '1 min' },
  { id: '#0044', status: 'Received', customer: 'Hassan', total: 310.0, time: 'Just now' },
  { id: '#0040', status: 'Confirming', customer: 'Mariyam', total: 185.0, time: '5 min' },
  { id: '#0041', status: 'Confirming', customer: 'Ali', total: 540.0, time: '4 min' },
  { id: '#0039', status: 'Preparing', customer: 'Fatima', total: 220.0, time: '12 min' },
  { id: '#0038', status: 'Ready', customer: 'Ibrahim', total: 160.0, time: '18 min' },
  { id: '#0037', status: 'Delivering', customer: 'Zara', total: 290.0, time: '25 min' },
]

export const TODAY_RESERVATIONS = [
  { time: '18:30', name: 'Ibrahim Rasheed', party: 4, table: 'Table 1', status: 'Confirmed' },
  { time: '19:00', name: 'Zara', party: 2, table: 'Table 2', status: 'Confirmed' },
  { time: '20:00', name: 'Ahmed', party: 3, table: 'Table 3', status: 'Pending' },
]

export const TOP_ITEMS = [
  { rank: 1, name: 'Authentic Som Tam', count: 24, trend: 'up' },
  { rank: 2, name: 'Green Curry Chicken', count: 18, trend: 'up' },
  { rank: 3, name: 'Tom Kha Gai', count: 12, trend: 'down' },
]

export const REVENUE_CHART = [40, 65, 30, 80, 55, 90, 70]

// ─── Admin Orders (Kanban) ────────────────────────────────────────────────────

export const KANBAN_COLUMNS = ['Received', 'Confirming', 'Preparing', 'Ready', 'Delivering']

export const MOCK_ORDERS = [
  {
    id: '#0042',
    status: 'Received',
    customer: 'Ahmed',
    items: ['Tom Yum Goong x1', 'Pad Thai x2'],
    total: 496.8,
    time: '2 min',
    note: '',
  },
  {
    id: '#0043',
    status: 'Received',
    customer: 'Aishath',
    items: ['Authentic Som Tam x1'],
    total: 120.0,
    time: '1 min',
    note: 'No peanuts',
  },
  {
    id: '#0044',
    status: 'Received',
    customer: 'Hassan',
    items: ['Green Curry Chicken x1', 'Pineapple Fried Rice x1'],
    total: 310.0,
    time: 'Just now',
    note: '',
  },
  {
    id: '#0040',
    status: 'Confirming',
    customer: 'Mariyam',
    items: ['Larb Gai x1'],
    total: 185.0,
    time: '5 min',
    note: 'Extra spicy',
  },
  {
    id: '#0041',
    status: 'Confirming',
    customer: 'Ali',
    items: ['Massaman Beef x2', 'Thai Iced Tea x2'],
    total: 540.0,
    time: '4 min',
    note: '',
  },
  {
    id: '#0039',
    status: 'Preparing',
    customer: 'Fatima',
    items: ['Pad Kra Pao x1', 'Tom Kha Gai x1'],
    total: 220.0,
    time: '12 min',
    note: '',
  },
  {
    id: '#0038',
    status: 'Ready',
    customer: 'Ibrahim',
    items: ['Pad Thai x1'],
    total: 160.0,
    time: '18 min',
    note: '',
  },
  {
    id: '#0037',
    status: 'Delivering',
    customer: 'Zara',
    items: ['Authentic Som Tam x1', 'Green Curry Chicken x1'],
    total: 290.0,
    time: '25 min',
    note: '',
  },
]

export const COMPLETED_ORDERS = [
  { id: '#0036', customer: 'Hassan', items: 3, total: 480.0, completedAt: '13:45' },
  { id: '#0035', customer: 'Mariyam', items: 2, total: 290.0, completedAt: '13:30' },
  { id: '#0034', customer: 'Ali', items: 4, total: 625.0, completedAt: '13:12' },
]

// ─── Admin Reservations ───────────────────────────────────────────────────────

export const ADMIN_RESERVATIONS = [
  { id: 'R001', date: 'Apr 1, 2026', time: '18:30', name: 'Ibrahim Rasheed', phone: '+960 777 1234', party: 4, table: 'Table 1', status: 'Confirmed', note: '' },
  { id: 'R002', date: 'Apr 1, 2026', time: '19:00', name: 'Zara', phone: '+960 777 5678', party: 2, table: 'Table 2', status: 'Confirmed', note: 'Birthday dinner' },
  { id: 'R003', date: 'Apr 1, 2026', time: '20:00', name: 'Ahmed', phone: '+960 777 9012', party: 3, table: 'Table 3', status: 'Pending', note: '' },
  { id: 'R004', date: 'Apr 2, 2026', time: '19:30', name: 'Fatima Hassan', phone: '+960 777 3456', party: 2, table: 'Table 2', status: 'Confirmed', note: 'Vegetarian' },
  { id: 'R005', date: 'Apr 2, 2026', time: '20:30', name: 'Ali Rasheed', phone: '+960 777 7890', party: 6, table: 'Table 3', status: 'Pending', note: 'Anniversary' },
]

// ─── Admin Customers ──────────────────────────────────────────────────────────

export interface Customer {
  id: string
  name: string
  phone: string
  tag: 'VIP' | 'Regular' | 'New'
  totalSpend: number
  totalOrders: number
  lastVisit: string
  note: string
}

export const ADMIN_CUSTOMERS: Customer[] = [
  { id: 'C001', name: 'Ibrahim Rasheed', phone: '+960 777 1234', tag: 'VIP', totalSpend: 4850, totalOrders: 28, lastVisit: 'Apr 1, 2026', note: 'Prefers window table' },
  { id: 'C002', name: 'Aishath Zara', phone: '+960 777 5678', tag: 'VIP', totalSpend: 3200, totalOrders: 19, lastVisit: 'Mar 30, 2026', note: 'Gluten-free diet' },
  { id: 'C003', name: 'Hassan Ali', phone: '+960 777 9012', tag: 'Regular', totalSpend: 1450, totalOrders: 9, lastVisit: 'Mar 28, 2026', note: '' },
  { id: 'C004', name: 'Mariyam Didi', phone: '+960 777 3456', tag: 'Regular', totalSpend: 890, totalOrders: 6, lastVisit: 'Mar 25, 2026', note: 'No spicy food' },
  { id: 'C005', name: 'Ahmed Shareef', phone: '+960 777 7890', tag: 'New', totalSpend: 160, totalOrders: 1, lastVisit: 'Apr 1, 2026', note: '' },
  { id: 'C006', name: 'Fatima Hassan', phone: '+960 777 2345', tag: 'Regular', totalSpend: 2100, totalOrders: 14, lastVisit: 'Mar 20, 2026', note: 'Vegetarian' },
]

export const CUSTOMER_KPIS = [
  { label: 'Total Customers', value: '142', trend: '+8 this month' },
  { label: 'VIP Customers', value: '24', trend: '+2 this month' },
  { label: 'Avg. Spend / Customer', value: 'MVR 412', trend: '+5.2%' },
  { label: 'Repeat Rate', value: '68%', trend: '+3%' },
]

// ─── Admin Schedule ───────────────────────────────────────────────────────────

export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const SCHEDULE_CONFIG = [
  { day: 'Mon', lunchEnabled: true, lunchStart: '11:30', lunchEnd: '15:30', dinnerEnabled: false },
  { day: 'Tue', lunchEnabled: true, lunchStart: '11:30', lunchEnd: '15:30', dinnerEnabled: true, dinnerStart: '18:00', dinnerEnd: '22:00' },
  { day: 'Wed', lunchEnabled: true, lunchStart: '11:30', lunchEnd: '15:30', dinnerEnabled: true, dinnerStart: '18:00', dinnerEnd: '22:00' },
  { day: 'Thu', lunchEnabled: true, lunchStart: '11:30', lunchEnd: '15:30', dinnerEnabled: true, dinnerStart: '18:00', dinnerEnd: '22:00' },
  { day: 'Fri', lunchEnabled: false, lunchStart: '11:30', lunchEnd: '15:30', dinnerEnabled: true, dinnerStart: '18:00', dinnerEnd: '22:00' },
  { day: 'Sat', lunchEnabled: true, lunchStart: '11:00', lunchEnd: '16:00', dinnerEnabled: true, dinnerStart: '18:00', dinnerEnd: '22:30' },
  { day: 'Sun', lunchEnabled: true, lunchStart: '11:00', lunchEnd: '16:00', dinnerEnabled: false },
]

export const STAFF_ROSTER = [
  { name: 'Nuha', role: 'Chef', shifts: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  { name: 'Adham', role: 'Sous Chef', shifts: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
  { name: 'Sana', role: 'Server', shifts: ['Mon', 'Tue', 'Wed', 'Sat', 'Sun'] },
  { name: 'Rafa', role: 'Server', shifts: ['Thu', 'Fri', 'Sat', 'Sun'] },
  { name: 'Layla', role: 'Cashier', shifts: ['Mon', 'Wed', 'Fri', 'Sat'] },
]

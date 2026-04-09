import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // ─── Categories ──────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'salads' },    update: {}, create: { name: 'Salads',    slug: 'salads',    displayOrder: 1 } }),
    prisma.category.upsert({ where: { slug: 'soups' },     update: {}, create: { name: 'Soups',     slug: 'soups',     displayOrder: 2 } }),
    prisma.category.upsert({ where: { slug: 'curries' },   update: {}, create: { name: 'Curries',   slug: 'curries',   displayOrder: 3 } }),
    prisma.category.upsert({ where: { slug: 'wok' },       update: {}, create: { name: 'Wok',       slug: 'wok',       displayOrder: 4 } }),
    prisma.category.upsert({ where: { slug: 'specialty' }, update: {}, create: { name: 'Specialty', slug: 'specialty', displayOrder: 5 } }),
    prisma.category.upsert({ where: { slug: 'noodles' },   update: {}, create: { name: 'Noodles',   slug: 'noodles',   displayOrder: 6 } }),
    prisma.category.upsert({ where: { slug: 'rice' },      update: {}, create: { name: 'Rice',      slug: 'rice',      displayOrder: 7 } }),
    prisma.category.upsert({ where: { slug: 'desserts' },  update: {}, create: { name: 'Desserts',  slug: 'desserts',  displayOrder: 8 } }),
    prisma.category.upsert({ where: { slug: 'beverages' }, update: {}, create: { name: 'Beverages', slug: 'beverages', displayOrder: 9 } }),
  ])

  const [salads, soups, curries, wok, , noodles, rice, desserts, beverages] = categories
  console.log(`✓ ${categories.length} categories`)

  // ─── Products ─────────────────────────────────────────────────────────────────
  const products = [
    {
      categoryId: salads.id,
      name: 'Authentic Som Tam',
      description: 'Green papaya salad with chili, peanuts, and lime.',
      price: 120,
      emoji: '🥗',
      spiceLevels: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
      addOns: [
        { name: 'Extra Peanuts', price: 10 },
        { name: 'Dried Shrimp', price: 15 },
        { name: 'Crab', price: 40 },
      ],
    },
    {
      categoryId: salads.id,
      name: 'Larb Gai',
      description: 'Minced chicken salad with toasted rice powder.',
      price: 140,
      emoji: '🥗',
      spiceLevels: ['Mild', 'Medium', 'Hot'],
      addOns: [{ name: 'Extra Herbs', price: 10 }],
    },
    {
      categoryId: soups.id,
      name: 'Tom Yum Goong',
      description: 'Spicy and sour prawn soup with fresh lemongrass.',
      price: 180,
      emoji: '🍲',
      spiceLevels: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
      addOns: [
        { name: 'Extra Prawns', price: 50 },
        { name: 'Mushrooms', price: 15 },
      ],
    },
    {
      categoryId: soups.id,
      name: 'Tom Kha Gai',
      description: 'Coconut chicken soup with galangal.',
      price: 160,
      emoji: '🍲',
      spiceLevels: ['Mild', 'Medium'],
      addOns: [{ name: 'Extra Chicken', price: 30 }],
    },
    {
      categoryId: curries.id,
      name: 'Green Curry Chicken',
      description: 'Classic green curry with Thai eggplant and basil.',
      price: 170,
      emoji: '🍛',
      spiceLevels: ['Mild', 'Medium', 'Hot'],
      addOns: [
        { name: 'Extra Chicken', price: 30 },
        { name: 'Tofu instead', price: 0 },
      ],
    },
    {
      categoryId: curries.id,
      name: 'Massaman Beef',
      description: 'Rich and mild curry with tender beef and potatoes.',
      price: 220,
      emoji: '🍛',
      isSoldOut: true,
      spiceLevels: ['Mild', 'Medium'],
      addOns: [{ name: 'Extra Beef', price: 50 }],
    },
    {
      categoryId: wok.id,
      name: 'Pad Kra Pao',
      description: 'Holy basil stir-fry with minced pork and fried egg.',
      price: 150,
      emoji: '🍳',
      spiceLevels: ['Mild', 'Medium', 'Hot', 'Extra Hot'],
      addOns: [
        { name: 'Fried Egg', price: 15 },
        { name: 'Extra Pork', price: 30 },
      ],
    },
    {
      categoryId: noodles.id,
      name: 'Pad Thai',
      description: 'Stir-fried rice noodles with tamarind sauce and peanuts.',
      price: 160,
      emoji: '🍜',
      spiceLevels: ['Mild', 'Medium', 'Hot'],
      addOns: [
        { name: 'Extra Peanuts', price: 10 },
        { name: 'Extra Tofu', price: 15 },
        { name: 'Prawns', price: 40 },
      ],
    },
    {
      categoryId: rice.id,
      name: 'Pineapple Fried Rice',
      description: 'Jasmine rice stir-fried with pineapple and cashews.',
      price: 145,
      emoji: '🍚',
      spiceLevels: ['Mild', 'Medium'],
      addOns: [
        { name: 'Chicken', price: 25 },
        { name: 'Prawns', price: 40 },
      ],
    },
    {
      categoryId: desserts.id,
      name: 'Mango Sticky Rice',
      description: 'Sweet coconut sticky rice with fresh ripe mango.',
      price: 110,
      emoji: '🥭',
      spiceLevels: [],
      addOns: [],
    },
    {
      categoryId: beverages.id,
      name: 'Thai Iced Tea',
      description: 'Sweet creamy black tea over ice.',
      price: 65,
      emoji: '🧋',
      spiceLevels: [],
      addOns: [],
    },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: products.indexOf(p) + 1 },
      update: {},
      create: {
        categoryId: p.categoryId,
        name: p.name,
        description: p.description,
        price: p.price,
        emoji: p.emoji,
        isSoldOut: p.isSoldOut ?? false,
        spiceLevels: p.spiceLevels,
        addOns: p.addOns,
      },
    })
  }
  console.log(`✓ ${products.length} products`)

  // ─── Tables ───────────────────────────────────────────────────────────────────
  await Promise.all([
    prisma.table.upsert({ where: { id: 1 }, update: {}, create: { name: 'Table 1', capacity: 2 } }),
    prisma.table.upsert({ where: { id: 2 }, update: {}, create: { name: 'Table 2', capacity: 4 } }),
    prisma.table.upsert({ where: { id: 3 }, update: {}, create: { name: 'Table 3', capacity: 6 } }),
  ])
  console.log('✓ 3 tables')

  // ─── Staff ────────────────────────────────────────────────────────────────────
  const staffData = [
    { name: 'Nuha',  role: 'Chef',      shift: 'Mon-Fri' },
    { name: 'Adham', role: 'Sous Chef', shift: 'Tue-Sat' },
    { name: 'Sana',  role: 'Server',    shift: 'Mon-Wed, Sat-Sun' },
    { name: 'Rafa',  role: 'Server',    shift: 'Thu-Sun' },
    { name: 'Layla', role: 'Cashier',   shift: 'Mon, Wed, Fri-Sat' },
  ]
  for (const s of staffData) {
    const exists = await prisma.staff.findFirst({ where: { name: s.name } })
    if (!exists) await prisma.staff.create({ data: s })
  }
  console.log('✓ 5 staff members')

  // ─── Settings ─────────────────────────────────────────────────────────────────
  await prisma.setting.upsert({
    where: { key: 'restaurant_info' },
    update: {},
    create: {
      key: 'restaurant_info',
      value: {
        name: 'Som Tam Thai',
        phone: '+960 789 2616',
        address: 'Izzudhdheen Magu, Maafannu, Malé, Maldives',
        currency: 'MVR',
      },
    },
  })

  await prisma.setting.upsert({
    where: { key: 'operating_hours' },
    update: {},
    create: {
      key: 'operating_hours',
      value: {
        lunch: { start: '11:30', end: '15:30' },
        dinner: { start: '18:00', end: '22:00' },
        dinnerByReservation: true,
        schedule: [
          { day: 'Mon', lunchEnabled: true,  dinnerEnabled: false },
          { day: 'Tue', lunchEnabled: true,  dinnerEnabled: true  },
          { day: 'Wed', lunchEnabled: true,  dinnerEnabled: true  },
          { day: 'Thu', lunchEnabled: true,  dinnerEnabled: true  },
          { day: 'Fri', lunchEnabled: false, dinnerEnabled: true  },
          { day: 'Sat', lunchEnabled: true,  dinnerEnabled: true  },
          { day: 'Sun', lunchEnabled: true,  dinnerEnabled: false },
        ],
      },
    },
  })

  await prisma.setting.upsert({
    where: { key: 'delivery' },
    update: {},
    create: {
      key: 'delivery',
      value: { fee: 30, freeAbove: 500, estimatedMinutes: 30 },
    },
  })
  console.log('✓ 3 settings keys')

  // ─── Admin User ───────────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@somtamthai.mv'
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123'
  const existing = await prisma.adminUser.findUnique({ where: { email: adminEmail } })
  if (!existing) {
    const passwordHash = await bcrypt.hash(adminPassword, 12)
    await prisma.adminUser.create({
      data: { email: adminEmail, passwordHash, name: 'Admin' },
    })
    console.log(`✓ Admin user created: ${adminEmail}`)
  } else {
    console.log(`✓ Admin user already exists: ${adminEmail}`)
  }

  console.log('\nSeed complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

'use client'

import { useState } from 'react'
import { PRODUCTS, MENU_CATEGORIES, Product } from '@/lib/mockData'
import { Plus, X, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

type MenuProduct = Product & { available: boolean }

const SPICE_LEVELS = ['Mild', 'Medium', 'Hot', 'Extra Hot']

export default function AdminMenuPage() {
  const [products, setProducts] = useState<MenuProduct[]>(
    PRODUCTS.map((p) => ({ ...p, available: !p.isSoldOut }))
  )
  const [activeCategory, setActiveCategory] = useState('All')
  const [drawer, setDrawer] = useState<'add' | 'edit' | null>(null)
  const [editingProduct, setEditingProduct] = useState<MenuProduct | null>(null)
  const [form, setForm] = useState({
    name: '', category: MENU_CATEGORIES[0], price: '', desc: '', emoji: '🍲',
    spiceLevels: [] as string[],
  })

  const filtered =
    activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory)

  const toggleAvail = (id: number) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, available: !p.available, isSoldOut: p.available } : p)))

  const deleteProduct = (id: number) =>
    setProducts((prev) => prev.filter((p) => p.id !== id))

  const openEdit = (p: MenuProduct) => {
    setEditingProduct(p)
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      desc: p.desc,
      emoji: p.emoji || '🍲',
      spiceLevels: p.spiceLevels ?? [],
    })
    setDrawer('edit')
  }

  const openAdd = () => {
    setEditingProduct(null)
    setForm({ name: '', category: MENU_CATEGORIES[0], price: '', desc: '', emoji: '🍲', spiceLevels: [] })
    setDrawer('add')
  }

  const toggleSpice = (level: string) => {
    setForm((f) => ({
      ...f,
      spiceLevels: f.spiceLevels.includes(level)
        ? f.spiceLevels.filter((s) => s !== level)
        : [...f.spiceLevels, level],
    }))
  }

  const handleSave = () => {
    if (!form.name || !form.price) return
    if (drawer === 'add') {
      const newProduct: MenuProduct = {
        id: Date.now(),
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        desc: form.desc,
        emoji: form.emoji,
        isSoldOut: false,
        available: true,
        spiceLevels: form.spiceLevels.length > 0 ? form.spiceLevels : undefined,
      }
      setProducts((prev) => [...prev, newProduct])
    } else if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...p, name: form.name, category: form.category, price: parseFloat(form.price), desc: form.desc, emoji: form.emoji, spiceLevels: form.spiceLevels.length > 0 ? form.spiceLevels : undefined }
            : p
        )
      )
    }
    setDrawer(null)
  }

  const categories = ['All', ...MENU_CATEGORIES]

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-500 text-sm">{products.length} items</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-900 transition"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition border ${
              activeCategory === cat
                ? 'bg-brand-green text-white border-brand-green'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-green'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-shadow hover:shadow-md ${
              p.available ? 'border-gray-200' : 'border-gray-200 opacity-60'
            }`}
          >
            <div className="h-24 bg-gradient-to-br from-brand-green/10 to-brand-gold/10 flex items-center justify-center text-4xl relative">
              {p.emoji || '🍲'}
              {!p.available && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border">
                    Unavailable
                  </span>
                </div>
              )}
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between gap-1 mb-1">
                <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1">{p.name}</h3>
                <span className="font-semibold text-brand-green text-sm flex-shrink-0">MVR {p.price}</span>
              </div>
              <p className="text-xs text-gray-400 mb-2 line-clamp-1">{p.category}</p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleAvail(p.id)}
                  className={`flex items-center gap-1 text-xs font-medium transition ${
                    p.available ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {p.available ? (
                    <ToggleRight className="w-5 h-5 text-green-500" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-gray-400" />
                  )}
                  {p.available ? 'Available' : 'Unavailable'}
                </button>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-1.5 text-gray-400 hover:text-brand-green transition rounded"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {drawer && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setDrawer(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl z-50 flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">{drawer === 'add' ? 'Add Menu Item' : 'Edit Item'}</h2>
              <button onClick={() => setDrawer(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green"
                >
                  {MENU_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (MVR)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emoji</label>
                  <input
                    value={form.emoji}
                    onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.desc}
                  onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none resize-none focus:ring-2 focus:ring-brand-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spice Levels</label>
                <div className="flex flex-wrap gap-2">
                  {SPICE_LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => toggleSpice(level)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        form.spiceLevels.includes(level)
                          ? 'bg-brand-green text-white border-brand-green'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-brand-green'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex gap-3">
              <button onClick={() => setDrawer(null)} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name || !form.price}
                className="flex-1 py-2.5 bg-brand-green text-white rounded-xl text-sm font-semibold hover:bg-green-900 disabled:opacity-50 transition"
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  )
}

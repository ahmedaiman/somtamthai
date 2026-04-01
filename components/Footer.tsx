import Link from 'next/link'
import { RESTAURANT_INFO, OPERATING_HOURS } from '@/lib/mockData'

export default function Footer() {
  return (
    <footer className="bg-brand-green text-brand-cream py-10 px-4 mt-12 pb-24 md:pb-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="font-lora text-xl font-bold mb-4 text-brand-gold">
            {RESTAURANT_INFO.name}
          </h4>
          <p className="text-sm text-brand-cream/80 leading-relaxed mb-4">
            Authentic Thai cuisine, scratch-cooked with fresh ingredients and traditional techniques.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-4">Contact Us</h4>
          <ul className="space-y-2 text-sm text-brand-cream/80">
            <li>
              <a href={`tel:${RESTAURANT_INFO.phone}`} className="hover:text-brand-gold transition-colors">
                📞 {RESTAURANT_INFO.phone}
              </a>
            </li>
            <li>📍 {RESTAURANT_INFO.address}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Operating Hours</h4>
          <ul className="space-y-2 text-sm text-brand-cream/80">
            <li>Lunch: {OPERATING_HOURS.lunch.start} – {OPERATING_HOURS.lunch.end}</li>
            <li>Dinner: {OPERATING_HOURS.dinner}</li>
            <li className="mt-4">
              <Link href="#" className="underline hover:text-brand-gold transition-colors">
                Order via Foodie App
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-brand-cream/20 text-center text-xs text-brand-cream/50">
        &copy; 2026 Som Tam Thai. All rights reserved.
      </div>
    </footer>
  )
}

import { Cairo } from 'next/font/google'
import './globals.css'
import FloatingButtons from '@/components/FloatingButtons'

const cairo = Cairo({ subsets: ['arabic', 'latin'], weight: ['400','600','700','900'] })

export const metadata = {
  title: 'Dzair Express',
  description: 'أفضل المنتجات بأسعار لا تُقاوم - الدفع عند الاستلام',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        {children}
        <FloatingButtons />
      </body>
    </html>
  )
}

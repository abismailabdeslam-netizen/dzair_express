import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ProductClientSection from './ProductClientSection'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getProduct(id) {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

async function getSettings() {
  const { data } = await supabase.from('settings').select('*')
  const s = {}
  data?.forEach(r => s[r.key] = r.value)
  return s
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id)
  if (!product) notFound()

  const settings = await getSettings()
  const disc = product.old_price
    ? Math.round((1 - product.price / product.old_price) * 100)
    : null

  return (
    <ProductClientSection
      product={product}
      settings={settings}
      disc={disc}
    />
  )
}

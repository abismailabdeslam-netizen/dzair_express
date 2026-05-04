// app/api/debug-env/route.js
// ⚠️ احذف هذا الملف بعد حل المشكلة

import { NextResponse } from 'next/server'

export async function GET() {
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  const replicateKey = process.env.REPLICATE_API_TOKEN

  return NextResponse.json({
    anthropic: {
      exists: !!anthropicKey,
      prefix: anthropicKey ? anthropicKey.substring(0, 15) + '...' : 'غير موجود',
      length: anthropicKey?.length || 0,
    },
    replicate: {
      exists: !!replicateKey,
      prefix: replicateKey ? replicateKey.substring(0, 8) + '...' : 'غير موجود',
      length: replicateKey?.length || 0,
    },
  })
}

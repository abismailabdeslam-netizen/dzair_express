import { NextResponse } from 'next/server'

// ═══════════════════════════════════════════════════════════════
//  /api/generate — نظام الذكاء الاصطناعي متعدد العملاء
//  Claude (القائد) ← يولّد النصوص وبرومبتات الصور
//  Flux  (المنفذ) ← يولّد الصور بناءً على أوامر Claude
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const { productName, category, target, tone, extraInfo } = await request.json()

    if (!productName || !category) {
      return NextResponse.json({ error: 'اسم المنتج والفئة مطلوبان' }, { status: 400 })
    }

    // ── المرحلة 1: Claude يفكر ويولّد كل شيء ──────────────────
    const content = await askClaude({ productName, category, target, tone, extraInfo })

    // ── المرحلة 2: Flux يولّد الصور بناءً على أوامر Claude ──────
    const generated_images = await generateImages(content.image_prompts || [])

    return NextResponse.json({ ...content, generated_images })

  } catch (err) {
    console.error('Generate API Error:', err)
    return NextResponse.json({ error: err.message || 'خطأ غير متوقع' }, { status: 500 })
  }
}

// ─── Claude: القائد والمفكر ────────────────────────────────────
async function askClaude({ productName, category, target, tone, extraInfo }) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY غير موجود في متغيرات البيئة')

  const prompt = `أنت خبير تسويق رقمي متخصص في السوق الجزائري ومتخصص في صفحات الهبوط عالية التحويل.
مهمتك: توليد محتوى تسويقي احترافي + برومبتات دقيقة لتوليد صور المنتج بالذكاء الاصطناعي.

معلومات المنتج:
- الاسم: ${productName}
- الفئة: ${category}
- الجمهور المستهدف: ${target}
- أسلوب الكتابة: ${tone}
- معلومات إضافية: ${extraInfo || 'لا يوجد'}

أجب بـ JSON فقط بدون أي نص خارجه أو backticks:
{
  "headline": "عنوان رئيسي جذاب وقوي لا يتجاوز 10 كلمات يخلق فضولاً أو يحل مشكلة",
  "subheadline": "عنوان فرعي يوضح الفائدة الرئيسية في جملة واحدة",
  "description": "وصف مقنع من 3 إلى 4 جمل يركز على الفوائد وحل مشاكل الزبون الجزائري",
  "bullets": ["ميزة مقنعة 1", "ميزة مقنعة 2", "ميزة مقنعة 3", "ميزة مقنعة 4"],
  "cta_button": "نص زر الطلب لا يتجاوز 5 كلمات",
  "urgency_text": "جملة تحفيز على الشراء الفوري تخلق إلحاحاً حقيقياً",
  "banner_texts": [
    "نص البانر الأول: جملتان تسويقيتان قويتان",
    "نص البانر الثاني: جملتان تسويقيتان مختلفتان"
  ],
  "image_prompts": [
    "English prompt: Professional commercial product photo of ${productName}, ${category} category, studio lighting with soft shadows, clean white/light gray background, high-end photography, 8K resolution, photorealistic, sharp focus, no text, no watermark",
    "English prompt: Lifestyle/contextual photo of ${productName}, elegant real-world setting, natural warm lighting, premium quality feel, advertising photography style, no text, no watermark, photorealistic"
  ],
  "theme_color": "#hexcolor — اقترح لوناً يناسب الفئة والمنتج",
  "seo_title": "عنوان SEO مناسب للمنتج"
}

تعليمات image_prompts:
- اكتب بالإنجليزية فقط
- كن دقيقاً جداً في وصف المنتج والإضاءة والخلفية
- اجعل البرومبت احترافياً كما يستخدمه المصورون المحترفون
- لا تذكر أسماء علامات تجارية حقيقية`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1800,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Claude API: ${err?.error?.message || res.status}`)
  }

  const data = await res.json()
  const raw  = data.content?.[0]?.text || ''
  const clean = raw.replace(/```json|```/g, '').trim()

  try {
    return JSON.parse(clean)
  } catch {
    throw new Error('Claude لم يُرجع JSON صحيح — حاول مجدداً')
  }
}

// ─── Flux: منفذ الصور بأوامر من Claude ────────────────────────
async function generateImages(prompts) {
  const token = process.env.REPLICATE_API_TOKEN
  if (!token) {
    console.warn('REPLICATE_API_TOKEN غير موجود — سيتم تخطي توليد الصور')
    return []
  }

  // توليد الصور بالتوازي لتوفير الوقت
  const results = await Promise.allSettled(
    prompts.slice(0, 2).map(prompt => generateOneImage(prompt, token))
  )

  return results.map(r => (r.status === 'fulfilled' ? r.value : null))
}

async function generateOneImage(prompt, token) {
  // إرسال طلب لـ Flux Schnell (أسرع نموذج من Black Forest Labs)
  const res = await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions',
    {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
        Prefer: 'wait', // انتظر حتى 60 ثانية للنتيجة
      },
      body: JSON.stringify({
        input: {
          prompt,
          num_outputs: 1,
          aspect_ratio: '1:1',
          output_format: 'webp',
          output_quality: 85,
          num_inference_steps: 4, // Schnell يحتاج 4 خطوات فقط
        },
      }),
    }
  )

  const data = await res.json()

  // إذا أنهت مباشرة
  if (data.status === 'succeeded') return data.output?.[0] || null

  // إذا لا تزال تعمل — نستمر في الاستطلاع
  if (data.id) return await pollUntilDone(data.id, token)

  return null
}

async function pollUntilDone(id, token) {
  for (let i = 0; i < 40; i++) {
    await sleep(1500)
    const res  = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { Authorization: `Token ${token}` },
    })
    const data = await res.json()
    if (data.status === 'succeeded') return data.output?.[0] || null
    if (data.status === 'failed')    return null
  }
  return null
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

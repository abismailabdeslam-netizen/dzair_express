// أسعار التوصيل لكل ولاية — مستخرجة من ملف شركة التوصيل
// المفتاح هو رقم الولاية (من اسم الولاية في wilayas.js)

export const DELIVERY_PRICES = {
  '01': { home: 1150, office: 850  },
  '02': { home: 800,  office: 400  },
  '03': { home: 900,  office: 450  },
  '04': { home: 700,  office: 300  },
  '05': { home: 700,  office: 300  },
  '06': { home: 700,  office: 300  },
  '07': { home: 900,  office: 450  },
  '08': { home: 1000, office: 750  },
  '09': { home: 750,  office: 350  },
  '10': { home: 750,  office: 350  },
  '11': { home: 1200, office: 900  },
  '12': { home: 700,  office: 300  },
  '13': { home: 800,  office: 400  },
  '14': { home: 800,  office: 400  },
  '15': { home: 750,  office: 350  },
  '16': { home: 550,  office: 350  },
  '17': { home: 900,  office: 450  },
  '18': { home: 700,  office: 300  },
  '19': { home: 700,  office: 300  },
  '20': { home: 800,  office: 400  },
  '21': { home: 700,  office: 300  },
  '22': { home: 800,  office: 400  },
  '23': { home: 700,  office: 300  },
  '24': { home: 700,  office: 300  },
  '25': { home: 700,  office: 300  },
  '26': { home: 750,  office: 350  },
  '27': { home: 800,  office: 400  },
  '28': { home: 700,  office: 300  },
  '29': { home: 800,  office: 400  },
  '30': { home: 900,  office: 450  },
  '31': { home: 800,  office: 400  },
  '32': { home: 900,  office: 450  },
  '33': { home: 1200, office: 1100 },
  '34': { home: 450,  office: 250  },
  '35': { home: 750,  office: 350  },
  '36': { home: 700,  office: 300  },
  '37': { home: 1300, office: 850  },
  '38': { home: 800,  office: 400  },
  '39': { home: 900,  office: 450  },
  '40': { home: 700,  office: 300  },
  '41': { home: 700,  office: 300  },
  '42': { home: 750,  office: 350  },
  '43': { home: 700,  office: 300  },
  '44': { home: 750,  office: 350  },
  '45': { home: 900,  office: 450  },
  '46': { home: 800,  office: 400  },
  '47': { home: 900,  office: 450  },
  '48': { home: 800,  office: 400  },
  '49': { home: 1000, office: 750  },
  '50': { home: 1250, office: 700  },
  '51': { home: 900,  office: 450  },
  '52': { home: 1250, office: 700  },
  '53': { home: 1200, office: 1000 },
  '54': { home: 1200, office: 1000 },
  '55': { home: 900,  office: 450  },
  '56': { home: 1200, office: 1100 },
  '57': { home: 900,  office: 0    },
  '58': { home: 1000, office: 750  },
}

// استخراج رقم الولاية من اسمها مثل "16 - الجزائر" → "16"
export function getWilayaCode(wilayaName) {
  if (!wilayaName) return null
  const match = wilayaName.match(/^(\d+)/)
  return match ? match[1].padStart(2, '0') : null
}

// الحصول على سعر التوصيل
export function getDeliveryPrice(wilayaName, type = 'home') {
  const code = getWilayaCode(wilayaName)
  if (!code || !DELIVERY_PRICES[code]) return 0
  return DELIVERY_PRICES[code][type] || 0
}

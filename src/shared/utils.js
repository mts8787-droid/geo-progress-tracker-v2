// ─── 한/영 이름 매핑 (기본 번역 폴백) ──────────────────────────────────────────
const CNTY_EN = { '미국':'US','영국':'UK','독일':'Germany','브라질':'Brazil','인도':'India','멕시코':'Mexico','스페인':'Spain','호주':'Australia','베트남':'Vietnam','캐나다':'Canada' }
const PROD_EN = { 'TV':'TV','세탁기':'Washing Machine','냉장고':'Refrigerator','모니터':'Monitor','오디오':'Audio','Cooking':'Cooking','식기세척기':'Dishwasher','청소기':'Vacuum Cleaner','RAC':'RAC','Aircare':'Aircare' }
const COMP_EN = { '삼성':'Samsung','삼성전자':'Samsung','보쉬':'Bosch','다이슨':'Dyson','소니':'Sony' }

export function resolveDataForLang(products, productsCnty, citations, citationsCnty, lang) {
  if (lang !== 'en') return { products, productsCnty, citations, citationsCnty }
  return {
    products: products.map(p => ({
      ...p,
      kr: p.en || PROD_EN[p.kr] || p.kr,
      compName: p.compNameEn || COMP_EN[p.compName] || p.compName,
    })),
    productsCnty: productsCnty.map(r => ({
      ...r,
      country: r.countryEn || CNTY_EN[r.country] || r.country,
      product: r.productEn || PROD_EN[r.product] || r.product,
      compName: r.compNameEn || COMP_EN[r.compName] || r.compName,
    })),
    citations: citations.map(c => ({
      ...c,
      category: c.categoryEn || PROD_EN[c.category] || c.category,
    })),
    citationsCnty: citationsCnty.map(r => ({
      ...r,
      cnty: r.cntyEn || r.cnty,
    })),
  }
}

// ─── 클라이언트 측 Google Translate (비공식 API) ─────────────────────────────
export async function translateTexts(texts, { from = 'ko', to = 'en' } = {}) {
  const BATCH = 20
  const translated = []
  for (let i = 0; i < texts.length; i += BATCH) {
    const batch = texts.slice(i, i + BATCH)
    const results = await Promise.all(batch.map(async (text) => {
      if (!text || !text.trim()) return text
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`번역 실패 (${res.status})`)
      const data = await res.json()
      return data[0].map(s => s[0]).join('')
    }))
    translated.push(...results)
  }
  return translated
}

export function statusStyle(status) {
  if (status === 'lead')     return { bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D', badge: '선도' }
  if (status === 'behind')   return { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309', badge: '추격' }
  if (status === 'critical') return { bg: '#FFF1F2', border: '#FECDD3', text: '#BE123C', badge: '취약' }
  return                            { bg: '#F8FAFC', border: '#E2E8F0', text: '#475569', badge: '보통' }
}

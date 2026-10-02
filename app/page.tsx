'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Check,
  Clipboard,
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Upload,
  X,
} from 'lucide-react'

const tones = ['Professional', 'Friendly', 'Persuasive', 'Luxury', 'Casual']
const lengths = ['Short', 'Medium', 'Long']
const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Japanese', 'Korean', 'Arabic', 'Bengali', 'Tamil', 'Telugu']
const marketplaces = ['General', 'Amazon', 'Shopify', 'Etsy', 'Flipkart']
const ctas = ['Shop now', 'Learn more', 'Buy today', 'Get started']
const workspaceFeatures = [
  ['Writing tones', 'Professional, friendly, persuasive, luxury and casual styles.'],
  ['Description lengths', 'Short, medium and long output for different product surfaces.'],
  ['Multilingual copy', 'Generate structured copy in 13 supported languages.'],
  ['Product image preview', 'Preview an optional product image before generating.'],
  ['Local draft recovery', 'Your latest form and generated copy are restored after refresh.'],
  ['Copy to clipboard', 'Copy the generated description with one action.'],
  ['Text download', 'Download the current description as a plain-text file.'],
  ['Markdown export', 'Export a presentation-ready Markdown version.'],
  ['JSON export', 'Export structured product copy for handoff to another tool.'],
  ['Print / PDF', 'Use the browser print dialog to save a clean PDF copy.'],
]

export default function Page() {
  const [productName, setProductName] = useState('')
  const [features, setFeatures] = useState('')
  const [tone, setTone] = useState('Professional')
  const [length, setLength] = useState('Medium')
  const [language, setLanguage] = useState('English')
  const [marketplace, setMarketplace] = useState('General')
  const [audience, setAudience] = useState('')
  const [price, setPrice] = useState('')
  const [seoKeywords, setSeoKeywords] = useState('')
  const [cta, setCta] = useState('Shop now')
  const [image, setImage] = useState<string | null>(null)
  const [generated, setGenerated] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(true)
  const productInputRef = useRef<HTMLInputElement>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('productly-theme')
      if (savedTheme) {
        setDarkMode(savedTheme === 'dark')
      }
      const saved = localStorage.getItem('productly-draft-v2')
      if (saved) {
        const draft = JSON.parse(saved)
        if (draft && typeof draft === 'object') {
          setProductName(draft.productName || '')
          setFeatures(draft.features || '')
          setTone(draft.tone || 'Professional')
          setLength(draft.length || 'Medium')
          setLanguage(draft.language || 'English')
          setMarketplace(draft.marketplace || 'General')
          setAudience(draft.audience || '')
          setPrice(draft.price || '')
          setSeoKeywords(draft.seoKeywords || '')
          setCta(draft.cta || 'Shop now')
          setGenerated(draft.generated || '')
          setImage(localStorage.getItem('productly-draft-image-v2') || draft.image || null)
        }
      }
    } catch {
      // Ignore malformed local drafts and start clean.
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    const timer = window.setTimeout(() => {
      try {
        const isEmpty = !productName.trim() && !features.trim() && !generated.trim() && !audience.trim() && !price.trim() && !seoKeywords.trim()
        if (isEmpty) {
          localStorage.removeItem('productly-draft-v2')
        } else {
          localStorage.setItem('productly-draft-v2', JSON.stringify({
            productName, features, tone, length, language, marketplace,
            audience, price, seoKeywords, cta, generated,
          }))
        }
      } catch {
        // Ignore storage errors if browser storage quota is reached.
      }
    }, 250)
    return () => window.clearTimeout(timer)
  }, [hydrated, productName, features, tone, length, language, marketplace, audience, price, seoKeywords, cta, generated])

  function toggleTheme() {
    setDarkMode((prev) => {
      const next = !prev
      try {
        localStorage.setItem('productly-theme', next ? 'dark' : 'light')
      } catch {
        // Storage restricted
      }
      return next
    })
  }

  function removeImage() {
    setImage(null)
    try {
      localStorage.removeItem('productly-draft-image-v2')
    } catch {
      // Ignore storage errors; the image is already removed from the UI.
    }
  }

  function clearDraft() {
    try {
      localStorage.removeItem('productly-draft-v2')
      localStorage.removeItem('productly-draft-image-v2')
    } catch {
      // Ignore storage errors; the in-memory form is still cleared.
    }
    setProductName('')
    setFeatures('')
    setTone('Professional')
    setLength('Medium')
    setLanguage('English')
    setMarketplace('General')
    setAudience('')
    setPrice('')
    setSeoKeywords('')
    setCta('Shop now')
    setGenerated('')
    setImage(null)
    setError('')
  }

  function editGenerated() {
    productInputRef.current?.focus()
    productInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  function handleImage(file?: File) {
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setError('Please upload a PNG, JPG, JPEG, or WEBP image.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Images must be smaller than 10 MB.')
      return
    }
    setError('')
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null
      setImage(result)
      if (result) {
        try {
          localStorage.setItem('productly-draft-image-v2', result)
        } catch {
          // Keep the image in memory if browser storage is full.
        }
      }
    }
    reader.onerror = () => setError('The image could not be read. Please try another file.')
    reader.readAsDataURL(file)
  }

  function loadExample() {
    setError('')
    setProductName('AeroSip Insulated Bottle')
    setFeatures('24-hour cold retention, leak-proof lid, recycled stainless steel, fits standard cup holders')
    setTone('Friendly')
    setLength('Medium')
    setLanguage('English')
    setMarketplace('General')
    setAudience('students, professionals')
    setPrice('₹4,999')
    setSeoKeywords('insulated bottle, reusable water bottle')
    setCta('Shop now')
    setGenerated('Meet the AeroSip Insulated Bottle — your everyday companion for cold drinks that stay refreshing all day long. Built from recycled stainless steel with a leak-proof lid and a cup-holder-friendly shape, it makes staying hydrated feel effortless. Take it to work, the gym, or wherever the day takes you.')
  }

  function enrichFeature(feature: string, index = 0) {
    const value = feature.trim()
    const lower = value.toLowerCase()

    if (lower.includes('waterproof') || lower.includes('water resistant')) {
      return 'Waterproof protection helps keep the product safe and dependable in everyday conditions.'
    }
    if (lower.includes('lightweight')) {
      return 'A lightweight build makes it comfortable to carry and easy to use wherever the day takes you.'
    }
    if (lower.includes('recharge') || lower.includes('battery')) {
      return 'Rechargeable performance keeps it ready for repeated use without constantly replacing batteries.'
    }
    if (lower.includes('leak') || lower.includes('seal')) {
      return 'A leak-proof lid ensures mess-free carrying so you can pack it in any bag with total peace of mind.'
    }
    if (lower.includes('cold') || lower.includes('hot') || lower.includes('insulat') || lower.includes('24-hour')) {
      return 'Advanced insulation maintains optimal beverage temperatures for up to 24 hours of refreshing sips.'
    }
    if (lower.includes('steel') || lower.includes('stainless') || lower.includes('durable')) {
      return 'Durable stainless steel construction is made to handle regular use while maintaining reliable performance.'
    }
    if (lower.includes('cup holder') || lower.includes('portable')) {
      return 'A portable, cup-holder-friendly design makes it simple to take along from home to work, the gym, or your next adventure.'
    }
    if (lower.includes('wireless') || lower.includes('bluetooth')) {
      return 'Wireless convenience gives you more freedom to move without the restriction of tangled cables.'
    }
    if (lower.includes('fast') || lower.includes('speed')) {
      return 'Fast performance helps you spend less time waiting and more time getting things done.'
    }
    if (lower.includes('premium') || lower.includes('luxury')) {
      return 'Premium materials and considered details give it a refined feel you can notice from the first use.'
    }
    if (lower.includes('eco') || lower.includes('recycled') || lower.includes('sustainable')) {
      return 'An eco-friendly approach helps reduce waste while making a more thoughtful everyday choice.'
    }

    const fallbacks = [
      `${value.charAt(0).toUpperCase() + value.slice(1)} adds practical value, making everyday use more effortless and dependable.`,
      `${value.charAt(0).toUpperCase() + value.slice(1)} delivers consistent convenience whenever you need it.`,
      `${value.charAt(0).toUpperCase() + value.slice(1)} ensures a seamless, high-quality experience day in and day out.`,
      `${value.charAt(0).toUpperCase() + value.slice(1)} helps you get the most out of every moment without unnecessary hassle.`
    ]
    return fallbacks[index % fallbacks.length]
  }

  function describeFeatures(value: string) {
    const items = value.split(/,|\n/).map((item) => item.trim()).filter(Boolean)
    if (!items.length) return ''
    return items.map((item, i) => enrichFeature(item, i)).join(' ')
  }

  function featureListText(value: string, limit = 3) {
    const items = value.split(/,|\n/).map((item) => item.trim()).filter(Boolean).slice(0, limit)
    if (items.length === 1) return items[0]
    if (items.length === 2) return `${items[0]} and ${items[1]}`
    return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
  }

  function localizedCopy(language: string, product: string, featureItems: string[], context: string) {
    const dictionaries: Record<string, Record<string, string>> = {
      Hindi: { '24-hour': '24-घंटे तापमान नियंत्रण', 'leak-proof': 'लीक-प्रूफ', insulated: 'इंसुलेटेड', waterproof: 'वॉटरप्रूफ', lightweight: 'हल्का', rechargeable: 'रिचार्जेबल', portable: 'पोर्टेबल', durable: 'टिकाऊ', wireless: 'वायरलेस', premium: 'प्रीमियम', ecofriendly: 'पर्यावरण-अनुकूल' },
      Spanish: { '24-hour': 'retención de 24 horas', 'leak-proof': 'a prueba de fugas', insulated: 'aislado', waterproof: 'resistente al agua', lightweight: 'ligero', rechargeable: 'recargable', portable: 'portátil', durable: 'duradero', wireless: 'inalámbrico', premium: 'premium', ecofriendly: 'ecológico' },
      French: { '24-hour': 'maintien 24h', 'leak-proof': 'anti-fuite', insulated: 'isotherme', waterproof: 'résistant à l’eau', lightweight: 'léger', rechargeable: 'rechargeable', portable: 'portable', durable: 'durable', wireless: 'sans fil', premium: 'premium', ecofriendly: 'écologique' },
      German: { '24-hour': '24-Stunden-Isolierung', 'leak-proof': 'auslaufsicher', insulated: 'isoliert', waterproof: 'wasserdicht', lightweight: 'leicht', rechargeable: 'wiederaufladbar', portable: 'tragbar', durable: 'robust', wireless: 'kabellos', premium: 'hochwertig', ecofriendly: 'umweltfreundlich' },
      Portuguese: { '24-hour': 'retenção de 24 horas', 'leak-proof': 'à prova de vazamentos', insulated: 'térmico', waterproof: 'à prova d’água', lightweight: 'leve', rechargeable: 'recarregável', portable: 'portátil', durable: 'durável', wireless: 'sem fio', premium: 'premium', ecofriendly: 'ecológico' },
      Italian: { '24-hour': 'mantenimento 24 ore', 'leak-proof': 'a tenuta stagna', insulated: 'termico', waterproof: 'impermeabile', lightweight: 'leggero', rechargeable: 'ricaricabile', portable: 'portatile', durable: 'resistente', wireless: 'wireless', premium: 'premium', ecofriendly: 'ecologico' },
      Japanese: { '24-hour': '24時間保冷保温', 'leak-proof': '完全密閉・漏れ防止', insulated: '真空断熱', waterproof: '防水', lightweight: '軽量', rechargeable: '充電式', portable: 'ポータブル', durable: '耐久性', wireless: 'ワイヤレス', premium: 'プレミアム', ecofriendly: '環境配慮' },
      Korean: { '24-hour': '24시간 온도 유지', 'leak-proof': '누수 방지', insulated: '보온보냉', waterproof: '방수', lightweight: '경량', rechargeable: '충전식', portable: '휴대용', durable: '내구성', wireless: '무선', premium: '프리미엄', ecofriendly: '친환경' },
      Arabic: { '24-hour': 'حفظ الحرارة لمدة 24 ساعة', 'leak-proof': 'مانع للتسرب', insulated: 'عازل للحرارة', waterproof: 'مقاوم للماء', lightweight: 'خفيف الوزن', rechargeable: 'قابل لإعادة الشحن', portable: 'محمول', durable: 'متين', wireless: 'لاسلكي', premium: 'فاخر', ecofriendly: 'صديق للبيئة' },
      Bengali: { '24-hour': '২৪ ঘণ্টা তাপমাত্রা নিয়ন্ত্রণ', 'leak-proof': 'লিক-প্রুফ', insulated: 'ইনসুলেটেড', waterproof: 'জলরোধী', lightweight: 'হালকা', rechargeable: 'রিচার্জেবল', portable: 'বহনযোগ্য', durable: 'টেকসই', wireless: 'ওয়্যারলেস', premium: 'প্রিমিয়াম', ecofriendly: 'পরিবেশ-বান্ধব' },
      Tamil: { '24-hour': '24 மணி நேரம் குளிர்ச்சியைத் தக்கவைக்கும்', 'leak-proof': 'கசிவு இல்லாத வடிவமைப்பு', insulated: 'வெப்பக்காப்பு', waterproof: 'நீர்ப்புகா', lightweight: 'எடை குறைந்த', rechargeable: 'ரீசார்ஜ் செய்யக்கூடிய', portable: 'கையடக்கமான', durable: 'நீடித்த', wireless: 'வயர்லெஸ்', premium: 'பிரீமியம்', ecofriendly: 'சுற்றுச்சூழல் நட்பு' },
      Telugu: { '24-hour': '24 గంటల ఉష్ణోగ్రత నియంత్రణ', 'leak-proof': 'లీక్-ప్రూఫ్ డిజైన్', insulated: 'ఇన్సులేటెడ్', waterproof: 'వాటర్‌ప్రూఫ్', lightweight: 'తేలికైనది', rechargeable: 'రీఛార్జబుల్', portable: 'సులభంగా తీసుకెళ్లగల', durable: 'మన్నికైనది', wireless: 'వైర్‌లెస్', premium: 'ప్రీమియం', ecofriendly: 'పర్యావరణ అనుకూలమైనది' },
    }
    const words = dictionaries[language]
    if (!words) return ''

    const translateItem = (item: string) => {
      const key = item.toLowerCase().replace(/\s+/g, ' ').trim()
      if (words[key]) return words[key]
      for (const [k, v] of Object.entries(words)) {
        if (key.includes(k)) return v
      }
      return item
    }

    const translatedFeatures = featureItems.map(translateItem).join(', ')
    const templates: Record<string, string> = {
      Hindi: `${product} आपके रोज़मर्रा के लिए एक शानदार विकल्प है। इसमें ${translatedFeatures} जैसी खूबियां हैं। यह उत्पाद बेहतर उपयोगिता, भरोसेमंद प्रदर्शन और आसान अनुभव देता है।`,
      Spanish: `${product} es una excelente opción para tu día a día. Incluye ${translatedFeatures}. Ofrece utilidad, rendimiento confiable y una experiencia sencilla.`,
      French: `${product} est un excellent choix au quotidien. Il offre ${translatedFeatures}. Il combine utilité, fiabilité et simplicité.`,
      German: `${product} ist eine ausgezeichnete Wahl für den Alltag. Ausgestattet mit ${translatedFeatures}. Es bietet zuverlässige Leistung und eine einfache Nutzung.`,
      Portuguese: `${product} é uma excelente escolha para o dia a dia. Conta com ${translatedFeatures}. Oferece praticidade, desempenho confiável e facilidade de uso.`,
      Italian: `${product} è una scelta eccellente per ogni giorno. Include ${translatedFeatures}. Offre praticità, prestazioni affidabili e semplicità.`,
      Japanese: `${product}は毎日の暮らしにぴったりの製品です。${translatedFeatures}を備えています。便利で信頼性が高く、使いやすい設計です。`,
      Korean: `${product}은(는) 일상에 잘 어울리는 제품입니다. ${translatedFeatures} 기능을 제공합니다. 편리하고 안정적이며 사용하기 쉽습니다.`,
      Arabic: `${product} هو خيار ممتاز للاستخدام اليومي. يتميز بـ ${translatedFeatures}. يوفر سهولة الاستخدام وأداءً موثوقاً وفائدة عملية.`,
      Bengali: `${product} প্রতিদিনের ব্যবহারের জন্য একটি চমৎকার পছন্দ। এতে ${translatedFeatures} রয়েছে। এটি সহজ ব্যবহার, নির্ভরযোগ্য কর্মক্ষমতা এবং ব্যবহারিক সুবিধা দেয়।`,
      Tamil: `${product} அன்றாட பயன்பாட்டிற்கு சிறந்த தேர்வாகும். இதில் ${translatedFeatures} உள்ளது. இது எளிமையான பயன்பாடு மற்றும் நம்பகமான செயல்திறனை வழங்குகிறது.`,
      Telugu: `${product} మీ రోజువారీ అవసరాలకు అత్యుత్తమ ఎంపిక. ఇందులో ${translatedFeatures} వంటి విశేషాలు ఉన్నాయి. ఇది సులభమైన వినియోగం, నమ్మకమైన పనితీరు మరియు సౌకర్యవంతమైన అనుభవాన్ని అందిస్తుంది.`,
    }
    const base = templates[language] || ''
    return context ? `${base} ${context}.` : base
  }

  function generateDescription() {
    if (!productName.trim() || !features.trim()) {
      setError('Add a product name and at least one product feature to continue.')
      return
    }
    setError('')
    setLoading(true)
    window.setTimeout(() => {
      const featureList = features.split(/,|\n/).map((feature) => feature.trim()).filter(Boolean)
      const featureText = featureListText(featureList.join(', '))
      const featureDetails = describeFeatures(featureList.join(', '))
      const opener = tone === 'Luxury' ? 'Elevate every detail with' : tone === 'Persuasive' ? 'Meet the product designed to make every day better:' : tone === 'Friendly' ? 'Say hello to' : tone === 'Casual' ? 'Here’s your new go-to:' : 'Introducing'
      const body = length === 'Short'
        ? `${opener} ${productName}. Featuring ${featureText}. ${featureDetails}`
        : length === 'Long'
          ? `${opener} ${productName}. Thoughtfully designed with ${featureText}, it brings dependable performance and effortless style to your everyday routine. ${featureDetails} Whether you are upgrading your essentials or choosing a thoughtful gift, this is a product made to fit beautifully into real life. Experience the difference from the very first use.`
          : `${opener} ${productName} — thoughtfully designed with ${featureText}. It brings dependable performance and effortless style to your everyday routine. ${featureDetails} So you can do more with less fuss. A smart, reliable choice for people who care about the details.`
      const context = [
        audience && `Ideal for ${audience}`,
        price && `Priced at ${price}`,
        seoKeywords && `Keywords: ${seoKeywords}`,
        `CTA: ${cta}`,
        marketplace !== 'General' && `Optimized for ${marketplace}`
      ].filter(Boolean).join('. ')
      const localizedContext = language === 'English' ? context : ''
      const translated = localizedCopy(language, productName, featureList, localizedContext)
      setGenerated(`${translated || `${body}${context ? ` ${context}.` : ''}`}`)
      setLoading(false)
    }, 750)
  }

  function safeFileName() {
    return (productName || 'product').trim().replace(/[^a-z0-9-_]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'product'
  }

  function downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  function downloadText() {
    if (!generated) {
      setError('Generate a description before downloading.')
      return
    }
    downloadFile(generated, `${safeFileName()}-description.txt`, 'text/plain;charset=utf-8')
  }

  function exportMarkdown() {
    if (!generated) {
      setError('Generate a description before exporting.')
      return
    }
    const markdown = `# ${productName}\n\n${generated}\n\n## Product details\n- Features: ${features}\n- Tone: ${tone}\n- Length: ${length}\n- Language: ${language}\n- Marketplace: ${marketplace}${audience ? `\n- Audience: ${audience}` : ''}${price ? `\n- Price: ${price}` : ''}${seoKeywords ? `\n- SEO keywords: ${seoKeywords}` : ''}\n- CTA: ${cta}\n`
    downloadFile(markdown, `${safeFileName()}-description.md`, 'text/markdown;charset=utf-8')
  }

  function exportJson() {
    if (!generated) {
      setError('Generate a description before exporting.')
      return
    }
    const data = { productName, features, description: generated, tone, length, language, marketplace, audience, price, seoKeywords, cta, generatedAt: new Date().toISOString() }
    downloadFile(JSON.stringify(data, null, 2), `${safeFileName()}-product-copy.json`, 'application/json;charset=utf-8')
  }

  function printOutput() {
    if (!generated) {
      setError('Generate a description before printing.')
      return
    }
    window.print()
  }

  async function copyText() {
    if (!generated) {
      setError('Generate a description before copying.')
      return
    }
    try {
      await navigator.clipboard.writeText(generated)
      setCopied(true)
      setError('')
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setError('Clipboard access was blocked. Select the text and copy it manually.')
    }
  }

  function refineCopy(action: string) {
    if (!generated) {
      setError('Generate a description first.')
      return
    }
    if (action === 'Make shorter') {
      const sentences = generated.split(/(?<=[.!?।])\s+/).filter(Boolean)
      setGenerated(sentences.slice(0, 2).join(' '))
    } else if (action === 'More professional') {
      const updated = generated
        .replace(/\b(Say hello to|Here’s your new go-to:|Elevate every detail with)\b/gi, 'Introducing')
        .replace(/\b(less fuss)\b/gi, 'maximum efficiency')
        .replace(/\b(great|awesome|cool|super)\b/gi, 'effective')
        .replace(/!/g, '.')
      setGenerated(updated)
      setTone('Professional')
    } else {
      const updated = generated
        .replace(/\b(Introducing|Elevate every detail with)\b/gi, 'Say hello to')
        .replace(/\b(the product|this product)\b/gi, 'it')
        .replace(/\butilize\b/gi, 'use')
        .replace(/\bmaximum efficiency\b/gi, 'less fuss')
      setGenerated(updated)
      setTone('Friendly')
    }
    setError('')
  }


  return (
    <main className={`min-h-screen text-foreground transition-colors ${darkMode ? 'dark bg-background' : 'theme-light bg-background'}`}>
      <header className="border-b border-border/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight"><span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles size={16} /></span> Productly<span className="text-primary">AI</span></a>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex"><a href="#generator" className="hover:text-foreground">Generator</a><a href="#workspace" className="hover:text-foreground">Workspace</a><a href="#how-it-works" className="hover:text-foreground">How it works</a><a href="#features" className="hover:text-foreground">Features</a></nav><nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-center gap-1 rounded-2xl border border-border bg-card/95 p-2 text-xs shadow-xl backdrop-blur md:hidden"><a href="#generator" className="rounded-xl px-3 py-2 hover:bg-muted">Generator</a><a href="#workspace" className="rounded-xl px-3 py-2 hover:bg-muted">Workspace</a><a href="#how-it-works" className="rounded-xl px-3 py-2 hover:bg-muted">Guide</a><a href="#features" className="rounded-xl px-3 py-2 hover:bg-muted">Features</a></nav><div className="flex items-center gap-2"><button onClick={toggleTheme} className="rounded-full border border-border px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary">{darkMode ? 'Light mode' : 'Dark mode'}</button><button onClick={clearDraft} className="hidden rounded-full border border-border px-3 py-2 text-xs font-semibold hover:border-destructive hover:text-destructive sm:inline-flex">Clear draft</button></div>
          <a href="#generator" className="rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:border-primary hover:text-primary">Get started <ArrowRight className="ml-1 inline" size={14} /></a>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden px-5 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="pointer-events-none absolute left-1/2 top-0 size-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center"><p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary"><Sparkles size={13} /> Product copy workspace</p><h1 className="text-balance text-5xl font-semibold tracking-[-0.05em] sm:text-7xl">Turn product details into <span className="text-primary">words that sell.</span></h1><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Create clear, compelling product descriptions in seconds. Choose your tone, set your length, and let Productly AI do the writing.</p><a href="#generator" className="mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5">Create a description <ArrowRight size={17} /></a></div>
      </section>

      <section id="generator" className="mx-auto grid max-w-7xl gap-6 px-5 pb-24 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"><div className="mb-8 flex items-start justify-between"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">01 / Input</p><h2 className="text-2xl font-semibold">Describe your product</h2></div><button onClick={loadExample} className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline">Load example</button></div>
          <div className="space-y-5"><label className="block text-sm font-medium">Product name<input ref={productInputRef} value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. AeroSip Insulated Bottle" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20" /></label><label className="block text-sm font-medium">Product features<span className="ml-2 text-xs font-normal text-muted-foreground">separate with commas or new lines</span><textarea value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="Leak-proof lid, 24-hour cold retention..." rows={4} className="mt-2 w-full resize-none rounded-xl border border-input bg-background p-4 outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20" /><span className="mt-2 block text-xs text-muted-foreground">Add simple words or phrases — Productly automatically turns them into natural product copy.</span>{features.trim() && <span className="mt-3 block rounded-lg bg-primary/5 px-3 py-2 text-sm leading-6 text-primary"><Sparkles className="mr-1 inline" size={14} /> Auto description: {describeFeatures(features)}</span>}</label>
            <div><p className="mb-2 text-sm font-medium">Product image <span className="font-normal text-muted-foreground">optional</span></p>{image ? <div className="relative overflow-hidden rounded-xl border border-border"><img src={image} alt={`${productName || 'Product'} preview`} className="h-40 w-full object-cover" /><button aria-label="Remove image" onClick={removeImage} className="absolute right-3 top-3 rounded-full bg-background/90 p-2 shadow"><X size={15} /></button></div> : <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-5 py-8 text-center transition hover:border-primary hover:bg-primary/5"><Upload className="mb-2 text-primary" size={21} /><span className="text-sm font-medium">Drop an image here or browse</span><span className="mt-1 text-xs text-muted-foreground">PNG, JPG, JPEG, WEBP · up to 10 MB</span><input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => { handleImage(e.target.files?.[0]); e.target.value = ''; }} /></label>}</div>
            <div><p className="mb-2 text-sm font-medium">Content style <span className="font-normal text-muted-foreground">optional</span></p><div className="flex flex-wrap gap-2">{tones.map((item) => <button key={item} onClick={() => setTone(item)} className={`rounded-full border px-3.5 py-2 text-sm transition ${tone === item ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`}>{item}</button>)}</div></div>
            <div><p className="mb-2 text-sm font-medium">Description length</p><div className="grid grid-cols-3 gap-2">{lengths.map((item) => <button key={item} onClick={() => setLength(item)} className={`rounded-xl border px-3 py-2.5 text-sm transition ${length === item ? 'border-primary bg-primary/10 font-semibold text-primary' : 'border-border text-muted-foreground hover:border-primary'}`}>{item}</button>)}</div></div>
            <div className="mt-8 rounded-2xl border border-border bg-muted/20 p-5 sm:p-6"><div className="mb-6 flex items-center gap-4"><span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">02</span><div><h3 className="text-xl font-semibold">Advanced options</h3><p className="text-sm text-muted-foreground">SEO, audience, platform and CTA</p></div></div><div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-medium">Language<span className="ml-2 text-xs font-normal text-muted-foreground">Generate in your preferred language</span><select value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-3 outline-none focus:border-primary">{languages.map((item) => <option key={item}>{item}</option>)}</select></label><label className="block text-sm font-medium">Marketplace<select value={marketplace} onChange={(e) => setMarketplace(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-3 outline-none focus:border-primary">{marketplaces.map((item) => <option key={item}>{item}</option>)}</select></label><label className="block text-sm font-medium">Target audience<input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. students, professionals" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 outline-none focus:border-primary" /></label><label className="block text-sm font-medium">Price <span className="font-normal text-muted-foreground">(optional)</span><input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. ₹4,999" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 outline-none focus:border-primary" /></label><label className="block text-sm font-medium sm:col-span-2">SEO keywords <span className="font-normal text-muted-foreground">(comma separated)</span><input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="wireless headphones, bluetooth headphones" className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-4 outline-none focus:border-primary" /></label><label className="block text-sm font-medium sm:col-span-2">Call to action<select value={cta} onChange={(e) => setCta(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-3 outline-none focus:border-primary">{ctas.map((item) => <option key={item}>{item}</option>)}</select></label></div></div>
            {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}<button onClick={generateDescription} disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-70">{loading ? <><Loader2 className="animate-spin" size={18} /> Writing your description...</> : <><Sparkles size={18} /> Generate description</>}</button>
          </div>
        </div>

        <div id="output-card" className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"><div className="mb-8"><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">02 / Output</p><h2 className="text-2xl font-semibold">Your description</h2><p className="mt-2 text-sm text-muted-foreground">Your generated product description will appear here.</p></div>{generated ? <div className="flex h-[calc(100%-80px)] flex-col"><div className="min-h-64 flex-1 overflow-hidden rounded-2xl bg-muted/50 text-[17px] leading-8 text-foreground">{image ? <div className="relative h-64 w-full overflow-hidden border-b border-border bg-muted"><img src={image} alt={`${productName || 'Product'} preview`} className="h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-6 pb-5 pt-12"><p className="font-semibold text-white">{productName}</p><p className="text-xs text-white/75">Product preview</p></div></div> : <div className="flex h-32 items-center justify-center border-b border-border bg-primary/5"><div className="grid size-14 place-items-center rounded-2xl bg-primary/15 text-primary"><ImageIcon size={28} /></div></div>}<div className="p-6"><div className="mb-5 flex items-center gap-3 border-b border-border pb-4"><div className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary"><FileText size={19} /></div><div><p className="font-semibold">{productName}</p><p className="text-xs text-muted-foreground">{language} · {tone} · {length}</p></div></div><p>{generated}</p></div></div><div className="mt-4 flex gap-3"><button onClick={copyText} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold transition hover:border-primary hover:text-primary">{copied ? <Check size={16} /> : <Clipboard size={16} />} {copied ? 'Copied' : 'Copy text'}</button><button onClick={downloadText} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold transition hover:border-primary hover:text-primary"><Download size={16} /> Download</button></div></div> : <div className="flex min-h-[440px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-8 text-center"><div className="mb-5 grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary"><ImageIcon size={28} /></div><h3 className="text-lg font-semibold">Your copy will appear here</h3><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Fill in your product details and choose a tone. Your polished description will be ready in seconds.</p></div>}</div>
      </section>

      <section id="output-intelligence" className="border-y border-border/70 bg-muted/20 px-5 py-20 lg:px-8"><div className="mx-auto max-w-7xl"><div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">02 / Output intelligence</p><h2 className="text-4xl font-semibold tracking-tight">More than a description.</h2><p className="mt-4 max-w-2xl leading-7 text-muted-foreground">Turn one product brief into structured, conversion-ready content for every channel.</p></div><div className="flex flex-wrap gap-2"><span className="rounded-full border border-border px-3 py-2 text-xs text-muted-foreground">Product intelligence</span><span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">Browser-only prototype</span></div></div><div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]"><div className="rounded-3xl border border-border bg-card p-6 sm:p-8"><div className="mb-6 flex items-center justify-between"><div><h3 className="text-xl font-semibold">Generated Description</h3><p className="mt-1 text-sm text-muted-foreground">{generated ? 'Your generated product description' : 'Your generated product description appears here...'}</p></div><button onClick={editGenerated} className="rounded-xl border border-border px-3 py-2 text-xs font-semibold hover:border-primary hover:text-primary">Edit inputs</button></div><div className="rounded-2xl bg-muted/50 p-5 text-sm leading-7 text-muted-foreground">{generated || 'Generate a description to unlock your product intelligence, recommendations, and export-ready content.'}</div><div className="mt-5 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-border bg-background/50 p-5"><div className="mb-3 flex items-center justify-between"><h4 className="font-semibold">Description points</h4><span className="text-xs font-semibold text-primary">{generated ? 'Ready' : 'Preview'}</span></div><ul className="space-y-3 text-sm text-muted-foreground"><li className="flex gap-2"><span className="text-primary">•</span><span>Clear product value and main benefit</span></li><li className="flex gap-2"><span className="text-primary">•</span><span>Key features transformed into customer outcomes</span></li><li className="flex gap-2"><span className="text-primary">•</span><span>Audience-friendly language with a strong CTA</span></li></ul></div><div className="rounded-2xl border border-border bg-background/50 p-5"><h4 className="font-semibold">Summary</h4><p className="mt-3 text-sm leading-6 text-muted-foreground">{generated ? `A ${tone.toLowerCase()} ${length.toLowerCase()} description for ${productName || 'your product'}, focused on clarity, benefits, and conversion.` : 'A concise summary of your product, its strongest benefits, and why customers should choose it.'}</p></div></div><div className="mt-5 flex flex-wrap gap-2"><button onClick={generateDescription} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">Regenerate</button>{['Make shorter', 'More professional', 'More human'].map((action) => <button key={action} onClick={() => refineCopy(action)} className="rounded-xl border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary">{action}</button>)}</div></div><div className="rounded-3xl border border-border bg-card p-6 sm:p-8"><h3 className="text-xl font-semibold">Key Features</h3><div className="mt-6 space-y-3">{(features.trim() ? features.split(/,|\n/).map((item) => item.trim()).filter(Boolean).slice(0, 4) : ['Clear value proposition', 'Feature benefits explained', 'Audience-aware language', 'Action-oriented CTA']).map((feature, index) => <div key={`${feature}-${index}`} className="flex items-center gap-3 rounded-xl border border-border p-3"><span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">{String(index + 1).padStart(2, '0')}</span><span className="text-sm font-medium">{feature}</span></div>)}</div></div></div><div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['Benefits & USP', 'Why it matters, the problem solved, and 3–5 unique selling points.'], ['Target audience', audience || 'Students, developers, businesses and educators'], ['SEO optimization', seoKeywords ? `Optimized for: ${seoKeywords}` : 'SEO title, meta description and search-friendly keywords.'], ['Output formats', 'Product page, LinkedIn, Instagram, README, app store and pitch deck.']].map(([title, text]) => <article key={title} className="rounded-2xl border border-border bg-card p-5"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></article>)}</div><div className="mt-4 flex flex-wrap gap-3"><button onClick={copyText} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">Copy to clipboard</button><button onClick={downloadText} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">Download .txt</button><button onClick={exportMarkdown} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">Export .md</button><button onClick={printOutput} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">Print / PDF</button><button onClick={exportJson} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">Export JSON</button></div></div></section>

      <section id="workspace" className="border-y border-border/70 bg-muted/20 px-5 py-20 lg:px-8"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">Productly workspace</p><h2 className="text-4xl font-semibold tracking-tight">Everything you need for product copy.</h2><p className="mt-4 max-w-2xl leading-7 text-muted-foreground">A focused browser workspace for creating, refining, and exporting product copy.</p></div><div className="flex flex-wrap gap-2"><button onClick={clearDraft} className="rounded-full border border-border px-5 py-3 text-sm font-semibold hover:border-destructive hover:text-destructive">Clear saved draft</button>{generated && <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-3 text-xs font-semibold text-primary">Draft saved locally</span>}</div></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{workspaceFeatures.map(([title, text], index) => <article key={title} className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/50"><div className="mb-8 flex items-center justify-between"><span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-sm font-bold text-primary">{String(index + 1).padStart(2, '0')}</span><span className="text-xs font-semibold text-primary">Available</span></div><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></article>)}</div><div className="mt-4 grid gap-4 lg:grid-cols-3"><div className="rounded-2xl border border-border bg-card p-5"><p className="font-semibold">Current draft</p><p className="mt-3 text-3xl font-semibold text-primary">{generated ? "Ready" : "Empty"}</p><p className="mt-2 text-sm text-muted-foreground">Your current copy is kept in this browser so a refresh does not erase the draft.</p></div><div className="rounded-2xl border border-border bg-card p-5"><p className="font-semibold">Output formats</p><p className="mt-3 text-sm leading-6 text-muted-foreground">TXT, Markdown, JSON, clipboard, and browser print-to-PDF are available from the generated output.</p></div><div className="rounded-2xl border border-border bg-card p-5"><p className="font-semibold">Data model</p><p className="mt-3 text-sm leading-6 text-muted-foreground">No server or database is included in this prototype. Inputs stay in your browser local storage.</p></div></div></div></section>

      <section id="how-it-works" className="border-y border-border/70 bg-muted/20 px-5 py-20 lg:px-8"><div className="mx-auto max-w-7xl"><div className="max-w-xl"><p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">How it works</p><h2 className="text-4xl font-semibold tracking-tight">From blank page to better copy.</h2></div><div className="mt-12 grid gap-8 md:grid-cols-3">{[['01', 'Add your details', 'Share the product name, key features, and an image if you have one.'], ['02', 'Set the direction', 'Pick the tone and length that match your audience and brand.'], ['03', 'Make it yours', 'Generate, copy, download, and refine your new product copy.']].map(([number, title, text]) => <div key={number} className="border-t border-border pt-5"><span className="text-sm font-bold text-primary">{number}</span><h3 className="mt-5 text-xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-muted-foreground">{text}</p></div>)}</div></div></section>
      <section id="features" className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="grid gap-10 lg:grid-cols-2 lg:items-end"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">Built for momentum</p><h2 className="max-w-lg text-4xl font-semibold tracking-tight">Good product copy should not slow you down.</h2></div><p className="max-w-md leading-7 text-muted-foreground">Productly gives you a simple, focused workspace to turn product details into clear, useful product copy.</p></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{['Multiple writing tones', 'Flexible description lengths', 'Instant copy & download', 'Simple, focused workflow'].map((feature) => <div key={feature} className="rounded-2xl border border-border p-5"><Check className="mb-8 text-primary" size={20} /><p className="font-semibold">{feature}</p></div>)}</div></section>
      <footer className="border-t border-border/70 px-5 pb-24 pt-7 sm:pb-7 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span className="font-semibold text-foreground">Productly<span className="text-primary">AI</span></span><span>Product copy, without the blank page.</span></div></footer>
    </main>
  )
}

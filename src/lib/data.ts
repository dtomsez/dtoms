// ── Core Chinese metaphysics reference data (Thai-first labels) ──

export type ElementKey = 'wood' | 'fire' | 'earth' | 'metal' | 'water'

export interface StemInfo {
  cn: string
  pinyin: string
  th: string
  element: ElementKey
  yang: boolean
}

export interface BranchInfo {
  cn: string
  pinyin: string
  th: string          // Thai zodiac animal
  animal: string      // English animal
  element: ElementKey
  yang: boolean
  hiddenStems: number[] // stem indices, main qi first
  hourRange: string
}

export const ELEMENTS: Record<ElementKey, { th: string; cn: string; en: string; color: string; emoji: string }> = {
  wood:  { th: 'ไม้',  cn: '木', en: 'Wood',  color: '#22c55e', emoji: '🌳' },
  fire:  { th: 'ไฟ',   cn: '火', en: 'Fire',  color: '#ef4444', emoji: '🔥' },
  earth: { th: 'ดิน',  cn: '土', en: 'Earth', color: '#d6a01f', emoji: '⛰️' },
  metal: { th: 'ทอง', cn: '金', en: 'Metal', color: '#e5e7eb', emoji: '⚔️' },
  water: { th: 'น้ำ',  cn: '水', en: 'Water', color: '#3b82f6', emoji: '🌊' },
}

export const ELEMENT_KEYS: ElementKey[] = ['wood', 'fire', 'earth', 'metal', 'water']

// producing / controlling cycles
export const PRODUCES: Record<ElementKey, ElementKey> = {
  wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood',
}
export const CONTROLS: Record<ElementKey, ElementKey> = {
  wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood',
}

export const STEMS: StemInfo[] = [
  { cn: '甲', pinyin: 'Jiǎ',  th: 'เจี่ย',  element: 'wood',  yang: true },
  { cn: '乙', pinyin: 'Yǐ',   th: 'อี่',    element: 'wood',  yang: false },
  { cn: '丙', pinyin: 'Bǐng', th: 'ปิ่ง',   element: 'fire',  yang: true },
  { cn: '丁', pinyin: 'Dīng', th: 'ติง',    element: 'fire',  yang: false },
  { cn: '戊', pinyin: 'Wù',   th: 'อู่',    element: 'earth', yang: true },
  { cn: '己', pinyin: 'Jǐ',   th: 'จี่',    element: 'earth', yang: false },
  { cn: '庚', pinyin: 'Gēng', th: 'เกิง',   element: 'metal', yang: true },
  { cn: '辛', pinyin: 'Xīn',  th: 'ซิน',    element: 'metal', yang: false },
  { cn: '壬', pinyin: 'Rén',  th: 'เหริน',  element: 'water', yang: true },
  { cn: '癸', pinyin: 'Guǐ',  th: 'กุ่ย',   element: 'water', yang: false },
]

export const BRANCHES: BranchInfo[] = [
  { cn: '子', pinyin: 'Zǐ',   th: 'ชวด',   animal: 'Rat',     element: 'water', yang: true,  hiddenStems: [9],       hourRange: '23:00–00:59' },
  { cn: '丑', pinyin: 'Chǒu', th: 'ฉลู',    animal: 'Ox',      element: 'earth', yang: false, hiddenStems: [5, 9, 7], hourRange: '01:00–02:59' },
  { cn: '寅', pinyin: 'Yín',  th: 'ขาล',    animal: 'Tiger',   element: 'wood',  yang: true,  hiddenStems: [0, 2, 4], hourRange: '03:00–04:59' },
  { cn: '卯', pinyin: 'Mǎo',  th: 'เถาะ',   animal: 'Rabbit',  element: 'wood',  yang: false, hiddenStems: [1],       hourRange: '05:00–06:59' },
  { cn: '辰', pinyin: 'Chén', th: 'มะโรง',  animal: 'Dragon',  element: 'earth', yang: true,  hiddenStems: [4, 1, 9], hourRange: '07:00–08:59' },
  { cn: '巳', pinyin: 'Sì',   th: 'มะเส็ง', animal: 'Snake',   element: 'fire',  yang: false, hiddenStems: [2, 6, 4], hourRange: '09:00–10:59' },
  { cn: '午', pinyin: 'Wǔ',   th: 'มะเมีย', animal: 'Horse',   element: 'fire',  yang: true,  hiddenStems: [3, 5],    hourRange: '11:00–12:59' },
  { cn: '未', pinyin: 'Wèi',  th: 'มะแม',   animal: 'Goat',    element: 'earth', yang: false, hiddenStems: [5, 3, 1], hourRange: '13:00–14:59' },
  { cn: '申', pinyin: 'Shēn', th: 'วอก',    animal: 'Monkey',  element: 'metal', yang: true,  hiddenStems: [6, 8, 4], hourRange: '15:00–16:59' },
  { cn: '酉', pinyin: 'Yǒu',  th: 'ระกา',   animal: 'Rooster', element: 'metal', yang: false, hiddenStems: [7],       hourRange: '17:00–18:59' },
  { cn: '戌', pinyin: 'Xū',   th: 'จอ',     animal: 'Dog',     element: 'earth', yang: true,  hiddenStems: [4, 7, 3], hourRange: '19:00–20:59' },
  { cn: '亥', pinyin: 'Hài',  th: 'กุน',    animal: 'Pig',     element: 'water', yang: false, hiddenStems: [8, 0],    hourRange: '21:00–22:59' },
]

// ── Ten Gods (十神) ──
export interface TenGodInfo {
  key: string
  cn: string
  th: string
  en: string
  short: string
  meaning: string
}

export const TEN_GODS: TenGodInfo[] = [
  { key: 'F',  cn: '比肩', th: 'มิตรร่วมทาง',   en: 'Friend',            short: 'F',  meaning: 'พลังพวกพ้อง ความมั่นใจ การพึ่งพาตนเอง' },
  { key: 'RW', cn: '劫財', th: 'ชิงทรัพย์',      en: 'Rob Wealth',        short: 'RW', meaning: 'การแข่งขัน ความกล้าเสี่ยง แรงผลักดัน' },
  { key: 'EG', cn: '食神', th: 'เทพโภชนา',      en: 'Eating God',        short: 'EG', meaning: 'ความคิดสร้างสรรค์ ความสุขสบาย ปัญญาละมุน' },
  { key: 'HO', cn: '傷官', th: 'ขุนนางบาดเจ็บ', en: 'Hurting Officer',   short: 'HO', meaning: 'พรสวรรค์โดดเด่น กบฏต่อกรอบ ความเฉียบคม' },
  { key: 'IW', cn: '偏財', th: 'ทรัพย์จร',       en: 'Indirect Wealth',   short: 'IW', meaning: 'โชคลาภ การลงทุน เงินก้อนใหญ่ที่มาไว' },
  { key: 'DW', cn: '正財', th: 'ทรัพย์ตรง',      en: 'Direct Wealth',     short: 'DW', meaning: 'รายได้มั่นคง ความขยัน ทรัพย์ที่สะสมเอง' },
  { key: 'SK', cn: '七殺', th: 'เจ็ดสังหาร',     en: 'Seven Killings',    short: '7K', meaning: 'อำนาจดิบ ความเด็ดขาด แรงกดดันที่หลอมเพชร' },
  { key: 'DO', cn: '正官', th: 'ขุนนางตรง',      en: 'Direct Officer',    short: 'DO', meaning: 'ตำแหน่ง วินัย เกียรติยศ ความรับผิดชอบ' },
  { key: 'IR', cn: '偏印', th: 'ตราจร',          en: 'Indirect Resource', short: 'IR', meaning: 'ญาณหยั่งรู้ ศาสตร์ลี้ลับ ความคิดนอกกรอบ' },
  { key: 'DR', cn: '正印', th: 'ตราตรง',         en: 'Direct Resource',   short: 'DR', meaning: 'การอุปถัมภ์ ความรู้ คุณธรรม ผู้ใหญ่เกื้อหนุน' },
]

// ── Day Master archetypes (10) ──
export interface DayMasterArchetype {
  title: string       // Thai poetic title
  codename: string    // English codename
  symbol: string
  emoji: string
  essence: string
  strengths: string[]
  caution: string
}

export const DAY_MASTER_ARCHETYPES: DayMasterArchetype[] = [
  {
    title: 'ต้นสนหยัดฟ้า ผู้บุกเบิกที่ไม่เคยก้มหัว',
    codename: 'The Pioneer (ผู้บุกเบิกแถวหน้า)',
    symbol: 'ต้นไม้ใหญ่', emoji: '🌲',
    essence: 'ไม้หยาง (เจี่ย 甲) คือต้นไม้ใหญ่ที่เติบโตขึ้นฟ้าอย่างเดียว ตรงไปตรงมา มีหลักการ และเป็นที่พึ่งพิงของผู้คน',
    strengths: ['ผู้นำโดยธรรมชาติที่คนยอมเดินตาม', 'ยึดมั่นหลักการ ไม่หวั่นไหวต่อแรงเสียดทาน', 'เติบโตระยะยาว สร้างรากฐานให้คนรุ่นหลัง'],
    caution: 'ระวังความแข็งจนหัก — การยืดหยุ่นบ้างคือปุ๋ยชั้นดีของต้นไม้ใหญ่',
  },
  {
    title: 'เถาวัลย์พันภูผา ผู้ชนะด้วยความอ่อนโยน',
    codename: 'The Diplomat (นักการทูตแห่งชะตา)',
    symbol: 'ไม้เลื้อย ดอกไม้', emoji: '🌿',
    essence: 'ไม้ยิน (อี่ 乙) คือเถาวัลย์และดอกไม้ อ่อนโยนแต่ไม่อ่อนแอ ปรับตัวเข้ากับทุกสภาพแวดล้อมและเติบโตได้ในทุกซอกหิน',
    strengths: ['ศิลปะการเจรจาและการเชื่อมคน', 'ปรับตัวไว อยู่รอดได้ในทุกวิกฤต', 'เสน่ห์ละมุนที่เปิดทุกประตู'],
    caution: 'ระวังการพึ่งพิงผู้อื่นมากไป — เถาวัลย์ที่แข็งแรงต้องมีรากของตัวเอง',
  },
  {
    title: 'สุริยันกลางเวหา ผู้ให้แสงโดยไม่เลือกที่รัก',
    codename: 'The Star (ดวงดาราแห่งเวที)',
    symbol: 'พระอาทิตย์', emoji: '☀️',
    essence: 'ไฟหยาง (ปิ่ง 丙) คือดวงอาทิตย์ที่สาดแสงให้ทุกชีวิต อบอุ่น ใจกว้าง เปิดเผย และเป็นศูนย์กลางของทุกวงสนทนา',
    strengths: ['พลังบวกที่จุดประกายทีมทั้งองค์กร', 'ความใจกว้างที่ดึงดูดพันธมิตร', 'มองภาพใหญ่ เห็นโอกาสก่อนใคร'],
    caution: 'ระวังแสงที่แรงเกินจนแผดเผาตัวเอง — พระอาทิตย์ก็ต้องมีเวลาตกดิน',
  },
  {
    title: 'เปลวเทียนกลางพายุ แสงนำทางในความมืด',
    codename: 'The Illuminator (ผู้จุดปัญญา)',
    symbol: 'เปลวเทียน ตะเกียง', emoji: '🕯️',
    essence: 'ไฟยิน (ติง 丁) คือแสงเทียนที่ส่องลึกเข้าไปในจิตใจคน ละเอียดอ่อน ลึกซึ้ง และมองเห็นสิ่งที่คนอื่นมองข้าม',
    strengths: ['ญาณลึกอ่านใจคนได้ทะลุ', 'ความอบอุ่นที่ผูกใจคนระยะยาว', 'ความประณีตในงานที่ต้องใช้จิตวิญญาณ'],
    caution: 'ระวังไฟในใจที่ไหวตามลมรอบข้าง — จงรักษาเชื้อเพลิงของตัวเองให้ดี',
  },
  {
    title: 'มั่นคงดั่งขุนเขา ผู้พิทักษ์เงียบแห่งความไว้วางใจ',
    codename: 'The Heavyweight Negotiator (ผู้กุมอำนาจที่แท้จริง)',
    symbol: 'ขุนเขา', emoji: '⛰️',
    essence: 'ดินหยาง (อู่ 戊) คือขุนเขาที่ไม่สั่นคลอน สัญลักษณ์ของความมั่งคั่งที่ซ่อนเร้นและความเสถียรขั้นสุด ความนิ่งของคุณคืออาวุธที่แพงที่สุดในโลกธุรกิจ',
    strengths: [
      'สกุลเงินที่เรียกว่า "ความน่าเชื่อถือ" — เพียงนั่งอยู่ในห้องประชุม ความหนักแน่นของคุณก็การันตีความสำเร็จ',
      'แกนกลางแห่งความเสถียร (The Anchor) — เสาหลักที่ไม่เคยสั่นคลอนไม่ว่าตลาดจะผันผวนแค่ไหน',
      'ขุมทรัพย์แห่งผืนดิน — พรสวรรค์ในการถือครองสินทรัพย์ขนาดใหญ่และสร้างระบบกำไรทบต้น',
    ],
    caution: 'ระวังความนิ่งกลายเป็นความเฉื่อย — ขุนเขาที่ยิ่งใหญ่ยังต้องให้ธารน้ำไหลผ่าน',
  },
  {
    title: 'ผืนดินอุดม ผู้บ่มเพาะทุกเมล็ดพันธุ์',
    codename: 'The Nurturer (ผู้หล่อเลี้ยงอาณาจักร)',
    symbol: 'ผืนนา สวน', emoji: '🌾',
    essence: 'ดินยิน (จี่ 己) คือผืนดินอันอุดมที่เปลี่ยนเมล็ดพันธุ์ให้เป็นผลผลิต ถ่อมตน อดทน และเก็บรายละเอียดได้ทุกเม็ด',
    strengths: ['ศิลปะการปั้นคนและบ่มเพาะทีม', 'ความอดทนที่เปลี่ยนงานเล็กให้เป็นอาณาจักร', 'ความละเอียดที่ไม่มีอะไรรอดสายตา'],
    caution: 'ระวังการแบกทุกอย่างไว้คนเดียว — ผืนดินก็ต้องการการพักฟื้นหน้าดิน',
  },
  {
    title: 'ดาบเหล็กกล้า นักรบผู้ไม่ถอยแม้ก้าวเดียว',
    codename: 'The General (แม่ทัพเหล็ก)',
    symbol: 'ดาบ โลหะหนัก', emoji: '⚔️',
    essence: 'ทองหยาง (เกิง 庚) คือเหล็กกล้าและดาบใหญ่ เด็ดขาด ยุติธรรม พูดคำไหนคำนั้น และยิ่งผ่านไฟยิ่งแข็งแกร่ง',
    strengths: ['ความเด็ดขาดที่ตัดสินใจได้ในวินาทีวิกฤต', 'ความยุติธรรมที่ทำให้คนเกรงใจและเคารพ', 'ยิ่งเจออุปสรรคยิ่งคมเหมือนดาบผ่านเตาหลอม'],
    caution: 'ระวังคมดาบบาดคนใกล้ตัว — ความตรงต้องมาคู่กับความนุ่มนวลบ้าง',
  },
  {
    title: 'อัญมณีเจียระไน ประกายที่ประเมินค่าไม่ได้',
    codename: 'The Jeweler (ปรมาจารย์แห่งรายละเอียด)',
    symbol: 'อัญมณี เครื่องประดับ', emoji: '💎',
    essence: 'ทองยิน (ซิน 辛) คืออัญมณีที่ผ่านการเจียระไน ประณีต เฉียบคม รักศักดิ์ศรี และเปล่งประกายในทุกเวทีที่ได้ยืน',
    strengths: ['รสนิยมและมาตรฐานระดับสูงที่ใครก็เลียนแบบไม่ได้', 'ความเฉียบคมในการวิเคราะห์และวางกลยุทธ์', 'แบรนด์ส่วนตัวที่แข็งแรง ผู้คนจดจำ'],
    caution: 'ระวังความสมบูรณ์แบบกัดกร่อนใจ — เพชรแท้ไม่ต้องพิสูจน์ตัวเองกับทุกคน',
  },
  {
    title: 'มหาสมุทรไร้ขอบ ผู้มองเห็นทุกกระแสน้ำ',
    codename: 'The Strategist (จอมยุทธศาสตร์)',
    symbol: 'มหาสมุทร แม่น้ำใหญ่', emoji: '🌊',
    essence: 'น้ำหยาง (เหริน 壬) คือมหาสมุทรและแม่น้ำใหญ่ ชาญฉลาด กว้างขวาง ไหลไปได้ทุกที่ และมองเห็นภาพรวมที่คนอื่นมองไม่เห็น',
    strengths: ['วิสัยทัศน์กว้างไกลเหมือนมองจากกลางมหาสมุทร', 'เครือข่ายและการเชื่อมโยงที่ไหลถึงทุกวงการ', 'ไหวพริบพลิกสถานการณ์ได้เสมอ'],
    caution: 'ระวังน้ำที่ไหลแรงจนไร้ทิศ — มหาสมุทรต้องมีเข็มทิศของตัวเอง',
  },
  {
    title: 'สายฝนหยั่งรากฟ้า ผู้หยั่งรู้ในความเงียบ',
    codename: 'The Sage (นักปราชญ์เร้นกาย)',
    symbol: 'สายฝน น้ำค้าง หมอก', emoji: '🌧️',
    essence: 'น้ำยิน (กุ่ย 癸) คือสายฝนและน้ำค้างที่ซึมลึกถึงราก อ่อนโยน ลึกลับ หยั่งรู้ และหล่อเลี้ยงทุกสิ่งโดยไม่ต้องประกาศตัว',
    strengths: ['สัมผัสที่หกและญาณหยั่งรู้เหนือค่าเฉลี่ย', 'อิทธิพลเงียบที่ค่อยๆ ซึมและเปลี่ยนทุกอย่าง', 'ปัญญาเชิงลึกในศาสตร์เร้นลับและข้อมูล'],
    caution: 'ระวังการเก็บทุกอย่างไว้ในหมอก — บางครั้งฝนต้องยอมตกให้คนเห็น',
  },
]

// ── Strength levels ──
export const STRENGTH_LEVELS = [
  { key: 'veryWeak',   th: 'อ่อนมาก',  en: 'Very Weak',   desc: 'เจ้าวันแทบไม่มีรากและกำลังหนุน โครงสร้างอาจพลิกเป็น "ตามกระแส" — ยอมไหลตามธาตุที่แข็งแรงที่สุดเพื่อชนะทั้งกระดาน' },
  { key: 'weak',       th: 'อ่อน',      en: 'Weak',        desc: 'เจ้าวันมีกำลังน้อยกว่าแรงกดดันรอบตัว ต้องการธาตุพี่เลี้ยง (ตรา) และพวกพ้องมาเติมพลังก่อนออกรบ' },
  { key: 'strong',     th: 'แข็ง',      en: 'Strong',      desc: 'เจ้าวันมีรากมั่นคงและกำลังหนุนดี พร้อมรับภารกิจใหญ่ ควรใช้ธาตุระบาย (ผลผลิต/ทรัพย์) เพื่อแปลงพลังเป็นความสำเร็จ' },
  { key: 'veryStrong', th: 'แข็งมาก',  en: 'Very Strong', desc: 'พลังเจ้าวันล้นเกิน หากไม่มีทางระบายจะกลายเป็นแรงอัด โครงสร้างอาจเข้าเกณฑ์ "เอกฉันท์" — ยิ่งเสริมยิ่งรุ่ง' },
] as const

export const STRUCTURES = [
  { key: 'normal',   th: 'โครงสร้างปกติ',      cn: '正格', en: 'Normal Structure',   desc: 'ดวงสมดุลตามหลักทั่วไป ใช้เทพประโยชน์ปรับสมดุลธาตุ อ่อนเสริม-แข็งระบาย เดินเกมยาวอย่างมีระบบ' },
  { key: 'follower', th: 'โครงสร้างตามกระแส', cn: '從格', en: 'Follower Structure', desc: 'เจ้าวันอ่อนสุดขั้วจนเลือก "ยอมตาม" ธาตุที่ครองกระดาน — ยิ่งไหลตามกระแสใหญ่ ยิ่งได้ลาภยศเกินคาด' },
  { key: 'vibrant',  th: 'โครงสร้างเอกฉันท์',  cn: '專旺', en: 'Vibrant Structure',  desc: 'ธาตุเจ้าวันครองทั้งกระดาน พลังเอกฉันท์หนึ่งเดียว — เดินหน้าสายที่ถนัดสุดโต่งคือทางแห่งความรุ่งเรือง' },
  { key: 'special',  th: 'โครงสร้างพิเศษ',     cn: '特殊格', en: 'Special Structure', desc: 'ดวงเข้าเกณฑ์พิเศษที่พบยาก มีจุดหักเหและพรสวรรค์เฉพาะทางที่ต้องใช้ให้ถูกจังหวะ' },
] as const

// ── 64 Hexagrams (King Wen) ──
// KING_WEN[lowerTrigram][upperTrigram] = hexagram number (1-64)
// trigram order: 0乾 1兌 2離 3震 4巽 5坎 6艮 7坤
export const TRIGRAMS = [
  { cn: '乾', th: 'ฟ้า',    en: 'Heaven',   lines: [1, 1, 1] },
  { cn: '兌', th: 'ทะเลสาบ', en: 'Lake',     lines: [1, 1, 0] },
  { cn: '離', th: 'ไฟ',     en: 'Fire',     lines: [1, 0, 1] },
  { cn: '震', th: 'ฟ้าร้อง', en: 'Thunder',  lines: [1, 0, 0] },
  { cn: '巽', th: 'ลม',     en: 'Wind',     lines: [0, 1, 1] },
  { cn: '坎', th: 'น้ำ',     en: 'Water',    lines: [0, 1, 0] },
  { cn: '艮', th: 'ภูเขา',   en: 'Mountain', lines: [0, 0, 1] },
  { cn: '坤', th: 'ดิน',    en: 'Earth',    lines: [0, 0, 0] },
]

export const KING_WEN: number[][] = [
  // lower 乾
  [1, 43, 14, 34, 9, 5, 26, 11],
  // lower 兌
  [10, 58, 38, 54, 61, 60, 41, 19],
  // lower 離
  [13, 49, 30, 55, 37, 63, 22, 36],
  // lower 震
  [25, 17, 21, 51, 42, 3, 27, 24],
  // lower 巽
  [44, 28, 50, 32, 57, 48, 18, 46],
  // lower 坎
  [6, 47, 64, 40, 59, 29, 4, 7],
  // lower 艮
  [33, 31, 56, 62, 53, 39, 52, 15],
  // lower 坤
  [12, 45, 35, 16, 20, 8, 23, 2],
]

export const HEXAGRAM_NAMES: Record<number, { cn: string; th: string }> = {
  1: { cn: '乾', th: 'พลังสร้างสรรค์' }, 2: { cn: '坤', th: 'พลังรองรับ' }, 3: { cn: '屯', th: 'การเริ่มต้นยาก' },
  4: { cn: '蒙', th: 'ความเยาว์' }, 5: { cn: '需', th: 'การรอคอย' }, 6: { cn: '訟', th: 'ข้อพิพาท' },
  7: { cn: '師', th: 'กองทัพ' }, 8: { cn: '比', th: 'ความสามัคคี' }, 9: { cn: '小畜', th: 'สะสมทีละน้อย' },
  10: { cn: '履', th: 'ก้าวเดินระวัง' }, 11: { cn: '泰', th: 'สันติรุ่งเรือง' }, 12: { cn: '否', th: 'ความติดขัด' },
  13: { cn: '同人', th: 'มิตรภาพ' }, 14: { cn: '大有', th: 'ครอบครองใหญ่' }, 15: { cn: '謙', th: 'ความถ่อมตน' },
  16: { cn: '豫', th: 'ความปีติ' }, 17: { cn: '隨', th: 'การติดตาม' }, 18: { cn: '蠱', th: 'แก้ไขสิ่งเสื่อม' },
  19: { cn: '臨', th: 'การเข้าใกล้' }, 20: { cn: '觀', th: 'การพินิจ' }, 21: { cn: '噬嗑', th: 'ขบเคี้ยวอุปสรรค' },
  22: { cn: '賁', th: 'ความงดงาม' }, 23: { cn: '剝', th: 'การผุกร่อน' }, 24: { cn: '復', th: 'การหวนคืน' },
  25: { cn: '無妄', th: 'ความบริสุทธิ์ใจ' }, 26: { cn: '大畜', th: 'สะสมยิ่งใหญ่' }, 27: { cn: '頤', th: 'การบำรุงเลี้ยง' },
  28: { cn: '大過', th: 'เกินขีดใหญ่' }, 29: { cn: '坎', th: 'เหวลึกซ้อน' }, 30: { cn: '離', th: 'เพลิงเจิดจ้า' },
  31: { cn: '咸', th: 'แรงดึงดูดใจ' }, 32: { cn: '恆', th: 'ความยั่งยืน' }, 33: { cn: '遯', th: 'การถอยทัพ' },
  34: { cn: '大壯', th: 'พลังมหาศาล' }, 35: { cn: '晉', th: 'ความก้าวหน้า' }, 36: { cn: '明夷', th: 'แสงถูกบดบัง' },
  37: { cn: '家人', th: 'ครอบครัว' }, 38: { cn: '睽', th: 'ความขัดแย้ง' }, 39: { cn: '蹇', th: 'ทางขรุขระ' },
  40: { cn: '解', th: 'การคลี่คลาย' }, 41: { cn: '損', th: 'การเสียสละ' }, 42: { cn: '益', th: 'การเพิ่มพูน' },
  43: { cn: '夬', th: 'การตัดสินใจเด็ดขาด' }, 44: { cn: '姤', th: 'การมาบรรจบ' }, 45: { cn: '萃', th: 'การรวมพล' },
  46: { cn: '升', th: 'การเลื่อนขั้น' }, 47: { cn: '困', th: 'ความคับขัน' }, 48: { cn: '井', th: 'บ่อน้ำหล่อเลี้ยง' },
  49: { cn: '革', th: 'การปฏิวัติ' }, 50: { cn: '鼎', th: 'กระถางศักดิ์สิทธิ์' }, 51: { cn: '震', th: 'ฟ้าคำรน' },
  52: { cn: '艮', th: 'ความนิ่งสงบ' }, 53: { cn: '漸', th: 'ก้าวหน้าทีละขั้น' }, 54: { cn: '歸妹', th: 'สาวเรือนออกเรือน' },
  55: { cn: '豐', th: 'ความอุดมสมบูรณ์' }, 56: { cn: '旅', th: 'นักเดินทาง' }, 57: { cn: '巽', th: 'ลมแทรกซึม' },
  58: { cn: '兌', th: 'ความชื่นบาน' }, 59: { cn: '渙', th: 'การสลายตัว' }, 60: { cn: '節', th: 'ความพอดี' },
  61: { cn: '中孚', th: 'สัจจะกลางใจ' }, 62: { cn: '小過', th: 'เกินขีดเล็ก' }, 63: { cn: '既濟', th: 'สำเร็จแล้ว' },
  64: { cn: '未濟', th: 'ยังไม่สำเร็จ' },
}

// najia: stem index → trigram index / branch index → trigram index
export const STEM_TRIGRAM = [0, 7, 6, 1, 5, 2, 3, 4, 0, 7]
export const BRANCH_TRIGRAM = [5, 6, 6, 3, 4, 4, 2, 7, 7, 1, 0, 0]

// ── Symbolic stars (神煞) ──
export const NOBLEMAN: Record<number, number[]> = {
  0: [1, 7], 4: [1, 7], 6: [1, 7],   // 甲戊庚 → 丑未
  1: [0, 8], 5: [0, 8],              // 乙己 → 子申
  2: [11, 9], 3: [11, 9],            // 丙丁 → 亥酉
  8: [5, 3], 9: [5, 3],              // 壬癸 → 巳卯
  7: [6, 2],                         // 辛 → 午寅
}

// trine group of a branch → star branch  (index by branch % ... use lookup)
export const TRINE_GROUP = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] // 申子辰=0? compute properly in code
export const PEACH_BLOSSOM_BY_GROUP = { shenZiChen: 9, yinWuXu: 3, siYouChou: 6, haiMaoWei: 0 }

export const ACADEMIC_STAR = [5, 6, 8, 9, 8, 9, 11, 0, 2, 3] // 文昌 by day stem → branch

// ── 12 Day Officers (建除十二神) ──
export interface DayOfficerInfo {
  cn: string; th: string; en: string
  quality: 'auspicious' | 'neutral' | 'inauspicious'
  good: string; bad: string
}
export const DAY_OFFICERS: DayOfficerInfo[] = [
  { cn: '建', th: 'เจี้ยน (ก่อตั้ง)',    en: 'Establish', quality: 'neutral',      good: 'เริ่มวางแผน เข้ารับตำแหน่ง เปิดโครงการทางความคิด', bad: 'ขุดดิน เคลื่อนย้ายครั้งใหญ่ งานศพ' },
  { cn: '除', th: 'ฉู (ชำระล้าง)',       en: 'Remove',    quality: 'auspicious',   good: 'ล้างสิ่งเก่า ถอนสัญญาเก่า รักษาโรค ทำความสะอาดใหญ่', bad: 'เริ่มงานมงคลใหม่ แต่งงาน' },
  { cn: '滿', th: 'หมั่น (เต็มเปี่ยม)',   en: 'Full',      quality: 'neutral',      good: 'เปิดคลัง รับของ เซ็นรับมอบ เก็บเกี่ยวผลประโยชน์', bad: 'ยื่นฟ้อง เริ่มคดีความ ฝังศพ' },
  { cn: '平', th: 'ผิง (สมดุล)',         en: 'Balance',   quality: 'neutral',      good: 'เจรจาไกล่เกลี่ย ปรับพื้น ทำถนน จัดสมดุลองค์กร', bad: 'เปิดกิจการใหญ่ ขุดบ่อ' },
  { cn: '定', th: 'ติ้ง (มั่นคง)',        en: 'Stable',    quality: 'auspicious',   good: 'เซ็นสัญญา หมั้นหมาย วางศิลาฤกษ์ ตกลงดีลระยะยาว', bad: 'ฟ้องร้อง เดินทางไกลเสี่ยงภัย' },
  { cn: '執', th: 'จื๋อ (ยึดถือ)',        en: 'Initiate',  quality: 'auspicious',   good: 'จับกุมสิ่งค้าง ทวงหนี้ ล่าสัตว์ ซ่อมแซม เซ็นเอกสารสำคัญ', bad: 'ย้ายบ้าน เปิดตลาด เดินทาง' },
  { cn: '破', th: 'ผั้ว (พังทลาย)',       en: 'Destruction', quality: 'inauspicious', good: 'รื้อถอน ทุบตึกเก่า ตัดสิ่งที่ต้องจบ ผ่าตัด', bad: 'งานมงคลทุกชนิด เซ็นสัญญา เปิดกิจการ' },
  { cn: '危', th: 'เหวย (อันตราย)',      en: 'Danger',    quality: 'inauspicious', good: 'บวงสรวง เซ่นไหว้ ภาวนา ทำเรื่องเงียบๆ', bad: 'ปีนที่สูง เดินเรือ เสี่ยงภัย ลงทุนก้อนใหญ่' },
  { cn: '成', th: 'เฉิง (สำเร็จ)',        en: 'Success',   quality: 'auspicious',   good: 'เปิดกิจการ แต่งงาน ย้ายบ้าน เข้าเรียน ปิดดีลใหญ่', bad: 'ฟ้องร้อง แตกหัก เลิกสัญญา' },
  { cn: '收', th: 'โซว (เก็บเกี่ยว)',     en: 'Receive',   quality: 'neutral',      good: 'เก็บเงิน รับชำระ เก็บสต๊อก เปิดบัญชีออม รับพนักงาน', bad: 'เริ่มก่อสร้าง ฝังศพ ปล่อยกู้' },
  { cn: '開', th: 'ไค (เปิด)',           en: 'Open',      quality: 'auspicious',   good: 'เปิดตัวสินค้า เริ่มงานใหม่ เข้ารับตำแหน่ง เปิดสำนักงาน', bad: 'ฝังศพ ปิดกิจการ' },
  { cn: '閉', th: 'ปี้ (ปิด)',            en: 'Close',     quality: 'inauspicious', good: 'ปิดบัญชี เก็บของมีค่า อุดรอยรั่ว ทำเรื่องลับ', bad: 'เปิดกิจการ เดินทาง รับตำแหน่ง' },
]

// ── 28 Constellations (二十八宿) ──
export interface ConstellationInfo { cn: string; th: string; animal: string; auspicious: boolean; note: string }
export const CONSTELLATIONS: ConstellationInfo[] = [
  { cn: '角', th: 'เจี่ยว', animal: 'มังกรไม้',   auspicious: true,  note: 'ดีสำหรับแต่งงาน ก่อสร้าง เริ่มงานมงคล' },
  { cn: '亢', th: 'ค่าง',   animal: 'มังกรทอง',  auspicious: false, note: 'เลี่ยงงานแต่งงานและการฟ้องร้อง' },
  { cn: '氐', th: 'ตี่',    animal: 'แรดดิน',    auspicious: false, note: 'เลี่ยงลงเสาเอก เดินเรือ' },
  { cn: '房', th: 'ฝัง',    animal: 'กระต่ายตะวัน', auspicious: true, note: 'ดีทุกงานมงคล โดยเฉพาะบูชาสิ่งศักดิ์สิทธิ์' },
  { cn: '心', th: 'ซิน',    animal: 'จิ้งจอกจันทร์', auspicious: false, note: 'เลี่ยงงานใหญ่ ระวังคดีความ' },
  { cn: '尾', th: 'เหว่ย',  animal: 'เสือไฟ',    auspicious: true,  note: 'ดีสำหรับแต่งงาน ก่อสร้าง ขุดบ่อ' },
  { cn: '箕', th: 'จี',     animal: 'เสือดาวน้ำ', auspicious: true,  note: 'ดีสำหรับเก็บเกี่ยว เปิดคลัง รับทรัพย์' },
  { cn: '斗', th: 'โต่ว',   animal: 'สมันไม้',   auspicious: true,  note: 'ดีสำหรับขุดบ่อ วางระบบน้ำ เริ่มกิจการ' },
  { cn: '牛', th: 'หนิว',   animal: 'วัวทอง',    auspicious: false, note: 'เลี่ยงแต่งงาน เปิดกิจการ' },
  { cn: '女', th: 'หนี่ว์',  animal: 'ค้างคาวดิน', auspicious: false, note: 'เลี่ยงงานศพ เปิดกิจการ ขัดแย้งในบ้าน' },
  { cn: '虛', th: 'ซี',     animal: 'หนูตะวัน',  auspicious: false, note: 'เลี่ยงงานมงคล ระวังการสูญเสีย' },
  { cn: '危', th: 'เหวย',   animal: 'นกนางแอ่นจันทร์', auspicious: false, note: 'เลี่ยงปีนที่สูง เดินเรือ' },
  { cn: '室', th: 'ซื่อ',   animal: 'หมูไฟ',     auspicious: true,  note: 'ดีมากสำหรับก่อสร้าง แต่งงาน ย้ายบ้าน' },
  { cn: '壁', th: 'ปี้',    animal: 'ชะมดน้ำ',   auspicious: true,  note: 'ดีสำหรับแต่งงาน ก่อสร้าง เซ็นสัญญา' },
  { cn: '奎', th: 'ขุย',    animal: 'หมาป่าไม้', auspicious: false, note: 'เลี่ยงเปิดกิจการ ขุดดิน' },
  { cn: '婁', th: 'โหลว',   animal: 'หมาทอง',    auspicious: true,  note: 'ดีสำหรับแต่งงาน ก่อสร้าง ปลูกต้นไม้' },
  { cn: '胃', th: 'เว่ย',   animal: 'ไก่ฟ้าดิน', auspicious: true,  note: 'ดีสำหรับแต่งงาน ฝังศพ เก็บเกี่ยว' },
  { cn: '昴', th: 'เหมา',   animal: 'ไก่ตะวัน',  auspicious: false, note: 'เลี่ยงงานมงคล ระวังข้อพิพาท' },
  { cn: '畢', th: 'ปี้',    animal: 'อีกาจันทร์', auspicious: true,  note: 'ดีสำหรับก่อสร้าง ขุดบ่อ งานที่ดิน' },
  { cn: '觜', th: 'จือ',    animal: 'ลิงไฟ',     auspicious: false, note: 'เลี่ยงทุกงานใหญ่ เหมาะเก็บตัวศึกษา' },
  { cn: '參', th: 'เซิน',   animal: 'ลิงน้ำ',    auspicious: true,  note: 'ดีสำหรับเดินทาง เปิดตลาด เจรจา' },
  { cn: '井', th: 'จิ่ง',   animal: 'สมันไม้',   auspicious: true,  note: 'ดีสำหรับขุดบ่อ การศึกษา สอบแข่งขัน' },
  { cn: '鬼', th: 'กุ่ย',   animal: 'แพะทอง',    auspicious: false, note: 'เหมาะเฉพาะงานพิธีส่งวิญญาณ เลี่ยงงานมงคล' },
  { cn: '柳', th: 'หลิ่ว',  animal: 'กวางดิน',   auspicious: false, note: 'เลี่ยงงานมงคลและการก่อสร้าง' },
  { cn: '星', th: 'ซิง',    animal: 'ม้าตะวัน',  auspicious: false, note: 'เหมาะงานเปิดตัวเล็กๆ เลี่ยงแต่งงาน' },
  { cn: '張', th: 'จาง',    animal: 'กวางจันทร์', auspicious: true,  note: 'ดีมากสำหรับแต่งงาน เปิดกิจการ งานเฉลิมฉลอง' },
  { cn: '翼', th: 'อี้',    animal: 'งูไฟ',      auspicious: false, note: 'เลี่ยงแต่งงาน ยกของขึ้นที่สูง' },
  { cn: '軫', th: 'เจิ่น',  animal: 'ไส้เดือนน้ำ', auspicious: true,  note: 'ดีสำหรับแต่งงาน รับตำแหน่ง ซื้อทรัพย์สิน' },
]

// ── Yellow-Black Belt 12 spirits (黃道黑道) ──
export interface BeltSpirit { cn: string; th: string; yellow: boolean; note: string }
export const BELT_SPIRITS: BeltSpirit[] = [
  { cn: '青龍', th: 'มังกรเขียว',   yellow: true,  note: 'มงคลสูงสุด เริ่มได้ทุกเรื่องสำคัญ' },
  { cn: '明堂', th: 'หอสว่าง',      yellow: true,  note: 'ดีสำหรับประชุม เจรจา พบผู้ใหญ่' },
  { cn: '天刑', th: 'ทัณฑ์สวรรค์',  yellow: false, note: 'เลี่ยงคดีความ เอกสารกฎหมาย' },
  { cn: '朱雀', th: 'หงส์แดง',      yellow: false, note: 'ระวังปากเสียง ข้อพิพาท ดราม่า' },
  { cn: '金匱', th: 'หีบทอง',       yellow: true,  note: 'ดีสำหรับการเงิน เปิดบัญชี รับทรัพย์' },
  { cn: '天德', th: 'คุณธรรมฟ้า',   yellow: true,  note: 'ดีสำหรับงานบุญ งานมงคล ขอความช่วยเหลือ' },
  { cn: '白虎', th: 'พยัคฆ์ขาว',    yellow: false, note: 'ระวังอุบัติเหตุ ของมีคม การผ่าตัด' },
  { cn: '玉堂', th: 'หอหยก',        yellow: true,  note: 'ดีสำหรับเข้าทำงาน ย้ายโต๊ะ งานวิชาการ' },
  { cn: '天牢', th: 'คุกสวรรค์',    yellow: false, note: 'เลี่ยงเซ็นผูกมัด เดินทางไกล' },
  { cn: '玄武', th: 'เต่าดำ',       yellow: false, note: 'ระวังการโกง ขโมย ข้อมูลรั่ว' },
  { cn: '司命', th: 'ผู้คุมชะตา',   yellow: true,  note: 'ดีช่วงกลางวัน งานเอกสาร งานครัว' },
  { cn: '勾陳', th: 'โกวเฉิน',      yellow: false, note: 'เลี่ยงงานที่ดิน ขุดดิน ผูกพันระยะยาว' },
]

// month branch group → starting branch of 青龍
export const BELT_START: Record<number, number> = {
  0: 8, 6: 8,   // 子午 → 申
  1: 10, 7: 10, // 丑未 → 戌
  2: 0, 8: 0,   // 寅申 → 子
  3: 2, 9: 2,   // 卯酉 → 寅
  4: 4, 10: 4,  // 辰戌 → 辰
  5: 6, 11: 6,  // 巳亥 → 午
}

// ── Qi Men Dun Jia ──
export const QM_STARS = [
  { cn: '天蓬', th: 'เทียนเผิง', en: 'Grass', nature: 'ร้าย', note: 'ดาวนักสู้กลางคืน เด่นเรื่องเงินเสี่ยงโชค แต่ระวังคนหลอก' },
  { cn: '天芮', th: 'เทียนรุ่ย', en: 'Grain', nature: 'ร้าย', note: 'ดาวหมอ/นักเรียน เด่นการเรียนรู้ แต่พ่วงเรื่องสุขภาพ' },
  { cn: '天沖', th: 'เทียนชง',  en: 'Destructor', nature: 'ดี',  note: 'ดาวนักรบ ลุยไว ตรงไปตรงมา เหมาะการแข่งขัน' },
  { cn: '天輔', th: 'เทียนฝู่',  en: 'Assistant', nature: 'ดี',  note: 'ดาวครู ปัญญา วัฒนธรรม เหมาะสอบ เรียน เจรจา' },
  { cn: '天禽', th: 'เทียนฉิน', en: 'Connector', nature: 'ดี',  note: 'ดาวจักรพรรดิกลางกระดาน สมดุล น่าเชื่อถือ' },
  { cn: '天心', th: 'เทียนซิน', en: 'Heart', nature: 'ดี',  note: 'ดาวหมอใหญ่/ผู้นำ เหมาะการรักษา การเงิน การบริหาร' },
  { cn: '天柱', th: 'เทียนจู้',  en: 'Pillar', nature: 'ร้าย', note: 'ดาวนักพูด/นักกฎหมาย ปากคม เหมาะป้องกันมากกว่ารุก' },
  { cn: '天任', th: 'เทียนเหริน', en: 'Ambassador', nature: 'ดี', note: 'ดาวผู้ซื่อสัตย์ มั่นคง เหมาะงานที่ดิน อสังหาฯ' },
  { cn: '天英', th: 'เทียนอิง', en: 'Hero', nature: 'กลาง', note: 'ดาวความงาม ชื่อเสียง แสงไฟ เหมาะงานโชว์ แต่ใจร้อน' },
]

export const QM_DOORS = [
  { cn: '休門', th: 'ประตูพัก',    en: 'Rest',    nature: 'ดี',  note: 'พักฟื้น เจรจานุ่มนวล พบผู้ใหญ่ ขอความช่วยเหลือ' },
  { cn: '生門', th: 'ประตูเกิด',   en: 'Life',    nature: 'ดี',  note: 'ทำมาหากิน เปิดกิจการ หาเงิน อสังหาริมทรัพย์' },
  { cn: '傷門', th: 'ประตูบาดเจ็บ', en: 'Injury', nature: 'ร้าย', note: 'แข่งขัน ทวงหนี้ ล่าสัตว์ เลี่ยงงานมงคล' },
  { cn: '杜門', th: 'ประตูปิดกั้น', en: 'Delusion', nature: 'กลาง', note: 'เก็บความลับ หลบภัย งานเทคนิคเฉพาะทาง' },
  { cn: '景門', th: 'ประตูทิวทัศน์', en: 'Scenery', nature: 'กลาง', note: 'งานนำเสนอ สอบ โฆษณา งานแสง สี เสียง' },
  { cn: '死門', th: 'ประตูมรณะ',   en: 'Death',   nature: 'ร้าย', note: 'งานศพ ล่าสัตว์ ตัดจบ เลี่ยงเรื่องมงคลทั้งปวง' },
  { cn: '驚門', th: 'ประตูตกใจ',   en: 'Fear',    nature: 'ร้าย', note: 'คดีความ วิวาทะ เหมาะเก็บข่าว ฟังความเคลื่อนไหว' },
  { cn: '開門', th: 'ประตูเปิด',   en: 'Open',    nature: 'ดี',  note: 'เปิดงาน รับตำแหน่ง พบผู้ใหญ่ เริ่มโปรเจกต์ใหญ่' },
]

export const QM_DEITIES = [
  { cn: '值符', th: 'จื๋อฝู (เทพประธาน)', en: 'Chief', note: 'เทพผู้นำสูงสุด คุ้มครองแรง เหมาะเรื่องใหญ่และผู้หลักผู้ใหญ่', insight: 'คุณมีเกราะของผู้นำติดตัว — บารมีและผู้ใหญ่เกื้อหนุนคือทรัพย์สินที่มองไม่เห็นของคุณ จงใช้มันในการขอโอกาสใหญ่เสมอ' },
  { cn: '螣蛇', th: 'เถิงเสอ (งูเลื้อยฟ้า)', en: 'Serpent', note: 'เล่ห์เหลี่ยม สังหรณ์ ความฝัน เรื่องเร้นลับ', insight: 'สัมผัสที่หกของคุณแม่นกว่าค่าเฉลี่ย — แต่จงแยกสังหรณ์ออกจากความกังวล แล้วญาณของคุณจะเป็นเรดาร์ธุรกิจชั้นดี' },
  { cn: '太陰', th: 'ไท่ยิน (จันทราลับ)', en: 'Moon', note: 'ผู้ช่วยเบื้องหลัง แผนลับ ความละเอียดอ่อน', insight: 'พลังของคุณทำงานเงียบที่สุดในความมืด — การวางแผนหลังฉากและพันธมิตรลับคือไพ่ตายที่คนอื่นคาดไม่ถึง' },
  { cn: '六合', th: 'ลิ่วเหอ (หกประสาน)', en: 'Harmony', note: 'การเจรจา สัญญา ความร่วมมือ งานมงคล', insight: 'คุณเกิดมาเพื่อเป็นตัวกลางแห่งดีล — เสน่ห์การประสานสิบทิศทำให้ทุกฝ่ายยอมลงนามบนโต๊ะเดียวกัน' },
  { cn: '白虎', th: 'ไป๋หู่ (พยัคฆ์ขาว)', en: 'Tiger', note: 'อำนาจดิบ ความเร็ว การแข่งขัน ระวังอุบัติเหตุ', insight: 'คุณคือนักล่าในสนามแข่งขัน — ความเร็วและความเด็ดขาดคืออาวุธ แต่ต้องรู้จังหวะเก็บเขี้ยวเล็บ' },
  { cn: '玄武', th: 'เสวียนอู่ (เต่าดำ)', en: 'Tortoise', note: 'ข้อมูลลับ ระวังการโกง งานสายข่าว', insight: 'คุณอ่านเกมใต้โต๊ะได้ขาด — ใช้พลังนี้ป้องกันการโกงและวิเคราะห์ข้อมูลเชิงลึก อย่าใช้ในทางมืดเสียเอง' },
  { cn: '九地', th: 'จิ่วตี้ (ปฐพีเก้าชั้น)', en: 'Earth', note: 'การตั้งรับ ความอดทน ซุ่มรอจังหวะ', insight: 'ความอดทนของคุณคือป้อมปราการเก้าชั้น — ยิ่งซุ่มนานยิ่งได้เปรียบ การลงทุนระยะยาวคือสนามของคุณ' },
  { cn: '九天', th: 'จิ่วเทียน (นภาเก้าชั้น)', en: 'Heaven', note: 'การรุก ขยายตัว ชื่อเสียงระดับกว้าง', insight: 'เพดานของคุณคือท้องฟ้าเก้าชั้น — จังหวะรุกและการขยายตัวใหญ่ระดับข้ามเมืองข้ามประเทศคือเกมที่คุณถนัด' },
  { cn: '太常', th: 'ไท่ฉาง (พิธีหลวง)', en: 'Ritual', note: 'พิธีการ ความน่าเชื่อถือ ทรัพย์สินสะสม', insight: 'ภาพลักษณ์อันน่าเชื่อถือคือทรัพย์สินหลักของคุณ — งานที่ต้องการมาตรฐานและพิธีการสูงจะส่งคุณขึ้นแท่น' },
  { cn: '勾陳', th: 'โกวเฉิน (มังกรดิน)', en: 'Hook', note: 'ความหน่วง ที่ดิน ข้อผูกมัด งานปกครอง', insight: 'คุณคือผู้คุมกฎของสนาม — อำนาจปกครองและการถือครองที่ดินคือรากอำนาจ อย่าปล่อยให้ความหน่วงกลายเป็นความช้า' },
]

export const PALACE_INFO = [
  // luoshu index 1-9 (0 unused)
  null,
  { dir: 'เหนือ',            cn: '坎', trigram: 5, element: 'water' as ElementKey },
  { dir: 'ตะวันตกเฉียงใต้',  cn: '坤', trigram: 7, element: 'earth' as ElementKey },
  { dir: 'ตะวันออก',         cn: '震', trigram: 3, element: 'wood' as ElementKey },
  { dir: 'ตะวันออกเฉียงใต้', cn: '巽', trigram: 4, element: 'wood' as ElementKey },
  { dir: 'ศูนย์กลาง',        cn: '中', trigram: -1, element: 'earth' as ElementKey },
  { dir: 'ตะวันตกเฉียงเหนือ', cn: '乾', trigram: 0, element: 'metal' as ElementKey },
  { dir: 'ตะวันตก',          cn: '兌', trigram: 1, element: 'metal' as ElementKey },
  { dir: 'ตะวันออกเฉียงเหนือ', cn: '艮', trigram: 6, element: 'earth' as ElementKey },
  { dir: 'ใต้',              cn: '離', trigram: 2, element: 'fire' as ElementKey },
]

// ── Numerology (เลขศาสตร์) ──
// Ho Tu digit → element: 1,6 water | 2,7 fire | 3,8 wood | 4,9 metal | 5,0 earth
export const DIGIT_ELEMENT: Record<string, ElementKey> = {
  '1': 'water', '6': 'water',
  '2': 'fire',  '7': 'fire',
  '3': 'wood',  '8': 'wood',
  '4': 'metal', '9': 'metal',
  '5': 'earth', '0': 'earth',
}

export const DIGIT_MEANING: Record<string, string> = {
  '0': 'ความว่าง ศูนย์รวม การเริ่มนับหนึ่งใหม่',
  '1': 'ผู้นำ ความโดดเด่น ความเร็ว',
  '2': 'เสน่ห์ การเจรจา ความอ่อนโยน',
  '3': 'การลงมือทำ ความกล้า พลังนักสู้',
  '4': 'การสื่อสาร ปัญญาไว การค้าขาย',
  '5': 'ศูนย์กลาง บารมี ผู้ใหญ่เกื้อหนุน',
  '6': 'ศิลปะ ความงาม การเงินคล่องตัว',
  '7': 'ความอดทน การเดินทาง โชคจากต่างถิ่น',
  '8': 'ทรัพย์ก้อนใหญ่ อำนาจเงียบ ความลึกลับ',
  '9': 'สิ่งศักดิ์สิทธิ์คุ้มครอง ความสำเร็จสูงสุด',
}

export interface LifeNumberInfo { th: string; desc: string }
export const LIFE_NUMBERS: Record<number, LifeNumberInfo> = {
  1: { th: 'ผู้นำหัวขบวน',      desc: 'เกิดมาเพื่อยืนแถวหน้า ตัดสินใจไว รักอิสระ ไม่ชอบเป็นผู้ตาม' },
  2: { th: 'นักการทูตหัวใจละมุน', desc: 'อ่านใจคนเก่ง ประสานสิบทิศ ชนะด้วยความอ่อนโยนไม่ใช่กำลัง' },
  3: { th: 'นักรบพลังบวก',      desc: 'ลุยไม่ถอย พลังงานล้น เหมาะงานที่ต้องแข่งกับเวลาและคู่แข่ง' },
  4: { th: 'นักสื่อสารหัวไว',    desc: 'ปัญญาไหลลื่น เจรจาเก่ง ขายเก่ง จับกระแสได้ก่อนใคร' },
  5: { th: 'ศูนย์กลางบารมี',     desc: 'ธาตุดินแห่งความมั่นคง คนรอบตัวพร้อมเกื้อหนุน เหมาะคุมทีมใหญ่' },
  6: { th: 'ศิลปินแห่งโชคลาภ',   desc: 'รสนิยมดี เสน่ห์แรง เงินทองไหลเข้าผ่านความงามและความสัมพันธ์' },
  7: { th: 'นักเดินทางผู้ทรหด',   desc: 'ยิ่งไกลยิ่งรุ่ง โชคอยู่ต่างถิ่น ความอดทนคือซูเปอร์พาวเวอร์' },
  8: { th: 'เจ้าสัวเงาเงียบ',     desc: 'อำนาจและทรัพย์ก้อนใหญ่แบบไม่โชว์ตัว เหมาะสายลงทุนและอสังหาฯ' },
  9: { th: 'ผู้ถูกฟ้าคุ้มครอง',   desc: 'แรงศรัทธาและสิ่งศักดิ์สิทธิ์หนุนนำ ทำเรื่องใหญ่สำเร็จเหนือความคาดหมาย' },
}

// phone pair scores (Thai numerology pair table, condensed)
export const PAIR_SCORES: Record<string, { score: number; meaning: string }> = {
  '15': { score: 5, meaning: 'ผู้ใหญ่เมตตา บารมีหนุน' }, '51': { score: 5, meaning: 'บารมีผู้นำ คนเคารพ' },
  '24': { score: 5, meaning: 'เสน่ห์การพูด เงินไหลเข้า' }, '42': { score: 5, meaning: 'เจรจาเก่ง ค้าขายรุ่ง' },
  '36': { score: 4, meaning: 'ใจกล้า ได้ลาภจากศิลปะ' }, '63': { score: 4, meaning: 'สร้างสรรค์ กล้าลงมือ' },
  '45': { score: 5, meaning: 'ปัญญา+บารมี ที่ปรึกษาชั้นยอด' }, '54': { score: 5, meaning: 'ผู้ใหญ่หนุนเรื่องการงาน' },
  '46': { score: 4, meaning: 'พูดเก่งมีเสน่ห์ การเงินดี' }, '64': { score: 4, meaning: 'เงินคล่อง เจรจาสำเร็จ' },
  '56': { score: 5, meaning: 'บารมี+โชคทรัพย์ ครบเครื่อง' }, '65': { score: 5, meaning: 'ทรัพย์ใหญ่ ผู้ใหญ่รัก' },
  '78': { score: 3, meaning: 'อดทนจนได้ทรัพย์ลึกลับ' }, '87': { score: 3, meaning: 'ทรัพย์มาจากความเพียร' },
  '89': { score: 4, meaning: 'อำนาจ+สิ่งศักดิ์สิทธิ์คุ้มครอง' }, '98': { score: 4, meaning: 'บุญเก่าหนุนทรัพย์' },
  '19': { score: 4, meaning: 'ผู้นำที่ฟ้าคุ้มครอง' }, '91': { score: 4, meaning: 'สำเร็จเร็วเหนือคู่แข่ง' },
  '14': { score: 4, meaning: 'คิดไวทำไว สื่อสารเฉียบ' }, '41': { score: 4, meaning: 'ข่าวดีเรื่องงานไหลมา' },
  '59': { score: 5, meaning: 'บารมีสูงสุด คนศรัทธา' }, '95': { score: 5, meaning: 'หัวหน้าใหญ่ ฟ้าประทาน' },
  '26': { score: 4, meaning: 'เสน่ห์เมตตามหานิยม' }, '62': { score: 4, meaning: 'ความรักและการเงินราบรื่น' },
  '23': { score: 2, meaning: 'ปากไวใจร้อน ระวังวิวาท' }, '32': { score: 2, meaning: 'อารมณ์ศิลปินแรง ระวังปะทะ' },
  '13': { score: 1, meaning: 'ใจร้อน อุบัติเหตุ ผ่าตัด' }, '31': { score: 1, meaning: 'หุนหันพลันแล่น เจ็บตัวง่าย' },
  '27': { score: 1, meaning: 'อารมณ์อ่อนไหว อกหักง่าย' }, '72': { score: 1, meaning: 'เหนื่อยใจเรื่องความสัมพันธ์' },
  '48': { score: 2, meaning: 'คิดมาก เครียดลึก นอนไม่หลับ' }, '84': { score: 2, meaning: 'ระวังโดนหลอก เอกสารมีปัญหา' },
  '03': { score: 1, meaning: 'ลงมือแล้วสะดุด เริ่มยาก' }, '30': { score: 1, meaning: 'พลังถูกดูด งานค้างเติ่ง' },
  '07': { score: 1, meaning: 'เหนื่อยฟรี เดินทางเปล่าประโยชน์' }, '70': { score: 1, meaning: 'อดทนแต่ไร้ผลตอบแทน' },
  '12': { score: 3, meaning: 'ผู้นำมีเสน่ห์ แต่ระวังหลายใจ' }, '21': { score: 3, meaning: 'เสน่ห์แรง คนเข้าหา' },
  '69': { score: 4, meaning: 'โชคจากสิ่งศักดิ์สิทธิ์และศิลปะ' }, '96': { score: 4, meaning: 'บุญเก่าส่งผลเรื่องทรัพย์' },
  '17': { score: 2, meaning: 'ผู้นำที่ต้องสู้โดดเดี่ยว' }, '71': { score: 2, meaning: 'เหนื่อยก่อนสำเร็จ' },
  '28': { score: 3, meaning: 'เสน่ห์ลึกลับ ทรัพย์เงียบ' }, '82': { score: 3, meaning: 'เงินเข้าทางช่องทางลับ' },
  '35': { score: 3, meaning: 'นักสู้ที่มีผู้ใหญ่คุม' }, '53': { score: 3, meaning: 'บารมีคุมความห้าว' },
  '68': { score: 3, meaning: 'เงินหมุนใหญ่ ระวังจมทุน' }, '86': { score: 3, meaning: 'ทรัพย์ลึกลับไหลเวียน' },
  '18': { score: 2, meaning: 'อำนาจกดดัน เครียดสูง' }, '81': { score: 2, meaning: 'แบกภาระผู้นำ' },
  '38': { score: 1, meaning: 'ปะทะรุนแรง คดีความ' }, '83': { score: 1, meaning: 'ขัดแย้งลึก ระวังศัตรูลับ' },
  '00': { score: 1, meaning: 'ความว่างซ้อน สุญญากาศ' },
  '99': { score: 4, meaning: 'ศรัทธาซ้อนศรัทธา ฟ้าเปิดทาง' },
  '55': { score: 4, meaning: 'บารมีซ้อน ผู้ใหญ่ล้อมรอบ' },
  '11': { score: 2, meaning: 'ผู้นำชนผู้นำ แข็งเกิน' },
  '22': { score: 3, meaning: 'ละมุนซ้อน อ่อนไหวง่าย' },
  '44': { score: 4, meaning: 'สื่อสารทวีคูณ ขายเก่งมาก' },
  '66': { score: 4, meaning: 'เงินไหลรอบทิศ' },
  '77': { score: 2, meaning: 'เดินทางซ้ำซ้อน เหนื่อยสะสม' },
  '33': { score: 2, meaning: 'พลังบู๊ล้น ระวังหักโหม' },
  '88': { score: 3, meaning: 'ทรัพย์ลับก้อนโต แต่เก็บเงียบ' },
}

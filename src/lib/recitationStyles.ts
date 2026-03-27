export type RecitationStyle = 'murattal' | 'mujawwad' | 'muallim' | 'other'

export interface StyleInfo {
  id: RecitationStyle
  labelKey: string
  descKey: string
}

export const RECITATION_STYLES: StyleInfo[] = [
  { id: 'murattal',  labelKey: 'style_murattal',  descKey: 'style_murattal_desc' },
  { id: 'mujawwad',  labelKey: 'style_mujawwad',  descKey: 'style_mujawwad_desc' },
  { id: 'muallim',   labelKey: 'style_muallim',   descKey: 'style_muallim_desc' },
]

// Classify using moshaf_type AND name keywords
export function classifyMoshaf(moshafType: number, moshafName: string = ''): RecitationStyle {
  const nameLower = moshafName.toLowerCase()
  const nameAr = moshafName

  // Check name keywords first (most reliable)
  if (nameLower.includes('mujawwad') || nameLower.includes('مجود') || nameAr.includes('مجوّد')) return 'mujawwad'
  if (nameLower.includes('muallim') || nameLower.includes('معلم') || nameAr.includes('المعلم') || nameLower.includes('teaching') || nameLower.includes('تعليم')) return 'muallim'
  if (nameLower.includes('murattal') || nameLower.includes('مرتل') || nameAr.includes('مرتّل')) return 'murattal'

  // Fallback to moshaf_type number
  // Mp3Quran API: 1-2 = Murattal rewayat, 4-5 = Mujawwad, 6 = Muallim
  if (moshafType === 4 || moshafType === 5) return 'mujawwad'
  if (moshafType === 6) return 'muallim'
  return 'murattal'
}

// Backwards compat wrapper
export function classifyMoshafType(moshafType: number): RecitationStyle {
  return classifyMoshaf(moshafType)
}

// Check if a reciter has a specific style in any of their moshaf entries
export function reciterHasStyle(
  moshafList: { moshaf_type: number; name?: string }[],
  style: RecitationStyle
): boolean {
  return moshafList.some((m) => classifyMoshaf(m.moshaf_type, m.name ?? '') === style)
}

// Get the primary style of a reciter (first moshaf)
export function getReciterStyle(moshafList: { moshaf_type: number; name?: string }[]): RecitationStyle {
  if (!moshafList.length) return 'murattal'
  return classifyMoshaf(moshafList[0].moshaf_type, moshafList[0].name ?? '')
}

// Get i18n label key for a style
export function getStyleLabelKey(style: RecitationStyle): string {
  const info = RECITATION_STYLES.find(s => s.id === style)
  return info?.labelKey ?? 'style_murattal'
}

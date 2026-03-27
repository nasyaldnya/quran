// Mp3Quran moshaf_type values → recitation style categories
// The API uses numeric moshaf_type to categorize recitation styles
export type RecitationStyle = 'murattal' | 'mujawwad' | 'muallim' | 'other'

export interface StyleInfo {
  id: RecitationStyle
  labelKey: string   // i18n key
  descKey: string    // i18n key
}

export const RECITATION_STYLES: StyleInfo[] = [
  { id: 'murattal',  labelKey: 'style_murattal',  descKey: 'style_murattal_desc' },
  { id: 'mujawwad',  labelKey: 'style_mujawwad',  descKey: 'style_mujawwad_desc' },
  { id: 'muallim',   labelKey: 'style_muallim',   descKey: 'style_muallim_desc' },
]

// Classify a moshaf_type number into a style
export function classifyMoshafType(moshafType: number): RecitationStyle {
  // Common mapping from Mp3Quran API:
  // Types 1-2: Murattal variants (Hafs, Warsh, etc.)
  // Types 3-4: Mujawwad
  // Type 5: Muallim (learning/teaching style)
  // Higher types are various rewayat
  if (moshafType <= 2) return 'murattal'
  if (moshafType <= 4) return 'mujawwad'
  if (moshafType === 5) return 'muallim'
  return 'murattal' // default
}

// Check if a reciter has a specific style in any of their moshaf entries
export function reciterHasStyle(
  moshafList: { moshaf_type: number }[],
  style: RecitationStyle
): boolean {
  return moshafList.some((m) => classifyMoshafType(m.moshaf_type) === style)
}

// Tajweed bracket notation parser
// The alquran.cloud tajweed API returns: [rule_code[text] or [rule_code:param[text]

export const TAJWEED_COLORS: Record<string, string> = {
  h: '#AAAAAA',   // hamzat wasl
  s: '#AAAAAA',   // laam shamsiyah
  l: '#AAAAAA',   // silent
  n: '#537FFF',   // madda normal
  p: '#4050FF',   // madda permissible
  o: '#000FB0',   // madda obligatory
  q: '#DD0008',   // qalqalah
  f: '#D500B7',   // ikhfaa
  w: '#D500B7',   // ikhfaa shafawi
  i: '#26BFFD',   // iqlab
  g: '#FF7E1E',   // ghunnah
  d: '#169200',   // idghaam ghunnah
  b: '#169200',   // idghaam without ghunnah
  m: '#A1A100',   // idghaam mutajanisayn
  t: '#A1A100',   // idghaam mutaqaribayn
  u: '#D500B7',   // ikhfaa shafawi variant
}

export interface TajweedPart {
  text: string
  color: string | null
}

export function parseTajweed(raw: string): TajweedPart[] {
  const parts: TajweedPart[] = []
  let i = 0

  while (i < raw.length) {
    if (raw[i] === '[') {
      const ruleEnd = raw.indexOf('[', i + 1)
      if (ruleEnd === -1) {
        parts.push({ text: raw.slice(i), color: null })
        break
      }
      const rulePart = raw.slice(i + 1, ruleEnd)
      const ruleCode = rulePart.split(':')[0]
      const closeIdx = raw.indexOf(']', ruleEnd + 1)
      if (closeIdx === -1) {
        parts.push({ text: raw.slice(i), color: null })
        break
      }
      const innerText = raw.slice(ruleEnd + 1, closeIdx)
      parts.push({ text: innerText, color: TAJWEED_COLORS[ruleCode] ?? null })
      i = closeIdx + 1
    } else {
      const nextBracket = raw.indexOf('[', i)
      const end = nextBracket === -1 ? raw.length : nextBracket
      const chunk = raw.slice(i, end)
      if (chunk) parts.push({ text: chunk, color: null })
      i = end
    }
  }
  return parts
}

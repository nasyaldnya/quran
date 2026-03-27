import { useQuery } from '@tanstack/react-query'

interface TajweedAyah {
  number: number
  numberInSurah: number
  text: string  // HTML with <tajweed> color tags
}

interface TajweedSurah {
  number: number
  name: string
  ayahs: TajweedAyah[]
}

async function fetchTajweed(surahNumber: number): Promise<TajweedSurah | null> {
  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/quran-tajweed`
    )
    const data = await res.json()
    if (data.code !== 200 || !data.data) return null
    return {
      number: data.data.number,
      name: data.data.name,
      ayahs: data.data.ayahs.map((a: any) => ({
        number: a.number,
        numberInSurah: a.numberInSurah,
        text: a.text,
      })),
    }
  } catch {
    return null
  }
}

export function useTajweed(surahNumber: number | undefined, enabled: boolean = true) {
  return useQuery({
    queryKey: ['tajweed', surahNumber],
    queryFn: () => fetchTajweed(surahNumber!),
    enabled: !!surahNumber && enabled,
    staleTime: Infinity,
  })
}

// Tajweed CSS classes for the color-coded HTML from the API
// The API returns HTML like: <tajweed class="ham_wasl">ٱ</tajweed>
export const TAJWEED_STYLES = `
  tajweed[class=ham_wasl] { color: #AAAAAA; }
  tajweed[class=slnt] { letter-spacing: -2px; font-size: 0.8em; color: #AAAAAA; }
  tajweed[class=madda_normal] { color: #537FFF; }
  tajweed[class=madda_permissible] { color: #4050FF; }
  tajweed[class=madda_obligatory] { color: #000FB8; }
  tajweed[class=qlq] { color: #DD0008; }
  tajweed[class=ikhf_shfwy] { color: #D500B7; }
  tajweed[class=ikhf] { color: #26BFAF; }
  tajweed[class=idghm_shfwy] { color: #58B800; }
  tajweed[class=iqlb] { color: #26BFAF; }
  tajweed[class=idgh_ghn] { color: #169200; }
  tajweed[class=idgh_w_ghn] { color: #169200; }
  tajweed[class=ghunnah] { color: #FF7E1E; }
` as const

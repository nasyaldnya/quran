// Juz boundaries: each juz starts at a specific surah:ayah
// Format: [surahNumber, startAyah]
export const JUZ_BOUNDARIES: [number, number][] = [
  [1, 1],    // Juz 1
  [2, 142],  // Juz 2
  [2, 253],  // Juz 3
  [3, 93],   // Juz 4
  [4, 24],   // Juz 5
  [4, 148],  // Juz 6
  [5, 82],   // Juz 7
  [6, 111],  // Juz 8
  [7, 88],   // Juz 9
  [8, 41],   // Juz 10
  [9, 93],   // Juz 11
  [11, 6],   // Juz 12
  [12, 53],  // Juz 13
  [15, 1],   // Juz 14
  [17, 1],   // Juz 15
  [18, 75],  // Juz 16
  [21, 1],   // Juz 17
  [23, 1],   // Juz 18
  [25, 21],  // Juz 19
  [27, 56],  // Juz 20
  [29, 46],  // Juz 21
  [33, 31],  // Juz 22
  [36, 28],  // Juz 23
  [39, 32],  // Juz 24
  [41, 47],  // Juz 25
  [46, 1],   // Juz 26
  [51, 31],  // Juz 27
  [58, 1],   // Juz 28
  [67, 1],   // Juz 29
  [78, 1],   // Juz 30
]

// Get surahs that belong to a juz (simplified — surahs that start in this juz)
export function getSurahsInJuz(juzNumber: number): number[] {
  const startIdx = juzNumber - 1
  const start = JUZ_BOUNDARIES[startIdx]
  const end = JUZ_BOUNDARIES[startIdx + 1] ?? [115, 1] // after last surah

  const surahs: number[] = []
  for (let s = start[0]; s < end[0]; s++) {
    surahs.push(s)
  }
  // Include the ending surah if it starts in this juz
  if (end[0] <= 114 && start[0] !== end[0]) {
    surahs.push(end[0])
  }
  // If juz starts mid-surah, include that surah
  if (!surahs.includes(start[0])) surahs.unshift(start[0])

  return [...new Set(surahs)].sort((a, b) => a - b)
}

# القرآن الكريم | The Holy Quran

A premium, fully-static Quran listening experience hosted on GitHub Pages. Features 100+ world-renowned reciters, all 114 Surahs, a persistent audio player, and a luxurious dark-mode-first UI.

---

## ✨ Features

- 🎙️ **100+ Reciters** — Full data from the Mp3Quran API v3
- 🎵 **Persistent Audio Player** — Plays across page navigation with queue, shuffle, and repeat
- 🌙 **Dark / Light Mode** — System-aware, persisted to localStorage
- 🔍 **Search & Filter** — Instant client-side search for reciters and surahs
- 📱 **Fully Responsive** — Mobile-first design
- ⚡ **Fast** — Vite production build with code-splitting
- 🚀 **Zero Server** — 100% static, hosted on GitHub Pages

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Routing | React Router v6 (HashRouter) |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| Audio | Howler.js |
| State | Zustand |
| Data Fetching | TanStack Query v5 + Axios |
| Deployment | GitHub Actions → GitHub Pages |

---

## 📁 Project Structure

```
quran/
├── .github/workflows/deploy.yml   # CI/CD pipeline
├── public/icons/                   # Static assets
├── src/
│   ├── components/
│   │   ├── common/                 # ThemeProvider, SearchBar, etc.
│   │   ├── layout/                 # Navbar, Footer, AudioPlayer
│   │   ├── reciters/               # ReciterCard, ReciterGrid
│   │   ├── surahs/                 # SurahCard, SurahListItem
│   │   └── ui/                     # button, card, badge, skeleton
│   ├── hooks/                      # useAudioPlayer, useReciters, useDebounce
│   ├── lib/                        # api.ts, queryClient.ts, utils.ts
│   ├── pages/                      # HomePage, RecitersPage, etc.
│   ├── store/                      # Zustand audioStore
│   └── types/                      # API TypeScript interfaces
├── vite.config.ts                  # base: '/quran/'
└── tailwind.config.ts
```

---

## 🚀 Local Development

```bash
# 1. Clone the repository
git clone https://github.com/nasyaldnya/quran.git
cd quran

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open http://localhost:5173/quran/
```

---

## 🏗 Building for Production

```bash
npm run build      # Type-check + Vite build → dist/
npm run preview    # Serve dist/ locally to verify
```

---

## 🌐 Deployment (GitHub Pages)

Deployment is fully automated via GitHub Actions.

**Every push to `main` triggers:**
1. `npm ci` — reproducible install
2. `tsc --noEmit` — type safety gate
3. `npm run build` — Vite static build
4. Push `dist/` → `gh-pages` branch via `peaceiris/actions-gh-pages`

**One-time GitHub setup required:**

```
Repository Settings → Pages
  → Source: Deploy from a branch
  → Branch: gh-pages / (root)
  → Save
```

Live URL: `https://nasyaldnya.github.io/quran/`

---

## ⚠️ Important: Rename for Your Repo

If your GitHub repository is named something other than `quran`, update:

```ts
// vite.config.ts  — line 8
base: '/YOUR_REPO_NAME/',
```

---

## 📖 API

Audio data is fetched from the [Mp3Quran API v3](https://www.mp3quran.net/ar/api) — a free, public API. No authentication required.

---

## 📜 License

Open source — for the love of the Holy Quran. ❤️

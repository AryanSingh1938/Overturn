<div align="center">

# 🌼 Dandelions

### *A Private, Zero-Cloud Living Memorial & Digital Ofrenda Sanctuary*

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](https://opensource.org/licenses/MIT)
[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-Week%204:%20Ghost%20in%20the%20Machine-orange.svg)](https://dev.to/challenges/hf26)
[![Gemma 2 Powered](https://img.shields.io/badge/AI-Google%20Gemma%202-blue.svg)](https://ai.google.dev/gemma)
[![React 19](https://img.shields.io/badge/React-19%20%2B%20Vite-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg)](https://tailwindcss.com/)
[![Offline First](https://img.shields.io/badge/Privacy-100%25%20Local%20%26%20Zero--Cloud-emerald.svg)](#privacy--zero-cloud-guarantee)

<p align="center">
  <b>Preserve family stories, honor departed loved ones, and scatter memories to the wind like seeds across generations.</b><br/>
  Runs entirely on your device with local open-weight AI. Your grief and memories will never be rented, mined, or sold.
</p>

---

[Key Features](#-key-features) • [Why Open Innovation Matters](#-why-open-innovation-matters) • [Tech Stack](#-tech-stack) • [Quickstart](#-getting-started) • [Project Structure](#-project-structure) • [Roadmap](#-hacktoberfest-roadmap)

</div>

---

## 🕊️ What is Dandelions?

When someone we love passes away, their memories shouldn't be trapped behind paywalled subscription portals, ad-supported social platforms that sell behavioral data, or proprietary cloud silos that shut down when servers go dark.

Named after the flower whose seeds drift freely across time and winds, **Dandelions** is an open-source, local-first remembrance platform built in the spirit of **Día de los Muertos** and the Hacktoberfest *Ghost in the Machine* challenge.

It allows families and individuals to build **digital ofrendas**, record oral histories, craft biographical remembrance stories, and carry out a calming **"Release to the Wind"** ritual—all executing 100% locally on user hardware using **Google Gemma 2** and browser-native audio & physics.

---

## ✨ Key Features

### 🕯️ 1. Interactive Digital Ofrenda Builder
- **Tiered Altars:** Arrange photos of ancestors and departed loved ones on a traditional stepped altar.
- **Symbolic Offerings:** Place glowing marigolds (*cempasúchil*), flickering candles, incense smoke, favorite foods, beverages, and personal keepsakes.
- **Ambient Lighting & Shaders:** Dynamic candle flicker and warm marigold glow simulated via native CSS shaders and canvas lighting.

### 🎙️ 2. Local Oral History & Memory Vault
- **Voice Story Recording:** High-fidelity in-browser audio capture for elder stories, eulogies, and family anecdotes.
- **On-Device Speech & Transcription:** Real-time processing keeping voice notes and confidential family lore strictly on your machine.
- **Categorized Milestones:** Tag memories by era, relationship, humor, lessons learned, and favorite traditions.

### 🧠 3. Spirit of Remembrance Engine (Local Gemma 2)
- **Biographical Story Weaver:** Transform fragmented bullet points into rich, poetic narrative keepsakes.
- **Tribute & Eulogy Crafter:** Generate dignified speeches, letters of remembrance, or reflective poems tailored to the loved one’s personality.
- **Zero Cloud Dependence:** Powered by **Google Gemma 2 (2B/9B)** running locally via WebGPU (`@mlc-ai/web-llm`) or desktop Ollama (`http://localhost:11434`).

### 🌬️ 4. "Release to the Wind" Dandelion Ritual
- **Interactive Particle Physics:** An emotional release ritual where users type an unsaid word, apology, gratitude, or wish onto a dandelion seedhead.
- **Seed Drift Animation:** A gentle breath or click triggers realistic canvas physics, carrying glowing dandelion seeds into an ambient twilight sky.
- **Procedural Soundscape:** Native Web Audio API synthesis generating wind rustle, acoustic guitar picking, and soft chime resonances without streaming megabytes of audio assets.

### 📦 5. Permanent "USB Time Capsule" Export
- **One-Click Offline Archival:** Export the entire memorial into a standalone, single-file HTML/JSON package that opens in any browser 20 years from now—no server, internet, or subscription required.

---

## 🛡️ Why Open Innovation Matters

| Principle | Commercial Memorial Platforms | Dandelions (Open-Source AI) |
| :--- | :--- | :--- |
| **Data Privacy** | Family photos & grief journals stored on cloud ad servers | **100% Local (IndexedDB & LocalStorage)**; 0 bytes leave device |
| **Longevity** | Shuts down or paywalls data if company is acquired | **Permanent Standalone HTML/JSON** executable forever |
| **Inference Cost** | \$10–\$30/mo subscription to access cloud LLMs | **\$0.00 / Free Forever** via local open weights (Gemma 2) |
| **Grief Dignity** | Monetized through ads, tracking, and push notifications | **Zero Ads, Zero Tracking, Zero Notifications** |

---

## 🛠️ Tech Stack

- **Frontend Framework:** [React 19](https://react.dev/) + [Vite](https://vite.dev/) (Single Page Application, zero SSR overhead, pure client-side execution)
- **Language:** TypeScript
- **Styling & Aesthetics:** [Tailwind CSS](https://tailwindcss.com/), Framer Motion, Lucide React
- **Local AI Inference:**
  - Google Gemma 2 (2B / 9B) via WebGPU ([WebLLM](https://webllm.mlc.ai/))
  - Desktop Ollama fallback bridge (`http://localhost:11434/api/generate`)
- **Graphics & Particles:** HTML5 Canvas 2D / WebGL for dandelion physics, floating embers, and candle illumination
- **Audio Synthesis:** Native **Web Audio API** procedural acoustic guitar chords & atmospheric breeze (zero static audio assets)
- **Storage:** Offline browser database ([Dexie.js](https://dexie.org/) / IndexedDB) with client-side encryption
- **Deployment:** Production multi-stage `Dockerfile`, deployable to **Render** and **Vercel**

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18.18.0
- **npm** / **pnpm** / **yarn**
- *(Optional for Desktop AI)*: [Ollama](https://ollama.com/) with `ollama run gemma2:2b`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/harshitraj1236/dandelions.git
   cd dandelions
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env.local
   ```
   *(Optional settings for local Ollama host, default model selection, etc.)*

4. **Launch development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```text
dandelions/
├── public/                 # Static branding, service worker, audio assets
├── src/
│   ├── components/         # Modular React UI components
│   │   ├── altar/          # Ofrenda tiers, candle shaders, offerings
│   │   ├── particles/      # Canvas dandelion seed dispersion physics
│   │   ├── audio/          # Procedural ambient sound generator
│   │   └── ai/             # Gemma prompt interface & story weaver
│   ├── views/              # Main application views/tabs
│   │   ├── Sanctuary.tsx   # Hero & peaceful sanctuary view
│   │   ├── Ofrenda.tsx     # Interactive Digital Altar builder
│   │   ├── Memories.tsx    # Oral history recording & memory archive
│   │   ├── Ritual.tsx      # "Release to the Wind" dandelion ritual
│   │   └── TimeCapsule.tsx # USB Time Capsule generator & export
│   ├── lib/
│   │   ├── ai/             # Ollama client & WebLLM WebGPU pipeline
│   │   ├── audio/          # Web Audio API soundscape synthesis
│   │   └── storage/        # IndexedDB schemas & time capsule packaging
│   ├── types/              # TypeScript definitions for memories, altars, offerings
│   ├── App.tsx             # Root React application shell & navigation
│   └── main.tsx            # Vite React entrypoint
├── index.html              # HTML entrypoint
├── vite.config.ts          # Vite build & plugin configuration
├── Dockerfile              # Production multi-stage Nginx container
└── README.md               # Project documentation
```

---

## 🎯 Hacktoberfest 2026 Target Prize Tracks

- 🏆 **Overall Winner ($250):** The definitive open-source response to the *Ghost in the Machine* theme—honoring past spirits with dignity, beauty, and privacy.
- 🏆 **Best Use of Gemma ($200):** Running Google's lightweight Gemma 2 model locally to weave intimate, empathetic biographical narratives without leaking private memories.
- 🏆 **Best Use of Render ($200):** Containerized multi-stage Docker deployment optimized for blazing-fast edge performance.

---

## 🤝 Contributing

Contributions are welcome! Please check out our [Contributing Guidelines](CONTRIBUTING.md) and submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <sub>Built with remembrance and marigold petals for Hacktoberfest 2026 🌼</sub>
</div>

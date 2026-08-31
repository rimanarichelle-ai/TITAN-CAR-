# TITAN CARS — Vehicle Rental & Fleet Management Platform

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

**TITAN CARS** is a production-ready, highly responsive vehicle rental platform operating in Boufarik, Blida, and providing 24/7 express delivery to Algiers Houari Boumediene Airport. The system includes an interactive fleet showcase, 3D interactive hero showcase, online reservation system, WhatsApp instant click-to-chat integration, customer reviews, and an internal CRM / inventory management drawer.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v20.x or higher
- **npm**: v10.x or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/titan-cars.git
   cd titan-cars
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Set your environment variables in `.env.local` (e.g. `GEMINI_API_KEY`).

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router, Standalone Mode)
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS v4, PostCSS, Lucide Icons
- **Animations & 3D**: Motion (`motion/react`), Three.js (`three`)
- **State & Storage**: React Context + LocalStorage persistence (`InventoryProvider`)
- **Type Safety**: Zod schema validation (`zod`)
- **AI Integrations**: `@google/genai` TypeScript SDK (Server-side API proxy)

---

## 📁 Project Architecture

```
titan-cars/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root HTML Layout & Provider wrappers
│   ├── page.tsx                # Main Landing Page
│   └── globals.css             # Tailwind CSS imports
├── components/                 # UI Components
│   ├── 3d/                     # Three.js 3D Vehicle Showcase Canvas
│   ├── admin/                  # CRM & Inventory Management Drawer
│   ├── booking/                # Vehicle Reservation Modal
│   ├── faq/                    # Frequently Asked Questions Accordion
│   ├── filters/                # Fleet Search & Category Filters
│   ├── forms/                  # Inquiry & Appointment Modals
│   ├── hero/                   # Hero Showcase Banner
│   ├── layout/                 # Header, Navigation, Footer
│   ├── reviews/                # Verified Customer Reviews
│   ├── ui/                     # Titan Logo SVG, Buttons, Floating WhatsApp
│   └── vehicles/               # Fleet Cards, Grid, Detail Modal & Featured Section
├── config/                     # Tenant & Company Configuration
│   └── tenant/                 # Company Branding & Localization Configs
├── lib/                        # Core Utilities & State
│   ├── db/                     # Initial Vehicles & Reviews Mock Data
│   ├── store/                  # InventoryContext & LocalStorage Persistence Engine
│   └── utils.ts                # Image Sanitization, Currency & WhatsApp Helpers
├── public/                     # Static Web Assets
│   ├── logo.svg                # Vector Logos & Mark Icons
│   ├── image_bf2ade.jpg        # Studio Background Assets
│   └── vehicles/               # Local High-Res Vehicle Photos (Clio 5, Golf 8, Tucson, G-Class, etc.)
├── types/                      # TypeScript Interface Definitions
├── .env.example                # Environment Variables Template
├── .gitignore                  # Git Ignore Rules
├── next.config.ts              # Next.js Build Configuration
├── package.json                # Project Dependencies & Scripts
└── tsconfig.json               # TypeScript Compiler Configuration
```

---

## ⚙️ Environment Variables

The project uses `.env.example` as a template.

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Server-side API key for Google Gemini model requests | Optional |
| `APP_URL` | Application origin URL (`http://localhost:3000`) | Optional |

---

## 📦 Scripts

- `npm run dev`: Starts Next.js development server.
- `npm run build`: Compiles production build with type checking.
- `npm run start`: Starts production Node server.
- `npm run lint`: Runs ESLint code quality checks.

---

## 📄 License

Private / Proprietary — All Rights Reserved.

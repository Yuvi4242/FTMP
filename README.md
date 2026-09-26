# FridgeAI — AI Fridge-to-Meal Planner for Solo Dwellers

A production-grade mobile application and AI backend engineered specifically for solo dwellers (students, bachelors, working professionals) to eliminate food waste, automatically detect ingredients via camera scanning, and cook fast single-serving meals.

---

## 📱 Architecture Overview

```
FTMP/
├── mobile/                      # React Native + Expo + TypeScript
│   ├── App.tsx                  # Root app entry with SafeAreaProvider & Status bar
│   ├── app.json                 # Expo config & Camera permissions
│   └── src/
│       ├── api/                 # Axios client with fallback demo caching
│       ├── constants/           # DESIGN.md theme tokens (Strict 14px radii, #111827 canvas)
│       ├── types/               # Full TypeScript data contracts
│       ├── stores/              # Zustand state stores (Auth, Inventory, Recipes, Grocery)
│       ├── components/          # Reusable UI widgets & 14px ActionButton (never pill)
│       ├── screens/             # 15 Complete Screens matching approved Stitch designs
│       └── navigation/          # Root Stack & 5-tab Bottom Navigation
├── server/                      # Node.js + Express + TypeScript + REST
│   ├── src/
│   │   ├── config/              # Resilient MongoDB connection + In-Memory fallback
│   │   ├── controllers/         # Auth, Inventory, Scan, Recipe, Meal, Grocery, User
│   │   ├── middleware/          # JWT auth + Demo user fallback
│   │   ├── routes/              # Modular Express routes
│   │   ├── services/            # Vision detection, recipe engine, pre-seeded store
│   │   └── types/               # Server-side TypeScript interfaces
│   └── dist/                    # Compiled production JS
└── .stitch/                     # Stitch design system & screen mockups
```

---

## 🎨 Zero-Tolerance Design Rules Enforced

* **Dark Theme Palette**: `#111827` main canvas, `#1F2937` card surfaces, `#374151` borders.
* **Warm Orange Accent**: `#FF6B35` primary brand color.
* **Strict Button Radius**: **14px rounded rectangle (`rounded-[14px]`)** across all buttons and interactive elements — **zero pill-shaped buttons**.
* **Zero Emojis**: 100% SVG line icons via `lucide-react-native`.
* **Zero Purple Gradients**: Pure, calibrated dark tones.
* **No EM Dashes (`—`)**: Clean, direct typography.
* **Real Features Only**: No fake reviews, no fake metrics, no AI slop copy.

---

## 🚀 Key Features

1. **AI Vision Fridge Scanner**: Live camera viewfinder and gallery upload with bounding box segmentation, ingredient detection, and shelf-life estimation.
2. **3-Tier Expiry Management**:
   * **Critical (Red)**: Expiring today or tomorrow.
   * **Soon (Amber)**: 2 to 3 days remaining.
   * **Fresh (Green)**: 4+ days remaining.
3. **Single-Serving Recipe Recommendations**:
   * Prioritizes expiring ingredients to achieve 100% zero food waste.
   * Interactive portion scaler (1 serving default with automatic ingredient re-calculation).
   * Exact macro breakdowns (Calories, Protein, Carbs, Fat).
4. **Distraction-Free Cooking Mode**:
   * Step-by-step full-screen instructions with ingredient lists per step.
   * Built-in interactive countdown timers with play, pause, and reset controls.
   * Professional solo chef tips for perfect sear and flavor without leftovers.
5. **Smart Grocery List**:
   * 1-tap addition of missing recipe ingredients.
   * **Transfer Checked to Pantry**: Instantly transfers bought groceries into your active pantry inventory.
6. **Zero-Waste Impact Analytics**:
   * Cumulative money saved counter (e.g. $18.70 saved).
   * Total expiring ingredients rescued count.
   * Real cooked meal log with Zero Waste badges.

---

## 🛠️ Quick Start

### 1. Run the Backend API Server
```bash
cd server
npm install
npm run build
npm start
```
The server will start at `http://localhost:5000` with the health check available at `http://localhost:5000/api/health`.

### 2. Run the Mobile App
```bash
cd mobile
npm install
npx expo start
```
* Press `a` to open in Android Emulator / Device.
* Press `w` to open in Web Browser.
* Press `i` to open in iOS Simulator (macOS only).

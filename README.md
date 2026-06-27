# VN Mapper 📍

VN Mapper is a monorepo-based React Native mobile application and Node.js Express API that solves the notorious navigation challenges in Vietnamese cities. Specifically, it tackles **nested alleyways (Hẻm)**, where addresses like `252/45/14/7 Nguyễn Trãi` represent deep hierarchical branches (Main Number / Alley 1 / Alley 2 / House Number) that are difficult to locate using traditional maps.

By rendering custom alleyway routes, pinpointing exact door-to-door markers, visual facade gates, metadata tags (such as alley width constraints), and building floor plans, VN Mapper makes nested navigation effortless.

---

## 🏗️ Project Architecture

This project is configured as a `pnpm` monorepo:

```
vn-mapper/
├── apps/
│   ├── api/            # Express.js REST API backend
│   └── mobile/         # Expo React Native mobile client
├── packages/
│   └── core/           # Shared core logic (parsing, schemas, mock data)
├── pnpm-workspace.yaml
└── package.json
```

### 1. `packages/core`
Houses the core address parsing algorithms and mock databases.
- **Address Parsing & Formatting**: Contains highly optimized helper functions to breakdown and canonicalize Vietnamese nested formats:
  - `parseVietnamHouseNumber(address)`: Splits address strings like `252/45/14/7` into distinct parts (`mainNumber`, `alleys`, `houseNumber`).
  - `formatVietnamHouseNumber(parsed)`: Formats parsed structures back into standard format.
- **Tests & Benchmarks**: Complete unit test coverage using Jest (`address.test.ts`) and micro-benchmarking using Vitest (`address.bench.ts`) to ensure sub-millisecond parsing overhead.

### 2. `apps/api`
A Node.js Express backend serving spatial routes and houses.
- **REST Endpoints**: Exposes endpoints such as `GET /api/routes` for alley paths and `GET /api/houses` (with support for type filtering, pagination, and toggleable bookmarking).
- **Static Asset Serving**: Serves custom AI-generated facade images and office building layout blueprints under `/public`.
- **Security & Performance**: Hardened with `helmet` headers, `morgan` logger, and `express-rate-limit` rate-limiting.

### 3. `apps/mobile`
An Expo React Native mobile application built on Expo SDK 54, React 19, and Tailwind-based styling via NativeWind.
- **Map Renderer**: Integrates `react-native-maps` to render alley polylines and custom high-contrast markers (Circle for residential, Rounded-Square for offices).
- **Floating HUD Card**: A glassmorphic top-screen card showing alley specs (`🛵 Hẻm Xe Máy` etc.) and active mock navigation guidance updates.
- **Interactive Routing ("Dẫn đường")**: Clicking navigate dynamically draws a dashed green route path directly from the alley entrance to the destination.
- **Facade Bottom Sheet**: Powered by `@gorhom/bottom-sheet`, revealing house gate photos, metadata tags (width limits, security status), and scrollable floor plans for office towers.

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js**: `v20` or higher
- **pnpm**: installed globally (`npm i -g pnpm`)
- **Expo Go**: installed on a physical device or emulator (matching SDK 54)

### 💻 Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd vn-mapper
   ```

2. Install all dependencies across the workspace:
   ```bash
   pnpm install
   ```

---

## 🏃 Running the Services

For local development, you must run both the API backend and the Mobile Metro bundler.

### 1. Start the API Server
Start the Express server on port `3001`. The backend runs with hot-reload via `ts-node`:
```bash
cd apps/api
pnpm run dev
```

### 2. Start the Mobile Client
Start the Expo packager. Make sure to run it with `--clear` to clear bundler cache:
```bash
cd apps/mobile
pnpm start --clear
```

Scan the generated QR code using your **Expo Go** app on iOS or Android.

---

## 🧪 Testing & Benchmarks

To execute testing suites or benchmark the performance of the core parsing logic:

### Run Unit Tests
Executes Jest unit tests on the shared algorithms and API endpoints:
```bash
# In packages/core
pnpm test

# In apps/api
pnpm test
```

### Run Performance Benchmarks
Executes Vitest benchmarks to test parsing efficiency under load:
```bash
# In packages/core
pnpm bench
```

---

## 📡 API Reference

### Health Check
- `GET /health` -> Returns `200 OK` health status.

### Route Coordinates
- `GET /api/routes` -> Returns list of lat/lng coordinates representing the alley path.

### House Listings
- `GET /api/houses` -> Returns all houses.
  - **Query Params**:
    - `type`: `'house' | 'office'` (Filters by type)
    - `limit`: `number` (Default `20`, max `100`)
    - `offset`: `number` (For pagination)
- `GET /api/houses/:id` -> Returns a single house.
- `POST /api/houses/:id/bookmark` -> Toggles the bookmark status.
- `POST /api/houses/:id/report` -> Submits a mock address correction report.

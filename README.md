# WMS-FE (Warehouse Management System Frontend)

## Tech Stack
- Frontend: Vue 3, TypeScript
- Build: Vite
- Styling: Tailwind CSS
- HTTP: Custom axios wrapper (`src/services/http.ts`)
- Router: Vue Router
## Project Structure
```
<!-- src/
├── page/        # Feature pages (order, auth, dispatch, report)
├── shared/      # Shared services, utils, types
├── layouts/     # UI layouts
├── services/    # Core HTTP, error handling
├── constants/   # App constants
└── stores/      # state -->
```
## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run dev server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
## Scripts
- `npm run dev` - Development with hot reload
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run type-check` - TypeScript check
Open http://localhost:5173 after running `npm run dev`.
## Environment Variables

### Required for Geocoding (geocode.maps.co)
Create `.env.development`:
```
VITE_GEOCODEMAP_API_KEY=your_api_key_here
```
1. Sign up at [geocode.maps.co](https://geocode.maps.co/)
2. Get free API key
3. Paste above (don't commit `.env*` - in `.gitignore`)
4. Restart dev server

See `env.d.ts` for all Vite env types.
Optional: `VITE_API_BASE_URL=your_backend_url`




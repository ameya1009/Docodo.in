# Docodo.in Platform

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: CSS Modules + CSS Variables (Premium Dark Theme)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Project Structure
- `src/app`: Page routes and layouts
- `src/components/ui`: Reusable UI components (Button, Card)
- `src/components/layout`: Navbar, Footer, Dashboard Sidebar
- `src/components/sections`: Marketing page sections

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Deployment

### Vercel (Frontend)
1. Push this repository to GitHub.
2. Import project into Vercel.
3. Deploy. (No special config needed).

## Environment Variables
Create a `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```
(Currently using mocked data, so not strictly required for MVP demo).

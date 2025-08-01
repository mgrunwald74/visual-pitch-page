# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based marketing website for "Münchner Energie Agentur" (Munich Energy Agency) targeting chimney sweeps as potential partners. The project is built with modern web technologies including Vite, TypeScript, React, shadcn/ui, and Tailwind CSS.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:8080)
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Architecture & Technology Stack

### Core Technologies
- **React 18** with TypeScript
- **Vite** as build tool and development server
- **React Router DOM** for client-side routing
- **Tailwind CSS** for styling with custom design tokens
- **shadcn/ui** component library with Radix UI primitives

### Key Dependencies
- `@tanstack/react-query` for data fetching and state management
- `lucide-react` for icons
- `react-hook-form` with `zod` for form validation
- `sonner` for toast notifications
- `embla-carousel-react` for carousels
- `recharts` for data visualization

### Project Structure
```
src/
├── components/ui/          # shadcn/ui components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── pages/                  # Page components
│   ├── Index.tsx          # Main landing page
│   └── NotFound.tsx       # 404 page
├── App.tsx                # Root component with routing
├── main.tsx               # Application entry point
└── index.css              # Global styles
```

## Styling & Design System

### Custom Brand Colors
- **Brand Green**: `#10B981` (emerald-500) with light/dark variants
- **Brand Blue**: `#0EA5E9` (sky-500) with light/dark variants  
- **Brand Teal**: `#14B8A6` (teal-500) with dark variant

### Typography
- Default font family: Poppins (Google Fonts)
- Uses Tailwind's responsive typography classes

### Component Architecture
- Uses shadcn/ui components extensively
- Custom utility function `cn()` for className merging (clsx + tailwind-merge)
- Responsive design with mobile-first approach

## Key Features

### Landing Page (Index.tsx)
- Hero section with profile integration
- Two partnership variants (A: Self-service, B: Referral partner)
- Benefits comparison table with responsive design
- Smooth scrolling navigation
- Mobile hamburger menu
- Intersection Observer for scroll animations

### Responsive Design
- Desktop: Traditional table layout for benefits comparison
- Mobile: Card-based layout for better UX
- Animated elements with CSS transforms and opacity changes

## Development Notes

### Code Conventions
- Uses TypeScript with relaxed compiler options (noImplicitAny: false)
- Functional components with hooks
- Event handlers follow naming convention: `handle[Action]`
- Responsive design patterns using Tailwind breakpoints

### Animation System
- Custom fade-in-up animations defined in Tailwind config
- Intersection Observer for scroll-triggered animations
- CSS transitions for hover effects

### State Management
- React Query for server state (though currently no API calls)
- Local state with useState hooks
- No global state management library used

## Testing & Quality

The project uses ESLint for code quality but no test framework is currently configured. When adding tests, consider:
- Setting up Jest or Vitest
- React Testing Library for component tests
- Playwright or Cypress for E2E tests
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vibe Market** - A P2P marketplace connecting developers and clients for development module trading. The platform covers all development areas including websites, mobile apps, AI, blockchain, and more.

**Language**: Korean (for UI/UX and user-facing content)
**Documentation**: English (for technical documentation and code)

## Quick Start

```bash
# Install dependencies
npm install

# Development with Turbopack (fast refresh)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Tech Stack

- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: CSS Modules (vanilla CSS, modular approach)
- **State**: React Context API (planned)
- **Auth**: NextAuth.js with GitHub OAuth (planned)
- **Data**: JSON mock data for prototyping
- **Payment**: Virtual point system

## Current Project Structure

```
/src
  /app
    /(main)              # Main layout group
      /page.tsx          # Homepage
      /marketplace       # Marketplace pages
        /page.tsx        # Marketplace main page
      /requests          # Request board pages
        /page.tsx        # Requests main page
    /api                 # API routes (empty - to be implemented)
    /auth                # Authentication pages
      /page.tsx          # Auth page
    /globals.css         # Global styles
    /layout.tsx          # Root layout
    /favicon.ico         # Favicon
    
  /components
    /common              # Common/shared components
      /ModuleCarousel    # Reusable module carousel
        /ModuleCarousel.tsx
        /ModuleCarousel.module.css
    /layout              # Layout components
      /Header            # Header component folder
        /Header.tsx      # Header component
        /Header.module.css # Header styles
      /Footer            # Footer component folder
        /Footer.tsx      # Footer component
        /Footer.module.css # Footer styles
    /main                # Main page components (each in its own folder)
      /Hero              # Hero section
        /Hero.tsx
        /Hero.module.css
      /CategoryNav       # Category navigation
        /CategoryNav.tsx
        /CategoryNav.module.css
      /PopularComponents # Popular modules showcase
        /PopularComponents.tsx
        /PopularComponents.module.css
      /CategoryModules   # Category-based module display
        /CategoryModules.tsx
        /CategoryModules.module.css
      /RecentRequests    # Recent requests section
        /RecentRequests.tsx
        /RecentRequests.module.css
      /HowItWorks        # How it works section
        /HowItWorks.tsx
        /HowItWorks.module.css
      /Trust             # Trust indicators section
        /Trust.tsx
        /Trust.module.css
      /CTA               # Call to action section
        /CTA.tsx
        /CTA.module.css
    
  /styles
    /common              # Common styles (DO NOT DELETE)
      /reset.css         # Browser reset styles
      /utilities.css     # Utility classes
      /variables.css     # CSS variables (colors, spacing, etc.)

/data
  /mock                  # JSON mock data
    /users.json          # User data
    /requests.json       # Request data
    /components.json     # Component/module data

/config                  # Configuration files
  /fees.js               # Fee configuration

/public                  # Static assets
  /*.svg                 # SVG icons and images
```

## Folder Classification Guide

### `/src/app` - Next.js App Router
- **Purpose**: Pages and routing
- **Structure**:
  - `/(main)/`: Route group for main layout pages
  - `/api/`: API route handlers
  - `/auth/`: Authentication related pages
- **Files**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- **Naming**: Folder names define routes, use kebab-case

### `/src/components` - React Components
- **Purpose**: Reusable UI components
- **Structure**: Each component MUST be in its own folder with:
  - `ComponentName.tsx` - Component file
  - `ComponentName.module.css` - Component styles
- **Categories**:
  - `common/`: Shared components used across multiple pages
  - `layout/`: Page layout components (Header, Footer, Sidebar)
  - `main/`: Homepage specific components
  - `marketplace/`: Marketplace page components (to be added)
  - `requests/`: Request board components (to be added)

### `/src/styles/common` - Global Styles
- **Purpose**: Application-wide styles only
- **Files**:
  - `reset.css`: Browser style normalization
  - `utilities.css`: Reusable utility classes
  - `variables.css`: CSS custom properties
- **Note**: DO NOT DELETE - contains essential global styles
- **Important**: Component-specific styles belong in component folders, NOT here

### `/data/mock` - Mock Data
- **Purpose**: JSON files simulating backend data
- **Files**: JSON files for different data models
- **Usage**: Import and use in components/API routes during development

### `/config` - Configuration
- **Purpose**: Application configuration files
- **Examples**: `fees.js` (transaction fees), `constants.js`, `routes.js`

### `/public` - Static Assets
- **Purpose**: Publicly accessible files
- **Files**: Images, fonts, favicons, robots.txt
- **Access**: Files available at root URL (e.g., `/favicon.ico`)

### Future Folders (Not Yet Created):
- `/src/lib`: Utility functions and helpers
- `/src/hooks`: Custom React hooks
- `/src/types`: TypeScript type definitions
- `/src/contexts`: React Context providers

## Core MVP Features

### 1. User System
- Simple signup/login
- GitHub OAuth integration
- Profile management
- Virtual point balance

### 2. Request Board (Two Types)

#### Fixed Price Request
- Requester specifies exact budget
- Developers can apply immediately
- Quick matching process

#### Auction-Style Request
- For requesters unsure about pricing
- Developers compete through bidding
- Deposit system to prevent false bids

#### Urgent Request (Premium)
- 24-48 hour deadline
- Additional fee for top placement
- Priority matching

### 3. Module Marketplace
- **8 Main Categories**: 
  - 웹사이트 (Website)
  - 모바일 앱 (Mobile App)
  - 이커머스 (E-commerce)
  - AI/ML
  - 백엔드/API (Backend/API)
  - 블록체인 (Blockchain)
  - 데이터 분석 (Data Analysis)
  - DevOps
- Detailed information and demos
- Simple purchase process
- Code delivery via GitHub links

### 4. Trust System
- Automatic GitHub profile integration
- Post-transaction reviews and ratings
- Bid deposit system
- Transaction history

## Business Model

### Fee Structure (Flexibly Adjustable)
```javascript
// config/fees.js
export const feeConfig = {
  platformFee: 0.05,    // Base transaction fee 5%
  urgentFee: 0.02,      // Urgent request additional 2%
  bidDepositRate: 0.01  // Bid deposit 1%
}
```

### Revenue Sources
1. **Transaction Fees**: 5-10% of all transactions
2. **Urgent Request Premium**: Top placement fees
3. **Deposit System**: Partial fee on cancellations

## Mock Data Structure

```javascript
// data/mock/users.json
{
  "users": [{
    "id": 1,
    "email": "user@example.com",
    "name": "John Developer",
    "githubId": "johndev",
    "balance": 10000
  }]
}

// data/mock/requests.json
{
  "requests": [{
    "id": 1,
    "userId": 1,
    "title": "Need login component",
    "type": "FIXED_PRICE",
    "budget": 50000,
    "isUrgent": false,
    "status": "OPEN"
  }]
}

// data/mock/components.json
{
  "components": [{
    "id": 1,
    "name": "AI 챗봇 엔진",
    "price": 120000,
    "category": "ai",
    "tags": ["Python", "LangChain", "GPT-4"],
    "githubUrl": "https://github.com/...",
    "rating": 4.9,
    "purchases": 89
  }]
}
```

## Development Workflow & Conventions

### Component Structure
```typescript
// 1. imports
import styles from './Component.module.css';

// 2. types/interfaces
interface ComponentProps {
  // props definition
}

// 3. component
export default function Component({ props }: ComponentProps) {
  // hooks
  // handlers
  // render
}
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `PopularComponents.tsx`)
- **Styles**: Component.module.css (e.g., `Hero.module.css`)
- **Utilities**: camelCase (e.g., `formatPrice.ts`)
- **Types**: camelCase with .types.ts (e.g., `user.types.ts`)

### CSS Writing Rules
- Use CSS Modules for component styles
- Each component has its own module.css file in the same folder
- Global styles go in `/src/styles/common/`
- No BEM naming needed (CSS Modules handle scoping)
- Use CSS variables from `variables.css` for consistency

### State Management Plan
- **User Context**: Authentication state and user data
- **Request Context**: Request board management
- **Cart Context**: Purchase flow for marketplace
- **UI Context**: Global UI state (modals, notifications)

## Development Status

### ✅ Completed
- Project structure with modular components
- Homepage layout with all sections
- Responsive design implementation
- Mock data structure
- Component modularization
- CSS Modules setup

### 🔄 In Progress
- Context API implementation
- API routes with mock data
- Authentication flow

### 📋 To Do
- Marketplace page
- Request board page
- User profile page
- Payment flow
- Real-time features

## Important Implementation Notes

- **CSS Modules**: Every component has its own .module.css file in the same folder
- **No CSS-in-JS**: Use only CSS Modules, no styled-components or emotion
- **Path alias**: `@/*` maps to `./src/*`
- **Mock data**: Simulate realistic delays (300-800ms) and error states
- **GitHub delivery**: All code deliveries use GitHub URLs, no direct uploads
- **Modular structure**: Each component is self-contained with its styles
- **Type safety**: Use TypeScript interfaces for all props and data
- **Responsive design**: Mobile-first approach with breakpoints
- **Korean UI**: All user-facing text should be in Korean
- **Component folders**: Each component lives in its own folder with its styles

## Common Commands Reference

```bash
# Create new component folder
mkdir -p src/components/[category]/[ComponentName]

# Run development server
npm run dev

# Check for linting errors
npm run lint

# Build for production
npm run build

# Run production server
npm start
```

## Phase 2 Features (Future)

- Maintenance contract system
- Code review service
- Developer level/badge system
- Advanced search and filtering
- Real payment system integration
- Real-time chat
- CI/CD integration
- Email notifications
- Analytics dashboard
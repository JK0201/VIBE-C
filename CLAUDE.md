# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Vibe Market** - A P2P marketplace connecting developers and clients for development module trading. The platform covers all development areas including websites, mobile apps, AI, blockchain, and more.

**Language**: Korean (for UI/UX and user-facing content)
**Documentation**: English (for technical documentation and code)

### Key Features
- **Module Marketplace**: Buy and sell pre-built development modules
- **Request Board**: Post development requests (fixed-price or auction-style)
- **Tester Recruitment**: Find beta testers for your projects (NEW)
- **Trust System**: GitHub integration, ratings, and transaction history
- **Virtual Currency**: Point-based payment system

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
        /[id]/page.tsx   # Module detail page
      /requests          # Request board pages
        /page.tsx        # Requests main page
        /[id]/page.tsx   # Request detail page
      /testers           # Tester recruitment pages (NEW)
        /page.tsx        # Testers main page
        /[id]/page.tsx   # Tester detail page
    /api                 # API routes (empty - to be implemented)
    /auth                # Authentication pages
      /login/page.tsx    # Login page
      /signup/page.tsx   # Signup page
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
    /marketplace         # Marketplace page components
      /MarketplaceHero   # Hero section
      /CategoryFilter    # Category filtering
      /FilterSidebar     # Advanced filters
      /SearchControls    # Search and sort
      /ModuleGrid        # Module cards grid
    /requests            # Request board components
      /RequestsHero      # Hero section
      /RequestsFilter    # Request filters
      /RequestsSearchControls # Search and sort
      /RequestsList      # Request listings
    /testers             # Tester recruitment components (NEW)
      /TestersHero       # Hero section
      /TestersFilter     # Test type filters
      /TestersSearchControls # Search and sort
      /TestersList       # Tester job listings
    
  /lib                   # Utility functions
    /formatDate.ts       # Date formatting utilities
    
  /styles
    /common              # Common styles (DO NOT DELETE)
      /reset.css         # Browser reset styles
      /utilities.css     # Utility classes
      /variables.css     # CSS variables (colors, spacing, etc.)

/data
  /mock                  # JSON mock data
    /users.json          # User data (31 users)
    /requests.json       # Request data (20 requests)
    /components.json     # Component/module data (20 modules)
    /testers.json        # Tester recruitment data (NEW)

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
- Simple signup/login (UI complete)
- GitHub OAuth integration (UI ready)
- Profile management
- Virtual point balance

### 2. Request Board (Two Types)

#### Fixed Price Request
- Requester specifies exact budget
- Developers can apply immediately
- Quick matching process
- Application tracking

#### Auction-Style Request (Blind Auction)
- For requesters unsure about pricing
- Developers compete through bidding
- **Blind auction system**: bid amounts hidden from other bidders
- Shows only bid count and messages
- Deposit system to prevent false bids

#### Urgent Request (Premium)
- 24-48 hour deadline
- Additional fee for top placement
- Priority matching
- Visual urgency indicators

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
- Advanced filtering (price, language, rating)
- Search functionality
- Sort options (latest, popular, rating, price)
- Detailed module pages with tabs
- Code delivery via GitHub links

### 4. Tester Recruitment (NEW)
- Companies post testing projects
- Test types: functional, UI/UX, performance, security
- Reward-based system (points)
- Applicant tracking
- Deadline management

### 5. Trust System
- Automatic GitHub profile integration
- Post-transaction reviews and ratings
- Bid deposit system
- Transaction history
- Verified badges (planned)

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
- Mock data structure and integration
- Component modularization
- CSS Modules setup
- Marketplace pages (listing + detail)
- Request board pages (listing + detail)
- Tester recruitment pages (NEW)
- Authentication UI (login/signup pages)
- Advanced filtering and search
- Blind auction system
- Responsive design for all pages
- Data consistency improvements

### 🔄 Next Phase: State Management
- Zustand installation and setup
- User authentication store
- Cart/purchase flow store
- UI state management (modals, notifications)
- Filter persistence across navigation

### 📋 To Do
- API routes implementation
- NextAuth.js integration
- Database connection
- Payment processing
- Real-time features (WebSocket)
- Email notifications
- User profile pages
- Admin dashboard

## Important Implementation Notes

- **CSS Modules**: Every component has its own .module.css file in the same folder
- **No CSS-in-JS**: Use only CSS Modules, no styled-components or emotion
- **Path aliases**: 
  - `@/*` maps to `./src/*`
  - `@data/*` maps to `./data/*`
- **Mock data**: Simulate realistic delays (300-800ms) and error states
- **GitHub delivery**: All code deliveries use GitHub URLs, no direct uploads
- **Modular structure**: Each component is self-contained with its styles
- **Type safety**: Use TypeScript interfaces for all props and data
- **Responsive design**: Mobile-first approach with breakpoints
- **Korean UI**: All user-facing text should be in Korean
- **Component folders**: Each component lives in its own folder with its styles
- **Currency**: Points (P) not Won (₩)
- **Terminology**: "가격" (price) not "예산" (budget)

## Development Workflow & Best Practices

### Recommended Development Order

#### Phase 1: UI/UX Design ✅ (Current Phase - 90% Complete)
- Build all pages with mock data
- Implement responsive design
- Create consistent styling system
- Ensure smooth user flows
- **Status**: Nearly complete, minor refinements ongoing

#### Phase 2: State Management (Next Phase)
- Install Zustand for global state
- Implement authentication store
- Create cart/purchase flow store
- Add UI state management (modals, toasts)
- Persist filter states across navigation
- **Why before API**: Establishes data flow patterns early

#### Phase 3: Component Modularization
- Extract common components (Button, Modal, Card, Avatar)
- Create shared form components
- Standardize loading/error states
- Build reusable filter components
- **Why before API**: Clean component interfaces make API integration easier

#### Phase 4: API Integration
- Implement Next.js API routes
- Connect to database (PostgreSQL/Prisma recommended)
- Add data validation with Zod
- Implement error handling
- Add loading states
- **Why last**: All UI/UX decisions are finalized

### Security Considerations

#### 1. Blind Auction Security
- **Current Issue**: Bid amounts visible in network payload
- **Solution**: 
  - Separate API endpoints for bidders vs requesters
  - Server-side filtering of sensitive data
  - JWT tokens to verify user roles
  - Never send all bid data to client

#### 2. Authentication Security
- Use NextAuth.js with secure session handling
- Implement CSRF protection
- Secure cookie settings (httpOnly, secure, sameSite)
- Rate limiting on auth endpoints
- Email verification for new accounts

#### 3. Payment Security
- Never store actual payment info
- Use established payment gateways
- Implement transaction logs
- Add payment confirmation flows
- Escrow system for dispute resolution

#### 4. Data Protection
- Input validation on all forms
- SQL injection prevention (use ORMs)
- XSS protection (sanitize user content)
- File upload restrictions
- API rate limiting

#### 5. Code Delivery Security
- Verify GitHub URLs
- No direct file uploads
- Scan for malicious code patterns
- Version control for delivered modules
- License verification

### State Management Architecture

```typescript
// Proposed Zustand store structure
stores/
├── useAuthStore.ts      // User auth, profile, balance
├── useCartStore.ts      // Shopping cart for modules
├── useUIStore.ts        // Modals, notifications, loading
├── useFilterStore.ts    // Persist filters across pages
└── useRequestStore.ts   // Request creation flow
```

### API Architecture Planning

```
/api
├── auth/
│   ├── login
│   ├── signup
│   └── [...nextauth]
├── modules/
│   ├── index        // GET: list, POST: create
│   └── [id]         // GET: detail, PUT: update
├── requests/
│   ├── index        // GET: list, POST: create
│   ├── [id]/
│   │   ├── index    // GET: detail
│   │   ├── apply    // POST: apply/bid
│   │   └── bids     // GET: bids (filtered by role)
├── users/
│   └── [id]/
│       ├── profile
│       └── balance
└── payments/
    ├── charge
    └── withdraw
```

### Performance Considerations

1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Dynamic imports for heavy components
3. **Data Fetching**: Implement proper caching strategies
4. **Bundle Size**: Monitor and optimize dependencies
5. **SEO**: Implement proper meta tags and structured data

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
- AI-powered code quality checks
- Automated testing integration
- Multi-language support
- Mobile app (React Native)

## Recent Updates (2025-07-03)

### UI/UX Improvements
1. **Blind Auction System**: Implemented true blind bidding where bid amounts are hidden
2. **Consistent Card Styling**: Unified appearance across all listing pages
3. **Profile Alignment**: Fixed vertical centering of avatars and text
4. **Data Consistency**: Expanded mock data to 31 users with proper references
5. **Currency Change**: Changed from Won (₩) to Points (P) system
6. **Gradient Theme**: Purple gradient buttons and accents throughout

### New Features Added
1. **Tester Recruitment Board**: Complete new section for finding beta testers
2. **Expired Request Handling**: Proper status display and disabled buttons
3. **Sort Order Update**: Marketplace now starts with "최신순" (latest first)
4. **Improved Filtering**: More granular filters across all listing pages
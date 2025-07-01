# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

```bash
# Development with Turbopack (fast refresh)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Architecture Overview

Vibe Market is a P2P marketplace for developers to buy/sell components and request custom features. The project is in early development stage with a basic Next.js setup that needs to be built according to the planned architecture.

### Tech Stack
- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: CSS Modules (vanilla CSS, modular approach)
- **Data**: JSON mock data for prototyping
- **Auth**: Planned NextAuth.js with GitHub OAuth
- **Payment**: Virtual point system

### Planned Directory Structure
```
/src
  /app
    /api         # API routes
    /auth        # Authentication pages
    /marketplace # Component marketplace
    /requests    # Request board
  /components    # Reusable components
  /lib          # Utilities
  /styles       # CSS modules
    /components  # Component-specific styles
    /pages      # Page-specific styles
    /common     # Shared styles
/data
  /mock         # JSON mock data
/config        # Configuration files
```

## Key Features to Implement

### 1. Request System
- **Fixed Price**: Direct budget specification with immediate applications
- **Auction-Style**: Bidding system with deposit requirements
- **Urgent Requests**: 24-48 hour deadline with premium placement

### 2. Component Marketplace
- Category-based listings
- GitHub URL delivery
- Demo/preview functionality

### 3. Trust & Payment
- GitHub profile integration
- Virtual points system
- Transaction fee structure (configurable in config/fees.js)

## Mock Data Structure

The project uses JSON mock data with these schemas:

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
    "name": "Auth Component",
    "price": 30000,
    "category": "authentication",
    "githubUrl": "https://github.com/..."
  }]
}
```

## Development Workflow

The project follows a 4-step implementation plan:

1. **Structure & Configuration**: Set up directories, CSS modules, mock data
2. **UI/UX Development**: Build components and page layouts
3. **State Management**: Implement Context API for user, requests, cart, and UI state
4. **Mock API Layer**: Create API routes with localStorage CRUD operations

## Important Implementation Notes

- Use CSS Modules for all styling (no CSS-in-JS libraries)
- Path alias configured: `@/*` maps to `./src/*`
- Mock data should simulate realistic delays and error states
- Fee configuration should remain flexible and easily adjustable
- All component deliveries use GitHub URLs (no direct file uploads)
- Maintain modular component structure for easy reusability
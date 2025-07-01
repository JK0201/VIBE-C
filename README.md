# Vibe Market - Component P2P Marketplace

## Project Overview
A P2P marketplace connecting developers and customers. Users can request custom features or purchase pre-built components.
language: Korean

## Core MVP Features (Phase 1)

### 1. User System
- Simple signup/login
- GitHub OAuth integration
- Profile management

### 2. Request Board (Two Types)

#### Fixed Price Request
- Requester specifies budget
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

### 3. Component Marketplace
- Component listings by category
- Detailed information and demos
- Simple purchase process
- Code delivery via GitHub links

### 4. Trust System
- Automatic GitHub profile integration
- Post-transaction reviews and ratings
- Bid deposit system

## Technical Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Vanilla CSS (Modular)
- **State**: React Context API
- **Auth**: NextAuth.js

### Backend
- **API**: Next.js API Routes
- **Data Storage**: JSON Mock Data (Prototype)
- **File Storage**: GitHub links
- **Payment**: Virtual point system

### Project Structure
```
  /vibe_market (Next.js project)
    /src
      /app
        /api         # API routes
        /auth        # Authentication pages
        /marketplace # Marketplace
        /requests    # Request board
      /components    # Common components
      /lib          # Utilities
      ~/style~s       # CSS modules
        /components  # Component CSS
        /pages      # Page CSS
        /common     # Common CSS
    /data
      /mock          # JSON mock data files
    /config         # Configuration files
    package.json
    next.config.ts
```

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

## Data Management (Prototype)

### Mock Data Structure
```javascript
// data/mock/users.json
{
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "name": "John Developer",
      "githubId": "johndev",
      "balance": 10000
    }
  ]
}

// data/mock/requests.json
{
  "requests": [
    {
      "id": 1,
      "userId": 1,
      "title": "Need login component",
      "type": "FIXED_PRICE",
      "budget": 50000,
      "isUrgent": false,
      "status": "OPEN"
    }
  ]
}

// data/mock/components.json
{
  "components": [
    {
      "id": 1,
      "name": "Auth Component",
      "price": 30000,
      "category": "authentication",
      "githubUrl": "https://github.com/..."
    }
  ]
}
```

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Development Workflow

### Step 1: Project Structure & Configuration
- Set up folder structure following the project architecture
- Configure CSS module system for modular styling
- Create mock data files with sample content in `/data/mock` directory
- Set up environment variables and configuration files

### Step 2: UI/UX Development
#### Common Components
- Header with navigation
- Card components for requests and marketplace items
- Form elements (buttons, inputs, selects)
- Modal components for bidding/purchasing

#### Page Layouts
- Landing page with feature highlights
- Request board with list and detail views
- Component marketplace with grid layout
- Authentication pages (login/signup)

#### Mock Data Integration
- Import and display mock data statically
- Create various UI states (empty, loading, error)
- Implement responsive design

### Step 3: State Management & Interactions
#### Context Setup
- User Context for authentication state
- Request Context for managing requests and bids
- Cart Context for purchase flow
- UI Context for modals and notifications

#### Interactive Features
- Filter and sort functionality
- Fixed price application flow
- Auction bidding simulation
- Component purchase simulation
- Urgent request highlighting

### Step 4: Mock API Layer
#### API Routes Implementation
- Create API endpoints returning mock data
- Implement CRUD operations with localStorage
- Add realistic delays to simulate network calls
- Error state simulation for testing

#### Frontend Integration
- Replace static imports with API calls
- Implement loading states
- Add error handling and retry logic
- Toast notifications for user actions

## Phase 2 (Future Plans)
- Maintenance contract system
- Code review service
- Developer level/badge system
- Advanced search and filtering
- Real payment system integration
- Real-time chat
- CI/CD integration

## License
MIT
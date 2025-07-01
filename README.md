# Vibe Market - Development Module P2P Marketplace

## Project Overview
개발자와 고객을 연결하는 P2P 마켓플레이스. 웹사이트, 모바일 앱, AI, 블록체인 등 모든 개발 영역의 모듈을 거래하는 플랫폼.
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

### 3. Module Marketplace
- 8개 주요 카테고리: 웹사이트, 모바일 앱, 이커머스, AI/ML, 백엔드/API, 블록체인, 데이터 분석, DevOps
- 상세 정보 및 데모 제공
- 간단한 구매 프로세스
- GitHub 링크를 통한 코드 전달

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
      /app              # Next.js App Router pages
        /api           # API routes
        /auth          # Authentication pages
        /marketplace   # Marketplace pages
        /requests      # Request board pages
      /components      # Reusable components
        /common        # Common UI components
        /home          # Homepage specific components
        /layout        # Layout components (Header, Footer)
        /marketplace   # Marketplace components
        /requests      # Request board components
      /lib             # Utilities & helpers
      /styles          # CSS modules
        Home.module.css    # Homepage styles
        globals.css        # Global styles
      /types           # TypeScript type definitions
    /data
      /mock            # JSON mock data files
        categories.json
        components.json
        requests.json
        users.json
    /config            # Configuration files
    /public            # Static assets
    package.json
    next.config.ts
    tsconfig.json
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
      "name": "AI 챗봇 엔진",
      "price": 120000,
      "category": "ai",
      "tags": ["Python", "LangChain", "GPT-4"],
      "githubUrl": "https://github.com/...",
      "rating": 4.9,
      "purchases": 89
    }
  ],
  "categories": [
    {
      "id": "website",
      "name": "웹사이트",
      "icon": "🌐"
    },
    // ... 8개 카테고리
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

## Development Workflow & Conventions

### 코딩 컨벤션

#### 1. 컴포넌트 구조
```typescript
// 컴포넌트는 기능별로 폴더 분리
/components
  /home         # 페이지별 컴포넌트
  /common       # 공통 컴포넌트
  /layout       # 레이아웃 컴포넌트
```

#### 2. 파일 명명 규칙
- 컴포넌트: PascalCase (예: `PopularComponents.tsx`)
- 스타일: camelCase with .module.css (예: `Home.module.css`)
- 유틸리티: camelCase (예: `formatPrice.ts`)

#### 3. CSS 작성 규칙
- CSS Modules 사용
- 컴포넌트별 스타일 분리
- 재사용 가능한 스타일은 globals.css에 정의
- BEM 네이밍 불필요 (CSS Modules가 스코프 처리)

#### 4. 컴포넌트 작성 규칙
```typescript
// 1. imports
import styles from '@/styles/Component.module.css';

// 2. types/interfaces
interface ComponentProps {
  // props 정의
}

// 3. 컴포넌트
export default function Component({ props }: ComponentProps) {
  // hooks
  // handlers
  // render
}
```

#### 5. 데이터 관리
- Mock 데이터는 `/data/mock`에 JSON 파일로 관리
- 타입 정의는 `/types`에 별도 관리
- API 호출은 `/lib/api`에 함수로 분리

### Development Steps (완료 상태)

### ✅ Step 1: Project Structure & Configuration
- 프로젝트 구조 설정 완료
- CSS Module 시스템 구성
- Mock 데이터 파일 생성
- 환경 설정 완료

### ✅ Step 2: UI/UX Development
#### 구현 완료 컴포넌트
- Header 컴포넌트 (로그인/회원가입 버튼)
- Hero 섹션 (메인 배너)
- CategoryNav (8개 카테고리 네비게이션)
- PopularComponents (인기 모듈 showcase)
- RecentRequests (최신 개발 요청)

#### 페이지 레이아웃
- 홈페이지 레이아웃 완성
- 반응형 디자인 적용
- 컬러풀한 플레이풀 디자인 테마

### 🔄 Step 3: State Management & Interactions (진행 예정)
#### Context 설정 필요
- User Context (인증 상태)
- Request Context (요청 관리)
- Cart Context (구매 플로우)

### 🔄 Step 4: Mock API Layer (진행 예정)
#### API Routes 구현
- Mock 데이터 반환 엔드포인트
- localStorage를 활용한 CRUD
- 네트워크 지연 시뮬레이션

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
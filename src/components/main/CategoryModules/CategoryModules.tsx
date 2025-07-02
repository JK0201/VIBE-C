'use client';

import { useState } from 'react';
import styles from './CategoryModules.module.css';
import ModuleCarousel from '@/components/common/ModuleCarousel/ModuleCarousel';

const categories = [
  { id: 'website', name: '웹사이트', icon: '🌐' },
  { id: 'mobile', name: '모바일 앱', icon: '📱' },
  { id: 'ecommerce', name: '이커머스', icon: '🛒' },
  { id: 'ai', name: 'AI/ML', icon: '🤖' },
  { id: 'backend', name: '백엔드/API', icon: '⚙️' },
  { id: 'blockchain', name: '블록체인', icon: '⛓️' },
  { id: 'data', name: '데이터 분석', icon: '📊' },
  { id: 'devops', name: 'DevOps', icon: '🔧' },
];

interface Module {
  id: number;
  title: string;
  description: string;
  tags: string[];
  price: number;
  rating: number;
  downloads: number;
  gradient: string;
  icon: string;
}

const modulesByCategory: Record<string, Module[]> = {
  website: [
    {
      id: 1,
      title: '모던 랜딩페이지 템플릿',
      description: 'Next.js 기반 반응형 랜딩페이지. 애니메이션 효과...',
      tags: ['Next.js', 'TailwindCSS', 'Framer Motion'],
      price: 85000,
      rating: 4.8,
      downloads: 156,
      gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      icon: '🎨'
    },
    {
      id: 2,
      title: '관리자 대시보드 UI',
      description: 'React 기반 관리자 페이지 템플릿. 차트, 테이블...',
      tags: ['React', 'Ant Design', 'Recharts'],
      price: 120000,
      rating: 4.9,
      downloads: 234,
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
      icon: '📊'
    },
    {
      id: 3,
      title: '이커머스 프론트엔드',
      description: '완벽한 쇼핑몰 프론트엔드. 장바구니, 결제...',
      tags: ['Vue.js', 'Vuex', 'Stripe'],
      price: 150000,
      rating: 4.7,
      downloads: 189,
      gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
      icon: '🛍️'
    },
    {
      id: 4,
      title: '블로그 테마 컬렉션',
      description: 'Gatsby 기반 SEO 최적화 블로그. 다크모드 지원...',
      tags: ['Gatsby', 'GraphQL', 'MDX'],
      price: 65000,
      rating: 4.6,
      downloads: 342,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: '📝'
    },
    {
      id: 5,
      title: '블로그 테마 컬렉션',
      description: 'Gatsby 기반 SEO 최적화 블로그. 다크모드 지원...',
      tags: ['Gatsby', 'GraphQL', 'MDX'],
      price: 65000,
      rating: 4.6,
      downloads: 342,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: '📝'
    }
  ],
  mobile: [
    {
      id: 5,
      title: 'React Native 푸시알림 시스템',
      description: '크로스플랫폼 푸시 알림 통합 솔루션. FCM, APNs 연동...',
      tags: ['React Native', 'FCM', 'TypeScript'],
      price: 65000,
      rating: 4.7,
      downloads: 145,
      gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
      icon: '📱'
    },
    {
      id: 6,
      title: 'Flutter 소셜 미디어 앱',
      description: '완성도 높은 소셜 앱 템플릿. 피드, 채팅, 프로필...',
      tags: ['Flutter', 'Firebase', 'GetX'],
      price: 180000,
      rating: 4.9,
      downloads: 267,
      gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      icon: '👥'
    }
  ],
  ai: [
    {
      id: 7,
      title: 'AI 챗봇 엔진',
      description: 'GPT 기반 고급 챗봇 시스템. 한국어 특화, 컨텍스트 관리...',
      tags: ['Python', 'LangChain', 'GPT-4'],
      price: 120000,
      rating: 4.9,
      downloads: 89,
      gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      icon: '🤖'
    },
    {
      id: 8,
      title: '이미지 생성 AI 래퍼',
      description: 'Stable Diffusion API 래퍼. 프롬프트 최적화...',
      tags: ['Python', 'FastAPI', 'Stable Diffusion'],
      price: 95000,
      rating: 4.8,
      downloads: 156,
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
      icon: '🎨'
    }
  ],
  backend: [
    {
      id: 9,
      title: '마이크로서비스 인증 게이트웨이',
      description: 'MSA 환경을 위한 통합 인증/인가 시스템. JWT, OAuth2...',
      tags: ['Node.js', 'JWT', 'Kong'],
      price: 95000,
      rating: 4.9,
      downloads: 234,
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
      icon: '⚙️'
    }
  ],
  blockchain: [
    {
      id: 10,
      title: 'DeFi 스마트 컨트랙트 템플릿',
      description: '이더리움/폴리곤용 DeFi 컨트랙트. 스테이킹, 스왑...',
      tags: ['Solidity', 'Hardhat', 'Web3'],
      price: 150000,
      rating: 4.9,
      downloads: 89,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: '⛓️'
    }
  ]
};

export default function CategoryModules() {
  const [selectedCategory, setSelectedCategory] = useState('website');
  
  const modules = modulesByCategory[selectedCategory] || [];
  
  // 각 모듈에 카테고리 정보 추가
  const modulesWithCategory = modules.map(module => ({
    ...module,
    category: categories.find(cat => cat.id === selectedCategory)?.name || ''
  }));

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <section className={styles.categoryModules}>
      <div className={styles.categoryModulesContent}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleIcon}>🛍️</span>
          모듈 스토어
        </h2>
        <div className={styles.categoryTabs}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryTab} ${selectedCategory === category.id ? styles.activeTab : ''}`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <ModuleCarousel 
          modules={modulesWithCategory}
          showCategory={true}
          itemsPerPage={4}
        />
        
        <div className={styles.viewMore}>
          <a href="#" className={styles.viewMoreLink}>
            모든 모듈 둘러보기
            <span className={styles.moreArrow}>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
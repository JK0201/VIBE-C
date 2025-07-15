'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CategoryModules.module.css';
import ModuleCarousel from '@/components/common/ModuleCarousel/ModuleCarousel';

const categories = [
  { id: 'sns', name: 'SNS', icon: '💬' },
  { id: 'automation', name: 'Automation', icon: '🔧' },
  { id: 'web-app', name: 'Web/App', icon: '🌐' },
  { id: 'mobile', name: 'Mobile', icon: '📱' },
  { id: 'ui-ux', name: 'UI/UX', icon: '🎨' },
  { id: 'data', name: 'Data', icon: '📊' },
  { id: 'ai-ml', name: 'AI/ML', icon: '🤖' },
  { id: 'fintech', name: 'Fintech', icon: '💰' },
  { id: 'b2b', name: 'B2B', icon: '🏢' },
];

interface APIModule {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  purchases: number;
  tags: string[];
  gradient: string;
  icon: string;
}

// Mock data type that matches carousel requirements
interface MockModule {
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

const modulesByCategory: Record<string, MockModule[]> = {
  'web-app': [
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
  'ai-ml': [
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
  'b2b': [
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
  'fintech': [
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
  ],
  'sns': [
    {
      id: 11,
      title: 'WordPress 블로그 테마',
      description: 'SEO 최적화된 프리미엄 워드프레스 테마. 반응형...',
      tags: ['WordPress', 'PHP', 'SEO'],
      price: 65000,
      rating: 4.7,
      downloads: 234,
      gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      icon: '💬'
    },
    {
      id: 12,
      title: '소셜 미디어 자동 포스팅',
      description: 'Instagram, Twitter 동시 포스팅 자동화 도구...',
      tags: ['Python', 'API', 'Automation'],
      price: 75000,
      rating: 4.5,
      downloads: 189,
      gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
      icon: '📱'
    }
  ],
  'ui-ux': [
    {
      id: 13,
      title: 'React UI 컴포넌트',
      description: '모던 디자인 시스템 기반 UI 컴포넌트 세트...',
      tags: ['React', 'Storybook', 'Design System'],
      price: 98000,
      rating: 4.9,
      downloads: 456,
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
      icon: '🎨'
    },
    {
      id: 14,
      title: 'Figma to React 변환기',
      description: 'Figma 디자인을 React 컴포넌트로 자동 변환...',
      tags: ['Figma', 'React', 'Automation'],
      price: 120000,
      rating: 4.8,
      downloads: 312,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: '🖌️'
    }
  ],
  'automation': [
    {
      id: 15,
      title: 'Kubernetes 자동 배포',
      description: 'GitOps 기반 K8s 자동 배포 파이프라인...',
      tags: ['Kubernetes', 'ArgoCD', 'GitOps'],
      price: 110000,
      rating: 4.6,
      downloads: 178,
      gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      icon: '🔧'
    },
    {
      id: 16,
      title: 'Terraform AWS 모듈',
      description: '프로덕션 레디 AWS 인프라 템플릿...',
      tags: ['Terraform', 'AWS', 'IaC'],
      price: 125000,
      rating: 4.9,
      downloads: 145,
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
      icon: '☁️'
    }
  ]
};

// Define carousel-compatible module type
interface CarouselModule {
  id: number;
  category?: string;
  title: string;
  description: string;
  tags: string[];
  price: number;
  rating: number;
  downloads?: number;
  purchases?: number;
  gradient: string;
  icon: string;
}

export default function CategoryModules() {
  const [selectedCategory, setSelectedCategory] = useState('web-app');
  const [modules, setModules] = useState<CarouselModule[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryModules = async () => {
      setLoading(true);
      
      try {
        const response = await fetch(`/api/v1/modules/by-category?category=${selectedCategory}&limit=5`);
        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }
        const data = await response.json();
        if (data.success) {
          // Transform API data to match carousel component expectations
          const transformedModules = data.data.map((module: APIModule) => ({
            ...module,
            title: module.name, // API has 'name', carousel expects 'title'
            downloads: module.purchases, // API has 'purchases', carousel expects 'downloads'
            category: categories.find(cat => cat.id === selectedCategory)?.name || ''
          }));
          setModules(transformedModules);
        } else {
          throw new Error(data.error || 'Failed to fetch modules');
        }
      } catch {
        // Fallback to mock data on error
        const fallbackModules = modulesByCategory[selectedCategory] || [];
        setModules(fallbackModules.map(module => ({
          ...module,
          category: categories.find(cat => cat.id === selectedCategory)?.name || ''
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryModules();
  }, [selectedCategory]);

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
        
        {loading ? (
          <div className={styles.loadingContainer}>
            <p>모듈을 불러오는 중...</p>
          </div>
        ) : (
          <ModuleCarousel 
            modules={modules}
            showCategory={true}
          />
        )}
        
        <div className={styles.viewMore}>
          <Link href="/marketplace" className={styles.viewMoreLink}>
            모든 모듈 둘러보기
            <span className={styles.moreArrow}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
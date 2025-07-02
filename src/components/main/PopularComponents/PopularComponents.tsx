'use client';

import styles from './PopularComponents.module.css';
import ModuleCarousel from '@/components/common/ModuleCarousel/ModuleCarousel';

const popularComponents = [
  {
    id: 1,
    category: 'AI/ML',
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
    id: 2,
    category: '백엔드/API',
    title: '마이크로서비스 인증 게이트웨이',
    description: 'MSA 환경을 위한 통합 인증/인가 시스템. JWT, OAuth2...',
    tags: ['Node.js', 'JWT', 'Kong'],
    price: 95000,
    rating: 4.9,
    downloads: 234,
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
    icon: '⚙️'
  },
  {
    id: 3,
    category: '모바일 앱',
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
    id: 4,
    category: '블록체인',
    title: 'DeFi 스마트 컨트랙트 템플릿',
    description: '이더리움/폴리곤용 DeFi 컨트랙트. 스테이킹, 스왑...',
    tags: ['Solidity', 'Hardhat', 'Web3'],
    price: 150000,
    rating: 4.9,
    downloads: 89,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: '⛓️'
  },
  {
    id: 5,
    category: 'AI/ML',
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
    id: 6,
    category: 'AI/ML',
    title: 'AI 챗봇 엔진',
    description: 'GPT 기반 고급 챗봇 시스템. 한국어 특화, 컨텍스트 관리...',
    tags: ['Python', 'LangChain', 'GPT-4'],
    price: 120000,
    rating: 4.9,
    downloads: 89,
    gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    icon: '🤖'
  },{
    id: 7,
    category: 'AI/ML',
    title: 'AI 챗봇 엔진',
    description: 'GPT 기반 고급 챗봇 시스템. 한국어 특화, 컨텍스트 관리...',
    tags: ['Python', 'LangChain', 'GPT-4'],
    price: 120000,
    rating: 4.9,
    downloads: 89,
    gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    icon: '🤖'
  },{
    id: 8,
    category: 'AI/ML',
    title: 'AI 챗봇 엔진',
    description: 'GPT 기반 고급 챗봇 시스템. 한국어 특화, 컨텍스트 관리...',
    tags: ['Python', 'LangChain', 'GPT-4'],
    price: 120000,
    rating: 4.9,
    downloads: 89,
    gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
    icon: '🤖'
  },
];

export default function PopularComponents() {
  return (
    <section className={styles.popularComponents}>
      <div className={styles.popularContent}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>🔥</span>
            인기 모듈
          </h2>
          <p className={styles.sectionSubtitle}>
            고객이 가장 많이 찾는 검증된 솔루션
          </p>
        </div>
        <ModuleCarousel 
          modules={popularComponents}
          showCategory={true}
          itemsPerPage={4}
        />
      </div>
    </section>
  );
}
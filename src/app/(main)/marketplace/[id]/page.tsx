'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ImageGallery from '@/components/common/ImageGallery/ImageGallery';
import DetailPageSkeleton from '@/components/common/DetailPageSkeleton/DetailPageSkeleton';
import { Module, User } from '@/types';
import useCartStore, { hydrateCartStore } from '@/stores/useCartStore';
import useUIStore from '@/stores/useUIStore';
import useAuthStore from '@/stores/useAuthStore';
import styles from './page.module.css';
import usersData from '@data/mock/users.json';

export default function ComponentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [component, setComponent] = useState<Module | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'reviews'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  
  const { addItem, items } = useCartStore();
  const { showToast } = useUIStore();
  const { user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate cart store on client side
  useEffect(() => {
    hydrateCartStore();
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const fetchComponent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/v1/modules/${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          setComponent(data.data);
          const foundSeller = usersData.users.find(u => u.id === data.data.sellerId);
          setSeller(foundSeller || null);
        }
      } catch {
        // Handle error silently
      } finally {
        setIsLoading(false);
      }
    };

    fetchComponent();
  }, [params.id]);

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (!component) {
    return (
      <div className={styles.notFound}>
        <h2>모듈을 찾을 수 없습니다</h2>
        <Link href="/marketplace" className={styles.backLink}>
          마켓플레이스로 돌아가기
        </Link>
      </div>
    );
  }

  // API response already includes categoryDisplay
  const getCategoryDisplay = () => {
    if (component && 'categoryDisplay' in component) {
      return (component as { categoryDisplay: { name: string } }).categoryDisplay.name;
    }
    // Fallback for old data
    return component?.category || '';
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/">홈</Link>
        <span>/</span>
        <Link href="/marketplace">마켓플레이스</Link>
      </div>

      <div className={styles.content}>
        <div className={styles.mainSection}>
          <div className={styles.header}>
            <div className={styles.categoryBadge}>
              {getCategoryDisplay()}
            </div>
            <h1 className={styles.title}>{component.name}</h1>
            <p className={styles.description}>{component.description}</p>
            
            <div className={styles.tags}>
              {component.tags.map(tag => (
                <span key={tag} className={styles.tag}>#{tag}</span>
              ))}
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>{component.rating}</span>
              </div>
              <div className={styles.stat}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 3h18v18H3V3z" strokeWidth="2"/>
                  <path d="M9 9h6v6H9V9z" strokeWidth="2"/>
                </svg>
                <span>{component.purchases}개 판매</span>
              </div>
              <div className={styles.stat}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>{component.comments}개 리뷰</span>
              </div>
            </div>
            {component.images && component.images.length > 0 && (
            <ImageGallery images={component.images} title={component.name} />
          )}
          </div>

          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              개요
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'features' ? styles.active : ''}`}
              onClick={() => setActiveTab('features')}
            >
              주요 기능
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'reviews' ? styles.active : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              리뷰
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'overview' && (
              <div className={styles.overview}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <h3>개발 언어</h3>
                    <p>{component.language}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <h3>프레임워크</h3>
                    <p>{component.framework}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <h3>라이선스</h3>
                    <p>{component.license}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <h3>최근 업데이트</h3>
                    <p>{new Date(component.updatedAt).toLocaleDateString('ko-KR')}</p>
                  </div>
                </div>

                <div className={styles.links}>
                  <a href={component.githubUrl} className={styles.linkButton} target="_blank" rel="noopener noreferrer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub 저장소
                  </a>
                  <a href={component.demoUrl} className={styles.linkButton} target="_blank" rel="noopener noreferrer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    데모 보기
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className={styles.features}>
                <ul className={styles.featureList}>
                  {component.features.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className={styles.reviews}>
                <p className={styles.noReviews}>리뷰 기능은 준비 중입니다.</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.priceCard}>
            <h3 className={styles.priceTitle}>가격 정보</h3>
            <div className={styles.price}>
              <span className={styles.priceAmount}>{component.price.toLocaleString()}P</span>
            </div>
            <button 
              className={styles.purchaseButton}
              onClick={() => {
                if (!user) {
                  showToast('로그인이 필요한 서비스입니다.', 'warning');
                  router.push('/auth/login');
                  return;
                }
                // Add to cart and go to cart page
                if (isHydrated && !items.find(item => item.moduleId === component.id)) {
                  addItem({
                    moduleId: component.id,
                    name: component.name,
                    price: component.price,
                    category: component.category,
                    sellerId: component.sellerId,
                    sellerName: seller?.nickname || `User #${component.sellerId}`
                  });
                }
                router.push('/cart');
              }}
            >
              구매하기
            </button>
            <button 
              className={styles.cartButton}
              onClick={() => {
                if (!user) {
                  showToast('로그인이 필요한 서비스입니다.', 'warning');
                  router.push('/auth/login');
                  return;
                }
                const isInCart = items.find(item => item.moduleId === component.id);
                if (isInCart) {
                  // If already in cart, go to cart page
                  router.push('/cart');
                } else {
                  // Add to cart
                  addItem({
                    moduleId: component.id,
                    name: component.name,
                    price: component.price,
                    category: component.category,
                    sellerId: component.sellerId,
                    sellerName: seller?.nickname || `User #${component.sellerId}`
                  });
                  // Show success message
                  showToast('장바구니에 추가되었습니다!', 'success');
                }
              }}
            >
              {isHydrated && items.find(item => item.moduleId === component.id) 
                ? '장바구니 보기' 
                : '장바구니에 담기'}
            </button>
          </div>

          {seller && (
            <div className={styles.sellerCard}>
              <h3 className={styles.sellerTitle}>판매자 정보</h3>
              <div className={styles.sellerInfo}>
                <div className={styles.sellerAvatar}>
                  {seller.nickname.charAt(0)}
                </div>
                <div className={styles.sellerDetails}>
                  <h4>{seller.nickname}</h4>
                  <p>@{seller.githubId}</p>
                </div>
              </div>
              {seller.bio && (
                <p className={styles.sellerBio}>{seller.bio}</p>
              )}
              <button className={styles.contactButton}>
                판매자에게 문의
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
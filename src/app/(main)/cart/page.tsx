'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useCartStore, { hydrateCartStore } from '@/stores/useCartStore';
import useAuthStore from '@/stores/useAuthStore';
import useUIStore from '@/stores/useUIStore';
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal';
import styles from './page.module.css';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, clearCart, getTotalPrice } = useCartStore();
  const { user } = useAuthStore();
  const { showToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Check authentication and hydrate cart store
  useEffect(() => {
    if (!user) {
      showToast('로그인이 필요한 서비스입니다.', 'warning');
      router.push('/auth/login');
      return;
    }
    
    hydrateCartStore();
    setIsHydrated(true);
    setIsLoading(false);
  }, [user, router, showToast]);

  // Store already has price information, no need to fetch again
  const totalPrice = getTotalPrice();

  if (isLoading || !isHydrated) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <p>장바구니를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/">홈</Link>
          <span>/</span>
          <span>장바구니</span>
        </div>
        <div className={styles.emptyCart}>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <h2>장바구니가 비어있습니다</h2>
          <p>마켓플레이스에서 필요한 모듈을 찾아보세요!</p>
          <Link href="/marketplace" className={styles.browseButton}>
            모듈 둘러보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/">홈</Link>
        <span>/</span>
        <span>장바구니</span>
      </div>
      <div className={styles.header}>
        <h1>장바구니</h1>
        <button 
          className={styles.clearButton}
          onClick={() => setShowClearConfirm(true)}
        >
          장바구니 비우기
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.itemsSection}>
          {items.map(item => {
            // Skip invalid items
            if (!item.price || !item.name) return null;
            
            return (
              <div key={item.moduleId} className={styles.cartItem}>
                <div className={styles.itemInfo}>
                  <Link href={`/marketplace/${item.moduleId}`} className={styles.itemTitle}>
                    {item.name || '상품명 없음'}
                  </Link>
                  <p className={styles.itemDescription}>{item.category} 모듈</p>
                  <div className={styles.itemMeta}>
                    <span className={styles.category}>
                      {item.category}
                    </span>
                    <span className={styles.seller}>
                      판매자: {item.sellerName || '알 수 없음'}
                    </span>
                  </div>
                </div>

                <div className={styles.itemActions}>
                  <div className={styles.price}>
                    {(item.price || 0).toLocaleString()}P
                  </div>
                  <button 
                    className={styles.removeButton}
                    onClick={() => removeItem(item.moduleId)}
                    aria-label="장바구니에서 제거"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h3>주문 요약</h3>
            
            <div className={styles.summaryDetails}>
              <div className={styles.summaryRow}>
                <span>상품 수</span>
                <span>{items.length}개</span>
              </div>
              <div className={styles.summaryRow}>
                <span>총 금액</span>
                <span className={styles.totalAmount}>
                  {totalPrice.toLocaleString()}P
                </span>
              </div>
            </div>

            <div className={styles.balance}>
              <div className={styles.balanceCalculation}>
                <div className={styles.calculationRow}>
                  <span className={styles.calculationLabel}>현재 잔액</span>
                  <span className={`${styles.calculationValue} ${styles.currentBalance}`}>
                    {user ? user.balance.toLocaleString() : 0}P
                  </span>
                </div>
                <div className={styles.calculationRow}>
                  <span className={styles.calculationLabel}>구매 금액</span>
                  <span className={`${styles.calculationValue} ${styles.totalAmount}`}>
                    {totalPrice.toLocaleString()}P
                  </span>
                </div>
                <div className={styles.calculationRow}>
                  <span className={styles.calculationLabel}>거래 후 잔액</span>
                  <span className={`${styles.calculationValue} ${
                    user && user.balance >= totalPrice ? styles.remainingBalance : styles.insufficient
                  }`}>
                    {user ? (user.balance - totalPrice).toLocaleString() : 0}P
                  </span>
                </div>
              </div>
              {user && user.balance < totalPrice && (
                <p className={styles.insufficientText}>
                  잔액이 부족합니다. 충전이 필요합니다.
                </p>
              )}
            </div>

            <button 
              className={styles.checkoutButton}
              disabled={!user || (user && user.balance < totalPrice)}
              onClick={() => {
                showToast('결제 기능은 준비 중입니다.', 'info');
              }}
            >
              {user && user.balance < totalPrice 
                ? '잔액 부족'
                : '결제하기'}
            </button>
          </div>

          <div className={styles.noticeCard}>
            <h4>구매 전 확인사항</h4>
            <ul>
              <li>모든 모듈은 GitHub 저장소를 통해 제공됩니다</li>
              <li>구매 후 환불은 불가능합니다</li>
              <li>라이선스 조건을 확인해주세요</li>
              <li>기술 지원은 판매자에게 문의하세요</li>
            </ul>
          </div>
        </div>
      </div>
      
      <ConfirmModal
        isOpen={showClearConfirm}
        title="장바구니 비우기"
        message="장바구니를 비우시겠습니까? 이 작업은 취소할 수 없습니다."
        confirmText="비우기"
        cancelText="취소"
        type="warning"
        onConfirm={() => {
          clearCart();
          showToast('장바구니를 비웠습니다.', 'success');
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
}
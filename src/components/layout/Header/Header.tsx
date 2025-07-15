'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/useAuthStore';
import useFilterStore from '@/stores/useFilterStore';
import useCartStore, { hydrateCartStore } from '@/stores/useCartStore';
import useUIStore from '@/stores/useUIStore';
import styles from './Header.module.css';

export default function Header() {
  const { data: session, status } = useSession();
  const { user, setUser, logout: zustandLogout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { items } = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate cart store on client side
  useEffect(() => {
    hydrateCartStore();
    setIsHydrated(true);
  }, []);

  // NextAuth 세션과 Zustand store 동기화
  useEffect(() => {
    if (session?.user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = session.user as any;
      setUser({
        id: user.id || '',
        email: user.email || '',
        name: user.name || '',
        image: user.image || undefined,
        role: user.role || 'user',
        balance: user.balance || 0,
        githubId: user.githubId || undefined,
      });
    } else if (status === 'unauthenticated') {
      zustandLogout();
    }
  }, [session, status, setUser, zustandLogout]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = async () => {
    zustandLogout(); // Zustand store 초기화
    useCartStore.getState().clearCartOnLogout(); // 장바구니 비우기
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
    closeMobileMenu();
  };

  const handleMobileNavClick = (resetFunction?: () => void) => {
    if (resetFunction) {
      resetFunction();
    }
    closeMobileMenu();
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContent}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoShape}>
            <div className={styles.logoInner}></div>
          </div>
          <span className={styles.logoText}>VIBE-C</span>
        </Link>
        <div className={styles.navLinks}>
          <Link 
            href="/requests" 
            className={styles.navLink}
            onClick={() => {
              const { resetRequestFilters } = useFilterStore.getState();
              resetRequestFilters();
            }}
          >
            개발 요청
          </Link>
          <Link 
            href="/marketplace" 
            className={styles.navLink}
            onClick={() => {
              const { resetMarketplaceFilters } = useFilterStore.getState();
              resetMarketplaceFilters();
            }}
          >
            모듈 스토어
          </Link>
          <Link 
            href="/testers" 
            className={styles.navLink}
            onClick={() => {
              const { resetTesterFilters } = useFilterStore.getState();
              resetTesterFilters();
            }}
          >
            테스터 모집
          </Link>
        </div>
        <div className={styles.navActions}>
          {session && (
            <Link href="/cart" className={styles.cartButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {isHydrated && items.length > 0 && (
                <span className={styles.cartCount}>{items.length}</span>
              )}
            </Link>
          )}
          {status === 'loading' ? (
            <div className={styles.loadingSpinner}></div>
          ) : session ? (
            <div className={styles.userMenu} ref={dropdownRef}>
              <button 
                className={styles.userButton}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className={styles.userAvatar}>
                  {session.user?.image ? (
                    <Image 
                      src={session.user.image} 
                      alt={session.user.name || ''} 
                      width={32} 
                      height={32}
                      style={{ borderRadius: '50%' }}
                    />
                  ) : (
                    <span>{session.user?.name?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <span className={styles.userName}>{session.user?.name}</span>
                <svg className={styles.chevron} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {showDropdown && (
                <div className={styles.dropdown}>
                  <Link href="/profile" className={styles.dropdownItem}>
                    내 프로필
                  </Link>
                  <Link href="/my-modules" className={styles.dropdownItem}>
                    내 모듈
                  </Link>
                  <Link href="/my-requests" className={styles.dropdownItem}>
                    내 요청
                  </Link>
                  <div className={styles.dropdownDivider}></div>
                  <div className={styles.balanceInfo}>
                    <span className={styles.balanceLabel}>포인트</span>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <span className={styles.balanceAmount}>{(user?.balance || (session.user as any)?.balance || 0).toLocaleString()}P</span>
                  </div>
                  <div className={styles.dropdownDivider}></div>
                  <button onClick={handleLogout} className={styles.logoutButton}>
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className={styles.loginBtn}>
                로그인
              </Link>
              <Link href="/auth/signup" className={styles.signupBtn}>
                회원가입
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="메뉴 열기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round"/>
            <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round"/>
            <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.active : ''}`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.active : ''}`}>
        <div className={styles.mobileMenuHeader}>
          <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
            <div className={styles.logoShape}>
              <div className={styles.logoInner}></div>
            </div>
            <span className={styles.logoText}>VIBE-C</span>
          </Link>
          <button 
            className={styles.mobileMenuClose}
            onClick={closeMobileMenu}
            aria-label="메뉴 닫기"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.mobileNavLinks}>
          <Link 
            href="/requests" 
            className={styles.mobileNavLink}
            onClick={() => handleMobileNavClick(useFilterStore.getState().resetRequestFilters)}
          >
            <span>📝</span> 개발 요청
          </Link>
          <Link 
            href="/marketplace" 
            className={styles.mobileNavLink}
            onClick={() => handleMobileNavClick(useFilterStore.getState().resetMarketplaceFilters)}
          >
            <span>🛍️</span> 모듈 스토어
          </Link>
          <Link 
            href="/testers" 
            className={styles.mobileNavLink}
            onClick={() => handleMobileNavClick(useFilterStore.getState().resetTesterFilters)}
          >
            <span>🧪</span> 테스터 모집
          </Link>
        </div>

        <div className={styles.mobileMenuDivider} />

        {session ? (
          <div className={styles.mobileUserSection}>
            <div className={styles.mobileUserInfo}>
              <div className={styles.userAvatar}>
                {session.user?.image ? (
                  <Image 
                    src={session.user.image} 
                    alt={session.user.name || ''} 
                    width={32} 
                    height={32}
                    style={{ borderRadius: '50%' }}
                  />
                ) : (
                  <span>{session.user?.name?.charAt(0) || 'U'}</span>
                )}
              </div>
              <span className={styles.userName}>{session.user?.name}</span>
            </div>
            
            <div className={styles.mobileBalanceInfo}>
              <span className={styles.balanceLabel}>포인트</span>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <span className={styles.balanceAmount}>{(user?.balance || (session.user as any)?.balance || 0).toLocaleString()}P</span>
            </div>

            <div className={styles.mobileNavLinks}>
              <Link 
                href="/cart" 
                className={styles.mobileNavLink}
                onClick={closeMobileMenu}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                장바구니 {isHydrated && items.length > 0 && `(${items.length})`}
              </Link>
              <Link 
                href="/profile" 
                className={styles.mobileNavLink}
                onClick={closeMobileMenu}
              >
                <span>👤</span> 내 프로필
              </Link>
              <Link 
                href="/my-modules" 
                className={styles.mobileNavLink}
                onClick={closeMobileMenu}
              >
                <span>📦</span> 내 모듈
              </Link>
              <Link 
                href="/my-requests" 
                className={styles.mobileNavLink}
                onClick={closeMobileMenu}
              >
                <span>📋</span> 내 요청
              </Link>
            </div>

            <div className={styles.mobileMenuDivider} />
            
            <button onClick={handleLogout} className={styles.logoutButton}>
              로그아웃
            </button>
          </div>
        ) : (
          <div className={styles.mobileAuthButtons}>
            <Link 
              href="/auth/login" 
              className={styles.loginBtn}
              onClick={closeMobileMenu}
            >
              로그인
            </Link>
            <Link 
              href="/auth/signup" 
              className={styles.signupBtn}
              onClick={closeMobileMenu}
            >
              회원가입
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
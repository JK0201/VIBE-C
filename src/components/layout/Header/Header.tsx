'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/useAuthStore';
import useFilterStore from '@/stores/useFilterStore';
import styles from './Header.module.css';

export default function Header() {
  const { data: session, status } = useSession();
  const { user, setUser, logout: zustandLogout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
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
      </div>
    </nav>
  );
}
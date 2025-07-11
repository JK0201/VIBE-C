'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuthStore from '@/stores/useAuthStore';
import styles from './layout.module.css';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Double-check admin role on client side
    if (user && user.role !== 'admin') {
      router.push('/403');
    }
  }, [user, router]);

  useEffect(() => {
    // Auto open sidebar on desktop
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { href: '/admin', label: '대시보드', icon: '📊' },
    { href: '/admin/users', label: '사용자 관리', icon: '👥' },
    { href: '/admin/modules', label: '모듈 관리', icon: '📦' },
    { href: '/admin/requests', label: '요청 관리', icon: '📝' },
    { href: '/admin/transactions', label: '거래 관리', icon: '💰' },
    { href: '/admin/audit-logs', label: '감사 로그', icon: '🔍' },
    { href: '/admin/reports', label: '리포트', icon: '📈' },
    { href: '/admin/settings', label: '설정', icon: '⚙️' },
  ];

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <button 
          className={styles.sidebarToggle}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="사이드바 토글"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 style={{ marginLeft: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>관리자 패널</h1>
      </header>

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>메뉴</h2>
          <p className={styles.adminName}>{user?.name || user?.email}</p>
          <button 
            className={styles.mobileCloseButton}
            onClick={() => setIsSidebarOpen(false)}
            aria-label="사이드바 닫기"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <nav className={styles.sidebarNav}>
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={styles.navItem}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.backToSite}>
            ← 사이트로 돌아가기
          </Link>
        </div>
      </aside>

      {isSidebarOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className={`${styles.adminMain} ${!isSidebarOpen ? styles.expanded : ''}`}>
        <div className={styles.adminContent}>
          {children}
        </div>
      </main>
    </div>
  );
}
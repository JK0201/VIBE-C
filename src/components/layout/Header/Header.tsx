import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
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
          <Link href="/requests" className={styles.navLink}>
            개발 요청
          </Link>
          <Link href="/marketplace" className={styles.navLink}>
            모듈 스토어
          </Link>
          <Link href="/testers" className={styles.navLink}>
            테스터 모집
          </Link>
        </div>
        <div className={styles.navActions}>
          <Link href="/auth/login" className={styles.loginBtn}>
            로그인
          </Link>
          <Link href="/auth/signup" className={styles.signupBtn}>
            회원가입
          </Link>
        </div>
      </div>
    </nav>
  );
}
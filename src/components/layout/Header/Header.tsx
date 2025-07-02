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
          <Link href="/developers" className={styles.navLink}>
            개발자 찾기
          </Link>
        </div>
        <div className={styles.navActions}>
          <button className={styles.loginBtn}>
            로그인
          </button>
          <button className={styles.signupBtn}>
            회원가입
          </button>
        </div>
      </div>
    </nav>
  );
}
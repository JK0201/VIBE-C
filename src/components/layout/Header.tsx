import styles from '@/styles/Home.module.css';

export default function Header() {
  return (
    <nav className={styles.nav}>
      <div className={styles.navContent}>
        <a href="/" className={styles.logo}>
          <div className={styles.logoShape}>
            <div className={styles.logoInner}></div>
          </div>
          <span className={styles.logoText}>VIBE-C</span>
        </a>
        <div className={styles.navLinks}>
          <a href="#" className={styles.navLink}>
            개발 요청
          </a>
          <a href="#" className={styles.navLink}>
            마켓플레이스
          </a>
          <a href="#" className={styles.navLink}>
            개발자 찾기
          </a>
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
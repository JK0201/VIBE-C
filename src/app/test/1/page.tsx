import styles from './page.module.css';

export default function Test1Page() {
  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <span className={styles.logoText}>Vibe Market</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#" className={styles.navLink}>요청 게시판</a>
            <a href="#" className={styles.navLink}>컴포넌트 마켓</a>
            <a href="#" className={styles.navLink}>개발자</a>
          </div>
          <div className={styles.navActions}>
            <button className={styles.loginBtn}>로그인</button>
            <button className={styles.signupBtn}>시작하기</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            개발자와 고객을 연결하는<br />
            <span className={styles.highlight}>컴포넌트 P2P 마켓플레이스</span>
          </h1>
          <p className={styles.heroDescription}>
            필요한 기능을 요청하거나, 검증된 컴포넌트를 구매하세요.<br />
            개발자라면 실력을 발휘하고 수익을 창출할 수 있습니다.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.primaryBtn}>컴포넌트 둘러보기</button>
            <button className={styles.secondaryBtn}>요청 등록하기</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.featuresContent}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>📝</div>
            <h3 className={styles.featureTitle}>맞춤형 요청</h3>
            <p className={styles.featureDesc}>
              원하는 기능을 상세히 요청하고<br />
              전문 개발자의 제안을 받아보세요
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>🛍️</div>
            <h3 className={styles.featureTitle}>검증된 컴포넌트</h3>
            <p className={styles.featureDesc}>
              즉시 사용 가능한 고품질<br />
              컴포넌트를 구매하세요
            </p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>💰</div>
            <h3 className={styles.featureTitle}>안전한 거래</h3>
            <p className={styles.featureDesc}>
              포인트 시스템과 에스크로로<br />
              안전하게 거래하세요
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        <div className={styles.statsContent}>
          <div className={styles.stat}>
            <div className={styles.statNumber}>1,234</div>
            <div className={styles.statLabel}>활성 개발자</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>5,678</div>
            <div className={styles.statLabel}>완료된 거래</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>98%</div>
            <div className={styles.statLabel}>만족도</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>지금 시작하세요</h2>
          <p className={styles.ctaDesc}>
            GitHub 계정으로 간편하게 시작할 수 있습니다
          </p>
          <button className={styles.ctaBtn}>GitHub로 시작하기</button>
        </div>
      </section>
    </div>
  );
}
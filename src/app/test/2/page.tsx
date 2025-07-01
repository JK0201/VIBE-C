import styles from './page.module.css';

export default function Test2Page() {
  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>⚡</div>
            <span className={styles.logoText}>Vibe Market</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#" className={styles.navLink}>
              <span className={styles.navLinkIcon}>📋</span>
              요청 게시판
            </a>
            <a href="#" className={styles.navLink}>
              <span className={styles.navLinkIcon}>🛒</span>
              마켓플레이스
            </a>
            <a href="#" className={styles.navLink}>
              <span className={styles.navLinkIcon}>👨‍💻</span>
              개발자
            </a>
          </div>
          <div className={styles.navActions}>
            <button className={styles.connectBtn}>
              <span className={styles.connectDot}></span>
              Connect GitHub
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.gridPattern}></div>
          <div className={styles.glowOrb1}></div>
          <div className={styles.glowOrb2}></div>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.badge}>🚀 Beta Launch</div>
          <h1 className={styles.heroTitle}>
            Build Faster with
            <span className={styles.glowText}> Premium Components</span>
          </h1>
          <p className={styles.heroDescription}>
            개발자와 고객을 연결하는 차세대 P2P 마켓플레이스<br />
            실시간 매칭, 안전한 거래, 검증된 품질
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>24h</span>
              <span className={styles.heroStatLabel}>평균 응답</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>5.0</span>
              <span className={styles.heroStatLabel}>평균 평점</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatValue}>99%</span>
              <span className={styles.heroStatLabel}>성공률</span>
            </div>
          </div>
          <div className={styles.heroActions}>
            <button className={styles.exploreBtn}>
              <span>Explore Market</span>
              <span className={styles.arrow}>→</span>
            </button>
            <button className={styles.demoBtn}>
              <span className={styles.playIcon}>▶</span>
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.features}>
        <div className={styles.featuresContent}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionTitleGradient}>Core Features</span>
          </h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIconBg}></div>
                <span className={styles.featureIcon}>⚡</span>
              </div>
              <h3 className={styles.featureTitle}>실시간 매칭</h3>
              <p className={styles.featureDesc}>
                AI 기반 스마트 매칭으로 최적의 개발자를 즉시 연결
              </p>
              <div className={styles.featureTags}>
                <span className={styles.tag}>Fast</span>
                <span className={styles.tag}>Smart</span>
              </div>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIconBg}></div>
                <span className={styles.featureIcon}>🔒</span>
              </div>
              <h3 className={styles.featureTitle}>안전한 에스크로</h3>
              <p className={styles.featureDesc}>
                완료 확인 후 지급되는 안전한 포인트 시스템
              </p>
              <div className={styles.featureTags}>
                <span className={styles.tag}>Secure</span>
                <span className={styles.tag}>Trusted</span>
              </div>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIconBg}></div>
                <span className={styles.featureIcon}>✨</span>
              </div>
              <h3 className={styles.featureTitle}>품질 보증</h3>
              <p className={styles.featureDesc}>
                GitHub 연동으로 검증된 개발자의 고품질 컴포넌트
              </p>
              <div className={styles.featureTags}>
                <span className={styles.tag}>Verified</span>
                <span className={styles.tag}>Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className={styles.process}>
        <div className={styles.processContent}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.sectionTitleGradient}>How It Works</span>
          </h2>
          <div className={styles.processSteps}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>01</div>
              <div className={styles.stepContent}>
                <h3>요청 등록</h3>
                <p>필요한 기능을 상세히 설명</p>
              </div>
              <div className={styles.stepLine}></div>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>02</div>
              <div className={styles.stepContent}>
                <h3>개발자 매칭</h3>
                <p>전문가들의 제안 받기</p>
              </div>
              <div className={styles.stepLine}></div>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>03</div>
              <div className={styles.stepContent}>
                <h3>안전한 거래</h3>
                <p>에스크로로 보호받는 결제</p>
              </div>
              <div className={styles.stepLine}></div>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>04</div>
              <div className={styles.stepContent}>
                <h3>전달 & 완료</h3>
                <p>코드 전달 및 평가</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <div className={styles.ctaGlow}></div>
          <h2 className={styles.ctaTitle}>Ready to Start?</h2>
          <p className={styles.ctaDesc}>
            Join thousands of developers and clients already using Vibe Market
          </p>
          <button className={styles.ctaBtn}>
            <span>Get Started Now</span>
            <span className={styles.ctaBtnGlow}></span>
          </button>
          <div className={styles.ctaFeatures}>
            <span className={styles.ctaFeature}>✓ No credit card required</span>
            <span className={styles.ctaFeature}>✓ Free to start</span>
            <span className={styles.ctaFeature}>✓ Cancel anytime</span>
          </div>
        </div>
      </section>
    </div>
  );
}
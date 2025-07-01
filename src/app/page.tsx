import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <div className={styles.logoShape}>
              <div className={styles.logoInner}></div>
            </div>
            <span className={styles.logoText}>Vibe Market</span>
          </div>
          <div className={styles.navLinks}>
            <a href="#" className={styles.navLink}>
              <div className={styles.navIcon}>🎯</div>
              요청하기
            </a>
            <a href="#" className={styles.navLink}>
              <div className={styles.navIcon}>🎨</div>
              컴포넌트
            </a>
            <a href="#" className={styles.navLink}>
              <div className={styles.navIcon}>🚀</div>
              개발자
            </a>
          </div>
          <div className={styles.navActions}>
            <button className={styles.notificationBtn}>
              <span className={styles.notificationIcon}>🔔</span>
              <span className={styles.notificationBadge}>3</span>
            </button>
            <button className={styles.startBtn}>
              무료로 시작하기 ✨
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroPattern}>
          <div className={styles.patternDot}></div>
          <div className={styles.patternDot}></div>
          <div className={styles.patternDot}></div>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <span className={styles.tagIcon}>🎉</span>
            오픈 베타 진행중!
          </div>
          <h1 className={styles.heroTitle}>
            당신의 아이디어를
            <br />
            <span className={styles.titleHighlight}>현실로 만들어드립니다</span>
          </h1>
          <p className={styles.heroDescription}>
            전문 개발자들이 당신의 프로젝트를 위한<br />
            맞춤형 컴포넌트를 제작해드립니다
          </p>
          <div className={styles.heroActions}>
            <button className={styles.primaryAction}>
              <span className={styles.actionIcon}>🛍️</span>
              컴포넌트 둘러보기
            </button>
            <button className={styles.secondaryAction}>
              <span className={styles.actionIcon}>💡</span>
              요청 등록하기
            </button>
          </div>
          <div className={styles.heroUsers}>
            <div className={styles.userAvatars}>
              <div className={styles.avatar} style={{backgroundColor: '#FF6B6B'}}>A</div>
              <div className={styles.avatar} style={{backgroundColor: '#4ECDC4'}}>B</div>
              <div className={styles.avatar} style={{backgroundColor: '#45B7D1'}}>C</div>
              <div className={styles.avatar} style={{backgroundColor: '#96CEB4'}}>D</div>
            </div>
            <span className={styles.userText}>
              <strong>1,234명</strong>의 개발자가 활동중
            </span>
          </div>
        </div>
        <div className={styles.heroIllustration}>
          <div className={styles.floatingCard} style={{top: '20%', left: '10%'}}>
            <span className={styles.cardIcon}>⚛️</span>
            <span className={styles.cardText}>React</span>
          </div>
          <div className={styles.floatingCard} style={{top: '60%', right: '15%'}}>
            <span className={styles.cardIcon}>💎</span>
            <span className={styles.cardText}>Vue</span>
          </div>
          <div className={styles.floatingCard} style={{bottom: '30%', left: '20%'}}>
            <span className={styles.cardIcon}>🅰️</span>
            <span className={styles.cardText}>Angular</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.categories}>
        <div className={styles.categoriesContent}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>🏆</span>
            인기 카테고리
          </h2>
          <div className={styles.categoryGrid}>
            <div className={styles.categoryCard} style={{backgroundColor: '#FFE8E8'}}>
              <div className={styles.categoryIcon}>🔐</div>
              <h3 className={styles.categoryName}>인증 & 보안</h3>
              <p className={styles.categoryCount}>234개 컴포넌트</p>
              <div className={styles.categoryTrend}>
                <span className={styles.trendIcon}>📈</span>
                <span className={styles.trendText}>+12%</span>
              </div>
            </div>
            <div className={styles.categoryCard} style={{backgroundColor: '#E8F4FF'}}>
              <div className={styles.categoryIcon}>📊</div>
              <h3 className={styles.categoryName}>데이터 시각화</h3>
              <p className={styles.categoryCount}>189개 컴포넌트</p>
              <div className={styles.categoryTrend}>
                <span className={styles.trendIcon}>📈</span>
                <span className={styles.trendText}>+8%</span>
              </div>
            </div>
            <div className={styles.categoryCard} style={{backgroundColor: '#F0E8FF'}}>
              <div className={styles.categoryIcon}>🛒</div>
              <h3 className={styles.categoryName}>이커머스</h3>
              <p className={styles.categoryCount}>156개 컴포넌트</p>
              <div className={styles.categoryTrend}>
                <span className={styles.trendIcon}>📈</span>
                <span className={styles.trendText}>+15%</span>
              </div>
            </div>
            <div className={styles.categoryCard} style={{backgroundColor: '#E8FFE8'}}>
              <div className={styles.categoryIcon}>💬</div>
              <h3 className={styles.categoryName}>커뮤니케이션</h3>
              <p className={styles.categoryCount}>142개 컴포넌트</p>
              <div className={styles.categoryTrend}>
                <span className={styles.trendIcon}>📈</span>
                <span className={styles.trendText}>+5%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.howItWorksContent}>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleIcon}>✨</span>
            이렇게 간단해요!
          </h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <div className={styles.stepIconBg}></div>
                <span className={styles.stepEmoji}>📝</span>
              </div>
              <h3 className={styles.stepTitle}>요청 작성</h3>
              <p className={styles.stepDesc}>
                필요한 기능을 자세히 설명하고<br />
                예산을 설정하세요
              </p>
            </div>
            <div className={styles.stepConnector}>
              <div className={styles.connectorLine}></div>
              <div className={styles.connectorArrow}>→</div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <div className={styles.stepIconBg}></div>
                <span className={styles.stepEmoji}>🤝</span>
              </div>
              <h3 className={styles.stepTitle}>개발자 매칭</h3>
              <p className={styles.stepDesc}>
                전문 개발자들의<br />
                제안을 받아보세요
              </p>
            </div>
            <div className={styles.stepConnector}>
              <div className={styles.connectorLine}></div>
              <div className={styles.connectorArrow}>→</div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepIcon}>
                <div className={styles.stepIconBg}></div>
                <span className={styles.stepEmoji}>🎁</span>
              </div>
              <h3 className={styles.stepTitle}>컴포넌트 수령</h3>
              <p className={styles.stepDesc}>
                완성된 컴포넌트를<br />
                안전하게 전달받으세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className={styles.trust}>
        <div className={styles.trustContent}>
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>🛡️</div>
              <h3 className={styles.trustTitle}>안전한 거래</h3>
              <p className={styles.trustDesc}>에스크로 시스템으로 보호</p>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>⭐</div>
              <h3 className={styles.trustTitle}>검증된 품질</h3>
              <p className={styles.trustDesc}>평균 4.8점 이상의 만족도</p>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>⚡</div>
              <h3 className={styles.trustTitle}>빠른 응답</h3>
              <p className={styles.trustDesc}>24시간 내 응답 보장</p>
            </div>
            <div className={styles.trustItem}>
              <div className={styles.trustIcon}>💯</div>
              <h3 className={styles.trustTitle}>100% 환불</h3>
              <p className={styles.trustDesc}>만족하지 못하면 전액 환불</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>
              지금 바로 시작해보세요! 🚀
            </h2>
            <p className={styles.ctaDesc}>
              첫 거래는 수수료 50% 할인!
            </p>
            <div className={styles.ctaActions}>
              <button className={styles.ctaPrimary}>
                <span>GitHub로 시작하기</span>
                <span className={styles.githubIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </span>
              </button>
              <button className={styles.ctaSecondary}>
                이메일로 가입하기
              </button>
            </div>
            <div className={styles.ctaBadges}>
              <span className={styles.badge}>🔒 SSL 보안</span>
              <span className={styles.badge}>📱 모바일 지원</span>
              <span className={styles.badge}>🌍 글로벌 서비스</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

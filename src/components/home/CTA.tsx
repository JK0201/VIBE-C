import styles from '@/styles/Home.module.css';

export default function CTA() {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaContent}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaHeader}>
            <h2 className={styles.ctaTitle}>
              개발자와 고객을 연결하는<br />
              가장 쉬운 방법 🤝
            </h2>
            <p className={styles.ctaDesc}>
              지금 가입하면 <strong>첫 거래 수수료 0원</strong>
            </p>
          </div>
          
          <div className={styles.ctaStats}>
            <div className={styles.ctaStat}>
              <div className={styles.statNumber}>1,234+</div>
              <div className={styles.statLabel}>활동 개발자</div>
            </div>
            <div className={styles.ctaStat}>
              <div className={styles.statNumber}>5,678</div>
              <div className={styles.statLabel}>완료된 프로젝트</div>
            </div>
            <div className={styles.ctaStat}>
              <div className={styles.statNumber}>4.9/5</div>
              <div className={styles.statLabel}>평균 만족도</div>
            </div>
          </div>

          <div className={styles.ctaActions}>
            <button className={styles.ctaPrimary}>
              <span>시작하기</span>
              <span className={styles.ctaArrow}>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
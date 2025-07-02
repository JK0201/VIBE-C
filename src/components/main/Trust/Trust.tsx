import styles from './Trust.module.css';

export default function Trust() {
  return (
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
            <div className={styles.trustIcon}>🔧</div>
            <h3 className={styles.trustTitle}>기술 지원</h3>
            <p className={styles.trustDesc}>구매 후 30일 무료 기술 지원</p>
          </div>
        </div>
      </div>
    </section>
  );
}
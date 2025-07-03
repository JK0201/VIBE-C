import styles from './HowItWorks.module.css';

export default function HowItWorks() {
  return (
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
              가격을 설정하세요
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
  );
}
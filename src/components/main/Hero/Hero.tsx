import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroPattern}>
        <div className={styles.patternDot}></div>
        <div className={styles.patternDot}></div>
        <div className={styles.patternDot}></div>
      </div>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          당신의 아이디어를
          <br />
          <span className={styles.titleHighlight}>현실로 만들어드립니다</span>
        </h1>
        <p className={styles.heroDescription}>
          웹사이트부터 AI, 블록체인까지<br />
          모든 개발 영역의 전문 솔루션을 만나보세요
        </p>
        <div className={styles.heroActions}>
          <button className={styles.primaryAction}>
            개발 모듈 둘러보기
          </button>
          <button className={styles.secondaryAction}>
            개발 요청하기
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
    </section>
  );
}
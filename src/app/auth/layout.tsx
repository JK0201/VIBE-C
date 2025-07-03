import styles from './layout.module.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.authWrapper}>
      <div className={styles.authContainer}>
        <div className={styles.authContent}>
          {children}
        </div>
        <div className={styles.authBackground}>
          <div className={styles.gradientOrb1}></div>
          <div className={styles.gradientOrb2}></div>
          <div className={styles.gradientOrb3}></div>
        </div>
      </div>
    </div>
  );
}
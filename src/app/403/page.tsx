import Link from 'next/link';
import styles from './page.module.css';

export default function ForbiddenPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>403</h1>
        <h2 className={styles.title}>접근 권한이 없습니다</h2>
        <p className={styles.description}>
          관리자 권한이 필요한 페이지입니다. 
          올바른 권한이 있는 계정으로 로그인해주세요.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.homeButton}>
            홈으로 돌아가기
          </Link>
          <Link href="/auth/login" className={styles.loginButton}>
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
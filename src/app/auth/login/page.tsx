'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = () => {
    signIn('github', { callbackUrl: '/' });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginHeader}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <div className={styles.logoInner}></div>
          </div>
          <span>VIBE-C</span>
        </Link>
        <h1 className={styles.title}>다시 오신 것을 환영합니다</h1>
        <p className={styles.subtitle}>
          계정에 로그인하여 개발 모듈을 거래하세요
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.loginForm}>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="your@email.com"
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <div className={styles.labelWrapper}>
            <label htmlFor="password" className={styles.label}>
              비밀번호
            </label>
            <Link href="/auth/forgot-password" className={styles.forgotLink}>
              비밀번호를 잊으셨나요?
            </Link>
          </div>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.passwordToggle}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>

        <div className={styles.divider}>
          <span>또는</span>
        </div>

        <button 
          type="button" 
          className={styles.githubButton}
          onClick={handleGithubLogin}
          disabled={isLoading}
        >
          <svg className={styles.githubIcon} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub으로 로그인
        </button>
      </form>

      <div className={styles.signupLink}>
        아직 계정이 없으신가요?{' '}
        <Link href="/auth/signup" className={styles.link}>
          회원가입
        </Link>
      </div>
    </div>
  );
}
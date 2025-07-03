'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    githubId: '',
    agreeTerms: false,
    agreeMarketing: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Signup logic will be implemented later
    console.log('Signup attempt with:', formData);
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupHeader}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <div className={styles.logoInner}></div>
          </div>
          <span>VIBE-C</span>
        </Link>
        <h1 className={styles.title}>함께 시작해요</h1>
        <p className={styles.subtitle}>
          계정을 만들고 개발 모듈 거래를 시작하세요
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            이름
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
            placeholder="홍길동"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            이메일
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            placeholder="your@email.com"
            required
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              비밀번호
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder="••••••••"
                required
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

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              비밀번호 확인
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.input}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.passwordToggle}
              >
                {showConfirmPassword ? (
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
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="githubId" className={styles.label}>
            GitHub 아이디 <span className={styles.optional}>(선택)</span>
          </label>
          <input
            type="text"
            id="githubId"
            name="githubId"
            value={formData.githubId}
            onChange={handleChange}
            className={styles.input}
            placeholder="username"
          />
          <p className={styles.helpText}>
            GitHub 계정을 연결하면 신뢰도가 높아집니다
          </p>
        </div>

        <div className={styles.passwordRequirements}>
          <p className={styles.requirementsTitle}>비밀번호 요구사항:</p>
          <ul className={styles.requirementsList}>
            <li className={styles.requirementItem}>최소 8자 이상</li>
            <li className={styles.requirementItem}>영문 대/소문자 포함</li>
            <li className={styles.requirementItem}>숫자 포함</li>
            <li className={styles.requirementItem}>특수문자 포함</li>
          </ul>
        </div>

        <div className={styles.agreements}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className={styles.checkbox}
              required
            />
            <span>
              <Link href="/terms" className={styles.link}>이용약관</Link> 및{' '}
              <Link href="/privacy" className={styles.link}>개인정보처리방침</Link>에 동의합니다
            </span>
          </label>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="agreeMarketing"
              checked={formData.agreeMarketing}
              onChange={handleChange}
              className={styles.checkbox}
            />
            <span>마케팅 정보 수신에 동의합니다 (선택)</span>
          </label>
        </div>

        <button type="submit" className={styles.submitButton}>
          회원가입
        </button>
      </form>

      <div className={styles.loginLink}>
        이미 계정이 있으신가요?{' '}
        <Link href="/auth/login" className={styles.link}>
          로그인
        </Link>
      </div>
    </div>
  );
}
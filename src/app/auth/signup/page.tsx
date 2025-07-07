'use client';

import { useState, useEffect } from 'react';
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
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasLetter: false,
    hasNumber: false,
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: ''
  });

  // 유효성 검사 함수들
  const validateName = (name: string): string => {
    if (!name || name.length < 2) {
      return "닉네임은 2자 이상이어야 합니다";
    }
    if (name.length > 20) {
      return "닉네임은 20자 이하여야 합니다";
    }
    if (!/^[가-힣a-zA-Z0-9_]+$/.test(name)) {
      return "한글, 영문, 숫자, 언더스코어만 사용 가능합니다";
    }
    return "";
  };

  const validateEmail = (email: string): string => {
    if (!email) {
      return "이메일을 입력해주세요";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "올바른 이메일 형식이 아닙니다";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    });
  };

  // 비밀번호 변경 시 유효성 검사
  useEffect(() => {
    if (formData.password) {
      validatePassword(formData.password);
    } else {
      // 비밀번호가 비어있으면 모든 검증을 false로 초기화
      setPasswordValidation({
        minLength: false,
        hasLetter: false,
        hasNumber: false,
      });
    }
    // 비밀번호 확인 일치 여부 검사
    if (formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordMatch(true); // 비어있으면 에러 메시지 숨김
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // 실시간 유효성 검사
    if (name === 'name') {
      const error = validateName(value);
      setErrors(prev => ({ ...prev, name: error }));
    }
    
    if (name === 'email') {
      const error = validateEmail(value);
      setErrors(prev => ({ ...prev, email: error }));
    }

    // 약관 동의 체크
    if (name === 'agreeTerms' && !checked) {
      setErrors(prev => ({ ...prev, agreeTerms: '이용약관에 동의해주세요' }));
    } else if (name === 'agreeTerms' && checked) {
      setErrors(prev => ({ ...prev, agreeTerms: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 최종 유효성 검사
    const newErrors: any = {};
    
    // 닉네임 검사
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;
    
    // 이메일 검사
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    // 비밀번호 검사
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다";
    } else if (!/[a-zA-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      newErrors.password = "비밀번호는 영문과 숫자를 포함해야 합니다";
    }
    
    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }
    
    // 약관 동의
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "이용약관에 동의해주세요";
    }
    
    // 에러가 있으면 제출 중단
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // 에러 초기화
    setErrors({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: ''
    });
    
    // API 호출
    try {
      const response = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          githubId: formData.githubId,
          agreeTerms: formData.agreeTerms,
          agreeMarketing: formData.agreeMarketing
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(data.message);
        window.location.href = data.redirectUrl;
      } else {
        // 서버에서 반환한 에러 표시
        setErrors(data.errors || {});
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('회원가입 중 오류가 발생했습니다');
    }
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
            닉네임
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`${styles.input} ${errors.name ? styles.error : ''}`}
            placeholder="홍길동"
            required
          />
          {errors.name && (
            <p className={styles.errorMessage}>{errors.name}</p>
          )}
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
            className={`${styles.input} ${errors.email ? styles.error : ''}`}
            placeholder="your@email.com"
            required
          />
          {errors.email && (
            <p className={styles.errorMessage}>{errors.email}</p>
          )}
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

        <div className={`${styles.passwordRequirements} ${
          passwordValidation.minLength && 
          passwordValidation.hasLetter && 
          passwordValidation.hasNumber ? styles.allValid : ''
        }`}>
          <p className={styles.requirementsTitle}>비밀번호 요구사항:</p>
          <ul className={styles.requirementsList}>
            <li className={`${styles.requirementItem} ${passwordValidation.minLength ? styles.valid : ''}`}>
              {passwordValidation.minLength ? (
                <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className={styles.emptyCircle}></span>
              )}
              최소 8자 이상
            </li>
            <li className={`${styles.requirementItem} ${passwordValidation.hasLetter ? styles.valid : ''}`}>
              {passwordValidation.hasLetter ? (
                <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className={styles.emptyCircle}></span>
              )}
              영문 포함
            </li>
            <li className={`${styles.requirementItem} ${passwordValidation.hasNumber ? styles.valid : ''}`}>
              {passwordValidation.hasNumber ? (
                <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className={styles.emptyCircle}></span>
              )}
              숫자 포함
            </li>
          </ul>
          {formData.confirmPassword && (
            <div className={`${styles.passwordMatchStatus} ${passwordMatch ? styles.match : styles.noMatch}`}>
              {passwordMatch ? (
                <>
                  <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  비밀번호가 일치합니다
                </>
              ) : (
                <>
                  <svg className={styles.xIcon} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  비밀번호가 일치하지 않습니다
                </>
              )}
            </div>
          )}
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
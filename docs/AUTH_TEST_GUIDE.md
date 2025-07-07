# 인증 시스템 테스트 가이드

## 테스트 계정
- 이메일: john.dev@example.com
- 비밀번호: password123
- 역할: admin

## 브라우저에서 테스트하기

### 1. 로그인 테스트

1. http://localhost:3000/auth/login 접속
2. 테스트 계정으로 로그인
3. 로그인 성공 시 홈페이지로 리다이렉트 확인
4. 헤더에 사용자 정보 표시 확인

### 2. 쿠키 확인 (Chrome 개발자 도구)

1. F12 또는 우클릭 > 검사
2. Application 탭 선택
3. Storage > Cookies > http://localhost:3000 선택
4. 다음 쿠키들이 생성되었는지 확인:
   - `next-auth.csrf-token`: CSRF 보호용 토큰
   - `next-auth.callback-url`: 콜백 URL
   - `next-auth.session-token`: JWT 세션 토큰 (HttpOnly, SameSite=lax)

### 3. 세션 확인

1. 개발자 도구 > Console
2. 다음 코드 실행:
```javascript
fetch('/api/auth/session')
  .then(res => res.json())
  .then(data => console.log('세션 정보:', data));
```

예상 결과:
```json
{
  "user": {
    "email": "john.dev@example.com",
    "name": "JohnDeveloper",
    "image": "https://github.com/johndev.png",
    "id": "1",
    "role": "admin",
    "balance": 50000,
    "githubId": "johndev"
  },
  "expires": "2025-08-06T..."
}
```

### 4. 로그인 상태 유지 테스트

1. 로그인 후 브라우저 새로고침 (F5)
2. 여전히 로그인 상태인지 확인
3. 새 탭에서 http://localhost:3000 열기
4. 로그인 상태가 유지되는지 확인

### 5. 로그아웃 테스트

1. 헤더의 사용자 메뉴 클릭
2. "로그아웃" 클릭
3. 로그인 페이지로 리다이렉트 확인
4. 쿠키가 삭제되었는지 확인

## API로 직접 테스트

### 1. CSRF 토큰 가져오기
```bash
curl http://localhost:3000/api/auth/csrf
```

### 2. 현재 세션 확인
```bash
curl http://localhost:3000/api/auth/session
```

### 3. Providers 확인
```bash
curl http://localhost:3000/api/auth/providers
```

## JWT 토큰 구조

NextAuth는 JWT 토큰을 사용하여 세션을 관리합니다:
- 토큰은 `next-auth.session-token` 쿠키에 저장
- HttpOnly 플래그로 JavaScript 접근 차단
- SameSite=lax로 CSRF 공격 방지
- 기본 만료 시간: 30일

## 문제 해결

### 로그인이 되지 않는 경우
1. `.env.local` 파일 확인
2. NEXTAUTH_URL이 올바른지 확인
3. NEXTAUTH_SECRET이 설정되었는지 확인
4. 개발 서버 재시작

### 쿠키가 설정되지 않는 경우
1. HTTPS가 아닌 HTTP 환경인지 확인 (개발 환경은 HTTP 허용)
2. 브라우저의 쿠키 설정 확인
3. 시크릿 모드에서 테스트

### 세션이 유지되지 않는 경우
1. 쿠키의 만료 시간 확인
2. 서버 재시작 후에도 동일한 NEXTAUTH_SECRET 사용 확인
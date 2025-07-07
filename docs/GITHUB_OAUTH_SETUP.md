# GitHub OAuth 설정 가이드

## 개발 환경 설정

### 1. GitHub OAuth App 생성

1. [GitHub Settings > Developer settings](https://github.com/settings/developers)로 이동
2. "OAuth Apps" 탭 선택
3. "New OAuth App" 버튼 클릭
4. 다음 정보 입력:

   | 필드 | 값 |
   |------|-----|
   | Application name | Vibe Market (Dev) |
   | Homepage URL | http://localhost:3000 |
   | Application description | 개발 모듈 거래 플랫폼 (개발 환경) |
   | Authorization callback URL | http://localhost:3000/api/auth/callback/github |

5. "Register application" 클릭

### 2. Client ID와 Secret 설정

1. 생성된 OAuth App 페이지에서:
   - **Client ID** 복사
   - "Generate a new client secret" 클릭
   - **Client Secret** 복사 (한 번만 표시됨!)

2. `.env.local` 파일 수정:
   ```env
   GITHUB_ID=여기에_Client_ID_입력
   GITHUB_SECRET=여기에_Client_Secret_입력
   ```

3. 개발 서버 재시작:
   ```bash
   npm run dev
   ```

## 프로덕션 환경 설정

프로덕션 환경에서는 별도의 OAuth App을 생성해야 합니다:

1. 새로운 OAuth App 생성
2. 프로덕션 URL 사용:
   - Homepage URL: https://your-domain.com
   - Authorization callback URL: https://your-domain.com/api/auth/callback/github

## 테스트 방법

1. 개발 서버 실행 (`npm run dev`)
2. http://localhost:3000/auth/login 접속
3. "GitHub으로 로그인" 버튼 클릭
4. GitHub 인증 페이지로 리다이렉트
5. 권한 승인 후 자동으로 로그인 완료

## NEXTAUTH_SECRET 생성 방법

안전한 NEXTAUTH_SECRET을 생성하려면 다음 명령어를 사용하세요:

```bash
# macOS/Linux
openssl rand -base64 32

# Node.js 사용
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

생성된 base64 문자열을 `.env.local`의 NEXTAUTH_SECRET에 설정합니다.

## 주의사항

- Client Secret은 절대 공개 저장소에 커밋하지 마세요
- `.env.local` 파일은 `.gitignore`에 포함되어 있어야 합니다
- 프로덕션과 개발 환경은 별도의 OAuth App을 사용하세요
- NEXTAUTH_SECRET은 각 환경마다 다른 값을 사용하세요
- 절대 예제에 있는 시크릿을 그대로 사용하지 마세요

## 문제 해결

### "Callback URL mismatch" 에러
- GitHub OAuth App의 callback URL이 정확한지 확인
- 개발 환경: `http://localhost:3000/api/auth/callback/github`
- 프로덕션: `https://your-domain.com/api/auth/callback/github`

### 로그인 후 세션이 유지되지 않음
- NEXTAUTH_URL이 올바르게 설정되었는지 확인
- NEXTAUTH_SECRET이 설정되었는지 확인

### GitHub 프로필 이미지가 표시되지 않음
- GitHub 프로필에 공개 이메일이 설정되어 있는지 확인
- 프로필 이미지가 공개로 설정되어 있는지 확인
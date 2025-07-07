// NextAuth 로그인 테스트 스크립트
const fetch = require('node-fetch');

async function testLogin() {
  console.log('=== NextAuth 로그인 테스트 ===\n');
  
  const baseUrl = 'http://localhost:3000';
  
  // 1. CSRF 토큰 가져오기
  console.log('1. CSRF 토큰 가져오기...');
  const csrfResponse = await fetch(`${baseUrl}/api/auth/csrf`);
  const { csrfToken } = await csrfResponse.json();
  const cookies = csrfResponse.headers.get('set-cookie');
  console.log('✓ CSRF 토큰:', csrfToken);
  console.log('✓ 쿠키:', cookies ? '설정됨' : '없음');
  
  // 2. 로그인 시도
  console.log('\n2. 로그인 시도 (john.dev@example.com)...');
  const loginResponse = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookies || ''
    },
    body: new URLSearchParams({
      email: 'john.dev@example.com',
      password: 'password123',
      csrfToken: csrfToken,
      json: 'true'
    }),
    redirect: 'manual'
  });
  
  console.log('✓ 로그인 응답 상태:', loginResponse.status);
  const loginCookies = loginResponse.headers.raw()['set-cookie'];
  console.log('✓ 로그인 쿠키 설정:', loginCookies ? loginCookies.length + '개' : '없음');
  
  if (loginCookies) {
    loginCookies.forEach((cookie, index) => {
      const [name] = cookie.split('=');
      const hasHttpOnly = cookie.includes('HttpOnly');
      const hasSameSite = cookie.includes('SameSite');
      console.log(`  ${index + 1}. ${name} (HttpOnly: ${hasHttpOnly}, SameSite: ${hasSameSite})`);
    });
  }
  
  // 3. 세션 확인
  console.log('\n3. 세션 확인...');
  const sessionCookie = loginCookies ? loginCookies.join('; ') : '';
  const sessionResponse = await fetch(`${baseUrl}/api/auth/session`, {
    headers: {
      'Cookie': sessionCookie
    }
  });
  
  const session = await sessionResponse.json();
  console.log('✓ 세션 데이터:', JSON.stringify(session, null, 2));
  
  // 4. JWT 토큰 확인
  if (loginCookies) {
    const jwtCookie = loginCookies.find(cookie => cookie.startsWith('next-auth.session-token'));
    if (jwtCookie) {
      const [, token] = jwtCookie.split('=');
      const cleanToken = token.split(';')[0];
      console.log('\n4. JWT 토큰 정보:');
      console.log('✓ 토큰 존재:', !!cleanToken);
      console.log('✓ 토큰 길이:', cleanToken.length);
      
      // JWT 구조 확인 (header.payload.signature)
      const parts = cleanToken.split('.');
      console.log('✓ JWT 구조:', parts.length === 3 ? '유효 (3개 부분)' : '무효');
    }
  }
  
  console.log('\n=== 테스트 완료 ===');
}

// node 환경에서 fetch가 없을 경우를 위한 처리
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

testLogin().catch(console.error);
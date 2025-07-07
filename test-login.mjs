// ESM 모듈로 작성된 로그인 테스트
import https from 'https';
import http from 'http';

// HTTP 요청을 위한 헬퍼 함수
function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', reject);
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

async function testLogin() {
  console.log('=== NextAuth 로그인 테스트 ===\n');
  
  // 1. CSRF 토큰 가져오기
  console.log('1. CSRF 토큰 가져오기...');
  const csrfRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/csrf',
    method: 'GET'
  });
  
  const { csrfToken } = JSON.parse(csrfRes.body);
  const csrfCookie = csrfRes.headers['set-cookie']?.[0] || '';
  
  console.log('✓ CSRF 토큰:', csrfToken);
  console.log('✓ CSRF 쿠키:', csrfCookie.split(';')[0]);
  
  // 2. Credentials로 로그인
  console.log('\n2. 로그인 시도...');
  const loginData = new URLSearchParams({
    email: 'john.dev@example.com',
    password: 'password123',
    csrfToken: csrfToken,
    json: 'true'
  }).toString();
  
  const loginRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/callback/credentials',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(loginData),
      'Cookie': csrfCookie
    }
  }, loginData);
  
  console.log('✓ 로그인 응답 상태:', loginRes.statusCode);
  
  const cookies = loginRes.headers['set-cookie'] || [];
  console.log('✓ 설정된 쿠키 수:', cookies.length);
  
  cookies.forEach((cookie, index) => {
    const [name, ...rest] = cookie.split('=');
    const value = rest.join('=').split(';')[0];
    const flags = cookie.split(';').slice(1).map(f => f.trim());
    
    console.log(`\n쿠키 ${index + 1}: ${name}`);
    console.log('  - 값 길이:', value.length);
    console.log('  - 플래그:', flags.join(', '));
    
    if (name.includes('session-token')) {
      console.log('  - JWT 토큰 발견!');
      const parts = value.split('.');
      console.log('  - JWT 구조:', parts.length === 3 ? '유효 (header.payload.signature)' : '무효');
    }
  });
  
  // 3. 세션 확인
  console.log('\n3. 세션 정보 확인...');
  const sessionCookie = cookies.map(c => c.split(';')[0]).join('; ');
  
  const sessionRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/session',
    method: 'GET',
    headers: {
      'Cookie': sessionCookie
    }
  });
  
  const session = JSON.parse(sessionRes.body);
  console.log('\n세션 데이터:');
  console.log(JSON.stringify(session, null, 2));
  
  if (session.user) {
    console.log('\n✅ 로그인 성공!');
    console.log('- 사용자 ID:', session.user.id);
    console.log('- 이름:', session.user.name);
    console.log('- 역할:', session.user.role);
    console.log('- 잔액:', session.user.balance, 'P');
    console.log('- 만료 시간:', new Date(session.expires).toLocaleString('ko-KR'));
  } else {
    console.log('\n❌ 로그인 실패');
  }
  
  console.log('\n=== 테스트 완료 ===');
}

testLogin().catch(console.error);
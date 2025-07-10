import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

interface SignupData {
  name: string;
  email: string;
  password: string;
  agreeTerms: boolean;
  githubId?: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  agreeTerms?: string;
}

interface DBUser {
  id: number;
  email: string;
  nickname: string;
  password: string;
  role: string;
  githubId?: string;
  balance: number;
  profileImage?: string;
  bio?: string;
  createdAt?: string;
}

// 유효성 검사 함수 (프론트엔드와 동일한 규칙)
function validateSignupData(data: SignupData) {
  const errors: ValidationErrors = {};
  
  // 닉네임 검사
  if (!data.name || data.name.length < 2) {
    errors.name = "닉네임은 2자 이상이어야 합니다";
  } else if (data.name.length > 20) {
    errors.name = "닉네임은 20자 이하여야 합니다";
  } else if (!/^[가-힣a-zA-Z0-9_]+$/.test(data.name)) {
    errors.name = "한글, 영문, 숫자, 언더스코어만 사용 가능합니다";
  }
  
  // 이메일 검사
  if (!data.email) {
    errors.email = "이메일을 입력해주세요";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "올바른 이메일 형식이 아닙니다";
  }
  
  // 비밀번호 검사
  if (!data.password || data.password.length < 8) {
    errors.password = "비밀번호는 8자 이상이어야 합니다";
  } else if (!/[a-zA-Z]/.test(data.password) || !/[0-9]/.test(data.password)) {
    errors.password = "비밀번호는 영문과 숫자를 포함해야 합니다";
  }
  
  // 약관 동의
  if (!data.agreeTerms) {
    errors.agreeTerms = "이용약관에 동의해주세요";
  }
  
  return errors;
}

// users.json 파일 읽기
async function loadUsers() {
  const filePath = path.join(process.cwd(), 'data/mock/users.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(fileContent);
  return data.users;
}

// 중복 체크 함수
async function checkDuplicates(data: SignupData) {
  const users = await loadUsers();
  const errors: ValidationErrors = {};
  
  // 이메일 중복 체크
  if (users.some((user: DBUser) => user.email === data.email)) {
    errors.email = "이미 가입된 이메일입니다";
  }
  
  // 닉네임 중복 체크
  if (users.some((user: DBUser) => user.nickname === data.name)) {
    errors.name = "이미 사용 중인 닉네임입니다";
  }
  
  return errors;
}

// 다음 사용자 ID 가져오기
async function getNextUserId() {
  const users = await loadUsers();
  const maxId = users.reduce((max: number, user: DBUser) => 
    Math.max(max, user.id), 0
  );
  return maxId + 1;
}

// 새 사용자를 파일에 추가
async function appendUserToFile(newUser: DBUser) {
  const filePath = path.join(process.cwd(), 'data/mock/users.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(fileContent);
  
  data.users.push(newUser);
  
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// 비밀번호 해싱 (bcrypt 사용, salt rounds = 10)
async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 1. 유효성 검사
    const validationErrors = validateSignupData(body);
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json({ 
        success: false, 
        errors: validationErrors 
      }, { status: 400 });
    }
    
    // 2. 중복 체크
    const duplicateErrors = await checkDuplicates(body);
    if (Object.keys(duplicateErrors).length > 0) {
      return NextResponse.json({ 
        success: false, 
        errors: duplicateErrors 
      }, { status: 400 });
    }
    
    // 3. 새 사용자 생성
    const newUser = {
      id: await getNextUserId(),
      email: body.email,
      nickname: body.name, // name 필드를 nickname으로 저장
      password: await hashPassword(body.password), // await 추가
      role: 'user', // 기본 role
      githubId: body.githubId || '',
      balance: 10000, // 초기 포인트
      profileImage: body.githubId ? `https://github.com/${body.githubId}.png` : '',
      bio: '',
      createdAt: new Date().toISOString()
    };
    
    // 4. users.json 파일에 추가
    await appendUserToFile(newUser);
    
    return NextResponse.json({
      success: true,
      message: "회원가입이 완료되었습니다",
      redirectUrl: "/auth/login"
    });
    
  } catch {
    return NextResponse.json(
      { 
        success: false, 
        error: '회원가입 처리 중 오류가 발생했습니다' 
      },
      { status: 500 }
    );
  }
}
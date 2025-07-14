import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

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

interface GitHubProfile {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  login: string;
  avatar_url: string;
  bio?: string;
}

// users.json 파일 읽기
async function loadUsers() {
  const filePath = path.join(process.cwd(), 'data/mock/users.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(fileContent);
  return data.users;
}

// 비밀번호 검증 (bcrypt만 사용)
async function verifyPassword(inputPassword: string, storedPassword: string) {
  return await bcrypt.compare(inputPassword, storedPassword);
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

// GitHub 사용자 찾기 또는 생성
async function findOrCreateGitHubUser(profile: GitHubProfile) {
  const users = await loadUsers();
  
  // GitHub ID로 기존 사용자 찾기
  let user = users.find((u: DBUser) => u.githubId === profile.login);
  
  if (!user) {
    // 이메일로 기존 사용자 찾기
    if (profile.email) {
      user = users.find((u: DBUser) => u.email === profile.email);
      if (user) {
        // 기존 사용자에 GitHub ID 연결
        user.githubId = profile.login;
        user.profileImage = profile.avatar_url;
        // TODO: 파일 업데이트 로직 추가
        return user;
      }
    }
    
    // 새 사용자 생성
    const saltRounds = 10;
    const newUser = {
      id: await getNextUserId(),
      email: profile.email || `${profile.login}@github.local`,
      nickname: profile.name || profile.login,
      password: await bcrypt.hash(`github_${profile.id}`, saltRounds),
      role: 'user',
      githubId: profile.login,
      balance: 10000,
      profileImage: profile.avatar_url,
      bio: profile.bio || '',
      createdAt: new Date().toISOString()
    };
    
    await appendUserToFile(newUser);
    user = newUser;
  }
  
  return user;
}

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const users = await loadUsers();
        const user = users.find((u: DBUser) => u.email === credentials.email);

        if (!user) {
          return null;
        }

        const isPasswordValid = await verifyPassword(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        // 반환할 사용자 정보 (비밀번호 제외)
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.nickname,
          image: user.profileImage,
          role: user.role,
          balance: user.balance,
          githubId: user.githubId
        };
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async signIn({ user, account, profile }: any) {
      if (account?.provider === 'github') {
        const githubUser = await findOrCreateGitHubUser(profile as GitHubProfile);
        user.id = githubUser.id.toString();
        user.role = githubUser.role;
        user.balance = githubUser.balance;
        user.githubId = githubUser.githubId;
      }
      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.balance = user.balance;
        token.githubId = user.githubId;
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.balance = token.balance;
        session.user.githubId = token.githubId;
      }
      return session;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async redirect({ url, baseUrl }: any) {
      // GitHub 로그인 후 홈으로 리다이렉트
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
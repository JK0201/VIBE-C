declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    image?: string
    role: string
    balance: number
    githubId?: string
  }

  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    balance: number
    githubId?: string
  }
}
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminPath = req.nextUrl.pathname.startsWith('/admin');
    const isAdminApi = req.nextUrl.pathname.startsWith('/api/v1/admin');
    
    // Check if user is trying to access admin routes
    if ((isAdminPath || isAdminApi) && token?.role !== 'admin') {
      // Redirect non-admin users to 403 page
      return NextResponse.redirect(new URL('/403', req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminPath = req.nextUrl.pathname.startsWith('/admin');
        const isAdminApi = req.nextUrl.pathname.startsWith('/api/v1/admin');
        
        // For admin routes, require authentication
        if (isAdminPath || isAdminApi) {
          return !!token;
        }
        
        // For other protected routes
        return true;
      },
    },
  }
);

// Configure which routes to protect
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/v1/admin/:path*',
    '/cart/:path*',
    '/api/auth/session',
  ],
};
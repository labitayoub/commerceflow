import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || getTokenFromLocalStorage(request);
  const { pathname } = request.nextUrl;

  // Routes admin protégées
  if (pathname.startsWith('/admin')) {
    if (!token) {
      // Pas de token, redirige vers login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Vérifie le rôle (décode le token JWT)
    try {
      const user = getUserFromToken(token);
      if (user?.role !== 'ADMIN') {
        // Pas admin, redirige vers accueil
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // Token invalide
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Routes utilisateur authentifié (orders, checkout, cart)
  if (pathname.startsWith('/orders') || pathname.startsWith('/checkout')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Empêche les utilisateurs connectés d'accéder à login/register
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Helper pour récupérer le token depuis localStorage (côté client)
function getTokenFromLocalStorage(request: NextRequest): string | null {
  // En middleware Next.js, on ne peut pas accéder à localStorage
  // Alternative : vérifier le header Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// Helper pour décoder le token JWT et extraire l'utilisateur
function getUserFromToken(token: string): { role: string } | null {
  try {
    // Décode la partie payload du JWT (format: header.payload.signature)
    const payload = token.split('.')[1];
    if (!payload) return null;
    
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
    return { role: decoded.role };
  } catch {
    return null;
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/orders/:path*',
    '/checkout/:path*',
    '/login',
    '/register',
  ],
};

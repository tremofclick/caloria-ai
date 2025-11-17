import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Rotas protegidas que requerem autenticação
  const protectedRoutes = [
    '/dashboard',
    '/add-meal',
    '/exercises',
    '/water',
    '/progress',
    '/suggestions',
    '/settings',
    '/plans',
    '/success'
  ];

  const { pathname } = request.nextUrl;

  // Verificar se a rota atual é protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Em ambiente de navegador, o localStorage será verificado pelo componente
    // Aqui apenas garantimos que a rota existe
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg).*)',
  ],
};

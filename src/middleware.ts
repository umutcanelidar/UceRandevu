import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';

  // Standardize hostname (remove port if any)
  const hostname = host.split(':')[0].toLowerCase();

  // Exclude static files, API routes, and Next.js internal files
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Detect subdomain:
  // e.g. bagenailstudio.ucebilisim.com -> 'bagenailstudio'
  // e.g. bagenailstudio.localhost:3000 -> 'bagenailstudio'
  let subdomain = '';
  if (hostname.includes('.localhost')) {
    subdomain = hostname.replace('.localhost', '');
  } else if (hostname.endsWith('.ucebilisim.com')) {
    subdomain = hostname.replace('.ucebilisim.com', '');
  } else if (hostname.endsWith('.ucerandevu.com')) {
    subdomain = hostname.replace('.ucerandevu.com', '');
  }

  // Subdomain multi-tenancy routing (Wildcard)
  const reservedSubdomains = ['www', 'app', 'admin', 'api', 'panel'];
  if (subdomain && !reservedSubdomains.includes(subdomain)) {
    // 1. Root "/" on subdomain serves customer-facing 7/24 booking page directly!
    if (url.pathname === '/') {
      url.pathname = `/book/${subdomain}`;
      return NextResponse.rewrite(url);
    }

    // 2. "/login" on subdomain automatically pre-selects the store
    if (url.pathname === '/login') {
      url.searchParams.set('store', subdomain);
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

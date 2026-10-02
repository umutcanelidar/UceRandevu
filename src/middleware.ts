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
  }

  // Subdomain multi-tenancy routing
  if (subdomain && subdomain !== 'www' && subdomain !== 'randevu') {
    // If tenant is bagenailstudio (or similar variation)
    if (subdomain === 'bagenailstudio' || subdomain === 'bage' || subdomain === 'bagestudio') {
      // Root "/" serves the customer-facing booking page directly!
      if (url.pathname === '/') {
        url.pathname = '/book/bage-studio';
        return NextResponse.rewrite(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

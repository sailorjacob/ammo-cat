import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabaseClient } from './lib/supabase-server';

export async function middleware(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.getUser();
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 
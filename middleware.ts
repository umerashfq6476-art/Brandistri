import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/supabase/types";

/**
 * Brandistri auth middleware.
 *
 * Responsibilities:
 *   1. Refresh the Supabase session cookie on every matched request, so
 *      Server Components and Route Handlers see a fresh user.
 *   2. Protect the /admin namespace — unauthenticated visitors are bounced
 *      to /admin/login (with the original path preserved as `redirectTo`).
 *   3. Bounce already-signed-in users away from /admin/login back into the
 *      dashboard so the login form never traps them.
 *
 * Public routes pass through untouched.
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    // If env is missing we can't run auth — let the request through so
    // local dev surfaces the real Supabase error rather than a 500 here.
    return res;
  }

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      get(name) {
        return req.cookies.get(name)?.value;
      },
      set(name, value, options) {
        res.cookies.set({ name, value, ...options });
      },
      remove(name, options) {
        res.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, searchParams, origin } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (!isAdminRoute) {
    return res;
  }

  // Authenticated user landing on /admin/login → send them inside.
  if (isLoginRoute && user) {
    const redirectTo = searchParams.get("redirectTo");
    const target = redirectTo && redirectTo.startsWith("/admin") ? redirectTo : "/admin";
    return NextResponse.redirect(new URL(target, origin));
  }

  // Unauthenticated user hitting any /admin route except the login page → kick to login.
  if (!isLoginRoute && !user) {
    const loginUrl = new URL("/admin/login", origin);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

/**
 * Match the admin namespace plus the login page itself. We intentionally do
 * NOT run middleware on every route — public pages don't need a session
 * refresh and we save the edge invocations.
 */
export const config = {
  matcher: ["/admin/:path*"],
};

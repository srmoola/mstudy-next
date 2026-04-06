import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/onboarding", "/courses"];
const authRoutes = ["/signin", "/signup"];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (!user && protectedRoutes.some((r) => pathname.startsWith(r))) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  if (user && authRoutes.some((r) => pathname.startsWith(r))) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("year, gender, location_preference, time_preference, day_preference")
      .eq("id", user.id)
      .single();

    const onboardingComplete =
      profile?.year &&
      profile?.gender &&
      profile?.location_preference?.length &&
      profile?.time_preference?.length &&
      profile?.day_preference?.length;

    const url = request.nextUrl.clone();
    url.pathname = onboardingComplete ? "/dashboard" : "/onboarding";
    return NextResponse.redirect(url);
  }

  if (user && pathname === "/") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("year, gender, location_preference, time_preference, day_preference")
      .eq("id", user.id)
      .single();

    const onboardingComplete =
      profile?.year &&
      profile?.gender &&
      profile?.location_preference?.length &&
      profile?.time_preference?.length &&
      profile?.day_preference?.length;

    const url = request.nextUrl.clone();
    url.pathname = onboardingComplete ? "/dashboard" : "/onboarding";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon\\.png|icon\\.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

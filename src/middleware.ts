import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/onboarding", "/courses"];
const authRoutes = ["/signin", "/signup"];

function isOnboardingComplete(profile: {
  year?: string | null;
  gender?: string | null;
  match_same_gender?: boolean | null;
  location_preference?: string[] | null;
  time_preference?: string[] | null;
  day_preference?: string[] | null;
} | null) {
  return (
    !!profile?.year &&
    !!profile?.gender &&
    (profile?.match_same_gender === true || profile?.match_same_gender === false) &&
    !!profile?.location_preference?.length &&
    !!profile?.time_preference?.length &&
    !!profile?.day_preference?.length
  );
}

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

  if (!user && [...protectedRoutes, "/profile", "/change-password"].some((r) => pathname.startsWith(r))) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  if (user && authRoutes.some((r) => pathname.startsWith(r))) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("year, gender, match_same_gender, location_preference, time_preference, day_preference")
      .eq("id", user.id)
      .single();

    const onboardingComplete = isOnboardingComplete(profile);

    const url = request.nextUrl.clone();
    url.pathname = onboardingComplete ? "/dashboard" : "/onboarding";
    return NextResponse.redirect(url);
  }

  if (user && pathname === "/") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("year, gender, match_same_gender, location_preference, time_preference, day_preference")
      .eq("id", user.id)
      .single();

    const onboardingComplete = isOnboardingComplete(profile);

    const url = request.nextUrl.clone();
    url.pathname = onboardingComplete ? "/dashboard" : "/onboarding";
    return NextResponse.redirect(url);
  }

  if (user && pathname.startsWith("/onboarding")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("year, gender, match_same_gender, location_preference, time_preference, day_preference")
      .eq("id", user.id)
      .single();

    if (isOnboardingComplete(profile)) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon\\.png|icon\\.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

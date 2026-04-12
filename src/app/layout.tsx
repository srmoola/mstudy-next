import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/navbar";
import FlashMessages from "@/components/flash-messages";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "MStudy",
  description: "Find your perfect study partner at the University of Michigan",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let onboardingComplete = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("year, gender, match_same_gender, location_preference, time_preference, day_preference")
      .eq("id", user.id)
      .single();

    onboardingComplete =
      !!profile?.year &&
      !!profile?.gender &&
      (profile?.match_same_gender === true || profile?.match_same_gender === false) &&
      !!profile?.location_preference?.length &&
      !!profile?.time_preference?.length &&
      !!profile?.day_preference?.length;
  }

  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen m-0 overflow-x-hidden bg-white text-umBlue">
        <Navbar user={user ? { id: user.id } : null} onboardingComplete={onboardingComplete} />
        <Suspense>
          <FlashMessages />
        </Suspense>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/navbar";
import FlashMessages from "@/components/flash-messages";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "MStudy",
  description: "Find your perfect study partner at the University of Michigan",
  icons: { icon: "/icon.png", apple: "/icon.png" },
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

  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen m-0 overflow-x-hidden bg-white text-umBlue">
        <Navbar user={user ? { id: user.id } : null} />
        <Suspense>
          <FlashMessages />
        </Suspense>
        {children}
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Navbar({
  user,
  onboardingComplete,
}: {
  user: { id: string } | null;
  onboardingComplete: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    setProfileOpen(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const profileButton = (
    <button
      type="button"
      onClick={() => setProfileOpen((open) => !open)}
      aria-label="Open profile menu"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-umBlue transition hover:border-umMaize hover:text-umMaize"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>
    </button>
  );

  return (
    <header className="w-full bg-white/90 backdrop-blur relative z-[100]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-3 sm:px-6 lg:px-10 xl:max-w-none xl:px-16 2xl:px-24">
        <Link href="/" className="flex flex-1 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-umBlue to-umMaize text-lg font-black text-white shadow-lg shadow-umBlue/30 sm:h-10 sm:w-10 sm:text-xl">
            M
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight sm:text-lg">MStudy</p>
            <p className="text-[0.65rem] text-umBlue uppercase tracking-[0.25em]">
              Find your study match
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-shrink-0 items-center gap-6 text-sm font-medium text-umBlue md:flex">
          <Link href="/how-it-works" className="transition hover:text-umMaize">
            How it works
          </Link>
          <Link href="/safety" className="transition hover:text-umMaize">
            Safety
          </Link>
          {user ? (
            onboardingComplete ? (
              <>
              <Link href="/matches" className="transition hover:text-umMaize">
                Matches
              </Link>
              <div className="relative" ref={profileMenuRef}>
                {profileButton}
                {profileOpen && (
                  <div className="absolute right-0 z-[120] mt-2 w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-umBlue hover:bg-slate-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      View profile
                    </Link>
                    <Link
                      href="/change-password"
                      className="block px-4 py-2 text-sm text-umBlue hover:bg-slate-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      Change password
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="block w-full px-4 py-2 text-left text-sm text-umBlue hover:bg-slate-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
              </>
            ) : (
              <>
                <Link href="/onboarding" className="transition hover:text-umMaize">
                  Onboarding
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-full bg-umBlue px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm shadow-slate-400/40 transition hover:bg-[#001633] hover:text-white"
                >
                  Sign out
                </button>
              </>
            )
          ) : (
            <>
              <Link href="/signin" className="transition hover:text-umMaize">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-umBlue px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm shadow-slate-400/40 transition hover:bg-[#001633] hover:text-white"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile nav */}
        <div className="relative md:hidden" ref={mobileMenuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex flex-shrink-0 items-center gap-2 rounded-full border border-umBlue px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-umBlue shadow-sm shadow-slate-400/40 transition hover:border-umMaize hover:text-umMaize"
          >
            Menu
            <span className="text-base leading-none">&#9776;</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-[110] mt-2 w-40 rounded-xl border border-slate-200 bg-white shadow-xl py-2 text-xs backdrop-blur">
              <Link
                href="/how-it-works"
                className="block px-4 py-1.5 text-umBlue hover:bg-slate-100"
                onClick={() => setMenuOpen(false)}
              >
                How it works
              </Link>
              <Link
                href="/safety"
                className="block px-4 py-1.5 text-umBlue hover:bg-slate-100"
                onClick={() => setMenuOpen(false)}
              >
                Safety
              </Link>
              {user ? (
                onboardingComplete ? (
                  <>
                    <Link
                      href="/matches"
                      className="block px-4 py-1.5 text-umBlue hover:bg-slate-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Matches
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-1.5 text-umBlue hover:bg-slate-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      View profile
                    </Link>
                    <Link
                      href="/change-password"
                      className="block px-4 py-1.5 text-umBlue hover:bg-slate-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Change password
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleSignOut();
                      }}
                      className="mt-1 block w-full px-4 py-1.5 text-left text-umBlue hover:bg-slate-100"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/onboarding"
                      className="block px-4 py-1.5 text-umBlue hover:bg-slate-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      Onboarding
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleSignOut();
                      }}
                      className="mt-1 block w-full px-4 py-1.5 text-left text-umBlue hover:bg-slate-100"
                    >
                      Sign out
                    </button>
                  </>
                )
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="block px-4 py-1.5 text-umBlue hover:bg-slate-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="mt-1 block w-full px-4 py-1.5 text-left text-umBlue hover:bg-slate-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

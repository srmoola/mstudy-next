import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-white text-umBlue">
      <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-3 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-14 xl:max-w-none xl:px-16 2xl:px-24">
        <div className="mt-6 grid gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center">
          {/* Left: hero copy */}
          <section>
            <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-umBlue/5 px-3 py-1 text-[0.7rem] font-semibold text-umBlue ring-1 ring-umBlue/20 backdrop-blur sm:text-xs">
              <span className="inline-block h-2 w-2 rounded-full bg-umMaize shadow-[0_0_0_4px] shadow-umMaize/40" />
              Matching Michigan students for smarter studying
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight sm:mt-6 sm:text-4xl lg:text-5xl xl:text-6xl">
              Find your{" "}
              <span className="bg-gradient-to-r from-umBlue via-umMaize to-umBlue bg-clip-text text-transparent">
                perfect study partner
              </span>{" "}
              on campus.
            </h1>

            <p className="mt-4 max-w-xl text-sm text-slate-600 sm:mt-5 sm:text-base">
              MStudy connects University of Michigan students based on classes, study style,
              and schedule&mdash;so you can spend less time searching and more time actually learning.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4">
              <Link
                href="/signup"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-umBlue to-umMaize px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-umBlue/30 transition hover:brightness-110 sm:flex-none sm:px-7 sm:py-3"
              >
                Get started
                <span className="text-lg leading-none">&rarr;</span>
              </Link>
            </div>

            <dl className="mt-7 grid grid-cols-2 gap-5 text-xs text-slate-500 sm:mt-8 sm:flex sm:flex-wrap sm:gap-8 sm:text-sm">
              <div className="space-y-0.5">
                <dt className="font-semibold text-umBlue">Find your people</dt>
                <dd className="text-slate-600">Match with classmates nearby</dd>
              </div>
              <div className="space-y-0.5">
                <dt className="font-semibold text-umBlue">Match by course</dt>
                <dd className="text-slate-600">EECS, STATS, CHEM, and more</dd>
              </div>
              <div className="space-y-0.5">
                <dt className="font-semibold text-umBlue">Made for students</dt>
                <dd className="text-slate-600">Built for coursework and study sessions</dd>
              </div>
            </dl>
          </section>

          {/* Right: card stack */}
          <aside className="relative">
            <div className="relative mx-auto flex max-w-xs flex-col gap-4 sm:max-w-sm lg:max-w-xs">
              {/* Back card */}
              <div className="hidden translate-x-5 -translate-y-3 rotate-3 rounded-[2.25rem] border border-umBlue/15 bg-umBlue/90 p-5 text-xs text-sky-100/90 shadow-[0_40px_90px_rgba(15,23,42,0.6)] backdrop-blur sm:block">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-umBlue to-umMaize" />
                  <div>
                    <p className="text-sm font-semibold text-white">STATS 250</p>
                    <p className="text-[0.65rem] text-sky-100/80">
                      Looking for a weekly problem set buddy.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="rounded-full bg-umBlue/70 px-3 py-1 text-[0.65rem] font-medium text-sky-100/90">
                    Central Campus
                  </span>
                  <span className="rounded-full bg-umBlue/70 px-3 py-1 text-[0.65rem] font-medium text-sky-100/90">
                    Library sessions
                  </span>
                </div>
              </div>

              {/* Main card */}
              <div className="rounded-[2.35rem] border border-umBlue/30 bg-gradient-to-b from-umBlue via-umBlue to-slate-950 p-4 text-white shadow-[0_40px_90px_rgba(15,23,42,0.8)] sm:p-5">
                <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-900/60">
                  <div className="h-52 bg-[radial-gradient(circle_at_20%_0,_rgba(0,39,76,0.8),_transparent_55%),_radial-gradient(circle_at_80%_0,_rgba(255,203,5,0.75),_transparent_55%)] sm:h-64 md:h-72" />
                  <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent px-4 pb-4 pt-10">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold tracking-tight sm:text-lg">Alex</p>
                        <p className="text-[0.7rem] text-sky-200/80 sm:text-xs">
                          Junior &middot; LSA &middot; EECS 281, MATH 215
                        </p>
                      </div>
                    </div>
                    <p className="text-[0.7rem] text-sky-100/90 sm:text-[0.75rem]">
                      &ldquo;Looking for a focused study partner for late-night Duderstadt sessions.
                      Collaborative, but no phones during problem sets.&rdquo;
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-umBlue shadow-inner shadow-slate-900/40 ring-1 ring-slate-200 transition hover:bg-slate-100 hover:text-umBlue sm:h-12 sm:w-12">
                    &#10005;
                  </button>
                  <button className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-umMaize via-umMaize to-amber-200 text-umBlue text-2xl font-black shadow-lg shadow-amber-400/60 ring-4 ring-umBlue/70 transition hover:scale-105 sm:h-16 sm:w-16">
                    &#10003;
                  </button>
                </div>
              </div>

              {/* Bottom pill */}
              <div className="mt-2 flex flex-col items-start justify-between gap-2 rounded-2xl bg-umBlue px-4 py-3 text-[0.7rem] text-sky-100/90 ring-1 ring-umBlue/60 backdrop-blur sm:mt-4 sm:flex-row sm:items-center">
                <p>
                  Made for University of Michigan students. Verify with your{" "}
                  <span className="font-semibold text-umMaize">umich.edu</span> email.
                </p>
                <span className="hidden text-2xl sm:inline">〽️</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

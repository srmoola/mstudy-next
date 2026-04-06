import Link from "next/link";

export const metadata = { title: "Safety – MStudy" };

export default function SafetyPage() {
  return (
    <main className="min-h-screen w-full bg-white text-umBlue">
      <div className="mx-auto max-w-4xl px-3 py-10 sm:px-6 sm:py-14 lg:px-10 xl:px-16 2xl:px-24">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-umMaize">
            Keep it chill. Keep it safe.
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Safety
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
            MStudy is here to help you find a study partner&mdash;not put you in uncomfortable
            situations. Use good judgment, and don&apos;t hesitate to stop a conversation if it
            feels off.
          </p>
        </header>

        <section className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-umBlue/10 text-umBlue ring-1 ring-umBlue/20">
                &#128274;
              </div>
              <h2 className="text-lg font-bold">Keep personal info personal</h2>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Don&apos;t share sensitive info (home address, passwords, financial info). Keep
              conversations focused on classes and studying.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-umMaize/25 text-umBlue ring-1 ring-umMaize/40">
                &#129517;
              </div>
              <h2 className="text-lg font-bold">Set expectations early</h2>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              A quick &ldquo;quiet study?&rdquo; vs &ldquo;talk through problems?&rdquo; upfront
              avoids awkwardness later. You&apos;re both here to learn.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:mt-14 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-umBlue/10 text-umBlue ring-1 ring-umBlue/20">
              &#128272;
            </div>
            <div>
              <h2 className="text-lg font-bold sm:text-xl">About the info you share</h2>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                We only ask for a few basics&mdash;your{" "}
                <span className="font-semibold text-umBlue">umich.edu</span> email, name, and
                gender preferences&mdash;so we can verify you&apos;re a U&#8209;M student and help
                you find better matches. It shouldn&apos;t put you at risk.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-umMaize/40 text-umBlue text-[0.7rem] font-black">
                    &bull;
                  </span>
                  <span>
                    <span className="font-semibold text-umBlue">Your email</span> is for
                    verification and account access (not for random messages).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-umMaize/40 text-umBlue text-[0.7rem] font-black">
                    &bull;
                  </span>
                  <span>
                    <span className="font-semibold text-umBlue">Your name</span> helps study
                    partners know who they&apos;re meeting up with.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-umMaize/40 text-umBlue text-[0.7rem] font-black">
                    &bull;
                  </span>
                  <span>
                    <span className="font-semibold text-umBlue">Gender preferences</span> are
                    optional and are only used for matching.
                  </span>
                </li>
              </ul>
              <p className="mt-4 text-xs text-slate-600">
                You&apos;re always in control: don&apos;t share anything you wouldn&apos;t want a
                classmate to know, and keep the rest of the chat study-focused.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-umBlue/20 bg-gradient-to-r from-umBlue/5 to-umMaize/10 p-6 sm:mt-16 sm:p-8">
          <h2 className="text-xl font-black tracking-tight">Quick reminders</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-umBlue text-white text-[0.7rem]">
                1
              </span>
              <span>
                <span className="font-semibold text-umBlue">
                  Off-site communication is your choice.
                </span>{" "}
                Once you decide to connect (email/text/etc.), MStudy isn&apos;t part of that
                conversation&mdash;share only what you&apos;re comfortable with.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-umBlue text-white text-[0.7rem]">
                2
              </span>
              <span>
                <span className="font-semibold text-umBlue">No pressure.</span> If someone makes
                you uncomfortable, stop engaging.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-umBlue text-white text-[0.7rem]">
                3
              </span>
              <span>
                <span className="font-semibold text-umBlue">Emergency situations:</span> If you
                feel unsafe, contact emergency services or campus resources.
              </span>
            </li>
          </ul>
          <p className="mt-5 text-xs text-slate-600">
            MStudy doesn&apos;t verify identities beyond app-level checks and can&apos;t guarantee
            user behavior. You&apos;re always in control of who you talk to and when you meet.
          </p>
        </section>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-umBlue to-umMaize px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-umBlue/20 transition hover:brightness-110"
          >
            Back to home
            <span className="text-lg leading-none">&larr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

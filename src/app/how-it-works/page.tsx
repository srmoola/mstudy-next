import Link from "next/link";

export const metadata = { title: "How it works – MStudy" };

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen w-full bg-white text-umBlue">
      <div className="mx-auto max-w-4xl px-3 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-18 xl:px-16 2xl:px-24">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-umMaize">
            Simple as 1, 2, 3
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            How we match you
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-slate-600 text-sm sm:text-base">
            We use the preferences you enter to surface other U-M students who fit. No algorithms
            guessing; just what you tell us.
          </p>
        </header>

        <section className="mt-12 sm:mt-16 space-y-8 sm:space-y-10">
          {[
            {
              step: 1,
              title: "Enter your preferences",
              desc: "Tell us your courses, when you like to study, where (north campus, central campus), and whether you'd rather be matched with the same or any gender study partners. The more you share, the better the matches.",
            },
            {
              step: 2,
              title: "We find your people",
              desc: "MStudy matches you with other verified U-M students who have similar preferences—courses, study times, and what you're looking for. You'll see profiles you can say yes or no to.",
            },
            {
              step: 3,
              title: "Connect and study",
              desc: "When you both say yes, you can message to pick a time and place. From there it's up to you—Dude, Ugli, your dorm, wherever works.",
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="relative flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-umBlue to-umMaize text-2xl font-black text-white shadow-lg shadow-umBlue/20 ring-4 ring-umBlue/10">
                {step}
              </div>
              <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/50 px-6 py-5 sm:px-8 sm:py-6">
                <h2 className="text-lg font-bold text-umBlue sm:text-xl">{title}</h2>
                <p className="mt-2 text-sm text-slate-600 sm:text-base">{desc}</p>
              </div>
            </div>
          ))}
        </section>

        <div className="mt-14 sm:mt-18 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            What we match on
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {["Courses", "Preferences", "Location"].map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-umBlue/10 px-4 py-2 text-sm font-medium text-umBlue ring-1 ring-umBlue/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 sm:mt-16 text-center">
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

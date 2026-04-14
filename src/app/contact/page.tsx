const CONTACT_EMAIL = "mstudyumich@gmail.com";

export default function ContactPage() {
  return (
    <main className="min-h-screen w-full bg-white text-umBlue">
      <div className="mx-auto max-w-3xl px-3 py-10 sm:px-6 sm:py-14 lg:px-10 xl:px-16 2xl:px-24">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-umMaize">
            Contact MStudy
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Contact us</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
            Questions, feedback, or support requests? Reach us directly by email.
          </p>
        </header>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:mt-10 sm:p-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-umBlue/5 text-umBlue">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 6h16v12H4z" />
                <path d="m4 8 8 6 8-6" />
              </svg>
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Email us directly
            </p>
            <p className="mt-2 text-lg font-semibold text-umBlue sm:text-xl">{CONTACT_EMAIL}</p>
            <p className="mt-2 text-sm text-slate-500">
              Copy this address into your email app to get in touch with the MStudy team.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

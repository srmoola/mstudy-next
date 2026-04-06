import Link from "next/link";

export const metadata = { title: "Check Your Email – MStudy" };

export default function CheckYourEmailPage() {
  return (
    <main className="min-h-screen w-full bg-white text-umBlue">
      <div className="mx-auto flex max-w-lg flex-col items-center px-3 py-16 text-center sm:px-6 sm:py-24">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-umBlue to-umMaize text-4xl text-white shadow-lg shadow-umBlue/30">
          &#9993;
        </div>

        <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
          Check your email
        </h1>

        <p className="mt-4 max-w-md text-sm text-slate-600 sm:text-base">
          We&apos;ve sent a verification link to your email address. Click the link to activate
          your MStudy account.
        </p>

        <p className="mt-2 text-sm text-slate-500">
          If you don&apos;t see it, check your spam folder.
        </p>

        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50/60 px-6 py-4 text-sm text-slate-600">
          <p className="font-semibold text-umBlue">Didn&apos;t get the email?</p>
          <p className="mt-1">
            <Link
              href="/verify"
              className="font-semibold text-umBlue underline decoration-umMaize underline-offset-4 transition hover:text-umMaize"
            >
              Click here to resend the verification email
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="text-sm font-semibold text-umBlue underline decoration-umMaize underline-offset-4 transition hover:text-umMaize"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

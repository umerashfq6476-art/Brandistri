import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams: { redirectTo?: string };
}

export default function AdminLoginPage({ searchParams }: LoginPageProps) {
  const redirectTo = searchParams?.redirectTo;
  const safeRedirect =
    redirectTo && redirectTo.startsWith("/admin") ? redirectTo : "/admin";

  return (
    <div className="min-h-screen w-full bg-background text-text-primary flex items-center justify-center px-6 py-16">
      {/* Ambient gradient backdrop — purely decorative, blends into #0A0A0A */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(99,102,241,0.10), transparent 70%), radial-gradient(45% 35% at 50% 100%, rgba(173,255,47,0.05), transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-md">
        <LoginForm redirectTo={safeRedirect} />

        <p className="mt-8 text-center text-xs text-text-muted">
          Brandistri admin — authorized access only.
        </p>
      </div>
    </div>
  );
}

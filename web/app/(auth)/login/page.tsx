import LoginForm from "@/components/LoginForm";
import { Suspense } from "react";

export const metadata = {
  title: "FinGuru — Sign in",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-teal-300">FinGuru</h1>
          <p className="text-sm text-gray-400">
            This guide is private. Enter the password to continue.
          </p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}

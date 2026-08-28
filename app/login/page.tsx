import { Suspense } from "react";
import { UserLoginForm } from "@/components/auth/user-login-form";

export const metadata = { title: "Login | Crayon2Couture" };

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cream text-muted">
          Loading...
        </div>
      }
    >
      <UserLoginForm />
    </Suspense>
  );
}

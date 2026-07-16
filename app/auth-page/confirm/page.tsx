"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

function ConfirmEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link");
        toast.error("Invalid verification link");
        setTimeout(() => {
          router.push("/auth-page/register");
        }, 3000);
        return;
      }

      try {
        const response = await fetch(`/api/auth/confirm?token=${token}`, {
          method: "GET",
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage("Account verified successfully!");
          toast.success("Account verified successfully!");
          setTimeout(() => {
            router.push("/user-dashboard/dashboard");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
          toast.error(data.error || "Verification failed");
          setTimeout(() => {
            router.push("/auth-page/register");
          }, 3000);
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred during verification");
        toast.error("An error occurred during verification");
        setTimeout(() => {
          router.push("/auth-page/register");
        }, 3000);
      }
    };

    confirmEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-950 font-sans">
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-6">
              <Loader2 className="h-16 w-16 animate-spin text-neutral-950" />
              <h1 className="text-2xl font-black uppercase tracking-tighter">
                Verifying your account...
              </h1>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-6">
              <CheckCircle className="h-16 w-16 text-green-600" />
              <h1 className="text-2xl font-black uppercase tracking-tighter">
                {message}
              </h1>
              <p className="text-sm text-neutral-600">
                Redirecting to dashboard...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-6">
              <XCircle className="h-16 w-16 text-red-600" />
              <h1 className="text-2xl font-black uppercase tracking-tighter">
                {message}
              </h1>
              <p className="text-sm text-neutral-600">
                Redirecting to registration...
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-white text-neutral-950 font-sans">
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md text-center">
            <Loader2 className="h-16 w-16 animate-spin text-neutral-950 mx-auto" />
          </div>
        </main>
      </div>
    }>
      <ConfirmEmailContent />
    </Suspense>
  );
}

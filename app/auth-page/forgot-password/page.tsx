"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowLeft, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 3 && !agreedToTerms) {
      toast.error("Please agree to the Terms and Condition");
      return;
    }

    setIsLoading(true);

    try {
      if (step === 1) {
        // Send OTP email
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const email = formData.get("email") as string;
        setUserEmail(email);

        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(data.message);
          setStep(2);
        } else {
          toast.error(data.error || "Failed to send reset code");
        }
      } else if (step === 2) {
        // Verify OTP (just move to step 3 for password reset)
        const otpCode = otp.join("");
        if (otpCode.length !== 4) {
          toast.error("Please enter the complete 4-digit code");
          setIsLoading(false);
          return;
        }
        setStep(3);
      } else if (step === 3) {
        // Reset password
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const newPassword = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (newPassword !== confirmPassword) {
          toast.error("Passwords do not match");
          setIsLoading(false);
          return;
        }

        const otpCode = otp.join("");

        const response = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            otp: otpCode,
            newPassword,
            confirmPassword,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(data.message);
          setTimeout(() => {
            router.push("/auth-page/login");
          }, 1500);
        } else {
          toast.error(data.error || "Failed to reset password");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-0 md:p-6">
      <div className="w-full md:h-auto md:max-w-5xl flex flex-col md:flex-row bg-white md:rounded-[2rem] md:shadow-2xl md:shadow-indigo-950/20 md:border md:border-neutral-200 overflow-hidden">
        {/* Left Panel - gradient hero, hidden on mobile */}
        <div className="hidden md:flex relative w-1/2 flex-col justify-between p-8 m-3 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-600 to-indigo-200">
          {/* soft blurred blobs for depth */}
          <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-indigo-400/40 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-white/20 blur-3xl" />

          <Link href="/">
            <div className="relative z-10 w-30 h-30">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain w-full"
            />
            </div>
          </Link>

          <div className="relative z-10 text-white">
            <p className="text-sm font-medium text-indigo-100 mb-2">
              You can easily
            </p>
            <h2 className="text-2xl font-bold leading-snug">
              {step === 1 && "Recover your account in seconds"}
              {step === 2 && "Verify your identity"}
              {step === 3 && "Set a new secure password"}
            </h2>
          </div>
        </div>

        {/* Right Panel - form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-10 md:px-10 py-10">
          <div className="w-full max-w-sm mx-auto">
            {/* Logo, shown on mobile only since left panel is hidden */}
            <Link href="/">
              <div className="md:hidden h-20 w-20 relative mb-2">
                <Image src="/logo.png" alt="Logo" fill className="object-contain" />
              </div>
            </Link>

            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950">
              {step === 1 && "Forgot Password"}
              {step === 2 && "Verify Code"}
              {step === 3 && "Reset Password"}
            </h1>
            <p className="text-sm text-neutral-600 mt-2 mb-8 leading-relaxed">
              {step === 1 && "Enter your email to receive a reset code."}
              {step === 2 && "Enter the 4-digit code sent to your email."}
              {step === 3 && "Enter and confirm your new password."}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* STEP 1: EMAIL */}
              {step === 1 && (
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-neutral-800"
                  >
                    Your email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                    className="h-12 text-sm px-4 rounded-xl border border-neutral-300 bg-white text-neutral-950 focus-visible:ring-0 focus-visible:border-indigo-500 placeholder:text-neutral-400"
                  />
                </div>
              )}

              {/* STEP 2: OTP BOXES */}
              {step === 2 && (
                <div className="flex justify-between gap-3 py-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-16 h-16 text-center text-2xl font-bold rounded-xl border border-neutral-300 bg-white text-neutral-950 focus:border-indigo-500 outline-none transition-all"
                      disabled={isLoading}
                      required
                    />
                  ))}
                </div>
              )}

              {/* STEP 3: NEW PASSWORD & TERMS CHECKBOX */}
              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-neutral-800"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                        className="h-12 pr-12 px-4 text-sm rounded-xl border border-neutral-300 bg-white text-neutral-950 focus-visible:ring-0 focus-visible:border-indigo-500 placeholder:text-neutral-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-neutral-500 hover:text-neutral-950 focus:outline-none cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-semibold text-neutral-800"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                        className="h-12 pr-12 px-4 text-sm rounded-xl border border-neutral-300 bg-white text-neutral-950 focus-visible:ring-0 focus-visible:border-indigo-500 placeholder:text-neutral-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-neutral-500 hover:text-neutral-950 focus:outline-none cursor-pointer"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Terms checkbox */}
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      id="terms"
                      onClick={() => setAgreedToTerms(!agreedToTerms)}
                      className={`h-5 w-5 shrink-0 rounded-md border transition-all flex items-center justify-center cursor-pointer ${
                        agreedToTerms
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-neutral-300 bg-white hover:border-neutral-400"
                      }`}
                    >
                      {agreedToTerms && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </button>
                    <Label
                      htmlFor="terms"
                      className="text-xs font-semibold text-neutral-600 select-none leading-tight cursor-pointer"
                    >
                      I agree to the{" "}
                      <Link href="#" className="text-indigo-500 hover:text-indigo-400 transition-colors">
                        Terms and Condition
                      </Link>
                    </Label>
                  </div>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading || (step === 3 && !agreedToTerms)}
                className="w-full h-12 mt-1 rounded-xl text-sm font-semibold cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : step === 3 ? (
                  "Reset Password"
                ) : (
                  "Continue"
                )}
              </Button>

              {/* Sign In link */}
              <div className="text-center text-sm font-medium text-neutral-600 mt-2">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth-page/login"
                  className="font-semibold text-indigo-500 hover:text-indigo-400 transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </div>

          {/* Legal footer */}
          <div className="w-full max-w-sm mx-auto mt-8 text-center text-xs font-medium text-neutral-400 leading-relaxed">
            By clicking continue, you agree to our{" "}
            <Link href="#" className="font-semibold text-neutral-500 hover:text-neutral-700 transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="font-semibold text-neutral-500 hover:text-neutral-700 transition-colors">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
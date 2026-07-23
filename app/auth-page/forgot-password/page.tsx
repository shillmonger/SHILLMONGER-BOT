"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="min-h-screen flex flex-col bg-white text-neutral-950 font-sans">
      <main className="flex-grow flex items-center justify-center px-4 py-16 md:py-24">
        <div className="w-full max-w-md">
          {/* Modern Card with rounded corners and indigo accents */}
          <Card className="rounded-4xl bg-neutral-900 text-white border border-neutral-800 shadow-2xl shadow-indigo-950/50 overflow-hidden">
            <CardContent className="p-0">
              <form className="px-5 py-5 md:px-7" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  {/* Header Section */}
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight">
                      {step === 1 && "Forgot Password"}
                      {step === 2 && "Verify Code"}
                      {step === 3 && "Reset Password"}
                    </h1>
                    <p className="text-sm text-neutral-400 mt-2 leading-relaxed max-w-[280px] mx-auto">
                      {step === 1 && "Enter your email to receive a reset code."}
                      {step === 2 && "Enter the 4-digit code sent to your email."}
                      {step === 3 && "Enter and confirm your new password."}
                    </p>
                  </div>

                  {/* STEP 1: EMAIL */}
                  {step === 1 && (
                    <div className="grid gap-2">
                      <Label
                        htmlFor="email"
                        className="text-xs font-semibold tracking-wide text-neutral-300"
                      >
                        User Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        className="h-12 text-sm p-5 rounded-xl border border-neutral-700 bg-neutral-950/50 text-white focus-visible:ring-0 focus-visible:border-indigo-500 placeholder:text-neutral-500"
                        placeholder="shillmonger@example.com"
                        required
                        disabled={isLoading}
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
                          className="w-16 h-16 text-center text-2xl font-bold rounded-xl border border-neutral-700 bg-neutral-950/50 text-white focus:border-indigo-500 outline-none transition-all"
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
                          className="text-xs font-semibold tracking-wide text-neutral-300"
                        >
                          New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            className="h-12 pr-12 text-sm p-5 rounded-xl border border-neutral-700 bg-neutral-950/50 text-white focus-visible:ring-0 focus-visible:border-indigo-500 placeholder:text-neutral-500"
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-white focus:outline-none cursor-pointer"
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
                          className="text-xs font-semibold tracking-wide text-neutral-300"
                        >
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            className="h-12 pr-12 text-sm p-5 rounded-xl border border-neutral-700 bg-neutral-950/50 text-white focus-visible:ring-0 focus-visible:border-indigo-500 placeholder:text-neutral-500"
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-white focus:outline-none cursor-pointer"
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

                      {/* Terms and Conditions Checkmark */}
                      <div className="flex items-start gap-3 mt-2">
                        <button
                          type="button"
                          id="terms"
                          onClick={() => setAgreedToTerms(!agreedToTerms)}
                          className={`h-5 w-5 shrink-0 rounded-md border transition-all flex items-center justify-center cursor-pointer ${
                            agreedToTerms
                              ? "bg-indigo-600 border-indigo-600 text-white"
                              : "border-neutral-700 bg-neutral-900 hover:border-neutral-500"
                          }`}
                        >
                          {agreedToTerms && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </button>
                        <Label 
                      htmlFor="terms" 
                      className="text-xs font-semibold text-neutral-400 select-none leading-tight cursor-pointer"
                    >
                      I agree to the{" "}
                      <Link href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                        Terms and Condition
                      </Link>
                    </Label>
                      </div>
                    </div>
                  )}

                  {/* Primary Action Button */}
                  <div className="relative pt-2">
                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl text-sm font-semibold cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading || (step === 3 && !agreedToTerms)}
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
                  </div>
                </div>

                {/* login link */}
                  <div className="text-center text-sm font-semibold text-neutral-400 mt-5">
                    Don&apos;t have an account?{" "}
                    <Link 
                      href="/auth-page/login" 
                      className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Sign in
                    </Link>
                  </div>
              </form>
            </CardContent>
          </Card>

          {/* Legal Footer Info */}
          <div className="mt-8 text-center text-xs font-semibold text-neutral-500 leading-relaxed">
            By clicking continue, you agree to our{" "}
            <Link href="#" className="font-semibold text-neutral-400 hover:text-neutral-300 transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="font-semibold text-neutral-400 hover:text-neutral-300 transition-colors">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </main>
    </div>
  );
}
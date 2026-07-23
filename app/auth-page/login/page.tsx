"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setTimeout(() => {
          router.push("/user-dashboard/dashboard");
        }, 1000);
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-950 font-sans">
      <main className="flex-grow flex items-center justify-center px-4 py-10 md:py-10">
        <div className="w-full max-w-md">
          {/* Modern Card with rounded corners and indigo accents */}
          <Card className="rounded-4xl bg-neutral-900 text-white border border-neutral-800 shadow-2xl shadow-indigo-950/50 overflow-hidden">
            <CardContent className="p-0">
              <form className="px-5 py-5 md:px-7" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  {/* Title Header */}
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight">
                      Welcome Back
                    </h1>
                    <p className="text-sm text-neutral-400 mt-2">
                      Login to your account
                    </p>
                  </div>

                  {/* Input - Email/Username */}
                  <div className="grid gap-2">
                    <Label 
                      htmlFor="email" 
                      className="text-xs font-semibold tracking-wide text-neutral-300"
                    >
                      Email or Username
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      className="h-12 text-sm p-5 rounded-xl border border-neutral-700 bg-neutral-950/50 text-white focus-visible:ring-0 focus-visible:border-indigo-500 placeholder:text-neutral-500"
                      type="text"
                      placeholder="email or username"
                      disabled={isLoading}
                      required
                    />
                  </div>

                  {/* Input - Password */}
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label 
                        htmlFor="password" 
                        className="text-xs font-semibold tracking-wide text-neutral-300"
                      >
                        Password
                      </Label>
                      <Link
                        href="/auth-page/forgot-password"
                        className="text-xs font-semibold text-neutral-400 hover:text-indigo-400 transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        className="h-12 pr-12 p-5 text-sm rounded-xl border border-neutral-700 bg-neutral-950/50 text-white focus-visible:ring-0 focus-visible:border-indigo-500 placeholder:text-neutral-500"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={isLoading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
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

                  {/* Primary Call to Action Button */}
                  <div className="relative pt-2">
                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl text-sm font-semibold cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/50 transition-all"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </div>

                  {/* Divider Line */}
                  <div className="relative text-center text-xs font-semibold my-1 after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-neutral-800">
                    <span className="relative z-10 bg-neutral-900 px-3 text-neutral-400">
                      Or continue with
                    </span>
                  </div>

                  {/* Social Sign-In Row */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* X (formerly Twitter) */}
                    <Button
                      type="button"
                      className="h-12 rounded-xl cursor-pointer bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 hover:border-neutral-700 transition-all"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.637 7.584H.474l8.6-9.83L0 1.153h7.594l5.243 6.932 6.064-6.932zM17.61 20.644h2.039L6.486 3.24H4.298z" />
                      </svg>
                      <span className="sr-only">Continue with X</span>
                    </Button>

                    {/* Google */}
                    <Button
                      type="button"
                      className="h-12 rounded-xl cursor-pointer bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 hover:border-neutral-700 transition-all"
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="#FFC107"
                          d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.207 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                        />
                        <path
                          fill="#FF3D00"
                          d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4c-7.682 0-14.348 4.337-17.694 10.691z"
                        />
                        <path
                          fill="#4CAF50"
                          d="M24 44c5.104 0 9.799-1.957 13.355-5.145l-6.169-5.22C29.125 35.091 26.673 36 24 36c-5.186 0-9.623-3.326-11.283-7.946l-6.52 5.025C9.505 39.556 16.227 44 24 44z"
                        />
                        <path
                          fill="#1976D2"
                          d="M43.611 20.083H42V20H24v8h11.303c-1.058 2.996-3.202 5.379-6.117 6.635l6.169 5.22C38.999 36.564 44 31 44 24c0-1.341-.138-2.65-.389-3.917z"
                        />
                      </svg>
                      <span className="sr-only">Continue with Google</span>
                    </Button>

                    {/* Facebook */}
                    <Button
                      type="button"
                      className="h-12 rounded-xl cursor-pointer bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 hover:border-neutral-700 transition-all"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="sr-only">Continue with Facebook</span>
                    </Button>
                  </div>

                  {/* Register link */}
                  <div className="text-center text-sm font-semibold text-neutral-400 mt-2">
                    Don&apos;t have an account?{" "}
                    <Link 
                      href="/auth-page/register" 
                      className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Sign up
                    </Link>
                  </div>
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
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import useLogin from "@/app/hooks/useLogin";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useLogin();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await login(formData);

    if (result) {
      localStorage.setItem("token", result.token);
      if(result.role === "admin"){
        router.push("/admin/dashboard");
      }else{
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-4 md:px-12 py-8 bg-surface-secondary">
      <div className="flex flex-col md:flex-row items-center gap-x-49 max-w-screen-xl w-full mx-auto">
        <div className="flex flex-row items-center justify-center gap-6 mb-8 md:mb-0">
          <Image
            src="/Images/Group 184.png"
            alt="Tesfa Logo"
            width={300}
            height={300}
            className="rounded-full drop-shadow-lg"
          />
          <div className="h-70 w-px bg-gray-300"></div>
          <Image
            src="/Images/Ona Insights -thumbnail.svg"
            alt="Ona Insights"
            width={250}
            height={250}
            className="opacity-90"
          />
        </div>
        <div className="md:w-1/2 text-left max-w-md">
          <h2 className="text-xl md:text-5xl text-center font-semibold mb-8 relative text-accent">
            Welcome Back!
            <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"></span>
          </h2>
          <p className="text-4xl font-normal text-center text-primary">Login</p>
          <form onSubmit={handleSubmit} className="space-y-5 mt-15 text-gray-900">
            <div>
              <label htmlFor="email" className="block text-2xl font-light mb-1 text-primary">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:border-transparent transition text-gray-900"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-2xl font-light mb-1 text-primary">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:border-transparent transition pr-12 text-gray-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-3 top-12 text-xl text-primary"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>

            <Link
            href="/reset-password"
            className="text-sm hover:underline mb-4 inline-block cursor-pointer text-gray-400"
            >
              Forgot password?
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-extrabold py-3 rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-1 cursor-pointer bg-primary"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            <p className="text-center text-xl mt-4 text-primary">
              Don't have an account?{" "}
              <a href="/onboarding/register" className="font-bold hover:underline text-accent">
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/onboarding/welcome");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4 py-8 bg-surface-secondary">

      <Image
        src="/Images/Group66.png"
        alt="Logo"
        width={400}
        height={200}
        className="mb-26 w-48 md:w-100 h-auto object-contain"
      />

      <p className="text-xl md:text-5xl font-medium leading-relaxed italic text-primary">
        The essence of{" "}
        <span className="font-semibold text-accent">hope</span> and{" "}
        <span className="font-semibold text-accent">renewal</span> after
        hardship
      </p>

      <div className="mt-8 w-100 mx-auto">
        <div className="h-1 w-full mb-10 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
      </div>
      <div className="fixed bottom-6 left-0 right-0 flex flex-col items-center gap-1">
  <p className="text-gray-500 text-xs">A Demo by:</p>
  <Image
    src="/Images/Ona Insights Logo - black .png"
    alt="Ona Insights"
    width={300}
    height={70}
    className="opacity-80"
  />
</div>
    </div>
  );
}
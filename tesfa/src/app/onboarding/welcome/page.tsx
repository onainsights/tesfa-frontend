"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";



export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen px-6 md:px-12 py-12 bg-surface-secondary">

      <div className="flex flex-col md:flex-row items-center gap-x-50 max-w-screen-xl w-full">


        <div className="flex justify-center mb-8 md:mb-0">
          <Image
            src="/Images/Group 184.png"
            alt="Logo"
            width={500}
            height={200}
            className="rounded-full drop-shadow-lg"
          />
        </div>


        <div className="text-left max-w-md">
          <h1 className="text-4xl md:text-7xl font-normal mb-15 relative text-center text-accent">
            Welcome
            <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent"></span>
          </h1>

          <p className="font-light md:text-4xl leading-relaxed mb-8 text-center text-primary">
            By restoring health and safety, we help bring happiness and brighter futures to those who need it most.
          </p>

          <button
            onClick={() => router.push("/onboarding/register")}
            className="w-full text-white text-base md:text-2xl cursor-pointer font-extrabold px-8 py-3 rounded-md transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-1 bg-primary"
          >
            Get Started
          </button>

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
      </div>
    </div>
  );
}
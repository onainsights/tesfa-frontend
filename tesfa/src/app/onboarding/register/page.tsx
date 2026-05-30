import { Suspense } from 'react';
import RegisterForm from './components/RegisterForm';
import Image from 'next/image';

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ agreed?: string }>;
}) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-surface-secondary px-4 md:px-12 py-8">
      <div className="flex flex-col md:flex-row items-center gap-x-50 max-w-screen-xl w-full mx-auto">
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
        <Suspense fallback={<div className="md:w-1/2 max-w-md">Loading...</div>}>
          <RegisterForm searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
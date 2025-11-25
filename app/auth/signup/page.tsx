// src/app/auth/login/page.tsx
import { Suspense } from 'react';
import SignupPageClient from './SignUpForm';

export default function LoginPage() {
  return (
    // The fallback UI is shown while the browser figures out the URL params
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <SignupPageClient />
    </Suspense>
  );
}
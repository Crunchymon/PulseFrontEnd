'use client';
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/context/auth-context"
import PulseLoading from "@/components/ui/pulse-loading"
import PulseLogo from "@/components/PulseLogo"
import Link from "next/link"

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/dashboard'

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(redirectUrl)
    }
  }, [isAuthenticated, loading, router, redirectUrl])

  if (loading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <PulseLoading size="large" gradientType="coral" text="Authenticating..." />
      </div>
    )
  }

  return (
    <div className="bg-orange-50 dark:bg-orange-950/10 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <PulseLogo></PulseLogo>
        </Link>
        <LoginForm />
      </div>
    </div>
  )
}

"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2, ArrowLeft, ShieldCheck, Eye, EyeOff, CheckCircle2 } from "lucide-react"

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin"

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword]     = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]           = useState("")
  const [loading, setLoading]       = useState(false)
  const [success, setSuccess]       = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading || success) return

    const cleanId = identifier.trim()
    const rawPass = password

    if (!cleanId || !rawPass) {
      setError("Please fill in both fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      // 1. Try signing in with exact credentials
      const res = await signIn("credentials", {
        identifier: cleanId,
        email: cleanId,
        password: rawPass,
        redirect: false,
      })

      if (res?.ok) {
        setSuccess(true)
        // Hard navigate so fresh NextAuth session cookies are delivered cleanly
        window.location.href = callbackUrl || "/admin"
        return
      }

      // 2. If exact password failed, try trimmed in case of mobile auto-space
      if (rawPass.trim() !== rawPass) {
        const retryRes = await signIn("credentials", {
          identifier: cleanId,
          email: cleanId,
          password: rawPass.trim(),
          redirect: false,
        })

        if (retryRes?.ok) {
          setSuccess(true)
          window.location.href = callbackUrl || "/admin"
          return
        }
      }

      // 3. Handle errors
      if (res?.error) {
        if (res.error === "CredentialsSignin") {
          setError("Invalid username/email or password")
        } else {
          setError(res.error)
        }
      } else {
        setError("Invalid username/email or password")
      }
      setLoading(false)
    } catch (err: unknown) {
      console.error("Sign-in exception:", err)
      setError("Network or authentication issue. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative">
      {/* Top navigation back button */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg bg-card border border-border shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Website
        </Link>
      </div>

      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Sign in to manage your portfolio</p>
          </div>
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Username or Email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              disabled={loading || success}
              placeholder="e.g. ezedinmoh or email"
              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || success}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-10 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium animate-in fade-in duration-200">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Signed in successfully! Redirecting...</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 shadow-md cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : success ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Entering Admin...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-border/60 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Portfolio Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

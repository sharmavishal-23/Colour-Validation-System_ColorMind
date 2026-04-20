"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { BackgroundBlobs } from "@/components/background-blobs"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Palette, User, Lock, Sparkles, ArrowRight } from "lucide-react"
import Image from "next/image"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { login, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoggingIn(true)

    const success = await login(email, password)
    
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Oops! Please check your email and password.")
      setIsLoggingIn(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Getting things ready..." size="lg" />
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Taking you to your dashboard..." size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <BackgroundBlobs variant="login" />
      
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Illustration & Welcome */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center">
          <div className="relative w-full max-w-md aspect-square mb-6">
            <Image
              src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80"
              alt="Designer working with colorful palettes"
              fill
              className="object-cover rounded-3xl shadow-2xl"
              priority
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary rounded-2xl flex items-center justify-center shadow-lg animate-bounce-soft">
              <Palette className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Your Color Journey Starts Here!
          </h2>
          <p className="text-muted-foreground max-w-sm">
            Validate colors, build stunning palettes, and get smart suggestions for any project.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full max-w-md mx-auto border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                <Palette className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">ColorMind</h1>
                <p className="text-xs text-muted-foreground">Design Color Validation</p>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-1">
                Welcome to ColorMind
              </h3>
              <p className="text-sm text-muted-foreground">
                Sign in to start creating beautiful palettes
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field>
                <FieldLabel className="flex items-center gap-2 text-foreground">
                  <User className="w-4 h-4" />
                  Email
                </FieldLabel>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-xl h-12 pl-4 pr-4 border-2 border-input focus:border-primary transition-colors bg-secondary/30"
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel className="flex items-center gap-2 text-foreground">
                  <Lock className="w-4 h-4" />
                  Password
                </FieldLabel>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Your secret password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={4}
                    className="rounded-xl h-12 pl-4 pr-4 border-2 border-input focus:border-primary transition-colors bg-secondary/30"
                  />
                </div>
              </Field>

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-xl text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full h-14 rounded-xl text-lg font-semibold btn-bounce bg-primary hover:bg-primary/90"
              >
                {isLoggingIn ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" message="" />
                    Creating magic...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {"Let's create"}
                    <Sparkles className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or try a demo</span>
              </div>
            </div>

            {/* Demo Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEmail("demo@colormind.app")
                setPassword("demo1234")
              }}
              className="w-full h-12 rounded-xl border-2 btn-bounce"
            >
              <span className="flex items-center gap-2">
                Use Demo Account
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>

            {/* Footer */}
            <p className="text-center text-xs text-muted-foreground mt-6">
              Just exploring? Use any email and password to get started!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}

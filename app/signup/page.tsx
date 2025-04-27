"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, User, Lock, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import SystemBanner from "@/components/system-banner"
import AdSlot from "@/components/ad-slot"
import AsciiArt from "@/components/ascii-art"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignupPage() {
  const router = useRouter()
  const { signup, isAuthenticated, debugMode, storageMode } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setDebugInfo("Form submitted")

    // Validate form
    if (!email.trim() || !username.trim() || !password || !confirmPassword) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      setDebugInfo("Missing fields")
      return
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      setDebugInfo("Invalid email")
      return
    }

    if (username.length < 3) {
      toast({
        title: "Username Too Short",
        description: "Username must be at least 3 characters",
        variant: "destructive",
      })
      setDebugInfo("Username too short")
      return
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      })
      setDebugInfo("Password too short")
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      })
      setDebugInfo("Passwords don't match")
      return
    }

    if (!agreedToTerms) {
      toast({
        title: "Terms Not Accepted",
        description: "You must agree to the Terms of Service to create an account",
        variant: "destructive",
      })
      setDebugInfo("Terms not accepted")
      return
    }

    setIsSubmitting(true)
    setDebugInfo("Attempting signup...")

    try {
      // Use the signup function from the auth context
      const result = await signup(email, username, password)
      setDebugInfo(`Signup result: ${JSON.stringify(result)}`)

      if (result.success) {
        toast({
          title: "Account Created",
          description: "Your account has been created successfully!",
        })
        router.push("/")
      } else {
        toast({
          title: "Signup Failed",
          description: result.error || "An unexpected error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error during signup:", error)
      setDebugInfo(`Error: ${error instanceof Error ? error.message : String(error)}`)

      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isMounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <SystemBanner message="创建您的 TRON Board 账户" />

      <AdSlot type="banner" />

      <Link
        href="/"
        className="flex items-center text-muted-foreground hover:text-primary transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back to Home</span>
      </Link>

      <AsciiArt type="header" text="CREATE YOUR ACCOUNT" />

      <div className="max-w-md mx-auto">
        <div className="bg-card border-2 border-dashed border-primary/40 p-4 animate-fade-in">
          <h1 className="text-2xl font-medium mb-4 pixel-text">
            Sign Up
            <span className="chinese-caption block">注册账户</span>
          </h1>

          {debugMode && (
            <div className="mb-4 p-2 bg-muted/30 text-xs font-mono">
              <p>Storage Mode: {storageMode}</p>
              <p>Using localStorage fallback: {storageMode === "localStorage" ? "Yes" : "No"}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
                <span className="chinese-caption">电子邮箱</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background border border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Username
                <span className="chinese-caption">用户名</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-background border border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  placeholder="Choose a username..."
                  maxLength={20}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
                <span className="chinese-caption">密码</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-background border border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  placeholder="Create a password..."
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
                <span className="chinese-caption">确认密码</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-background border border-border text-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  placeholder="Confirm your password..."
                />
              </div>
            </div>

            <div className="flex items-start space-x-2 mt-4">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                className="mt-1"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the Terms of Service and Privacy Policy
                  <span className="chinese-caption block">我同意服务条款和隐私政策</span>
                </label>
                <p className="text-xs text-muted-foreground">
                  By creating an account, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bracket-button w-full text-center"
                onClick={handleSubmit}
              >
                {isSubmitting ? "Creating Account..." : "Create Account 创建账户"}
              </button>
            </div>

            {debugMode && debugInfo && (
              <div className="mt-2 p-2 bg-muted/30 text-xs font-mono">
                <p>Debug: {debugInfo}</p>
              </div>
            )}
          </form>
        </div>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      <AdSlot type="banner" />
    </div>
  )
}

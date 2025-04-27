"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"

// Define the user type
interface User {
  id: string
  email: string
}

// Define the user profile type
interface UserProfile {
  id: string
  username: string
  email: string
  avatar_url: string | null
  bio: string | null
  prestige_score: number
  is_admin: boolean
  role: string
  created_at: string
}

// Define the auth context type
interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  signup: (email: string, username: string, password: string) => Promise<{ success: boolean; error?: string }>
  updatePrestigeScore: (action: string, amount?: number) => void
  refreshUserProfile: () => Promise<void>
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabaseClient: any = null

if (supabaseUrl && supabaseKey) {
  supabaseClient = getSupabaseClient()
}

// Create the auth provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const authInitialized = useRef(false)
  const profileFetchInProgress = useRef(false)

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    // Prevent concurrent profile fetches
    if (profileFetchInProgress.current) return null

    profileFetchInProgress.current = true

    try {
      if (!supabaseClient) return null

      const { data, error } = await supabaseClient.from("users").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching user profile:", error)

        // If the profile doesn't exist, try to create it from auth metadata
        if (error.code === "PGRST116") {
          try {
            const { data: userData } = await supabaseClient.auth.getUser()
            if (userData?.user) {
              const metadata = userData.user.user_metadata

              // Create profile using API route to bypass RLS
              const response = await fetch("/api/auth/create-profile", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: userId,
                  email: userData.user.email,
                  username: metadata?.username || `user_${userId.substring(0, 8)}`,
                  avatar_url: metadata?.avatar_url || "/placeholder.svg?height=96&width=96",
                  prestige_score: 0,
                  is_admin: false,
                  role: "user",
                }),
              })

              if (response.ok) {
                // Try fetching the profile again
                const { data: newProfile } = await supabaseClient.from("users").select("*").eq("id", userId).single()
                return newProfile
              }
            }
          } catch (createError) {
            console.error("Error creating missing profile:", createError)
          }
        }
        return null
      }

      return data
    } catch (error) {
      // Improved error handling for rate limiting and other errors
      if (error instanceof SyntaxError && error.message.includes("Unexpected token")) {
        console.error("Rate limiting error in fetchUserProfile. Too many requests.")
      } else {
        console.error("Error fetching user profile:", error)
      }
      return null
    } finally {
      profileFetchInProgress.current = false
    }
  }

  // Handle auth state changes
  const handleAuthChange = async (session: any) => {
    if (isLoading === false) {
      setIsLoading(true)
    }

    try {
      if (session?.user) {
        setUser(session.user)

        // Fetch user profile
        const profile = await fetchUserProfile(session.user.id)
        setUserProfile(profile)
      } else {
        setUser(null)
        setUserProfile(null)
      }
    } catch (error) {
      console.error("Error handling auth change:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize auth state
  useEffect(() => {
    if (!supabaseClient || authInitialized.current) {
      return
    }

    authInitialized.current = true

    // Get initial session
    const initAuth = async () => {
      try {
        const { data } = await supabaseClient.auth.getSession()
        await handleAuthChange(data.session)

        // Subscribe to auth changes
        const { data: authListener } = supabaseClient.auth.onAuthStateChange(async (event: string, session: any) => {
          console.log("Auth state changed:", event, session ? "session exists" : "no session")
          await handleAuthChange(session)
        })

        return () => {
          authListener?.subscription?.unsubscribe()
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      if (!supabaseClient) {
        return { success: false, error: "Supabase client not available" }
      }

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error)
        return { success: false, error: error.message }
      }

      if (!data.user) {
        return { success: false, error: "No user returned from login" }
      }

      // Manually trigger profile fetch to ensure we have the latest data
      const profile = await fetchUserProfile(data.user.id)

      // If profile is still null after login, try to create it
      if (!profile) {
        try {
          const response = await fetch("/api/auth/create-profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              username: data.user.user_metadata?.username || `user_${data.user.id.substring(0, 8)}`,
              avatar_url: data.user.user_metadata?.avatar_url || "/placeholder.svg?height=96&width=96",
              prestige_score: 0,
              is_admin: false,
              role: "user",
            }),
          })

          if (!response.ok) {
            console.warn("Failed to create missing profile during login")
          }
        } catch (profileError) {
          console.error("Error creating profile during login:", profileError)
        }
      }

      return { success: true }
    } catch (error: any) {
      console.error("Unexpected login error:", error)
      return { success: false, error: error.message }
    }
  }

  // Logout function
  const logout = async () => {
    try {
      if (!supabaseClient) return

      await supabaseClient.auth.signOut()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  // Signup function
  const signup = async (email: string, username: string, password: string) => {
    try {
      if (!supabaseClient) {
        return { success: false, error: "Supabase client not available" }
      }

      // Check if username is already taken
      const { data: existingUser, error: usernameCheckError } = await supabaseClient
        .from("users")
        .select("username")
        .eq("username", username)
        .maybeSingle()

      if (usernameCheckError) {
        return { success: false, error: usernameCheckError.message }
      }

      if (existingUser) {
        return { success: false, error: "Username is already taken" }
      }

      // Sign up with Supabase Auth
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            avatar_url: "/placeholder.svg?height=96&width=96",
            prestige_score: 0,
            is_admin: false,
            role: "user",
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!data.user) {
        return { success: false, error: "Failed to create user" }
      }

      // Use server action to create user profile instead of direct insert
      // This avoids RLS policy issues
      try {
        // Call a server action to create the user profile
        const response = await fetch("/api/auth/create-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: data.user.id,
            email,
            username,
            avatar_url: "/placeholder.svg?height=96&width=96",
            prestige_score: 0,
            is_admin: false,
            role: "user",
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error("Error creating user profile via API:", errorData)
          return { success: false, error: "Failed to create user profile" }
        }
      } catch (profileError) {
        console.error("Error creating user profile:", profileError)
        // Don't fail the signup if profile creation fails
        // The profile can be created later when the user logs in
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Update prestige score
  const updatePrestigeScore = (action: string, amount = 1) => {
    if (!userProfile) return

    // Define prestige points for different actions
    const prestigePoints: { [key: string]: number } = {
      CREATE_POST: 5,
      POST_LIKE: 2,
      COMMENT_LIKE: 1,
      CREATE_COMMENT: 3,
    }

    // Calculate the prestige change
    const pointsToAdd = prestigePoints[action] * amount

    // Update the user profile
    setUserProfile({
      ...userProfile,
      prestige_score: Math.max(0, userProfile.prestige_score + pointsToAdd),
    })

    // Show a toast notification
    if (pointsToAdd > 0) {
      toast({
        title: "Prestige Increased",
        description: `You gained ${pointsToAdd} prestige points!`,
      })
    } else if (pointsToAdd < 0) {
      toast({
        title: "Prestige Decreased",
        description: `You lost ${Math.abs(pointsToAdd)} prestige points.`,
      })
    }

    // Update the prestige score in the database
    if (supabaseClient && user) {
      supabaseClient
        .from("users")
        .update({
          prestige_score: Math.max(0, userProfile.prestige_score + pointsToAdd),
        })
        .eq("id", user.id)
        .then(({ error }: any) => {
          if (error) {
            console.error("Error updating prestige score:", error)
          }
        })
    }
  }

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (!user) return

    try {
      const profile = await fetchUserProfile(user.id)
      if (profile) {
        setUserProfile(profile)
      }
    } catch (error) {
      console.error("Error refreshing user profile:", error)
    }
  }

  // Create the auth context value
  const value = {
    user,
    userProfile,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    signup,
    updatePrestigeScore,
    refreshUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Create a hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

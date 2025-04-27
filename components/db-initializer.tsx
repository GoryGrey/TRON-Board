"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Database, Check, AlertCircle } from "lucide-react"

export default function DbInitializer() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message])
  }

  const initializeDatabase = async () => {
    if (!supabase) {
      setError("Supabase client not available. Please check your environment variables.")
      toast({
        title: "Initialization Failed",
        description: "Supabase client not available",
        variant: "destructive",
      })
      return
    }

    setIsInitializing(true)
    setError(null)
    setLogs([])
    addLog("Starting database initialization...")

    try {
      // Check if users table exists
      addLog("Checking if users table exists...")
      const { error: usersCheckError } = await supabase.from("users").select("count").limit(1)

      if (usersCheckError && usersCheckError.message.includes("does not exist")) {
        addLog("Users table doesn't exist. Creating tables...")

        // Enable UUID extension
        addLog("Enabling UUID extension...")
        await supabase.rpc("extensions", {
          name: "uuid-ossp",
        })

        // Create users table
        addLog("Creating users table...")
        const { error: createUsersError } = await supabase.rpc("create_table", {
          table_name: "users",
          definition: `
            id UUID PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE NOT NULL,
            avatar_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE
          `,
        })

        if (createUsersError) {
          throw new Error(`Failed to create users table: ${createUsersError.message}`)
        }

        // Create boards table
        addLog("Creating boards table...")
        const { error: createBoardsError } = await supabase.rpc("create_table", {
          table_name: "boards",
          definition: `
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            chinese_name TEXT NOT NULL,
            description TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE
          `,
        })

        if (createBoardsError) {
          throw new Error(`Failed to create boards table: ${createBoardsError.message}`)
        }

        // Create posts table
        addLog("Creating posts table...")
        const { error: createPostsError } = await supabase.rpc("create_table", {
          table_name: "posts",
          definition: `
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE
          `,
        })

        if (createPostsError) {
          throw new Error(`Failed to create posts table: ${createPostsError.message}`)
        }

        // Create comments table
        addLog("Creating comments table...")
        const { error: createCommentsError } = await supabase.rpc("create_table", {
          table_name: "comments",
          definition: `
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            content TEXT NOT NULL,
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
            parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE
          `,
        })

        if (createCommentsError) {
          throw new Error(`Failed to create comments table: ${createCommentsError.message}`)
        }

        // Create post_tags table
        addLog("Creating post_tags table...")
        const { error: createTagsError } = await supabase.rpc("create_table", {
          table_name: "post_tags",
          definition: `
            post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
            tag TEXT NOT NULL,
            PRIMARY KEY (post_id, tag)
          `,
        })

        if (createTagsError) {
          throw new Error(`Failed to create post_tags table: ${createTagsError.message}`)
        }

        // Insert sample boards
        addLog("Inserting sample boards...")
        const { error: insertBoardsError } = await supabase.from("boards").insert([
          {
            name: "Crypto General",
            chinese_name: "加密货币综合",
            description: "General discussion about cryptocurrencies, blockchain technology, and the market.",
          },
          {
            name: "DeFi",
            chinese_name: "去中心化金融",
            description: "Discuss decentralized finance protocols, yield farming, liquidity mining, and more.",
          },
          {
            name: "NFTs & Collectibles",
            chinese_name: "非同质化代币",
            description: "Share and discuss NFT projects, digital art, and collectibles in the blockchain space.",
          },
        ])

        if (insertBoardsError) {
          throw new Error(`Failed to insert sample boards: ${insertBoardsError.message}`)
        }

        addLog("Database initialization completed successfully!")
        setIsInitialized(true)
        toast({
          title: "Initialization Complete",
          description: "Database has been successfully initialized",
        })
      } else if (usersCheckError) {
        throw new Error(`Error checking users table: ${usersCheckError.message}`)
      } else {
        addLog("Database tables already exist!")
        setIsInitialized(true)
        toast({
          title: "Already Initialized",
          description: "Database tables already exist",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      setError(errorMessage)
      addLog(`Error: ${errorMessage}`)
      toast({
        title: "Initialization Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="bg-card border-2 border-dashed border-primary/40 p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium pixel-text">
          Database Initialization
          <span className="chinese-caption block">数据库初始化</span>
        </h2>

        <div className="flex items-center">
          {isInitialized ? (
            <div className="flex items-center text-green-500">
              <Check className="h-5 w-5 mr-1" />
              <span>Initialized</span>
            </div>
          ) : error ? (
            <div className="flex items-center text-red-500">
              <AlertCircle className="h-5 w-5 mr-1" />
              <span>Error</span>
            </div>
          ) : (
            <div className="flex items-center text-muted-foreground">
              <Database className="h-5 w-5 mr-1" />
              <span>Not Initialized</span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Initialize the database tables required for TRON Board to function properly. This will create the necessary
          tables in your Supabase database.
        </p>
      </div>

      {logs.length > 0 && (
        <div className="mb-4 bg-muted/30 p-2 rounded-md h-40 overflow-y-auto">
          <pre className="text-xs font-mono">
            {logs.map((log, index) => (
              <div key={index} className="py-0.5">
                {log}
              </div>
            ))}
          </pre>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 p-2 rounded-md">
          <p className="text-sm text-red-500">{error}</p>
          <p className="text-xs text-red-400 mt-1">
            Note: You may need to run the SQL script manually in the Supabase SQL Editor. Check the README for
            instructions.
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={initializeDatabase} disabled={isInitializing} className="bracket-button">
          {isInitializing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Initializing...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Initialize Database
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

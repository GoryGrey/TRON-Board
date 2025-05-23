export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string
          avatar_url: string | null
          prestige_score: number | null
          is_admin: boolean | null
          role: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          username: string
          avatar_url?: string | null
          prestige_score?: number | null
          is_admin?: boolean | null
          role?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          username?: string
          avatar_url?: string | null
          prestige_score?: number | null
          is_admin?: boolean | null
          role?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      boards: {
        Row: {
          id: string
          name: string
          chinese_name: string
          description: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          chinese_name: string
          description: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          chinese_name?: string
          description?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          title: string
          content: string
          user_id: string
          board_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          user_id: string
          board_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          user_id?: string
          board_id?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_board_id_fkey"
            columns: ["board_id"]
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          id: string
          content: string
          user_id: string
          post_id: string
          parent_id: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          content: string
          user_id: string
          post_id: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          content?: string
          user_id?: string
          post_id?: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          post_id: string
          tag: string
        }
        Insert: {
          post_id: string
          tag: string
        }
        Update: {
          post_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}

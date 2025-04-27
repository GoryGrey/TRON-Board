"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, FileText, Share2 } from "lucide-react"
import SystemBanner from "@/components/system-banner"
import AdSlot from "@/components/ad-slot"
import UserProfileHeader from "@/components/user-profile-header"
import PostCard from "@/components/post-card"
import CommentCard from "@/components/comment-card"
import { useAuth } from "@/contexts/auth-context"
import { getPostsByUserId } from "@/app/actions/post-actions"
import { getCommentsByUserId } from "@/app/actions/comment-actions"
import { getUserFeed } from "@/app/actions/feed-actions"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const router = useRouter()
  const { user, userProfile, isAuthenticated, isLoading } = useAuth()
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")

  // State for posts, comments, and feed
  const [posts, setPosts] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [feedItems, setFeedItems] = useState<any[]>([])

  // Loading states
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [loadingComments, setLoadingComments] = useState(false)
  const [loadingFeed, setLoadingFeed] = useState(false)

  // Pagination
  const [postsPage, setPostsPage] = useState(1)
  const [commentsPage, setCommentsPage] = useState(1)
  const [feedPage, setFeedPage] = useState(1)

  // Total counts
  const [totalPosts, setTotalPosts] = useState(0)
  const [totalComments, setTotalComments] = useState(0)
  const [totalFeedItems, setTotalFeedItems] = useState(0)

  useEffect(() => {
    setIsMounted(true)

    // If user is not authenticated and not loading, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Load data when user is authenticated and tab changes
  useEffect(() => {
    if (isAuthenticated && user && isMounted) {
      if (activeTab === "posts") {
        loadPosts()
      } else if (activeTab === "comments") {
        loadComments()
      } else if (activeTab === "feed") {
        loadFeed()
      }
    }
  }, [isAuthenticated, user, isMounted, activeTab])

  // Load posts
  const loadPosts = async () => {
    if (!user) return

    setLoadingPosts(true)
    try {
      const result = await getPostsByUserId(user.id, postsPage, 10)
      setPosts(result.posts)
      setTotalPosts(result.count || 0)
    } catch (error) {
      console.error("Error loading posts:", error)
    } finally {
      setLoadingPosts(false)
    }
  }

  // Load more posts
  const loadMorePosts = async () => {
    if (!user || loadingPosts) return

    const nextPage = postsPage + 1
    setLoadingPosts(true)

    try {
      const result = await getPostsByUserId(user.id, nextPage, 10)
      setPosts([...posts, ...result.posts])
      setPostsPage(nextPage)
    } catch (error) {
      console.error("Error loading more posts:", error)
    } finally {
      setLoadingPosts(false)
    }
  }

  // Load comments
  const loadComments = async () => {
    if (!user) return

    setLoadingComments(true)
    try {
      const result = await getCommentsByUserId(user.id, commentsPage, 10)
      setComments(result.comments)
      setTotalComments(result.count || 0)
    } catch (error) {
      console.error("Error loading comments:", error)
    } finally {
      setLoadingComments(false)
    }
  }

  // Load more comments
  const loadMoreComments = async () => {
    if (!user || loadingComments) return

    const nextPage = commentsPage + 1
    setLoadingComments(true)

    try {
      const result = await getCommentsByUserId(user.id, nextPage, 10)
      setComments([...comments, ...result.comments])
      setCommentsPage(nextPage)
    } catch (error) {
      console.error("Error loading more comments:", error)
    } finally {
      setLoadingComments(false)
    }
  }

  // Load feed
  const loadFeed = async () => {
    if (!user) return

    setLoadingFeed(true)
    try {
      const result = await getUserFeed(user.id, feedPage, 10)
      setFeedItems(result.feedItems)
      setTotalFeedItems(result.count || 0)
    } catch (error) {
      console.error("Error loading feed:", error)
    } finally {
      setLoadingFeed(false)
    }
  }

  // Load more feed items
  const loadMoreFeed = async () => {
    if (!user || loadingFeed) return

    const nextPage = feedPage + 1
    setLoadingFeed(true)

    try {
      const result = await getUserFeed(user.id, nextPage, 10)
      setFeedItems([...feedItems, ...result.feedItems])
      setFeedPage(nextPage)
    } catch (error) {
      console.error("Error loading more feed items:", error)
    } finally {
      setLoadingFeed(false)
    }
  }

  // Show loading state while checking authentication
  if (isLoading || !isMounted || !user) {
    return (
      <div className="forum-card animate-pulse p-8 text-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  // Parse created_at safely
  const parseCreatedAt = () => {
    try {
      if (!userProfile?.created_at) return new Date()
      return new Date(userProfile.created_at)
    } catch (e) {
      console.error("Error parsing created_at:", e)
      return new Date()
    }
  }

  // Create a user object for the profile header
  const currentUser = {
    id: user.id,
    name: userProfile?.username || user.email?.split("@")[0] || "User",
    avatar: userProfile?.avatar_url || "/placeholder.svg",
    bio: "Crypto enthusiast learning and sharing knowledge about Web3 and blockchain technology.",
    joinedAt: parseCreatedAt(),
    reputation: userProfile?.prestige_score || 0,
    level: Math.floor((userProfile?.prestige_score || 0) / 100) + 1,
    badges: ["Active Participant"],
    postCount: totalPosts,
    commentCount: totalComments,
    prestigeScore: userProfile?.prestige_score || 0,
    isAdmin: userProfile?.is_admin || false,
  }

  return (
    <div className="space-y-6">
      <SystemBanner message="查看您的个人资料和活动" />

      <AdSlot type="banner" />

      <UserProfileHeader user={currentUser} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-auto p-0 bg-transparent gap-2">
          <TabsTrigger
            value="posts"
            className="bg-card border border-dashed border-primary/40 flex items-center gap-2 data-[state=active]:border-accent data-[state=active]:text-accent py-2 transition-all duration-200"
          >
            <FileText className="h-4 w-4" />
            <div>
              Posts
              <span className="chinese-caption block">帖子</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="bg-card border border-dashed border-primary/40 flex items-center gap-2 data-[state=active]:border-accent data-[state=active]:text-accent py-2 transition-all duration-200"
          >
            <MessageSquare className="h-4 w-4" />
            <div>
              Comments
              <span className="chinese-caption block">评论</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="feed"
            className="bg-card border border-dashed border-primary/40 flex items-center gap-2 data-[state=active]:border-accent data-[state=active]:text-accent py-2 transition-all duration-200"
          >
            <Share2 className="h-4 w-4" />
            <div>
              Feed
              <span className="chinese-caption block">分享</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-4 space-y-4 animate-fade-in">
          {loadingPosts && posts.length === 0 ? (
            <div className="forum-card animate-pulse p-8 text-center">
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : posts.length > 0 ? (
            <>
              {posts.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isLoggedIn={true}
                  postNumber={3000 + index}
                  showShareButton={false}
                />
              ))}

              {posts.length < totalPosts && (
                <div className="text-center mt-4">
                  <Button onClick={loadMorePosts} variant="outline" disabled={loadingPosts} className="bracket-button">
                    {loadingPosts ? "Loading..." : "Load More Posts"}
                  </Button>
                </div>
              )}

              {/* Ad at the bottom of posts */}
              <AdSlot type="inline" />
            </>
          ) : (
            <div className="forum-card text-center py-8">
              <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground pixel-text">You haven't created any posts yet.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="comments" className="mt-4 space-y-4 animate-fade-in">
          {loadingComments && comments.length === 0 ? (
            <div className="forum-card animate-pulse p-8 text-center">
              <p className="text-muted-foreground">Loading comments...</p>
            </div>
          ) : comments.length > 0 ? (
            <>
              {comments.map((comment, index) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  isLoggedIn={true}
                  commentNumber={4000 + index}
                  showShareButton={false}
                />
              ))}

              {comments.length < totalComments && (
                <div className="text-center mt-4">
                  <Button
                    onClick={loadMoreComments}
                    variant="outline"
                    disabled={loadingComments}
                    className="bracket-button"
                  >
                    {loadingComments ? "Loading..." : "Load More Comments"}
                  </Button>
                </div>
              )}

              {/* Ad at the bottom of comments */}
              <AdSlot type="inline" />
            </>
          ) : (
            <div className="forum-card text-center py-8">
              <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground pixel-text">You haven't made any comments yet.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="feed" className="mt-4 space-y-4 animate-fade-in">
          {loadingFeed && feedItems.length === 0 ? (
            <div className="forum-card animate-pulse p-8 text-center">
              <p className="text-muted-foreground">Loading feed...</p>
            </div>
          ) : feedItems.length > 0 ? (
            <>
              {feedItems.map((item, index) => (
                <div key={item.id} className="animate-fade-in">
                  {item.type === "post" ? (
                    <PostCard post={item.content} isLoggedIn={true} postNumber={5000 + index} />
                  ) : (
                    <CommentCard comment={item.content} isLoggedIn={true} commentNumber={6000 + index} />
                  )}
                </div>
              ))}

              {feedItems.length < totalFeedItems && (
                <div className="text-center mt-4">
                  <Button onClick={loadMoreFeed} variant="outline" disabled={loadingFeed} className="bracket-button">
                    {loadingFeed ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}

              {/* Ad at the bottom of feed */}
              <AdSlot type="inline" />
            </>
          ) : (
            <div className="forum-card text-center py-8">
              <Share2 className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground pixel-text">
                Your feed is empty. Share posts and comments to see them here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AdSlot type="banner" />
    </div>
  )
}

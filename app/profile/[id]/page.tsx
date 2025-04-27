import { fetchUserProfile } from "@/lib/db/users"
import { getUserPosts } from "@/lib/db/posts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

export default async function ProfilePage({
  params,
}: {
  params: { id: string }
}) {
  try {
    const profile = await fetchUserProfile(params.id)

    if (!profile) {
      return (
        <div className="container mx-auto py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
          <p>The user profile you're looking for doesn't exist.</p>
        </div>
      )
    }

    // For now, let's simplify and not check for current user
    const isCurrentUser = false

    const { data: posts, hasMore } = await getUserPosts(profile.id)

    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={profile.avatar_url || ""} alt={profile.username || ""} />
            <AvatarFallback>{profile.username?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          <p className="text-gray-600">{profile.email}</p>
          {profile.bio && <p className="text-gray-700 mt-2">{profile.bio}</p>}
          {isCurrentUser && (
            <Button variant="outline" className="mt-4">
              Edit Profile
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Posts</h2>
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <div className="text-sm text-gray-500">
                      {post.created_at && formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{post.content}</p>
                  </CardContent>
                  <CardFooter className="text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div>{post.comment_count || 0} comments</div>
                      <div>{post.like_count || 0} likes</div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No posts yet</p>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Profile</h1>
        <p>There was an error loading this user profile. Please try again later.</p>
      </div>
    )
  }
}

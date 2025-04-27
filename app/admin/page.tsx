"use client"

import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllUsers, updateUserRole } from "@/lib/db/users"
import { getAllPosts, deletePost } from "@/lib/db/posts"
import { getAllComments, deleteComment } from "@/lib/db/comments"
import { getAllBoards, createBoard, deleteBoard } from "@/lib/db/boards"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createAd, deleteAd, getAllAds, updateAd } from "@/lib/db/ads" // Import the ad functions
import AuthTab from "./auth-tab"

// Define max lengths for database fields
const MAX_TITLE_LENGTH = 100
const MAX_DESCRIPTION_LENGTH = 250
const MAX_URL_LENGTH = 250

export default function AdminDashboard() {
  const { user, userProfile, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])
  const [boards, setBoards] = useState([])
  const [newBoard, setNewBoard] = useState({
    name: "",
    description: "",
    slug: "",
  })
  const [loading, setLoading] = useState(true)
  const [ads, setAds] = useState([])
  const [newAd, setNewAd] = useState({
    title: "",
    description: "",
    url: "",
    imageUrl: "",
  })
  const [editingAd, setEditingAd] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)
  const hasCheckedAdmin = useRef(false)
  const hasInitializedData = useRef(false)

  useEffect(() => {
    // Wait until auth is no longer loading
    if (authLoading) {
      return
    }

    // Check if user is logged in
    if (!user) {
      router.push("/login")
      return
    }

    // Check if user is admin
    const isAdmin = userProfile?.is_admin === true

    // Only check admin status once
    if (!hasCheckedAdmin.current) {
      hasCheckedAdmin.current = true

      if (!isAdmin) {
        router.push("/")
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        })
        return
      }
    }

    // Only fetch data once
    if (isAdmin && !hasInitializedData.current) {
      hasInitializedData.current = true

      const fetchData = async () => {
        try {
          // Fetch data with error handling for each request
          let usersData = []
          let postsData = []
          let commentsData = []
          let boardsData = []
          let adsData = []

          try {
            usersData = await getAllUsers(100) // Increase limit to get more users
            console.log("Users fetched successfully:", usersData.length)
          } catch (error) {
            console.error("Error fetching users:", error)
          }

          try {
            postsData = await getAllPosts()
          } catch (error) {
            console.error("Error fetching posts:", error)
          }

          try {
            commentsData = await getAllComments()
          } catch (error) {
            console.error("Error fetching comments:", error)
          }

          try {
            boardsData = await getAllBoards()
          } catch (error) {
            console.error("Error fetching boards:", error)
          }

          try {
            adsData = await getAllAds()

            // Add placeholder ads to the list
            // const placeholderAds = [
            //   {
            //     id: "placeholder-1",
            //     title: "Placeholder Ad 1",
            //     description: "This is a placeholder ad that can be replaced with a real ad",
            //     url: "#",
            //     image_url: "/placeholder.svg?height=200&width=300",
            //     is_active: true,
            //     is_placeholder: true,
            //     created_at: new Date().toISOString(),
            //   },
            //   {
            //     id: "placeholder-2",
            //     title: "Placeholder Ad 2",
            //     description: "This is a placeholder ad that can be replaced with a real ad",
            //     url: "#",
            //     image_url: "/placeholder.svg?height=200&width=300",
            //     is_active: true,
            //     is_placeholder: true,
            //     created_at: new Date().toISOString(),
            //   },
            //   {
            //     id: "placeholder-3",
            //     title: "Placeholder Ad 3",
            //     description: "This is a placeholder ad that can be replaced with a real ad",
            //     url: "#",
            //     image_url: "/placeholder.svg?height=200&width=300",
            //     is_active: true,
            //     is_placeholder: true,
            //     created_at: new Date().toISOString(),
            //   },
            // ]

            // Combine real ads with placeholders
            // setAds([...adsData, ...placeholderAds])
            setAds(adsData)
          } catch (error) {
            console.error("Error fetching ads:", error)
          }

          setUsers(usersData)
          setPosts(postsData)
          setComments(commentsData)
          setBoards(boardsData)
        } catch (error) {
          console.error("Error fetching admin data:", error)
          toast({
            title: "Error",
            description: "Failed to load some admin data. Please try refreshing.",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }

      fetchData()
    }
  }, [user, userProfile, router, authLoading])

  const handleMakeAdmin = async (userId) => {
    try {
      await updateUserRole(userId, "admin")
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: "admin" } : u)))
      toast({
        title: "Success",
        description: "User role updated to admin.",
      })
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveAdmin = async (userId) => {
    try {
      await updateUserRole(userId, "user")
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: "user" } : u)))
      toast({
        title: "Success",
        description: "User role updated to regular user.",
      })
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId)
      setPosts(posts.filter((p) => p.id !== postId))
      toast({
        title: "Success",
        description: "Post deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete post.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId)
      setComments(comments.filter((c) => c.id !== commentId))
      toast({
        title: "Success",
        description: "Comment deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast({
        title: "Error",
        description: "Failed to delete comment.",
        variant: "destructive",
      })
    }
  }

  const handleCreateBoard = async (e) => {
    e.preventDefault()
    try {
      const createdBoard = await createBoard(newBoard.name, newBoard.description, newBoard.slug)
      setBoards([...boards, createdBoard])
      setNewBoard({ name: "", description: "", slug: "" })
      toast({
        title: "Success",
        description: "Board created successfully.",
      })
    } catch (error) {
      console.error("Error creating board:", error)
      toast({
        title: "Error",
        description: "Failed to create board.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBoard = async (boardId) => {
    try {
      await deleteBoard(boardId)
      setBoards(boards.filter((b) => b.id !== boardId))
      toast({
        title: "Success",
        description: "Board deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting board:", error)
      toast({
        title: "Error",
        description: "Failed to delete board.",
        variant: "destructive",
      })
    }
  }

  const handleCreateAd = async (e) => {
    e.preventDefault()
    try {
      // Validate and truncate fields if necessary
      const adData = {
        title: newAd.title.slice(0, MAX_TITLE_LENGTH),
        description: newAd.description.slice(0, MAX_DESCRIPTION_LENGTH),
        url: newAd.url.slice(0, MAX_URL_LENGTH),
        imageUrl: newAd.imageUrl,
      }

      // Check if any fields were truncated and notify the user
      if (
        newAd.title.length > MAX_TITLE_LENGTH ||
        newAd.description.length > MAX_DESCRIPTION_LENGTH ||
        newAd.url.length > MAX_URL_LENGTH
      ) {
        toast({
          title: "Warning",
          description: "Some fields were too long and have been truncated.",
          variant: "warning",
        })
      }

      const createdAd = await createAd(adData)
      setAds([...ads, createdAd])
      setNewAd({ title: "", description: "", url: "", imageUrl: "" })
      toast({
        title: "Success",
        description: "Ad created successfully.",
      })
    } catch (error) {
      console.error("Error creating ad:", error)
      toast({
        title: "Error",
        description: typeof error === "string" ? error : "Failed to create ad. Please check field lengths.",
        variant: "destructive",
      })
    }
  }

  // Update the handleUpdateAd function to properly handle image updates and field lengths
  const handleUpdateAd = async (e) => {
    e.preventDefault()
    try {
      // Create a copy of the editing ad data and truncate if necessary
      const adData = {
        ...editingAd,
        title: editingAd.title.slice(0, MAX_TITLE_LENGTH),
        description: editingAd.description.slice(0, MAX_DESCRIPTION_LENGTH),
        url: editingAd.url.slice(0, MAX_URL_LENGTH),
      }

      // Check if any fields were truncated and notify the user
      if (
        editingAd.title.length > MAX_TITLE_LENGTH ||
        editingAd.description.length > MAX_DESCRIPTION_LENGTH ||
        editingAd.url.length > MAX_URL_LENGTH
      ) {
        toast({
          title: "Warning",
          description: "Some fields were too long and have been truncated.",
          variant: "warning",
        })
      }

      // Only include imageUrl in the update if it's different from the original
      if (adData.imageUrl === ads.find((ad) => ad.id === editingAd.id)?.image_url) {
        delete adData.imageUrl
      }

      const updatedAd = await updateAd(editingAd.id, adData)
      setAds(ads.map((ad) => (ad.id === editingAd.id ? updatedAd : ad)))
      setEditingAd(null)
      toast({
        title: "Success",
        description: "Ad updated successfully.",
      })
    } catch (error) {
      console.error("Error updating ad:", error)
      toast({
        title: "Error",
        description: typeof error === "string" ? error : "Failed to update ad. Please check field lengths.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAd = async (adId) => {
    try {
      // Check if it's a placeholder ad
      // if (adId.toString().includes("placeholder")) {
      //   // Just remove it from the state without database operation
      //   setAds(ads.filter((ad) => ad.id !== adId))
      //   toast({
      //     title: "Success",
      //     description: "Placeholder ad removed successfully.",
      //   })
      //   return
      // }

      // For real ads, delete from database
      await deleteAd(adId)
      setAds(ads.filter((ad) => ad.id !== adId))
      toast({
        title: "Success",
        description: "Ad deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting ad:", error)
      toast({
        title: "Error",
        description: "Failed to delete ad.",
        variant: "destructive",
      })
    }
  }

  // Update the handleImageUpload function to handle Supabase storage properly
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImage(true)

    try {
      // Create a FormData object to upload the file
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload image")
      }

      const data = await response.json()

      if (editingAd) {
        setEditingAd({ ...editingAd, imageUrl: data.url })
      } else {
        setNewAd({ ...newAd, imageUrl: data.url })
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully.",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: typeof error === "string" ? error : "Failed to upload image.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)

      // Reset the file input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="boards">Boards</TabsTrigger>
          <TabsTrigger value="ads">Ads</TabsTrigger>
          <TabsTrigger value="auth">Auth</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user roles and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.length > 0 ? (
                  users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">Role: {user.role}</p>
                      </div>
                      <div>
                        {user.role === "admin" ? (
                          <Button variant="destructive" size="sm" onClick={() => handleRemoveAdmin(user.id)}>
                            Remove Admin
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleMakeAdmin(user.id)}>
                            Make Admin
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No users found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Post Management</CardTitle>
              <CardDescription>Manage forum posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div key={post.id} className="p-2 border rounded">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{post.title}</h3>
                        <Button variant="destructive" size="sm" onClick={() => handleDeletePost(post.id)}>
                          Delete
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{post.content}</p>
                      <p className="text-xs text-muted-foreground">
                        By: {post.user_username} | Board: {post.board_name}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No posts found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Comment Management</CardTitle>
              <CardDescription>Manage forum comments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="p-2 border rounded">
                      <div className="flex justify-between">
                        <p className="text-sm truncate">{comment.content}</p>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteComment(comment.id)}>
                          Delete
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        By: {comment.user_username} | Post: {comment.post_title || "Unknown"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No comments found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="boards">
          <Card>
            <CardHeader>
              <CardTitle>Board Management</CardTitle>
              <CardDescription>Create and manage forum boards</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateBoard} className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Board Name</Label>
                  <Input
                    id="name"
                    value={newBoard.name}
                    onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Board Slug</Label>
                  <Input
                    id="slug"
                    value={newBoard.slug}
                    onChange={(e) => setNewBoard({ ...newBoard, slug: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newBoard.description}
                    onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit">Create Board</Button>
              </form>

              <div className="space-y-4">
                {boards.length > 0 ? (
                  boards.map((board) => (
                    <div key={board.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{board.name}</p>
                        <p className="text-sm text-muted-foreground">{board.description}</p>
                        <p className="text-xs text-muted-foreground">Slug: {board.slug}</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteBoard(board.id)}>
                        Delete
                      </Button>
                    </div>
                  ))
                ) : (
                  <p>No boards found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ads">
          <Card>
            <CardHeader>
              <CardTitle>Ad Management</CardTitle>
              <CardDescription>Create, edit, and delete ads displayed on the website</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateAd} className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="ad-title">Ad Title (max {MAX_TITLE_LENGTH} characters)</Label>
                  <Input
                    id="ad-title"
                    value={newAd.title}
                    onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                    required
                    maxLength={MAX_TITLE_LENGTH}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {newAd.title.length}/{MAX_TITLE_LENGTH}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ad-description">Ad Description (max {MAX_DESCRIPTION_LENGTH} characters)</Label>
                  <Textarea
                    id="ad-description"
                    value={newAd.description}
                    onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                    required
                    maxLength={MAX_DESCRIPTION_LENGTH}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {newAd.description.length}/{MAX_DESCRIPTION_LENGTH}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ad-url">Target URL (max {MAX_URL_LENGTH} characters)</Label>
                  <Input
                    id="ad-url"
                    type="url"
                    value={newAd.url}
                    onChange={(e) => setNewAd({ ...newAd, url: e.target.value })}
                    required
                    maxLength={MAX_URL_LENGTH}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {newAd.url.length}/{MAX_URL_LENGTH}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ad-image">Ad Image/GIF</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="ad-image"
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="max-w-xs"
                      disabled={uploadingImage}
                    />
                    {uploadingImage && <p className="text-sm text-muted-foreground">Uploading...</p>}
                    {newAd.imageUrl && (
                      <div className="relative h-20 w-20 overflow-hidden rounded border">
                        <Image
                          src={newAd.imageUrl || "/placeholder.svg"}
                          alt="Ad preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <Button type="submit" disabled={uploadingImage}>
                  Create Ad
                </Button>
              </form>

              <div className="space-y-4">
                {ads.length > 0 ? (
                  ads.map((ad) => (
                    <div key={ad.id} className="flex items-start justify-between p-4 border rounded">
                      <div className="flex gap-4">
                        {ad.image_url && (
                          <div className="relative h-20 w-20 overflow-hidden rounded border">
                            <Image
                              src={ad.image_url || "/placeholder.svg"}
                              alt={ad.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{ad.title}</p>
                            {/* {ad.is_placeholder && (
                              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                Placeholder
                              </span>
                            )} */}
                          </div>
                          <p className="text-sm text-muted-foreground">{ad.description}</p>
                          <p className="text-xs text-muted-foreground">URL: {ad.url}</p>
                          <p className="text-xs text-muted-foreground">
                            Status: {ad.is_active ? "Active" : "Inactive"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!ad.is_placeholder ? (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setEditingAd({
                                      id: ad.id,
                                      title: ad.title,
                                      description: ad.description,
                                      url: ad.url,
                                      imageUrl: ad.image_url,
                                      isActive: ad.is_active,
                                    })
                                  }
                                >
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Ad</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleUpdateAd} className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-ad-title">Ad Title (max {MAX_TITLE_LENGTH} characters)</Label>
                                    <Input
                                      id="edit-ad-title"
                                      value={editingAd?.title || ""}
                                      onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                                      required
                                      maxLength={MAX_TITLE_LENGTH}
                                    />
                                    <p className="text-xs text-muted-foreground text-right">
                                      {editingAd?.title?.length || 0}/{MAX_TITLE_LENGTH}
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-ad-description">
                                      Ad Description (max {MAX_DESCRIPTION_LENGTH} characters)
                                    </Label>
                                    <Textarea
                                      id="edit-ad-description"
                                      value={editingAd?.description || ""}
                                      onChange={(e) => setEditingAd({ ...editingAd, description: e.target.value })}
                                      required
                                      maxLength={MAX_DESCRIPTION_LENGTH}
                                    />
                                    <p className="text-xs text-muted-foreground text-right">
                                      {editingAd?.description?.length || 0}/{MAX_DESCRIPTION_LENGTH}
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-ad-url">Target URL (max {MAX_URL_LENGTH} characters)</Label>
                                    <Input
                                      id="edit-ad-url"
                                      type="url"
                                      value={editingAd?.url || ""}
                                      onChange={(e) => setEditingAd({ ...editingAd, url: e.target.value })}
                                      required
                                      maxLength={MAX_URL_LENGTH}
                                    />
                                    <p className="text-xs text-muted-foreground text-right">
                                      {editingAd?.url?.length || 0}/{MAX_URL_LENGTH}
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-ad-image">Ad Image/GIF</Label>
                                    <div className="flex items-center gap-4">
                                      <Input
                                        id="edit-ad-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="max-w-xs"
                                        disabled={uploadingImage}
                                      />
                                      {uploadingImage && <p className="text-sm text-muted-foreground">Uploading...</p>}
                                      {editingAd?.imageUrl && (
                                        <div className="relative h-20 w-20 overflow-hidden rounded border">
                                          <Image
                                            src={editingAd.imageUrl || "/placeholder.svg"}
                                            alt="Ad preview"
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        id="is-active"
                                        checked={editingAd?.isActive}
                                        onChange={(e) => setEditingAd({ ...editingAd, isActive: e.target.checked })}
                                        className="h-4 w-4 rounded border-gray-300"
                                      />
                                      <Label htmlFor="is-active">Active</Label>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      Inactive ads will not be displayed on the site.
                                    </p>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setEditingAd(null)}>
                                      Cancel
                                    </Button>
                                    <Button type="submit" disabled={uploadingImage}>
                                      Save Changes
                                    </Button>
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </>
                        ) : null}
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteAd(ad.id)}>
                          {ad.is_placeholder ? "Remove" : "Delete"}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No ads found. Create your first ad above.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="auth">
          <AuthTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAllAds, deleteAd, updateAd } from "@/lib/db/ads"
import { useToast } from "@/hooks/use-toast"
import DirectAdForm from "./direct-ad-form"

export default function ContentModeration() {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchAds() {
      try {
        const adsData = await getAllAds()
        setAds(adsData)
      } catch (error) {
        console.error("Error fetching ads:", error)
        toast({
          title: "Error",
          description: "Failed to load ads",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [toast])

  const handleToggleAdStatus = async (id, isActive) => {
    try {
      await updateAd(id, { isActive: !isActive })

      // Update local state
      setAds(ads.map((ad) => (ad.id === id ? { ...ad, is_active: !isActive } : ad)))

      toast({
        title: "Success",
        description: `Ad ${isActive ? "deactivated" : "activated"} successfully`,
      })
    } catch (error) {
      console.error("Error toggling ad status:", error)
      toast({
        title: "Error",
        description: "Failed to update ad status",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAd = async (id) => {
    try {
      await deleteAd(id)

      // Update local state
      setAds(ads.filter((ad) => ad.id !== id))

      toast({
        title: "Success",
        description: "Ad deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting ad:", error)
      toast({
        title: "Error",
        description: "Failed to delete ad",
        variant: "destructive",
      })
    }
  }

  return (
    <Tabs defaultValue="ads" className="space-y-4">
      <TabsList>
        <TabsTrigger value="ads">Ads</TabsTrigger>
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="comments">Comments</TabsTrigger>
      </TabsList>

      <TabsContent value="ads" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Ad Management</CardTitle>
            <CardDescription>Create, edit, and manage ads displayed on the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <DirectAdForm />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Existing Ads</h3>

              {loading ? (
                <p>Loading ads...</p>
              ) : ads.length === 0 ? (
                <p>No ads found.</p>
              ) : (
                <div className="space-y-4">
                  {ads.map((ad) => (
                    <div key={ad.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <h4 className="font-medium">{ad.title}</h4>
                        <p className="text-sm text-muted-foreground">{ad.url}</p>
                        <p className="text-xs text-muted-foreground">Status: {ad.is_active ? "Active" : "Inactive"}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleToggleAdStatus(ad.id, ad.is_active)}>
                          {ad.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteAd(ad.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="posts">
        <Card>
          <CardHeader>
            <CardTitle>Post Moderation</CardTitle>
            <CardDescription>Review and moderate user posts.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Post moderation tools will be available soon.</p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="comments">
        <Card>
          <CardHeader>
            <CardTitle>Comment Moderation</CardTitle>
            <CardDescription>Review and moderate user comments.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Comment moderation tools will be available soon.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

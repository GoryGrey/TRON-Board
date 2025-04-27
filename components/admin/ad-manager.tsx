"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Trash2, ExternalLink, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllAds, updateAdStatus, deleteAd } from "@/lib/db/ads"
import AdCreator from "./ad-creator"

type Ad = {
  id: string
  title: string
  url: string
  image_url?: string
  is_active: boolean
  created_at: string
}

export default function AdManager() {
  const [ads, setAds] = useState<Ad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchAds = async () => {
    setIsLoading(true)
    try {
      const { ads, error } = await getAllAds()
      if (error) {
        toast({
          title: "Error",
          description: `Failed to fetch ads: ${error}`,
          variant: "destructive",
        })
        return
      }
      setAds(ads as Ad[])
    } catch (error) {
      console.error("Error fetching ads:", error)
      toast({
        title: "Error",
        description: "Failed to fetch ads",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAds()
  }, [])

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { success, error } = await updateAdStatus(id, !currentStatus)
      if (!success) {
        toast({
          title: "Error",
          description: `Failed to update ad status: ${error}`,
          variant: "destructive",
        })
        return
      }

      // Update local state
      setAds(ads.map((ad) => (ad.id === id ? { ...ad, is_active: !currentStatus } : ad)))

      toast({
        title: "Success",
        description: `Ad ${!currentStatus ? "activated" : "deactivated"} successfully`,
      })
    } catch (error) {
      console.error("Error updating ad status:", error)
      toast({
        title: "Error",
        description: "Failed to update ad status",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAd = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ad?")) return

    try {
      const { success, error } = await deleteAd(id)
      if (!success) {
        toast({
          title: "Error",
          description: `Failed to delete ad: ${error}`,
          variant: "destructive",
        })
        return
      }

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
    <div className="space-y-6">
      <AdCreator />

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading ads...
                </TableCell>
              </TableRow>
            ) : ads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No ads found
                </TableCell>
              </TableRow>
            ) : (
              ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>
                    {ad.image_url ? (
                      <div className="relative w-16 h-16 border rounded-md overflow-hidden">
                        <Image
                          src={ad.image_url || "/placeholder.svg"}
                          alt={ad.title}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 border rounded-md flex items-center justify-center bg-muted">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{ad.title}</TableCell>
                  <TableCell>
                    <a
                      href={ad.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-500 hover:underline"
                    >
                      {ad.url.length > 30 ? `${ad.url.substring(0, 30)}...` : ad.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell>
                    {ad.is_active ? (
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs flex items-center gap-1 w-fit">
                        <CheckCircle className="h-3 w-3" /> Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs flex items-center gap-1 w-fit">
                        <XCircle className="h-3 w-3" /> Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={ad.is_active ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleToggleStatus(ad.id, ad.is_active)}
                      >
                        {ad.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteAd(ad.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

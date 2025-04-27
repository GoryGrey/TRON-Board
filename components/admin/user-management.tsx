"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, UserPlus, UserMinus, Plus, Minus, RefreshCw, Ban, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import PrestigeBadge from "@/components/prestige-badge"
import { formatPrestigeScore } from "@/lib/reputation"

// Import mock data
import { users as mockUsers } from "@/lib/mock-data"

// Add the admin user to the mock data
const adminUser = {
  id: "user_admin_gorygrey",
  name: "GoryGrey",
  avatar: "/placeholder.svg?height=96&width=96",
  bio: "Yī Bāng Court Official and Administrator",
  joinedAt: new Date("2023-01-01"),
  reputation: 1500,
  level: 10,
  badges: ["Admin", "Court Official"],
  postCount: 120,
  commentCount: 350,
  prestigeScore: 9999,
  isAdmin: true,
  role: "admin",
  email: "gorygrey@pm.me",
}

// Combine mock users with admin user
const allUsers = [adminUser, ...mockUsers]

export default function UserManagement() {
  const { updateUserRole } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState(allUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<"prestigeScore" | "joinedAt" | "role">("prestigeScore")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [prestigeAdjustment, setPrestigeAdjustment] = useState(0)
  const [isRestricted, setIsRestricted] = useState(false)

  // Filter and sort users
  const filteredUsers = users
    .filter((user) => {
      if (!searchTerm) return true
      const term = searchTerm.toLowerCase()
      return user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
    })
    .sort((a, b) => {
      if (sortField === "prestigeScore") {
        const scoreA = a.prestigeScore || 0
        const scoreB = b.prestigeScore || 0
        return sortDirection === "asc" ? scoreA - scoreB : scoreB - scoreA
      } else if (sortField === "joinedAt") {
        return sortDirection === "asc"
          ? a.joinedAt.getTime() - b.joinedAt.getTime()
          : b.joinedAt.getTime() - a.joinedAt.getTime()
      } else if (sortField === "role") {
        const roleA = a.role === "admin" ? 1 : 0
        const roleB = b.role === "admin" ? 1 : 0
        return sortDirection === "asc" ? roleA - roleB : roleB - roleA
      }
      return 0
    })

  const handleSort = (field: "prestigeScore" | "joinedAt" | "role") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleRoleToggle = async (user: any) => {
    if (user.id === "user_admin_gorygrey") {
      toast({
        title: "Cannot Change Role",
        description: "Cannot change the role of the primary admin",
        variant: "destructive",
      })
      return
    }

    const newRole = user.role === "admin" ? "user" : "admin"
    const success = await updateUserRole(user.id, newRole)

    if (success) {
      // Update local state
      setUsers(users.map((u) => (u.id === user.id ? { ...u, role: newRole, isAdmin: newRole === "admin" } : u)))
    }
  }

  const openUserDialog = (user: any) => {
    setSelectedUser(user)
    setPrestigeAdjustment(0)
    setIsRestricted(false)
    setIsDialogOpen(true)
  }

  const handlePrestigeAdjustment = () => {
    if (!selectedUser) return

    // Update local state
    setUsers(
      users.map((u) => {
        if (u.id === selectedUser.id) {
          const newScore = Math.max(0, (u.prestigeScore || 0) + prestigeAdjustment)
          return { ...u, prestigeScore: newScore }
        }
        return u
      }),
    )

    toast({
      title: "Prestige Updated",
      description: `${selectedUser.name}'s prestige ${prestigeAdjustment >= 0 ? "increased" : "decreased"} by ${Math.abs(prestigeAdjustment)}`,
    })

    setIsDialogOpen(false)
  }

  const handleResetPassword = () => {
    if (!selectedUser) return

    toast({
      title: "Password Reset",
      description: `Password reset link sent to ${selectedUser.email}`,
    })

    setIsDialogOpen(false)
  }

  const handleToggleRestriction = () => {
    if (!selectedUser) return

    setIsRestricted(!isRestricted)

    toast({
      title: isRestricted ? "Restrictions Removed" : "User Restricted",
      description: isRestricted
        ? `Posting privileges restored for ${selectedUser.name}`
        : `Posting privileges restricted for ${selectedUser.name}`,
    })

    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xl font-medium">User Management</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1 hover:text-primary"
                  onClick={() => handleSort("prestigeScore")}
                >
                  威望值
                  {sortField === "prestigeScore" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </button>
              </TableHead>
              <TableHead>
                <button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSort("joinedAt")}>
                  Joined
                  {sortField === "joinedAt" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </button>
              </TableHead>
              <TableHead>
                <button className="flex items-center gap-1 hover:text-primary" onClick={() => handleSort("role")}>
                  Role
                  {sortField === "role" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </button>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{formatPrestigeScore(user.prestigeScore || 0)}</span>
                    <PrestigeBadge score={user.prestigeScore || 0} isAdmin={user.isAdmin} size="xs" />
                  </div>
                </TableCell>
                <TableCell>{new Date(user.joinedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={user.role === "admin" ? "text-red-500 font-medium" : ""}>{user.role || "user"}</span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleToggle(user)}
                      disabled={user.id === "user_admin_gorygrey"}
                    >
                      {user.role === "admin" ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openUserDialog(user)}>
                      <span className="sr-only">Edit</span>
                      <span>...</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage User: {selectedUser?.name}</DialogTitle>
            <DialogDescription>Adjust user settings and privileges</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Image
                  src={selectedUser.avatar || "/placeholder.svg"}
                  alt={selectedUser.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-medium">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  <PrestigeBadge score={selectedUser.prestigeScore || 0} isAdmin={selectedUser.isAdmin} size="sm" />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Adjust 威望值</h4>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPrestigeAdjustment((prev) => prev - 10)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={prestigeAdjustment}
                    onChange={(e) => setPrestigeAdjustment(Number.parseInt(e.target.value) || 0)}
                    className="text-center"
                  />
                  <Button variant="outline" size="sm" onClick={() => setPrestigeAdjustment((prev) => prev + 10)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Current: {formatPrestigeScore(selectedUser.prestigeScore || 0)} → New:{" "}
                  {formatPrestigeScore(Math.max(0, (selectedUser.prestigeScore || 0) + prestigeAdjustment))}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">User Actions</h4>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" onClick={handleResetPassword} className="justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Password
                  </Button>
                  <Button
                    variant={isRestricted ? "default" : "destructive"}
                    onClick={handleToggleRestriction}
                    className="justify-start"
                  >
                    {isRestricted ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Remove Restrictions
                      </>
                    ) : (
                      <>
                        <Ban className="h-4 w-4 mr-2" />
                        Restrict Posting Privileges
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePrestigeAdjustment} disabled={prestigeAdjustment === 0}>
              Apply 威望值 Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

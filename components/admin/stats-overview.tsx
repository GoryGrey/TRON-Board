"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Users, MessageSquare, MessageCircle, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Import mock data
import { users, posts, comments } from "@/lib/mock-data"

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
const allUsers = [adminUser, ...users]

// Mock daily active users data
const dailyActiveUsersData = [
  { date: "2025-03-12", users: 42 },
  { date: "2025-03-13", users: 48 },
  { date: "2025-03-14", users: 51 },
  { date: "2025-03-15", users: 63 },
  { date: "2025-03-16", users: 58 },
  { date: "2025-03-17", users: 65 },
  { date: "2025-03-18", users: 72 },
]

// Format date for chart
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

export default function StatsOverview() {
  // Calculate stats
  const totalUsers = allUsers.length
  const totalPosts = posts.length
  const totalComments = Object.values(comments).reduce((acc, arr) => acc + arr.length, 0)

  // Calculate average prestige score
  const totalPrestige = allUsers.reduce((acc, user) => acc + (user.prestigeScore || 0), 0)
  const averagePrestige = Math.round(totalPrestige / totalUsers)

  // Get top 5 users by prestige
  const topUsers = [...allUsers].sort((a, b) => (b.prestigeScore || 0) - (a.prestigeScore || 0)).slice(0, 5)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Platform Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">Forum threads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments}</div>
            <p className="text-xs text-muted-foreground">Responses to posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. 威望值</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averagePrestige}</div>
            <p className="text-xs text-muted-foreground">Average prestige score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Daily Active Users</CardTitle>
            <CardDescription>User activity over the past 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyActiveUsersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} width={30} />
                <Tooltip
                  formatter={(value) => [`${value} users`, "Active Users"]}
                  labelFormatter={(label) => `Date: ${formatDate(label)}`}
                />
                <Bar dataKey="users" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Users by 威望值</CardTitle>
            <CardDescription>Highest prestige scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUsers.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center bg-primary/10 rounded-full text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-primary" />
                    <span>{user.prestigeScore || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

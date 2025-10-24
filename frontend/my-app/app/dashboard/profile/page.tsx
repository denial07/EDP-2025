"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Calendar, Shield } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">View and manage your profile information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <Badge variant="secondary" className="mt-2 capitalize">
                {user.role}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Your account information and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-muted p-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Email Address</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-muted p-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Member Since</p>
                <p className="text-sm text-muted-foreground">January 2024</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-muted p-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Account Type</p>
                <p className="text-sm text-muted-foreground capitalize">{user.role} Account</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
          <CardDescription>Your recent activity and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Sessions</p>
              <p className="text-2xl font-bold">127</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Last Login</p>
              <p className="text-2xl font-bold">Today</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Account Status</p>
              <p className="text-2xl font-bold text-green-600">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

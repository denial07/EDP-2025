"use client"

import { useAuth } from "@/lib/auth-context"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShieldCheck, Bell, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  const stats = [
    {
      title: "Active sessions",
      value: "3",
      description: "Devices currently signed in",
      icon: Users,
    },
    {
      title: "Security score",
      value: user.hasTwoFactorEnabled ? "Excellent" : "Needs attention",
      description: user.hasTwoFactorEnabled ? "Two-factor enabled" : "Enable two-factor authentication",
      icon: ShieldCheck,
    },
    {
      title: "Notifications",
      value: "8",
      description: "Unread alerts",
      icon: Bell,
    },
    {
      title: "Usage",
      value: "+12%",
      description: "Activity this month",
      icon: TrendingUp,
      trend: { value: "12%", isPositive: true },
    },
  ]

  const quickActions = [
    { label: "Update profile", description: "Keep your information current" },
    { label: "Review security", description: "Manage passwords and 2FA" },
    { label: "View notifications", description: "See what needs your attention" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s a quick summary of your account health and recent activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>A quick look at what&apos;s happened lately</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Password changed", time: "2 days ago" },
                { title: "Logged in from Chrome", time: "3 hours ago" },
                { title: "Enabled email notifications", time: "1 week ago" },
                { title: "Viewed billing page", time: "2 weeks ago" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-4 rounded-lg bg-muted/50 p-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">Keep track of important updates and sign-ins</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Stay on top of your account in a few taps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  className="w-full text-left rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                >
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useAuth } from "@/lib/auth-context"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, ShoppingCart, TrendingUp, Package, FileText } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          {user.role === "admin" && "Manage your entire platform from here"}
          {user.role === "manager" && "Track your team's progress and projects"}
          {user.role === "customer" && "View your account activity and orders"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {user.role === "admin" && (
          <>
            <StatCard
              title="Total Users"
              value="2,543"
              description="Active users"
              icon={Users}
              trend={{ value: "12.5%", isPositive: true }}
            />
            <StatCard
              title="Revenue"
              value="$45,231"
              description="This month"
              icon={DollarSign}
              trend={{ value: "8.2%", isPositive: true }}
            />
            <StatCard
              title="Orders"
              value="1,234"
              description="Pending: 23"
              icon={ShoppingCart}
              trend={{ value: "3.1%", isPositive: false }}
            />
            <StatCard
              title="Growth"
              value="+23.5%"
              description="vs last month"
              icon={TrendingUp}
              trend={{ value: "5.4%", isPositive: true }}
            />
          </>
        )}

        {user.role === "manager" && (
          <>
            <StatCard title="Team Members" value="12" description="Active members" icon={Users} />
            <StatCard
              title="Active Projects"
              value="8"
              description="In progress"
              icon={Package}
              trend={{ value: "2 new", isPositive: true }}
            />
            <StatCard title="Completed Tasks" value="156" description="This month" icon={FileText} />
            <StatCard
              title="Performance"
              value="94%"
              description="Team efficiency"
              icon={TrendingUp}
              trend={{ value: "2.3%", isPositive: true }}
            />
          </>
        )}

        {user.role === "customer" && (
          <>
            <StatCard title="Total Orders" value="24" description="All time" icon={ShoppingCart} />
            <StatCard title="Total Spent" value="$1,234" description="All time" icon={DollarSign} />
            <StatCard title="Active Orders" value="3" description="In progress" icon={Package} />
            <StatCard title="Saved Items" value="12" description="In wishlist" icon={TrendingUp} />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Activity item {i}</p>
                    <p className="text-xs text-muted-foreground">Description of the activity</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{i}h ago</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user.role === "admin" && (
                <>
                  <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <p className="text-sm font-medium">Add New User</p>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <p className="text-sm font-medium">View Reports</p>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <p className="text-sm font-medium">System Settings</p>
                  </button>
                </>
              )}
              {user.role === "manager" && (
                <>
                  <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <p className="text-sm font-medium">Create Project</p>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <p className="text-sm font-medium">Assign Task</p>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <p className="text-sm font-medium">Team Report</p>
                  </button>
                </>
              )}
              {user.role === "customer" && (
                <>
                  <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <p className="text-sm font-medium">Place Order</p>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <p className="text-sm font-medium">Track Shipment</p>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <p className="text-sm font-medium">Contact Support</p>
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

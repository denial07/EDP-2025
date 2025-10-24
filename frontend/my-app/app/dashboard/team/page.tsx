"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

const mockTeam = [
  { id: "1", name: "Sarah Wilson", role: "Senior Developer", status: "online", tasks: 12 },
  { id: "2", name: "Mike Chen", role: "Designer", status: "online", tasks: 8 },
  { id: "3", name: "Emma Davis", role: "Developer", status: "away", tasks: 15 },
  { id: "4", name: "James Taylor", role: "QA Engineer", status: "offline", tasks: 6 },
]

export default function TeamPage() {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team</h2>
          <p className="text-muted-foreground">Manage your team members</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockTeam.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${getStatusColor(member.status)}`}
                  />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Tasks</p>
                  <p className="text-2xl font-bold">{member.tasks}</p>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {member.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

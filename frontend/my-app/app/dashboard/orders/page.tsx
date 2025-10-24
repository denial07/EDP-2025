"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Eye } from "lucide-react"

const mockOrders = [
  { id: "ORD-001", date: "2024-01-15", status: "delivered", total: "$129.99", items: 3 },
  { id: "ORD-002", date: "2024-01-20", status: "processing", total: "$89.50", items: 2 },
  { id: "ORD-003", date: "2024-01-22", status: "shipped", total: "$249.00", items: 5 },
  { id: "ORD-004", date: "2024-01-25", status: "pending", total: "$59.99", items: 1 },
]

export default function OrdersPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "default"
      case "shipped":
        return "secondary"
      case "processing":
        return "outline"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">View and track your orders</p>
      </div>

      <div className="grid gap-4">
        {mockOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-muted p-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    <CardDescription>Placed on {order.date}</CardDescription>
                  </div>
                </div>
                <Badge variant={getStatusColor(order.status)} className="capitalize">
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-xl font-bold">{order.total}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Items</p>
                  <p className="text-xl font-bold">{order.items}</p>
                </div>
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

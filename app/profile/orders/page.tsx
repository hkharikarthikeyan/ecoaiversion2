"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Award, ChevronRight, Clock, Package, Search, ShoppingBag } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import App from "@/App"

interface Order {
  _id: string
  items: { name: string; quantity: number; image?: string }[]
  status: string
  createdAt: string
  updatedAt: string
  deliveryMethod: string
  totalPoints: number
}

interface TruckProps extends React.SVGProps<SVGSVGElement> {
  // You can add any additional props you want to accept here
}

function Truck(props: TruckProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 17h4V5H2v12h3" />
      <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
      <path d="M14 17h1" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  )
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders")
        const data = await res.json()

        if (data.success) {
          setOrders(data.orders)
        } else {
          setError(data.message || "Failed to load orders")
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
        setError("An error occurred while loading your orders")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Filter orders based on search query and active tab
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toString().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "processing" && order.status === "Processing") ||
      (activeTab === "completed" && order.status === "Delivered")

    return matchesSearch && matchesTab
  })

  if (loading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground animate-pulse mb-4" />
          <h2 className="text-xl font-bold mb-2">Loading your orders...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders by ID or product name..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order._id}>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">Order #{order._id.toString().slice(0, 8)}</CardTitle>
                    <CardDescription>Placed on {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={`
                      ${order.status === "Processing" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                      ${order.status === "Shipped" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}
                      ${order.status === "Delivered" ? "bg-green-50 text-green-700 border-green-200" : ""}
                    `}
                  >
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <App/>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Items</h3>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded-md">
                            <div className="relative w-8 h-8 rounded overflow-hidden">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="text-sm">
                              {item.name} x{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Delivery Method</h3>
                      <div className="flex items-center">
                        {order.deliveryMethod === "pickup" ? (
                          <>
                            <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Pickup from Collection Center</span>
                          </>
                        ) : (
                          <>
                            <Truck />
                            <span>Home Delivery</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Total</h3>
                      <p className="font-medium flex items-center">
                        <Award className="h-4 w-4 mr-1 text-green-600" />
                        {order.totalPoints} points
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Last updated: {new Date(order.updatedAt).toLocaleString()}</span>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/profile/orders/${order._id}`} className="flex items-center">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted rounded-lg">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">No orders found</h2>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "No orders match your search criteria. Try a different search term."
              : "You haven't placed any orders yet."}
          </p>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  )
}


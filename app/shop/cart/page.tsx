"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Award, Minus, Plus, ShoppingBag, Trash } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import AnimationObserver from "@/components/animation-observer"
import App from "@/App"

interface CartItem {
  id: number
  name: string
  description?: string
  image?: string
  points: number
  quantity: number
  stockQuantity?: number
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup")
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage
  useEffect(() => {
    const fetchCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]")
      setCart(savedCart)
      setIsLoading(false)
    }

    // Simulate loading
    setTimeout(fetchCart, 500)

    window.addEventListener("storage", fetchCart) // Listen for changes
    window.addEventListener("cartUpdated", fetchCart) // Listen for custom event

    return () => {
      window.removeEventListener("storage", fetchCart)
      window.removeEventListener("cartUpdated", fetchCart)
    }
  }, [])

  // Update quantity with stock limit check
  const updateQuantity = (id: number, newQuantity: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, Math.min(newQuantity, item.stockQuantity || Number.POSITIVE_INFINITY)) }
        : item,
    )
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))

    // Dispatch custom event to update cart count in header
    window.dispatchEvent(new Event("cartUpdated"))

    toast({ title: "Cart updated", description: "Item quantity has been updated." })
  }

  // Remove item from cart
  const removeItem = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id)
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))

    // Dispatch custom event to update cart count in header
    window.dispatchEvent(new Event("cartUpdated"))

    toast({ title: "Item removed", description: "Item has been removed from your cart." })
  }

  // Clear the entire cart
  const clearCart = () => {
    setCart([])
    localStorage.setItem("cart", JSON.stringify([]))

    // Dispatch custom event to update cart count in header
    window.dispatchEvent(new Event("cartUpdated"))

    toast({ title: "Cart cleared", description: "All items have been removed from your cart." })
  }

  // Calculate total points
  const totalPoints = cart.reduce((total, item) => total + item.points * item.quantity, 0)
  const deliveryFee = deliveryMethod === "delivery" ? 50 : 0
  const finalTotal = totalPoints + deliveryFee
  const availableBalance = 1250

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center mb-8">
          <div className="h-10 w-10 bg-muted animate-pulse rounded-full"></div>
          <div className="h-6 w-40 bg-muted animate-pulse rounded ml-2"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="h-96 bg-muted animate-pulse rounded-lg"></div>
          </div>
          <div>
            <div className="h-80 bg-muted animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <AnimationObserver />

      <div className="flex items-center mb-8 fade-in-up">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/shop">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to shop</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold ml-2">Your Cart</h1>
      </div>

      <AnimatePresence mode="wait">
        {cart.length > 0 ? (
          <motion.div
            key="cart-items"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-6 slide-in-left">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({cart.reduce((total, item) => total + item.quantity, 0)})</CardTitle>
                  <CardDescription>Review and modify your selected items</CardDescription>
                </CardHeader>
                <App/>
                <CardContent>
                  <AnimatePresence>
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center gap-4 border p-4 rounded-lg"
                        >
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-medium">{item.name}</h3>
                            {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                            <p className="text-primary font-medium flex items-center">
                              <Award className="h-3 w-3 mr-1" /> {item.points} points
                            </p>
                            {item.stockQuantity !== undefined && (
                              <p className="text-xs text-muted-foreground">
                                {item.stockQuantity > 0 ? `In stock: ${item.stockQuantity}` : "Out of stock"}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.stockQuantity !== undefined && item.quantity >= item.stockQuantity}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right min-w-[80px]">
                            <p className="font-medium">{item.points * item.quantity} points</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                  <Button variant="ghost" className="text-muted-foreground" onClick={clearCart}>
                    Clear Cart
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="slide-in-right">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{totalPoints} points</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee} points</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{finalTotal} points</span>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <p className="font-medium mb-1">Available Balance</p>
                    <p className="text-primary font-bold text-lg flex items-center">
                      <Award className="h-4 w-4 mr-1" /> {availableBalance} points
                    </p>
                    {finalTotal > availableBalance && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-destructive mt-2 text-sm"
                      >
                        You don't have enough points for this order.
                      </motion.p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={finalTotal > availableBalance || cart.length === 0}
                    asChild
                  >
                    <Link href="/shop/cart/checkout">Proceed to Checkout</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty-cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-16 bg-muted rounded-lg fade-in-up"
          >
            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some eco-friendly products to your cart and start making a difference!
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/shop">Browse Products</Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


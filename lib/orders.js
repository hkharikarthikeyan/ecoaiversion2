"use server"
import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"
import { getCurrentUser } from "./auth"
import { redeemPoints } from "./web3"

// Create a new order
export async function createOrder(formData) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "User not authenticated" }
    }

    const client = await clientPromise
    const db = client.db()

    // Get cart items from form data
    const cartItems = JSON.parse(formData.get("cartItems"))
    const deliveryMethod = formData.get("deliveryMethod")
    const totalPoints = Number.parseInt(formData.get("totalPoints"))

    // Check if user has enough points
    if (user.points < totalPoints) {
      return { success: false, message: "Not enough points" }
    }

    // Create order
    const order = {
      userId: user.id,
      items: cartItems,
      deliveryMethod,
      totalPoints,
      status: "Processing",
      createdAt: new Date(),
      updatedAt: new Date(),
      trackingInfo: {
        status: "Order Placed",
        history: [
          {
            status: "Order Placed",
            timestamp: new Date(),
            description: "Your order has been received and is being processed.",
          },
        ],
      },
    }

    // Add delivery address if applicable
    if (deliveryMethod === "delivery") {
      order.deliveryAddress = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        address: formData.get("address"),
        city: formData.get("city"),
        state: formData.get("state"),
        zip: formData.get("zip"),
        phone: formData.get("phone"),
      }
    }

    // Insert order into database
    const result = await db.collection("orders").insertOne(order)

    // Update user points
    await db.collection("users").updateOne(
      { _id: new ObjectId(user.id) },
      {
        $inc: { points: -totalPoints },
        $push: {
          activities: {
            type: "purchase",
            date: new Date(),
            description: `Purchased ${cartItems.length} items`,
            points: -totalPoints,
            orderId: result.insertedId,
          },
        },
      },
    )

    // If user has connected wallet, update blockchain
    if (user.walletAddress) {
      // Create a product ID string from the order
      const productId = `order-${result.insertedId}`
      await redeemPoints(totalPoints, productId)
    }

    return {
      success: true,
      orderId: result.insertedId,
      message: "Order placed successfully",
    }
  } catch (error) {
    console.error("Create order error:", error)
    return { success: false, message: "An error occurred while creating your order" }
  }
}

// Get user orders
export async function getUserOrders() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "User not authenticated" }
    }

    const client = await clientPromise
    const db = client.db()

    const orders = await db
      .collection("orders")
      .find({ userId: new ObjectId(user.id) })
      .sort({ createdAt: -1 })
      .toArray()

    return { success: true, orders }
  } catch (error) {
    console.error("Get user orders error:", error)
    return { success: false, message: "An error occurred while fetching orders" }
  }
}

// Get order by ID
export async function getOrderById(orderId) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, message: "User not authenticated" }
    }

    const client = await clientPromise
    const db = client.db()

    const order = await db.collection("orders").findOne({
      _id: new ObjectId(orderId),
      userId: user.id,
    })

    if (!order) {
      return { success: false, message: "Order not found" }
    }

    return { success: true, order }
  } catch (error) {
    console.error("Get order by ID error:", error)
    return { success: false, message: "An error occurred while fetching the order" }
  }
}


"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import clientPromise from "./mongodb"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"

// Authenticate user and return session info
export async function authenticateUser(email, password) {
  try {
    const client = await clientPromise
    const db = client.db()
    const user = await db.collection("users").findOne({ email })

    if (!user) {
      return { success: false, message: "User not found" }
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return { success: false, message: "Invalid password" }
    }

    return { success: true, user }
  } catch (error) {
    console.error("Authentication error:", error)
    return { success: false, message: "An error occurred during authentication" }
  }
}

// Login user
export async function loginUser(formData) {
  const email = formData.get("email")
  const password = formData.get("password")

  const authResponse = await authenticateUser(email, password)
  if (!authResponse.success) {
    return authResponse
  }

  const user = authResponse.user

  // Create session
  const sessionToken = uuidv4()
  const session = {
    userId: user._id,
    token: sessionToken,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  }

  try {
    const client = await clientPromise
    const db = client.db()
    await db.collection("sessions").insertOne(session)

    // Set session cookie
    cookies().set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return {
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points || 0,
        tier: user.tier || "Bronze",
        walletAddress: user.walletAddress || null,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "An error occurred during login" }
  }
}

// Register user
export async function registerUser(formData) {
  const name = formData.get("name")
  const email = formData.get("email")
  const password = formData.get("password")

  try {
    const client = await clientPromise
    const db = client.db()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return { success: false, message: "User already exists" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      points: 500, // Starting bonus points
      tier: "Bronze",
      joinDate: new Date(),
      recycled: 0,
      orders: [],
      activities: [
        {
          type: "bonus",
          date: new Date(),
          description: "Welcome bonus",
          points: 500,
        },
      ],
    })

    return loginUser(
      new Map([
        ["email", email],
        ["password", password],
      ]),
    ) // Auto-login after registration
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, message: "An error occurred during registration" }
  }
}

// Logout user
export async function logoutUser() {
  try {
    const sessionToken = cookies().get("session_token")?.value

    if (sessionToken) {
      const client = await clientPromise
      const db = client.db()

      // Delete session from database
      await db.collection("sessions").deleteOne({ token: sessionToken })

      // Clear cookie
      cookies().delete("session_token")
    }

    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, message: "An error occurred during logout" }
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session_token")?.value

    if (!sessionToken) {
      return null
    }

    const client = await clientPromise
    const db = client.db()

    const session = await db.collection("sessions").findOne({
      token: sessionToken,
      expires: { $gt: new Date() },
    })

    if (!session) {
      cookies().delete("session_token")
      return null
    }

    const user = await db.collection("users").findOne({ _id: session.userId })

    if (!user) {
      cookies().delete("session_token")
      return null
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      points: user.points || 0,
      tier: user.tier || "Bronze",
      recycled: user.recycled || 0,
      walletAddress: user.walletAddress || null,
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

// Check if user is authenticated
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?redirect=" + encodeURIComponent(cookies().get("path")?.value || "/"))
  }

  return user
}


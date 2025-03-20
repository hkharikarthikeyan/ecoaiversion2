"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Award, MapPin, Recycle } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import AnimationObserver from "@/components/animation-observer"
import App from "@/App"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <AnimationObserver />

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center space-y-4"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Recycle E-Waste, Earn Rewards
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Turn your electronic waste into reward points. Shop eco-friendly products with your earned points.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/collection-centers">Find Recycle Centers</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/ewaste">Learn About E-Waste</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Image
                src="/images/download.png"
                alt="E-waste recycling illustration"
                width={550}
                height={550}
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl fade-in-up">How It Works</h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed fade-in-up delay-100">
                Our simple process to recycle e-waste and earn rewards
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center slide-in-left">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Recycle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">1. Collect E-Waste</h3>
              <p className="text-muted-foreground">
                Gather your old electronics, batteries, and other e-waste items from your home.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center slide-in-left delay-200">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">2. Drop at Collection Center</h3>
              <p className="text-muted-foreground">
                Visit your nearest collection center and drop off your e-waste for proper recycling.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center slide-in-left delay-300">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">3. Earn & Redeem Points</h3>
              <p className="text-muted-foreground">
                Get reward points based on quantity and quality. Use points to shop eco-friendly products.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl fade-in-up">
                Featured Products
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed fade-in-up delay-100">
                Redeem your points for these eco-friendly products
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
            {[
              {
                name: "Recycled Notebook",
                points: 200,
                image: "/images/download-1.jpeg",
              },
              {
                name: "Bamboo Cutlery Set",
                points: 350,
                image: "/images/download-2.jpeg",
              },
              {
                name: "Solar Power Bank",
                points: 1200,
                image: "/images/download-8.jpeg",
              },
              {
                name: "Eco-Friendly Water Bottle",
                points: 500,
                image: "/images/download-3.jpeg",
              },
            ].map((product, index) => (
              <Card key={index} className="overflow-hidden scale-in delay-100 group">
                <div className="aspect-square relative">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-all group-hover:scale-105"
                  />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                  <CardDescription className="flex items-center text-primary font-medium">
                    <Award className="h-4 w-4 mr-1" /> {product.points} points
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-0">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/shop">View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-8 fade-in-up">
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/shop" className="flex items-center">
                Browse All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl fade-in-up">Our Impact</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed fade-in-up delay-100">
                  Together, we're making a difference in reducing e-waste and protecting our environment.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="slide-in-left">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-4xl font-bold text-primary">5,000+</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Kilograms of e-waste collected</p>
                  </CardContent>
                </Card>
                <Card className="slide-in-left delay-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-4xl font-bold text-primary">2,500+</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Active users recycling e-waste</p>
                  </CardContent>
                </Card>
                <Card className="slide-in-left delay-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-4xl font-bold text-primary">50+</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Collection centers nationwide</p>
                  </CardContent>
                </Card>
                <Card className="slide-in-left delay-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-4xl font-bold text-primary">1M+</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Reward points redeemed</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="slide-in-right"
            >
              <Image
                src="/placeholder.svg?height=550&width=550"
                alt="Environmental impact illustration"
                width={550}
                height={550}
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl fade-in-up">
                Join Our Mission Today
              </h2>
              <p className="text-primary-foreground/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed fade-in-up delay-100">
                Start recycling e-waste, earning rewards, and shopping eco-friendly products.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row fade-in-up delay-200">
              <Button asChild size="lg" variant="secondary">
                <Link href="/signup">Sign Up Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                <Link href="/collection-centers">Find Nearest Center</Link>
              </Button>
            </div>
          </div>
        </div>
        <App/>
      </section>
    </div>
  )
}


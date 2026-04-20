"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { 
  Palette, 
  Shirt, 
  Wand2, 
  SwatchBook, 
  ArrowRight,
  Bot,
  CheckCircle2,
  Upload,
  Sparkles
} from "lucide-react"

const quickActions = [
  {
    id: "validation",
    title: "Validate Colors",
    description: "Check color harmony",
    icon: CheckCircle2,
    href: "/validation",
    primary: true
  },
  {
    id: "upload",
    title: "Upload Image",
    description: "Extract colors from photo",
    icon: Upload,
    href: "/extract",
    primary: true
  },
  {
    id: "suggestions-guided",
    title: "I Have a Color",
    description: "Build palette from your color",
    icon: Palette,
    href: "/suggestions/with-color",
    primary: true
  },
  {
    id: "suggestions-full",
    title: "Surprise Me",
    description: "Get full AI recommendations",
    icon: Sparkles,
    href: "/suggestions/inspire-me",
    primary: false
  }
]

const coreModules = [
  {
    id: "validation",
    title: "Color Validation",
    description: "Check if your colors work well together with instant feedback",
    icon: Palette,
    href: "/validation",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80"
  },
  {
    id: "wardrobe",
    title: "Wardrobe Matcher",
    description: "Match your outfit colors and see how they look together",
    icon: Shirt,
    href: "/wardrobe",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&q=80"
  },
  {
    id: "suggestions",
    title: "Smart Suggestions",
    description: "Get AI-powered color recommendations for any project",
    icon: Wand2,
    href: "/suggestions/with-color",
    image: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&q=80"
  },
  {
    id: "palettes",
    title: "Palette Library",
    description: "Browse 50+ beautiful pre-made palettes by mood and style",
    icon: SwatchBook,
    href: "/palettes",
    image: "https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=400&q=80"
  }
]

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {user?.name || "Designer"}
          </h1>
          <p className="text-muted-foreground text-sm">
            What would you like to create today?
          </p>
        </div>
        <Link href="/assistant">
          <Button variant="outline" className="rounded-xl gap-2">
            <Bot className="w-4 h-4" />
            Ask AI
          </Button>
        </Link>
      </div>

      {/* Quick Actions - Primary Focus */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Quick Start</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.id} href={action.href}>
                <Card className={`group border-0 shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-all h-full ${action.primary ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-secondary/50'}`}>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-2 ${action.primary ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">{action.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Core Modules with Images */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Tools</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {coreModules.map((module) => {
            const Icon = module.icon
            return (
              <Link key={module.id} href={module.href}>
                <Card className="group border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all h-full">
                  <div className="relative h-28 overflow-hidden">
                    <Image
                      src={module.image}
                      alt={module.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/90 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {module.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {module.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Image Color Extraction Promo */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-r from-primary/10 via-accent/5 to-primary/5">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
              <Upload className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground text-sm">Extract Colors from Any Image</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload a photo or inspiration image and we will extract a beautiful palette from it.
              </p>
            </div>
            <Link href="/extract">
              <Button size="sm" className="rounded-xl">
                Try It
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row - Compact */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Palettes", value: "50+" },
          { label: "Moods", value: "8" },
          { label: "Tools", value: "6" },
          { label: "AI Powered", value: "Yes" }
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm rounded-xl bg-secondary/30">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

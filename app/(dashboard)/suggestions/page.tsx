"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { 
  Palette, 
  Sparkles, 
  ArrowRight, 
  Shirt, 
  Globe, 
  Home, 
  Image as ImageIcon,
  Presentation,
  PenTool
} from "lucide-react"

const categories = [
  {
    id: "clothing",
    title: "Clothing & Fashion",
    description: "Outfit color combinations",
    icon: Shirt,
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&q=80",
    colors: ["#1A1A2E", "#E94560", "#16213E", "#F7F7F7"]
  },
  {
    id: "website",
    title: "Website & UI",
    description: "Digital design palettes",
    icon: Globe,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80",
    colors: ["#3B82F6", "#10B981", "#F59E0B", "#FFFFFF"]
  },
  {
    id: "poster",
    title: "Poster & Print",
    description: "Eye-catching graphics",
    icon: ImageIcon,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F7FFF7"]
  },
  {
    id: "room",
    title: "Interior & Room",
    description: "Home decor colors",
    icon: Home,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
    colors: ["#E8D5B7", "#A67C52", "#4A4A4A", "#F5F5F5"]
  },
  {
    id: "presentation",
    title: "Presentation",
    description: "Professional slides",
    icon: Presentation,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80",
    colors: ["#1E3A8A", "#3B82F6", "#60A5FA", "#F8FAFC"]
  },
  {
    id: "logo",
    title: "Logo & Branding",
    description: "Brand identity colors",
    icon: PenTool,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80",
    colors: ["#6366F1", "#EC4899", "#F97316", "#FFFFFF"]
  }
]

export default function SuggestionsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Smart Suggestions</h1>
        <p className="text-muted-foreground">
          Choose how you want to start building your perfect color palette.
        </p>
      </div>

      {/* Two Main Options */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
        {/* Option 1: With Color */}
        <Link href="/suggestions/with-color">
          <Card className="group border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all h-full cursor-pointer">
            <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex gap-2">
                  {["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"].map((color, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full shadow-lg transform hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <Palette className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-foreground mb-1">
                    I Have a Color
                  </h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    Start with a color you already love and we will build a harmonious palette around it.
                  </p>
                  <Button size="sm" className="rounded-xl">
                    Start with my color
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Option 2: Inspire Me */}
        <Link href="/suggestions/inspire-me">
          <Card className="group border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all h-full cursor-pointer">
            <div className="relative h-32 overflow-hidden bg-gradient-to-br from-violet-500/20 to-purple-500/5">
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-16 h-16 text-violet-500/50 animate-pulse" />
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-foreground mb-1">
                    Inspire Me
                  </h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    Not sure where to start? Tell us the vibe you want and we will create something perfect.
                  </p>
                  <Button size="sm" variant="outline" className="rounded-xl">
                    Get inspired
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Category-Based Suggestions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.id} href={`/suggestions/inspire-me?category=${category.id}`}>
                <Card className="group border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all cursor-pointer h-full">
                  <div className="relative h-28 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex gap-1">
                        {category.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full shadow-sm border border-white/20"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Quick Preview Section */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Preview: Popular Palettes</h3>
            <Link href="/palettes">
              <Button variant="ghost" size="sm" className="rounded-xl text-muted-foreground">
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: "Ocean Breeze", colors: ["#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8"] },
              { name: "Sunset Glow", colors: ["#FF6B6B", "#FFA07A", "#FFD93D", "#FFF8E7"] },
              { name: "Forest Trail", colors: ["#2D5016", "#4A7023", "#8BC34A", "#F1F8E9"] },
              { name: "Urban Night", colors: ["#1A1A2E", "#16213E", "#0F3460", "#E94560"] }
            ].map((palette, index) => (
              <div key={index} className="bg-background rounded-xl p-3 shadow-sm">
                <div className="flex rounded-lg overflow-hidden h-8 mb-2">
                  {palette.colors.map((color, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <p className="text-xs font-medium text-foreground text-center">{palette.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

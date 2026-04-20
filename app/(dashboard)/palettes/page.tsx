"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { 
  Search,
  Copy,
  Check,
  Heart,
  Filter,
  Palette,
  X,
  Sun,
  Moon,
  Leaf,
  Sparkles,
  Coffee,
  Gem,
  Flame,
  Snowflake,
  Shirt,
  Globe,
  Home
} from "lucide-react"

interface PaletteItem {
  id: string
  name: string
  colors: string[]
  category: string
  mood: string
  occasion: string
  lightness: "light" | "dark" | "mixed"
  image?: string
  icon?: string
}

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  warm: <Flame className="w-4 h-4" />,
  cool: <Snowflake className="w-4 h-4" />,
  nature: <Leaf className="w-4 h-4" />,
  vibrant: <Sparkles className="w-4 h-4" />,
  neutral: <Coffee className="w-4 h-4" />,
  pastel: <Sun className="w-4 h-4" />,
  luxury: <Gem className="w-4 h-4" />
}

// Mood icons mapping
const moodIcons: Record<string, React.ReactNode> = {
  happy: <Sun className="w-3 h-3" />,
  calm: <Moon className="w-3 h-3" />,
  bold: <Flame className="w-3 h-3" />,
  romantic: <Heart className="w-3 h-3" />,
  professional: <Gem className="w-3 h-3" />,
  energetic: <Sparkles className="w-3 h-3" />,
  cozy: <Coffee className="w-3 h-3" />
}

// 50+ curated palettes with images
const palettes: PaletteItem[] = [
  // Warm palettes
  { id: "1", name: "Sunset Warm", colors: ["#FF6B6B", "#FFA07A", "#FFD93D", "#FFF5E6"], category: "warm", mood: "happy", occasion: "casual", lightness: "light", image: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&q=80" },
  { id: "2", name: "Desert Sand", colors: ["#A67C52", "#C9A66B", "#E6D5AC", "#FFF8DC"], category: "warm", mood: "calm", occasion: "professional", lightness: "light", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&q=80" },
  { id: "3", name: "Rustic Autumn", colors: ["#8B4513", "#CD853F", "#D2691E", "#FFDEAD"], category: "warm", mood: "cozy", occasion: "casual", lightness: "mixed", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { id: "4", name: "Golden Hour", colors: ["#FFD700", "#FFA500", "#FF8C00", "#FFF8DC"], category: "warm", mood: "energetic", occasion: "party", lightness: "light", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
  { id: "5", name: "Terracotta", colors: ["#E07A5F", "#F2CC8F", "#81B29A", "#3D405B"], category: "warm", mood: "calm", occasion: "casual", lightness: "mixed", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { id: "6", name: "Burnt Orange", colors: ["#CC5500", "#E67300", "#FF8C00", "#FFE4B5"], category: "warm", mood: "energetic", occasion: "casual", lightness: "mixed", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { id: "7", name: "Coral Reef", colors: ["#FF7F50", "#FF6347", "#FFA07A", "#FFFAF0"], category: "warm", mood: "happy", occasion: "summer", lightness: "light", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80" },
  { id: "8", name: "Spice Market", colors: ["#8B0000", "#CD5C5C", "#F08080", "#FAEBD7"], category: "warm", mood: "bold", occasion: "formal", lightness: "mixed", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80" },
  
  // Cool palettes
  { id: "9", name: "Ocean Breeze", colors: ["#1A535C", "#4ECDC4", "#95E1D3", "#F7FFF7"], category: "cool", mood: "calm", occasion: "casual", lightness: "mixed", image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80" },
  { id: "10", name: "Midnight Blue", colors: ["#0D1B2A", "#1B263B", "#415A77", "#778DA9"], category: "cool", mood: "professional", occasion: "formal", lightness: "dark", image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80" },
  { id: "11", name: "Ice Crystal", colors: ["#E0FFFF", "#B0E0E6", "#87CEEB", "#4682B4"], category: "cool", mood: "calm", occasion: "casual", lightness: "light", image: "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=400&q=80" },
  { id: "12", name: "Lavender Fields", colors: ["#5B2C6F", "#884EA0", "#BB8FCE", "#E8DAEF"], category: "cool", mood: "romantic", occasion: "casual", lightness: "mixed", image: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=400&q=80" },
  { id: "13", name: "Arctic Night", colors: ["#1A1A2E", "#16213E", "#0F3460", "#E94560"], category: "cool", mood: "bold", occasion: "party", lightness: "dark", image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80" },
  { id: "14", name: "Deep Sea", colors: ["#05445E", "#189AB4", "#75E6DA", "#D4F1F9"], category: "cool", mood: "calm", occasion: "professional", lightness: "mixed", image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80" },
  { id: "15", name: "Blueberry", colors: ["#2C3E50", "#3498DB", "#5DADE2", "#AED6F1"], category: "cool", mood: "professional", occasion: "formal", lightness: "mixed", image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&q=80" },
  { id: "16", name: "Periwinkle Dream", colors: ["#CCCCFF", "#9999FF", "#6666FF", "#3333FF"], category: "cool", mood: "calm", occasion: "casual", lightness: "light", image: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&q=80" },
  
  // Nature palettes
  { id: "17", name: "Forest Walk", colors: ["#2D5016", "#5C8A35", "#96BB7C", "#E8F5E9"], category: "nature", mood: "calm", occasion: "casual", lightness: "mixed", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80" },
  { id: "18", name: "Spring Garden", colors: ["#2ECC71", "#58D68D", "#82E0AA", "#ABEBC6"], category: "nature", mood: "happy", occasion: "casual", lightness: "light", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80" },
  { id: "19", name: "Moss Stone", colors: ["#556B2F", "#6B8E23", "#9ACD32", "#F0FFF0"], category: "nature", mood: "calm", occasion: "casual", lightness: "mixed", image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80" },
  { id: "20", name: "Eucalyptus", colors: ["#3D5A45", "#5F8575", "#90B09A", "#C1D5C0"], category: "nature", mood: "calm", occasion: "professional", lightness: "mixed", image: "https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=400&q=80" },
  { id: "21", name: "Tropical Leaf", colors: ["#1A4D2E", "#4F9D69", "#9DC08B", "#EDF1D6"], category: "nature", mood: "energetic", occasion: "summer", lightness: "mixed", image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&q=80" },
  { id: "22", name: "Jungle", colors: ["#1B4332", "#2D6A4F", "#40916C", "#74C69D"], category: "nature", mood: "bold", occasion: "casual", lightness: "mixed", image: "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=400&q=80" },
  { id: "23", name: "Sage Brush", colors: ["#87986A", "#B5C99A", "#CFE1B9", "#E9F5DB"], category: "nature", mood: "calm", occasion: "casual", lightness: "light", image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80" },
  { id: "24", name: "Earth Tones", colors: ["#5C4033", "#8B7355", "#C4A484", "#DEB887"], category: "nature", mood: "cozy", occasion: "casual", lightness: "mixed", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  
  // Vibrant palettes
  { id: "25", name: "Berry Blast", colors: ["#6B2737", "#A23B72", "#E05297", "#FFCAE9"], category: "vibrant", mood: "bold", occasion: "party", lightness: "mixed", image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&q=80" },
  { id: "26", name: "Neon Dreams", colors: ["#FF006E", "#8338EC", "#3A86FF", "#06D6A0"], category: "vibrant", mood: "energetic", occasion: "party", lightness: "mixed", image: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&q=80" },
  { id: "27", name: "Citrus Pop", colors: ["#F4A261", "#E9C46A", "#2A9D8F", "#264653"], category: "vibrant", mood: "happy", occasion: "summer", lightness: "mixed", image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&q=80" },
  { id: "28", name: "Tropical Paradise", colors: ["#FF6B6B", "#FFE66D", "#4ECDC4", "#2ECC71"], category: "vibrant", mood: "happy", occasion: "summer", lightness: "light", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },
  { id: "29", name: "Electric", colors: ["#7400B8", "#6930C3", "#5390D9", "#4EA8DE"], category: "vibrant", mood: "bold", occasion: "party", lightness: "mixed", image: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=400&q=80" },
  { id: "30", name: "Rainbow Sherbet", colors: ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#E2F0CB"], category: "vibrant", mood: "happy", occasion: "casual", lightness: "light", image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&q=80" },
  { id: "31", name: "Candy Shop", colors: ["#FF69B4", "#FFB6C1", "#87CEEB", "#98FB98"], category: "vibrant", mood: "happy", occasion: "party", lightness: "light", image: "https://images.unsplash.com/photo-1499195333224-3ce974eecb47?w=400&q=80" },
  { id: "32", name: "Fiesta", colors: ["#FF5733", "#FFC300", "#DAF7A6", "#C70039"], category: "vibrant", mood: "energetic", occasion: "party", lightness: "mixed", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80" },
  
  // Neutral palettes
  { id: "33", name: "Minimalist Gray", colors: ["#212121", "#424242", "#9E9E9E", "#F5F5F5"], category: "neutral", mood: "professional", occasion: "formal", lightness: "mixed", image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&q=80" },
  { id: "34", name: "Mocha Latte", colors: ["#3E2723", "#6D4C41", "#A1887F", "#D7CCC8"], category: "neutral", mood: "cozy", occasion: "casual", lightness: "mixed", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80" },
  { id: "35", name: "Stone", colors: ["#4A4A4A", "#7A7A7A", "#A5A5A5", "#D5D5D5"], category: "neutral", mood: "calm", occasion: "professional", lightness: "mixed", image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&q=80" },
  { id: "36", name: "Linen", colors: ["#FAF0E6", "#E6D5C3", "#C4A77D", "#8B7355"], category: "neutral", mood: "calm", occasion: "casual", lightness: "light", image: "https://images.unsplash.com/photo-1489171078254-c3365d6e359f?w=400&q=80" },
  { id: "37", name: "Charcoal", colors: ["#2C3E50", "#34495E", "#7F8C8D", "#BDC3C7"], category: "neutral", mood: "professional", occasion: "formal", lightness: "dark", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { id: "38", name: "Ivory Tower", colors: ["#FFFFF0", "#FAFAD2", "#EEE8AA", "#BDB76B"], category: "neutral", mood: "calm", occasion: "casual", lightness: "light", image: "https://images.unsplash.com/photo-1517174637803-6929e01a62cf?w=400&q=80" },
  { id: "39", name: "Greige", colors: ["#808080", "#A9A9A9", "#C0C0C0", "#D3D3D3"], category: "neutral", mood: "calm", occasion: "professional", lightness: "light", image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&q=80" },
  { id: "40", name: "Warm White", colors: ["#FFFAF0", "#FDF5E6", "#FAF0E6", "#FAEBD7"], category: "neutral", mood: "calm", occasion: "casual", lightness: "light", image: "https://images.unsplash.com/photo-1489171078254-c3365d6e359f?w=400&q=80" },
  
  // Pastel palettes
  { id: "41", name: "Cotton Candy", colors: ["#FFB5E8", "#B5DEFF", "#B5FFE1", "#FFF5BA"], category: "pastel", mood: "happy", occasion: "casual", lightness: "light", image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80" },
  { id: "42", name: "Peachy Keen", colors: ["#FFE5D9", "#FFCAD4", "#F4ACB7", "#9D8189"], category: "pastel", mood: "romantic", occasion: "casual", lightness: "light", image: "https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=400&q=80" },
  { id: "43", name: "Mint Chip", colors: ["#E8F5E9", "#C8E6C9", "#A5D6A7", "#81C784"], category: "pastel", mood: "calm", occasion: "casual", lightness: "light", image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80" },
  { id: "44", name: "Baby Blue", colors: ["#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6"], category: "pastel", mood: "calm", occasion: "casual", lightness: "light", image: "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=400&q=80" },
  { id: "45", name: "Lilac Breeze", colors: ["#F3E5F5", "#E1BEE7", "#CE93D8", "#BA68C8"], category: "pastel", mood: "romantic", occasion: "casual", lightness: "light", image: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=400&q=80" },
  { id: "46", name: "Buttercream", colors: ["#FFFDE7", "#FFF9C4", "#FFF59D", "#FFF176"], category: "pastel", mood: "happy", occasion: "casual", lightness: "light", image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&q=80" },
  { id: "47", name: "Rose Quartz", colors: ["#FCE4EC", "#F8BBD0", "#F48FB1", "#F06292"], category: "pastel", mood: "romantic", occasion: "formal", lightness: "light", image: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400&q=80" },
  { id: "48", name: "Seafoam", colors: ["#E0F2F1", "#B2DFDB", "#80CBC4", "#4DB6AC"], category: "pastel", mood: "calm", occasion: "casual", lightness: "light", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },
  
  // Luxury palettes
  { id: "49", name: "Black Gold", colors: ["#000000", "#1A1A1A", "#DAA520", "#FFD700"], category: "luxury", mood: "bold", occasion: "formal", lightness: "dark", image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&q=80" },
  { id: "50", name: "Royal Purple", colors: ["#4B0082", "#663399", "#9370DB", "#E6E6FA"], category: "luxury", mood: "bold", occasion: "formal", lightness: "mixed", image: "https://images.unsplash.com/photo-1557682260-96773eb01377?w=400&q=80" },
  { id: "51", name: "Champagne", colors: ["#F7E7CE", "#EED9C4", "#C4A77D", "#8B7355"], category: "luxury", mood: "calm", occasion: "formal", lightness: "light", image: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=400&q=80" },
  { id: "52", name: "Emerald Night", colors: ["#004225", "#006400", "#228B22", "#90EE90"], category: "luxury", mood: "bold", occasion: "formal", lightness: "mixed", image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&q=80" },
  { id: "53", name: "Burgundy Wine", colors: ["#722F37", "#800020", "#A52A2A", "#E5C8C6"], category: "luxury", mood: "romantic", occasion: "formal", lightness: "dark", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80" },
  { id: "54", name: "Navy Brass", colors: ["#000080", "#003366", "#B8860B", "#FFD700"], category: "luxury", mood: "professional", occasion: "formal", lightness: "dark", image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=400&q=80" },
]

const categories = [
  { id: "all", label: "All", icon: <Palette className="w-4 h-4" /> },
  { id: "warm", label: "Warm", icon: <Flame className="w-4 h-4" /> },
  { id: "cool", label: "Cool", icon: <Snowflake className="w-4 h-4" /> },
  { id: "vibrant", label: "Vibrant", icon: <Sparkles className="w-4 h-4" /> },
  { id: "neutral", label: "Neutral", icon: <Coffee className="w-4 h-4" /> },
  { id: "nature", label: "Nature", icon: <Leaf className="w-4 h-4" /> },
  { id: "pastel", label: "Pastel", icon: <Sun className="w-4 h-4" /> },
  { id: "luxury", label: "Luxury", icon: <Gem className="w-4 h-4" /> }
]

const moods = [
  { id: "all", label: "Any Mood" },
  { id: "happy", label: "Happy" },
  { id: "calm", label: "Calm" },
  { id: "bold", label: "Bold" },
  { id: "romantic", label: "Romantic" },
  { id: "professional", label: "Professional" },
  { id: "energetic", label: "Energetic" },
  { id: "cozy", label: "Cozy" }
]

const occasions = [
  { id: "all", label: "Any Occasion" },
  { id: "casual", label: "Casual" },
  { id: "formal", label: "Formal" },
  { id: "professional", label: "Professional" },
  { id: "party", label: "Party" },
  { id: "summer", label: "Summer" }
]

const lightnesses = [
  { id: "all", label: "Any" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "mixed", label: "Mixed" }
]

export default function PalettesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedMood, setSelectedMood] = useState("all")
  const [selectedOccasion, setSelectedOccasion] = useState("all")
  const [selectedLightness, setSelectedLightness] = useState("all")
  const [favorites, setFavorites] = useState<string[]>([])
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filteredPalettes = palettes.filter(palette => {
    const matchesSearch = 
      palette.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = 
      selectedCategory === "all" || palette.category === selectedCategory
    
    const matchesMood = 
      selectedMood === "all" || palette.mood === selectedMood
    
    const matchesOccasion = 
      selectedOccasion === "all" || palette.occasion === selectedOccasion
    
    const matchesLightness = 
      selectedLightness === "all" || palette.lightness === selectedLightness
    
    return matchesSearch && matchesCategory && matchesMood && matchesOccasion && matchesLightness
  })

  const copyColor = async (color: string) => {
    await navigator.clipboard.writeText(color)
    setCopiedColor(color)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const copyAllColors = async (colors: string[]) => {
    await navigator.clipboard.writeText(colors.join(", "))
    setCopiedColor(colors.join(","))
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const clearFilters = () => {
    setSelectedCategory("all")
    setSelectedMood("all")
    setSelectedOccasion("all")
    setSelectedLightness("all")
    setSearchQuery("")
  }

  const hasActiveFilters = selectedCategory !== "all" || selectedMood !== "all" || selectedOccasion !== "all" || selectedLightness !== "all" || searchQuery !== ""

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Palette Library</h1>
        <p className="text-muted-foreground">
          Browse {palettes.length} beautiful, hand-picked color palettes. Click any color to copy it!
        </p>
      </div>

      {/* Search & Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search palettes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-11 rounded-xl border-2"
          />
        </div>
        
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant={showFilters ? "default" : "outline"}
          className="rounded-xl h-11"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <Badge className="ml-2 bg-primary-foreground text-primary rounded-full w-5 h-5 p-0 flex items-center justify-center text-xs">
              !
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <CardContent className="p-5 space-y-4">
            {/* Category with Icons */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    variant={selectedCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    className="rounded-lg gap-1.5"
                  >
                    {cat.icon}
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Mood</label>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <Button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    variant={selectedMood === mood.id ? "default" : "outline"}
                    size="sm"
                    className="rounded-lg gap-1.5"
                  >
                    {moodIcons[mood.id]}
                    {mood.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Occasion</label>
              <div className="flex flex-wrap gap-2">
                {occasions.map((occ) => (
                  <Button
                    key={occ.id}
                    onClick={() => setSelectedOccasion(occ.id)}
                    variant={selectedOccasion === occ.id ? "default" : "outline"}
                    size="sm"
                    className="rounded-lg"
                  >
                    {occ.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Lightness */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Light/Dark</label>
              <div className="flex flex-wrap gap-2">
                {lightnesses.map((light) => (
                  <Button
                    key={light.id}
                    onClick={() => setSelectedLightness(light.id)}
                    variant={selectedLightness === light.id ? "default" : "outline"}
                    size="sm"
                    className="rounded-lg gap-1.5"
                  >
                    {light.id === "light" && <Sun className="w-3 h-3" />}
                    {light.id === "dark" && <Moon className="w-3 h-3" />}
                    {light.label}
                  </Button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{filteredPalettes.length} palettes</span>
        {favorites.length > 0 && (
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
            {favorites.length} favorites
          </span>
        )}
      </div>

      {/* Palette Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPalettes.map((palette) => (
          <Card 
            key={palette.id} 
            className="group border-0 shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Image Preview */}
            {palette.image && (
              <div className="relative h-24 overflow-hidden">
                <Image
                  src={palette.image}
                  alt={palette.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              </div>
            )}
            
            <CardContent className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                    {categoryIcons[palette.category]}
                    {palette.name}
                  </h3>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="outline" className="rounded-md text-[10px] capitalize px-1.5 py-0 gap-0.5">
                      {moodIcons[palette.mood]}
                      {palette.mood}
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(palette.id)}
                  className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors"
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      favorites.includes(palette.id) 
                        ? "fill-red-500 text-red-500" 
                        : "text-muted-foreground"
                    }`} 
                  />
                </button>
              </div>

              {/* Color Swatches */}
              <div className="flex rounded-xl overflow-hidden shadow-sm mb-3 h-14">
                {palette.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => copyColor(color)}
                    className="flex-1 relative group/color transition-all hover:flex-[1.3]"
                    style={{ backgroundColor: color }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/color:opacity-100 transition-opacity bg-black/20">
                      {copiedColor === color ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <Copy className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Hex Codes */}
              <div className="flex flex-wrap gap-1 mb-3">
                {palette.colors.map((color, index) => (
                  <span 
                    key={index}
                    className="text-[9px] font-mono text-muted-foreground uppercase"
                  >
                    {color}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => copyAllColors(palette.colors)}
                  variant="outline"
                  className="flex-1 rounded-xl text-xs h-9"
                  size="sm"
                >
                  {copiedColor === palette.colors.join(",") ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy All
                    </>
                  )}
                </Button>
                <Link href={`/validation?colors=${palette.colors.map(c => c.slice(1)).join(",")}`}>
                  <Button className="rounded-xl text-xs h-9" size="sm">
                    <Palette className="w-3 h-3 mr-1" />
                    Use
                  </Button>
                </Link>
              </div>

              {/* Quick Use Buttons */}
              <div className="flex gap-1 mt-2 pt-2 border-t border-border">
                <Link href={`/wardrobe?colors=${palette.colors.map(c => c.slice(1)).join(",")}`} className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full h-7 text-[10px] rounded-lg">
                    <Shirt className="w-3 h-3 mr-1" />
                    Wardrobe
                  </Button>
                </Link>
                <Link href={`/validation?colors=${palette.colors.map(c => c.slice(1)).join(",")}`} className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full h-7 text-[10px] rounded-lg">
                    <Globe className="w-3 h-3 mr-1" />
                    Website
                  </Button>
                </Link>
                <Link href={`/validation?colors=${palette.colors.map(c => c.slice(1)).join(",")}`} className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full h-7 text-[10px] rounded-lg">
                    <Home className="w-3 h-3 mr-1" />
                    Interior
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPalettes.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No palettes found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search term
          </p>
          <Button onClick={clearFilters} variant="outline" className="rounded-xl">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

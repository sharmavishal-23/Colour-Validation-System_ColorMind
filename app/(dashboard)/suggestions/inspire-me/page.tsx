"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { 
  Wand2,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Copy,
  Check,
  Palette,
  Sparkles,
  Sun,
  Moon,
  Shirt,
  Globe,
  Home,
  Image as ImageIcon
} from "lucide-react"

interface Mood {
  id: string
  label: string
  image: string
  description: string
}

interface Purpose {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  image: string
}

interface Preference {
  id: string
  label: string
  description: string
}

interface PaletteSuggestion {
  colors: string[]
  reason: string
  name: string
}

const moods: Mood[] = [
  { id: "happy", label: "Happy", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&q=80", description: "Bright, cheerful vibes" },
  { id: "calm", label: "Calm", image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=300&q=80", description: "Peaceful, serene tones" },
  { id: "energetic", label: "Energetic", image: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=300&q=80", description: "Bold, vibrant energy" },
  { id: "romantic", label: "Romantic", image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&q=80", description: "Soft, loving feelings" },
  { id: "professional", label: "Professional", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80", description: "Clean, trustworthy look" },
  { id: "creative", label: "Creative", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&q=80", description: "Artistic, unique style" },
]

const purposes: Purpose[] = [
  { id: "clothing", label: "Clothing", description: "Wardrobe & fashion", icon: <Shirt className="w-5 h-5" />, image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=300&q=80" },
  { id: "website", label: "Website", description: "Web design & UI", icon: <Globe className="w-5 h-5" />, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&q=80" },
  { id: "poster", label: "Poster", description: "Print & signage", icon: <ImageIcon className="w-5 h-5" />, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&q=80" },
  { id: "social", label: "Social Media", description: "Instagram, TikTok", icon: <Sparkles className="w-5 h-5" />, image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=300&q=80" },
  { id: "room", label: "Interior", description: "Room & decor", icon: <Home className="w-5 h-5" />, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80" },
  { id: "branding", label: "Branding", description: "Logo & identity", icon: <Palette className="w-5 h-5" />, image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=300&q=80" }
]

const lightnessPreferences: Preference[] = [
  { id: "light", label: "Light & Airy", description: "Soft, bright tones" },
  { id: "dark", label: "Dark & Moody", description: "Deep, rich colors" },
  { id: "mixed", label: "Balanced Mix", description: "Combination of both" }
]

// Multiple palette suggestions per mood/purpose combination with reasons
const paletteSuggestions: Record<string, Record<string, PaletteSuggestion[]>> = {
  happy: {
    clothing: [
      { colors: ["#FFD93D", "#FF6B6B", "#4ECDC4", "#F7FFF7"], name: "Sunny Day", reason: "Cheerful colors that brighten any outfit and spread positive energy" },
      { colors: ["#FF9A8B", "#FF6A88", "#FF99AC", "#FFECD2"], name: "Peachy Glow", reason: "Warm, approachable tones perfect for casual happy occasions" },
      { colors: ["#F8B500", "#FF6F61", "#88D8B0", "#FFEAA7"], name: "Citrus Burst", reason: "Fresh, zesty colors that convey optimism and friendliness" }
    ],
    website: [
      { colors: ["#FFC93C", "#FF6F61", "#6BCB77", "#FFFFFF"], name: "Playful Web", reason: "High contrast, joyful palette that creates engaging user experiences" },
      { colors: ["#FFE66D", "#4ECDC4", "#FF6B6B", "#FAFAFA"], name: "Vibrant UI", reason: "Eye-catching colors that guide users with positivity" },
      { colors: ["#F9ED69", "#F08A5D", "#B83B5E", "#FFFFFF"], name: "Sunset Gradient", reason: "Warm progression that feels welcoming and energetic" }
    ],
    poster: [
      { colors: ["#FFE66D", "#F38181", "#AA96DA", "#95E1D3"], name: "Festival Vibes", reason: "Bold and attention-grabbing for maximum visual impact" },
      { colors: ["#FFBE76", "#FF7979", "#BADC58", "#F9CA24"], name: "Carnival Joy", reason: "Celebratory colors that evoke fun and excitement" },
      { colors: ["#FFC312", "#EE5A24", "#009432", "#A3CB38"], name: "Pop Art", reason: "High-energy contrast that commands attention" }
    ],
    social: [
      { colors: ["#FF9A9E", "#FECFEF", "#A8E6CF", "#FFFFFF"], name: "Insta Ready", reason: "Soft yet vibrant tones that photograph beautifully" },
      { colors: ["#FFC3A0", "#FFAFBD", "#B8F2E6", "#FFF8E8"], name: "Feed Aesthetic", reason: "Cohesive pastel-meets-bright for scroll-stopping content" },
      { colors: ["#F093FB", "#F5576C", "#4FACFE", "#43E97B"], name: "Viral Energy", reason: "Dynamic gradient colors that trend on social platforms" }
    ],
    room: [
      { colors: ["#FFF176", "#FFAB91", "#80DEEA", "#FFFFFF"], name: "Sunny Room", reason: "Light, airy colors that make spaces feel open and cheerful" },
      { colors: ["#FFE082", "#FFCC80", "#A5D6A7", "#FAFAFA"], name: "Morning Light", reason: "Warm neutrals with happy accents for cozy brightness" },
      { colors: ["#FFEB3B", "#FF9800", "#8BC34A", "#FFFFFF"], name: "Playful Space", reason: "Perfect for creative areas and kids rooms" }
    ],
    branding: [
      { colors: ["#FFD700", "#FF6347", "#32CD32", "#FFFFFF"], name: "Bold Happy", reason: "Confident, optimistic brand identity that stands out" },
      { colors: ["#FFAB00", "#FF6D00", "#00E676", "#FFFFFF"], name: "Energetic Brand", reason: "Dynamic colors for brands that want to inspire action" },
      { colors: ["#FFC107", "#E91E63", "#00BCD4", "#FFFFFF"], name: "Vibrant Identity", reason: "Memorable color story that conveys positivity and innovation" }
    ]
  },
  calm: {
    clothing: [
      { colors: ["#E8F5E9", "#B2DFDB", "#B3E5FC", "#FFFFFF"], name: "Serene Layers", reason: "Soft, tranquil tones for a peaceful, collected appearance" },
      { colors: ["#E0F2F1", "#B2EBF2", "#E3F2FD", "#FAFAFA"], name: "Ocean Mist", reason: "Cool, soothing shades that promote relaxation" },
      { colors: ["#C8E6C9", "#DCEDC8", "#F1F8E9", "#FFFFFF"], name: "Garden Peace", reason: "Natural greens that ground and calm the spirit" }
    ],
    website: [
      { colors: ["#E0F7FA", "#F1F8E9", "#FAFAFA", "#37474F"], name: "Minimal Calm", reason: "Clean, uncluttered design that reduces cognitive load" },
      { colors: ["#E8EAF6", "#E1F5FE", "#ECEFF1", "#455A64"], name: "Zen Interface", reason: "Subtle colors that create a meditative browsing experience" },
      { colors: ["#E0F2F1", "#F3E5F5", "#FFF8E1", "#37474F"], name: "Soft Balance", reason: "Harmonious palette for wellness and lifestyle brands" }
    ],
    poster: [
      { colors: ["#CFD8DC", "#ECEFF1", "#E8EAF6", "#263238"], name: "Quiet Elegance", reason: "Understated sophistication that communicates clearly" },
      { colors: ["#B0BEC5", "#CFD8DC", "#ECEFF1", "#37474F"], name: "Misty Morning", reason: "Soft gradations for contemplative, artistic pieces" },
      { colors: ["#E0E0E0", "#F5F5F5", "#BDBDBD", "#424242"], name: "Minimalist", reason: "Pure simplicity that lets content shine" }
    ],
    social: [
      { colors: ["#B2EBF2", "#C8E6C9", "#FFF9C4", "#FFFFFF"], name: "Wellness Vibes", reason: "Calming aesthetic perfect for mindfulness content" },
      { colors: ["#E1BEE7", "#D1C4E9", "#C5CAE9", "#FFFFFF"], name: "Dreamy Feed", reason: "Soft lavender tones for peaceful, aesthetic content" },
      { colors: ["#B2DFDB", "#C8E6C9", "#DCEDC8", "#FFFFFF"], name: "Nature Calm", reason: "Organic greens that connect viewers to nature" }
    ],
    room: [
      { colors: ["#E0E7EE", "#D7E3EB", "#C5D4E0", "#2C3E50"], name: "Coastal Retreat", reason: "Tranquil blues and grays for restful bedrooms and bathrooms" },
      { colors: ["#ECEFF1", "#CFD8DC", "#B0BEC5", "#455A64"], name: "Modern Serenity", reason: "Neutral palette that promotes focus and relaxation" },
      { colors: ["#E8F5E9", "#C8E6C9", "#A5D6A7", "#37474F"], name: "Spa Sanctuary", reason: "Nature-inspired calm for ultimate relaxation spaces" }
    ],
    branding: [
      { colors: ["#90A4AE", "#A5D6A7", "#81D4FA", "#212121"], name: "Trusted Calm", reason: "Professional tranquility for wellness and healthcare brands" },
      { colors: ["#78909C", "#81C784", "#4DD0E1", "#263238"], name: "Serene Pro", reason: "Balanced professionalism with calming undertones" },
      { colors: ["#607D8B", "#8BC34A", "#03A9F4", "#212121"], name: "Nature Trust", reason: "Grounded, reliable identity for eco-conscious brands" }
    ]
  },
  energetic: {
    clothing: [
      { colors: ["#FF5722", "#E91E63", "#00BCD4", "#FFFFFF"], name: "Power Move", reason: "High-impact colors for making bold fashion statements" },
      { colors: ["#F44336", "#FF9800", "#FFEB3B", "#FFFFFF"], name: "Fire Starter", reason: "Warm, dynamic palette that radiates confidence" },
      { colors: ["#E91E63", "#9C27B0", "#2196F3", "#FFFFFF"], name: "Electric Style", reason: "Vibrant contrasts for standout, memorable looks" }
    ],
    website: [
      { colors: ["#F44336", "#FF9800", "#4CAF50", "#FFFFFF"], name: "Action UI", reason: "High-energy interface that motivates user interaction" },
      { colors: ["#FF5722", "#FFC107", "#8BC34A", "#FAFAFA"], name: "Dynamic Web", reason: "Exciting colors for fitness, sports, and action brands" },
      { colors: ["#E91E63", "#FF5722", "#00BCD4", "#FFFFFF"], name: "Bold Digital", reason: "Striking palette that creates urgency and excitement" }
    ],
    poster: [
      { colors: ["#FF1744", "#FF9100", "#00E676", "#1A1A1A"], name: "Maximum Impact", reason: "Extreme contrast for events and promotions that demand attention" },
      { colors: ["#F50057", "#FF6D00", "#76FF03", "#212121"], name: "Festival Night", reason: "Electric neon palette for concerts and nightlife" },
      { colors: ["#D50000", "#FFAB00", "#00C853", "#000000"], name: "Sports Energy", reason: "Championship colors that convey power and victory" }
    ],
    social: [
      { colors: ["#FF4081", "#FF6D00", "#76FF03", "#FFFFFF"], name: "Viral Potential", reason: "Thumb-stopping colors optimized for engagement" },
      { colors: ["#F50057", "#FF9100", "#00E676", "#FAFAFA"], name: "Trend Setter", reason: "Bold palette that performs well on all platforms" },
      { colors: ["#FF1744", "#FFEA00", "#00E5FF", "#FFFFFF"], name: "Social Buzz", reason: "High-saturation colors that demand attention in feeds" }
    ],
    room: [
      { colors: ["#FF7043", "#FFA726", "#66BB6A", "#FFFFFF"], name: "Active Space", reason: "Energizing colors perfect for home gyms and creative studios" },
      { colors: ["#FF5722", "#FF9800", "#4CAF50", "#FAFAFA"], name: "Motivation Room", reason: "Warm, stimulating environment for productive spaces" },
      { colors: ["#E91E63", "#FF5722", "#8BC34A", "#FFFFFF"], name: "Creative Energy", reason: "Inspiring palette for workspaces that spark ideas" }
    ],
    branding: [
      { colors: ["#D50000", "#FF6D00", "#00C853", "#1A1A1A"], name: "Power Brand", reason: "Aggressive, memorable identity for bold companies" },
      { colors: ["#F44336", "#FF9800", "#4CAF50", "#FFFFFF"], name: "Action First", reason: "Dynamic brand colors that inspire immediate action" },
      { colors: ["#E91E63", "#FF5722", "#00BCD4", "#212121"], name: "Disruptor", reason: "Category-breaking palette for innovative brands" }
    ]
  },
  romantic: {
    clothing: [
      { colors: ["#FFCDD2", "#F8BBD0", "#E1BEE7", "#FFFFFF"], name: "Soft Love", reason: "Delicate, feminine tones perfect for date nights and special occasions" },
      { colors: ["#FCE4EC", "#F3E5F5", "#E8EAF6", "#FFFFFF"], name: "Blushing Beauty", reason: "Subtle romantic palette that flatters all skin tones" },
      { colors: ["#F48FB1", "#CE93D8", "#9FA8DA", "#FAFAFA"], name: "Twilight Romance", reason: "Dreamy purples and pinks for enchanting evening wear" }
    ],
    website: [
      { colors: ["#FCE4EC", "#F3E5F5", "#EDE7F6", "#4A148C"], name: "Love Story", reason: "Soft, inviting palette for wedding and romance brands" },
      { colors: ["#FFF0F5", "#FFE4E1", "#E6E6FA", "#8B008B"], name: "Elegant Romance", reason: "Sophisticated palette for luxury relationship services" },
      { colors: ["#FFEBEE", "#FCE4EC", "#F3E5F5", "#880E4F"], name: "Heart Centered", reason: "Warm, emotional design for connection-focused platforms" }
    ],
    poster: [
      { colors: ["#FF8A80", "#FF80AB", "#EA80FC", "#1A1A1A"], name: "Passionate", reason: "Vibrant romantic colors for bold love-themed designs" },
      { colors: ["#F48FB1", "#CE93D8", "#B39DDB", "#37474F"], name: "Dreamy Love", reason: "Soft gradients for wedding invitations and romantic events" },
      { colors: ["#EF9A9A", "#F48FB1", "#CE93D8", "#4A148C"], name: "Valentine", reason: "Classic romantic palette that never goes out of style" }
    ],
    social: [
      { colors: ["#FFCCD5", "#FFB3C1", "#FF8FA3", "#FFFFFF"], name: "Love Feed", reason: "Instagram-perfect pink palette for relationship content" },
      { colors: ["#F8BBD0", "#E1BEE7", "#D1C4E9", "#FFFFFF"], name: "Couple Goals", reason: "Soft aesthetic for love stories and couple content" },
      { colors: ["#FFCDD2", "#F8BBD0", "#E1BEE7", "#FAFAFA"], name: "Romance Aesthetic", reason: "Cohesive palette for romantic lifestyle content" }
    ],
    room: [
      { colors: ["#F8E8E8", "#F4E1E6", "#E8D5E4", "#4A4A4A"], name: "Romantic Retreat", reason: "Cozy, intimate atmosphere for bedrooms" },
      { colors: ["#FFF0F5", "#FFE4E1", "#E6E6FA", "#696969"], name: "Bridal Suite", reason: "Elegant and dreamy for romantic living spaces" },
      { colors: ["#FCE4EC", "#F3E5F5", "#EDE7F6", "#424242"], name: "Soft Blush", reason: "Subtle romance that ages beautifully in interiors" }
    ],
    branding: [
      { colors: ["#E91E63", "#9C27B0", "#673AB7", "#FFFFFF"], name: "Love Brand", reason: "Bold romantic identity for dating and relationship brands" },
      { colors: ["#F06292", "#BA68C8", "#9575CD", "#FFFFFF"], name: "Heart Forward", reason: "Approachable romance for connection-focused businesses" },
      { colors: ["#EC407A", "#AB47BC", "#7E57C2", "#FAFAFA"], name: "Modern Love", reason: "Contemporary romantic palette for progressive brands" }
    ]
  },
  professional: {
    clothing: [
      { colors: ["#37474F", "#455A64", "#607D8B", "#FFFFFF"], name: "Executive", reason: "Timeless, authoritative colors for business settings" },
      { colors: ["#263238", "#37474F", "#546E7A", "#ECEFF1"], name: "Power Suit", reason: "Commanding presence for leadership and presentations" },
      { colors: ["#1A237E", "#283593", "#3949AB", "#FFFFFF"], name: "Corporate Navy", reason: "Classic professional palette that builds trust" }
    ],
    website: [
      { colors: ["#263238", "#37474F", "#546E7A", "#FFFFFF"], name: "Corporate Clean", reason: "Trustworthy, professional aesthetic for B2B platforms" },
      { colors: ["#1A237E", "#303F9F", "#3F51B5", "#FFFFFF"], name: "Enterprise Blue", reason: "Reliable, secure feeling for financial and tech companies" },
      { colors: ["#212121", "#424242", "#616161", "#FAFAFA"], name: "Modern Professional", reason: "Sleek, sophisticated design for premium services" }
    ],
    poster: [
      { colors: ["#1A237E", "#283593", "#303F9F", "#FFFFFF"], name: "Business Forward", reason: "Authoritative design for conferences and corporate events" },
      { colors: ["#263238", "#37474F", "#455A64", "#ECEFF1"], name: "Executive Edge", reason: "Refined palette for professional presentations" },
      { colors: ["#0D47A1", "#1565C0", "#1976D2", "#FFFFFF"], name: "Trust Signal", reason: "Blue-focused palette that conveys reliability and expertise" }
    ],
    social: [
      { colors: ["#1565C0", "#1976D2", "#1E88E5", "#FFFFFF"], name: "LinkedIn Ready", reason: "Professional palette optimized for business networking" },
      { colors: ["#0D47A1", "#1565C0", "#42A5F5", "#FAFAFA"], name: "B2B Content", reason: "Trustworthy colors for business-focused social content" },
      { colors: ["#1A237E", "#303F9F", "#5C6BC0", "#FFFFFF"], name: "Thought Leader", reason: "Authoritative palette for professional personal brands" }
    ],
    room: [
      { colors: ["#424242", "#616161", "#757575", "#FAFAFA"], name: "Executive Office", reason: "Focused, distraction-free environment for productivity" },
      { colors: ["#37474F", "#455A64", "#607D8B", "#ECEFF1"], name: "Corner Office", reason: "Sophisticated palette for home offices and meeting rooms" },
      { colors: ["#263238", "#37474F", "#546E7A", "#FFFFFF"], name: "Power Space", reason: "Commanding environment for serious work" }
    ],
    branding: [
      { colors: ["#0D47A1", "#1565C0", "#1976D2", "#FFFFFF"], name: "Trust Blue", reason: "Classic professional identity for established businesses" },
      { colors: ["#1A237E", "#303F9F", "#3F51B5", "#FAFAFA"], name: "Enterprise Grade", reason: "Solid, dependable brand presence for B2B companies" },
      { colors: ["#263238", "#37474F", "#455A64", "#FFFFFF"], name: "Premium Pro", reason: "Sophisticated identity for consulting and professional services" }
    ]
  },
  creative: {
    clothing: [
      { colors: ["#E040FB", "#7C4DFF", "#448AFF", "#FFFFFF"], name: "Artist Palette", reason: "Expressive colors for creative professionals and artists" },
      { colors: ["#AA00FF", "#651FFF", "#2979FF", "#FAFAFA"], name: "Designer Edge", reason: "Bold, innovative palette for standing out in creative industries" },
      { colors: ["#D500F9", "#6200EA", "#304FFE", "#FFFFFF"], name: "Creative Rebel", reason: "Unconventional colors for rule-breaking fashion" }
    ],
    website: [
      { colors: ["#AA00FF", "#651FFF", "#2979FF", "#FFFFFF"], name: "Innovation Hub", reason: "Forward-thinking design for creative agencies and tech startups" },
      { colors: ["#D500F9", "#6200EA", "#304FFE", "#FAFAFA"], name: "Digital Canvas", reason: "Artistic palette for portfolio and gallery sites" },
      { colors: ["#E040FB", "#7C4DFF", "#00E5FF", "#FFFFFF"], name: "Creative Tech", reason: "Blend of creativity and technology for modern brands" }
    ],
    poster: [
      { colors: ["#D500F9", "#6200EA", "#304FFE", "#FFFFFF"], name: "Art Show", reason: "Gallery-worthy palette for exhibitions and creative events" },
      { colors: ["#FF4081", "#E040FB", "#7C4DFF", "#1A1A1A"], name: "Design Festival", reason: "Eye-catching colors for creative industry events" },
      { colors: ["#AA00FF", "#651FFF", "#00B0FF", "#FFFFFF"], name: "Avant-Garde", reason: "Cutting-edge palette for experimental visual work" }
    ],
    social: [
      { colors: ["#F50057", "#D500F9", "#651FFF", "#FFFFFF"], name: "Creative Feed", reason: "Stand-out palette for designers and artists on social" },
      { colors: ["#FF4081", "#E040FB", "#7C4DFF", "#FAFAFA"], name: "Portfolio Perfect", reason: "Cohesive colors that showcase creative work beautifully" },
      { colors: ["#D500F9", "#651FFF", "#00B0FF", "#FFFFFF"], name: "Design Inspo", reason: "Inspiring palette for creative community engagement" }
    ],
    room: [
      { colors: ["#CE93D8", "#B39DDB", "#9FA8DA", "#FFFFFF"], name: "Studio Space", reason: "Inspiring environment that stimulates creativity" },
      { colors: ["#E1BEE7", "#D1C4E9", "#C5CAE9", "#FAFAFA"], name: "Artist Retreat", reason: "Soft creative palette for design studios and art rooms" },
      { colors: ["#EA80FC", "#B388FF", "#8C9EFF", "#FFFFFF"], name: "Imagination Room", reason: "Playful, inspiring space for brainstorming and creation" }
    ],
    branding: [
      { colors: ["#9C27B0", "#673AB7", "#3F51B5", "#FFFFFF"], name: "Creative Agency", reason: "Bold identity for design studios and creative businesses" },
      { colors: ["#AA00FF", "#651FFF", "#2979FF", "#FAFAFA"], name: "Innovation First", reason: "Forward-thinking brand for tech-creative hybrids" },
      { colors: ["#D500F9", "#6200EA", "#304FFE", "#FFFFFF"], name: "Visionary", reason: "Distinctive palette for brands that push boundaries" }
    ]
  }
}

export default function InspireMePage() {
  const [step, setStep] = useState(1)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null)
  const [selectedLightness, setSelectedLightness] = useState<string>("mixed")
  const [generatedPalettes, setGeneratedPalettes] = useState<PaletteSuggestion[] | null>(null)
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!selectedMood || !selectedPurpose) return
    
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const palettes = paletteSuggestions[selectedMood]?.[selectedPurpose] || [
      { colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFFFFF"], name: "Default", reason: "A balanced, versatile palette" }
    ]
    
    setGeneratedPalettes(palettes)
    setSelectedPaletteIndex(0)
    setIsGenerating(false)
    setStep(4)
  }

  const copyColor = async (color: string) => {
    await navigator.clipboard.writeText(color)
    setCopiedColor(color)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const copyAllColors = async () => {
    if (!generatedPalettes) return
    await navigator.clipboard.writeText(generatedPalettes[selectedPaletteIndex].colors.join(", "))
    setCopiedColor("all")
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const reset = () => {
    setStep(1)
    setSelectedMood(null)
    setSelectedPurpose(null)
    setSelectedLightness("mixed")
    setGeneratedPalettes(null)
    setSelectedPaletteIndex(0)
  }

  const currentPalette = generatedPalettes?.[selectedPaletteIndex]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Get Inspired</h1>
          <p className="text-muted-foreground">
            Tell us your mood and purpose, and we will create perfect palettes for you.
          </p>
        </div>
        <Link href="/suggestions/with-color">
          <Button variant="ghost" className="rounded-xl text-muted-foreground">
            Have a color in mind?
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all ${
              s === step ? "w-8 bg-primary" :
              s < step ? "w-2 bg-primary/60" : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Select Mood */}
      {step === 1 && (
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-foreground mb-2">
                What vibe are you going for?
              </h2>
              <p className="text-muted-foreground">
                Pick a mood that matches your vision
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`group relative rounded-xl overflow-hidden aspect-[4/3] transition-all ${
                    selectedMood === mood.id 
                      ? "ring-4 ring-primary ring-offset-2" 
                      : "hover:scale-[1.02]"
                  }`}
                >
                  <Image
                    src={mood.image}
                    alt={mood.label}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-left">
                    <div className="font-bold">{mood.label}</div>
                    <div className="text-xs opacity-80">{mood.description}</div>
                  </div>
                  {selectedMood === mood.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedMood}
                className="rounded-xl px-8"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Purpose */}
      {step === 2 && (
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-foreground mb-2">
                What is this palette for?
              </h2>
              <p className="text-muted-foreground">
                We will optimize the colors for your use case
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {purposes.map((purpose) => (
                <button
                  key={purpose.id}
                  onClick={() => setSelectedPurpose(purpose.id)}
                  className={`group relative rounded-xl overflow-hidden aspect-[4/3] transition-all ${
                    selectedPurpose === purpose.id 
                      ? "ring-4 ring-primary ring-offset-2" 
                      : "hover:scale-[1.02]"
                  }`}
                >
                  <Image
                    src={purpose.image}
                    alt={purpose.label}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1 rounded bg-white/20">
                        {purpose.icon}
                      </div>
                      <span className="font-bold">{purpose.label}</span>
                    </div>
                    <div className="text-xs opacity-80">{purpose.description}</div>
                  </div>
                  {selectedPurpose === purpose.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button
                onClick={() => setStep(1)}
                variant="ghost"
                className="rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedPurpose}
                className="rounded-xl"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Preferences (Light/Dark) */}
      {step === 3 && (
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Light or dark preference?
              </h2>
              <p className="text-muted-foreground">
                This helps us fine-tune your palette
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {lightnessPreferences.map((pref) => (
                <button
                  key={pref.id}
                  onClick={() => setSelectedLightness(pref.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-center ${
                    selectedLightness === pref.id 
                      ? "border-primary bg-primary/10" 
                      : "border-border hover:border-primary/50 hover:bg-secondary"
                  }`}
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center bg-secondary">
                    {pref.id === "light" && <Sun className="w-6 h-6 text-yellow-500" />}
                    {pref.id === "dark" && <Moon className="w-6 h-6 text-indigo-500" />}
                    {pref.id === "mixed" && <Sparkles className="w-6 h-6 text-purple-500" />}
                  </div>
                  <div className="font-semibold text-foreground">{pref.label}</div>
                  <div className="text-sm text-muted-foreground">{pref.description}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button
                onClick={() => setStep(2)}
                variant="ghost"
                className="rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="rounded-xl"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Creating magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Palettes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Results - Multiple Palettes */}
      {step === 4 && generatedPalettes && currentPalette && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          {/* Palette Selector */}
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Choose Your Palette</h2>
                <Badge variant="outline" className="rounded-lg">
                  {generatedPalettes.length} options
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {generatedPalettes.map((palette, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPaletteIndex(index)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      selectedPaletteIndex === index
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex rounded-lg overflow-hidden h-10 mb-2">
                      {palette.colors.map((color, i) => (
                        <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <p className="font-medium text-sm text-foreground">{palette.name}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Palette Details */}
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="flex flex-wrap justify-center gap-2 mb-2">
                  <Badge className="rounded-lg capitalize">{selectedMood}</Badge>
                  <Badge variant="outline" className="rounded-lg capitalize">{selectedPurpose}</Badge>
                </div>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  {currentPalette.name}
                </h2>
              </div>

              {/* Color Strip */}
              <div className="flex rounded-2xl overflow-hidden shadow-lg h-20 mb-4">
                {currentPalette.colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex-1"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Reason - Why this palette */}
              <div className="bg-primary/5 rounded-xl p-4 mb-6">
                <p className="text-sm font-medium text-primary mb-1">Why this works:</p>
                <p className="text-foreground">{currentPalette.reason}</p>
              </div>

              {/* Individual Colors */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {currentPalette.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => copyColor(color)}
                    className="group p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-center"
                  >
                    <div
                      className="w-full h-16 rounded-lg shadow-md mb-3"
                      style={{ backgroundColor: color }}
                    />
                    <p className="font-mono text-sm text-foreground">{color}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {copiedColor === color ? "Copied!" : "Click to copy"}
                    </p>
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  onClick={copyAllColors}
                  variant="outline"
                  className="rounded-xl"
                >
                  {copiedColor === "all" ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All Colors
                    </>
                  )}
                </Button>
                <Link href={`/validation?colors=${currentPalette.colors.map(c => c.slice(1)).join(",")}`}>
                  <Button className="rounded-xl">
                    <Palette className="w-4 h-4 mr-2" />
                    Validate Palette
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Use This Palette Section */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4 text-center">Use this palette for:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link href={`/wardrobe?colors=${currentPalette.colors.map(c => c.slice(1)).join(",")}`}>
                  <Button variant="outline" className="w-full rounded-xl h-12 justify-start gap-2">
                    <Shirt className="w-5 h-5" />
                    Wardrobe
                  </Button>
                </Link>
                <Link href={`/validation?colors=${currentPalette.colors.map(c => c.slice(1)).join(",")}`}>
                  <Button variant="outline" className="w-full rounded-xl h-12 justify-start gap-2">
                    <Globe className="w-5 h-5" />
                    Website
                  </Button>
                </Link>
                <Link href={`/validation?colors=${currentPalette.colors.map(c => c.slice(1)).join(",")}`}>
                  <Button variant="outline" className="w-full rounded-xl h-12 justify-start gap-2">
                    <Home className="w-5 h-5" />
                    Interior
                  </Button>
                </Link>
                <Link href={`/validation?colors=${currentPalette.colors.map(c => c.slice(1)).join(",")}`}>
                  <Button variant="outline" className="w-full rounded-xl h-12 justify-start gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Poster
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Generate Another */}
          <div className="flex justify-center gap-3">
            <Button
              onClick={() => setStep(3)}
              variant="outline"
              className="rounded-xl"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
            <Button
              onClick={reset}
              variant="ghost"
              className="rounded-xl"
            >
              Start Over
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

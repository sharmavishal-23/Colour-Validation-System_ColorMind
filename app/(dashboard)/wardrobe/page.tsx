"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { validateColorCombination } from "@/lib/color-utils"
import { 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Eye,
  EyeOff
} from "lucide-react"

interface ClothingItem {
  id: string
  label: string
  defaultColor: string
  category: "essential" | "optional"
}

const clothingItems: ClothingItem[] = [
  { id: "top", label: "Top", defaultColor: "#4A90D9", category: "essential" },
  { id: "bottom", label: "Bottom", defaultColor: "#2C3E50", category: "essential" },
  { id: "shoes", label: "Shoes", defaultColor: "#8B4513", category: "essential" },
  { id: "jacket", label: "Jacket", defaultColor: "#1A1A2E", category: "optional" },
  { id: "accessory", label: "Accessory", defaultColor: "#F39C12", category: "optional" },
  { id: "bag", label: "Bag", defaultColor: "#795548", category: "optional" },
]

const outfitSuggestions = {
  good: [
    "This outfit is fire! The colors complement each other beautifully.",
    "You have got great taste! These colors create a harmonious look.",
    "Perfect match! You are ready to turn heads.",
    "Love it! The color balance is spot on."
  ],
  average: [
    "Not bad! Consider adjusting one piece for a more cohesive look.",
    "It works, but swapping one item could make it pop more.",
    "Decent combo! Try a neutral accessory to tie it together.",
    "Almost there! The outfit has potential with small tweaks."
  ],
  poor: [
    "Hmm, these colors might clash. Try a more neutral piece.",
    "Bold choice! But consider toning down one item.",
    "The colors are fighting each other. Pick one hero color!",
    "Let us remix this! Try keeping 2 colors and changing the rest."
  ]
}

// Realistic skin tone colors
const skinTones = [
  { id: "light", name: "Light", color: "#FFECD2" },
  { id: "medium-light", name: "Medium Light", color: "#E8C4A2" },
  { id: "medium", name: "Medium", color: "#D4A574" },
  { id: "medium-dark", name: "Medium Dark", color: "#A67C52" },
  { id: "dark", name: "Dark", color: "#8D5524" },
]

export default function WardrobePage() {
  const [colors, setColors] = useState<Record<string, string>>(
    Object.fromEntries(clothingItems.map(item => [item.id, item.defaultColor]))
  )
  const [activeItems, setActiveItems] = useState<Set<string>>(
    new Set(["top", "bottom", "shoes"])
  )
  const [skinTone, setSkinTone] = useState(skinTones[1])
  const [result, setResult] = useState<ReturnType<typeof validateColorCombination> | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [suggestion, setSuggestion] = useState("")

  const handleColorChange = (id: string, color: string) => {
    setColors(prev => ({ ...prev, [id]: color }))
    setResult(null)
  }

  const toggleItem = (id: string) => {
    const newActive = new Set(activeItems)
    if (newActive.has(id)) {
      if (newActive.size > 2) {
        newActive.delete(id)
      }
    } else {
      newActive.add(id)
    }
    setActiveItems(newActive)
    setResult(null)
  }

  const handleValidate = async () => {
    setIsValidating(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const activeColors = Array.from(activeItems).map(id => colors[id])
    const validationResult = validateColorCombination(activeColors)
    setResult(validationResult)
    
    const suggestions = outfitSuggestions[validationResult.status]
    setSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)])
    
    setIsValidating(false)
  }

  const handleRandomize = () => {
    const newColors: Record<string, string> = {}
    clothingItems.forEach(item => {
      newColors[item.id] = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, "0")
    })
    setColors(newColors)
    setResult(null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <ThumbsUp className="w-8 h-8 text-green-500" />
      case "average": return <AlertCircle className="w-8 h-8 text-yellow-500" />
      case "poor": return <ThumbsDown className="w-8 h-8 text-red-500" />
      default: return null
    }
  }

  const essentialItems = clothingItems.filter(i => i.category === "essential")
  const optionalItems = clothingItems.filter(i => i.category === "optional")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Wardrobe Matcher</h1>
        <p className="text-muted-foreground">
          Select clothing items and colors to check if your outfit works.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Clothing Selector */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skin Tone Selector */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-5">
              <h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Skin Tone</h2>
              <div className="flex gap-2">
                {skinTones.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSkinTone(tone)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      skinTone.id === tone.id ? 'border-primary ring-2 ring-primary/30' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: tone.color }}
                    title={tone.name}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Essential Items */}
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-5">
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">Essential Pieces</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {essentialItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-4 rounded-xl border-2 transition-all ${
                      activeItems.has(item.id) 
                        ? 'border-primary bg-primary/5' 
                        : 'border-transparent bg-secondary/30 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleItem(item.id)}
                        className="h-7 w-7 p-0"
                      >
                        {activeItems.has(item.id) ? (
                          <Eye className="w-4 h-4 text-primary" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={colors[item.id]}
                        onChange={(e) => handleColorChange(item.id, e.target.value)}
                        className="w-12 h-12 rounded-xl cursor-pointer border-2 border-border"
                        disabled={!activeItems.has(item.id)}
                      />
                      <span className="text-xs font-mono text-muted-foreground uppercase">
                        {colors[item.id]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Optional Items */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-5">
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">Optional Pieces</h2>
              <div className="grid grid-cols-3 gap-3">
                {optionalItems.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      activeItems.has(item.id) 
                        ? 'border-primary bg-primary/5' 
                        : 'border-transparent bg-secondary/30 hover:bg-secondary/50'
                    }`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      {activeItems.has(item.id) && (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    {activeItems.has(item.id) && (
                      <input
                        type="color"
                        value={colors[item.id]}
                        onChange={(e) => {
                          e.stopPropagation()
                          handleColorChange(item.id, e.target.value)
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full h-10 rounded-lg cursor-pointer border border-border"
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleValidate}
              disabled={isValidating || activeItems.size < 2}
              className="rounded-xl h-11 px-6"
            >
              {isValidating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Check Outfit
                </>
              )}
            </Button>
            <Button
              onClick={handleRandomize}
              variant="outline"
              className="rounded-xl h-11"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Randomize
            </Button>
          </div>
        </div>

        {/* Mannequin Preview */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden sticky top-6">
            <CardContent className="p-6">
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide text-center">Preview</h2>
              
              {/* Clean Mannequin */}
              <div className="relative mx-auto w-48 flex flex-col items-center">
                {/* Head */}
                <div 
                  className="w-14 h-14 rounded-full shadow-md z-10"
                  style={{ backgroundColor: skinTone.color }}
                />
                
                {/* Neck */}
                <div 
                  className="w-6 h-4 -mt-1"
                  style={{ backgroundColor: skinTone.color }}
                />

                {/* Body Container */}
                <div className="flex flex-col items-center -mt-1 relative">
                  {/* Accessory (Scarf/Necklace) */}
                  {activeItems.has("accessory") && (
                    <div className="absolute top-0 z-20">
                      <div 
                        className="w-16 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: colors.accessory }}
                      />
                      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground whitespace-nowrap">Accessory</span>
                    </div>
                  )}

                  {/* Jacket (if active) */}
                  {activeItems.has("jacket") && (
                    <div className="relative">
                      <div 
                        className="w-36 h-28 rounded-lg shadow-lg"
                        style={{ backgroundColor: colors.jacket }}
                      />
                      {/* Top showing through */}
                      {activeItems.has("top") && (
                        <div 
                          className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-20 rounded-t-lg"
                          style={{ backgroundColor: colors.top }}
                        />
                      )}
                      <span className="absolute -right-14 top-1/2 -translate-y-1/2 text-[8px] text-muted-foreground">Jacket</span>
                    </div>
                  )}

                  {/* Top (if no jacket) */}
                  {activeItems.has("top") && !activeItems.has("jacket") && (
                    <div className="relative">
                      <div 
                        className="w-32 h-24 rounded-lg shadow-lg"
                        style={{ backgroundColor: colors.top }}
                      />
                      <span className="absolute -right-10 top-1/2 -translate-y-1/2 text-[8px] text-muted-foreground">Top</span>
                    </div>
                  )}

                  {/* Arms (skin) */}
                  <div className="absolute top-4 -left-2 w-4 h-20 rounded-full" style={{ backgroundColor: skinTone.color }} />
                  <div className="absolute top-4 -right-2 w-4 h-20 rounded-full" style={{ backgroundColor: skinTone.color }} />

                  {/* Bottom */}
                  {activeItems.has("bottom") && (
                    <div className="relative -mt-1">
                      <div 
                        className="w-28 h-32 rounded-b-lg shadow-lg"
                        style={{ backgroundColor: colors.bottom }}
                      />
                      <span className="absolute -right-12 top-1/2 -translate-y-1/2 text-[8px] text-muted-foreground">Bottom</span>
                    </div>
                  )}

                  {/* Bag (side) */}
                  {activeItems.has("bag") && (
                    <div className="absolute right-[-36px] top-20">
                      <div 
                        className="w-8 h-10 rounded-lg shadow-md"
                        style={{ backgroundColor: colors.bag }}
                      />
                      <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[8px] text-muted-foreground">Bag</span>
                    </div>
                  )}
                </div>

                {/* Shoes */}
                {activeItems.has("shoes") && (
                  <div className="relative flex gap-3 mt-1">
                    <div 
                      className="w-10 h-5 rounded-lg shadow-md"
                      style={{ backgroundColor: colors.shoes }}
                    />
                    <div 
                      className="w-10 h-5 rounded-lg shadow-md"
                      style={{ backgroundColor: colors.shoes }}
                    />
                    <span className="absolute -right-12 top-1/2 -translate-y-1/2 text-[8px] text-muted-foreground">Shoes</span>
                  </div>
                )}
              </div>

              {/* Color Strip */}
              <div className="mt-8">
                <p className="text-xs text-muted-foreground mb-2 text-center">Color palette:</p>
                <div className="flex rounded-xl overflow-hidden shadow h-8">
                  {Array.from(activeItems).map((id) => (
                    <div
                      key={id}
                      className="flex-1 relative group"
                      style={{ backgroundColor: colors[id] }}
                      title={clothingItems.find(i => i.id === id)?.label}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-[8px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                        {clothingItems.find(i => i.id === id)?.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results */}
      {result && (
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                result.status === "good" ? "bg-green-100" :
                result.status === "average" ? "bg-yellow-100" : "bg-red-100"
              }`}>
                {getStatusIcon(result.status)}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <Badge className={`rounded-lg px-3 py-0.5 ${
                    result.status === "good" ? "bg-green-500" :
                    result.status === "average" ? "bg-yellow-500" : "bg-red-500"
                  } text-white`}>
                    {result.status === "good" ? "Perfect Match!" :
                     result.status === "average" ? "Almost There" :
                     "Needs Work"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Score: {result.score}/100
                  </span>
                </div>
                
                <p className="text-foreground mb-3">{suggestion}</p>

                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>Harmony:</span>
                  <Badge variant="outline" className="rounded-lg capitalize">
                    {result.harmony.replace("-", " ")}
                  </Badge>
                </div>
              </div>

              <div className="w-32">
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      result.score >= 80 ? "bg-green-500" :
                      result.score >= 50 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
              </div>
            </div>

            {result.suggestions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="font-medium text-foreground mb-2 text-sm">Style Tips</h4>
                <ul className="space-y-1">
                  {result.suggestions.slice(0, 3).map((tip, i) => (
                    <li key={i} className="text-muted-foreground text-sm flex items-start gap-2">
                      <span className="text-primary">-</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

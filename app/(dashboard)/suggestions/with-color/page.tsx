"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  Wand2,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Copy,
  Check,
  Palette,
  Shirt,
  Globe,
  Home,
  Image as ImageIcon,
  Sparkles
} from "lucide-react"

interface Purpose {
  id: string
  label: string
  description: string
  icon: React.ReactNode
}

interface PaletteResult {
  colors: string[]
  name: string
  reason: string
  harmonyType: string
}

const purposes: Purpose[] = [
  { id: "clothing", label: "Clothing", description: "Wardrobe & fashion", icon: <Shirt className="w-5 h-5" /> },
  { id: "website", label: "Website", description: "Web design & UI", icon: <Globe className="w-5 h-5" /> },
  { id: "poster", label: "Poster", description: "Print & signage", icon: <ImageIcon className="w-5 h-5" /> },
  { id: "social", label: "Social Media", description: "Instagram, TikTok", icon: <Sparkles className="w-5 h-5" /> },
  { id: "room", label: "Interior", description: "Room & decor", icon: <Home className="w-5 h-5" /> },
  { id: "branding", label: "Branding", description: "Logo & identity", icon: <Palette className="w-5 h-5" /> }
]

// Generate complementary colors based on base color with reasons
function generatePalettes(baseColor: string, purpose: string): PaletteResult[] {
  const hex = baseColor.replace("#", "")
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  
  // Convert to HSL
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255
  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break
      case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break
      case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break
    }
  }

  const hslToHex = (h: number, s: number, l: number): string => {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    
    const clampS = Math.max(0, Math.min(1, s))
    const clampL = Math.max(0, Math.min(1, l))
    
    if (clampS === 0) {
      const gray = Math.round(clampL * 255)
      return `#${gray.toString(16).padStart(2, "0")}${gray.toString(16).padStart(2, "0")}${gray.toString(16).padStart(2, "0")}`.toUpperCase()
    }
    
    const q = clampL < 0.5 ? clampL * (1 + clampS) : clampL + clampS - clampL * clampS
    const p = 2 * clampL - q
    const rVal = Math.round(hue2rgb(p, q, h + 1/3) * 255)
    const gVal = Math.round(hue2rgb(p, q, h) * 255)
    const bVal = Math.round(hue2rgb(p, q, h - 1/3) * 255)
    
    return `#${rVal.toString(16).padStart(2, "0")}${gVal.toString(16).padStart(2, "0")}${bVal.toString(16).padStart(2, "0")}`.toUpperCase()
  }

  const palettes: PaletteResult[] = []
  
  // Complementary palette
  palettes.push({
    colors: [
      baseColor.toUpperCase(),
      hslToHex((h + 0.5) % 1, s * 0.8, l),
      hslToHex(h, s * 0.3, 0.92),
      hslToHex(h, s * 0.2, 0.15)
    ],
    name: "Complementary",
    reason: "High contrast palette using colors opposite on the wheel - creates visual interest and balance",
    harmonyType: "complementary"
  })
  
  // Analogous palette
  palettes.push({
    colors: [
      baseColor.toUpperCase(),
      hslToHex((h + 0.08) % 1, s * 0.9, l * 1.1),
      hslToHex((h - 0.08 + 1) % 1, s * 0.85, l * 0.9),
      hslToHex(h, s * 0.1, 0.95)
    ],
    name: "Analogous",
    reason: "Harmonious colors sitting next to each other on the wheel - naturally pleasing and cohesive",
    harmonyType: "analogous"
  })
  
  // Triadic palette
  palettes.push({
    colors: [
      baseColor.toUpperCase(),
      hslToHex((h + 0.33) % 1, s * 0.85, l),
      hslToHex((h + 0.67) % 1, s * 0.8, l * 1.1),
      hslToHex(h, s * 0.08, 0.97)
    ],
    name: "Triadic",
    reason: "Three colors evenly spaced on the wheel - vibrant and balanced, great for dynamic designs",
    harmonyType: "triadic"
  })

  // Purpose-specific adjustments
  const purposeNames: Record<string, string> = {
    clothing: "Fashion Forward",
    website: "Digital Ready",
    poster: "Print Perfect",
    social: "Social Optimized",
    room: "Interior Harmony",
    branding: "Brand Identity"
  }
  
  const purposeReasons: Record<string, string> = {
    clothing: "Optimized for wearable combinations that work across seasons and occasions",
    website: "Designed with accessibility and screen readability in mind",
    poster: "High contrast combinations that pop in print and large format",
    social: "Vibrant colors that perform well on social media feeds",
    room: "Calming and balanced tones that create comfortable living spaces",
    branding: "Professional palette with clear hierarchy for brand applications"
  }

  // Add purpose-specific palette
  palettes.push({
    colors: [
      baseColor.toUpperCase(),
      hslToHex((h + 0.15) % 1, s * 0.7, l * 0.85),
      hslToHex(h, s * 0.25, 0.88),
      hslToHex(h, s * 0.12, 0.12)
    ],
    name: purposeNames[purpose] || "Custom",
    reason: purposeReasons[purpose] || "Custom palette optimized for your use case",
    harmonyType: "custom"
  })

  return palettes
}

export default function WithColorPage() {
  const [step, setStep] = useState(1)
  const [baseColor, setBaseColor] = useState("#4A90D9")
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null)
  const [generatedPalettes, setGeneratedPalettes] = useState<PaletteResult[] | null>(null)
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!selectedPurpose) return
    
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const palettes = generatePalettes(baseColor, selectedPurpose)
    setGeneratedPalettes(palettes)
    setSelectedPaletteIndex(0)
    setIsGenerating(false)
    setStep(3)
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
    setSelectedPurpose(null)
    setGeneratedPalettes(null)
    setSelectedPaletteIndex(0)
  }

  const currentPalette = generatedPalettes?.[selectedPaletteIndex]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Build from Your Color</h1>
          <p className="text-muted-foreground">
            Start with a color you love and we will build multiple palette options around it.
          </p>
        </div>
        <Link href="/suggestions/inspire-me">
          <Button variant="ghost" className="rounded-xl text-muted-foreground">
            No color in mind? Get inspired
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 rounded-full transition-all ${
              s === step ? "w-8 bg-primary" :
              s < step ? "w-2 bg-primary/60" : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Step 1: Pick Base Color */}
      {step === 1 && (
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-foreground mb-2">
                Pick your base color
              </h2>
              <p className="text-muted-foreground">
                This will be the foundation of your palette
              </p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-32 h-32 rounded-2xl cursor-pointer border-4 border-card shadow-xl"
              />
              <div className="text-center">
                <span className="text-lg font-mono text-foreground uppercase">{baseColor}</span>
                <p className="text-sm text-muted-foreground mt-1">Click to change</p>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Button
                onClick={() => setStep(2)}
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

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {purposes.map((purpose) => (
                <button
                  key={purpose.id}
                  onClick={() => setSelectedPurpose(purpose.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                    selectedPurpose === purpose.id 
                      ? "border-primary bg-primary/10" 
                      : "border-border hover:border-primary/50 hover:bg-secondary"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${selectedPurpose === purpose.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                    {purpose.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{purpose.label}</div>
                    <div className="text-sm text-muted-foreground">{purpose.description}</div>
                  </div>
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
                onClick={handleGenerate}
                disabled={!selectedPurpose || isGenerating}
                className="rounded-xl"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Palettes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Results - Multiple Palettes */}
      {step === 3 && generatedPalettes && currentPalette && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          {/* Palette Selector */}
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Choose a Harmony Style</h2>
                <Badge variant="outline" className="rounded-lg">
                  {generatedPalettes.length} options
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                    <div className="flex rounded-lg overflow-hidden h-8 mb-2">
                      {palette.colors.map((color, i) => (
                        <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <p className="font-medium text-sm text-foreground">{palette.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{palette.harmonyType}</p>
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
                  <Badge className="rounded-lg">Base: {baseColor.toUpperCase()}</Badge>
                  <Badge variant="outline" className="rounded-lg capitalize">{selectedPurpose}</Badge>
                  <Badge variant="secondary" className="rounded-lg capitalize">{currentPalette.harmonyType}</Badge>
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
                    className="flex-1 relative"
                    style={{ backgroundColor: color }}
                  >
                    {index === 0 && (
                      <span className="absolute top-1 left-1 text-[8px] font-bold px-1 py-0.5 rounded bg-black/30 text-white">
                        Base
                      </span>
                    )}
                  </div>
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
                      className="w-full h-16 rounded-lg shadow-md mb-3 relative"
                      style={{ backgroundColor: color }}
                    >
                      {index === 0 && (
                        <Badge className="absolute -top-2 -right-2 text-[9px] px-1.5 py-0">
                          Base
                        </Badge>
                      )}
                    </div>
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
              onClick={() => {
                setStep(2)
                setGeneratedPalettes(null)
              }}
              variant="outline"
              className="rounded-xl"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Different Purpose
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

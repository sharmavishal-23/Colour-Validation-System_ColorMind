"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { validateColorCombination, suggestImprovement } from "@/lib/color-utils"
import Image from "next/image"
import { 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Copy,
  Check,
  Plus,
  Minus,
  Star,
  Trophy,
  ThumbsUp,
  Zap
} from "lucide-react"

const colorLabels = [
  { label: "Primary", description: "Your main brand/design color" },
  { label: "Secondary", description: "Supporting color" },
  { label: "Accent", description: "Highlights & CTAs" },
  { label: "Color 4", description: "Optional additional color" },
  { label: "Color 5", description: "Optional additional color" }
]

const defaultColors = ["#6366F1", "#F59E0B", "#10B981"]

const harmonyImages: Record<string, string> = {
  "complementary": "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=300&q=80",
  "analogous": "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=300&q=80",
  "triadic": "https://images.unsplash.com/photo-1557682260-96773eb01377?w=300&q=80",
  "monochromatic": "https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=300&q=80",
  "split-complementary": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
  "tetradic": "https://images.unsplash.com/photo-1557682233-43e671455dfa?w=300&q=80",
  "none": "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&q=80"
}

export default function ValidationPage() {
  const searchParams = useSearchParams()
  const [colors, setColors] = useState<string[]>(defaultColors)
  const [colorCount, setColorCount] = useState(3)
  const [result, setResult] = useState<ReturnType<typeof validateColorCombination> | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // Load colors from URL if present
  useEffect(() => {
    const colorsParam = searchParams.get("colors")
    if (colorsParam) {
      const urlColors = colorsParam.split(",").map(c => c.startsWith("#") ? c : `#${c}`)
      if (urlColors.length >= 2 && urlColors.length <= 5) {
        setColors(urlColors)
        setColorCount(urlColors.length)
      }
    }
  }, [searchParams])

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...colors]
    newColors[index] = color
    setColors(newColors)
    setResult(null)
  }

  const addColor = () => {
    if (colorCount < 5) {
      const newCount = colorCount + 1
      setColorCount(newCount)
      if (colors.length < newCount) {
        setColors([...colors, "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, "0")])
      }
      setResult(null)
    }
  }

  const removeColor = () => {
    if (colorCount > 2) {
      setColorCount(colorCount - 1)
      setResult(null)
    }
  }

  const handleValidate = async () => {
    setIsValidating(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    const activeColors = colors.slice(0, colorCount)
    const validationResult = validateColorCombination(activeColors)
    setResult(validationResult)
    setIsValidating(false)
  }

  const handleReset = () => {
    setColors(["#6366F1", "#F59E0B", "#10B981"])
    setColorCount(3)
    setResult(null)
  }

  const handleRandomize = () => {
    const randomColors = Array(colorCount).fill(0).map(() => 
      "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, "0")
    )
    setColors(randomColors)
    setResult(null)
  }

  const copyColor = async (index: number) => {
    await navigator.clipboard.writeText(colors[index])
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good": return <Trophy className="w-6 h-6 text-green-500" />
      case "average": return <ThumbsUp className="w-6 h-6 text-yellow-500" />
      case "poor": return <AlertCircle className="w-6 h-6 text-red-500" />
      default: return null
    }
  }

  const getScoreLabelIcon = (label: string) => {
    switch (label) {
      case "Excellent": return <Trophy className="w-5 h-5" />
      case "Good": return <ThumbsUp className="w-5 h-5" />
      case "Average": return <AlertCircle className="w-5 h-5" />
      case "Poor": return <XCircle className="w-5 h-5" />
      default: return null
    }
  }

  const activeColors = colors.slice(0, colorCount)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Color Validation</h1>
        <p className="text-muted-foreground">
          Start with your primary color, then add supporting colors to check harmony.
        </p>
      </div>

      {/* Primary Color - Featured */}
      <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Start with Your Primary Color</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <input
                type="color"
                value={colors[0]}
                onChange={(e) => handleColorChange(0, e.target.value)}
                className="w-24 h-24 rounded-2xl cursor-pointer border-4 border-card shadow-xl transition-transform hover:scale-105"
                style={{ backgroundColor: colors[0] }}
              />
              <button
                onClick={() => copyColor(0)}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-card rounded-xl shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copiedIndex === 0 ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
            <div>
              <p className="font-medium text-foreground">{colorLabels[0].label}</p>
              <p className="text-sm text-muted-foreground">{colorLabels[0].description}</p>
              <p className="text-sm font-mono text-muted-foreground mt-1 uppercase">{colors[0]}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Colors */}
      <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Supporting Colors</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={removeColor}
                disabled={colorCount <= 2}
                className="rounded-xl h-8 w-8 p-0"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground w-12 text-center">{colorCount} colors</span>
              <Button
                variant="outline"
                size="sm"
                onClick={addColor}
                disabled={colorCount >= 5}
                className="rounded-xl h-8 w-8 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {activeColors.slice(1).map((color, idx) => {
              const index = idx + 1
              return (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="relative group">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                      className="w-16 h-16 rounded-xl cursor-pointer border-2 border-card shadow-lg transition-transform hover:scale-105"
                      style={{ backgroundColor: color }}
                    />
                    <button
                      onClick={() => copyColor(index)}
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-card rounded-lg shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{colorLabels[index].label}</p>
                    <p className="text-xs font-mono text-muted-foreground uppercase">{color}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Preview Strip */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Palette preview:</p>
            <div className="flex rounded-xl overflow-hidden shadow-lg h-12">
              {activeColors.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 transition-all hover:flex-[1.5] flex items-center justify-center"
                  style={{ backgroundColor: color }}
                >
                  <span className="text-xs font-medium opacity-0 hover:opacity-100 transition-opacity" 
                    style={{ color: getContrastColor(color) }}>
                    {index === 0 ? 'Primary' : index === 1 ? 'Secondary' : index === 2 ? 'Accent' : `#${index + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleValidate}
              disabled={isValidating}
              className="rounded-xl h-11 px-6"
            >
              {isValidating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Validate Colors
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
            <Button
              onClick={handleReset}
              variant="ghost"
              className="rounded-xl h-11"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Score Card with Label */}
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  {getStatusIcon(result.status)}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl font-bold text-foreground">
                        {result.score}/100
                      </h3>
                      <Badge className={`${result.scoreLabelColor} bg-transparent border-current rounded-lg px-2 py-0.5 text-sm font-semibold flex items-center gap-1`}>
                        {getScoreLabelIcon(result.scoreLabel)}
                        {result.scoreLabel}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {result.scoreDescription}
                    </p>
                  </div>
                </div>
                
                <div className="w-full sm:w-48">
                  <div className="h-4 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        result.score >= 85 ? "bg-green-500" :
                        result.score >= 70 ? "bg-emerald-500" :
                        result.score >= 50 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Harmony Analysis */}
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-40 h-40 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                  <Image
                    src={harmonyImages[result.harmony] || harmonyImages.none}
                    alt={`${result.harmony} color harmony`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="rounded-lg px-2 py-0.5 text-xs capitalize">
                      {result.harmony.replace("-", " ")}
                    </Badge>
                    <span className="text-sm text-muted-foreground">Harmony Type</span>
                  </div>
                  <p className="text-foreground mb-4">
                    {result.harmonyDescription}
                  </p>
                  
                  {result.contrastIssues.length > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-3">
                      <p className="font-medium text-yellow-600 text-sm mb-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Contrast Issues
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {result.contrastIssues.map((issue, i) => (
                          <li key={i}>- {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {result.strengths && result.strengths.length > 0 && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                      <p className="font-medium text-green-600 text-sm mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Strengths
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {result.strengths.map((strength, i) => (
                          <li key={i}>- {strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-r from-secondary to-accent/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Suggestions for Improvement</h3>
                  <ul className="space-y-1">
                    {result.suggestions.map((suggestion, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        {suggestion}
                      </li>
                    ))}
                    {suggestImprovement(activeColors).map((tip, i) => (
                      <li key={`tip-${i}`} className="text-sm text-muted-foreground flex items-start gap-2">
                        <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Helper function for contrast text
function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

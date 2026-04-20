"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { 
  Upload, 
  ImageIcon, 
  Copy, 
  Check, 
  RefreshCw,
  Wand2,
  Palette,
  Shirt,
  Globe,
  Home,
  Sparkles
} from "lucide-react"

interface ExtractedColor {
  hex: string
  percentage: number
  name: string
  isBackground: boolean
  isDominant: boolean
}

// Better color name approximation
function getColorName(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2 / 255
  const s = max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1)) / 255
  
  // Grayscale detection
  if (Math.abs(r - g) < 15 && Math.abs(g - b) < 15 && Math.abs(r - b) < 15) {
    if (l < 0.15) return "Black"
    if (l < 0.35) return "Dark Gray"
    if (l < 0.65) return "Gray"
    if (l < 0.85) return "Light Gray"
    return "White"
  }
  
  // Low saturation
  if (s < 0.15) {
    if (l < 0.3) return "Charcoal"
    if (l > 0.7) return "Off-White"
    return "Muted Gray"
  }
  
  // Calculate hue
  let h = 0
  if (max !== min) {
    const d = max - min
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  h = h * 360
  
  // Determine color name based on hue
  let colorName = ""
  if (h < 15 || h >= 345) colorName = "Red"
  else if (h < 45) colorName = "Orange"
  else if (h < 70) colorName = "Yellow"
  else if (h < 150) colorName = "Green"
  else if (h < 190) colorName = "Cyan"
  else if (h < 260) colorName = "Blue"
  else if (h < 290) colorName = "Purple"
  else if (h < 345) colorName = "Pink"
  
  // Add lightness modifier
  if (l < 0.25) return `Dark ${colorName}`
  if (l > 0.75) return `Light ${colorName}`
  if (s > 0.7) return `Vivid ${colorName}`
  if (s < 0.4) return `Muted ${colorName}`
  
  return colorName
}

// Improved color extraction using k-means clustering approach
function extractColorsFromImage(imageData: ImageData, numColors: number = 6): ExtractedColor[] {
  const pixels: number[][] = []
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height
  
  // Sample pixels more intelligently
  const sampleRate = Math.max(1, Math.floor(data.length / (4 * 10000))) * 4
  
  for (let i = 0; i < data.length; i += sampleRate) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]
    
    if (a > 128) {
      pixels.push([r, g, b])
    }
  }
  
  // Get edge pixels for background detection (corners and edges)
  const edgePixels: number[][] = []
  const edgeSize = Math.min(10, Math.floor(width * 0.1))
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x < edgeSize || x >= width - edgeSize || y < edgeSize || y >= height - edgeSize) {
        const idx = (y * width + x) * 4
        if (data[idx + 3] > 128) {
          edgePixels.push([data[idx], data[idx + 1], data[idx + 2]])
        }
      }
    }
  }
  
  // Find most common edge color as background
  const edgeColorCounts: Record<string, number> = {}
  edgePixels.forEach(([r, g, b]) => {
    const qr = Math.round(r / 24) * 24
    const qg = Math.round(g / 24) * 24
    const qb = Math.round(b / 24) * 24
    const key = `${qr},${qg},${qb}`
    edgeColorCounts[key] = (edgeColorCounts[key] || 0) + 1
  })
  
  const sortedEdgeColors = Object.entries(edgeColorCounts).sort((a, b) => b[1] - a[1])
  let backgroundColorKey = sortedEdgeColors[0]?.[0] || "255,255,255"
  
  // Color quantization with finer granularity
  const colorCounts: Record<string, number> = {}
  
  pixels.forEach(([r, g, b]) => {
    const qr = Math.round(r / 16) * 16
    const qg = Math.round(g / 16) * 16
    const qb = Math.round(b / 16) * 16
    const key = `${qr},${qg},${qb}`
    colorCounts[key] = (colorCounts[key] || 0) + 1
  })
  
  // Sort by frequency
  const sortedColors = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, numColors * 5)
  
  const totalPixels = pixels.length
  const result: ExtractedColor[] = []
  const usedColors: string[] = []
  
  // First, add the background color
  const [bgR, bgG, bgB] = backgroundColorKey.split(",").map(Number)
  const bgHex = `#${bgR.toString(16).padStart(2, "0")}${bgG.toString(16).padStart(2, "0")}${bgB.toString(16).padStart(2, "0")}`.toUpperCase()
  
  for (const [key, count] of sortedColors) {
    if (result.length >= numColors) break
    
    const [r, g, b] = key.split(",").map(Number)
    const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase()
    
    // Check if color is too similar to existing
    const isTooSimilar = usedColors.some(usedHex => {
      const ur = parseInt(usedHex.slice(1, 3), 16)
      const ug = parseInt(usedHex.slice(3, 5), 16)
      const ub = parseInt(usedHex.slice(5, 7), 16)
      const distance = Math.sqrt(Math.pow(r - ur, 2) + Math.pow(g - ug, 2) + Math.pow(b - ub, 2))
      return distance < 50
    })
    
    if (!isTooSimilar) {
      usedColors.push(hex)
      const percentage = Math.round((count / totalPixels) * 100)
      const isBackground = Math.sqrt(
        Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
      ) < 40
      
      result.push({
        hex,
        percentage: Math.max(1, percentage),
        name: getColorName(hex),
        isBackground,
        isDominant: result.length === 0
      })
    }
  }
  
  // Sort by percentage but keep dominant first
  return result.sort((a, b) => {
    if (a.isDominant) return -1
    if (b.isDominant) return 1
    if (a.isBackground) return 1
    if (b.isBackground) return -1
    return b.percentage - a.percentage
  })
}

export default function ExtractPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([])
  const [isExtracting, setIsExtracting] = useState(false)
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hasExtracted, setHasExtracted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const extractColors = useCallback(() => {
    if (!uploadedImage) return
    
    setIsExtracting(true)
    setHasExtracted(false)
    
    const img = document.createElement("img")
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      
      // Use larger canvas for better color detection
      const maxSize = 300
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      setTimeout(() => {
        const colors = extractColorsFromImage(imageData, 6)
        setExtractedColors(colors)
        setIsExtracting(false)
        setHasExtracted(true)
      }, 300)
    }
    img.src = uploadedImage
  }, [uploadedImage])

  const processImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setUploadedImage(dataUrl)
      setExtractedColors([])
      setHasExtracted(false)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processImage(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processImage(file)
  }, [processImage])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const copyColor = async (color: string) => {
    await navigator.clipboard.writeText(color)
    setCopiedColor(color)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const copyAllColors = async () => {
    const colors = extractedColors.map(c => c.hex).join(", ")
    await navigator.clipboard.writeText(colors)
    setCopiedColor("all")
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const reset = () => {
    setUploadedImage(null)
    setExtractedColors([])
    setHasExtracted(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Extract Colors from Image</h1>
        <p className="text-muted-foreground">
          Upload any image and we will extract the main colors, including the background.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {!uploadedImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? "border-primary bg-primary/10" 
                    : "border-border hover:border-primary/50 hover:bg-secondary/30"
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Drop your image here
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports JPG, PNG, WebP
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-secondary">
                  <Image
                    src={uploadedImage}
                    alt="Uploaded image"
                    fill
                    className="object-contain"
                  />
                </div>
                
                {/* Extract Colors Button - Prominent */}
                {!hasExtracted && (
                  <Button
                    onClick={extractColors}
                    disabled={isExtracting}
                    className="w-full rounded-xl h-12 text-base"
                    size="lg"
                  >
                    {isExtracting ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Extracting Colors...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Extract Colors from Image
                      </>
                    )}
                  </Button>
                )}
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1 rounded-xl"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Change Image
                  </Button>
                  <Button
                    onClick={reset}
                    variant="ghost"
                    className="rounded-xl"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Extracted Colors */}
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Extracted Palette
            </h2>
            
            {isExtracting ? (
              <div className="flex flex-col items-center justify-center py-16">
                <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Detecting colors...</p>
                <p className="text-xs text-muted-foreground mt-1">Finding dominant and background colors</p>
              </div>
            ) : extractedColors.length > 0 ? (
              <div className="space-y-4">
                {/* Color Strip Preview */}
                <div className="flex rounded-2xl overflow-hidden shadow-lg h-16">
                  {extractedColors.map((color, i) => (
                    <div
                      key={i}
                      className="flex-1 relative group"
                      style={{ backgroundColor: color.hex }}
                    >
                      {color.isDominant && (
                        <span className="absolute top-1 left-1 text-[8px] font-bold px-1 py-0.5 rounded bg-black/50 text-white">
                          Main
                        </span>
                      )}
                      {color.isBackground && !color.isDominant && (
                        <span className="absolute top-1 left-1 text-[8px] font-bold px-1 py-0.5 rounded bg-black/50 text-white">
                          BG
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Individual Colors as Palette Blocks */}
                <div className="grid grid-cols-2 gap-3">
                  {extractedColors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => copyColor(color.hex)}
                      className="group flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-left"
                    >
                      <div
                        className="w-14 h-14 rounded-xl shadow-md flex-shrink-0 relative"
                        style={{ backgroundColor: color.hex }}
                      >
                        {(color.isDominant || color.isBackground) && (
                          <Badge 
                            className="absolute -top-1 -right-1 text-[8px] px-1 py-0 rounded-md"
                            variant={color.isDominant ? "default" : "secondary"}
                          >
                            {color.isDominant ? "Main" : "BG"}
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm text-foreground">{color.hex}</p>
                        <p className="text-xs text-muted-foreground">{color.name}</p>
                        <p className="text-xs text-muted-foreground">{color.percentage}% of image</p>
                      </div>
                      {copiedColor === color.hex ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
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
                        Copy All
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={extractColors}
                    variant="outline"
                    className="rounded-xl"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Re-extract
                  </Button>
                  <Link href={`/validation?colors=${extractedColors.map(c => c.hex.slice(1)).join(",")}`}>
                    <Button className="rounded-xl">
                      <Palette className="w-4 h-4 mr-2" />
                      Validate Palette
                    </Button>
                  </Link>
                </div>

                {/* Use This Palette Section */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-medium text-foreground mb-3">Use this palette for:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/wardrobe?colors=${extractedColors.map(c => c.hex.slice(1)).join(",")}`}>
                      <Button variant="outline" className="w-full rounded-xl justify-start">
                        <Shirt className="w-4 h-4 mr-2" />
                        Wardrobe
                      </Button>
                    </Link>
                    <Link href={`/validation?colors=${extractedColors.map(c => c.hex.slice(1)).join(",")}`}>
                      <Button variant="outline" className="w-full rounded-xl justify-start">
                        <Globe className="w-4 h-4 mr-2" />
                        Website
                      </Button>
                    </Link>
                    <Link href={`/validation?colors=${extractedColors.map(c => c.hex.slice(1)).join(",")}`}>
                      <Button variant="outline" className="w-full rounded-xl justify-start">
                        <Home className="w-4 h-4 mr-2" />
                        Interior
                      </Button>
                    </Link>
                    <Link href={`/validation?colors=${extractedColors.map(c => c.hex.slice(1)).join(",")}`}>
                      <Button variant="outline" className="w-full rounded-xl justify-start">
                        <Wand2 className="w-4 h-4 mr-2" />
                        Poster
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                  <Wand2 className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Upload an image and click &quot;Extract Colors&quot;
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  We will find the main colors including the background
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-secondary/30">
        <CardContent className="p-5">
          <h3 className="font-semibold text-foreground mb-3">Tips for best results</h3>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">-</span>
              Use high-quality images with good lighting
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">-</span>
              Photos with distinct colors work best
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">-</span>
              We auto-detect the background color from edges
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">-</span>
              The dominant color is marked as &quot;Main&quot;
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

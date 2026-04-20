// Color utility functions for validation and harmony analysis

export interface ColorInfo {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { r: 0, g: 0, b: 0 }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function getColorInfo(hex: string): ColorInfo {
  const rgb = hexToRgb(hex)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  return { hex, rgb, hsl }
}

export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c /= 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }
  
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
  
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

export type HarmonyType = 
  | "complementary" 
  | "analogous" 
  | "triadic" 
  | "split-complementary" 
  | "tetradic" 
  | "monochromatic"
  | "none"

export type ScoreLabel = "Excellent" | "Good" | "Average" | "Poor"

export function getScoreLabel(score: number): { label: ScoreLabel; color: string; description: string } {
  if (score >= 85) {
    return { 
      label: "Excellent", 
      color: "text-green-600",
      description: "This palette is beautifully balanced and harmonious!"
    }
  }
  if (score >= 70) {
    return { 
      label: "Good", 
      color: "text-emerald-500",
      description: "A solid color combination that works well together."
    }
  }
  if (score >= 50) {
    return { 
      label: "Average", 
      color: "text-yellow-500",
      description: "The colors work but could be improved with some adjustments."
    }
  }
  return { 
    label: "Poor", 
    color: "text-red-500",
    description: "Consider choosing more harmonious color combinations."
  }
}

export function detectHarmonyType(colors: string[]): { type: HarmonyType; description: string; score: number } {
  if (colors.length < 2) {
    return { type: "none", description: "Add more colors to analyze harmony", score: 0 }
  }

  const hslColors = colors.map(c => getColorInfo(c).hsl)
  const hues = hslColors.map(c => c.h)
  
  // Normalize hue differences for circular comparison
  const getHueDiff = (h1: number, h2: number) => {
    const diff = Math.abs(h1 - h2)
    return Math.min(diff, 360 - diff)
  }
  
  // Check for monochromatic (similar hues, different saturation/lightness)
  let maxHueDiff = 0
  for (let i = 0; i < hues.length; i++) {
    for (let j = i + 1; j < hues.length; j++) {
      const diff = getHueDiff(hues[i], hues[j])
      if (diff > maxHueDiff) maxHueDiff = diff
    }
  }
  
  if (maxHueDiff < 30) {
    // Check saturation and lightness variation for true monochromatic
    const saturations = hslColors.map(c => c.s)
    const lightnesses = hslColors.map(c => c.l)
    const satRange = Math.max(...saturations) - Math.min(...saturations)
    const lightRange = Math.max(...lightnesses) - Math.min(...lightnesses)
    
    if (satRange > 15 || lightRange > 20) {
      return { 
        type: "monochromatic", 
        description: "Different shades of the same color family - creates a unified, elegant look that&apos;s easy on the eyes!",
        score: 88
      }
    }
  }

  // Check for complementary (opposite colors, ~180 degrees apart)
  if (colors.length === 2) {
    const hueDiff = getHueDiff(hues[0], hues[1])
    if (hueDiff > 150 && hueDiff < 210) {
      return { 
        type: "complementary", 
        description: "Opposite colors on the wheel - creates maximum contrast and visual interest! Perfect for grabbing attention.",
        score: 92
      }
    }
  }

  // Check for analogous (colors next to each other, ~30 degrees apart)
  const sortedHues = [...hues].sort((a, b) => a - b)
  let isAnalogous = true
  for (let i = 1; i < sortedHues.length; i++) {
    if (getHueDiff(sortedHues[i], sortedHues[i - 1]) > 60) {
      isAnalogous = false
      break
    }
  }
  
  if (isAnalogous && maxHueDiff < 90) {
    return { 
      type: "analogous", 
      description: "Neighboring colors on the wheel - naturally harmonious and pleasing! Great for creating cohesive designs.",
      score: 90
    }
  }

  // Check for triadic (3 colors evenly spaced, ~120 degrees apart)
  if (colors.length >= 3) {
    let isTriadic = true
    for (let i = 0; i < Math.min(3, hues.length); i++) {
      for (let j = i + 1; j < Math.min(3, hues.length); j++) {
        const diff = getHueDiff(hues[i], hues[j])
        if (diff < 90 || diff > 150) {
          isTriadic = false
          break
        }
      }
      if (!isTriadic) break
    }
    
    if (isTriadic) {
      return { 
        type: "triadic", 
        description: "Three colors evenly spaced on the wheel - vibrant and balanced! Offers visual richness while maintaining harmony.",
        score: 94
      }
    }
  }

  // Check for split-complementary
  if (colors.length >= 3) {
    const baseHue = hues[0]
    const complementHue = (baseHue + 180) % 360
    let hasSplitComplement = false
    
    for (let i = 1; i < hues.length; i++) {
      const diffToComplement = getHueDiff(hues[i], complementHue)
      if (diffToComplement >= 20 && diffToComplement <= 60) {
        hasSplitComplement = true
        break
      }
    }
    
    if (hasSplitComplement) {
      return { 
        type: "split-complementary", 
        description: "A softer twist on complementary - less tension but still dynamic! Great for designs that need contrast without harshness.",
        score: 85
      }
    }
  }

  // Default for 4+ colors that might be tetradic
  if (colors.length >= 4) {
    return { 
      type: "tetradic", 
      description: "Four colors forming a rectangle on the wheel - rich and diverse palette! Works well when one color is dominant.",
      score: 80
    }
  }

  return { 
    type: "none", 
    description: "The colors work together but don&apos;t follow a classic harmony pattern. Consider adjusting for stronger visual cohesion.",
    score: 65
  }
}

export function validateColorCombination(colors: string[]): {
  status: "good" | "average" | "poor"
  score: number
  scoreLabel: ScoreLabel
  scoreLabelColor: string
  scoreDescription: string
  harmony: HarmonyType
  harmonyDescription: string
  suggestions: string[]
  contrastIssues: string[]
  strengths: string[]
} {
  const validColors = colors.filter(c => c && c !== "#000000")
  
  if (validColors.length < 2) {
    return {
      status: "poor",
      score: 0,
      scoreLabel: "Poor",
      scoreLabelColor: "text-red-500",
      scoreDescription: "Add at least 2 colors to get a proper analysis.",
      harmony: "none",
      harmonyDescription: "Add at least 2 colors to validate!",
      suggestions: ["Add more colors to your palette"],
      contrastIssues: [],
      strengths: []
    }
  }

  const harmonyResult = detectHarmonyType(validColors)
  let score = harmonyResult.score

  // Check contrast between colors
  const contrastIssues: string[] = []
  const strengths: string[] = []
  let goodContrastPairs = 0
  let totalPairs = 0
  
  for (let i = 0; i < validColors.length; i++) {
    for (let j = i + 1; j < validColors.length; j++) {
      totalPairs++
      const contrast = getContrastRatio(validColors[i], validColors[j])
      if (contrast < 1.5) {
        contrastIssues.push(`Colors ${i + 1} and ${j + 1} are nearly identical - hard to distinguish`)
        score -= 12
      } else if (contrast < 2.5) {
        contrastIssues.push(`Colors ${i + 1} and ${j + 1} have low contrast - may blend together`)
        score -= 6
      } else if (contrast >= 4.5) {
        goodContrastPairs++
      }
    }
  }
  
  if (goodContrastPairs > 0 && goodContrastPairs >= totalPairs / 2) {
    strengths.push("Good contrast between colors for readability")
    score += 5
  }

  // Generate suggestions
  const suggestions: string[] = []
  const hslColors = validColors.map(c => getColorInfo(c).hsl)
  
  // Check saturation variety
  const saturations = hslColors.map(c => c.s)
  const satRange = Math.max(...saturations) - Math.min(...saturations)
  if (satRange < 20) {
    suggestions.push("Try varying the saturation levels for more visual interest")
  } else if (satRange > 40) {
    strengths.push("Good variety in saturation levels")
  }

  // Check lightness variety
  const lightnesses = hslColors.map(c => c.l)
  const lightRange = Math.max(...lightnesses) - Math.min(...lightnesses)
  if (lightRange < 25) {
    suggestions.push("Add some lighter or darker shades for better visual hierarchy")
  } else if (lightRange > 40) {
    strengths.push("Nice range of light and dark values")
    score += 3
  }
  
  // Check for neutral anchor
  const hasNeutral = hslColors.some(c => c.s < 15)
  if (!hasNeutral && validColors.length >= 3) {
    suggestions.push("Consider adding a neutral color (gray, white, or muted tone) to ground the palette")
  } else if (hasNeutral) {
    strengths.push("Good use of neutral colors to balance the palette")
  }
  
  // Check temperature consistency
  const warmHues = hslColors.filter(c => (c.h >= 0 && c.h <= 60) || (c.h >= 300 && c.h <= 360))
  const coolHues = hslColors.filter(c => c.h >= 180 && c.h <= 300)
  
  if (warmHues.length > 0 && coolHues.length > 0) {
    if (warmHues.length === coolHues.length) {
      strengths.push("Balanced mix of warm and cool tones")
    }
  } else if (warmHues.length === hslColors.length || coolHues.length === hslColors.length) {
    strengths.push("Consistent color temperature throughout")
    score += 2
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score))

  let status: "good" | "average" | "poor" = "average"
  if (score >= 75) status = "good"
  else if (score < 50) status = "poor"

  const { label, color, description } = getScoreLabel(score)

  if (suggestions.length === 0 && status === "good") {
    suggestions.push("Your palette is well-balanced - keep up the great work!")
  }
  
  if (strengths.length === 0 && status === "good") {
    strengths.push("Colors work well together overall")
  }

  return {
    status,
    score,
    scoreLabel: label,
    scoreLabelColor: color,
    scoreDescription: description,
    harmony: harmonyResult.type,
    harmonyDescription: harmonyResult.description,
    suggestions,
    contrastIssues,
    strengths
  }
}

export function suggestImprovement(colors: string[]): string[] {
  const validColors = colors.filter(c => c && c !== "#000000")
  if (validColors.length === 0) return []

  const suggestions: string[] = []
  const baseColor = getColorInfo(validColors[0])
  
  // Suggest specific improvements based on palette
  const hslColors = validColors.map(c => getColorInfo(c).hsl)
  
  // Check if palette needs more variety
  const avgSaturation = hslColors.reduce((a, c) => a + c.s, 0) / hslColors.length
  const avgLightness = hslColors.reduce((a, c) => a + c.l, 0) / hslColors.length
  
  if (avgSaturation > 70) {
    suggestions.push("Consider adding a muted or desaturated tone to provide visual rest")
  }
  
  if (avgLightness < 30) {
    suggestions.push("Add a lighter color to create better contrast and hierarchy")
  } else if (avgLightness > 70) {
    suggestions.push("Add a darker anchor color for better visual grounding")
  }
  
  // Suggest complementary if only one color
  if (validColors.length === 1) {
    const complementaryHue = (baseColor.hsl.h + 180) % 360
    suggestions.push(`Try adding a complementary color around hue ${complementaryHue} degrees`)
  }
  
  // Suggest analogous expansion
  if (validColors.length <= 2) {
    const analogousHue1 = (baseColor.hsl.h + 30) % 360
    const analogousHue2 = (baseColor.hsl.h - 30 + 360) % 360
    suggestions.push(`For a softer palette, try adding colors near hue ${analogousHue1} or ${analogousHue2}`)
  }

  return suggestions
}

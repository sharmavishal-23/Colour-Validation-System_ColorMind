"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { Bot, Send, User, Sparkles, Palette, Shirt, Lightbulb, Trash2, Upload, ImageIcon, RefreshCw, X, Copy, Check } from "lucide-react"

const suggestedQuestions = [
  {
    icon: Palette,
    text: "What colors complement navy blue?",
    category: "Color Theory"
  },
  {
    icon: Shirt,
    text: "Help me build an outfit around a red dress",
    category: "Fashion"
  },
  {
    icon: Lightbulb,
    text: "What colors create a calming bedroom?",
    category: "Design"
  },
  {
    icon: Sparkles,
    text: "Suggest a summer color palette",
    category: "Seasonal"
  }
]

// Helper to extract hex codes from text
function extractHexCodes(text: string): string[] {
  const hexRegex = /#[0-9A-Fa-f]{6}\b/g
  const matches = text.match(hexRegex) || []
  return [...new Set(matches)]
}

export default function AssistantPage() {
  const [input, setInput] = useState("")
  const [activeTab, setActiveTab] = useState("chat")
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Image analysis state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [copiedColor, setCopiedColor] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [aiError, setAiError] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const { messages, sendMessage, status, setMessages, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onFinish: () => {
      setAiError(null)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    },
    onError: () => {
      setAiError("I'm having trouble responding right now. Please try again in a moment.")
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])
  
  // Add timeout for AI responses
  useEffect(() => {
    if (isLoading) {
      timeoutRef.current = setTimeout(() => {
        setAiError("The AI is taking longer than expected. Here are some quick suggestions:\n\n**For complementary colors:** Try using colors opposite on the color wheel.\n**For calming palettes:** Use blues (#4A90A4), greens (#7CB342), and soft neutrals (#E8E8E8).\n**For energetic palettes:** Use warm colors like coral (#FF6B6B), yellow (#FFD93D), and orange (#FF8C42).")
      }, 15000)
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isLoading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    setAiError(null)
    sendMessage({
      role: "user",
      parts: [
      { type: "text", text: input }
    ]
    })
    setInput("")
  }

  const handleSuggestionClick = (text: string) => {
    if (isLoading) return
    setAiError(null)
    sendMessage({
      role: "user",
      parts: [
      { type: "text", text: text }
    ]
    })
  }

  const clearChat = () => {
    setMessages([])
  }

  // Image upload handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
      setAnalysisResult(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
      setAnalysisResult(null)
    }
  }

  const clearImage = () => {
    setUploadedImage(null)
    setImageFile(null)
    setAnalysisResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const analyzeImage = async () => {
    if (!uploadedImage || !imageFile) return
    
    setIsAnalyzing(true)
    setAnalysisResult("")
    
    try {
      const base64Data = uploadedImage.split(",")[1]
      
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: imageFile.type
        })
      })

      if (!response.ok) throw new Error("Failed to analyze image")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let result = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          result += decoder.decode(value, { stream: true })
          setAnalysisResult(result)
        }
      }
    } catch (error) {
      console.error("Error analyzing image:", error)
      setAnalysisResult(`**Unable to analyze this image**

Here are some suggested colors you might like based on common palettes:

**Suggested Palette:**
- Primary: #3B82F6 (Blue)
- Secondary: #10B981 (Emerald)
- Accent: #F59E0B (Amber)
- Background: #F8FAFC (Light Gray)
- Text: #1E293B (Dark Slate)

**Tips for better results:**
- Try a clearer, well-lit image
- Ensure the image has distinct colors
- Use JPG or PNG format`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const copyColor = async (color: string) => {
    await navigator.clipboard.writeText(color)
    setCopiedColor(color)
    setTimeout(() => setCopiedColor(null), 2000)
  }

  const extractedColors = analysisResult ? extractHexCodes(analysisResult) : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
              <Bot className="h-6 w-6 text-white" />
            </div>
            AI Color Assistant
          </h1>
          <p className="text-muted-foreground mt-1">
            Chat with ColorMind AI or upload an image for color suggestions
          </p>
        </div>
      </div>

      {/* Tabs for Chat vs Image Analysis */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 rounded-xl h-12">
          <TabsTrigger value="chat" className="rounded-lg gap-2">
            <Bot className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="image" className="rounded-lg gap-2">
            <ImageIcon className="h-4 w-4" />
            Image Analysis
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chat Area */}
            <Card className="lg:col-span-3 flex flex-col h-[600px]">
              <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-violet-500" />
                    Chat with ColorMind AI
                  </CardTitle>
                  <CardDescription>
                    Ask about color combinations, outfit ideas, or design advice
                  </CardDescription>
                </div>
                {messages.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearChat}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                )}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <div className="p-4 bg-violet-100 dark:bg-violet-900/30 rounded-full mb-4">
                        <Bot className="h-10 w-10 text-violet-600 dark:text-violet-400" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Welcome to ColorMind AI!</h3>
                      <p className="text-muted-foreground max-w-md">
                        I&apos;m your personal color expert. Ask me anything about color theory, 
                        fashion combinations, or design choices. Try one of the suggestions below!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${
                            message.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {message.role === "assistant" && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <div className="whitespace-pre-wrap text-sm">
                              {message.parts.map((part, index) => {
                                if (part.type === "text") {
                                  return <span key={index}>{part.text}</span>
                                }
                                return null
                              })}
                            </div>
                          </div>
                          {message.role === "user" && (
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                              <User className="h-4 w-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                      {isLoading && messages[messages.length - 1]?.role === "user" && !aiError && (
                        <div className="flex gap-3 justify-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-muted rounded-2xl px-4 py-3">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          </div>
                        </div>
                      )}
                      {(aiError || error) && (
                        <div className="flex gap-3 justify-start">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl px-4 py-3 max-w-[80%]">
                            <p className="text-sm text-amber-800 dark:text-amber-200 whitespace-pre-wrap">{aiError || "Something went wrong. Please try again."}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about colors, outfits, or design..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>

            {/* Suggestions Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Quick Questions</CardTitle>
                  <CardDescription className="text-xs">
                    Click to ask ColorMind AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {suggestedQuestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-3 px-3"
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      disabled={isLoading}
                    >
                      <suggestion.icon className="h-4 w-4 mr-2 flex-shrink-0 text-violet-500" />
                      <div className="flex flex-col items-start min-w-0 flex-1">
                        <span className="text-xs text-muted-foreground">{suggestion.category}</span>
                        <span className="text-sm break-words whitespace-normal leading-snug">{suggestion.text}</span>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Be specific about colors you already have</p>
                  <p>Mention the occasion or season</p>
                  <p>Ask for hex codes for precise colors</p>
                  <p>Describe your style preferences</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Image Analysis Tab */}
        <TabsContent value="image" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Area */}
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-violet-500" />
                  Upload Image
                </CardTitle>
                <CardDescription>
                  Upload any image and AI will analyze it and suggest colors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {!uploadedImage ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all border-border hover:border-primary/50 hover:bg-secondary/30"
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
                      <button
                        onClick={clearImage}
                        className="absolute top-2 right-2 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="flex-1 rounded-xl"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Analyze & Suggest Colors
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="rounded-xl"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-violet-500" />
                  AI Color Analysis
                </CardTitle>
                <CardDescription>
                  AI-powered color suggestions based on your image
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!analysisResult && !isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="p-4 bg-violet-100 dark:bg-violet-900/30 rounded-full mb-4">
                      <ImageIcon className="h-10 w-10 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">No Image Analyzed Yet</h3>
                    <p className="text-muted-foreground max-w-md">
                      Upload an image on the left and click &quot;Analyze &amp; Suggest Colors&quot; to get AI-powered color recommendations.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Extracted Colors Preview */}
                    {extractedColors.length > 0 && (
                      <div className="bg-secondary/50 rounded-xl p-4">
                        <p className="text-sm font-medium text-foreground mb-3">Extracted Colors</p>
                        <div className="flex flex-wrap gap-2">
                          {extractedColors.slice(0, 8).map((color, i) => (
                            <button
                              key={i}
                              onClick={() => copyColor(color)}
                              className="group relative"
                            >
                              <div
                                className="w-12 h-12 rounded-lg shadow-md border-2 border-background transition-transform hover:scale-110"
                                style={{ backgroundColor: color }}
                              />
                              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                {copiedColor === color ? "Copied!" : color}
                              </span>
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">Click a color to copy its hex code</p>
                      </div>
                    )}
                    
                    {/* Analysis Text */}
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-sm text-foreground">
                          {analysisResult}
                          {isAnalyzing && (
                            <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
                          )}
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tips for Image Analysis */}
          <Card className="mt-6 border-0 shadow-lg rounded-2xl overflow-hidden bg-secondary/30">
            <CardContent className="p-5">
              <h3 className="font-semibold text-foreground mb-3">Tips for Best Results</h3>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">-</span>
                  Use high-quality, well-lit images
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">-</span>
                  Images with clear color distinction work best
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">-</span>
                  Try nature photos, fashion images, or art
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">-</span>
                  The AI will suggest palettes for various uses
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

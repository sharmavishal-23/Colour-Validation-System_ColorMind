"use client"

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
  ExternalLink,
  Heart
} from "lucide-react"

const steps = [
  {
    step: 1,
    title: "Pick Your Tool",
    description: "Choose from validation, wardrobe matching, smart suggestions, or browse our palette library.",
    emoji: "🛠️",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&q=80"
  },
  {
    step: 2,
    title: "Select Your Colors",
    description: "Use color pickers, answer fun questions, or pick from existing palettes.",
    emoji: "🎨",
    image: "https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=400&q=80"
  },
  {
    step: 3,
    title: "Get Instant Feedback",
    description: "We analyze harmony, contrast, and give you tips to make your colors even better!",
    emoji: "✨",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80"
  },
  {
    step: 4,
    title: "Create Something Amazing",
    description: "Use your validated colors with confidence in any project!",
    emoji: "🚀",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80"
  }
]

const features = [
  {
    icon: Palette,
    title: "Color Validation",
    description: "Check if your colors work together using color theory principles like harmony, contrast, and balance.",
    link: "/validation"
  },
  {
    icon: Shirt,
    title: "Wardrobe Matcher",
    description: "Plan your outfits with confidence! Match tops, bottoms, shoes, and accessories.",
    link: "/wardrobe"
  },
  {
    icon: Wand2,
    title: "Smart Suggestions",
    description: "Answer a few questions about mood and purpose, and get a perfect palette generated for you.",
    link: "/suggestions"
  },
  {
    icon: SwatchBook,
    title: "Palette Library",
    description: "Browse 50+ curated palettes organized by style, mood, and use case. Copy with one click!",
    link: "/palettes"
  }
]

const faqs = [
  {
    question: "What is color harmony?",
    answer: "Color harmony is when colors look good together. It is based on their positions on the color wheel - like complementary colors (opposites), analogous (neighbors), or triadic (evenly spaced)."
  },
  {
    question: "How do I know if colors match?",
    answer: "Use our validation tool! We check harmony type, contrast ratios, and overall balance. A score above 80 means great match!"
  },
  {
    question: "Can I save my favorite palettes?",
    answer: "Yes! Click the heart icon on any palette to save it to your favorites. They will be there when you come back."
  },
  {
    question: "What if I do not like the suggested colors?",
    answer: "No problem! Just hit Generate Another in the suggestions tool, or tweak the colors manually in the validation page."
  },
  {
    question: "Is this free to use?",
    answer: "Absolutely! ColorMind is free for everyone. Create as many palettes as you want!"
  }
]

const colorTheoryTips = [
  {
    title: "The 60-30-10 Rule",
    tip: "Use your dominant color for 60% of the space, secondary for 30%, and accent for 10%.",
    emoji: "📊"
  },
  {
    title: "Contrast is Key",
    tip: "Make sure text is readable! Light text on dark backgrounds, dark text on light backgrounds.",
    emoji: "⚡"
  },
  {
    title: "Start with Inspiration",
    tip: "Take colors from photos, nature, or artwork you love. Nature never gets colors wrong!",
    emoji: "🌅"
  },
  {
    title: "Less is More",
    tip: "Stick to 3-5 colors max. Too many colors can feel chaotic and overwhelming.",
    emoji: "✨"
  }
]

export default function HelpPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-card shadow-xl">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?w=1200&q=80"
            alt="Creative workspace"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-transparent" />
        </div>
        
        <div className="relative p-8 md:p-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">💡</div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              About & Help
            </h1>
          </div>
          <p className="text-muted-foreground max-w-xl">
            New to ColorMind? We have got you covered! Learn how to use all our fun tools and become a color pro.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          📖 How It Works
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <Card key={step.step} className="border-0 shadow-lg rounded-3xl overflow-hidden group">
              <div className="relative h-32 overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center shadow-lg">
                  {step.step}
                </div>
              </div>
              <CardContent className="p-5">
                <div className="text-2xl mb-2">{step.emoji}</div>
                <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          🚀 Our Tools
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="border-0 shadow-lg rounded-3xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground mb-4">{feature.description}</p>
                      <Link href={feature.link}>
                        <Button variant="outline" className="rounded-xl btn-bounce" size="sm">
                          Try it now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Color Theory Tips */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          🎨 Color Theory Tips
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {colorTheoryTips.map((tip) => (
            <Card key={tip.title} className="border-0 shadow-lg rounded-2xl">
              <CardContent className="p-5">
                <div className="text-3xl mb-3">{tip.emoji}</div>
                <h3 className="font-bold text-foreground mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.tip}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          ❓ Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="border-0 shadow-lg rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-foreground mb-2 flex items-start gap-2">
                  <span className="text-primary">Q:</span>
                  {faq.question}
                </h3>
                <p className="text-muted-foreground pl-6">
                  <span className="text-primary font-medium">A:</span> {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* About */}
      <section>
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-48 h-48 rounded-3xl overflow-hidden shadow-lg flex-shrink-0">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80"
                  alt="Team working together"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center justify-center md:justify-start gap-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  Made with Love
                </h2>
                <p className="text-muted-foreground mb-6 max-w-lg">
                  ColorMind was built to make color selection fun and accessible for everyone - 
                  designers, developers, artists, and anyone who wants to create beautiful things. 
                  No design degree required!
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Button variant="outline" className="rounded-xl btn-bounce">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Learn Color Theory
                  </Button>
                  <Link href="/dashboard">
                    <Button className="rounded-xl btn-bounce">
                      Start Creating
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

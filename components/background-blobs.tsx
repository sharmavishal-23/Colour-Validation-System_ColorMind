"use client"

interface BackgroundBlobsProps {
  variant?: "default" | "login" | "dashboard"
}

export function BackgroundBlobs({ variant = "default" }: BackgroundBlobsProps) {
  if (variant === "login") {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="blob w-96 h-96 bg-primary/30 top-[-10%] left-[-5%] animate-float" />
        <div className="blob w-80 h-80 bg-accent/40 bottom-[-10%] right-[-5%] animate-float" style={{ animationDelay: "1s" }} />
        <div className="blob w-64 h-64 bg-secondary/50 top-[40%] right-[10%] animate-float" style={{ animationDelay: "2s" }} />
        <div className="blob w-48 h-48 bg-chart-2/30 bottom-[20%] left-[15%] animate-float" style={{ animationDelay: "1.5s" }} />
      </div>
    )
  }

  if (variant === "dashboard") {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="blob w-[500px] h-[500px] bg-primary/20 top-[-15%] right-[-10%] animate-float" />
        <div className="blob w-[400px] h-[400px] bg-accent/25 bottom-[-10%] left-[-5%] animate-float" style={{ animationDelay: "2s" }} />
        <div className="blob w-[300px] h-[300px] bg-chart-4/20 top-[50%] left-[5%] animate-float" style={{ animationDelay: "1s" }} />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="blob w-72 h-72 bg-primary/25 top-[-5%] right-[20%] animate-float" />
      <div className="blob w-64 h-64 bg-accent/30 bottom-[10%] left-[5%] animate-float" style={{ animationDelay: "1.5s" }} />
    </div>
  )
}

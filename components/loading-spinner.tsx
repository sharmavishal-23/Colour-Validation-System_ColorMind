"use client"

import { Paintbrush } from "lucide-react"

interface LoadingSpinnerProps {
  message?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ message = "Loading...", size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full bg-primary/20 animate-pulse`} />
        <Paintbrush 
          className={`${sizeClasses[size]} text-primary absolute top-0 left-0 animate-spin-slow`} 
        />
      </div>
      <p className={`${textSizeClasses[size]} text-muted-foreground font-medium animate-pulse-soft`}>
        {message}
      </p>
    </div>
  )
}

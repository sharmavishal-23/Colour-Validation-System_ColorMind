"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { Sidebar } from "@/components/sidebar"
import { BackgroundBlobs } from "@/components/background-blobs"
import { LoadingSpinner } from "@/components/loading-spinner"

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [sidebarWidth, setSidebarWidth] = useState(256)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const checkSidebarWidth = () => {
      const isMobile = window.innerWidth < 768
      setSidebarWidth(isMobile ? 72 : 256)
    }
    checkSidebarWidth()
    window.addEventListener("resize", checkSidebarWidth)
    return () => window.removeEventListener("resize", checkSidebarWidth)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading your workspace..." size="lg" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Redirecting to login..." size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <BackgroundBlobs variant="dashboard" />
      <Sidebar />
      <main 
        className="transition-all duration-300 min-h-screen"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </AuthProvider>
  )
}

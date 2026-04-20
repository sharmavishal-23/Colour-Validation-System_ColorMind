"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Moon, Sun, Monitor, Palette, Bell, Shield, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function SettingsPage() {
  const { theme, setTheme, systemTheme } = useTheme()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  const clearAllData = () => {
    // Clear all localStorage data
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith("colormind_")) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))
    window.location.reload()
  }

  if (!mounted) {
    return null
  }

  const currentTheme = theme === "system" ? systemTheme : theme

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl">
            <Settings className="h-6 w-6 text-white" />
          </div>
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Customize your ColorMind experience
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Account Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account
            </CardTitle>
            <CardDescription>
              Your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-muted-foreground">{user?.email || "Not logged in"}</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <Label className="text-sm font-medium">Account Type</Label>
                <p className="text-sm text-muted-foreground">Free Plan</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how ColorMind looks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">Theme</Label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="h-5 w-5" />
                  <span className="text-xs">Light</span>
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="h-5 w-5" />
                  <span className="text-xs">Dark</span>
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => setTheme("system")}
                >
                  <Monitor className="h-5 w-5" />
                  <span className="text-xs">System</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Currently using: {currentTheme === "dark" ? "Dark" : "Light"} mode
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Color Tips</Label>
                <p className="text-xs text-muted-foreground">
                  Receive helpful color theory tips
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Manage your saved data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Clear All Data</Label>
                <p className="text-xs text-muted-foreground">
                  Remove all saved palettes, wardrobe items, and preferences
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={clearAllData}>
                Clear Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

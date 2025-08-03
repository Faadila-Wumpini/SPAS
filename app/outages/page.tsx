"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, MapPin, Clock, Users, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

// Client-side only time display component to prevent hydration errors
function TimeDisplay({ timestamp }: { timestamp: Date }) {
  const [timeString, setTimeString] = useState("")

  useEffect(() => {
    setTimeString(timestamp.toLocaleString())
  }, [timestamp])

  return <span>{timeString}</span>
}

interface Outage {
  id: string
  location: string
  region: string
  startTime: Date
  estimatedDuration: string
  affectedUsers: number
  status: "active" | "resolved" | "scheduled"
  cause: string
}

export default function OutagesPage() {
  const router = useRouter()
  const [outages, setOutages] = useState<Outage[]>([
    {
      id: "1",
      location: "East Legon",
      region: "Greater Accra",
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      estimatedDuration: "4 hours",
      affectedUsers: 15000,
      status: "active",
      cause: "Transformer maintenance",
    },
    {
      id: "2",
      location: "Kumasi Central",
      region: "Ashanti",
      startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      estimatedDuration: "2 hours",
      affectedUsers: 8500,
      status: "active",
      cause: "Power line fault",
    },
    {
      id: "3",
      location: "Tema",
      region: "Greater Accra",
      startTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      estimatedDuration: "1 hour",
      affectedUsers: 12000,
      status: "resolved",
      cause: "Equipment failure",
    },
    {
      id: "4",
      location: "Takoradi",
      region: "Western",
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      estimatedDuration: "6 hours",
      affectedUsers: 20000,
      status: "scheduled",
      cause: "Planned maintenance",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "destructive"
      case "resolved":
        return "default"
      case "scheduled":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="h-4 w-4" />
      case "resolved":
        return <Zap className="h-4 w-4" />
      case "scheduled":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const activeOutages = outages.filter((o) => o.status === "active")
  const scheduledOutages = outages.filter((o) => o.status === "scheduled")
  const resolvedOutages = outages.filter((o) => o.status === "resolved")

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Power Outages</h1>
          <p className="text-gray-600">Current and scheduled power outages across Ghana</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{activeOutages.length}</p>
                  <p className="text-sm text-gray-600">Active Outages</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">{scheduledOutages.length}</p>
                  <p className="text-sm text-gray-600">Scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {activeOutages.reduce((sum, outage) => sum + outage.affectedUsers, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Users Affected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Outages Alert */}
        {activeOutages.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Active Power Outages</AlertTitle>
            <AlertDescription>
              There are currently {activeOutages.length} active power outages affecting{" "}
              {activeOutages.reduce((sum, outage) => sum + outage.affectedUsers, 0).toLocaleString()} users.
            </AlertDescription>
          </Alert>
        )}

        {/* Active Outages */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Active Outages</h2>
          {activeOutages.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-green-600">No Active Outages</p>
                <p className="text-gray-600">All areas are currently receiving power</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeOutages.map((outage) => (
                <Card key={outage.id} className="border-red-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(outage.status)}
                        {outage.location}
                      </CardTitle>
                      <Badge variant={getStatusColor(outage.status) as any}>{outage.status.toUpperCase()}</Badge>
                    </div>
                    <CardDescription>{outage.region}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Started: <TimeDisplay timestamp={outage.startTime} /></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-gray-500" />
                        <span>Duration: {outage.estimatedDuration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>Affected: {outage.affectedUsers.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>Cause: {outage.cause}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Scheduled Outages */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Scheduled Maintenance</h2>
          <div className="grid gap-4">
            {scheduledOutages.map((outage) => (
              <Card key={outage.id} className="border-orange-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(outage.status)}
                      {outage.location}
                    </CardTitle>
                    <Badge variant={getStatusColor(outage.status) as any}>{outage.status.toUpperCase()}</Badge>
                  </div>
                  <CardDescription>{outage.region}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Scheduled: <TimeDisplay timestamp={outage.startTime} /></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-gray-500" />
                      <span>Duration: {outage.estimatedDuration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>Will affect: {outage.affectedUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>Reason: {outage.cause}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Report Outage */}
        <Card>
          <CardHeader>
            <CardTitle>Report an Outage</CardTitle>
            <CardDescription>Help us track power outages by reporting issues in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full md:w-auto"
              onClick={() => router.push('/contact')}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Power Outage
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

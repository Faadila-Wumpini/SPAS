"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Zap, AlertTriangle, TrendingUp, MapPin, Clock, Shield } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Client-side only time display component to prevent hydration errors
function TimeDisplay({ timestamp }: { timestamp: Date }) {
  const [timeString, setTimeString] = useState("")

  useEffect(() => {
    setTimeString(timestamp.toLocaleTimeString())
  }, [timestamp])

  return <span>{timeString}</span>
}

interface PowerReading {
  voltage: number
  frequency: number
  timestamp: Date
  location: string
}

interface HistoryData {
  time: string
  voltage: number
  frequency: number
}

export default function HomePage() {
  const router = useRouter()
  const [userLocation, setUserLocation] = useState("")
  const [displayLocation, setDisplayLocation] = useState("Enter your location")
  const [userData, setUserData] = useState<any>(null)
  const [currentReading, setCurrentReading] = useState<PowerReading>({
    voltage: 230,
    frequency: 50,
    timestamp: new Date(),
    location: "Enter your location",
  })

  const [historyData, setHistoryData] = useState<HistoryData[]>([])
  const [alerts, setAlerts] = useState<string[]>([])

  // Check for user data on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData))
    }
  }, [])

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate voltage fluctuations (normal range: 220-240V in Ghana)
      const baseVoltage = 230
      const voltageVariation = (Math.random() - 0.5) * 30 // ±15V variation
      const newVoltage = Math.max(180, Math.min(260, baseVoltage + voltageVariation))

      // Simulate frequency fluctuations (normal: 50Hz)
      const baseFrequency = 50
      const frequencyVariation = (Math.random() - 0.5) * 2 // ±1Hz variation
      const newFrequency = Math.max(48, Math.min(52, baseFrequency + frequencyVariation))

      const newReading: PowerReading = {
        voltage: Math.round(newVoltage * 10) / 10,
        frequency: Math.round(newFrequency * 10) / 10,
        timestamp: new Date(),
        location: displayLocation,
      }

      setCurrentReading(newReading)

      // Update history data
      const timeStr = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })

      setHistoryData((prev) => {
        const newData = [
          ...prev,
          {
            time: timeStr,
            voltage: newReading.voltage,
            frequency: newReading.frequency,
          },
        ]
        return newData.slice(-20) // Keep last 20 readings
      })

      // Check for alerts
      const newAlerts: string[] = []
      if (newVoltage < 200) {
        newAlerts.push("UNDERVOLTAGE: Risk of appliance malfunction")
      }
      if (newVoltage > 250) {
        newAlerts.push("OVERVOLTAGE: Risk of appliance damage")
      }
      if (newFrequency < 49 || newFrequency > 51) {
        newAlerts.push("FREQUENCY INSTABILITY: Power quality issue detected")
      }

      setAlerts(newAlerts)
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const getVoltageStatus = (voltage: number) => {
    if (voltage < 200) return { status: "Dangerous", color: "destructive" as const }
    if (voltage < 220) return { status: "Low", color: "secondary" as const }
    if (voltage > 250) return { status: "Dangerous", color: "destructive" as const }
    if (voltage > 240) return { status: "High", color: "secondary" as const }
    return { status: "Normal", color: "default" as const }
  }

  const getFrequencyStatus = (frequency: number) => {
    if (frequency < 49 || frequency > 51) return { status: "Unstable", color: "destructive" as const }
    return { status: "Stable", color: "default" as const }
  }

  const voltageStatus = getVoltageStatus(currentReading.voltage)
  const frequencyStatus = getFrequencyStatus(currentReading.frequency)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Smart Power Alert System</h1>
          </div>
          <p className="text-gray-600">Real-time electricity monitoring for Ghana</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: <TimeDisplay timestamp={currentReading.timestamp} /></span>
          </div>
          
          {/* Location Input */}
          <div className="max-w-md mx-auto mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter your location (e.g., Accra, Greater Accra)"
                value={userLocation}
                onChange={(e) => {
                  setUserLocation(e.target.value)
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  if (userLocation.trim()) {
                    setDisplayLocation(userLocation)
                    setCurrentReading(prev => ({ ...prev, location: userLocation }))
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <Alert key={index} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Power Alert</AlertTitle>
                <AlertDescription>{alert}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Live Readings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Live Voltage
              </CardTitle>
              <CardDescription>Current electrical voltage reading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">{currentReading.voltage}V</div>
                  <Badge variant={voltageStatus.color} className="mt-2">
                    {voltageStatus.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 text-center">Normal range: 220-240V</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Live Frequency
              </CardTitle>
              <CardDescription>Current electrical frequency reading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">{currentReading.frequency}Hz</div>
                  <Badge variant={frequencyStatus.color} className="mt-2">
                    {frequencyStatus.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 text-center">Normal: 50Hz ±1Hz</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Power History Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Power Quality Trends (Last Hour)</CardTitle>
            <CardDescription>Real-time voltage and frequency monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="voltage" orientation="left" domain={[180, 260]} />
                  <YAxis yAxisId="frequency" orientation="right" domain={[48, 52]} />
                  <Tooltip />
                  <Line
                    yAxisId="voltage"
                    type="monotone"
                    dataKey="voltage"
                    stroke="#2563eb"
                    strokeWidth={2}
                    name="Voltage (V)"
                  />
                  <Line
                    yAxisId="frequency"
                    type="monotone"
                    dataKey="frequency"
                    stroke="#16a34a"
                    strokeWidth={2}
                    name="Frequency (Hz)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Safety Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Safety Tips & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-700">When Power is Stable:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Safe to use all electrical appliances</li>
                  <li>• Good time to charge devices</li>
                  <li>• Consider using surge protectors</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-red-700">During Power Fluctuations:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Unplug sensitive electronics</li>
                  <li>• Avoid using high-power appliances</li>
                  <li>• Wait for stable readings before reconnecting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  )
}

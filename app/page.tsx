"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, AlertTriangle, TrendingUp, MapPin, Clock, Shield, Database } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { loadPowerData, getTrendsData, type PowerDataRegion } from "@/lib/power-data-service"

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
  const [selectedRegion, setSelectedRegion] = useState<string>("Greater Accra")
  const [userData, setUserData] = useState<any>(null)
  const [regionData, setRegionData] = useState<PowerDataRegion | null>(null)
  const [allRegions, setAllRegions] = useState<PowerDataRegion[]>([])
  const [historyData, setHistoryData] = useState<HistoryData[]>([])
  const [alerts, setAlerts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load all regions data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const regions = await loadPowerData()
        setAllRegions(regions)
        
        // Set default region data
        const defaultRegion = regions.find(r => r.regionName === selectedRegion) || regions[0]
        if (defaultRegion) {
          setRegionData(defaultRegion)
        }
      } catch (error) {
        console.error('Error loading power data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Load region-specific data when region changes
  useEffect(() => {
    if (allRegions.length > 0) {
      const region = allRegions.find(r => r.regionName === selectedRegion)
      if (region) {
        setRegionData(region)
      }
    }
  }, [selectedRegion, allRegions])

  // Load historical trends data
  useEffect(() => {
    const loadTrends = async () => {
      if (selectedRegion) {
        try {
          const trends = await getTrendsData(selectedRegion)
          setHistoryData(trends)
        } catch (error) {
          console.error('Error loading trends data:', error)
        }
      }
    }
    
    loadTrends()
  }, [selectedRegion])

  // Check for user data on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData))
    }
  }, [])

  // Generate alerts based on current region data
  useEffect(() => {
    if (!regionData) return

    const newAlerts: string[] = []
    
    // Check for voltage issues
    if (regionData.liveVoltage < 200) {
      newAlerts.push("UNDERVOLTAGE: Risk of appliance malfunction in " + regionData.regionName)
    }
    if (regionData.liveVoltage > 250) {
      newAlerts.push("OVERVOLTAGE: Risk of appliance damage in " + regionData.regionName)
    }
    
    // Check for frequency issues
    if (regionData.liveFrequency < 49 || regionData.liveFrequency > 51) {
      newAlerts.push("FREQUENCY INSTABILITY: Power quality issue detected in " + regionData.regionName)
    }
    
    // Check for low power stability
    if (regionData.powerStability < 70) {
      newAlerts.push("LOW POWER STABILITY: " + regionData.powerStability + "% stability in " + regionData.regionName)
    }
    
    // Check for active outages
    if (regionData.activeOutages.length > 0) {
      newAlerts.push(`ACTIVE OUTAGES: ${regionData.activeOutages.length} outage(s) reported in ${regionData.regionName}`)
    }

    setAlerts(newAlerts)
  }, [regionData])

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

  const getPowerStabilityStatus = (stability: number) => {
    if (stability >= 90) return { status: "Excellent", color: "default" as const }
    if (stability >= 70) return { status: "Good", color: "secondary" as const }
    return { status: "Poor", color: "destructive" as const }
  }

  const voltageStatus = regionData ? getVoltageStatus(regionData.liveVoltage) : { status: "Loading...", color: "secondary" as const }
  const frequencyStatus = regionData ? getFrequencyStatus(regionData.liveFrequency) : { status: "Loading...", color: "secondary" as const }
  const stabilityStatus = regionData ? getPowerStabilityStatus(regionData.powerStability) : { status: "Loading...", color: "secondary" as const }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Smart Power Alert System</h1>
          </div>
          <p className="text-gray-600">Real-time electricity monitoring across Ghana's regions</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Database className="h-4 w-4" />
            <span>Data from Ghana Power Grid - Updated Live</span>
          </div>
          
          {/* Region Selector */}
          <div className="max-w-md mx-auto mt-4">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                {allRegions.map((region) => (
                  <SelectItem key={region.regionName} value={region.regionName}>
                    {region.regionName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-2">
              Viewing power data for: <span className="font-semibold text-blue-600">{selectedRegion}</span>
            </p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Live Voltage
              </CardTitle>
              <CardDescription>Current electrical voltage reading</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">{regionData?.liveVoltage || 0}V</div>
                    <Badge variant={voltageStatus.color} className="mt-2">
                      {voltageStatus.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    Normal range: 220-240V<br/>
                    Average: {regionData?.averageVoltage || 0}V
                  </div>
                </div>
              )}
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
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">{regionData?.liveFrequency || 0}Hz</div>
                    <Badge variant={frequencyStatus.color} className="mt-2">
                      {frequencyStatus.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    Normal: 50Hz ±1Hz<br/>
                    Average: {regionData?.averageFrequency || 0}Hz
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Power Stability
              </CardTitle>
              <CardDescription>Overall power quality index</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600">{regionData?.powerStability || 0}%</div>
                    <Badge variant={stabilityStatus.color} className="mt-2">
                      {stabilityStatus.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    Quality: {regionData?.powerQualityTrend || 'Unknown'}<br/>
                    Users Affected: {(regionData?.usersAffected || 0).toLocaleString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Power History Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Power Quality Trends - {selectedRegion}</CardTitle>
            <CardDescription>Historical voltage, frequency, and stability data</CardDescription>
          </CardHeader>
          <CardContent>
            {historyData.length === 0 ? (
              <div className="h-80 flex items-center justify-center text-gray-500">
                Loading trend data...
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>

        {/* Regional Overview */}
        {regionData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {selectedRegion} - Current Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Active Issues</h4>
                  {regionData.activeOutages.length === 0 ? (
                    <p className="text-sm text-green-600">✓ No active outages reported</p>
                  ) : (
                    <div className="space-y-2">
                      {regionData.activeOutages.slice(0, 3).map((outage, index) => (
                        <div key={index} className="text-sm bg-red-50 p-2 rounded border-l-4 border-red-400">
                          <p className="font-medium">{outage.location}</p>
                          <p className="text-gray-600">{outage.cause} - {outage.usersAffected} users affected</p>
                        </div>
                      ))}
                      {regionData.activeOutages.length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{regionData.activeOutages.length - 3} more outages
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Scheduled Maintenance</h4>
                  {regionData.scheduledOutages.length === 0 ? (
                    <p className="text-sm text-blue-600">✓ No scheduled maintenance</p>
                  ) : (
                    <div className="space-y-2">
                      {regionData.scheduledOutages.slice(0, 3).map((outage, index) => (
                        <div key={index} className="text-sm bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                          <p className="font-medium">{outage.location}</p>
                          <p className="text-gray-600">{outage.cause} - {outage.duration}</p>
                        </div>
                      ))}
                      {regionData.scheduledOutages.length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{regionData.scheduledOutages.length - 3} more scheduled
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, BarChart3, Calendar } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface TrendData {
  time: string
  voltage: number
  frequency: number
  stability: number
}

export default function TrendsPage() {
  const [timeRange, setTimeRange] = useState("24h")
  const [selectedMetric, setSelectedMetric] = useState("voltage")
  const [trendData, setTrendData] = useState<TrendData[]>([])

  // Generate sample trend data
  useEffect(() => {
    const generateData = () => {
      const data: TrendData[] = []
      const hours = timeRange === "24h" ? 24 : timeRange === "7d" ? 168 : 720 // 24h, 7d, 30d
      const interval = timeRange === "24h" ? 1 : timeRange === "7d" ? 6 : 24

      for (let i = 0; i < hours; i += interval) {
        const baseVoltage = 230 + Math.sin(i / 12) * 5 // Daily pattern
        const voltageNoise = (Math.random() - 0.5) * 10
        const voltage = Math.max(200, Math.min(250, baseVoltage + voltageNoise))

        const baseFrequency = 50 + Math.sin(i / 8) * 0.5
        const frequencyNoise = (Math.random() - 0.5) * 1
        const frequency = Math.max(49, Math.min(51, baseFrequency + frequencyNoise))

        const stability = Math.max(0, Math.min(100, 100 - Math.abs(voltage - 230) * 2 - Math.abs(frequency - 50) * 10))

        const date = new Date()
        date.setHours(date.getHours() - (hours - i))

        data.push({
          time:
            timeRange === "24h"
              ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
              : date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          voltage: Math.round(voltage * 10) / 10,
          frequency: Math.round(frequency * 10) / 10,
          stability: Math.round(stability),
        })
      }
      return data
    }

    setTrendData(generateData())
  }, [timeRange])

  const averageVoltage = trendData.reduce((sum, d) => sum + d.voltage, 0) / trendData.length
  const averageFrequency = trendData.reduce((sum, d) => sum + d.frequency, 0) / trendData.length
  const averageStability = trendData.reduce((sum, d) => sum + d.stability, 0) / trendData.length

  const getStabilityColor = (stability: number) => {
    if (stability >= 90) return "text-green-600"
    if (stability >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getStabilityBadge = (stability: number) => {
    if (stability >= 90) return { label: "Excellent", variant: "default" as const }
    if (stability >= 70) return { label: "Good", variant: "secondary" as const }
    return { label: "Poor", variant: "destructive" as const }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Power Quality Trends</h1>
          <p className="text-gray-600">Historical analysis of power stability and quality</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="voltage">Voltage Trends</SelectItem>
              <SelectItem value="frequency">Frequency Trends</SelectItem>
              <SelectItem value="stability">Stability Index</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Voltage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{averageVoltage.toFixed(1)}V</div>
              <div className="flex items-center text-xs text-gray-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Normal range: 220-240V
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{averageFrequency.toFixed(1)}Hz</div>
              <div className="flex items-center text-xs text-gray-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Target: 50Hz ±1Hz
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Power Stability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStabilityColor(averageStability)}`}>
                {averageStability.toFixed(0)}%
              </div>
              <div className="flex items-center justify-between mt-1">
                <Badge variant={getStabilityBadge(averageStability).variant}>
                  {getStabilityBadge(averageStability).label}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {selectedMetric === "voltage" && "Voltage Trends"}
              {selectedMetric === "frequency" && "Frequency Trends"}
              {selectedMetric === "stability" && "Power Stability Index"}
            </CardTitle>
            <CardDescription>
              {timeRange === "24h" && "Hourly data for the last 24 hours"}
              {timeRange === "7d" && "Daily averages for the last 7 days"}
              {timeRange === "30d" && "Daily averages for the last 30 days"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {selectedMetric === "stability" ? (
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="stability" fill="#8884d8" name="Stability %" />
                  </BarChart>
                ) : (
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={selectedMetric === "voltage" ? [200, 260] : [48, 52]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke={selectedMetric === "voltage" ? "#2563eb" : "#16a34a"}
                      strokeWidth={2}
                      name={selectedMetric === "voltage" ? "Voltage (V)" : "Frequency (Hz)"}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Power Quality Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Key Insights</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>
                      Average voltage: {averageVoltage > 235 ? "Above" : averageVoltage < 225 ? "Below" : "Within"}{" "}
                      normal range
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>
                      Frequency stability: {Math.abs(averageFrequency - 50) < 0.5 ? "Excellent" : "Needs attention"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Overall power quality: {getStabilityBadge(averageStability).label.toLowerCase()}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Recommendations</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  {averageStability >= 90 ? (
                    <>
                      <p>• Power quality is excellent - safe to use all appliances</p>
                      <p>• Consider this a good time for heavy electrical work</p>
                    </>
                  ) : averageStability >= 70 ? (
                    <>
                      <p>• Power quality is acceptable but monitor closely</p>
                      <p>• Use surge protectors for sensitive equipment</p>
                    </>
                  ) : (
                    <>
                      <p>• Power quality is poor - exercise caution</p>
                      <p>• Avoid using sensitive electronics during unstable periods</p>
                      <p>• Consider backup power solutions</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

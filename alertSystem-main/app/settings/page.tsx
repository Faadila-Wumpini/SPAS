"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Settings, Bell, MapPin, Shield, Download } from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    criticalAlerts: true,
    warningAlerts: true,
    outageUpdates: true,
    maintenanceNotices: false,
    emailNotifications: true,
    smsNotifications: false,
  })

  const [preferences, setPreferences] = useState({
    location: "accra",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Settings className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-gray-600">Customize your SPAS experience</p>
        </div>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Choose which alerts and updates you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Critical Power Alerts</Label>
                  <div className="text-sm text-gray-500">Immediate notifications for dangerous voltage conditions</div>
                </div>
                <Switch
                  checked={notifications.criticalAlerts}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, criticalAlerts: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Warning Alerts</Label>
                  <div className="text-sm text-gray-500">Notifications for power quality issues</div>
                </div>
                <Switch
                  checked={notifications.warningAlerts}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, warningAlerts: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Outage Updates</Label>
                  <div className="text-sm text-gray-500">Information about power outages in your area</div>
                </div>
                <Switch
                  checked={notifications.outageUpdates}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, outageUpdates: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Maintenance Notices</Label>
                  <div className="text-sm text-gray-500">Scheduled maintenance and system updates</div>
                </div>
                <Switch
                  checked={notifications.maintenanceNotices}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, maintenanceNotices: checked }))}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Delivery Methods</h4>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <div className="text-sm text-gray-500">Receive alerts via email</div>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, emailNotifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">SMS Notifications</Label>
                  <div className="text-sm text-gray-500">Receive alerts via text message</div>
                </div>
                <Switch
                  checked={notifications.smsNotifications}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, smsNotifications: checked }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Settings
            </CardTitle>
            <CardDescription>Set your location for personalized power monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select
                  value={preferences.location}
                  onValueChange={(value) => setPreferences((prev) => ({ ...prev, location: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accra">Greater Accra</SelectItem>
                    <SelectItem value="ashanti">Ashanti</SelectItem>
                    <SelectItem value="western">Western</SelectItem>
                    <SelectItem value="eastern">Eastern</SelectItem>
                    <SelectItem value="central">Central</SelectItem>
                    <SelectItem value="northern">Northern</SelectItem>
                    <SelectItem value="upper-east">Upper East</SelectItem>
                    <SelectItem value="upper-west">Upper West</SelectItem>
                    <SelectItem value="volta">Volta</SelectItem>
                    <SelectItem value="brong-ahafo">Brong Ahafo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City/Town</Label>
                <Input id="city" placeholder="Enter your city or town" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Specific Address (Optional)</Label>
              <Input id="address" placeholder="Enter your specific address for more accurate monitoring" />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Privacy
            </CardTitle>
            <CardDescription>Manage your account security and data privacy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" placeholder="Enter current password" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="Enter new password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm new password" />
              </div>
            </div>

            <Button variant="outline" className="w-full md:w-auto bg-transparent">
              Update Password
            </Button>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Data & Privacy</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full md:w-auto bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download My Data
                </Button>
                <p className="text-sm text-gray-500">Download a copy of your personal data and usage history</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Settings */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save Settings</Button>
        </div>
      </div>
    </div>
  )
} 
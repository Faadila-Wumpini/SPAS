import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Shield, Users, Target, Award, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">About SPAS</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Smart Power Alert System - Revolutionizing electrical safety and power monitoring across Ghana
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                To provide real-time power quality monitoring and safety alerts to protect electrical appliances and
                enhance electrical safety awareness across Ghana, reducing equipment damage and improving quality of
                life for all Ghanaians.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                To become the leading power monitoring and safety platform in West Africa, empowering communities with
                the knowledge and tools needed to protect their electrical investments and ensure safe electricity
                usage.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* The Problem */}
        <Card>
          <CardHeader>
            <CardTitle>The Challenge We're Solving</CardTitle>
            <CardDescription>Understanding the electrical challenges in Ghana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-semibold">Voltage Fluctuations</h3>
                <p className="text-sm text-gray-600">
                  Unpredictable voltage changes damage expensive appliances and electronics
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold">Lack of Awareness</h3>
                <p className="text-sm text-gray-600">
                  Limited knowledge about electrical safety and appliance protection
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold">Economic Impact</h3>
                <p className="text-sm text-gray-600">
                  Significant financial losses from damaged appliances and equipment
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Our Solution */}
        <Card>
          <CardHeader>
            <CardTitle>Our Solution</CardTitle>
            <CardDescription>How SPAS addresses these challenges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-600">Real-Time Monitoring</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Continuous voltage and frequency tracking</li>
                    <li>• Instant alerts for dangerous conditions</li>
                    <li>• Historical data analysis and trends</li>
                    <li>• Location-based power quality reports</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-600">Safety Education</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Comprehensive safety guidelines</li>
                    <li>• Appliance protection recommendations</li>
                    <li>• Emergency response procedures</li>
                    <li>• Community awareness programs</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>What makes SPAS unique and effective</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <Badge className="mb-2">Live Data</Badge>
                <h4 className="font-semibold mb-2">Real-Time Monitoring</h4>
                <p className="text-sm text-gray-600">
                  Continuous tracking of voltage, frequency, and power quality with 3-second updates
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <Badge variant="secondary" className="mb-2">
                  Smart Alerts
                </Badge>
                <h4 className="font-semibold mb-2">Intelligent Warnings</h4>
                <p className="text-sm text-gray-600">
                  Automated alerts for overvoltage, undervoltage, and frequency instability
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <Badge variant="outline" className="mb-2">
                  Analytics
                </Badge>
                <h4 className="font-semibold mb-2">Trend Analysis</h4>
                <p className="text-sm text-gray-600">Historical data visualization and power quality trend analysis</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Badge className="mb-2">Location-Based</Badge>
                <h4 className="font-semibold mb-2">Regional Coverage</h4>
                <p className="text-sm text-gray-600">Area-specific monitoring and outage reporting across Ghana</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Badge variant="secondary" className="mb-2">
                  Mobile Ready
                </Badge>
                <h4 className="font-semibold mb-2">Responsive Design</h4>
                <p className="text-sm text-gray-600">Optimized for mobile devices and accessible anywhere</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Badge variant="outline" className="mb-2">
                  24/7 Support
                </Badge>
                <h4 className="font-semibold mb-2">Always Available</h4>
                <p className="text-sm text-gray-600">Round-the-clock monitoring and emergency support services</p>
              </div>
            </div>
          </CardContent>
        </Card>



        {/* Technology Stack */}
        <Card>
          <CardHeader>
            <CardTitle>Technology & Innovation</CardTitle>
            <CardDescription>Built with modern, reliable technology</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Frontend Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">React.js</Badge>
                  <Badge variant="outline">Next.js</Badge>
                  <Badge variant="outline">Tailwind CSS</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Backend & Infrastructure</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">FastAPI</Badge>
                  <Badge variant="outline">PostgreSQL</Badge>
                  <Badge variant="outline">Real-time WebSockets</Badge>
                  <Badge variant="outline">Cloud Hosting</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Shield, Zap, AlertTriangle, Phone } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Help & Safety Guide</h1>
          <p className="text-gray-600">Everything you need to know about electrical safety and SPAS</p>
        </div>

        {/* Emergency Alert */}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Emergency Contact</AlertTitle>
          <AlertDescription>
            For electrical emergencies, call ECG Emergency Line: <strong>0302-611611</strong> or Fire Service:{" "}
            <strong>192</strong>
          </AlertDescription>
        </Alert>

        {/* Quick Safety Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Quick Safety Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Badge variant="destructive" className="mb-2">
                  DANGER
                </Badge>
                <ul className="text-sm space-y-1">
                  <li>• Never touch electrical wires with wet hands</li>
                  <li>• Unplug appliances during thunderstorms</li>
                  <li>• Don't overload electrical outlets</li>
                  <li>• Keep water away from electrical equipment</li>
                </ul>
              </div>
              <div className="space-y-2">
                <Badge variant="default" className="mb-2">
                  SAFE PRACTICES
                </Badge>
                <ul className="text-sm space-y-1">
                  <li>• Use surge protectors for sensitive devices</li>
                  <li>• Regular inspection of electrical cords</li>
                  <li>• Install proper earthing systems</li>
                  <li>• Keep emergency contacts handy</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is SPAS and how does it work?</AccordionTrigger>
                <AccordionContent>
                  SPAS (Smart Power Alert System) is a real-time electricity monitoring system for Ghana. It tracks
                  voltage, frequency, and power quality to help users protect their appliances and stay informed about
                  electrical conditions. The system uses sensors and data analysis to provide alerts when power
                  conditions become dangerous.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>What voltage range is safe in Ghana?</AccordionTrigger>
                <AccordionContent>
                  In Ghana, the standard voltage is 230V with a tolerance of ±10%. This means safe voltage ranges from
                  207V to 253V. Voltages below 200V (undervoltage) or above 250V (overvoltage) can damage electrical
                  appliances and should be avoided.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>What should I do during voltage fluctuations?</AccordionTrigger>
                <AccordionContent>
                  During voltage fluctuations: 1) Immediately unplug sensitive electronics like computers, TVs, and
                  refrigerators. 2) Avoid using high-power appliances. 3) Wait for voltage to stabilize before
                  reconnecting devices. 4) Consider using voltage stabilizers or surge protectors for protection.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How do I interpret the power quality readings?</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Voltage:</strong> 220-240V = Normal, Below 200V = Dangerous (Undervoltage), Above 250V =
                      Dangerous (Overvoltage)
                    </p>
                    <p>
                      <strong>Frequency:</strong> 49-51Hz = Normal, Outside this range = Unstable power supply
                    </p>
                    <p>
                      <strong>Stability Index:</strong> 90-100% = Excellent, 70-89% = Good, Below 70% = Poor quality
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>What appliances are most at risk?</AccordionTrigger>
                <AccordionContent>
                  Most vulnerable appliances include: 1) Air conditioners and refrigerators (compressor damage), 2)
                  Computers and electronics (circuit damage), 3) LED/CFL bulbs (premature failure), 4) Washing machines
                  and microwaves (motor damage). Always use surge protectors for these devices.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>How can I protect my appliances?</AccordionTrigger>
                <AccordionContent>
                  Protection methods: 1) Install voltage stabilizers for sensitive appliances, 2) Use surge protectors
                  with proper ratings, 3) Unplug devices during storms or known power issues, 4) Install proper earthing
                  systems, 5) Regular maintenance of electrical installations, 6) Consider backup power solutions like
                  UPS systems.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Understanding Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Understanding SPAS Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold text-red-700">CRITICAL ALERTS</h4>
                <p className="text-sm text-gray-600">Immediate action required - unplug sensitive appliances</p>
                <ul className="text-sm text-gray-600 mt-1">
                  <li>• Voltage below 180V or above 260V</li>
                  <li>• Frequency outside 47-53Hz range</li>
                  <li>• Rapid voltage fluctuations</li>
                </ul>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-semibold text-yellow-700">WARNING ALERTS</h4>
                <p className="text-sm text-gray-600">Monitor closely and take precautions</p>
                <ul className="text-sm text-gray-600 mt-1">
                  <li>• Voltage 180-200V or 250-260V</li>
                  <li>• Frequency 47-49Hz or 51-53Hz</li>
                  <li>• Stability index below 70%</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-700">NORMAL CONDITIONS</h4>
                <p className="text-sm text-gray-600">Safe to use all electrical appliances</p>
                <ul className="text-sm text-gray-600 mt-1">
                  <li>• Voltage 220-240V</li>
                  <li>• Frequency 49-51Hz</li>
                  <li>• Stability index above 90%</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Need More Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Emergency Contacts</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    ECG Emergency: <strong>0302-611611</strong>
                  </p>
                  <p>
                    Fire Service: <strong>192</strong>
                  </p>
                  <p>
                    Police Emergency: <strong>191</strong>
                  </p>
                  <p>
                    Ambulance: <strong>193</strong>
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">SPAS Support</h4>
                <div className="space-y-1 text-sm">
                  <p>Email: smartpoweralertsystem@gmail.com</p>
                  <p>Phone: +233-XXX-XXXX</p>
                  <p>Hours: 24/7 Emergency Support</p>
                  <p>Response: Within 30 minutes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

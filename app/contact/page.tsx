"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock, MessageSquare, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import emailjs from "@emailjs/browser"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    subject: "",
    message: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState<"success" | "error">("success")
  const [showAlert, setShowAlert] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setShowAlert(false)

    try {
      // Initialize EmailJS with your public key
      emailjs.init("YOUR_PUBLIC_KEY") // Replace with your actual EmailJS public key

      const templateParams = {
        to_email: "smartpoweralertsystem@gmail.com",
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        phone: formData.phone,
        location: formData.location,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email
      }

      // Send email using EmailJS
      const result = await emailjs.send(
        "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
        "YOUR_TEMPLATE_ID", // Replace with your EmailJS template ID
        templateParams
      )

      if (result.status === 200) {
        setAlertType("success")
        setAlertMessage("Message sent successfully! We'll get back to you within 24 hours.")
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          location: "",
          subject: "",
          message: ""
        })
      } else {
        throw new Error("Email sending failed")
      }
    } catch (error) {
      console.error("Email sending failed:", error)
      setAlertType("error")
      setAlertMessage("Failed to send message. Please try again or contact us directly.")
    } finally {
      setIsLoading(false)
      setShowAlert(true)
      
      // Hide alert after 5 seconds
      setTimeout(() => {
        setShowAlert(false)
      }, 5000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-gray-600">Get in touch with the SPAS team for support and assistance</p>
        </div>

        {/* Alert Message */}
        {showAlert && (
          <Alert className={`mb-4 ${alertType === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            <div className="flex items-center gap-2">
              {alertType === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={alertType === "success" ? "text-green-800" : "text-red-800"}>
                {alertMessage}
              </AlertDescription>
            </div>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Send us a Message
              </CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you within 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input 
                      placeholder="Enter your first name" 
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input 
                      placeholder="Enter your last name" 
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input 
                    type="tel" 
                    placeholder="Enter your phone number" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input 
                    placeholder="City, Region" 
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input 
                    placeholder="What is this regarding?" 
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea 
                    placeholder="Describe your issue or inquiry in detail..." 
                    className="min-h-32"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  <Mail className="h-4 w-4 mr-2" />
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Emergency Contacts */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  Emergency Contacts
                </CardTitle>
                <CardDescription className="text-red-600">For immediate electrical emergencies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="font-semibold">ECG Emergency Line</p>
                    <p className="text-sm text-gray-600">0302-611611</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="font-semibold">Fire Service</p>
                    <p className="text-sm text-gray-600">192</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="font-semibold">Police Emergency</p>
                    <p className="text-sm text-gray-600">191</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SPAS Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  SPAS Support Team
                </CardTitle>
                <CardDescription>Technical support and general inquiries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-semibold">Support Hotline</p>
                    <p className="text-sm text-gray-600">+233-XXX-XXXX</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-semibold">Email Support</p>
                    <p className="text-sm text-gray-600">smartpoweralertsystem@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-semibold">Office Address</p>
                    <p className="text-sm text-gray-600">
                      Ministry of Energy
                      <br />
                      P.O. Box M.38
                      <br />
                      Accra, Ghana
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-semibold">Support Hours</p>
                    <p className="text-sm text-gray-600">
                      24/7 Emergency Support
                      <br />
                      Mon-Fri 8:00 AM - 6:00 PM (General)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regional Offices */}
            <Card>
              <CardHeader>
                <CardTitle>Regional Offices</CardTitle>
                <CardDescription>Contact your nearest regional office</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-3">
                  <p className="font-semibold">Greater Accra Region</p>
                  <p className="text-sm text-gray-600">+233-XXX-XXXX</p>
                </div>
                <div className="border-l-4 border-green-500 pl-3">
                  <p className="font-semibold">Ashanti Region</p>
                  <p className="text-sm text-gray-600">+233-XXX-XXXX</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-3">
                  <p className="font-semibold">Western Region</p>
                  <p className="text-sm text-gray-600">+233-XXX-XXXX</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-3">
                  <p className="font-semibold">Northern Region</p>
                  <p className="text-sm text-gray-600">+233-XXX-XXXX</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

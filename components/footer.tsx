import Link from "next/link"
import { Zap, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">SPAS</span>
            </div>
            <p className="text-gray-300 text-sm">
              Smart Power Alert System - Revolutionizing electrical safety and power monitoring across Ghana
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors">
                About
              </Link>
              <Link href="/outages" className="text-gray-300 hover:text-blue-400 transition-colors">
                Outages
              </Link>
              <Link href="/trends" className="text-gray-300 hover:text-blue-400 transition-colors">
                Trends
              </Link>
              <Link href="/help" className="text-gray-300 hover:text-blue-400 transition-colors">
                Help
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
                Connect with us
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-blue-400" />
              <a 
                href="mailto:smartpoweralertsystem@gmail.com" 
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                smartpoweralertsystem@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Smart Power Alert System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 
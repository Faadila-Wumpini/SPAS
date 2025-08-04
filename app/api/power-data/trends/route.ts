import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// Import the same data loading logic
async function loadPowerDataServer() {
  try {
    const csvPath = path.join(process.cwd(), 'data', 'power_data_regions_full.csv')
    const csvContent = await fs.readFile(csvPath, 'utf-8')
    
    const lines = csvContent.trim().split('\n')
    const data: any[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',')
      if (values.length >= 10) {
        const region = {
          regionName: values[0]?.trim() || '',
          averageVoltage: parseFloat(values[7]) || 230,
          averageFrequency: parseFloat(values[8]) || 50,
          powerStability: parseInt(values[9]?.replace('%', '')) || 100
        }
        data.push(region)
      }
    }
    
    return data
  } catch (error) {
    console.error('Error loading power data:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const regionName = searchParams.get('region')
    
    const data = await loadPowerDataServer()
    
    if (regionName && regionName !== 'All Regions') {
      const region = data.find((r: any) => r.regionName === regionName)
      if (!region) {
        return NextResponse.json({ error: 'Region not found' }, { status: 404 })
      }
      
      // Generate historical trend data based on current values
      const trends = []
      const hoursBack = 24
      
      for (let i = hoursBack; i >= 0; i--) {
        const date = new Date()
        date.setHours(date.getHours() - i)
        
        const voltageVariation = (Math.random() - 0.5) * 10
        const frequencyVariation = (Math.random() - 0.5) * 1
        
        trends.push({
          time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          voltage: Math.max(200, Math.min(260, region.averageVoltage + voltageVariation)),
          frequency: Math.max(48, Math.min(52, region.averageFrequency + frequencyVariation)),
          stability: Math.max(0, Math.min(100, region.powerStability + (Math.random() - 0.5) * 20))
        })
      }
      
      return NextResponse.json(trends)
    }
    
    // Return aggregated data for all regions
    const trends = []
    const hoursBack = 24
    
    for (let i = hoursBack; i >= 0; i--) {
      const date = new Date()
      date.setHours(date.getHours() - i)
      
      const avgVoltage = data.reduce((sum: number, r: any) => sum + r.averageVoltage, 0) / data.length
      const avgFrequency = data.reduce((sum: number, r: any) => sum + r.averageFrequency, 0) / data.length
      const avgStability = data.reduce((sum: number, r: any) => sum + r.powerStability, 0) / data.length
      
      const voltageVariation = (Math.random() - 0.5) * 8
      const frequencyVariation = (Math.random() - 0.5) * 0.8
      
      trends.push({
        time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        voltage: Math.max(200, Math.min(260, avgVoltage + voltageVariation)),
        frequency: Math.max(48, Math.min(52, avgFrequency + frequencyVariation)),
        stability: Math.max(0, Math.min(100, avgStability + (Math.random() - 0.5) * 15))
      })
    }
    
    return NextResponse.json(trends)
  } catch (error) {
    console.error('Trends API Error:', error)
    return NextResponse.json({ error: 'Failed to load trends data' }, { status: 500 })
  }
}
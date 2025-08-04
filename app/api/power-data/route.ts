import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export interface PowerDataRegion {
  regionName: string
  liveFrequency: number
  liveVoltage: number
  powerQualityTrend: string
  activeOutages: OutageInfo[]
  scheduledOutages: OutageInfo[]
  usersAffected: number
  averageVoltage: number
  averageFrequency: number
  powerStability: number
}

export interface OutageInfo {
  location: string
  startTime: string
  duration: string
  usersAffected: number
  cause: string
}

// Parse outage string format: "Location | Date Time | Duration | Users | Cause"
function parseOutages(outageString: string): OutageInfo[] {
  if (!outageString || outageString.trim() === '') return []
  
  return outageString.split(' || ').map(outage => {
    const parts = outage.split(' | ')
    if (parts.length >= 5) {
      return {
        location: parts[0].trim(),
        startTime: parts[1].trim(),
        duration: parts[2].trim(),
        usersAffected: parseInt(parts[3].trim()) || 0,
        cause: parts[4].trim()
      }
    }
    return {
      location: 'Unknown',
      startTime: new Date().toISOString(),
      duration: '0h',
      usersAffected: 0,
      cause: 'Unknown'
    }
  })
}

async function loadPowerData(): Promise<PowerDataRegion[]> {
  try {
    const csvPath = path.join(process.cwd(), 'data', 'power_data_regions_full.csv')
    const csvContent = await fs.readFile(csvPath, 'utf-8')
    
    const lines = csvContent.trim().split('\n')
    const headers = lines[0].split(',')
    
    const data: PowerDataRegion[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',')
      if (values.length >= 10) {
        const region: PowerDataRegion = {
          regionName: values[0]?.trim() || '',
          liveFrequency: parseFloat(values[1]) || 50,
          liveVoltage: parseFloat(values[2]) || 230,
          powerQualityTrend: values[3]?.trim() || 'Unknown',
          activeOutages: parseOutages(values[4] || ''),
          scheduledOutages: parseOutages(values[5] || ''),
          usersAffected: parseInt(values[6]) || 0,
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

export async function GET() {
  try {
    const data = await loadPowerData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to load power data' }, { status: 500 })
  }
}
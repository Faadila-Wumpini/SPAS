import { NextResponse } from 'next/server'
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
          activeOutages: parseOutages(values[4] || ''),
          scheduledOutages: parseOutages(values[5] || ''),
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

function parseOutages(outageString: string) {
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

export async function GET() {
  try {
    const data = await loadPowerDataServer()
    
    const active: any[] = []
    const scheduled: any[] = []
    
    data.forEach((region: any) => {
      region.activeOutages.forEach((outage: any) => {
        active.push({
          id: `${region.regionName}-${outage.location}-active`,
          location: outage.location,
          region: region.regionName,
          startTime: new Date(outage.startTime),
          estimatedDuration: outage.duration,
          affectedUsers: outage.usersAffected,
          status: 'active',
          cause: outage.cause
        })
      })
      
      region.scheduledOutages.forEach((outage: any) => {
        scheduled.push({
          id: `${region.regionName}-${outage.location}-scheduled`,
          location: outage.location,
          region: region.regionName,
          startTime: new Date(outage.startTime),
          estimatedDuration: outage.duration,
          affectedUsers: outage.usersAffected,
          status: 'scheduled',
          cause: outage.cause
        })
      })
    })
    
    return NextResponse.json({ active, scheduled })
  } catch (error) {
    console.error('Outages API Error:', error)
    return NextResponse.json({ error: 'Failed to load outages data' }, { status: 500 })
  }
}
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

export async function loadPowerData(): Promise<PowerDataRegion[]> {
  try {
    const response = await fetch('/api/power-data')
    if (!response.ok) {
      throw new Error('Failed to fetch power data')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error loading power data:', error)
    return []
  }
}

export async function getRegionData(regionName: string): Promise<PowerDataRegion | null> {
  const data = await loadPowerData()
  return data.find(region => 
    region.regionName.toLowerCase() === regionName.toLowerCase()
  ) || null
}

export async function getAllRegions(): Promise<string[]> {
  const data = await loadPowerData()
  return data.map(region => region.regionName)
}

export async function getOutagesData(): Promise<{active: any[], scheduled: any[]}> {
  try {
    const response = await fetch('/api/power-data/outages')
    if (!response.ok) {
      throw new Error('Failed to fetch outages data')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error loading outages data:', error)
    return { active: [], scheduled: [] }
  }
}

export async function getTrendsData(regionName?: string): Promise<any[]> {
  try {
    const url = regionName && regionName !== 'All Regions' 
      ? `/api/power-data/trends?region=${encodeURIComponent(regionName)}`
      : '/api/power-data/trends'
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch trends data')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error loading trends data:', error)
    return []
  }
}
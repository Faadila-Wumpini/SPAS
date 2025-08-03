const express = require('express');
const router = express.Router();

// Mock analytics data (replace with database queries)
const generateTrendData = (period = '24h') => {
  const data = [];
  const hours = period === '24h' ? 24 : period === '7d' ? 168 : 720; // 24h, 7d, 30d
  const interval = period === '24h' ? 1 : period === '7d' ? 6 : 24;

  for (let i = 0; i < hours; i += interval) {
    const baseVoltage = 230 + Math.sin(i / 12) * 5; // Daily pattern
    const voltageNoise = (Math.random() - 0.5) * 10;
    const voltage = Math.max(200, Math.min(250, baseVoltage + voltageNoise));

    const baseFrequency = 50 + Math.sin(i / 8) * 0.5;
    const frequencyNoise = (Math.random() - 0.5) * 1;
    const frequency = Math.max(49, Math.min(51, baseFrequency + frequencyNoise));

    const stability = Math.max(0, Math.min(100, 100 - Math.abs(voltage - 230) * 2 - Math.abs(frequency - 50) * 10));

    const date = new Date();
    date.setHours(date.getHours() - (hours - i));

    data.push({
      time: period === '24h'
        ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      voltage: Math.round(voltage * 10) / 10,
      frequency: Math.round(frequency * 10) / 10,
      stability: Math.round(stability)
    });
  }
  return data;
};

// Get power quality trends
router.get('/trends', (req, res) => {
  try {
    const { period = '24h', region, location } = req.query;
    
    const trendData = generateTrendData(period);
    
    // Calculate averages
    const avgVoltage = trendData.reduce((sum, d) => sum + d.voltage, 0) / trendData.length;
    const avgFrequency = trendData.reduce((sum, d) => sum + d.frequency, 0) / trendData.length;
    const avgStability = trendData.reduce((sum, d) => sum + d.stability, 0) / trendData.length;

    res.json({
      success: true,
      data: trendData,
      stats: {
        avgVoltage: Math.round(avgVoltage * 10) / 10,
        avgFrequency: Math.round(avgFrequency * 10) / 10,
        avgStability: Math.round(avgStability),
        period
      },
      filters: { region, location }
    });

  } catch (error) {
    console.error('Get trends error:', error);
    res.status(500).json({ error: 'Failed to get trend data' });
  }
});

// Get stability metrics
router.get('/stability', (req, res) => {
  try {
    const { region, period = '24h' } = req.query;
    
    const trendData = generateTrendData(period);
    
    // Calculate stability metrics
    const stabilityLevels = {
      excellent: trendData.filter(d => d.stability >= 90).length,
      good: trendData.filter(d => d.stability >= 70 && d.stability < 90).length,
      poor: trendData.filter(d => d.stability < 70).length
    };
    
    const avgStability = trendData.reduce((sum, d) => sum + d.stability, 0) / trendData.length;
    
    res.json({
      success: true,
      data: {
        avgStability: Math.round(avgStability),
        levels: stabilityLevels,
        totalReadings: trendData.length
      },
      period
    });

  } catch (error) {
    console.error('Get stability error:', error);
    res.status(500).json({ error: 'Failed to get stability metrics' });
  }
});

// Get regional statistics
router.get('/regions', (req, res) => {
  try {
    const regions = [
      {
        name: 'Greater Accra',
        avgVoltage: 231.2,
        avgFrequency: 50.1,
        stability: 87,
        activeOutages: 2,
        totalUsers: 2500000,
        powerQuality: 'Good'
      },
      {
        name: 'Ashanti',
        avgVoltage: 229.8,
        avgFrequency: 49.9,
        stability: 82,
        activeOutages: 1,
        totalUsers: 1800000,
        powerQuality: 'Good'
      },
      {
        name: 'Western',
        avgVoltage: 228.5,
        avgFrequency: 49.7,
        stability: 78,
        activeOutages: 1,
        totalUsers: 1200000,
        powerQuality: 'Fair'
      },
      {
        name: 'Central',
        avgVoltage: 230.1,
        avgFrequency: 50.0,
        stability: 85,
        activeOutages: 0,
        totalUsers: 900000,
        powerQuality: 'Good'
      },
      {
        name: 'Eastern',
        avgVoltage: 227.3,
        avgFrequency: 49.6,
        stability: 75,
        activeOutages: 1,
        totalUsers: 800000,
        powerQuality: 'Fair'
      }
    ];

    res.json({
      success: true,
      data: regions,
      summary: {
        totalRegions: regions.length,
        avgStability: Math.round(regions.reduce((sum, r) => sum + r.stability, 0) / regions.length),
        totalActiveOutages: regions.reduce((sum, r) => sum + r.activeOutages, 0),
        totalUsers: regions.reduce((sum, r) => sum + r.totalUsers, 0)
      }
    });

  } catch (error) {
    console.error('Get regions error:', error);
    res.status(500).json({ error: 'Failed to get regional statistics' });
  }
});

// Get power quality summary
router.get('/summary', (req, res) => {
  try {
    const { period = '24h' } = req.query;
    
    const trendData = generateTrendData(period);
    
    // Calculate summary statistics
    const voltages = trendData.map(d => d.voltage);
    const frequencies = trendData.map(d => d.frequency);
    const stabilities = trendData.map(d => d.stability);
    
    const summary = {
      voltage: {
        average: Math.round((voltages.reduce((a, b) => a + b, 0) / voltages.length) * 10) / 10,
        min: Math.min(...voltages),
        max: Math.max(...voltages),
        normal: voltages.filter(v => v >= 220 && v <= 240).length,
        low: voltages.filter(v => v < 220).length,
        high: voltages.filter(v => v > 240).length
      },
      frequency: {
        average: Math.round((frequencies.reduce((a, b) => a + b, 0) / frequencies.length) * 10) / 10,
        min: Math.min(...frequencies),
        max: Math.max(...frequencies),
        stable: frequencies.filter(f => f >= 49 && f <= 51).length,
        unstable: frequencies.filter(f => f < 49 || f > 51).length
      },
      stability: {
        average: Math.round(stabilities.reduce((a, b) => a + b, 0) / stabilities.length),
        excellent: stabilities.filter(s => s >= 90).length,
        good: stabilities.filter(s => s >= 70 && s < 90).length,
        poor: stabilities.filter(s => s < 70).length
      },
      totalReadings: trendData.length,
      period
    };
    
    res.json({
      success: true,
      summary
    });

  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ error: 'Failed to get power quality summary' });
  }
});

// Get hourly analysis
router.get('/hourly', (req, res) => {
  try {
    const { date = new Date().toISOString().split('T')[0] } = req.query;
    
    const hourlyData = [];
    for (let hour = 0; hour < 24; hour++) {
      const baseVoltage = 230 + Math.sin(hour / 6) * 3; // Daily pattern
      const voltageNoise = (Math.random() - 0.5) * 8;
      const voltage = Math.max(200, Math.min(250, baseVoltage + voltageNoise));

      const baseFrequency = 50 + Math.sin(hour / 4) * 0.3;
      const frequencyNoise = (Math.random() - 0.5) * 0.8;
      const frequency = Math.max(49, Math.min(51, baseFrequency + frequencyNoise));

      const stability = Math.max(0, Math.min(100, 100 - Math.abs(voltage - 230) * 2 - Math.abs(frequency - 50) * 10));

      hourlyData.push({
        hour: hour.toString().padStart(2, '0') + ':00',
        voltage: Math.round(voltage * 10) / 10,
        frequency: Math.round(frequency * 10) / 10,
        stability: Math.round(stability),
        demand: Math.round(80 + Math.sin(hour / 6) * 20 + (Math.random() - 0.5) * 10) // Simulated demand
      });
    }
    
    res.json({
      success: true,
      date,
      data: hourlyData
    });

  } catch (error) {
    console.error('Get hourly analysis error:', error);
    res.status(500).json({ error: 'Failed to get hourly analysis' });
  }
});

module.exports = router; 
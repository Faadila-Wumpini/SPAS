const express = require('express');
const Joi = require('joi');
const router = express.Router();

// Validation schemas
const powerReadingSchema = Joi.object({
  voltage: Joi.number().min(180).max(260).required(),
  frequency: Joi.number().min(48).max(52).required(),
  current: Joi.number().positive().optional(),
  power: Joi.number().positive().optional(),
  location: Joi.string().required(),
  region: Joi.string().required(),
  deviceId: Joi.string().required()
});

// In-memory power readings storage (replace with database)
let powerReadings = [
  {
    id: '1',
    deviceId: 'sensor-001',
    location: 'Accra Central',
    region: 'Greater Accra',
    voltage: 230.5,
    frequency: 50.1,
    current: 15.2,
    power: 3500,
    timestamp: new Date(),
    createdAt: new Date()
  },
  {
    id: '2',
    deviceId: 'sensor-002',
    location: 'Kumasi Central',
    region: 'Ashanti',
    voltage: 228.3,
    frequency: 49.8,
    current: 12.7,
    power: 2900,
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    createdAt: new Date(Date.now() - 300000)
  }
];

// Get current power readings
router.get('/current', (req, res) => {
  try {
    const { location, region } = req.query;
    
    let filteredReadings = powerReadings;
    
    if (location) {
      filteredReadings = filteredReadings.filter(reading => 
        reading.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (region) {
      filteredReadings = filteredReadings.filter(reading => 
        reading.region.toLowerCase().includes(region.toLowerCase())
      );
    }
    
    // Get the most recent reading for each location
    const currentReadings = filteredReadings.reduce((acc, reading) => {
      const existing = acc.find(r => r.location === reading.location);
      if (!existing || reading.timestamp > existing.timestamp) {
        if (existing) {
          acc = acc.filter(r => r.location !== reading.location);
        }
        acc.push(reading);
      }
      return acc;
    }, []);

    res.json({
      success: true,
      data: currentReadings,
      count: currentReadings.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get current readings error:', error);
    res.status(500).json({ error: 'Failed to get current readings' });
  }
});

// Get historical power data
router.get('/history', (req, res) => {
  try {
    const { location, region, startDate, endDate, limit = 100 } = req.query;
    
    let filteredReadings = powerReadings;
    
    if (location) {
      filteredReadings = filteredReadings.filter(reading => 
        reading.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (region) {
      filteredReadings = filteredReadings.filter(reading => 
        reading.region.toLowerCase().includes(region.toLowerCase())
      );
    }
    
    if (startDate) {
      const start = new Date(startDate);
      filteredReadings = filteredReadings.filter(reading => 
        reading.timestamp >= start
      );
    }
    
    if (endDate) {
      const end = new Date(endDate);
      filteredReadings = filteredReadings.filter(reading => 
        reading.timestamp <= end
      );
    }
    
    // Sort by timestamp (newest first) and limit results
    const sortedReadings = filteredReadings
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: sortedReadings,
      count: sortedReadings.length,
      total: filteredReadings.length
    });

  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get historical data' });
  }
});

// Get power readings by location
router.get('/location/:location', (req, res) => {
  try {
    const { location } = req.params;
    const { limit = 50 } = req.query;
    
    const locationReadings = powerReadings
      .filter(reading => 
        reading.location.toLowerCase().includes(location.toLowerCase())
      )
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit));

    if (locationReadings.length === 0) {
      return res.status(404).json({ 
        error: 'No readings found for this location',
        location 
      });
    }

    res.json({
      success: true,
      location,
      data: locationReadings,
      count: locationReadings.length
    });

  } catch (error) {
    console.error('Get location readings error:', error);
    res.status(500).json({ error: 'Failed to get location readings' });
  }
});

// Submit new power reading (for IoT devices)
router.post('/reading', (req, res) => {
  try {
    const { error, value } = powerReadingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { voltage, frequency, current, power, location, region, deviceId } = value;

    // Create new reading
    const newReading = {
      id: Date.now().toString(),
      deviceId,
      location,
      region,
      voltage,
      frequency,
      current,
      power,
      timestamp: new Date(),
      createdAt: new Date()
    };

    powerReadings.push(newReading);

    // Check for alerts based on readings
    const alerts = [];
    if (voltage < 200) {
      alerts.push({
        type: 'undervoltage',
        severity: 'high',
        message: `UNDERVOLTAGE: Voltage is ${voltage}V at ${location}`,
        location,
        region,
        timestamp: new Date()
      });
    }
    
    if (voltage > 250) {
      alerts.push({
        type: 'overvoltage',
        severity: 'high',
        message: `OVERVOLTAGE: Voltage is ${voltage}V at ${location}`,
        location,
        region,
        timestamp: new Date()
      });
    }
    
    if (frequency < 49 || frequency > 51) {
      alerts.push({
        type: 'frequency_instability',
        severity: 'medium',
        message: `FREQUENCY INSTABILITY: Frequency is ${frequency}Hz at ${location}`,
        location,
        region,
        timestamp: new Date()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Power reading recorded successfully',
      reading: newReading,
      alerts: alerts.length > 0 ? alerts : null
    });

  } catch (error) {
    console.error('Submit reading error:', error);
    res.status(500).json({ error: 'Failed to submit power reading' });
  }
});

// Get power statistics
router.get('/stats', (req, res) => {
  try {
    const { location, region, period = '24h' } = req.query;
    
    let filteredReadings = powerReadings;
    
    if (location) {
      filteredReadings = filteredReadings.filter(reading => 
        reading.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (region) {
      filteredReadings = filteredReadings.filter(reading => 
        reading.region.toLowerCase().includes(region.toLowerCase())
      );
    }
    
    // Filter by time period
    const now = new Date();
    let cutoffTime;
    
    switch (period) {
      case '1h':
        cutoffTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '6h':
        cutoffTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
        break;
      case '24h':
        cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        cutoffTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
    
    const recentReadings = filteredReadings.filter(reading => 
      reading.timestamp >= cutoffTime
    );

    if (recentReadings.length === 0) {
      return res.json({
        success: true,
        stats: {
          avgVoltage: 0,
          avgFrequency: 0,
          minVoltage: 0,
          maxVoltage: 0,
          minFrequency: 0,
          maxFrequency: 0,
          totalReadings: 0
        }
      });
    }

    const voltages = recentReadings.map(r => r.voltage);
    const frequencies = recentReadings.map(r => r.frequency);

    const stats = {
      avgVoltage: voltages.reduce((a, b) => a + b, 0) / voltages.length,
      avgFrequency: frequencies.reduce((a, b) => a + b, 0) / frequencies.length,
      minVoltage: Math.min(...voltages),
      maxVoltage: Math.max(...voltages),
      minFrequency: Math.min(...frequencies),
      maxFrequency: Math.max(...frequencies),
      totalReadings: recentReadings.length
    };

    res.json({
      success: true,
      stats,
      period
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get power statistics' });
  }
});

module.exports = router; 
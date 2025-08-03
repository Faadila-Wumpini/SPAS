const express = require('express');
const Joi = require('joi');
const router = express.Router();

// Validation schemas
const alertSchema = Joi.object({
  type: Joi.string().valid('undervoltage', 'overvoltage', 'frequency_instability', 'outage', 'maintenance').required(),
  severity: Joi.string().valid('low', 'medium', 'high', 'critical').required(),
  location: Joi.string().required(),
  region: Joi.string().required(),
  message: Joi.string().required(),
  affectedUsers: Joi.number().integer().min(0).optional()
});

// In-memory alerts storage (replace with database)
let alerts = [
  {
    id: '1',
    type: 'undervoltage',
    severity: 'high',
    location: 'East Legon',
    region: 'Greater Accra',
    message: 'UNDERVOLTAGE: Risk of appliance malfunction',
    affectedUsers: 15000,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    resolvedAt: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    type: 'frequency_instability',
    severity: 'medium',
    location: 'Kumasi Central',
    region: 'Ashanti',
    message: 'FREQUENCY INSTABILITY: Power quality issue detected',
    affectedUsers: 8500,
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    resolvedAt: null,
    createdAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: '3',
    type: 'maintenance',
    severity: 'low',
    location: 'Tema',
    region: 'Greater Accra',
    message: 'SCHEDULED MAINTENANCE: Planned maintenance in progress',
    affectedUsers: 12000,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    resolvedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // Resolved 1 hour ago
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  }
];

// Get all alerts
router.get('/', (req, res) => {
  try {
    const { 
      type, 
      severity, 
      region, 
      status = 'all',
      limit = 50,
      page = 1 
    } = req.query;
    
    let filteredAlerts = alerts;
    
    // Filter by type
    if (type) {
      filteredAlerts = filteredAlerts.filter(alert => alert.type === type);
    }
    
    // Filter by severity
    if (severity) {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity);
    }
    
    // Filter by region
    if (region) {
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.region.toLowerCase().includes(region.toLowerCase())
      );
    }
    
    // Filter by status
    if (status === 'active') {
      filteredAlerts = filteredAlerts.filter(alert => !alert.resolvedAt);
    } else if (status === 'resolved') {
      filteredAlerts = filteredAlerts.filter(alert => alert.resolvedAt);
    }
    
    // Sort by timestamp (newest first)
    filteredAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Pagination
    const pageSize = parseInt(limit);
    const currentPage = parseInt(page);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedAlerts = filteredAlerts.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedAlerts,
      pagination: {
        currentPage,
        totalPages: Math.ceil(filteredAlerts.length / pageSize),
        totalItems: filteredAlerts.length,
        itemsPerPage: pageSize
      }
    });

  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Failed to get alerts' });
  }
});

// Get active alerts
router.get('/active', (req, res) => {
  try {
    const { region } = req.query;
    
    let activeAlerts = alerts.filter(alert => !alert.resolvedAt);
    
    if (region) {
      activeAlerts = activeAlerts.filter(alert => 
        alert.region.toLowerCase().includes(region.toLowerCase())
      );
    }
    
    // Sort by severity (critical first) then by timestamp
    activeAlerts.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
      if (severityDiff !== 0) return severityDiff;
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    res.json({
      success: true,
      data: activeAlerts,
      count: activeAlerts.length
    });

  } catch (error) {
    console.error('Get active alerts error:', error);
    res.status(500).json({ error: 'Failed to get active alerts' });
  }
});

// Create new alert
router.post('/', (req, res) => {
  try {
    const { error, value } = alertSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { type, severity, location, region, message, affectedUsers = 0 } = value;

    const newAlert = {
      id: Date.now().toString(),
      type,
      severity,
      location,
      region,
      message,
      affectedUsers,
      timestamp: new Date(),
      resolvedAt: null,
      createdAt: new Date()
    };

    alerts.push(newAlert);

    res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      alert: newAlert
    });

  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// Update alert status
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { resolvedAt, message, severity } = req.body;
    
    const alertIndex = alerts.findIndex(alert => alert.id === id);
    
    if (alertIndex === -1) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    // Update alert
    alerts[alertIndex] = {
      ...alerts[alertIndex],
      ...(resolvedAt && { resolvedAt: new Date(resolvedAt) }),
      ...(message && { message }),
      ...(severity && { severity })
    };
    
    res.json({
      success: true,
      message: 'Alert updated successfully',
      alert: alerts[alertIndex]
    });

  } catch (error) {
    console.error('Update alert error:', error);
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

// Resolve alert
router.patch('/:id/resolve', (req, res) => {
  try {
    const { id } = req.params;
    
    const alertIndex = alerts.findIndex(alert => alert.id === id);
    
    if (alertIndex === -1) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    if (alerts[alertIndex].resolvedAt) {
      return res.status(400).json({ error: 'Alert is already resolved' });
    }
    
    alerts[alertIndex].resolvedAt = new Date();
    
    res.json({
      success: true,
      message: 'Alert resolved successfully',
      alert: alerts[alertIndex]
    });

  } catch (error) {
    console.error('Resolve alert error:', error);
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
});

// Get alert statistics
router.get('/stats', (req, res) => {
  try {
    const { region, period = '24h' } = req.query;
    
    let filteredAlerts = alerts;
    
    if (region) {
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.region.toLowerCase().includes(region.toLowerCase())
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
    
    const recentAlerts = filteredAlerts.filter(alert => 
      alert.timestamp >= cutoffTime
    );
    
    const activeAlerts = recentAlerts.filter(alert => !alert.resolvedAt);
    const resolvedAlerts = recentAlerts.filter(alert => alert.resolvedAt);
    
    // Count by type
    const typeCounts = recentAlerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {});
    
    // Count by severity
    const severityCounts = recentAlerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {});
    
    const stats = {
      total: recentAlerts.length,
      active: activeAlerts.length,
      resolved: resolvedAlerts.length,
      byType: typeCounts,
      bySeverity: severityCounts,
      totalAffectedUsers: recentAlerts.reduce((sum, alert) => sum + alert.affectedUsers, 0)
    };
    
    res.json({
      success: true,
      stats,
      period
    });

  } catch (error) {
    console.error('Get alert stats error:', error);
    res.status(500).json({ error: 'Failed to get alert statistics' });
  }
});

module.exports = router; 
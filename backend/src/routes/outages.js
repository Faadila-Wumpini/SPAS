const express = require('express');
const Joi = require('joi');
const router = express.Router();

// Validation schemas
const outageSchema = Joi.object({
  location: Joi.string().required(),
  region: Joi.string().required(),
  startTime: Joi.date().required(),
  estimatedEndTime: Joi.date().required(),
  cause: Joi.string().required(),
  status: Joi.string().valid('active', 'resolved', 'scheduled').required(),
  affectedUsers: Joi.number().integer().min(0).optional(),
  description: Joi.string().optional()
});

// In-memory outages storage (replace with database)
let outages = [
  {
    id: '1',
    location: 'East Legon',
    region: 'Greater Accra',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    estimatedEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    actualEndTime: null,
    cause: 'Transformer maintenance',
    status: 'active',
    affectedUsers: 15000,
    description: 'Scheduled transformer maintenance affecting East Legon area',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    location: 'Kumasi Central',
    region: 'Ashanti',
    startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    estimatedEndTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000), // 1.5 hours from now
    actualEndTime: null,
    cause: 'Power line fault',
    status: 'active',
    affectedUsers: 8500,
    description: 'Emergency repair due to power line fault',
    createdAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: '3',
    location: 'Tema',
    region: 'Greater Accra',
    startTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    estimatedEndTime: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    actualEndTime: new Date(Date.now() - 5 * 60 * 60 * 1000), // Resolved 5 hours ago
    cause: 'Equipment failure',
    status: 'resolved',
    affectedUsers: 12000,
    description: 'Equipment failure resolved successfully',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  },
  {
    id: '4',
    location: 'Takoradi',
    region: 'Western',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    estimatedEndTime: new Date(Date.now() + 30 * 60 * 60 * 1000), // 30 hours from now
    actualEndTime: null,
    cause: 'Planned maintenance',
    status: 'scheduled',
    affectedUsers: 20000,
    description: 'Planned maintenance for system upgrade',
    createdAt: new Date()
  }
];

// Get all outages
router.get('/', (req, res) => {
  try {
    const { 
      status, 
      region, 
      location,
      limit = 50,
      page = 1 
    } = req.query;
    
    let filteredOutages = outages;
    
    // Filter by status
    if (status) {
      filteredOutages = filteredOutages.filter(outage => outage.status === status);
    }
    
    // Filter by region
    if (region) {
      filteredOutages = filteredOutages.filter(outage => 
        outage.region.toLowerCase().includes(region.toLowerCase())
      );
    }
    
    // Filter by location
    if (location) {
      filteredOutages = filteredOutages.filter(outage => 
        outage.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // Sort by start time (newest first)
    filteredOutages.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    
    // Pagination
    const pageSize = parseInt(limit);
    const currentPage = parseInt(page);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedOutages = filteredOutages.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedOutages,
      pagination: {
        currentPage,
        totalPages: Math.ceil(filteredOutages.length / pageSize),
        totalItems: filteredOutages.length,
        itemsPerPage: pageSize
      }
    });

  } catch (error) {
    console.error('Get outages error:', error);
    res.status(500).json({ error: 'Failed to get outages' });
  }
});

// Get active outages
router.get('/active', (req, res) => {
  try {
    const { region } = req.query;
    
    let activeOutages = outages.filter(outage => outage.status === 'active');
    
    if (region) {
      activeOutages = activeOutages.filter(outage => 
        outage.region.toLowerCase().includes(region.toLowerCase())
      );
    }
    
    // Sort by start time (newest first)
    activeOutages.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    
    res.json({
      success: true,
      data: activeOutages,
      count: activeOutages.length
    });

  } catch (error) {
    console.error('Get active outages error:', error);
    res.status(500).json({ error: 'Failed to get active outages' });
  }
});

// Create new outage
router.post('/', (req, res) => {
  try {
    const { error, value } = outageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { 
      location, 
      region, 
      startTime, 
      estimatedEndTime, 
      cause, 
      status, 
      affectedUsers = 0, 
      description 
    } = value;

    const newOutage = {
      id: Date.now().toString(),
      location,
      region,
      startTime: new Date(startTime),
      estimatedEndTime: new Date(estimatedEndTime),
      actualEndTime: null,
      cause,
      status,
      affectedUsers,
      description,
      createdAt: new Date()
    };

    outages.push(newOutage);

    res.status(201).json({
      success: true,
      message: 'Outage created successfully',
      outage: newOutage
    });

  } catch (error) {
    console.error('Create outage error:', error);
    res.status(500).json({ error: 'Failed to create outage' });
  }
});

// Update outage
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { 
      actualEndTime, 
      status, 
      estimatedEndTime, 
      cause, 
      description 
    } = req.body;
    
    const outageIndex = outages.findIndex(outage => outage.id === id);
    
    if (outageIndex === -1) {
      return res.status(404).json({ error: 'Outage not found' });
    }
    
    // Update outage
    outages[outageIndex] = {
      ...outages[outageIndex],
      ...(actualEndTime && { actualEndTime: new Date(actualEndTime) }),
      ...(status && { status }),
      ...(estimatedEndTime && { estimatedEndTime: new Date(estimatedEndTime) }),
      ...(cause && { cause }),
      ...(description && { description })
    };
    
    res.json({
      success: true,
      message: 'Outage updated successfully',
      outage: outages[outageIndex]
    });

  } catch (error) {
    console.error('Update outage error:', error);
    res.status(500).json({ error: 'Failed to update outage' });
  }
});

// Resolve outage
router.patch('/:id/resolve', (req, res) => {
  try {
    const { id } = req.params;
    
    const outageIndex = outages.findIndex(outage => outage.id === id);
    
    if (outageIndex === -1) {
      return res.status(404).json({ error: 'Outage not found' });
    }
    
    if (outages[outageIndex].status === 'resolved') {
      return res.status(400).json({ error: 'Outage is already resolved' });
    }
    
    outages[outageIndex].status = 'resolved';
    outages[outageIndex].actualEndTime = new Date();
    
    res.json({
      success: true,
      message: 'Outage resolved successfully',
      outage: outages[outageIndex]
    });

  } catch (error) {
    console.error('Resolve outage error:', error);
    res.status(500).json({ error: 'Failed to resolve outage' });
  }
});

// Get outage statistics
router.get('/stats', (req, res) => {
  try {
    const { region, period = '24h' } = req.query;
    
    let filteredOutages = outages;
    
    if (region) {
      filteredOutages = filteredOutages.filter(outage => 
        outage.region.toLowerCase().includes(region.toLowerCase())
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
    
    const recentOutages = filteredOutages.filter(outage => 
      outage.startTime >= cutoffTime
    );
    
    const activeOutages = recentOutages.filter(outage => outage.status === 'active');
    const resolvedOutages = recentOutages.filter(outage => outage.status === 'resolved');
    const scheduledOutages = recentOutages.filter(outage => outage.status === 'scheduled');
    
    // Calculate average duration
    const resolvedWithDuration = resolvedOutages.filter(outage => outage.actualEndTime);
    const avgDuration = resolvedWithDuration.length > 0 
      ? resolvedWithDuration.reduce((sum, outage) => {
          return sum + (outage.actualEndTime - outage.startTime);
        }, 0) / resolvedWithDuration.length
      : 0;
    
    const stats = {
      total: recentOutages.length,
      active: activeOutages.length,
      resolved: resolvedOutages.length,
      scheduled: scheduledOutages.length,
      avgDurationMinutes: Math.round(avgDuration / (1000 * 60)),
      totalAffectedUsers: recentOutages.reduce((sum, outage) => sum + outage.affectedUsers, 0)
    };
    
    res.json({
      success: true,
      stats,
      period
    });

  } catch (error) {
    console.error('Get outage stats error:', error);
    res.status(500).json({ error: 'Failed to get outage statistics' });
  }
});

module.exports = router; 
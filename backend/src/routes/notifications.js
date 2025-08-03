const express = require('express');
const Joi = require('joi');
const router = express.Router();

// Validation schemas
const emailNotificationSchema = Joi.object({
  to: Joi.string().email().required(),
  subject: Joi.string().required(),
  message: Joi.string().required(),
  type: Joi.string().valid('alert', 'outage', 'maintenance', 'general').required()
});

const smsNotificationSchema = Joi.object({
  to: Joi.string().required(),
  message: Joi.string().max(160).required(),
  type: Joi.string().valid('alert', 'outage', 'maintenance', 'general').required()
});

// Mock notification service (replace with actual EmailJS, Twilio, etc.)
class NotificationService {
  static async sendEmail(to, subject, message, type) {
    // Simulate email sending
    console.log(`📧 Email sent to ${to}: ${subject}`);
    return {
      success: true,
      messageId: `email_${Date.now()}`,
      type: 'email',
      recipient: to
    };
  }

  static async sendSMS(to, message, type) {
    // Simulate SMS sending
    console.log(`📱 SMS sent to ${to}: ${message}`);
    return {
      success: true,
      messageId: `sms_${Date.now()}`,
      type: 'sms',
      recipient: to
    };
  }

  static async sendPushNotification(userId, title, body, data) {
    // Simulate push notification
    console.log(`🔔 Push notification to user ${userId}: ${title}`);
    return {
      success: true,
      messageId: `push_${Date.now()}`,
      type: 'push',
      recipient: userId
    };
  }
}

// Send email notification
router.post('/email', async (req, res) => {
  try {
    const { error, value } = emailNotificationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { to, subject, message, type } = value;

    // Send email using notification service
    const result = await NotificationService.sendEmail(to, subject, message, type);

    res.json({
      success: true,
      message: 'Email notification sent successfully',
      data: result
    });

  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ error: 'Failed to send email notification' });
  }
});

// Send SMS notification
router.post('/sms', async (req, res) => {
  try {
    const { error, value } = smsNotificationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { to, message, type } = value;

    // Send SMS using notification service
    const result = await NotificationService.sendSMS(to, message, type);

    res.json({
      success: true,
      message: 'SMS notification sent successfully',
      data: result
    });

  } catch (error) {
    console.error('Send SMS error:', error);
    res.status(500).json({ error: 'Failed to send SMS notification' });
  }
});

// Send push notification
router.post('/push', async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).json({ error: 'userId, title, and body are required' });
    }

    // Send push notification
    const result = await NotificationService.sendPushNotification(userId, title, body, data);

    res.json({
      success: true,
      message: 'Push notification sent successfully',
      data: result
    });

  } catch (error) {
    console.error('Send push notification error:', error);
    res.status(500).json({ error: 'Failed to send push notification' });
  }
});

// Send bulk notifications
router.post('/bulk', async (req, res) => {
  try {
    const { notifications } = req.body;

    if (!Array.isArray(notifications) || notifications.length === 0) {
      return res.status(400).json({ error: 'notifications array is required' });
    }

    const results = [];
    const errors = [];

    for (const notification of notifications) {
      try {
        let result;
        
        switch (notification.type) {
          case 'email':
            const { error: emailError } = emailNotificationSchema.validate(notification);
            if (emailError) {
              errors.push({ notification, error: emailError.details[0].message });
              continue;
            }
            result = await NotificationService.sendEmail(
              notification.to,
              notification.subject,
              notification.message,
              notification.notificationType
            );
            break;

          case 'sms':
            const { error: smsError } = smsNotificationSchema.validate(notification);
            if (smsError) {
              errors.push({ notification, error: smsError.details[0].message });
              continue;
            }
            result = await NotificationService.sendSMS(
              notification.to,
              notification.message,
              notification.notificationType
            );
            break;

          case 'push':
            if (!notification.userId || !notification.title || !notification.body) {
              errors.push({ notification, error: 'Missing required fields for push notification' });
              continue;
            }
            result = await NotificationService.sendPushNotification(
              notification.userId,
              notification.title,
              notification.body,
              notification.data
            );
            break;

          default:
            errors.push({ notification, error: 'Invalid notification type' });
            continue;
        }

        results.push(result);

      } catch (error) {
        errors.push({ notification, error: error.message });
      }
    }

    res.json({
      success: true,
      message: `Bulk notification completed. ${results.length} successful, ${errors.length} failed.`,
      data: {
        successful: results,
        failed: errors,
        summary: {
          total: notifications.length,
          successful: results.length,
          failed: errors.length
        }
      }
    });

  } catch (error) {
    console.error('Send bulk notifications error:', error);
    res.status(500).json({ error: 'Failed to send bulk notifications' });
  }
});

// Send alert notification
router.post('/alert', async (req, res) => {
  try {
    const { alert, recipients } = req.body;

    if (!alert || !recipients) {
      return res.status(400).json({ error: 'alert and recipients are required' });
    }

    const results = [];
    const errors = [];

    for (const recipient of recipients) {
      try {
        let result;

        // Send email notification
        if (recipient.email) {
          const emailSubject = `SPAS Alert: ${alert.type.toUpperCase()}`;
          const emailMessage = `
            Alert Details:
            Type: ${alert.type}
            Location: ${alert.location}
            Message: ${alert.message}
            Severity: ${alert.severity}
            Time: ${new Date(alert.timestamp).toLocaleString()}
            
            Stay safe and check for updates.
          `;

          result = await NotificationService.sendEmail(
            recipient.email,
            emailSubject,
            emailMessage,
            'alert'
          );
          results.push(result);
        }

        // Send SMS notification
        if (recipient.phone) {
          const smsMessage = `SPAS Alert: ${alert.type} at ${alert.location}. ${alert.message}`;
          
          result = await NotificationService.sendSMS(
            recipient.phone,
            smsMessage,
            'alert'
          );
          results.push(result);
        }

        // Send push notification
        if (recipient.userId) {
          result = await NotificationService.sendPushNotification(
            recipient.userId,
            `SPAS Alert: ${alert.type}`,
            `${alert.message} at ${alert.location}`,
            { alertId: alert.id, type: alert.type }
          );
          results.push(result);
        }

      } catch (error) {
        errors.push({ recipient, error: error.message });
      }
    }

    res.json({
      success: true,
      message: `Alert notifications sent. ${results.length} successful, ${errors.length} failed.`,
      data: {
        successful: results,
        failed: errors,
        alert: alert
      }
    });

  } catch (error) {
    console.error('Send alert notification error:', error);
    res.status(500).json({ error: 'Failed to send alert notifications' });
  }
});

// Get notification status
router.get('/status', (req, res) => {
  try {
    // Mock notification status (replace with actual service status)
    const status = {
      email: {
        service: 'EmailJS',
        status: 'operational',
        lastCheck: new Date().toISOString()
      },
      sms: {
        service: 'Twilio',
        status: 'operational',
        lastCheck: new Date().toISOString()
      },
      push: {
        service: 'Firebase Cloud Messaging',
        status: 'operational',
        lastCheck: new Date().toISOString()
      }
    };

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('Get notification status error:', error);
    res.status(500).json({ error: 'Failed to get notification status' });
  }
});

module.exports = router; 
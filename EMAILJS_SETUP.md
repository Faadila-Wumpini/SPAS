# EmailJS Setup Guide

## Overview
This guide explains how to set up EmailJS to enable email functionality in the contact form.

## Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Create Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" or "Custom SMTP"
4. For Gmail:
   - Service Name: `SPAS Contact`
   - Gmail Account: `smartpoweralertsystem@gmail.com`
   - Follow the authentication steps

## Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

```html
Subject: New Contact Form Message from SPAS

From: {{from_name}} ({{from_email}})
Phone: {{phone}}
Location: {{location}}
Subject: {{subject}}

Message:
{{message}}

---
This message was sent from the SPAS contact form.
Reply to: {{reply_to}}
```

## Step 4: Get Your Credentials
1. **Public Key**: Found in Account > API Keys
2. **Service ID**: Found in Email Services (e.g., `service_xxxxxxx`)
3. **Template ID**: Found in Email Templates (e.g., `template_xxxxxxx`)

## Step 5: Update Contact Page
Replace the placeholder values in `app/contact/page.tsx`:

```javascript
// Replace these values with your actual EmailJS credentials
emailjs.init("YOUR_PUBLIC_KEY") // Your EmailJS public key

const result = await emailjs.send(
  "YOUR_SERVICE_ID", // Your EmailJS service ID
  "YOUR_TEMPLATE_ID", // Your EmailJS template ID
  templateParams
)
```

## Step 6: Test the Form
1. Fill out the contact form
2. Click "Send Message"
3. Check your email at `smartpoweralertsystem@gmail.com`
4. Verify the success/error alerts work correctly

## Troubleshooting
- **Email not received**: Check spam folder, verify EmailJS setup
- **Form not submitting**: Check browser console for errors
- **Template issues**: Verify template variables match the code

## Security Notes
- EmailJS public key is safe to expose in frontend code
- Service and template IDs are also public
- EmailJS handles the actual email sending securely 
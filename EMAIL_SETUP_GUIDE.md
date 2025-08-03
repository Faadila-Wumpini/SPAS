# Email Setup Guide - Receive Contact Form Messages

## Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Set Up Email Service
1. In EmailJS dashboard, click "Email Services"
2. Click "Add New Service"
3. Choose "Gmail"
4. Service Name: `SPAS Contact`
5. Connect your `smartpoweralertsystem@gmail.com` account
6. Copy the Service ID (looks like `service_xxxxxxx`)

### Step 3: Create Email Template
1. Click "Email Templates"
2. Click "Create New Template"
3. Template Name: `SPAS Contact Form`
4. Use this template:

**Subject:** New Contact Form Message from SPAS

**Content:**
```
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

5. Copy the Template ID (looks like `template_xxxxxxx`)

### Step 4: Get Your Public Key
1. Go to "Account" → "API Keys"
2. Copy your Public Key

### Step 5: Update the Code
Replace the placeholder values in `app/contact/page.tsx`:

```javascript
// Replace these three lines in the handleSubmit function:

emailjs.init("YOUR_PUBLIC_KEY") // Replace with your actual public key

const result = await emailjs.send(
  "YOUR_SERVICE_ID", // Replace with your service ID
  "YOUR_TEMPLATE_ID", // Replace with your template ID
  templateParams
)
```

### Step 6: Test
1. Fill out the contact form on your website
2. Click "Send Message"
3. Check your email at `smartpoweralertsystem@gmail.com`
4. You should receive the message!

## Example Configuration
If your credentials are:
- Public Key: `user_abc123def456`
- Service ID: `service_spas_contact`
- Template ID: `template_contact_form`

Then your code would look like:
```javascript
emailjs.init("user_abc123def456")

const result = await emailjs.send(
  "service_spas_contact",
  "template_contact_form",
  templateParams
)
```

## Troubleshooting
- **Email not received**: Check spam folder, verify EmailJS setup
- **Form not submitting**: Check browser console for errors
- **Template issues**: Verify template variables match the code

## Security Notes
- EmailJS public key is safe to expose in frontend code
- EmailJS handles the actual email sending securely
- Your Gmail account credentials are not exposed 
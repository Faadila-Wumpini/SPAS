# Quick EmailJS Setup for SPAS Contact Form

## Step 1: Create EmailJS Account (2 minutes)
1. Go to https://www.emailjs.com/
2. Click "Sign Up" and create account
3. Verify your email

## Step 2: Set Up Email Service (3 minutes)
1. In EmailJS dashboard, click "Email Services"
2. Click "Add New Service"
3. Choose "Gmail"
4. Service Name: `SPAS Contact`
5. Connect your `smartpoweralertsystem@gmail.com` account
6. Copy the Service ID (looks like `service_xxxxxxx`)

## Step 3: Create Email Template (2 minutes)
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

## Step 4: Get Your Public Key (1 minute)
1. Go to "Account" → "API Keys"
2. Copy your Public Key

## Step 5: Update the Code
Replace the placeholder values in `app/contact/page.tsx`:

```javascript
// Replace this section in the handleSubmit function:
try {
  // Initialize EmailJS
  emailjs.init("YOUR_PUBLIC_KEY") // Replace with your actual public key

  const templateParams = {
    to_email: "smartpoweralertsystem@gmail.com",
    from_name: `${formData.firstName} ${formData.lastName}`,
    from_email: formData.email,
    phone: formData.phone,
    location: formData.location,
    subject: formData.subject,
    message: formData.message,
    reply_to: formData.email
  }

  // Send email using EmailJS
  const result = await emailjs.send(
    "YOUR_SERVICE_ID", // Replace with your service ID
    "YOUR_TEMPLATE_ID", // Replace with your template ID
    templateParams
  )

  if (result.status === 200) {
    // Success handling
  }
} catch (error) {
  // Error handling
}
```

## Step 6: Test
1. Fill out the contact form
2. Click "Send Message"
3. Check your email at `smartpoweralertsystem@gmail.com`

## Your Credentials Needed:
- **Public Key**: `public_key_xxxxxxx`
- **Service ID**: `service_xxxxxxx`
- **Template ID**: `template_xxxxxxx`

Once you have these, I can help you update the code to make the emails actually send! 
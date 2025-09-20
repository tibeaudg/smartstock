# Google Ads Conversion Tracking Setup Guide

## Overview
This guide explains how to properly set up Google Ads conversion tracking for your StockFlow website. The warning message you're seeing indicates that while the Google Ads tracking code is loaded, no conversion events are being fired.

## Current Setup
- **Google Ads Account ID**: AW-17574614935
- **Tracking Code**: Already installed in `index.html`
- **Conversion Tracking**: Implemented in the codebase

## Required Actions

### 1. Create Conversion Actions in Google Ads

You need to create the following conversion actions in your Google Ads account:

#### A. Page View Conversion
- **Name**: "Homepage Page View"
- **Category**: "Page view"
- **Value**: $1.00 (or your preferred value)
- **Count**: "Every"
- **Conversion Window**: 30 days
- **View-through Conversion Window**: 1 day
- **Include in "Conversions"**: Yes
- **Attribution Model**: "Last click"

#### B. Registration Conversion
- **Name**: "User Registration"
- **Category**: "Sign-up"
- **Value**: $15.00 (or your preferred value)
- **Count**: "One"
- **Conversion Window**: 30 days
- **View-through Conversion Window**: 1 day
- **Include in "Conversions"**: Yes
- **Attribution Model**: "Last click"

#### C. Login Conversion
- **Name**: "User Login"
- **Category**: "Login"
- **Value**: $10.00 (or your preferred value)
- **Count**: "Every"
- **Conversion Window**: 30 days
- **View-through Conversion Window**: 1 day
- **Include in "Conversions"**: Yes
- **Attribution Model**: "Last click"

#### D. Demo Interest Conversion
- **Name**: "Demo Interest"
- **Category**: "Other"
- **Value**: $2.00 (or your preferred value)
- **Count**: "Every"
- **Conversion Window**: 30 days
- **View-through Conversion Window**: 1 day
- **Include in "Conversions"**: Yes
- **Attribution Model**: "Last click"

#### E. Contact Form Conversion
- **Name**: "Contact Form Submission"
- **Category**: "Lead"
- **Value**: $5.00 (or your preferred value)
- **Count**: "One"
- **Conversion Window**: 30 days
- **View-through Conversion Window**: 1 day
- **Include in "Conversions"**: Yes
- **Attribution Model**: "Last click"

### 2. Get Conversion Labels

After creating each conversion action, you'll get a conversion label. Update the following file:

**File**: `src/utils/googleAdsTracking.ts`

Replace the placeholder labels with your actual conversion labels:

```typescript
export const GOOGLE_ADS_CONVERSIONS = {
  // Page view conversion (track when users visit key pages)
  PAGE_VIEW: {
    conversionId: 'AW-17574614935',
    conversionLabel: 'YOUR_ACTUAL_PAGE_VIEW_LABEL', // Replace this
  },
  
  // Registration conversion (when user completes signup)
  REGISTRATION: {
    conversionId: 'AW-17574614935',
    conversionLabel: 'YOUR_ACTUAL_REGISTRATION_LABEL', // Replace this
  },
  
  // Login conversion (when user successfully logs in)
  LOGIN: {
    conversionId: 'AW-17574614935',
    conversionLabel: 'YOUR_ACTUAL_LOGIN_LABEL', // Replace this
  },
  
  // Demo request conversion (when user requests demo)
  DEMO_REQUEST: {
    conversionId: 'AW-17574614935',
    conversionLabel: 'YOUR_ACTUAL_DEMO_LABEL', // Replace this
  },
  
  // Contact form submission
  CONTACT_SUBMIT: {
    conversionId: 'AW-17574614935',
    conversionLabel: 'YOUR_ACTUAL_CONTACT_LABEL', // Replace this
  },
  
  // Pricing page view (high-intent page)
  PRICING_VIEW: {
    conversionId: 'AW-17574614935',
    conversionLabel: 'YOUR_ACTUAL_PRICING_LABEL', // Replace this
  },
} as const;
```

### 3. How to Find Conversion Labels

1. Go to your Google Ads account
2. Click on "Tools & Settings" (wrench icon)
3. Under "Measurement", click "Conversions"
4. Click on each conversion action you created
5. Look for "Tag setup" section
6. Copy the conversion label (it looks like: `abc123def456`)

### 4. Test the Implementation

#### Option A: Use the Test Component (Development)
The code includes a test component that appears in development mode. It allows you to test all conversion types.

#### Option B: Use Google Ads Conversion Tracking Test
1. In Google Ads, go to "Conversions" → "Conversion actions"
2. Click on a conversion action
3. Click "Tag setup"
4. Use the "Test your conversion" tool
5. Enter your website URL and test

#### Option C: Browser Developer Tools
1. Open your website in Chrome
2. Open Developer Tools (F12)
3. Go to "Network" tab
4. Filter by "googleads"
5. Perform actions that should trigger conversions
6. Look for requests to `googleadservices.com` or `googletagmanager.com`

### 5. Verify Conversions in Google Ads

After implementing:
1. Wait 24-48 hours for data to appear
2. Go to "Conversions" in Google Ads
3. Check if conversion events are being recorded
4. Look at "Conversions" column in your campaigns

### 6. Troubleshooting

#### Common Issues:

**No conversions showing up:**
- Check that conversion labels are correct
- Verify the tracking code is loading (check browser console)
- Ensure you're not in a test environment
- Wait 24-48 hours for data to appear

**Warning message persists:**
- Verify conversion actions are created in Google Ads
- Check that conversion labels match exactly
- Ensure the gtag script is loading properly

**Conversions showing but no value:**
- Check that you've set values in the conversion actions
- Verify the value is being passed in the tracking calls

### 7. Production Checklist

Before going live:
- [ ] All conversion actions created in Google Ads
- [ ] Conversion labels updated in code
- [ ] Test component removed from production
- [ ] Conversions tested and verified
- [ ] Google Ads conversion tracking test passed

### 8. Monitoring

After implementation:
- Monitor conversion data daily for the first week
- Check for any error messages in browser console
- Verify conversion values are being recorded correctly
- Adjust conversion values based on your business metrics

## Important Notes

1. **Conversion Labels are Unique**: Each conversion action has a unique label that must match exactly in your code.

2. **Values Matter**: Set realistic conversion values that reflect the actual value of each action to your business.

3. **Testing is Critical**: Always test conversion tracking before launching campaigns.

4. **Privacy Compliance**: Ensure your conversion tracking complies with GDPR and other privacy regulations.

5. **Performance**: The tracking code is optimized to not impact page load speed.

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify the Google Ads account has the correct permissions
3. Ensure the website is not in a development/test environment
4. Contact Google Ads support if technical issues persist

---

**Next Steps**: Create the conversion actions in Google Ads, get the conversion labels, and update the code accordingly. The warning message should disappear once proper conversion events start firing.

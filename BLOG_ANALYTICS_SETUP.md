# Blog Analytics Setup Guide

This guide explains how to set up and use the blog analytics system to track visitors per blog post page.

## 🗄️ Database Setup

### 1. Run the Migrations

First, you need to run the database migrations in order:

```bash
# 1. Create the blogposts table
supabase db push --file supabase/migrations/20250114000000_create_blogposts_table.sql

# 2. Create the analytics table and views
supabase db push --file supabase/migrations/20250115000000_create_blog_analytics.sql
```

### 2. Verify Tables Created

You should now have these new tables:
- `blogposts` - Stores blog post content
- `blog_analytics` - Stores individual visitor analytics
- `blog_analytics_summary` - A view that aggregates analytics data

## 🚀 How It Works

### Automatic Tracking

The system automatically tracks visitors when they visit blog post pages:

1. **Page Load Tracking**: Records when a page loads and how long it takes
2. **Time on Page**: Tracks how long visitors stay on the page
3. **Visitor Information**: Captures user agent, referrer, and other metadata
4. **Unique Visits**: Identifies unique visitors (basic implementation)

### What Gets Tracked

- Page load time (milliseconds)
- Time spent on page (seconds)
- User agent (browser/device info)
- Referrer (where visitors came from)
- Timestamp of visit
- Blog post slug and ID

## 📊 Viewing Analytics

### Admin Dashboard

Use the `BlogAnalytics` component to view analytics:

```tsx
import BlogAnalytics from './components/admin/BlogAnalytics';

// In your admin page
<BlogAnalytics />
```

### API Functions

You can also query analytics data programmatically:

```tsx
import { 
  getBlogAnalyticsSummary, 
  getBlogAnalyticsBySlug 
} from '../integrations/supabase/client';

// Get summary for all blog posts
const summary = await getBlogAnalyticsSummary();

// Get detailed analytics for a specific post
const details = await getBlogAnalyticsBySlug('my-blog-post');
```

## 🧪 Testing

### 1. Run the Test Script

```bash
node scripts/test-blog-analytics.js
```

This will:
- Create a test blog post
- Insert sample analytics data
- Verify the system is working

### 2. Manual Testing

1. Visit any blog post page
2. Wait at least 2 seconds (tracking delay)
3. Check the browser console for tracking logs
4. View analytics in the admin dashboard

## 🔧 Customization

### IP Address Tracking

To enable IP address tracking, uncomment and configure in `useBlogAnalytics.tsx`:

```tsx
// Uncomment this section and configure your IP service
const response = await fetch('https://api.ipify.org?format=json');
const { ip } = await response.json();
analyticsData.visitor_ip = ip;
```

### Unique Visit Detection

The current system marks all visits as unique. To implement better uniqueness:

1. Store visitor fingerprints (IP + user agent hash)
2. Use cookies or localStorage
3. Implement session-based tracking

### Additional Metrics

You can extend the analytics to track:
- Scroll depth
- Click events
- Form submissions
- Exit intent
- Geographic location (with IP service)

## 📈 Performance Considerations

### Database Indexes

The system includes indexes for:
- `blog_post_id` - Fast lookups by post
- `slug` - Fast lookups by URL
- `created_at` - Time-based queries
- `visitor_ip` - IP-based analytics

### Data Retention

Consider implementing data retention policies:
- Archive old analytics data
- Aggregate daily/weekly/monthly stats
- Clean up old records

## 🛡️ Privacy & GDPR

### Data Collected

- User agent (browser info)
- Referrer (traffic source)
- Page load times
- Time on page
- IP address (if enabled)

### Compliance

- Anonymize IP addresses
- Implement data retention policies
- Provide opt-out mechanisms
- Document data usage in privacy policy

## 🚨 Troubleshooting

### Common Issues

1. **Migration Errors**: Ensure migrations run in order
2. **Permission Denied**: Check RLS policies
3. **No Data**: Verify tracking is enabled and working
4. **Performance Issues**: Check database indexes

### Debug Mode

Enable debug logging in the analytics hook:

```tsx
console.log('Tracking blog view:', analyticsData);
```

### Check Database

Verify tables exist and have data:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE '%blog%';

-- Check analytics data
SELECT * FROM blog_analytics LIMIT 5;
```

## 📚 Next Steps

1. **Enhanced Analytics**: Add more tracking metrics
2. **Real-time Dashboard**: Implement live updates
3. **Export Features**: Add CSV/PDF export
4. **Advanced Filtering**: Date ranges, traffic sources, etc.
5. **A/B Testing**: Compare post performance
6. **SEO Insights**: Correlate analytics with search rankings

## 🤝 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify database migrations ran successfully
3. Test with the provided test script
4. Check Supabase logs for database errors

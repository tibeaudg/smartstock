# Security Checklist for Developers

## Quick Reference Guide for StockFlow Security

### ✅ Authentication & Authorization

- [x] Passwords require minimum 12 characters
- [x] Passwords must contain uppercase, lowercase, numbers, and special characters
- [x] Admin access controlled by `is_owner` flag in database
- [x] Use `verifyAdminAccess()` utility for admin checks
- [x] Use `verifyBranchAccess()` for branch-level permissions

**Example:**
```typescript
import { verifyAdminAccess } from '@/utils/adminAuth';

const isAdmin = await verifyAdminAccess(user.id);
if (!isAdmin) {
  toast.error('Unauthorized access');
  return;
}
```

---

### ✅ Input Validation & Sanitization

- [x] Always validate email format with regex
- [x] Sanitize user input before database operations
- [x] Remove special characters from search queries
- [x] Limit string lengths to prevent buffer overflow

**Example:**
```typescript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return { error: 'Invalid email' };
}

// String sanitization
const sanitize = (str) => String(str).replace(/[<>]/g, '').trim();
const safeName = sanitize(name).substring(0, 100);
```

---

### ✅ File Upload Security

**For Images:**
```typescript
// Allowed types
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
if (!allowedTypes.includes(file.type)) {
  toast.error('Invalid image format');
  return;
}

// Size limit (5MB)
if (file.size > 5 * 1024 * 1024) {
  toast.error('File too large');
  return;
}

// Extension validation
const fileExt = file.name.split('.').pop()?.toLowerCase();
if (!fileExt || !['jpg', 'jpeg', 'png', 'webp'].includes(fileExt)) {
  toast.error('Invalid file extension');
  return;
}
```

**For Excel/Documents:**
```typescript
// Size limit (10MB for Excel)
if (file.size > 10 * 1024 * 1024) {
  toast.error('File too large');
  return;
}
```

---

### ✅ XSS Prevention

- [x] Use DOMPurify for rendering HTML content
- [x] Never use `dangerouslySetInnerHTML` without sanitization
- [x] Whitelist allowed HTML tags and attributes

**Example:**
```typescript
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(content, { 
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'a'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title']
  }) 
}} />
```

---

### ✅ SQL Injection Prevention

- [x] Use Supabase's query builder (parameterized queries)
- [x] Sanitize user input in filter conditions
- [x] Never concatenate user input directly into queries

**Example:**
```typescript
// Good - using query builder
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('branch_id', branchId)
  .ilike('name', `%${sanitizedQuery}%`);

// Sanitize search input
const sanitizedQuery = query.replace(/[%;\\]/g, '');
```

---

### ✅ API Security

- [x] Rate limiting enabled (10 requests/minute)
- [x] CORS configured with specific origins
- [x] Request payload size limited (1MB)
- [x] Method restrictions in place

**Dev Server Configuration:**
```javascript
// Already configured in server-dev.cjs
app.use(cors({
  origin: ['http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1mb' }));
```

---

### ✅ Database Security (RLS)

- [x] Row Level Security enabled on all tables
- [x] Users can only access their own data
- [x] Owners have elevated permissions
- [x] Branch-based access control

**Policy Example:**
```sql
-- Users can only see their own branches
CREATE POLICY "Users can view their own branches" ON branches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM branch_users 
      WHERE branch_users.branch_id = branches.id 
      AND branch_users.user_id = auth.uid()
    )
  );
```

---

## Security Testing Checklist

Before deploying, verify:

- [ ] All forms validate input
- [ ] File uploads check type, size, and extension
- [ ] Admin routes check authorization
- [ ] Rate limiting is working
- [ ] Error messages don't leak sensitive info
- [ ] HTTPS is enforced in production
- [ ] Environment variables are set
- [ ] Dependencies are up to date (`npm audit`)
- [ ] No console.log with sensitive data
- [ ] Session timeout is configured

---

## Common Security Mistakes to Avoid

### ❌ Don't Do This:

```typescript
// DON'T: Direct HTML rendering
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// DON'T: No input validation
await supabase.from('users').insert({ email: userEmail });

// DON'T: Client-side only auth checks
if (userRole === 'admin') { // Can be bypassed
  showAdminPanel();
}

// DON'T: String concatenation in queries
const query = `SELECT * FROM users WHERE name = '${userName}'`;
```

### ✅ Do This Instead:

```typescript
// DO: Sanitize HTML
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userInput) 
}} />

// DO: Validate input
if (!emailRegex.test(userEmail)) {
  throw new Error('Invalid email');
}
await supabase.from('users').insert({ email: userEmail });

// DO: Server-side auth checks
const isAdmin = await verifyAdminAccess(userId);
if (!isAdmin) {
  throw new Error('Unauthorized');
}

// DO: Use parameterized queries
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('name', userName);
```

---

## Emergency Response

If a security issue is discovered:

1. **Immediate:** Disable affected feature/endpoint
2. **Assess:** Determine scope and impact
3. **Fix:** Apply security patch
4. **Test:** Verify fix doesn't break functionality
5. **Deploy:** Push fix to production immediately
6. **Monitor:** Watch logs for exploitation attempts
7. **Document:** Update security documentation
8. **Notify:** Inform users if data was compromised

---

## Regular Security Maintenance

### Weekly:
- Review failed login attempts
- Check for unusual API activity
- Monitor error logs

### Monthly:
- Run `npm audit` and fix vulnerabilities
- Review and update dependencies
- Check for new security advisories

### Quarterly:
- Full security audit
- Penetration testing
- Review and update security policies
- Security training for team

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [CSP Generator](https://report-uri.com/home/generate)

---

**Last Updated:** October 7, 2025  
**Next Review:** January 7, 2026


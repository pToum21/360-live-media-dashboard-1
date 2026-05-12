# Authentication System

## Overview

The 360 Marketing Dashboard uses **NextAuth.js** for authentication with email-based "magic link" login. This provides secure, passwordless authentication for your team.

## How It Works

1. User enters their email address
2. System sends a magic link to their email
3. User clicks the link to sign in
4. Session is created and stored in the database

## Configuration

### Environment Variables

Required in `.env`:

```env
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"

# Email Configuration
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-password"
EMAIL_FROM="noreply@360livemedia.com"
```

### Email Provider Setup

For **development**, you can use:
- [Ethereal Email](https://ethereal.email/) - Free fake SMTP service for testing
- [Mailtrap](https://mailtrap.io/) - Email testing service

For **production**, you can use:
- Gmail SMTP (with app-specific password)
- SendGrid
- AWS SES
- Mailgun
- Postmark

#### Gmail Setup Example

1. Enable 2-factor authentication on your Google account
2. Generate an app-specific password: https://myaccount.google.com/apppasswords
3. Use these settings:

```env
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-specific-password"
EMAIL_FROM="your-email@gmail.com"
```

## User Roles

The system supports three role levels:

- **ADMIN** - Full access to all features and settings
- **MANAGER** - Can view all data and manage team content
- **MARKETER** - Can input and view data (default role)

Roles are assigned in the `User` model and can be managed through the database.

## Key Files

- `lib/auth.ts` - NextAuth configuration
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API route
- `components/auth/` - Auth-related components
  - `session-provider.tsx` - Session provider wrapper
  - `user-nav.tsx` - User navigation/profile dropdown
  - `sign-in-button.tsx` - Sign-in button
  - `sign-out-button.tsx` - Sign-out button
- `app/auth/signin/` - Sign-in page
- `app/auth/verify-request/` - Email sent confirmation page
- `app/auth/error/` - Error page

## Usage in Code

### Check Authentication Status

```typescript
import { useSession } from "next-auth/react"

export function MyComponent() {
  const { data: session, status } = useSession()
  
  if (status === "loading") {
    return <div>Loading...</div>
  }
  
  if (!session) {
    return <div>Please sign in</div>
  }
  
  return <div>Welcome, {session.user.name}!</div>
}
```

### Protect Server Components

```typescript
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/signin")
  }
  
  return <div>Protected content</div>
}
```

### Check User Role

```typescript
import { useSession } from "next-auth/react"

export function AdminPanel() {
  const { data: session } = useSession()
  
  if (session?.user.role !== "ADMIN") {
    return <div>Access denied</div>
  }
  
  return <div>Admin panel</div>
}
```

## Database Schema

NextAuth uses these tables:

- `User` - User accounts with email, name, role
- `Account` - OAuth provider accounts (if added later)
- `Session` - Active user sessions
- `VerificationToken` - Magic link tokens

## Security Best Practices

1. **Always use HTTPS in production** - Set `NEXTAUTH_URL` to your production domain
2. **Generate a strong secret** - Use `openssl rand -base64 32` to generate `NEXTAUTH_SECRET`
3. **Restrict email domains** - Consider adding email validation to only allow @360livemedia.com addresses
4. **Set session expiry** - Current: 30 days (configured in `lib/auth.ts`)
5. **Monitor failed login attempts** - Consider adding rate limiting

## Adding Team Members

To add a new team member:

1. Add their user record to the database:

```typescript
import { prisma } from "@/lib/prisma"

await prisma.user.create({
  data: {
    email: "newuser@360livemedia.com",
    name: "New User",
    role: "MARKETER",
  },
})
```

2. They'll receive a magic link when they try to sign in

## Troubleshooting

### "Configuration" Error
- Check that all environment variables are set
- Verify NEXTAUTH_SECRET is defined

### "Verification" Error
- Magic link expired (24h expiry)
- User needs to request a new link

### Email Not Sending
- Verify SMTP credentials
- Check spam folder
- Test with Ethereal/Mailtrap first

### Session Not Persisting
- Check database connection
- Verify `DATABASE_URL` is correct
- Ensure cookies are enabled in browser

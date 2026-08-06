# Spam Protection Implementation

This document outlines the comprehensive spam protection measures implemented across the website to prevent unwanted calls and emails.

## Overview

The website implements multiple layers of protection to prevent spam bots and scrapers from harvesting contact information while maintaining accessibility for legitimate users.

## Protection Measures

### 1. Contact Information Obfuscation

#### Email Protection
- **Base64 Encoding**: All email addresses are stored as base64-encoded strings
- **Client-Side Rendering**: Contact information only renders after user interaction
- **JavaScript Obfuscation**: Email addresses are built dynamically using JavaScript
- **Click-to-Reveal**: Users must click to reveal actual contact information

#### Phone Number Protection
- **Base64 Encoding**: Phone numbers are stored as base64-encoded strings
- **Formatted Display**: Numbers are displayed in a user-friendly format
- **Click-to-Reveal**: Users must click to reveal actual phone numbers
- **Obfuscated Schema**: Structured data uses partially obfuscated numbers

### 2. Component Implementation

#### ObfuscatedContact Component
Located at `components/ui/obfuscated-contact.tsx`

Features:
- Client-side only rendering with hydration delay
- Click-to-reveal functionality
- Multiple display variants (link, text)
- Icon support
- Automatic mailto/tel link generation

Usage:
```tsx
import { ObfuscatedEmail, ObfuscatedPhone } from "@/components/ui/obfuscated-contact";

// Email with icon
<ObfuscatedEmail showIcon={true} variant="link" />

// Phone number
<ObfuscatedPhone showIcon={false} variant="text" displayFormat={true} />
```

### 3. Utility Functions

#### Contact helpers
Exported from `components/ui/obfuscated-contact.tsx`:

- `getObfuscatedContactForSchema()` - Contact values for JSON-LD structured data
- `useContactInfo()` - Decoded contact values for a client component

### 4. Metadata Protection

#### Format Detection Disabled
```typescript
formatDetection: {
  email: false,
  address: false,
  telephone: false,
}
```

#### Obfuscated Schema Data
- JSON-LD structured data uses obfuscated contact information
- Prevents search engines from extracting real contact details
- Maintains SEO benefits while protecting privacy

### 5. Server-Side Protection

#### Email Sending
- Contact forms use server-side email sending
- Real email addresses only used in server-side operations
- No client-side exposure of actual email addresses

#### API Protection
- Rate limiting on contact forms
- CAPTCHA integration available
- Form validation and sanitization

## Implementation Details

### Base64 Encoded Values
```typescript
// byron@byronwade.com
const ENCODED_EMAIL = "Ynlyb25AYnlyb253YWRlLmNvbQ==";

// +18312958460
const ENCODED_PHONE = "KzE4MzEyOTU4NDYw";

// +1 (831) 295-8460
const ENCODED_PHONE_DISPLAY = "KzEgKDgzMSkgMjk1LTg0NjA=";
```

### Client-Side Rendering
```typescript
const ClientOnlyContact = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Add small delay to make it harder for bots
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  return <>{children}</>;
};
```

### Click-to-Reveal Functionality
```typescript
const [revealed, setRevealed] = useState(false);
const [email, setEmail] = useState("");

useEffect(() => {
  if (revealed) {
    const decoded = decode(ENCODED_EMAIL);
    setEmail(decoded);
  }
}, [revealed]);
```

## Where it is used

- `components/ui/obfuscated-contact.tsx` — the obfuscation components themselves
- `components/layout/footer.tsx` — footer email
- `app/contact/contact-client.tsx` — contact page email
- `app/metadata.config.ts` — `format-detection` disabled so mobile browsers do
  not auto-linkify the revealed values

## Benefits

### Spam Prevention
- Prevents automated scraping of contact information
- Reduces unwanted emails and calls
- Maintains legitimate user access

### SEO Compliance
- Structured data still provides search engine benefits
- Contact information available for legitimate users
- No negative impact on search rankings

### User Experience
- Clear indication when contact info is available
- Easy-to-use click-to-reveal functionality
- Maintains professional appearance

## Maintenance

### Adding New Contact Information
1. Encode the new contact info using base64
2. Update the encoded constants in `obfuscated-contact.tsx`
3. Test the obfuscation on both client and server side

### Updating Existing Contact Information
1. Generate new base64 encoded values
2. Update all encoded constants
3. Clear any cached values
4. Test the new implementation

### Monitoring
- Monitor contact form submissions for spam patterns
- Track legitimate vs. spam contact attempts
- Adjust obfuscation levels if needed

## Security Notes

- Base64 encoding provides basic obfuscation but is not encryption
- Determined attackers can still decode the information
- This implementation focuses on preventing automated scraping
- For higher security, consider additional measures like CAPTCHA or rate limiting

## Future Enhancements

- Implement CAPTCHA for contact forms
- Add rate limiting for contact form submissions
- Consider image-based contact information display
- Implement honeypot fields for additional bot detection

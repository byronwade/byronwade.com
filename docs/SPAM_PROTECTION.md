# Spam Protection Implementation

This document describes contact-address obfuscation and the contact form's
delivery boundary. These reduce specific abuse paths; they do not prevent all
spam or automated submissions.

## Overview

Click-to-reveal discourages simple address scrapers while keeping contact details
available to visitors. Server validation and a fixed email recipient protect the
delivery boundary separately.

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
- Automatic mailto/tel link generation

Usage:
```tsx
import { ObfuscatedEmail, ObfuscatedPhone } from "@/components/ui/obfuscated-contact";

// Email link
<ObfuscatedEmail variant="link" />

// Phone number
<ObfuscatedPhone variant="text" displayFormat={true} />
```

### 3. Utility Functions

#### Contact helpers
Canonical owners:

- `lib/contact.ts` owns `CONTACT_ENCODED`, `decodeContact()`, and
  `getContactForStructuredData()`.
- `hooks/use-revealed-email.ts` keeps decoded text out of prerendered HTML for
  existing client consumers. It reveals on mount, so use `ObfuscatedEmail` for
  contact links that must wait for a click.

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

#### Contact submission boundary
- Both forms submit name, email, topic, and the original message to `sendEmail`.
- Both forms share `hooks/use-contact-form.ts` for submission state and client
  feedback. The canonical validator identifies the first invalid field in form
  order; inline errors are associated with that field and focus moves there after
  rendering. Server validation still runs for every submission.
- Validation and delivery failures preserve the draft. The form keeps a persistent
  delivery status, and successful delivery does not erase edits made while sending.
- Provider requests have a ten-second deadline through headers and response-body
  consumption. Failure says that sending was not confirmed: cancellation cannot
  prove the provider rejected a message. Both forms leave the draft editable,
  restore submission, and never retry automatically.
- A lost Server Action response is also an unconfirmed send, even if the provider
  already accepted the request. The browser keeps the draft and retry identity;
  neither the persistent success status nor the success toast appears until the
  action acknowledgement reaches the form. An explicit retry of an unchanged
  draft reuses its identity; a changed normalized draft starts a new submission.
- Each submitted snapshot gets a browser-generated UUID, validated again by the
  server and passed as a `contact/`-scoped Resend idempotency key. Retrying the
  same normalized draft reuses the key. Changed drafts and a new send after
  confirmed success get new keys. Identity stays in the mounted form, without
  browser storage or a database; reloading or another form starts a new identity.
  Resend documents a [24-hour deduplication window](https://resend.com/docs/dashboard/emails/idempotency-keys).
  This limits duplicate retries within that window, not intentional new sends or
  inbox delivery. It is not a rate limit.
- The server validates unknown input, trims fields, enforces shared length limits,
  rejects control characters in names, validates a single email address, and
  accepts only the canonical contact topics in `lib/contact-form.ts`.
- Email bodies are plain text. Visitor HTML is delivered literally, with no HTML
  interpolation, uploaded attachments, or caller-controlled recipient override.
- Each valid submission sends one plain-text email to the owner address from
  `lib/contact.ts`. The visitor's address is used only as Reply-To; caller-supplied
  recipient, CC, BCC, sender, and attachment fields are ignored.
- No automatic email receipt is sent to the submitted address. The action cannot
  verify that the visitor owns it, so echoing their content there would let anyone
  relay unwanted messages from this site's domain. Success is acknowledged on the
  page only after the provider accepts the owner's message. Acknowledgement does
  not guarantee inbox delivery.
- Provider responses and exception details remain on the server; the caller gets
  only success or an actionable, generic error.
- `npm test` exercises the actual server action with a fixture transport. It
  cannot send real email. There is no added test dependency.
- `tests/contact-delivery.test.mjs` also exercises the installed Resend SDK and
  native fetch against a loopback server, including stalled headers and streamed
  JSON, cancellation and retry headers. [Resend 4.8 forwards fetch options](https://github.com/resend/resend-node/blob/v4.8.0/src/resend.ts) despite
  omitting `signal` from its request-options declaration; the action types both
  contracts without a cast. `tests/rendered/contact-delivery.test.mjs` protects
  both forms' ten-second recovery, retained edits, keyboard retry and identity
  rotation in light/dark at phone/desktop widths. It also pauses the real action
  response after loopback provider acceptance, verifies pending feedback without
  success, then interrupts that response to exercise the browser transport
  failure and explicit retry. These fixtures cannot verify the live provider's
  deduplication or inbox behavior, or recovery across reloads and separate forms.
- The browser audit uses an owned loopback Resend base URL and a synthetic
  credential to check success feedback and notification lifecycle without live
  delivery. It does not verify inbox delivery or the provider integration.
- Regression tests assert exactly one owner-addressed delivery, including repeated
  submissions with different visitor addresses and forged delivery fields.
- Rate limiting and CAPTCHA are not implemented. Input validation and address
  obfuscation do not prevent automated submissions or flooding the owner's inbox.

#### Remaining abuse controls

The fixed-recipient boundary removes the third-party email-relay path without
adding an interaction or a service. It does not impose a sending quota.

- A process-local counter is insufficient for a durable limit on Vercel: separate
  instances and cold starts do not share that counter. A future limit needs a
  shared store or a platform rule, with an explicit quota, retention policy, and
  false-positive/recovery behavior.
- CAPTCHA needs server-side verification and production configuration, plus an
  accessible fallback. It is deferred until the owner authorizes that setup.
- A honeypot can be bypassed and can catch autofill. It is not a replacement for
  recipient confinement or a distributed sending limit.

OWASP identifies [form-to-email abuse that reaches unintended recipients](https://owasp.github.io/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-017_Spamming.html)
as an implementation flaw. Its [bot-management guidance](https://cheatsheetseries.owasp.org/cheatsheets/Bot_Management_and_Anti-Automation_Cheat_Sheet.html)
describes layered controls and the need to account for legitimate users.

## Implementation Details

### Base64 Encoded Values

`lib/contact.ts` is the only owner of the encoded values. Import its constants
and decoder rather than copying contact values into another module or example.

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

- `lib/contact.ts`. the encoded values, the decoder, and the role address used
  in structured data. **The only place the address may be written.**
- `hooks/use-revealed-email.ts`. client-only accessor; returns "" until mount,
  so the address never reaches prerendered HTML
- `components/ui/obfuscated-contact.tsx`. the click-to-reveal components
- `components/layout/footer.tsx`, `app/contact/contact-client.tsx`,
  `app/resume/resume-actions.tsx`, `components/home/`, consumers
- `app/metadata.config.ts`. `format-detection` disabled so mobile browsers do
  not auto-linkify the revealed values

### Verifying it still holds

Obfuscation is only real if the built output is clean. After changing anything
that touches contact details:

```bash
npm run build
grep -r "byron@byronwade.com" .next/static      # client bundle, must be empty
grep -rl "byron@byronwade.com" .next/server/app --include=*.html   # must be empty
```

Both were failing before this check existed: `lib/seo.ts` published the address
in JSON-LD, the resume page and the homepage hover card rendered it as text, and
a project Markdown file printed it in prose.

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
2. Update the canonical encoded constants in `lib/contact.ts`
3. Test the obfuscation on both client and server side

### Updating Existing Contact Information
1. Generate new base64 encoded values
2. Update the canonical encoded constants in `lib/contact.ts`
3. Clear any cached values
4. Test the new implementation

### Monitoring
- Monitor contact form submissions for spam patterns
- Track legitimate vs: spam contact attempts
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

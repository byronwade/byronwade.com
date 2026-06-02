# RTF - Read The Fucking Manual

## Command Purpose
Force Claude to review core project documentation and ensure strict alignment with established principles before proceeding with ANY development work.

## Mandatory Review Process

### 1. CLAUDE.md Core Principles Review
**PRODUCTION APPLICATION FOCUS**
- ✅ Building real business features only (no demos/tests/examples)
- ✅ Every feature provides clear business or user value
- ✅ Production-ready code from day one

**SHADCN ULTRATHINK Design System**
- ✅ Using only shadcn/ui components and patterns
- ✅ Minimalistic design: `border-0`, `bg-muted/20`, `bg-muted/30`
- ✅ Ultra-compact sizing: h-8 buttons, p-3/p-4 cards, w-64 sidebar
- ✅ No custom styling - shadcn variants and Tailwind only

**ANTI-DUPLICATION ULTRATHINK**
- ✅ MAXIMUM ONE COMPONENT PER TYPE
- ✅ ONE header (DashboardHeader), ONE sidebar (SidebarDrill)
- ✅ Search before create - audit existing components first
- ✅ Aggressively delete unused component variants

**MOBILE-FIRST APP EXPERIENCE**
- ✅ Design for mobile, enhance for desktop
- ✅ Touch-optimized interactions (44px minimum)
- ✅ App-like experience with smooth animations
- ✅ Responsive breakpoints in order: mobile → tablet → desktop

**SPEED OVER EVERYTHING**
- ✅ Bundle size < 150KB gzipped
- ✅ Component-level loading only (stateful buttons, skeleton)
- ✅ NEVER full-page loading screens
- ✅ Instant route transitions with skeleton content

**PLAYWRIGHT TESTING ONLY**
- ✅ Headless mode continuous monitoring
- ✅ NO test/demo/example routes
- ✅ Real production route testing only
- ✅ Performance validation (LCP < 2.5s, CLS < 0.1)

### 2. features.md Feature Alignment Check
Review `features.md` to ensure:
- ✅ All planned features align with business goals
- ✅ Feature complexity matches available shadcn components
- ✅ Mobile-first design considerations documented
- ✅ Performance implications assessed
- ✅ Anti-duplication rules applied to feature planning

### 3. Technology Stack Compliance
- ✅ Next.js 15.5.4 with App Router
- ✅ React 19 + TypeScript strict mode
- ✅ Bun runtime (not npm/yarn)
- ✅ shadcn/ui "New York" style
- ✅ Tailwind CSS v4
- ✅ Turbopack for dev/build

### 4. Forbidden Patterns
**NEVER CREATE:**
- ❌ `/demo`, `/test`, `/example` routes
- ❌ Multiple header/sidebar/navigation components
- ❌ Component names ending in `-v2`, `-new`, `-alt`
- ❌ Custom CSS styling outside shadcn
- ❌ `Dialog`, `AlertDialog`, `Tabs` components
- ❌ Full-page loading screens
- ❌ Demo or placeholder content

### 5. Mandatory Checks Before Development

**Component Creation:**
1. Run `Glob "components/**/*{header,sidebar,nav,layout}*"`
2. Check all layout files (`Glob "**/layout.tsx"`)
3. If similar exists, EXTEND instead of create
4. If duplicates exist, CONSOLIDATE immediately

**Feature Development:**
1. Verify business value and user need
2. Confirm mobile-first design approach
3. Plan component-level loading states
4. Design with shadcn components only
5. Consider performance impact

**Testing Strategy:**
1. Playwright headless mode only
2. Test real production routes
3. Validate Core Web Vitals
4. Mobile device compatibility

## RTF Command Usage

When invoked, this command requires Claude to:

1. **STOP** current development
2. **READ** CLAUDE.md and features.md completely
3. **VERIFY** current task aligns with ALL principles
4. **CONFIRM** no anti-patterns are being introduced
5. **PROCEED** only if 100% compliant

## Violation Response

If ANY principle violation is detected:
- **HALT** development immediately
- **REPORT** specific violations found
- **PROPOSE** compliant alternative approach
- **REQUEST** user confirmation before proceeding

## Success Criteria

✅ **All core principles reviewed and confirmed**
✅ **Current task aligns with production app focus**
✅ **No duplication or anti-patterns detected**
✅ **Mobile-first and speed optimizations planned**
✅ **shadcn/ui design system compliance verified**

---

**Remember: This is a PRODUCTION APPLICATION - every decision must serve real users and business value.**
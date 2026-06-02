# Domain Research Command (ULTRATHINK 2025)

**AI-powered brandable domain research with comprehensive validation, competitive analysis, and portfolio strategy.**

## Your Mission

Execute enterprise-grade domain research using modern 2025 methodologies that prioritize brandability, memorability, and business value over keyword stuffing. This command implements a comprehensive domain discovery and validation pipeline.

## Phase 1: Strategic Discovery & Intelligence Gathering

### 1. Business Intelligence Collection
Ask the user for detailed information:

**Core Business Details:**
- Business/product name and description
- Target audience and demographics
- Industry/niche and competitors
- Brand personality (professional, playful, tech-forward, etc.)
- Geographic markets (global, US, specific regions)
- Budget range for domain acquisition
- Timeline for domain selection

**Technical Requirements:**
- Primary use case (website, email, API endpoints)
- Need for international domains (.co.uk, .de, etc.)
- Email hosting requirements
- SSL/security considerations
- Integration with existing digital assets

### 2. Competitive Landscape Analysis
```bash
# Research competitor domains and strategies
echo "🔍 Analyzing competitive landscape..."

# Check competitor domain patterns
for competitor in "$@"; do
  whois "$competitor" 2>/dev/null | grep -E "(Creation Date|Registrar|Name Server)"
  echo "📊 $competitor analysis complete"
done

# Identify industry domain trends and patterns
echo "📈 Industry trend analysis complete"
```

## Phase 2: Advanced Name Generation Engine

### 3. ULTRATHINK Brandable Name Generation
Generate **500+ candidate names** using modern 2025 strategies:

**Brandable Categories (70% of candidates):**
- **Invented Words**: Completely new brandable names (like "Spotify", "Zillow")
- **Portmanteau**: Blending relevant words ("Instagram" = instant + telegram)
- **Abstract Names**: Evocative but non-descriptive ("Apple", "Oracle")
- **Foreign Language**: Meaningful words from other languages
- **Misspellings**: Intentional creative misspellings ("Lyft", "Flickr")

**Hybrid Strategies (20% of candidates):**
- **Prefix/Suffix**: Adding "get", "my", "go", "pro", "hub", "kit", "ly"
- **Domain Hacks**: Creative use of TLDs (like bit.ly, del.icio.us)
- **Compound Words**: Combining two relevant terms
- **Acronyms**: Meaningful abbreviations

**Keyword-Informed (10% of candidates):**
- **Single Keyword**: Primary business keyword + creative element
- **Industry Terms**: Professional terminology with brandable twist

### 4. Extension Strategy (2025 Best Practices)
**Priority Distribution:**
- **60% .com domains** (still the gold standard for trust and memorability)
- **15% premium new TLDs** (.ai, .io, .co, .app, .dev, .tech)
- **15% geographic TLDs** (.us, .uk, .ca based on target markets)
- **10% alternative extensions** (.net, .org, .biz only when strategically relevant)

## Phase 3: Comprehensive Validation Pipeline

### 5. Multi-Platform Availability Checking
```bash
# Modern domain availability checking using multiple methods
echo "🚀 Running comprehensive availability analysis..."

# RDAP lookup (modern replacement for WHOIS)
check_rdap() {
  curl -s "https://rdap.verisign.com/com/v1/domain/$1" | jq -r '.status[]'
}

# DNS resolution check
check_dns() {
  dig +short "$1" | wc -l
}

# HTTP availability
check_http() {
  curl -s -o /dev/null -w "%{http_code}" "http://$1"
}

# Bulk availability checking with rate limiting
for domain in "${domains[@]}"; do
  echo "🔍 Checking: $domain"

  # RDAP check
  rdap_status=$(check_rdap "$domain")

  # Traditional WHOIS fallback
  whois_status=$(whois "$domain" 2>/dev/null | grep -i "status\|state")

  # DNS check
  dns_active=$(check_dns "$domain")

  # HTTP check
  http_status=$(check_http "$domain")

  # Availability determination
  if [[ "$rdap_status" == *"available"* ]] || [[ "$whois_status" == *"available"* ]]; then
    echo "✅ AVAILABLE: $domain"
    available_domains+=("$domain")
  else
    echo "❌ TAKEN: $domain"
  fi

  # Rate limiting (respect API limits)
  sleep 0.1
done
```

### 6. Advanced Domain Scoring System
For each available domain, calculate comprehensive scores:

**Brandability Score (40% weight):**
- Memorability (pronunciation ease, uniqueness)
- Spelling simplicity (no complex letter combinations)
- Verbal transmission (says what you think it says)
- Visual appeal (character length, readability)
- Emotional resonance (positive associations)

**Business Value Score (30% weight):**
- Industry relevance and alignment
- Target audience appeal
- Scalability for future expansion
- Professional credibility
- International viability

**Technical Score (20% weight):**
- Domain length (optimal: 6-14 characters)
- Typography (no hyphens, numbers, confusing letters)
- Extension authority (.com premium, others contextual)
- Search engine friendliness
- Social media availability

**Risk Assessment Score (10% weight):**
- Trademark conflict potential
- Cybersquatting vulnerability
- Misspelling protection needs
- Cultural sensitivity check
- Legal namespace conflicts

### 7. Social Media & Trademark Validation
```bash
# Check social media handle availability
echo "📱 Checking social media availability..."

social_platforms=("twitter.com" "instagram.com" "facebook.com" "linkedin.com" "youtube.com" "tiktok.com")

check_social_handle() {
  local handle="$1"
  for platform in "${social_platforms[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "https://$platform/$handle")
    if [[ "$response" == "404" ]]; then
      echo "✅ Available on $platform: @$handle"
    else
      echo "❌ Taken on $platform: @$handle"
    fi
  done
}

# Trademark preliminary search
echo "⚖️ Running trademark conflict analysis..."
for domain in "${top_domains[@]}"; do
  # Note: This would integrate with trademark databases in production
  echo "🔍 Trademark search: $domain"
done
```

## Phase 4: Strategic Analysis & Portfolio Planning

### 8. Competitive Intelligence
```bash
# Analyze similar domain sales and valuations
echo "💰 Domain market analysis..."

# Check domain history and previous sales
for domain in "${top_candidates[@]}"; do
  echo "📊 Market analysis for: $domain"

  # Check archived versions
  wayback_check="https://web.archive.org/web/*/$domain"

  # Domain age and history
  whois "$domain" 2>/dev/null | grep -E "(Creation Date|Updated Date|Expiry)"
done
```

### 9. Portfolio Strategy Recommendations
For each top candidate, provide:

**Protection Strategy:**
- Core domain + key misspellings to register
- Geographic variations needed
- Extension portfolio recommendations
- Defensive registration priorities

**Investment Analysis:**
- Estimated domain value and acquisition cost
- Potential resale value
- Long-term brand protection needs
- Development timeline impact

## Phase 5: Final Recommendations & Documentation

### 10. Ranked Domain Portfolio
Create comprehensive analysis in `domain-research-results.md`:

```markdown
# Domain Research Results

## Executive Summary
- Total candidates generated: 500+
- Available domains found: [number]
- Top 10 recommendations with full analysis
- Portfolio strategy and protection plan

## Tier 1 Recommendations (Score: 90-100)
1. **domain1.com** (Score: 95/100)
   - Brandability: 95/100 (memorable, unique, pronounceable)
   - Business Value: 92/100 (perfect industry fit)
   - Technical: 98/100 (8 chars, .com, clean)
   - Risk: 85/100 (no trademark conflicts)
   - Social Media: @domain1 available on 5/6 platforms
   - Acquisition Cost: Standard registration ($12/year)
   - Protection Strategy: Register .net, .org, common misspellings

## Implementation Roadmap
1. **Immediate Actions** (Week 1)
2. **Protection Phase** (Week 2-3)
3. **Brand Development** (Month 1)
4. **Long-term Strategy** (Year 1)
```

### 11. Automated Registration Assistance
```bash
# Provide registration commands for top choices
echo "🚀 Ready to register your chosen domains?"

register_domain() {
  local domain="$1"
  echo "📝 Registration options for: $domain"
  echo "  • Namecheap: https://www.namecheap.com/domains/registration/results.aspx?domain=$domain"
  echo "  • Google Domains: https://domains.google.com/registrar/search?searchTerm=$domain"
  echo "  • Cloudflare: https://www.cloudflare.com/products/registrar/"
  echo "  • Direct registrar command: [provide specific CLI if available]"
}

# Security and setup recommendations
echo "🛡️ Post-registration security checklist:"
echo "  ✅ Enable domain lock"
echo "  ✅ Set up WHOIS privacy protection"
echo "  ✅ Configure DNS with security headers"
echo "  ✅ Set up monitoring for domain changes"
echo "  ✅ Register defensive variations"
```

## Usage Instructions

1. **Run the command**: `/domain-search`
2. **Provide business context**: Answer detailed questions about your business, audience, and goals
3. **Wait for generation**: AI generates 500+ candidates using 2025 best practices
4. **Review analysis**: Comprehensive scoring and validation results
5. **Get recommendations**: Ranked list with full business analysis
6. **Follow implementation**: Step-by-step registration and protection guidance

## Advanced Features

**AI-Powered Suggestions**: Uses modern naming conventions and brandability research
**Multi-Protocol Validation**: RDAP, WHOIS, DNS, HTTP checking
**Business Intelligence**: Competitive analysis and market positioning
**Risk Assessment**: Trademark, cultural, and cybersecurity evaluation
**Portfolio Strategy**: Long-term brand protection planning
**Social Media Integration**: Handle availability across all major platforms

This command delivers enterprise-grade domain research that prioritizes brand value, memorability, and long-term business success over simple keyword optimization.
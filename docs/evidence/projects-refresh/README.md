# Projects refresh evidence

The index contains nine current projects and fifteen earlier projects. All fifteen
earlier bodies and non-grouping frontmatter match baseline `38261e9`.

- `content-evidence.json`: content preservation, grouping, dates, TODOs, and all
  twenty-four generated detail routes.
- `rendered-evidence.json`: viewport/theme observations, route headings and dates,
  exact index links, keyboard navigation, disclosure focus return, and contact reveal.
- `performance-evidence.json`: initial Lighthouse diagnostics, final integrated
  `/projects` performance/accessibility audit, and manual budget comparisons. Initial performance
  measurements predate main's portfolio boundary fix; they are not a measurement
  of the final combined bundle, a performance baseline, or a budget pass.
- `contact-contrast-evidence.json`: both contact forms in light/dark, rendered
  empty-form errors and the existing success-role color before submission. WCAG
  contrast is calculated from browser-resolved colors and ancestor backgrounds;
  zero POST requests. This does not claim successful email delivery.
- `verification-evidence.json`: exact local commands and exit results, with the
  preceding verification run retained separately from the integrated head.
- `contact-scan-evidence.json`: raw owner contact scans of client assets and
  prerendered HTML. Revealed contact details are never included in this evidence.

Screenshots cover `/projects` and `/projects/movies` at desktop 1440 × 1000 and
mobile 390 × 844, in light and dark themes. Contact details were not revealed in
the screenshots. Additional layout observations cover widths 320, 768, and 2560.

All twenty-four detail routes were checked for HTTP success and their expected
server-rendered heading/date. Interactive checks cover the index and Movies page;
this is not an assertion of device testing on every detail route.

The public factual sources and unknowns are recorded in
[`docs/PROJECT_SOURCES.md`](../../PROJECT_SOURCES.md). Six project descriptions
remain deliberately conservative pending Byron's frontmatter TODOs.

PR #53 integration: refreshed evidence is pinned to application source `94a3ff7`,
which merges main `c48f332` (#54). `integration-preservation.json` additionally
asserts main ancestry, byte-identical preservation of all 24 pre-merge project
files, and unchanged canonical date helpers and regressions from main.

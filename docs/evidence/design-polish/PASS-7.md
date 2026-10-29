# Design polish pass 7

Implementation from main `ac6a54e`. The space theme, published routes, all
authored content, and case-study articles remain. No shop, workflow, settings,
dependency, font, or shared-layout behavior is added.

## Decisions and ownership

1. **One exposure behind reading.** The Deep Field photograph uses the same
   quieter exposure across all widths and the desktop gutters. Before, rendered
   mobile home byline text fell to 4.384:1 against a galaxy; desktop article
   outline links also failed over brighter gutters, including 2.665:1 on the
   content-management project. The minimum required is 4.5:1. The image remains
   real astronomy with its baked fade and credit. One 10,696-byte band replaces
   the 15,296-byte wide and 15,792-byte narrow exposures; the obsolete derived
   asset and responsive branch are removed together. Daylight stays a
   deliberate cool canvas with the same planet, horizon, materials, and ink
   hierarchy; it does not download the dark photograph.
2. **The horizon ends the page.** DeepField is bounded by its parent layout,
   with the existing maximum height. Before, the 1395px absolute band extended
   235px beyond a short mobile search layout. No fixed backdrop or new stacking
   context is added. The home flight rail becomes a pseudo-element so the
   ordered list contains only its four real stages.
3. **Writing keeps one grammar.** TopicNav uses the canonical neutral hover
   and press fill, retaining selected state and native links. Index rows use
   the same press fill. PostPager titles use PostRow's 16px heading role and
   line height. Chronology, older/newer positions, and every topic remain.
4. **Recovery copy is content.** The preview fallback's explanation uses the
   14px body role and its title uses the 16px heading role. Group spacing is
   12px around the existing 4px inner gap. Button, reserved image geometry,
   honest failure/off states, and direct visit/retry behavior remain.
   The redundant broken-image glyph and its now-unused slot/export are removed:
   the title already names the state, and the smaller block leaves room for
   readable copy without growing the pending frame. The unchanged layout-shift
   regression exposed this during verification; its limit is not relaxed.
   ErrorNotice keeps its native recovery button and full-navigation exit,
   pretty-wraps its description, and allows long references to reflow.

Reused: DeepField, Orbit, the image generator, TopicNav, PostPager, PostRow's
type role, index-row recipes, Button, ErrorNotice, and existing browser helpers.
No new primitive or runtime abstraction. Opaque panels over the photograph
were rejected: correcting its exposure preserves the theme and reading surface
without wrapping every region. No new motion passes a purpose gate; existing
orbit/reduced-motion behavior remains.

## Craft audit and evidence boundaries

| Surface | Decision |
| --- | --- |
| Home | Quieter mobile sky; claim and proof remain dominant; four-stage list semantics |
| Projects | Shared press feedback and quiet reading sky; all projects retained |
| Thorbis Design and byronwade/ui | Readable preview recovery; title/story/caption alignment retained |
| Portfolio | Existing signal rows and recovery retained; shared sky and press feedback |
| Figma detail | Existing sheet, controls, and reading measure retained; local API fixture |
| Writing index and Product engineering topic | Shared topic feedback and chronology; no new filter system |
| Building Thorbis and design-system posts | Same prose and pager; post-end topic feedback and heading rhythm |
| Resume | Existing two-speed record and print behavior retained; quiet sky |
| Contact | Existing focused form, labels, fields, validation, and reveal retained |
| Search, results, and no matches | Existing GET state and index; sky ends inside the layout |
| Privacy and terms | Reading hierarchy retained; quieter sky behind legal text |
| 404 | Existing recovery and planet retained; bounded sky |
| Failed-page recovery | Existing ErrorNotice with readable description and wrapping reference |

The existing full-route audit is extended to derive every published topic URL
from the prerender manifest; otherwise it rejects the new dynamic template
before opening a browser. Its other checks and limits remain intact.

`tests/rendered/sky-contrast.test.mjs` samples the rendered backgrounds under
every visible text line in the first 1500px on home, a project detail and an
article with a gutter outline at 390/1440 in both themes. It retains computed
ink/opacity, hides only glyph
paint, then checks every pixel beneath each line at the stricter 4.5:1 threshold,
including headings. Text geometry is clipped to its actual overflow ancestors,
so an ellipsized breadcrumb's hidden tail cannot sample an adjacent control.
A browser control checks both clipped healthy text and a deliberately bad
visible background. It requires the photograph to have loaded in dark
mode and to be hidden in light mode. A second check bounds the sky within a
short search layout. Both defects reproduced before the implementation.

Screenshots live at
`C:/Users/bcw19/agent-tools/screens/redesign-1028a/{before,after}/`.
The matrix includes every requested example at 390 and 1440 in both themes,
with `overflow-report.json` and `capture-config.json`. Phone captures use
Playwright `devices['iPhone 13']`: WebKit, mobile layout, touch, and DPR 3.
Full-page PNGs use CSS-pixel scale to keep long articles within WebKit's image
dimension limit. Separate 320/360 probes use the same mobile settings.

Repository and Figma data are stable loopback API fixtures, not live-provider
proof. Project screenshots exercise the runtime off state; successful/error
captures and resizing use existing rendered fixtures. Failed-page screenshots
render the real ErrorNotice with a synthetic digest in the real shell; they do
not claim an induced production exception. Native recovery regressions protect
the actual retry/reload callbacks.

None of the seven published posts contains a fenced code block. The two real
posts are preserved and captured; an additional `code-specimen` capture inserts
a visibly labeled local sample through the actual Markdown renderer into the
design-system post. It verifies framing/reflow without editing the article or
presenting the sample as authored content.

References: live [Thorbis Design](https://design.thorbis.com), the read-only
`D:/Dev/thorbis-design` source, and the adopted port map. Mobbin
[Dribbble profile](https://mobbin.com/screens/07f891a5-8aaa-4bb9-aca3-af276534844c)
and [Polywork profile](https://mobbin.com/screens/9843492f-7374-48b2-ac67-6aa526ec10ef)
supplied ideas about identity beside evidence. Their large portraits, colour
fields, and oversized display typography were rejected in favor of Thorbis's
existing reading measure and hierarchy.

## Verification

Final local gates, visual inspection, paired performance measurements and PR
review outcomes will be recorded here after they complete. No physical iPhone,
screen-reader, Low Power Mode, or APCA result is inferred from browser evidence.

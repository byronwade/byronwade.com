import type { Icon, IconProps, IconWeight } from "@phosphor-icons/react/dist/lib/types";
import { ArrowClockwise } from "@phosphor-icons/react/dist/ssr/ArrowClockwise";
import { ArrowElbowDownLeft } from "@phosphor-icons/react/dist/ssr/ArrowElbowDownLeft";
import { ArrowLeft as PhArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRight as PhArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr/ArrowSquareOut";
import { ArrowsClockwise } from "@phosphor-icons/react/dist/ssr/ArrowsClockwise";
import { ArrowUpRight as PhArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr/CalendarBlank";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr/CaretLeft";
import { CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";
import { ChartBar } from "@phosphor-icons/react/dist/ssr/ChartBar";
import { Check as PhCheck } from "@phosphor-icons/react/dist/ssr/Check";
import { CheckCircle as PhCheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { Clock as PhClock } from "@phosphor-icons/react/dist/ssr/Clock";
import { Copy as PhCopy } from "@phosphor-icons/react/dist/ssr/Copy";
import { CornersIn } from "@phosphor-icons/react/dist/ssr/CornersIn";
import { CornersOut } from "@phosphor-icons/react/dist/ssr/CornersOut";
import { Cube } from "@phosphor-icons/react/dist/ssr/Cube";
import { DeviceMobile } from "@phosphor-icons/react/dist/ssr/DeviceMobile";
import { DeviceTablet } from "@phosphor-icons/react/dist/ssr/DeviceTablet";
import { DotsSixVertical } from "@phosphor-icons/react/dist/ssr/DotsSixVertical";
import { DotsThree } from "@phosphor-icons/react/dist/ssr/DotsThree";
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr/DownloadSimple";
import { Envelope } from "@phosphor-icons/react/dist/ssr/Envelope";
import { FileText as PhFileText } from "@phosphor-icons/react/dist/ssr/FileText";
import { GitBranch as PhGitBranch } from "@phosphor-icons/react/dist/ssr/GitBranch";
import { GitFork as PhGitFork } from "@phosphor-icons/react/dist/ssr/GitFork";
import { GithubLogo } from "@phosphor-icons/react/dist/ssr/GithubLogo";
import { Globe as PhGlobe } from "@phosphor-icons/react/dist/ssr/Globe";
import { Hash as PhHash } from "@phosphor-icons/react/dist/ssr/Hash";
import { Heart as PhHeart } from "@phosphor-icons/react/dist/ssr/Heart";
import { House } from "@phosphor-icons/react/dist/ssr/House";
import { Image as PhImage } from "@phosphor-icons/react/dist/ssr/Image";
import { Info } from "@phosphor-icons/react/dist/ssr/Info";
import { Laptop as PhLaptop } from "@phosphor-icons/react/dist/ssr/Laptop";
import { Lightning } from "@phosphor-icons/react/dist/ssr/Lightning";
import { LinkedinLogo } from "@phosphor-icons/react/dist/ssr/LinkedinLogo";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { MapPin as PhMapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import { Monitor as PhMonitor } from "@phosphor-icons/react/dist/ssr/Monitor";
import { Moon as PhMoon } from "@phosphor-icons/react/dist/ssr/Moon";
import { Palette as PhPalette } from "@phosphor-icons/react/dist/ssr/Palette";
import { PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr/PaperPlaneTilt";
import { PencilSimpleLine } from "@phosphor-icons/react/dist/ssr/PencilSimpleLine";
import { Phone as PhPhone } from "@phosphor-icons/react/dist/ssr/Phone";
import { ShareNetwork } from "@phosphor-icons/react/dist/ssr/ShareNetwork";
import { Sparkle as PhSparkle } from "@phosphor-icons/react/dist/ssr/Sparkle";
import { SpinnerGap } from "@phosphor-icons/react/dist/ssr/SpinnerGap";
import { SquaresFour } from "@phosphor-icons/react/dist/ssr/SquaresFour";
import { Stack } from "@phosphor-icons/react/dist/ssr/Stack";
import { Star as PhStar } from "@phosphor-icons/react/dist/ssr/Star";
import { Sun as PhSun } from "@phosphor-icons/react/dist/ssr/Sun";
import { Warning } from "@phosphor-icons/react/dist/ssr/Warning";
import { X as PhX } from "@phosphor-icons/react/dist/ssr/X";
import { XCircle } from "@phosphor-icons/react/dist/ssr/XCircle";
import { XLogo } from "@phosphor-icons/react/dist/ssr/XLogo";

/**
 * The site's icon family: Phosphor, duotone.
 *
 * One family, one weight, one import path. DESIGN.md §5.6 requires a single
 * family; this file is what makes that enforceable, because nothing outside it
 * imports an icon package directly.
 *
 * Why duotone. A duotone glyph renders two paths: the outline in `currentColor`
 * and a fill of the same colour at 20% opacity. That gives every icon a second
 * tone for free, and because both layers inherit `currentColor`, tinting an
 * icon still needs exactly one class. It is warmth that costs nothing and
 * cannot drift out of step with the palette.
 *
 * Why the SSR entry. `@phosphor-icons/react/dist/ssr` ships components with no
 * `"use client"` boundary, so icons stay in Server Components. The default
 * entry point would pull every icon site into the client bundle.
 *
 * Names are kept as the codebase already used them so a call site changes its
 * import and nothing else. Where Phosphor's own name differs it is listed
 * below, and that mapping lives only here.
 */

/**
 * Binds a weight to a glyph while leaving it overridable. `weight` comes before
 * the spread on purpose: a call site that genuinely needs a solid or regular
 * glyph can still pass one.
 *
 * Every export goes through here, including the brand marks, so all of them
 * carry a `displayName`. Anonymous arrow components show up as `<Unknown>` in
 * React DevTools and in component stacks, which is miserable when an icon is
 * the thing rendering wrong.
 */
function withWeight(Base: Icon, weight: IconWeight, name: string) {
	const Wrapped = (props: IconProps) => <Base weight={weight} {...props} />;
	Wrapped.displayName = name;
	return Wrapped;
}

/** The family default. */
function duotone(Base: Icon, name: string) {
	return withWeight(Base, "duotone", name);
}

/** The type an icon-taking prop should use. Replaces lucide's `LucideIcon`. */
export type IconComponent = (props: IconProps) => React.JSX.Element;

// Navigation and direction
export const ArrowLeft = /* @__PURE__ */ duotone(PhArrowLeft, "ArrowLeft");
export const ArrowRight = /* @__PURE__ */ duotone(PhArrowRight, "ArrowRight");
export const ArrowUpRight = /* @__PURE__ */ duotone(PhArrowUpRight, "ArrowUpRight");
export const ChevronLeft = /* @__PURE__ */ duotone(CaretLeft, "ChevronLeft");
export const CornerDownLeft = /* @__PURE__ */ duotone(ArrowElbowDownLeft, "CornerDownLeft");
export const ExternalLink = /* @__PURE__ */ duotone(ArrowSquareOut, "ExternalLink");
export const Home = /* @__PURE__ */ duotone(House, "Home");
export const MoreHorizontal = /* @__PURE__ */ duotone(DotsThree, "MoreHorizontal");

// Actions
export const Check = /* @__PURE__ */ duotone(PhCheck, "Check");
export const Copy = /* @__PURE__ */ duotone(PhCopy, "Copy");
export const Download = /* @__PURE__ */ duotone(DownloadSimple, "Download");
export const RefreshCw = /* @__PURE__ */ duotone(ArrowsClockwise, "RefreshCw");
export const Search = /* @__PURE__ */ duotone(MagnifyingGlass, "Search");
export const Send = /* @__PURE__ */ duotone(PaperPlaneTilt, "Send");
export const Share2 = /* @__PURE__ */ duotone(ShareNetwork, "Share2");
export const X = /* @__PURE__ */ duotone(PhX, "X");

// Status and feedback
export const AlertTriangle = /* @__PURE__ */ duotone(Warning, "AlertTriangle");
export const CheckCircle = /* @__PURE__ */ duotone(PhCheckCircle, "CheckCircle");
export const Loader2 = /* @__PURE__ */ duotone(SpinnerGap, "Loader2");
export const Sparkle = /* @__PURE__ */ duotone(PhSparkle, "Sparkle");
export const Star = /* @__PURE__ */ duotone(PhStar, "Star");

// Objects and content
export const Box = /* @__PURE__ */ duotone(Cube, "Box");
export const Clock = /* @__PURE__ */ duotone(PhClock, "Clock");
export const FileText = /* @__PURE__ */ duotone(PhFileText, "FileText");
export const GitFork = /* @__PURE__ */ duotone(PhGitFork, "GitFork");
export const Hash = /* @__PURE__ */ duotone(PhHash, "Hash");
export const LayoutGrid = /* @__PURE__ */ duotone(SquaresFour, "LayoutGrid");
export const Monitor = /* @__PURE__ */ duotone(PhMonitor, "Monitor");
export const PenLine = /* @__PURE__ */ duotone(PencilSimpleLine, "PenLine");

// Contact and identity
export const Mail = /* @__PURE__ */ duotone(Envelope, "Mail");
export const MapPin = /* @__PURE__ */ duotone(PhMapPin, "MapPin");
export const Phone = /* @__PURE__ */ duotone(PhPhone, "Phone");

// Theme
export const Moon = /* @__PURE__ */ duotone(PhMoon, "Moon");
export const Sun = /* @__PURE__ */ duotone(PhSun, "Sun");

// Brands. Phosphor carries the real marks, which is why the hand-rolled X
// glyph in dock-toolbar.tsx is gone and its exception in PROJECT_PROFILE.md
// with it. Brand marks stay at `fill` weight: a duotone company logo reads as
// a rendering bug rather than a style.
export const Github = /* @__PURE__ */ withWeight(GithubLogo, "fill", "Github");
export const Linkedin = /* @__PURE__ */ withWeight(LinkedinLogo, "fill", "Linkedin");
export const Twitter = /* @__PURE__ */ withWeight(XLogo, "fill", "Twitter");
export const Heart = /* @__PURE__ */ duotone(PhHeart, "Heart");

// Figma and project-preview chrome
export const BarChart3 = /* @__PURE__ */ duotone(ChartBar, "BarChart3");
export const Calendar = /* @__PURE__ */ duotone(CalendarBlank, "Calendar");
export const ChevronRight = /* @__PURE__ */ duotone(CaretRight, "ChevronRight");
export const GitBranch = /* @__PURE__ */ duotone(PhGitBranch, "GitBranch");
export const Globe = /* @__PURE__ */ duotone(PhGlobe, "Globe");
export const Grip = /* @__PURE__ */ duotone(DotsSixVertical, "Grip");
export const Image = /* @__PURE__ */ duotone(PhImage, "Image");
export const ImageOff = /* @__PURE__ */ duotone(PhImage, "ImageOff");
export const Laptop = /* @__PURE__ */ duotone(PhLaptop, "Laptop");
export const Layers = /* @__PURE__ */ duotone(Stack, "Layers");
export const Maximize2 = /* @__PURE__ */ duotone(CornersOut, "Maximize2");
export const Minimize2 = /* @__PURE__ */ duotone(CornersIn, "Minimize2");
export const Palette = /* @__PURE__ */ duotone(PhPalette, "Palette");
export const RotateCcw = /* @__PURE__ */ duotone(ArrowClockwise, "RotateCcw");
export const Smartphone = /* @__PURE__ */ duotone(DeviceMobile, "Smartphone");
export const Tablet = /* @__PURE__ */ duotone(DeviceTablet, "Tablet");
export const Zap = /* @__PURE__ */ duotone(Lightning, "Zap");

// Sonner's toast status glyphs. It expects these exact names.
export const CircleCheckIcon = /* @__PURE__ */ duotone(PhCheckCircle, "CircleCheckIcon");
export const InfoIcon = /* @__PURE__ */ duotone(Info, "InfoIcon");
export const Loader2Icon = /* @__PURE__ */ duotone(SpinnerGap, "Loader2Icon");
export const OctagonXIcon = /* @__PURE__ */ duotone(XCircle, "OctagonXIcon");
export const TriangleAlertIcon = /* @__PURE__ */ duotone(Warning, "TriangleAlertIcon");

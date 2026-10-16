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
import { Fire } from "@phosphor-icons/react/dist/ssr/Fire";
import { Folder as PhFolder } from "@phosphor-icons/react/dist/ssr/Folder";
import { GitBranch as PhGitBranch } from "@phosphor-icons/react/dist/ssr/GitBranch";
import { GitCommit as PhGitCommit } from "@phosphor-icons/react/dist/ssr/GitCommit";
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
export const ArrowLeft = duotone(PhArrowLeft, "ArrowLeft");
export const ArrowRight = duotone(PhArrowRight, "ArrowRight");
export const ArrowUpRight = duotone(PhArrowUpRight, "ArrowUpRight");
export const ChevronLeft = duotone(CaretLeft, "ChevronLeft");
export const CornerDownLeft = duotone(ArrowElbowDownLeft, "CornerDownLeft");
export const ExternalLink = duotone(ArrowSquareOut, "ExternalLink");
export const Home = duotone(House, "Home");
export const MoreHorizontal = duotone(DotsThree, "MoreHorizontal");

// Actions
export const Check = duotone(PhCheck, "Check");
export const Copy = duotone(PhCopy, "Copy");
export const Download = duotone(DownloadSimple, "Download");
export const RefreshCw = duotone(ArrowsClockwise, "RefreshCw");
export const Search = duotone(MagnifyingGlass, "Search");
export const Send = duotone(PaperPlaneTilt, "Send");
export const Share2 = duotone(ShareNetwork, "Share2");
export const X = duotone(PhX, "X");

// Status and feedback
export const AlertTriangle = duotone(Warning, "AlertTriangle");
export const CheckCircle = duotone(PhCheckCircle, "CheckCircle");
export const Loader2 = duotone(SpinnerGap, "Loader2");
export const Sparkle = duotone(PhSparkle, "Sparkle");
export const Star = duotone(PhStar, "Star");

// Objects and content
export const Box = duotone(Cube, "Box");
export const Clock = duotone(PhClock, "Clock");
export const FileText = duotone(PhFileText, "FileText");
export const Flame = duotone(Fire, "Flame");
export const Folder = duotone(PhFolder, "Folder");
export const FolderGit2 = duotone(PhGitBranch, "FolderGit2");
export const GitCommit = duotone(PhGitCommit, "GitCommit");
export const GitFork = duotone(PhGitFork, "GitFork");
export const Hash = duotone(PhHash, "Hash");
export const LayoutGrid = duotone(SquaresFour, "LayoutGrid");
export const Monitor = duotone(PhMonitor, "Monitor");
export const PenLine = duotone(PencilSimpleLine, "PenLine");

// Contact and identity
export const Mail = duotone(Envelope, "Mail");
export const MapPin = duotone(PhMapPin, "MapPin");
export const Phone = duotone(PhPhone, "Phone");

// Theme
export const Moon = duotone(PhMoon, "Moon");
export const Sun = duotone(PhSun, "Sun");

// Brands. Phosphor carries the real marks, which is why the hand-rolled X
// glyph in dock-toolbar.tsx is gone and its exception in PROJECT_PROFILE.md
// with it. Brand marks stay at `fill` weight: a duotone company logo reads as
// a rendering bug rather than a style.
export const Github = withWeight(GithubLogo, "fill", "Github");
export const Linkedin = withWeight(LinkedinLogo, "fill", "Linkedin");
export const Twitter = withWeight(XLogo, "fill", "Twitter");
export const Heart = duotone(PhHeart, "Heart");

// Figma and project-preview chrome
export const BarChart3 = duotone(ChartBar, "BarChart3");
export const Calendar = duotone(CalendarBlank, "Calendar");
export const ChevronRight = duotone(CaretRight, "ChevronRight");
export const GitBranch = duotone(PhGitBranch, "GitBranch");
export const Globe = duotone(PhGlobe, "Globe");
export const Grip = duotone(DotsSixVertical, "Grip");
export const Image = duotone(PhImage, "Image");
export const ImageOff = duotone(PhImage, "ImageOff");
export const Laptop = duotone(PhLaptop, "Laptop");
export const Layers = duotone(Stack, "Layers");
export const Maximize2 = duotone(CornersOut, "Maximize2");
export const Minimize2 = duotone(CornersIn, "Minimize2");
export const Palette = duotone(PhPalette, "Palette");
export const RotateCcw = duotone(ArrowClockwise, "RotateCcw");
export const Smartphone = duotone(DeviceMobile, "Smartphone");
export const Tablet = duotone(DeviceTablet, "Tablet");
export const Zap = duotone(Lightning, "Zap");

// Sonner's toast status glyphs. It expects these exact names.
export const CircleCheckIcon = duotone(PhCheckCircle, "CircleCheckIcon");
export const InfoIcon = duotone(Info, "InfoIcon");
export const Loader2Icon = duotone(SpinnerGap, "Loader2Icon");
export const OctagonXIcon = duotone(XCircle, "OctagonXIcon");
export const TriangleAlertIcon = duotone(Warning, "TriangleAlertIcon");

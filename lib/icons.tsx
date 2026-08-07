import type { Icon, IconProps } from "@phosphor-icons/react";
import {
	ArrowClockwise,
	ArrowElbowDownLeft,
	ArrowSquareOut,
	ArrowsClockwise,
	CalendarBlank,
	CaretLeft,
	CaretRight,
	ChartBar,
	CornersIn,
	CornersOut,
	Cube,
	DeviceMobile,
	DeviceTablet,
	DotsSixVertical,
	DotsThree,
	DownloadSimple,
	Envelope,
	Fire,
	GithubLogo,
	House,
	Info,
	Lightning,
	LinkedinLogo,
	MagnifyingGlass,
	PaperPlaneTilt,
	PencilSimpleLine,
	ArrowLeft as PhArrowLeft,
	ArrowRight as PhArrowRight,
	ArrowUpRight as PhArrowUpRight,
	Check as PhCheck,
	CheckCircle as PhCheckCircle,
	Clock as PhClock,
	Copy as PhCopy,
	FileText as PhFileText,
	Folder as PhFolder,
	GitBranch as PhGitBranch,
	GitCommit as PhGitCommit,
	GitFork as PhGitFork,
	Globe as PhGlobe,
	Hash as PhHash,
	Heart as PhHeart,
	Image as PhImage,
	Laptop as PhLaptop,
	MapPin as PhMapPin,
	Monitor as PhMonitor,
	Moon as PhMoon,
	Palette as PhPalette,
	Phone as PhPhone,
	Sparkle as PhSparkle,
	Star as PhStar,
	Sun as PhSun,
	X as PhX,
	ShareNetwork,
	SpinnerGap,
	SquaresFour,
	Stack,
	Warning,
	XCircle,
	XLogo,
} from "@phosphor-icons/react/dist/ssr";

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
 * Applies the family's default weight while leaving it overridable. `weight`
 * comes before the spread on purpose: a call site that genuinely needs a solid
 * or regular glyph can still pass one.
 */
function duotone(Base: Icon, name: string) {
	const Wrapped = (props: IconProps) => <Base weight="duotone" {...props} />;
	Wrapped.displayName = name;
	return Wrapped;
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
export const Github = (props: IconProps) => <GithubLogo weight="fill" {...props} />;
export const Linkedin = (props: IconProps) => <LinkedinLogo weight="fill" {...props} />;
export const Twitter = (props: IconProps) => <XLogo weight="fill" {...props} />;
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

import type { Icon, IconProps, IconWeight } from "@phosphor-icons/react";
import {
	AppWindow as SsrAppWindow,
	Archive as SsrArchive,
	ArrowBendUpLeft as SsrArrowBendUpLeft,
	ArrowClockwise as SsrArrowClockwise,
	ArrowCounterClockwise as SsrArrowCounterClockwise,
	ArrowDown as SsrArrowDown,
	ArrowElbowDownLeft as SsrArrowElbowDownLeft,
	ArrowLeft as SsrArrowLeft,
	ArrowRight as SsrArrowRight,
	ArrowSquareOut as SsrArrowSquareOut,
	ArrowsClockwise as SsrArrowsClockwise,
	ArrowsDownUp as SsrArrowsDownUp,
	ArrowsHorizontal as SsrArrowsHorizontal,
	ArrowsOut as SsrArrowsOut,
	ArrowUp as SsrArrowUp,
	ArrowUpRight as SsrArrowUpRight,
	ArrowUUpLeft as SsrArrowUUpLeft,
	ArrowUUpRight as SsrArrowUUpRight,
	Backspace as SsrBackspace,
	Bell as SsrBell,
	BellRinging as SsrBellRinging,
	BellSlash as SsrBellSlash,
	Book as SsrBook,
	Bookmark as SsrBookmark,
	BookOpen as SsrBookOpen,
	Brain as SsrBrain,
	Broadcast as SsrBroadcast,
	Bug as SsrBug,
	Calendar as SsrCalendar,
	CalendarDots as SsrCalendarDots,
	Camera as SsrCamera,
	CaretDown as SsrCaretDown,
	CaretLeft as SsrCaretLeft,
	CaretRight as SsrCaretRight,
	CaretUp as SsrCaretUp,
	CaretUpDown as SsrCaretUpDown,
	ChartBar as SsrChartBar,
	ChartLine as SsrChartLine,
	Chat as SsrChat,
	ChatCircle as SsrChatCircle,
	Check as SsrCheck,
	CheckCircle as SsrCheckCircle,
	CheckSquare as SsrCheckSquare,
	Checks as SsrChecks,
	Circle as SsrCircle,
	CircleNotch as SsrCircleNotch,
	Clipboard as SsrClipboard,
	Clock as SsrClock,
	Cloud as SsrCloud,
	Code as SsrCode,
	Columns as SsrColumns,
	Command as SsrCommand,
	Copy as SsrCopy,
	Cpu as SsrCpu,
	CreditCard as SsrCreditCard,
	Crop as SsrCrop,
	Crosshair as SsrCrosshair,
	Cube as SsrCube,
	CurrencyDollar as SsrCurrencyDollar,
	Cursor as SsrCursor,
	Database as SsrDatabase,
	DeviceMobile as SsrDeviceMobile,
	DeviceTablet as SsrDeviceTablet,
	DotsThree as SsrDotsThree,
	DotsThreeVertical as SsrDotsThreeVertical,
	DownloadSimple as SsrDownloadSimple,
	Envelope as SsrEnvelope,
	Eraser as SsrEraser,
	Eye as SsrEye,
	Eyedropper as SsrEyedropper,
	Eyeglasses as SsrEyeglasses,
	EyeSlash as SsrEyeSlash,
	File as SsrFile,
	FileMagnifyingGlass as SsrFileMagnifyingGlass,
	Files as SsrFiles,
	FileText as SsrFileText,
	FilmStrip as SsrFilmStrip,
	Flag as SsrFlag,
	Flame as SsrFlame,
	FloppyDisk as SsrFloppyDisk,
	Folder as SsrFolder,
	FolderOpen as SsrFolderOpen,
	FolderPlus as SsrFolderPlus,
	Funnel as SsrFunnel,
	Gear as SsrGear,
	GearSix as SsrGearSix,
	GitBranch as SsrGitBranch,
	GitCommit as SsrGitCommit,
	GitFork as SsrGitFork,
	GitMerge as SsrGitMerge,
	Globe as SsrGlobe,
	GlobeHemisphereWest as SsrGlobeHemisphereWest,
	Graph as SsrGraph,
	GridFour as SsrGridFour,
	HardDrives as SsrHardDrives,
	Hash as SsrHash,
	Heart as SsrHeart,
	House as SsrHouse,
	Image as SsrImage,
	Info as SsrInfo,
	Key as SsrKey,
	Keyboard as SsrKeyboard,
	Layout as SsrLayout,
	Lifebuoy as SsrLifebuoy,
	Lightning as SsrLightning,
	LineSegment as SsrLineSegment,
	LinkSimple as SsrLinkSimple,
	List as SsrList,
	ListChecks as SsrListChecks,
	ListNumbers as SsrListNumbers,
	ListPlus as SsrListPlus,
	Lock as SsrLock,
	Magnet as SsrMagnet,
	MagnifyingGlass as SsrMagnifyingGlass,
	MapPin as SsrMapPin,
	Megaphone as SsrMegaphone,
	Microphone as SsrMicrophone,
	Minus as SsrMinus,
	Monitor as SsrMonitor,
	Moon as SsrMoon,
	MusicNote as SsrMusicNote,
	MusicNotes as SsrMusicNotes,
	NavigationArrow as SsrNavigationArrow,
	Newspaper as SsrNewspaper,
	Note as SsrNote,
	Package as SsrPackage,
	Palette as SsrPalette,
	Paperclip as SsrPaperclip,
	PaperPlaneRight as SsrPaperPlaneRight,
	PaperPlaneTilt as SsrPaperPlaneTilt,
	Pause as SsrPause,
	PencilSimple as SsrPencilSimple,
	PencilSimpleLine as SsrPencilSimpleLine,
	Percent as SsrPercent,
	Phone as SsrPhone,
	PhoneX as SsrPhoneX,
	Play as SsrPlay,
	Playlist as SsrPlaylist,
	Plug as SsrPlug,
	Plugs as SsrPlugs,
	Plus as SsrPlus,
	PlusCircle as SsrPlusCircle,
	ProhibitInset as SsrProhibitInset,
	Pulse as SsrPulse,
	PushPin as SsrPushPin,
	PuzzlePiece as SsrPuzzlePiece,
	Question as SsrQuestion,
	Quotes as SsrQuotes,
	Radio as SsrRadio,
	Rectangle as SsrRectangle,
	Repeat as SsrRepeat,
	Robot as SsrRobot,
	Rocket as SsrRocket,
	Rows as SsrRows,
	Ruler as SsrRuler,
	Scissors as SsrScissors,
	SealCheck as SsrSealCheck,
	ShareNetwork as SsrShareNetwork,
	Shield as SsrShield,
	ShieldCheck as SsrShieldCheck,
	ShieldWarning as SsrShieldWarning,
	ShoppingCart as SsrShoppingCart,
	Shuffle as SsrShuffle,
	Sidebar as SsrSidebar,
	SignOut as SsrSignOut,
	Siren as SsrSiren,
	SkipBack as SsrSkipBack,
	SkipForward as SsrSkipForward,
	SlidersHorizontal as SsrSlidersHorizontal,
	Smiley as SsrSmiley,
	Sparkle as SsrSparkle,
	SpeakerHigh as SsrSpeakerHigh,
	SpeakerX as SsrSpeakerX,
	Square as SsrSquare,
	SquareHalf as SsrSquareHalf,
	SquaresFour as SsrSquaresFour,
	Stack as SsrStack,
	StackSimple as SsrStackSimple,
	Star as SsrStar,
	Sun as SsrSun,
	Table as SsrTable,
	Tag as SsrTag,
	Terminal as SsrTerminal,
	TerminalWindow as SsrTerminalWindow,
	TextAlignCenter as SsrTextAlignCenter,
	TextAlignLeft as SsrTextAlignLeft,
	TextAlignRight as SsrTextAlignRight,
	TextB as SsrTextB,
	TextHOne as SsrTextHOne,
	TextHThree as SsrTextHThree,
	TextHTwo as SsrTextHTwo,
	TextItalic as SsrTextItalic,
	TextStrikethrough as SsrTextStrikethrough,
	TextSubscript as SsrTextSubscript,
	TextSuperscript as SsrTextSuperscript,
	TextT as SsrTextT,
	TextUnderline as SsrTextUnderline,
	ThumbsDown as SsrThumbsDown,
	ThumbsUp as SsrThumbsUp,
	Timer as SsrTimer,
	Trash as SsrTrash,
	Tray as SsrTray,
	TrendDown as SsrTrendDown,
	TrendUp as SsrTrendUp,
	UploadSimple as SsrUploadSimple,
	User as SsrUser,
	UserCircle as SsrUserCircle,
	Users as SsrUsers,
	VideoCamera as SsrVideoCamera,
	Warning as SsrWarning,
	WarningCircle as SsrWarningCircle,
	Wheelchair as SsrWheelchair,
	Wrench as SsrWrench,
	X as SsrX,
	XCircle as SsrXCircle,
} from "@phosphor-icons/react/dist/ssr";
import { forwardRef } from "react";

export type { Icon, IconProps, IconWeight };

/**
 * Phosphor, duotone by default — the system's single icon voice.
 *
 * Built on Phosphor's SSR-safe icons (no React context) so every icon renders
 * identically in server and client components, and re-exported through one
 * `duotone()` wrapper that owns the default weight the way `--brand` owns the
 * accent. Pass `weight="bold" | "fill" | "regular" | "thin" | "light"` at any
 * call site to override. Import names match Phosphor's catalog exactly.
 *
 * Icons are imported by name (never `import * as`) so bundlers tree-shake the
 * set down to exactly what's used.
 */
function duotone(Base: Icon, displayName: string): Icon {
	const Wrapped = forwardRef<SVGSVGElement, IconProps>(function PhosphorIcon(
		{ weight = "duotone", ...props },
		ref
	) {
		return <Base ref={ref} weight={weight} {...props} />;
	});
	Wrapped.displayName = displayName;
	return Wrapped as unknown as Icon;
}

export const AppWindow = /*@__PURE__*/ duotone(SsrAppWindow, "AppWindow");
export const Archive = /*@__PURE__*/ duotone(SsrArchive, "Archive");
export const ArrowBendUpLeft = /*@__PURE__*/ duotone(SsrArrowBendUpLeft, "ArrowBendUpLeft");
export const ArrowClockwise = /*@__PURE__*/ duotone(SsrArrowClockwise, "ArrowClockwise");
export const ArrowCounterClockwise = /*@__PURE__*/ duotone(
	SsrArrowCounterClockwise,
	"ArrowCounterClockwise"
);
export const ArrowDown = /*@__PURE__*/ duotone(SsrArrowDown, "ArrowDown");
export const ArrowElbowDownLeft = /*@__PURE__*/ duotone(
	SsrArrowElbowDownLeft,
	"ArrowElbowDownLeft"
);
export const ArrowLeft = /*@__PURE__*/ duotone(SsrArrowLeft, "ArrowLeft");
export const ArrowRight = /*@__PURE__*/ duotone(SsrArrowRight, "ArrowRight");
export const ArrowSquareOut = /*@__PURE__*/ duotone(SsrArrowSquareOut, "ArrowSquareOut");
export const ArrowUUpLeft = /*@__PURE__*/ duotone(SsrArrowUUpLeft, "ArrowUUpLeft");
export const ArrowUUpRight = /*@__PURE__*/ duotone(SsrArrowUUpRight, "ArrowUUpRight");
export const ArrowUp = /*@__PURE__*/ duotone(SsrArrowUp, "ArrowUp");
export const ArrowUpRight = /*@__PURE__*/ duotone(SsrArrowUpRight, "ArrowUpRight");
export const ArrowsClockwise = /*@__PURE__*/ duotone(SsrArrowsClockwise, "ArrowsClockwise");
export const ArrowsDownUp = /*@__PURE__*/ duotone(SsrArrowsDownUp, "ArrowsDownUp");
export const ArrowsHorizontal = /*@__PURE__*/ duotone(SsrArrowsHorizontal, "ArrowsHorizontal");
export const ArrowsOut = /*@__PURE__*/ duotone(SsrArrowsOut, "ArrowsOut");
export const Backspace = /*@__PURE__*/ duotone(SsrBackspace, "Backspace");
export const Bell = /*@__PURE__*/ duotone(SsrBell, "Bell");
export const BellRinging = /*@__PURE__*/ duotone(SsrBellRinging, "BellRinging");
export const BellSlash = /*@__PURE__*/ duotone(SsrBellSlash, "BellSlash");
export const Book = /*@__PURE__*/ duotone(SsrBook, "Book");
export const BookOpen = /*@__PURE__*/ duotone(SsrBookOpen, "BookOpen");
export const Bookmark = /*@__PURE__*/ duotone(SsrBookmark, "Bookmark");
export const Brain = /*@__PURE__*/ duotone(SsrBrain, "Brain");
export const Broadcast = /*@__PURE__*/ duotone(SsrBroadcast, "Broadcast");
export const Bug = /*@__PURE__*/ duotone(SsrBug, "Bug");
export const Calendar = /*@__PURE__*/ duotone(SsrCalendar, "Calendar");
export const CalendarDots = /*@__PURE__*/ duotone(SsrCalendarDots, "CalendarDots");
export const Camera = /*@__PURE__*/ duotone(SsrCamera, "Camera");
export const CaretDown = /*@__PURE__*/ duotone(SsrCaretDown, "CaretDown");
export const CaretLeft = /*@__PURE__*/ duotone(SsrCaretLeft, "CaretLeft");
export const CaretRight = /*@__PURE__*/ duotone(SsrCaretRight, "CaretRight");
export const CaretUp = /*@__PURE__*/ duotone(SsrCaretUp, "CaretUp");
export const CaretUpDown = /*@__PURE__*/ duotone(SsrCaretUpDown, "CaretUpDown");
export const ChartBar = /*@__PURE__*/ duotone(SsrChartBar, "ChartBar");
export const ChartLine = /*@__PURE__*/ duotone(SsrChartLine, "ChartLine");
export const Chat = /*@__PURE__*/ duotone(SsrChat, "Chat");
export const ChatCircle = /*@__PURE__*/ duotone(SsrChatCircle, "ChatCircle");
export const Check = /*@__PURE__*/ duotone(SsrCheck, "Check");
export const CheckCircle = /*@__PURE__*/ duotone(SsrCheckCircle, "CheckCircle");
export const CheckSquare = /*@__PURE__*/ duotone(SsrCheckSquare, "CheckSquare");
export const Checks = /*@__PURE__*/ duotone(SsrChecks, "Checks");
export const Circle = /*@__PURE__*/ duotone(SsrCircle, "Circle");
export const CircleNotch = /*@__PURE__*/ duotone(SsrCircleNotch, "CircleNotch");
export const Clipboard = /*@__PURE__*/ duotone(SsrClipboard, "Clipboard");
export const Clock = /*@__PURE__*/ duotone(SsrClock, "Clock");
export const Cloud = /*@__PURE__*/ duotone(SsrCloud, "Cloud");
export const Code = /*@__PURE__*/ duotone(SsrCode, "Code");
export const Columns = /*@__PURE__*/ duotone(SsrColumns, "Columns");
export const Command = /*@__PURE__*/ duotone(SsrCommand, "Command");
export const Copy = /*@__PURE__*/ duotone(SsrCopy, "Copy");
export const Cpu = /*@__PURE__*/ duotone(SsrCpu, "Cpu");
export const CreditCard = /*@__PURE__*/ duotone(SsrCreditCard, "CreditCard");
export const Crop = /*@__PURE__*/ duotone(SsrCrop, "Crop");
export const Crosshair = /*@__PURE__*/ duotone(SsrCrosshair, "Crosshair");
export const Cube = /*@__PURE__*/ duotone(SsrCube, "Cube");
export const CurrencyDollar = /*@__PURE__*/ duotone(SsrCurrencyDollar, "CurrencyDollar");
export const Cursor = /*@__PURE__*/ duotone(SsrCursor, "Cursor");
export const Database = /*@__PURE__*/ duotone(SsrDatabase, "Database");
export const DeviceMobile = /*@__PURE__*/ duotone(SsrDeviceMobile, "DeviceMobile");
export const DeviceTablet = /*@__PURE__*/ duotone(SsrDeviceTablet, "DeviceTablet");
export const DotsThree = /*@__PURE__*/ duotone(SsrDotsThree, "DotsThree");
export const DotsThreeVertical = /*@__PURE__*/ duotone(SsrDotsThreeVertical, "DotsThreeVertical");
export const DownloadSimple = /*@__PURE__*/ duotone(SsrDownloadSimple, "DownloadSimple");
export const Envelope = /*@__PURE__*/ duotone(SsrEnvelope, "Envelope");
export const Eraser = /*@__PURE__*/ duotone(SsrEraser, "Eraser");
export const Eye = /*@__PURE__*/ duotone(SsrEye, "Eye");
export const EyeSlash = /*@__PURE__*/ duotone(SsrEyeSlash, "EyeSlash");
export const Eyedropper = /*@__PURE__*/ duotone(SsrEyedropper, "Eyedropper");
export const Eyeglasses = /*@__PURE__*/ duotone(SsrEyeglasses, "Eyeglasses");
export const File = /*@__PURE__*/ duotone(SsrFile, "File");
export const FileMagnifyingGlass = /*@__PURE__*/ duotone(
	SsrFileMagnifyingGlass,
	"FileMagnifyingGlass"
);
export const FileText = /*@__PURE__*/ duotone(SsrFileText, "FileText");
export const Files = /*@__PURE__*/ duotone(SsrFiles, "Files");
export const FilmStrip = /*@__PURE__*/ duotone(SsrFilmStrip, "FilmStrip");
export const Flag = /*@__PURE__*/ duotone(SsrFlag, "Flag");
export const Flame = /*@__PURE__*/ duotone(SsrFlame, "Flame");
export const FloppyDisk = /*@__PURE__*/ duotone(SsrFloppyDisk, "FloppyDisk");
export const Folder = /*@__PURE__*/ duotone(SsrFolder, "Folder");
export const FolderOpen = /*@__PURE__*/ duotone(SsrFolderOpen, "FolderOpen");
export const FolderPlus = /*@__PURE__*/ duotone(SsrFolderPlus, "FolderPlus");
export const Funnel = /*@__PURE__*/ duotone(SsrFunnel, "Funnel");
export const Gear = /*@__PURE__*/ duotone(SsrGear, "Gear");
export const GearSix = /*@__PURE__*/ duotone(SsrGearSix, "GearSix");
export const GitBranch = /*@__PURE__*/ duotone(SsrGitBranch, "GitBranch");
export const GitCommit = /*@__PURE__*/ duotone(SsrGitCommit, "GitCommit");
export const GitFork = /*@__PURE__*/ duotone(SsrGitFork, "GitFork");
export const GitMerge = /*@__PURE__*/ duotone(SsrGitMerge, "GitMerge");
export const Globe = /*@__PURE__*/ duotone(SsrGlobe, "Globe");
export const GlobeHemisphereWest = /*@__PURE__*/ duotone(
	SsrGlobeHemisphereWest,
	"GlobeHemisphereWest"
);
export const Graph = /*@__PURE__*/ duotone(SsrGraph, "Graph");
export const GridFour = /*@__PURE__*/ duotone(SsrGridFour, "GridFour");
export const HardDrives = /*@__PURE__*/ duotone(SsrHardDrives, "HardDrives");
export const Hash = /*@__PURE__*/ duotone(SsrHash, "Hash");
export const Heart = /*@__PURE__*/ duotone(SsrHeart, "Heart");
export const House = /*@__PURE__*/ duotone(SsrHouse, "House");
export const Image = /*@__PURE__*/ duotone(SsrImage, "Image");
export const Info = /*@__PURE__*/ duotone(SsrInfo, "Info");
export const Key = /*@__PURE__*/ duotone(SsrKey, "Key");
export const Keyboard = /*@__PURE__*/ duotone(SsrKeyboard, "Keyboard");
export const Layout = /*@__PURE__*/ duotone(SsrLayout, "Layout");
export const Lifebuoy = /*@__PURE__*/ duotone(SsrLifebuoy, "Lifebuoy");
export const Lightning = /*@__PURE__*/ duotone(SsrLightning, "Lightning");
export const LineSegment = /*@__PURE__*/ duotone(SsrLineSegment, "LineSegment");
export const LinkSimple = /*@__PURE__*/ duotone(SsrLinkSimple, "LinkSimple");
export const List = /*@__PURE__*/ duotone(SsrList, "List");
export const ListChecks = /*@__PURE__*/ duotone(SsrListChecks, "ListChecks");
export const ListNumbers = /*@__PURE__*/ duotone(SsrListNumbers, "ListNumbers");
export const ListPlus = /*@__PURE__*/ duotone(SsrListPlus, "ListPlus");
export const Lock = /*@__PURE__*/ duotone(SsrLock, "Lock");
export const Magnet = /*@__PURE__*/ duotone(SsrMagnet, "Magnet");
export const MagnifyingGlass = /*@__PURE__*/ duotone(SsrMagnifyingGlass, "MagnifyingGlass");
export const MapPin = /*@__PURE__*/ duotone(SsrMapPin, "MapPin");
export const Megaphone = /*@__PURE__*/ duotone(SsrMegaphone, "Megaphone");
export const Microphone = /*@__PURE__*/ duotone(SsrMicrophone, "Microphone");
export const Minus = /*@__PURE__*/ duotone(SsrMinus, "Minus");
export const Monitor = /*@__PURE__*/ duotone(SsrMonitor, "Monitor");
export const Moon = /*@__PURE__*/ duotone(SsrMoon, "Moon");
export const MusicNote = /*@__PURE__*/ duotone(SsrMusicNote, "MusicNote");
export const MusicNotes = /*@__PURE__*/ duotone(SsrMusicNotes, "MusicNotes");
export const NavigationArrow = /*@__PURE__*/ duotone(SsrNavigationArrow, "NavigationArrow");
export const Newspaper = /*@__PURE__*/ duotone(SsrNewspaper, "Newspaper");
export const Note = /*@__PURE__*/ duotone(SsrNote, "Note");
export const Package = /*@__PURE__*/ duotone(SsrPackage, "Package");
export const Palette = /*@__PURE__*/ duotone(SsrPalette, "Palette");
export const PaperPlaneRight = /*@__PURE__*/ duotone(SsrPaperPlaneRight, "PaperPlaneRight");
export const PaperPlaneTilt = /*@__PURE__*/ duotone(SsrPaperPlaneTilt, "PaperPlaneTilt");
export const Paperclip = /*@__PURE__*/ duotone(SsrPaperclip, "Paperclip");
export const Pause = /*@__PURE__*/ duotone(SsrPause, "Pause");
export const PencilSimple = /*@__PURE__*/ duotone(SsrPencilSimple, "PencilSimple");
export const PencilSimpleLine = /*@__PURE__*/ duotone(SsrPencilSimpleLine, "PencilSimpleLine");
export const Percent = /*@__PURE__*/ duotone(SsrPercent, "Percent");
export const Phone = /*@__PURE__*/ duotone(SsrPhone, "Phone");
export const PhoneX = /*@__PURE__*/ duotone(SsrPhoneX, "PhoneX");
export const Play = /*@__PURE__*/ duotone(SsrPlay, "Play");
export const Playlist = /*@__PURE__*/ duotone(SsrPlaylist, "Playlist");
export const Plug = /*@__PURE__*/ duotone(SsrPlug, "Plug");
export const Plugs = /*@__PURE__*/ duotone(SsrPlugs, "Plugs");
export const Plus = /*@__PURE__*/ duotone(SsrPlus, "Plus");
export const PlusCircle = /*@__PURE__*/ duotone(SsrPlusCircle, "PlusCircle");
export const ProhibitInset = /*@__PURE__*/ duotone(SsrProhibitInset, "ProhibitInset");
export const Pulse = /*@__PURE__*/ duotone(SsrPulse, "Pulse");
export const PushPin = /*@__PURE__*/ duotone(SsrPushPin, "PushPin");
export const PuzzlePiece = /*@__PURE__*/ duotone(SsrPuzzlePiece, "PuzzlePiece");
export const Question = /*@__PURE__*/ duotone(SsrQuestion, "Question");
export const Quotes = /*@__PURE__*/ duotone(SsrQuotes, "Quotes");
export const Radio = /*@__PURE__*/ duotone(SsrRadio, "Radio");
export const Rectangle = /*@__PURE__*/ duotone(SsrRectangle, "Rectangle");
export const Repeat = /*@__PURE__*/ duotone(SsrRepeat, "Repeat");
export const Robot = /*@__PURE__*/ duotone(SsrRobot, "Robot");
export const Rocket = /*@__PURE__*/ duotone(SsrRocket, "Rocket");
export const Rows = /*@__PURE__*/ duotone(SsrRows, "Rows");
export const Ruler = /*@__PURE__*/ duotone(SsrRuler, "Ruler");
export const Scissors = /*@__PURE__*/ duotone(SsrScissors, "Scissors");
export const SealCheck = /*@__PURE__*/ duotone(SsrSealCheck, "SealCheck");
export const ShareNetwork = /*@__PURE__*/ duotone(SsrShareNetwork, "ShareNetwork");
export const Shield = /*@__PURE__*/ duotone(SsrShield, "Shield");
export const ShieldCheck = /*@__PURE__*/ duotone(SsrShieldCheck, "ShieldCheck");
export const ShieldWarning = /*@__PURE__*/ duotone(SsrShieldWarning, "ShieldWarning");
export const ShoppingCart = /*@__PURE__*/ duotone(SsrShoppingCart, "ShoppingCart");
export const Shuffle = /*@__PURE__*/ duotone(SsrShuffle, "Shuffle");
export const Sidebar = /*@__PURE__*/ duotone(SsrSidebar, "Sidebar");
export const SignOut = /*@__PURE__*/ duotone(SsrSignOut, "SignOut");
export const Siren = /*@__PURE__*/ duotone(SsrSiren, "Siren");
export const SkipBack = /*@__PURE__*/ duotone(SsrSkipBack, "SkipBack");
export const SkipForward = /*@__PURE__*/ duotone(SsrSkipForward, "SkipForward");
export const SlidersHorizontal = /*@__PURE__*/ duotone(SsrSlidersHorizontal, "SlidersHorizontal");
export const Smiley = /*@__PURE__*/ duotone(SsrSmiley, "Smiley");
export const Sparkle = /*@__PURE__*/ duotone(SsrSparkle, "Sparkle");
export const SpeakerHigh = /*@__PURE__*/ duotone(SsrSpeakerHigh, "SpeakerHigh");
export const SpeakerX = /*@__PURE__*/ duotone(SsrSpeakerX, "SpeakerX");
export const Square = /*@__PURE__*/ duotone(SsrSquare, "Square");
export const SquareHalf = /*@__PURE__*/ duotone(SsrSquareHalf, "SquareHalf");
export const SquaresFour = /*@__PURE__*/ duotone(SsrSquaresFour, "SquaresFour");
export const Stack = /*@__PURE__*/ duotone(SsrStack, "Stack");
export const StackSimple = /*@__PURE__*/ duotone(SsrStackSimple, "StackSimple");
export const Star = /*@__PURE__*/ duotone(SsrStar, "Star");
export const Sun = /*@__PURE__*/ duotone(SsrSun, "Sun");
export const Table = /*@__PURE__*/ duotone(SsrTable, "Table");
export const Tag = /*@__PURE__*/ duotone(SsrTag, "Tag");
export const Terminal = /*@__PURE__*/ duotone(SsrTerminal, "Terminal");
export const TerminalWindow = /*@__PURE__*/ duotone(SsrTerminalWindow, "TerminalWindow");
export const TextAlignCenter = /*@__PURE__*/ duotone(SsrTextAlignCenter, "TextAlignCenter");
export const TextAlignLeft = /*@__PURE__*/ duotone(SsrTextAlignLeft, "TextAlignLeft");
export const TextAlignRight = /*@__PURE__*/ duotone(SsrTextAlignRight, "TextAlignRight");
export const TextB = /*@__PURE__*/ duotone(SsrTextB, "TextB");
export const TextHOne = /*@__PURE__*/ duotone(SsrTextHOne, "TextHOne");
export const TextHThree = /*@__PURE__*/ duotone(SsrTextHThree, "TextHThree");
export const TextHTwo = /*@__PURE__*/ duotone(SsrTextHTwo, "TextHTwo");
export const TextItalic = /*@__PURE__*/ duotone(SsrTextItalic, "TextItalic");
export const TextStrikethrough = /*@__PURE__*/ duotone(SsrTextStrikethrough, "TextStrikethrough");
export const TextSubscript = /*@__PURE__*/ duotone(SsrTextSubscript, "TextSubscript");
export const TextSuperscript = /*@__PURE__*/ duotone(SsrTextSuperscript, "TextSuperscript");
export const TextT = /*@__PURE__*/ duotone(SsrTextT, "TextT");
export const TextUnderline = /*@__PURE__*/ duotone(SsrTextUnderline, "TextUnderline");
export const ThumbsDown = /*@__PURE__*/ duotone(SsrThumbsDown, "ThumbsDown");
export const ThumbsUp = /*@__PURE__*/ duotone(SsrThumbsUp, "ThumbsUp");
export const Timer = /*@__PURE__*/ duotone(SsrTimer, "Timer");
export const Trash = /*@__PURE__*/ duotone(SsrTrash, "Trash");
export const Tray = /*@__PURE__*/ duotone(SsrTray, "Tray");
export const TrendDown = /*@__PURE__*/ duotone(SsrTrendDown, "TrendDown");
export const TrendUp = /*@__PURE__*/ duotone(SsrTrendUp, "TrendUp");
export const UploadSimple = /*@__PURE__*/ duotone(SsrUploadSimple, "UploadSimple");
export const User = /*@__PURE__*/ duotone(SsrUser, "User");
export const UserCircle = /*@__PURE__*/ duotone(SsrUserCircle, "UserCircle");
export const Users = /*@__PURE__*/ duotone(SsrUsers, "Users");
export const VideoCamera = /*@__PURE__*/ duotone(SsrVideoCamera, "VideoCamera");
export const Warning = /*@__PURE__*/ duotone(SsrWarning, "Warning");
export const WarningCircle = /*@__PURE__*/ duotone(SsrWarningCircle, "WarningCircle");
export const Wheelchair = /*@__PURE__*/ duotone(SsrWheelchair, "Wheelchair");
export const Wrench = /*@__PURE__*/ duotone(SsrWrench, "Wrench");
export const X = /*@__PURE__*/ duotone(SsrX, "X");
export const XCircle = /*@__PURE__*/ duotone(SsrXCircle, "XCircle");

// ── brand & app extras ──────────────────────────────────────────────
// Icons byronwade.com needs that the core registry barrel does not carry
// (brand logos, extra device + glyphs). Same duotone-by-default wrapper.
import {
	ArrowsIn as SsrArrowsIn,
	DotsSixVertical as SsrDotsSixVertical,
	FigmaLogo as SsrFigmaLogo,
	GithubLogo as SsrGithubLogo,
	ImageBroken as SsrImageBroken,
	Laptop as SsrLaptop,
	Lightbulb as SsrLightbulb,
	LinkedinLogo as SsrLinkedinLogo,
	XLogo as SsrXLogo,
} from "@phosphor-icons/react/dist/ssr";

export const ArrowsIn = /*@__PURE__*/ duotone(SsrArrowsIn, "ArrowsIn");
export const DotsSixVertical = /*@__PURE__*/ duotone(SsrDotsSixVertical, "DotsSixVertical");
export const FigmaLogo = /*@__PURE__*/ duotone(SsrFigmaLogo, "FigmaLogo");
export const GithubLogo = /*@__PURE__*/ duotone(SsrGithubLogo, "GithubLogo");
export const ImageBroken = /*@__PURE__*/ duotone(SsrImageBroken, "ImageBroken");
export const Laptop = /*@__PURE__*/ duotone(SsrLaptop, "Laptop");
export const Lightbulb = /*@__PURE__*/ duotone(SsrLightbulb, "Lightbulb");
export const LinkedinLogo = /*@__PURE__*/ duotone(SsrLinkedinLogo, "LinkedinLogo");
export const XLogo = /*@__PURE__*/ duotone(SsrXLogo, "XLogo");

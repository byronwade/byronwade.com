"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation";
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Menu, X, Sun, Moon, Megaphone, Palette, BarChart, Coffee, Mail, 
  ChevronDown, Code, Globe, Smartphone, Zap, PenTool, Search, Laptop,
  ShoppingCart, Briefcase, Layers, Monitor, Camera, Figma, Crop, Type,
  Database, Server, Cloud, Lock, Wifi, Cpu, Headphones, Mic, Video,
  Target, TrendingUp, PieChart, Users, MessageSquare, Share2, FileText,
  Package, Feather, Printer, Box
} from "lucide-react"
import { useTheme } from "next-themes"

// Update the NavItem type to match your menuItems structure
type NavItem = {
  title: string;
  menu?: string;
  href?: string;
};

export default function Header() {
  const { setTheme, theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const headerRef = useRef<HTMLElement>(null)
  const megaMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname();
  const isLocalPage = pathname.startsWith("/local");


  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleMegaMenu = (menu: string | undefined) => {
    if (menu) {
      setActiveMegaMenu(prevMenu => prevMenu === menu ? null : menu);
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setActiveMegaMenu(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const menuItems: NavItem[] = [
    { title: "Design", menu: "design" },
    { title: "Development", menu: "development" },
    { title: "Marketing", menu: "marketing" },
    { title: "Shop", href: "/shop" },
  ]

  const megaMenuContent = {
    design: [
      { title: "UI/UX Design", icon: <Palette className="w-6 h-6" />, description: "Craft intuitive user experiences" },
      { title: "Brand Identity", icon: <Zap className="w-6 h-6" />, description: "Establish a strong brand presence" },
      { title: "Graphic Design", icon: <Layers className="w-6 h-6" />, description: "Create visually stunning graphics" },
      { title: "Logo Design", icon: <PenTool className="w-6 h-6" />, description: "Design memorable and impactful logos" },
      { title: "Web Design", icon: <Monitor className="w-6 h-6" />, description: "Create beautiful and functional websites" },
      { title: "Print Design", icon: <Printer className="w-6 h-6" />, description: "Design for various print media" },
      { title: "Illustration", icon: <Feather className="w-6 h-6" />, description: "Create custom illustrations and artwork" },
      { title: "Motion Graphics", icon: <Video className="w-6 h-6" />, description: "Design animated visual elements" },
      { title: "3D Modeling", icon: <Box className="w-6 h-6" />, description: "Create three-dimensional digital models" },
      { title: "Packaging Design", icon: <Package className="w-6 h-6" />, description: "Design product packaging that stands out" },
    ],
    development: [
      { title: "Frontend Development", icon: <Code className="w-6 h-6" />, description: "Create stunning user interfaces" },
      { title: "Backend Development", icon: <Server className="w-6 h-6" />, description: "Build robust server-side solutions" },
      { title: "Mobile App Development", icon: <Smartphone className="w-6 h-6" />, description: "Develop for iOS and Android" },
      { title: "Full-Stack Development", icon: <Layers className="w-6 h-6" />, description: "End-to-end application development" },
      { title: "E-commerce Development", icon: <ShoppingCart className="w-6 h-6" />, description: "Build online stores and marketplaces" },
      { title: "API Development", icon: <Database className="w-6 h-6" />, description: "Create robust and scalable APIs" },
      { title: "Cloud Solutions", icon: <Cloud className="w-6 h-6" />, description: "Develop and deploy cloud-based applications" },
      { title: "DevOps", icon: <Cpu className="w-6 h-6" />, description: "Streamline development and operations" },
      { title: "Cybersecurity", icon: <Lock className="w-6 h-6" />, description: "Implement robust security measures" },
      { title: "IoT Development", icon: <Wifi className="w-6 h-6" />, description: "Create solutions for connected devices" },
    ],
    marketing: [
      { title: "Digital Advertising", icon: <Megaphone className="w-6 h-6" />, description: "Reach your audience effectively" },
      { title: "Content Marketing", icon: <FileText className="w-6 h-6" />, description: "Engage with compelling content" },
      { title: "SEO Optimization", icon: <Search className="w-6 h-6" />, description: "Improve your search rankings" },
      { title: "Social Media Marketing", icon: <Share2 className="w-6 h-6" />, description: "Build your brand on social platforms" },
      { title: "Email Marketing", icon: <Mail className="w-6 h-6" />, description: "Create effective email campaigns" },
      { title: "Influencer Marketing", icon: <Users className="w-6 h-6" />, description: "Leverage influencers for brand growth" },
      { title: "Analytics and Reporting", icon: <BarChart className="w-6 h-6" />, description: "Measure and analyze campaign performance" },
      { title: "Conversion Rate Optimization", icon: <TrendingUp className="w-6 h-6" />, description: "Improve website and app conversions" },
      { title: "Marketing Automation", icon: <Zap className="w-6 h-6" />, description: "Streamline your marketing processes" },
      { title: "Brand Strategy", icon: <Target className="w-6 h-6" />, description: "Develop comprehensive brand strategies" },
    ],
  }

  if (isLocalPage) {
    return null; // Don't render the header for local pages
  }

  return (
    <>
      <header ref={headerRef} className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-background/80 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Byron Wade" />
                <AvatarFallback>BW</AvatarFallback>
              </Avatar>
              <span className="ml-3 text-lg font-serif font-bold">
                Byron Wade
              </span>
            </motion.div>
            <nav className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item: NavItem, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent cursor-pointer"
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <button 
                      className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => toggleMegaMenu(item.menu)}
                      aria-expanded={activeMegaMenu === item.menu}
                      aria-haspopup="true"
                    >
                      {item.title}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  )}
                </motion.div>
              ))}
            </nav>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="cursor-pointer">
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                    <Laptop className="mr-2 h-4 w-4" />
                    <span>System</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="hidden md:inline-flex bg-gradient-to-r from-primary to-[hsl(44.2,98%,55%)] text-primary-foreground hover:from-primary/80 hover:to-[hsl(44.2,98%,45%)] cursor-pointer" asChild>
                  <Link href="/contact">Work with me</Link>
                </Button>
              </motion.div>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMenu}
                className="lg:hidden cursor-pointer"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
                {menuItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href || `/${item.menu}`}
                    className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"
                  >
                    {item.title}
                  </Link>
                ))}
                <div className="px-3 py-2 space-y-2">
                  <Button className="w-full bg-gradient-to-r from-primary to-[hsl(44.2,98%,55%)] text-primary-foreground hover:from-primary/80 hover:to-[hsl(44.2,98%,45%)] cursor-pointer" asChild>
                    <Link href="/contact" className="flex items-center justify-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>Work with me</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full cursor-pointer" asChild>
                    <Link href="/coffee" className="flex items-center justify-center">
                      <Coffee className="w-4 h-4 mr-2" />
                      <span>Buy Me Coffee</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <AnimatePresence>
        {activeMegaMenu && (
          <motion.div
            ref={megaMenuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 right-0 bg-background shadow-lg overflow-hidden z-40"
            style={{
              top: headerRef.current ? `${headerRef.current.offsetHeight}px` : '64px',
            }}
          >
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {megaMenuContent[activeMegaMenu as keyof typeof megaMenuContent].map((item, index) => (
                  <div 
                    key={item.title} 
                    className="flex items-start space-x-3 p-2 rounded-md transition-colors hover:bg-accent cursor-pointer"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="text-lg font-semibold mb-4">Featured {activeMegaMenu.charAt(0).toUpperCase() + activeMegaMenu.slice(1)} Projects</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4 p-2 rounded-md transition-colors hover:bg-accent cursor-pointer">
                      <Image
                        src={`/placeholder.svg?height=80&width=80&text=Project${i}`}
                        alt={`Featured ${activeMegaMenu} Project ${i}`}
                        width={80}
                        height={80}
                        className="rounded-md"
                      />
                      <div>
                        <h4 className="text-sm font-medium">Project {i} Name</h4>
                        <p className="text-xs text-muted-foreground">Brief description of the project</p>
                        <Link href={`/${activeMegaMenu}-projects/${i}`} className="text-xs text-primary hover:underline">Learn More</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
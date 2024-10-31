"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Code, Globe, Layers, Zap, Book, Puzzle, MapPin, Wrench, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

type Product = {
  name: string
  description: string
  features: string[]
  image: string
  link: string
  github: string
  category: "product" | "client"
  status: "completed" | "in_development"
  icon: React.ReactNode
}

const products: Product[] = [
  {
    name: "Thorbis",
    description: "A powerful Webflow and WordPress alternative for modern web development",
    features: [
      "Headless CMS built on Next.js",
      "Drag-and-drop interface",
      "Developer-friendly with full customization",
      "Database-agnostic approach",
      "Serverless compatibility",
    ],
    image: "/placeholder.svg?height=400&width=600",
    link: "/products/thorbis",
    github: "https://github.com/byronwade/Thorbis",
    category: "product",
    status: "in_development",
    icon: <Globe className="h-6 w-6" />,
  },
  {
    name: "ReactPress",
    description: "A template for the Thorbis admin panel using HTML and Tailwind CSS",
    features: [
      "HTML and Tailwind CSS based",
      "Modular component design",
      "Responsive layout",
      "Dark mode support",
      "Customizable themes",
    ],
    image: "/placeholder.svg?height=400&width=600",
    link: "/products/reactpress",
    github: "https://github.com/byronwade/ReactPress",
    category: "product",
    status: "in_development",
    icon: <Code className="h-6 w-6" />,
  },
  {
    name: "Wades Academy",
    description: "A learning platform for contractors, similar to Khan Academy",
    features: [
      "Comprehensive courses for various trades",
      "Interactive lessons and quizzes",
      "Progress tracking",
      "Certification programs",
      "Community forums for peer support",
    ],
    image: "/placeholder.svg?height=400&width=600",
    link: "https://academy.byronwade.com",
    github: "https://github.com/byronwade/WadesAcademy",
    category: "product",
    status: "in_development",
    icon: <Book className="h-6 w-6" />,
  },
  {
    name: "Rebuzzle",
    description: "An innovative platform for content creation and distribution",
    features: [
      "AI-powered content suggestions",
      "Multi-platform publishing",
      "Analytics dashboard",
      "Collaboration tools",
      "SEO optimization features",
    ],
    image: "/placeholder.svg?height=400&width=600",
    link: "https://rebuzzle.byronwade.com",
    github: "https://github.com/byronwade/Rebuzzle",
    category: "product",
    status: "completed",
    icon: <Puzzle className="h-6 w-6" />,
  },
  {
    name: "Locl",
    description: "A local business management and marketing platform",
    features: [
      "Business profile management",
      "Local SEO tools",
      "Customer review management",
      "Social media integration",
      "Analytics and reporting",
    ],
    image: "/placeholder.svg?height=400&width=600",
    link: "https://locl.byronwade.com",
    github: "https://github.com/byronwade/Locl",
    category: "product",
    status: "completed",
    icon: <MapPin className="h-6 w-6" />,
  },
  {
    name: "Feildra",
    description: "A Service Titan and Housecall Pro alternative for field service management",
    features: [
      "Job scheduling and dispatching",
      "Customer management",
      "Invoicing and payments",
      "Mobile app for field technicians",
      "Reporting and analytics",
    ],
    image: "/placeholder.svg?height=400&width=600",
    link: "/products/feildra",
    github: "https://github.com/byronwade/Feildra",
    category: "product",
    status: "in_development",
    icon: <Wrench className="h-6 w-6" />,
  },
  {
    name: "Client Project A",
    description: "A custom e-commerce solution for a leading retail brand",
    features: [
      "Scalable architecture",
      "Custom product configurator",
      "Integration with existing ERP system",
      "Advanced analytics dashboard",
      "Multi-language and multi-currency support",
    ],
    image: "/placeholder.svg?height=400&width=600",
    link: "/projects/client-a",
    github: "https://github.com/byronwade/client-project-a",
    category: "client",
    status: "completed",
    icon: <Briefcase className="h-6 w-6" />,
  },
  {
    name: "Client Project B",
    description: "An AI-driven financial analysis platform for a fintech startup",
    features: [
      "Real-time data processing",
      "Machine learning models for predictive analytics",
      "Secure user authentication and data encryption",
      "Interactive data visualization",
      "API integration with major financial institutions",
    ],
    image: "/placeholder.svg?height=400&width=600",
    link: "/projects/client-b",
    github: "https://github.com/byronwade/client-project-b",
    category: "client",
    status: "in_development",
    icon: <Briefcase className="h-6 w-6" />,
  },
]

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredProducts = activeTab === "all" 
    ? products 
    : products.filter(product => 
        (activeTab === "products" && product.category === "product") ||
        (activeTab === "client_projects" && product.category === "client") ||
        (activeTab === "completed" && product.status === "completed") ||
        (activeTab === "in_development" && product.status === "in_development")
      )

  return (
		<div className="min-h-screen bg-background py-16">
			<div className="container mx-auto px-4 max-w-6xl">
				{/* @ts-ignore */}
				<motion.h1 className="text-4xl font-bold text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
					Our Products and Projects
				</motion.h1>
				<Tabs defaultValue="all" className="w-full mb-12">
					<TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto">
						<TabsTrigger value="all" onClick={() => setActiveTab("all")}>
							All
						</TabsTrigger>
						<TabsTrigger value="products" onClick={() => setActiveTab("products")}>
							Our Products
						</TabsTrigger>
						<TabsTrigger value="client_projects" onClick={() => setActiveTab("client_projects")}>
							Client Projects
						</TabsTrigger>
						<TabsTrigger value="completed" onClick={() => setActiveTab("completed")}>
							Completed
						</TabsTrigger>
						<TabsTrigger value="in_development" onClick={() => setActiveTab("in_development")}>
							In Development
						</TabsTrigger>
					</TabsList>
				</Tabs>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{filteredProducts.map((product, index) => (
						<motion.div key={product.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
							<Card className="h-full flex flex-col">
								<CardHeader>
									<div className="flex flex-col space-y-2">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2">
												<div className="p-2 bg-primary/10 rounded-full">{product.icon}</div>
												<CardTitle className="text-lg">{product.name}</CardTitle>
											</div>
											<Badge variant={product.status === "completed" ? "default" : "secondary"}>{product.status === "completed" ? "Completed" : "In Development"}</Badge>
										</div>
										<CardDescription>{product.description}</CardDescription>
									</div>
								</CardHeader>
								<CardContent className="flex-grow">
									<Image src={product.image} alt={product.name} width={600} height={400} className="w-full h-48 object-cover rounded-md mb-4" />
									<ul className="space-y-2">
										{product.features.map((feature, index) => (
											<li key={index} className="flex items-start">
												<ChevronRight className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
												<span>{feature}</span>
											</li>
										))}
									</ul>
								</CardContent>
								<CardFooter className="flex flex-col space-y-2">
									<Button asChild className="w-full">
										<Link href={product.link}>Learn More</Link>
									</Button>
									<Button asChild variant="outline" className="w-full">
										<Link href={product.github} target="_blank" rel="noopener noreferrer">
											View on GitHub
										</Link>
									</Button>
								</CardFooter>
							</Card>
						</motion.div>
					))}
				</div>

				{/* @ts-ignore */}
				<motion.section className="mt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
					<h2 className="text-3xl font-bold text-center mb-8">Why Choose Our Products?</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{[
							{ icon: <Globe className="h-10 w-10" />, title: "Modern Solutions", description: "Built for the needs of today's digital landscape" },
							{ icon: <Code className="h-10 w-10" />, title: "Developer-Friendly", description: "Full control and customization for developers" },
							{ icon: <Layers className="h-10 w-10" />, title: "Scalable Products", description: "From small businesses to enterprise-level applications" },
							{ icon: <Zap className="h-10 w-10" />, title: "High Performance", description: "Optimized for speed and efficiency" },
						].map((item, index) => (
							<Card key={index} className="text-center">
								<CardHeader>
									<div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center text-primary">{item.icon}</div>
									<CardTitle className="mt-4">{item.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<p>{item.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</motion.section>
			</div>
		</div>
  );
}
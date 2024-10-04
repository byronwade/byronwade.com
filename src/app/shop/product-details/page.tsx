"use client"

import { useState, useEffect } from 'react'
import { Star, ShoppingCart, Heart, ChevronLeft, ChevronRight, Eye, Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

const product = {
  id: 1,
  title: 'Elegant Dashboard Theme',
  price: 129,
  rating: 4.8,
  sales: 3456,
  type: 'Next.js',
  description: 'A sophisticated and modern dashboard theme built with Next.js and Tailwind CSS. Perfect for admin panels, analytics dashboards, and complex web applications.',
  features: [
    'Responsive design for all devices',
    'Dark and light mode support',
    'Over 50 pre-built components',
    'Advanced charting libraries integration',
    'Seamless data fetching with React Query',
    'Fully customizable with Tailwind CSS'
  ],
  images: [
    'https://placehold.co/800x1200',
    'https://placehold.co/800x1200',
    'https://placehold.co/800x1200',
  ],
  reviews: [
    { id: 1, author: 'John Doe', rating: 5, comment: 'Excellent theme, very easy to customize!' },
    { id: 2, author: 'Jane Smith', rating: 4, comment: 'Great design, but could use more documentation.' }
  ],
  instructions: 'This Next.js theme is designed for developers or technically inclined users. It requires knowledge of React and Next.js for customization and deployment.',
  additionalServices: [
    { id: 'setup', name: 'Setup and Hosting', price: 100, description: 'We will set up the theme on Vercel or a similar provider (1 hour of setup time included).' },
    { id: 'support', name: 'Customer Support', price: 50, recurring: true, description: 'Get expert help and support for any issues with your theme.' }
  ]
}

const themeInfo = {
  'Next.js': 'Intended for developers or technically inclined users. We offer setup and hosting services for an additional fee.',
  'WordPress': 'Suitable for most users. The theme will be emailed as a download after purchase.',
  'Shopify': 'Can be used by normal users, but might require expert help for setup. We offer additional support services.',
  'Component': 'Designed for use in React projects. Requires knowledge of React for integration.'
}

const ReviewForm = () => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted review:', { rating, comment })
    setRating(0)
    setComment('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="rating" className="block text-sm font-medium">Rating</label>
        <div className="flex items-center space-x-1 mt-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`${rating >= value ? 'text-yellow-400' : 'text-muted-foreground'}`}
            >
              <Star className="h-6 w-6 fill-current" />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium">Comment</label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1"
          rows={4}
        />
      </div>
      <Button type="submit">Submit Review</Button>
    </form>
  )
}

export default function Component() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [totalPrice, setTotalPrice] = useState(product.price)

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length)
  }

  useEffect(() => {
    let newTotal = product.price
    selectedServices.forEach(serviceId => {
      const service = product.additionalServices.find(s => s.id === serviceId)
      if (service) {
        newTotal += service.price
      }
    })
    setTotalPrice(newTotal)
  }, [selectedServices])

  const handleServiceChange = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  return (
    <div className="min-h-screen bg-background py-16">
    <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="lg:sticky lg:top-12 space-y-8">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={product.images[currentImageIndex]}
                alt={`${product.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex justify-center space-x-2">
              {product.images.map((_, index) => (
                <Button
                  key={index}
                  variant={index === currentImageIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentImageIndex(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <Badge className="mb-2 bg-primary text-primary-foreground">
                {product.type}
              </Badge>
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-muted-foreground">{product.rating} ({product.sales} sales)</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 border-l-4 border-primary p-4 rounded-r-lg">
              <h3 className="flex items-center text-lg font-semibold mb-2">
                <Info className="mr-2" /> Important Information
              </h3>
              <p className="text-muted-foreground">{themeInfo[product.type as keyof typeof themeInfo]}</p>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Features</h2>
              <ul className="list-disc pl-5 space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-muted-foreground">{feature}</li>
                ))}
              </ul>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Purchase Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.additionalServices.map((service) => (
                    <div key={service.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={service.id}
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => handleServiceChange(service.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor={service.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {service.name} - ${service.price}{service.recurring ? '/month' : ''}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {service.description}
                        </p>
                        {service.id === 'setup' && (
                          <p className="text-sm text-primary">
                            Or <a href="/setup-instructions" className="underline">try it alone first for free</a>
                          </p>
                        )}
                        {service.recurring && (
                          <p className="text-xs text-destructive">
                            This is a recurring monthly charge.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-2xl font-bold">Total: ${totalPrice}</div>
                <Button className="w-1/2">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
              </CardFooter>
            </Card>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
              {product.reviews.map((review) => (
                <div key={review.id} className="mb-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                    <span className="ml-2 font-semibold">{review.author}</span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Write a Review</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                  </DialogHeader>
                  <ReviewForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
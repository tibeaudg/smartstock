import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Building, 
  Quote,
  ArrowRight,
  Play,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/HeaderPublic';
import SEO from '@/components/SEO';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

export default function CustomersPage() {
  const navigate = useNavigate();

  const breadcrumbs = getBreadcrumbPath('/customers');
  const structuredData = generateComprehensiveStructuredData(
    'article',
    {
      title: 'StockFlow Customer Success Stories',
      description: 'See how Belgian businesses use StockFlow to optimize their inventory management',
      url: 'https://www.stockflowsystems.com/customers',
      breadcrumbs: breadcrumbs
    }
  );

  const testimonials = [
    {
      name: "Laura Peeters",
      role: "Owner, De Koffieboetiek",
      company: "Coffee Shop",
      location: "Antwerp, Belgium",
      image: "/Laura.png",
      quote: "StockFlow stopped us from wasting €4,800 annually on expired inventory and overstock. We now invest that capital into bestselling items instead.",
      savings: "€4,800/year saved",
      rating: 5,
      challenges: ["Wasted coffee beans", "Manual inventory counting", "Overordering seasonal items"],
      solutions: ["Automated expiry alerts", "Mobile barcode scanning", "Smart reorder suggestions"],
      results: ["50% reduction in waste", "2 hours saved weekly", "Better cash flow"]
    },
    {
      name: "Tom Demuynck", 
      role: "Owner, Maison Belle Boutique",
      company: "Fashion Retail",
      location: "Brussels, Belgium",
      image: "/jan.png",
      quote: "StockFlow helped us identify €8,500 worth of slow-moving inventory. We cleared it at 30% margin instead of letting it sit for another season.",
      savings: "€8,500 recovered",
      rating: 5,
      challenges: ["Dead stock accumulation", "Seasonal inventory management", "Manual stock tracking"],
      solutions: ["Dead stock alerts", "Sales velocity tracking", "Liquidation recommendations"],
      results: ["30% faster inventory turnover", "€8,500 capital recovered", "Improved cash flow"]
    },
    {
      name: "Anke Willems",
      role: "Owner, Artisan & Co.",
      company: "Artisan Goods",
      location: "Ghent, Belgium", 
      image: "/anke.png",
      quote: "We used to over-order seasonal items that would sit unsold for months, tying up €3,200 in capital. StockFlow's alerts help us order just enough.",
      savings: "€3,200 freed",
      rating: 5,
      challenges: ["Seasonal demand fluctuations", "Capital tied in slow stock", "Manual forecasting"],
      solutions: ["Demand forecasting", "Low stock alerts", "Analytics dashboard"],
      results: ["40% reduction in overstock", "€3,200 capital freed", "Better seasonal planning"]
    }
  ];

  const caseStudies = [
    {
      title: "From Excel Chaos to Organized Success",
      company: "Hardware Store Chain",
      industry: "Retail",
      challenge: "Managing inventory across 3 locations with Excel spreadsheets was becoming impossible. Staff were spending 8+ hours weekly on manual counting.",
      solution: "Implemented StockFlow with mobile scanning and multi-location tracking.",
      results: [
        "75% reduction in counting time",
        "€12,000 saved annually in labor costs", 
        "Real-time visibility across all stores",
        "Zero stockouts on popular items"
      ],
      metrics: {
        timeSaved: "6 hours/week",
        costSaved: "€12,000/year",
        locations: "3 stores",
        products: "2,500 SKUs"
      }
    },
    {
      title: "Eliminating Food Waste in Restaurant Operations",
      company: "Local Restaurant Group",
      industry: "Food & Beverage",
      challenge: "Food waste was costing €2,400 monthly due to poor inventory tracking and expiry management.",
      solution: "Deployed StockFlow with expiry alerts and consumption tracking.",
      results: [
        "60% reduction in food waste",
        "€1,440 saved monthly",
        "Better supplier relationships",
        "Improved food quality"
      ],
      metrics: {
        wasteReduction: "60%",
        costSaved: "€1,440/month",
        locations: "2 restaurants",
        products: "800 ingredients"
      }
    }
  ];

  const stats = [
    {
      number: "500+",
      label: "Belgian Businesses",
      description: "Trust StockFlow for inventory management"
    },
    {
      number: "€2.4M",
      label: "Inventory Managed",
      description: "Across all customer locations"
    },
    {
      number: "4.8/5",
      label: "Customer Rating",
      description: "Based on 150+ reviews"
    },
    {
      number: "€400K+",
      label: "Total Savings",
      description: "Generated for our customers"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="StockFlow Customers - Success Stories & Case Studies"
        description="Discover how 500+ Belgian businesses use StockFlow to optimize inventory, reduce waste, and save money. Real customer stories and case studies."
        keywords="stockflow customers, inventory management success stories, Belgian businesses, case studies, testimonials"
        url="https://www.stockflowsystems.com/customers"
        structuredData={structuredData}
      />
      
      <Header 
        onLoginClick={() => navigate('/auth?mode=login')}
        onNavigate={() => {}}
        simplifiedNav={false}
        hideNotifications={true}
      />

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Loved by Small Business Owners
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              500+ businesses already using StockFlow. They've eliminated stockouts, recovered €400K+ in dead stock, and cut counting time by 75%. Here's how.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/auth?mode=register')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full"
              >
                Start Your Success Story
              </Button>
              <Button
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-full flex items-center gap-2"
              >
                <Play className="h-5 w-5" />
                Watch Case Studies
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="font-semibold text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Customer Success Stories
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Coffee shops, boutiques, contractors actual Belgian businesses sharing what changed after switching to StockFlow.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-xs text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-gray-700 mb-6 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-green-700 font-semibold">
                      <TrendingUp className="h-4 w-4" />
                      <span>{testimonial.savings}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Challenges:</h5>
                      <ul className="space-y-1">
                        {testimonial.challenges.map((challenge, i) => (
                          <li key={i} className="text-sm text-gray-600">• {challenge}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Solutions:</h5>
                      <ul className="space-y-1">
                        {testimonial.solutions.map((solution, i) => (
                          <li key={i} className="text-sm text-blue-600 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Detailed Case Studies
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Deep-dive into how businesses transformed their operations with StockFlow.
            </p>
          </div>

          <div className="space-y-16">
            {caseStudies.map((study, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-2/3 p-8">
                    <div className="mb-4">
                      <Badge variant="secondary" className="mb-2">
                        {study.industry}
                      </Badge>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {study.title}
                      </h3>
                      <p className="text-gray-600">{study.company}</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Challenge:</h4>
                        <p className="text-gray-700">{study.challenge}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Solution:</h4>
                        <p className="text-gray-700">{study.solution}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Results:</h4>
                        <ul className="space-y-2">
                          {study.results.map((result, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-700">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>{result}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/3 bg-blue-50 p-8 flex flex-col justify-center">
                    <h4 className="font-bold text-gray-900 mb-4">Key Metrics:</h4>
                    <div className="space-y-4">
                      {Object.entries(study.metrics).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {value}
                          </div>
                          <div className="text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted Across Industries
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              StockFlow works for businesses of all types and sizes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <Building className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Retail & E-commerce</h3>
              <p className="text-gray-600 text-sm">
                Manage inventory across multiple channels and locations with real-time tracking.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Food & Beverage</h3>
              <p className="text-gray-600 text-sm">
                Track expiry dates, reduce waste, and optimize ordering for restaurants and cafes.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Manufacturing</h3>
              <p className="text-gray-600 text-sm">
                Monitor raw materials, track production, and manage finished goods inventory.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Join Our Success Stories?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your free trial today and see how much you could save with StockFlow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/auth?mode=register')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full"
            >
              Join for Free
            </Button>
            <Button
              onClick={() => navigate('/contact')}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-full"
            >
              Schedule Demo
            </Button>
          </div>
          <p className="text-blue-200 text-sm mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}

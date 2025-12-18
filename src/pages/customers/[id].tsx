import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle,
  ArrowLeft,
  Quote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/HeaderPublic';
import SEO from '@/components/SEO';
import { generateComprehensiveStructuredData } from '@/lib/structuredData';
import { testimonialQuotes } from '@/data/testimonialQuotes';
import { getBreadcrumbPath } from '@/config/topicClusters';

// Extended customer data with full details
const customerDetails: Record<string, {
  name: string;
  role: string;
  company: string;
  location: string;
  image: string;
  quote: string;
  savings: string;
  rating: number;
  challenges: string[];
  solutions: string[];
  results: string[];
  fullStory?: string;
  industry: string;
}> = {
  'laura-peeters': {
    name: "Laura Peeters",
    role: "Owner",
    company: "De Koffieboetiek",
    location: "Antwerp, Belgium",
    image: "/Laura.png",
    quote: "StockFlow stopped us from wasting €4,800 annually on expired inventory and overstock. We now invest that capital into bestselling items instead.",
    savings: "€4,800/year saved",
    rating: 5,
    challenges: ["Wasted coffee beans", "Manual inventory counting", "Overordering seasonal items"],
    solutions: ["Automated expiry alerts", "Mobile barcode scanning", "Smart reorder suggestions"],
    results: ["50% reduction in waste", "2 hours saved weekly", "Better cash flow"],
    industry: "Coffee Shop",
    fullStory: "Laura Peeters runs De Koffieboetiek, a charming coffee shop in Antwerp. Before StockFlow, she struggled with expired coffee beans and manual inventory tracking. The shop was losing money on wasted inventory and spending too much time on manual counts. With StockFlow's automated expiry alerts and mobile scanning, Laura now saves €4,800 annually and has more time to focus on her customers."
  },
  'sophie-martens': {
    name: "Tom Demuynck",
    role: "Owner",
    company: "Maison Belle Boutique",
    location: "Brussels, Belgium",
    image: "/jan.png",
    quote: "StockFlow helped us identify €8,500 worth of slow-moving inventory. We cleared it at 30% margin instead of letting it sit for another season.",
    savings: "€8,500 recovered",
    rating: 5,
    challenges: ["Dead stock accumulation", "Seasonal inventory management", "Manual stock tracking"],
    solutions: ["Dead stock alerts", "Sales velocity tracking", "Liquidation recommendations"],
    results: ["30% faster inventory turnover", "€8,500 capital recovered", "Improved cash flow"],
    industry: "Fashion Retail",
    fullStory: "Tom Demuynck owns Maison Belle Boutique, a fashion retail store in Brussels. She was facing challenges with dead stock that was tying up capital. StockFlow's dead stock alerts and sales velocity tracking helped her identify and clear €8,500 worth of slow-moving inventory, improving her cash flow significantly."
  },
  'anke-willems': {
    name: "Anke Willems",
    role: "Owner",
    company: "Artisan & Co.",
    location: "Ghent, Belgium",
    image: "/anke.png",
    quote: "We used to over-order seasonal items that would sit unsold for months, tying up €3,200 in capital. StockFlow's alerts help us order just enough.",
    savings: "€3,200 freed",
    rating: 5,
    challenges: ["Seasonal demand fluctuations", "Capital tied in slow stock", "Manual forecasting"],
    solutions: ["Demand forecasting", "Low stock alerts", "Analytics dashboard"],
    results: ["40% reduction in overstock", "€3,200 capital freed", "Better seasonal planning"],
    industry: "Artisan Goods",
    fullStory: "Anke Willems runs Artisan & Co., a boutique selling artisan goods in Ghent. Seasonal demand fluctuations made it difficult to order the right quantities. StockFlow's demand forecasting and low stock alerts help Anke order just enough, freeing up €3,200 in capital that was previously tied up in overstock."
  }
};

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the testimonial quote
  const testimonial = testimonialQuotes.find(q => q.id === id);
  
  // Get extended details
  const details = id ? customerDetails[id] : null;

  if (!testimonial || !details) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Customer Not Found</h1>
          <p className="text-gray-600 mb-6">The customer story you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/customers')}>
            Back to Customers
          </Button>
        </div>
      </div>
    );
  }

  const breadcrumbs = getBreadcrumbPath(`/customers/${id}`);
  const structuredData = generateComprehensiveStructuredData(
    'article',
    {
      title: `${details.name} - StockFlow Customer Success Story`,
      description: details.quote,
      url: `https://www.stockflowsystems.com/customers/${id}`,
      breadcrumbs: breadcrumbs
    }
  );

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={`${details.name} - StockFlow Customer Success Story`}
        description={details.quote}
        keywords={`${details.name}, ${details.company}, stockflow customer, inventory management success story, ${details.industry}`}
        url={`https://www.stockflowsystems.com/customers/${id}`}
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
        <div className="max-w-4xl mx-auto px-4">
          <Link 
            to="/customers"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Customers
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0">
              <img
                src={details.image}
                alt={details.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-1 mb-4">
                {[...Array(details.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {details.name}
              </h1>
              
              <p className="text-xl text-gray-700 mb-2">
                {details.role}, {details.company}
              </p>
              
              <p className="text-gray-600 mb-6">
                {details.location}
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
                <div className="flex items-center gap-2 text-green-700 font-semibold">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-lg">{details.savings}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-start gap-6">
            <Quote className="h-12 w-12 text-blue-100 flex-shrink-0 mt-2" />
            <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 italic leading-relaxed">
              "{details.quote}"
            </blockquote>
          </div>
        </div>
      </section>

      {/* Full Story */}
      {details.fullStory && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">The Full Story</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {details.fullStory}
            </p>
          </div>
        </section>
      )}

      {/* Challenges, Solutions, Results */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Challenges */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Challenges</h3>
                <ul className="space-y-3">
                  {details.challenges.map((challenge, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Solutions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Solutions</h3>
                <ul className="space-y-3">
                  {details.solutions.map((solution, i) => (
                    <li key={i} className="flex items-start gap-2 text-blue-600">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span>{solution}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Results</h3>
                <ul className="space-y-3">
                  {details.results.map((result, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-500" />
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your free trial today and see how much you could save with StockFlow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/auth?mode=register')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full"
            >
              Start Free Trial
            </Button>
            <Button
              onClick={() => navigate('/customers')}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-full"
            >
              View More Stories
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


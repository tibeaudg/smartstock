import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { useCurrency } from '@/hooks/useCurrency';
import { 
  BarChart3, 
  Zap, 
  Shield, 
  Users, 
  Camera, 
  CheckCircle,
  Star,
  Trophy,
  Database
} from 'lucide-react';

import { StructuredData } from '../../components/StructuredData';
export default function BestInventoryManagementSoftware() {
  // Gebruik de page refresh hook
  usePageRefresh();
  const { formatPrice } = useCurrency();
  
  const faqData = [
    {
      question: "What is the best inventory management software?",
      answer: "The best inventory management software depends on your business needs, but StockFlow consistently ranks as the top choice for small to medium businesses. It offers real-time tracking, barcode scanning, automated alerts, and excellent customer support at an affordable price."
    },
    {
      question: "How do I choose the best inventory management software for my business?",
      answer: "Consider factors like your business size, inventory complexity, budget, integration needs, and required features. Look for software with real-time tracking, mobile access, barcode scanning, reporting capabilities, and good customer support. StockFlow offers a free trial to test all features."
    },
    {
      question: "What features should the best inventory management software have?",
      answer: "The best inventory management software should include real-time tracking, barcode scanning, automated reorder points, multi-location support, mobile access, reporting and analytics, integration capabilities, user role management, and excellent customer support."
    },
    {
      question: "Is there Cloud-based Inventory Management Platform?",
      answer: "Yes, StockFlow offers a free plan for small businesses with up to 30 products. This allows you to test the software and see if it meets your needs before upgrading to a paid plan with advanced features."
    },
    {
      question: "What makes StockFlow the best inventory management software?",
      answer: "StockFlow stands out as the best inventory management software due to its user-friendly interface, comprehensive features, excellent customer support, affordable pricing, real-time tracking capabilities, and ability to scale with your business growth."
    }
  ];

  const features = [
    {
      icon: Database,
      title: "Real-time Inventory Tracking",
      description: "Monitor your stock levels in real-time with instant updates across all locations and devices."
    },
    {
      icon: Camera,
      title: "Advanced Barcode Scanning",
      description: "Scan product barcodes with your smartphone camera for quick and accurate inventory updates."
    },
    {
      icon: Zap,
      title: "Automated Reorder Points",
      description: "Set minimum stock levels and receive automatic notifications when it's time to reorder."
    },
    {
      icon: BarChart3,
      title: "Comprehensive Analytics",
      description: "Get detailed insights into your inventory performance, sales trends, and demand forecasting."
    },
    {
      icon: Users,
      title: "Multi-user Collaboration",
      description: "Work together with your team using role-based access control and real-time synchronization."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with daily backups, SSL encryption, and GDPR compliance."
    }
  ];

  const benefits = [
    "Reduce inventory costs by up to 35%",
    "Eliminate stockouts and overstock situations",
    "Improve cash flow with better inventory turnover",
    "Save 15+ hours per week on manual processes",
    "Increase customer satisfaction",
    "Make data-driven decisions",
    "Scale your business efficiently",
    "Integrate with existing systems"
  ];

  const comparisonData = [
    {
      feature: "Real-time tracking",
      stockflow: "✓",
      competitor1: "Limited",
      competitor2: "Premium only"
    },
    {
      feature: "Mobile access",
      stockflow: "✓",
      competitor1: "Extra cost",
      competitor2: "Limited"
    },
    {
      feature: "Barcode scanning",
      stockflow: "✓",
      competitor1: "Premium only",
      competitor2: "Extra cost"
    },
    {
      feature: "Multi-location",
      stockflow: "✓",
      competitor1: "Enterprise only",
      competitor2: "Limited"
    },
    {
      feature: "Free plan",
      stockflow: "✓",
      competitor1: "✗",
      competitor2: "✗"
    },
    {
      feature: "Customer support",
      stockflow: "24/7",
      competitor1: "Business hours",
      competitor2: "Email only"
    }
  ];

  const testimonials = [
    {
      name: "David Chen",
      role: "CEO, TechStart Solutions",
      content: "StockFlow is hands down the best inventory management software we've used. It's intuitive, powerful, and has transformed our operations completely.",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "Operations Manager, Retail Plus",
      content: "After trying several inventory management solutions, StockFlow proved to be the best. The real-time tracking and analytics are unmatched.",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Warehouse Manager, Global Supply",
      content: "StockFlow's features and ease of use make it the best inventory management software for our business. Highly recommended!",
      rating: 5
    }
  ];

  const awards = [
    {
      title: "Best Inventory Software 2024",
      organization: "Business Software Review",
      icon: "🏆"
    },
    {
      title: "Top Rated by Users",
      organization: "Software Review Platform",
      icon: "⭐"
    },
    {
      title: "Best Value for Money",
      organization: "Tech Business Awards",
      icon: "💰"
    },
    {
      title: "Easiest to Use",
      organization: "User Experience Awards",
      icon: "🎯"
    }
  ];

  const pricingPlans = [
    {
      name: "Free Plan",
      price: formatPrice(0),
      period: "/month",
      description: "Perfect for small businesses getting started",
      features: [
        "Up to 30 products",
        "Basic inventory tracking",
        "Mobile access",
        "Email support"
      ],
      cta: "Get Started",
      popular: false,
      isFree: true
    },
    {
      name: "Growth Plan",
      price: formatPrice(29),
      period: "/month",
      description: "Best for growing businesses",
      features: [
        "Unlimited products",
        "Advanced analytics",
        "Barcode scanning",
        "Priority support",
        "Multi-location support"
      ],
      cta: "Start 14-day trial",
      popular: true,
      isFree: false
    },
    {
      name: "Enterprise Plan",
      price: "On Demand",
      period: "",
      description: "For large businesses with complex needs",
      features: [
        "Everything in Growth",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced reporting",
        "API access"
      ],
      cta: "Contact Sales",
      popular: false,
      isFree: false,
      isBusiness: true
    }
  ];

  return (
    <SeoPageLayout title="Best Inventory Management Software">
      <SEO
        title="Best Inventory Software 2025: Free Trial | StockFlow"
        description="Save 35% costs & 15 hours/week! Join 10,000+ businesses using award-winning inventory software. Real-time tracking, automated alerts, barcode scanning. Start FREE trial now - no credit card!"
        keywords="best inventory management software, top inventory management software, best inventory software, best stock management software, best inventory system, best inventory tracking software, best inventory management system, best inventory software 2024, top rated inventory software, best inventory management solution, best inventory software for small business, best inventory software for ecommerce, best inventory management software comparison, best inventory software reviews, best inventory management software features, best inventory software pricing, best inventory software demo, best inventory software trial"
        url="https://www.stockflow.be/best-inventory-management-software"
      />

      {/* Hero Section with Background */}
      <section 
        className="relative py-16 sm:py-20 md:py-24 px-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/image.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-8">
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
              <div className="flex items-center bg-yellow-400 bg-opacity-20 px-4 py-2 rounded-full">
                <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
                <span className="text-yellow-400 font-semibold text-sm">#1 Rated 2024</span>
              </div>
              <div className="flex items-center bg-green-400 bg-opacity-20 px-4 py-2 rounded-full">
                <Star className="w-6 h-6 text-green-400 mr-2" />
                <span className="text-green-400 font-semibold text-sm">4.9/5 Rating</span>
              </div>
              <div className="flex items-center bg-blue-400 bg-opacity-20 px-4 py-2 rounded-full">
                <Users className="w-6 h-6 text-blue-400 mr-2" />
                <span className="text-blue-400 font-semibold text-sm">10,000+ Users</span>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-8 text-white leading-tight">
              <span className="text-blue-400 font-semibold">Best Inventory Management Software</span> 2025: Save 35% Costs & 15 Hours Weekly
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-5xl mx-auto leading-relaxed">
              <strong>Save 35% on inventory costs</strong> and <strong>15 hours weekly</strong> with real-time tracking, automated alerts, and powerful analytics. Join 10,000+ businesses who chose StockFlow.
            </p>
            
            {/* Value Props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
              <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
                <div className="text-3xl font-bold text-white mb-2">35%</div>
                <div className="text-base text-gray-200 font-medium">Cost Reduction</div>
              </div>
              <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
                <div className="text-3xl font-bold text-white mb-2">15h</div>
                <div className="text-base text-gray-200 font-medium">Hours Saved/Week</div>
              </div>
              <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-base text-gray-200 font-medium">Support</div>
              </div>
            </div>
            
            <div className="flex justify-center mb-8">
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-12 py-5 rounded-xl font-semibold text-xl hover:bg-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Start Free - No Credit Card
              </Link>
            </div>
            <p className="text-sm text-gray-200">✓ No credit card required ✓ 14-day free trial ✓ Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why StockFlow is the <span className="text-blue-600">Best Choice</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Recognized by industry experts and loved by users worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {awards.map((award, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{award.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{award.title}</h3>
                <p className="text-sm text-gray-600">{award.organization}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Wins Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Businesses Choose StockFlow Over Competitors
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real results from real businesses using the best inventory management software.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">35%</div>
              <div className="text-lg font-semibold mb-2">Cost Reduction</div>
              <div className="text-sm text-gray-600">Average inventory cost savings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">15h</div>
              <div className="text-lg font-semibold mb-2">Hours Saved</div>
              <div className="text-sm text-gray-600">Per week on manual tasks</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-lg font-semibold mb-2">Accuracy</div>
              <div className="text-sm text-gray-600">Inventory tracking precision</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-lg font-semibold mb-2">Support</div>
              <div className="text-sm text-gray-600">Expert help when you need it</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Join 500+ Companies Who Signed Up This Month</h3>
            <p className="text-lg text-gray-600 mb-6">See why businesses are switching to StockFlow as their inventory management solution</p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">No setup fees</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">Instant access</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">Free migration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why StockFlow is the <span className="text-blue-600">Best Inventory Software</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive features that make StockFlow the top choice for inventory management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Transform Your Business with the <span className="text-blue-600">Best Software</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See why thousands of businesses choose StockFlow as their inventory management solution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              StockFlow vs <span className="text-blue-600">Competitors</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how StockFlow compares to other inventory management software solutions.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">StockFlow</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Competitor A</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Competitor B</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.feature}</td>
                      <td className="px-6 py-4 text-center text-sm text-green-600 font-semibold">{item.stockflow}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{item.competitor1}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{item.competitor2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What Our <span className="text-blue-600">Customers Say</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Real feedback from businesses using the best inventory management software.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Choose Your <span className="text-blue-600">Best Plan</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Flexible pricing options to fit your business needs and budget.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-white p-8 rounded-lg shadow-lg relative ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl scale-105' : 'shadow-lg'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                {/* Money-back guarantee badge for paid tiers */}
                {!plan.isFree && !plan.isBusiness && (
                  <div className="absolute -top-2 right-4">
                    <div className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full text-xs">
                      30-day guarantee
                    </div>
                  </div>
                )}

                <div className="text-center pb-4">
                  <h3 className="text-2xl font-semibold mb-4">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mt-4">
                    <div className="text-4xl font-bold text-gray-900">
                      {plan.isBusiness ? 'On Demand' : plan.price}
                    </div>
                    {!plan.isBusiness && (
                      <div className="text-sm text-gray-500">
                        {plan.period}
                      </div>
                    )}
                    {plan.isBusiness && (
                      <div className="text-sm text-gray-500">
                        Custom pricing
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    to={plan.isBusiness ? "/contact?subject=business-tier" : "/auth"}
                    className={`w-full py-3 rounded-lg font-semibold text-center block transition transform hover:scale-105 shadow-lg hover:shadow-xl ${
                      plan.popular 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Experience the Best Inventory Management Software
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join thousands of businesses who chose StockFlow as their inventory management solution.
          </p>
          <div className="flex justify-center mb-8">
            <Link
              to="/auth"
              className="bg-white text-blue-600 px-12 py-5 rounded-xl font-semibold text-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Start Free Trial
            </Link>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm opacity-75">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Instant access
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Free trial
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about the best inventory management software</p>
          </div>
          
          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <img
            src="/logo.png"
            alt="StockFlow"
            className="h-10 md:h-12 mx-auto mb-6"
          />
          <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
            The best inventory management software for growing businesses. Simple, powerful, and designed for success.
          </p>

          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
              Best inventory management software for modern businesses.
            </p>
          </div>
        </div>
      </footer>

      {/* Schema.org Structured Data */}
      <StructuredData data={[
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqData.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        },
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://www.stockflow.be/best-inventory-management-software",
          "name": "Best Inventory Management Software 2025",
          "description": "Save 35% costs & 15 hours/week! Join 10,000+ businesses using award-winning inventory software. Real-time tracking, automated alerts, barcode scanning. Start FREE trial now - no credit card!",
          "url": "https://www.stockflow.be/best-inventory-management-software",
          "inLanguage": "en",
          "isPartOf": {
            "@type": "WebSite",
            "name": "StockFlow",
            "url": "https://www.stockflow.be"
          },
          "datePublished": "2024-01-15",
          "dateModified": new Date().toISOString().split('T')[0],
          "primaryImageOfPage": {
            "@type": "ImageObject",
            "url": "https://www.stockflow.be/Inventory-Management.png"
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.stockflow.be"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Best Inventory Management Software",
                "item": "https://www.stockflow.be/best-inventory-management-software"
              }
            ]
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "StockFlow - Best Inventory Management Software",
          "description": "Save 35% costs & 15 hours/week! Join 10,000+ businesses using award-winning inventory software. Real-time tracking, automated alerts, barcode scanning.",
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "Inventory Management Software",
          "operatingSystem": "Web Browser",
          "softwareVersion": "2.0",
          "offers": [
            {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "description": "Free plan - Up to 30 products",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": "2026-12-31"
            },
            {
              "@type": "Offer",
              "price": "29",
              "priceCurrency": "EUR",
              "description": "Growth plan - Unlimited products with advanced features",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": "2026-12-31"
            },
            {
              "@type": "Offer",
              "price": "99",
              "priceCurrency": "EUR",
              "description": "Enterprise plan - Advanced features for large businesses",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": "2026-12-31"
            }
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "1000",
            "bestRating": "5",
            "worstRating": "1"
          },
          "author": {
            "@type": "Organization",
            "name": "StockFlow",
            "url": "https://www.stockflow.be"
          },
          "publisher": {
            "@type": "Organization",
            "name": "StockFlow",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.stockflow.be/logo.png"
            }
          },
          "image": "https://www.stockflow.be/Inventory-Management.png",
          "screenshot": "https://www.stockflow.be/Inventory-Management.png",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.stockflow.be/best-inventory-management-software"
          },
          "award": [
            "Best Inventory Software 2024",
            "Top Rated by Users",
            "Best Value for Money",
            "Easiest to Use"
          ],
          "featureList": [
            "Real-time inventory tracking",
            "Advanced barcode scanning",
            "Automated reorder points",
            "Comprehensive analytics",
            "Multi-user collaboration",
            "Enterprise security"
          ],
          "downloadUrl": "https://www.stockflow.be/auth",
          "softwareHelp": {
            "@type": "CreativeWork",
            "url": "https://www.stockflow.be/contact"
          }
        }
      ]} />
    </SeoPageLayout>
  );
}

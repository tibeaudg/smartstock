import React from 'react';
import { Package, BarChart3, Scan, Truck, CheckCircle, ArrowRight, Users, Shield, TrendingUp, Zap, Star, Clock, Euro, Target, ChevronLeft, ChevronRight, Play, Award, Globe, Smartphone, CheckCircle as CheckCircleIcon, Rocket, Crown, Sparkles, Timer, Facebook, Twitter, Linkedin, Instagram, Repeat, Camera, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './HeaderPublic';
import { motion } from 'framer-motion';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import SEO from './SEO';

// Animation components from HomePage
const FadeInWhenVisible = ({ children, delay = 0, direction = 'up', duration = 700 }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    // Reduce animations on mobile for better performance
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getTransform = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) return 'translate-y-0';
    
    switch (direction) {
      case 'left': return isVisible ? 'translate-x-0' : '-translate-x-8';
      case 'right': return isVisible ? 'translate-x-0' : 'translate-x-8';
      case 'up': return isVisible ? 'translate-y-0' : 'translate-y-8';
      case 'down': return isVisible ? 'translate-y-0' : '-translate-y-8';
      default: return isVisible ? 'translate-y-0' : 'translate-y-4';
    }
  };

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-${duration} ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${getTransform()}`}
    >
      {children}
    </div>
  );
};

const SlideInWhenVisible = ({ children, delay = 0, direction = 'left' }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getTransform = () => {
    switch (direction) {
      case 'left': return isVisible ? 'translate-x-0' : '-translate-x-12';
      case 'right': return isVisible ? 'translate-x-0' : 'translate-x-12';
      default: return isVisible ? 'translate-x-0' : '-translate-x-12';
    }
  };

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${getTransform()}`}
    >
      {children}
    </div>
  );
};

const ScaleInWhenVisible = ({ children, delay = 0, duration = 700 }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-${duration} ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      {children}
    </div>
  );
};

const BounceInWhenVisible = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
      }`}
    >
      {children}
    </div>
  );
};

const StaggerInWhenVisible = ({ children, delay = 0, staggerDelay = 100 }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${staggerDelay}ms` }}
    >
      {children}
    </div>
  );
};

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();
  usePageRefresh();

  const featuresData = [
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Comprehensive insights into your inventory performance and business metrics.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      items: [
        "Real-time stock reports",
        "Sales analytics dashboard",
        "Performance metrics",
        "Custom report builder",
      ],
    },
    {
      icon: Scan,
      title: "Barcode Scanning",
      description: "Quick and accurate inventory tracking with mobile barcode scanning.",
      color: "text-green-600",
      bgColor: "bg-green-50",
      items: [
        "Mobile barcode scanner",
        "Batch scanning support",
        "Custom barcode generation",
        "Offline scanning capability",
      ],
    },
    {
      icon: Truck,
      title: "Delivery Management",
      description: "Streamline your delivery process with integrated delivery note management.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      items: [
        "Incoming delivery notes",
        "Outgoing delivery tracking",
        "Supplier management",
        "Delivery scheduling",
      ],
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together seamlessly with role-based access and real-time updates.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      items: [
        "Role-based permissions",
        "Real-time collaboration",
        "Activity tracking",
        "Team notifications",
      ],
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Enterprise-grade security to protect your business data.",
      color: "text-red-600",
      bgColor: "bg-red-50",
      items: [
        "Data encryption",
        "GDPR compliance",
        "Secure backups",
        "Access controls",
      ],
    },
    {
      icon: TrendingUp,
      title: "Growth Analytics",
      description: "Track your business growth with advanced analytics and forecasting.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      items: [
        "Growth metrics",
        "Trend analysis",
        "Forecasting",
        "ROI tracking",
      ],
    },
  ];

  return (
    <>
      <SEO
        title="Powerful Features - StockFlow Inventory Management"
        description="Discover StockFlow's comprehensive inventory management features including barcode scanning, analytics, delivery management, and more. Built for modern businesses."
        keywords="inventory management features, stock management features, barcode scanning, analytics, delivery management, team collaboration, security, growth analytics"
        url="https://www.stockflowsystems.com/features"
      />

      <Header 
        onLoginClick={() => navigate('/auth?mode=login')}
        onNavigate={() => {}}
        simplifiedNav={false}
        hideNotifications={true}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-blue-50 py-16 md:py-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <BounceInWhenVisible delay={200}>
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-light text-gray-800 mb-6 md:mb-8 leading-tight">
                <span className="block">Powerful Features</span>
                <span className="block text-blue-600">for Your Business</span>
              </h1>
            </BounceInWhenVisible>
            
            <FadeInWhenVisible delay={400}>
              <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed">
                Discover how StockFlow's comprehensive tools can revolutionize your inventory management,
                streamline operations, and boost your profitability.
              </p>
            </FadeInWhenVisible>
            
            <ScaleInWhenVisible delay={600}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/auth"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-blue-500/25 border border-blue-500/20"
                >
                  Get Started Free →
                </Link>
              </div>
            </ScaleInWhenVisible>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInWhenVisible delay={200}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-gray-800 mb-6">
                Everything You Need to Manage Your Inventory
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                From real-time tracking to advanced analytics, StockFlow provides all the tools you need to optimize your inventory management.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <StaggerInWhenVisible key={index} delay={index * 100} staggerDelay={index * 100}>
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 group hover:scale-105">
                  <div className={`p-4 rounded-full ${feature.bgColor} mb-6 w-fit group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                    index === 0 ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                    index === 1 ? 'bg-green-600 hover:bg-green-700 text-white' :
                    index === 2 ? 'bg-purple-600 hover:bg-purple-700 text-white' :
                    index === 3 ? 'bg-orange-600 hover:bg-orange-700 text-white' :
                    index === 4 ? 'bg-red-600 hover:bg-red-700 text-white' :
                    'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}>
                    Learn More →
                  </button>
                </div>
              </StaggerInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <FadeInWhenVisible delay={200}>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-gray-800 mb-6">
                More Powerful Features
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                StockFlow offers a complete suite of inventory management tools designed for modern businesses.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Real-time Sync", description: "Instant updates across all devices", icon: Zap },
              { title: "Multi-location", description: "Manage inventory across multiple locations", icon: Globe },
              { title: "Mobile App", description: "Full functionality on your smartphone", icon: Smartphone },
              { title: "API Integration", description: "Connect with your existing systems", icon: Target },
              { title: "Automated Alerts", description: "Never run out of stock again", icon: Bell },
              { title: "Cost Tracking", description: "Monitor your inventory costs", icon: Euro },
              { title: "Supplier Management", description: "Manage all your suppliers", icon: Users },
              { title: "Custom Reports", description: "Generate reports tailored to your needs", icon: BarChart3 },
            ].map((feature, index) => (
              <StaggerInWhenVisible key={index} delay={index * 100} staggerDelay={index * 100}>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </StaggerInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <BounceInWhenVisible delay={200}>
            <h2 className="text-3xl md:text-5xl lg:text-7xl font-light text-gray-800 mb-6">
              Ready to Transform Your Inventory Management?
            </h2>
          </BounceInWhenVisible>
          
          <FadeInWhenVisible delay={400}>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of businesses who trust StockFlow to manage their inventory efficiently and profitably.
            </p>
          </FadeInWhenVisible>
          
          <ScaleInWhenVisible delay={600}>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <Link
                to="/auth"
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-blue-500/25 transform hover:scale-110 transition-all duration-300 border border-blue-500/20"
              >
                Join for Free →
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </ScaleInWhenVisible>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Company Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-3xl flex items-center justify-center mr-3">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-medium text-white">stockflow</span>
            </div>
            
            {/* Pages */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Pages</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>info@stockflow.be</li>
                <li>+32 123 456 789</li>
                <li>Belgium</li>
              </ul>
            </div>
            
            {/* Socials */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Socials</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
            <p>© 2025 StockFlow. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FeaturesPage;


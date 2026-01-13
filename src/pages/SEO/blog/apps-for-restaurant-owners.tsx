import SEO from '@/components/SEO';
import { useLocation } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSeoPageStructuredData } from '@/lib/structuredData';
import { getBreadcrumbPath } from '@/config/topicClusters';

import {
  Utensils,
  CreditCard,
  Users,
  Box,
  Lightbulb,
  Star,
  CalendarCheck,
  Smartphone,
  CheckCircle,
  Clock,
  Zap,
  ShieldCheck
} from 'lucide-react';

export default function RestaurantAppsGuidePage() {
  usePageRefresh();
  const location = useLocation();

  const breadcrumbs = getBreadcrumbPath(location.pathname).map(
    (item, index) => ({
      name: item.name,
      url: item.path,
      position: index + 1,
    })
  );

  const faqData = [
    {
      question: 'What are the best apps for restaurant managers?',
      answer:
        'The best apps for restaurant managers focus on efficiency and automation. Key tools include Square or Toast for POS, 7shifts for labor scheduling, and StockFlow for inventory management. These apps help reduce manual errors and save hours of administrative time each week.',
    },
    {
      question: 'How can an inventory app help reduce restaurant food waste?',
      answer:
        'Inventory apps like StockFlow allow you to set expiration date alerts and low-stock notifications. By tracking stock levels in real-time on mobile devices, managers can maintain leaner "par levels," ensuring fresh ingredients are used before they spoil.',
    },
    {
      question: 'Is it worth using a digital scheduling app like 7shifts?',
      answer:
        'Yes. Digital scheduling apps can reduce time spent on employee rosters by up to 80%. They allow for easy shift swaps, overtime monitoring, and seamless communication with staff, which is much more effective than traditional phone calls or texts.',
    },
    {
      question: 'Why should restaurants use reservation apps like Resy?',
      answer:
        'Reservation apps optimize table seating and send automated confirmations to diners, which significantly reduces no-shows. They also provide valuable guest data and analytics that help restaurant owners improve the overall dining experience.',
    },
  ];

  const structuredData = generateSeoPageStructuredData({
    title: '7 Best Apps for Restaurant Owners in 2026 | StockFlow Guide',
    description:
      'Discover the must-have apps for restaurant management. From POS systems and staff scheduling to mobile inventory and reservation tools.',
    url: location.pathname,
    breadcrumbs,
    faqData,
    softwareData: {
      name: 'StockFlow Hospitality Suite',
      description:
        'A comprehensive mobile inventory system for restaurants to track perishable stock, supplies, and equipment with ease.',
      category: 'BusinessApplication',
      operatingSystem: 'iOS, Android, Web',
      price: '0',
      currency: 'USD',
      features: [
        'Real-time perishable tracking',
        'Expiration date alerts',
        'Mobile QR/Barcode scanning',
        'Multi-unit inventory syncing',
        'Digital supply room management',
      ],
      image: 'https://www.stockflowsystems.com/restaurant-apps-hero.png',
      url: location.pathname,
    },
    pageType: 'software',
    includeWebSite: false,
  });

  const apps = [
    {
      icon: CreditCard,
      title: '1. Square POS',
      description: 'Streamline credit card processing and front-of-house sales. Ideal for quick-service and local favorites.',
    },
    {
      icon: Utensils,
      title: '2. Toast POS',
      description: 'The industry standard for restaurant operations, featuring KDS (Kitchen Display Systems) and gift card management.',
    },
    {
      icon: Users,
      title: '3. 7shifts',
      description: 'Automate staff scheduling and reduce labor costs. Handle shift swaps and time-off requests in one dashboard.',
    },
    {
      icon: Box,
      title: '4. StockFlow Inventory',
      description: 'Track perishables, bar stock, and dry goods. Set reorder alerts so you never run out of critical ingredients.',
    },
    {
      icon: Lightbulb,
      title: '5. Evernote',
      description: 'The ultimate digital binder for menu development, event planning, and collaborating with your culinary team.',
    },
    {
      icon: Star,
      title: '6. Yelp for Business',
      description: 'Manage your online reputation, respond to reviews, and turn browsers into diners with exclusive specials.',
    },
    {
      icon: CalendarCheck,
      title: '7. Resy',
      description: 'Optimize your dining room floor, confirm reservations automatically, and minimize no-shows.',
    },
  ];

  const keyTakeaways = [
    'Integrating the right apps can streamline restaurant operations, reduce costs, and enhance the guest experience.',
    'A mobile inventory app like StockFlow is essential for real-time stock tracking and waste reduction.',
    'Combining front-of-house and back-of-house tools creates a cohesive tech stack that drives efficiency.',
  ];

  return (
    <SeoPageLayout
      title="7 Must-Have Apps for Your Restaurant in 2026"
      heroTitle="7 Must-Have Apps for Your Restaurant in 2026"
      dateUpdated="january 8, 2026"
      faqData={faqData}
      keyTakeaways={keyTakeaways}
    >
      <SEO
        title="7 Must-Have Apps for Your Restaurant 2026 | Hospitality Tech"
        description="Streamline your kitchen and dining room. Explore the top 7 restaurant apps for POS, scheduling, inventory, and reservations."
        keywords="best restaurant apps, restaurant management software, bar inventory app, staff scheduling tool, pos system for restaurants"
        url="https://www.stockflowsystems.com/restaurant-inventory-apps"
        structuredData={structuredData}
      />

      {/* Hero Content Section */}
      <section className="py-20 border-b">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-6">The Modern Restaurant Tech Stack</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            From boutique cafes to high-volume metropolitan bistros, the right technology is the secret ingredient to operational success. <strong>Restaurant management apps</strong> help you control costs, manage labor, and provide a superior guest experience.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Integrating these seven essential tools allows you to stop fighting fires and start focusing on the art of hospitality.
          </p>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Top Tools for Restaurant Owners & Managers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apps.map((app, i) => (
              <div key={i} className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <app.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">{app.title}</h3>
                <p className="text-gray-600 leading-relaxed">{app.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlight: Inventory Control */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold">The Critical Importance of Mobile Inventory</h2>
              <p className="text-gray-600 leading-relaxed">
                In a fast-paced kitchen, paper inventory lists are a liability. <strong>StockFlow</strong> provides a <strong>fully mobile solution</strong> that allows staff to count stock in walk-ins, bars, and supply rooms instantly.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="text-blue-600 w-5 h-5" />
                  <span className="text-sm font-medium">Reduce Count Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="text-blue-600 w-5 h-5" />
                  <span className="text-sm font-medium">Prevent 86’d Items</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-blue-600 w-5 h-5" />
                  <span className="text-sm font-medium">Track Expirations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="text-blue-600 w-5 h-5" />
                  <span className="text-sm font-medium">QR/Barcode Scanning</span>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-blue-900 p-8 rounded-2xl text-white">
              <h4 className="text-xl font-bold mb-4">Beyond Food & Beverage</h4>
              <p className="opacity-90 mb-6">Inventory isn't just what's on the plate. Use StockFlow to track every operational essential:</p>
              <ul className="space-y-3">
                <li className="flex gap-2 items-center"><CheckCircle className="w-5 h-5 text-blue-400" /> Linens, Napkins & Glassware</li>
                <li className="flex gap-2 items-center"><CheckCircle className="w-5 h-5 text-blue-400" /> Cleaning & Sanitization Supplies</li>
                <li className="flex gap-2 items-center"><CheckCircle className="w-5 h-5 text-blue-400" /> Takeout Packaging & Cutlery</li>
                <li className="flex gap-2 items-center"><CheckCircle className="w-5 h-5 text-blue-400" /> Bar Tools & Kitchen Equipment</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Strategy Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Building Your Restaurant Toolkit</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="p-8 bg-white border rounded-2xl shadow-sm">
              <h4 className="text-xl font-bold mb-3">Front of House Focus</h4>
              <p className="text-gray-600 mb-4">Integrate your POS (Toast/Square) with Resy to understand diner behavior and turn guests into regulars through data-driven marketing.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle className="w-4 h-4 text-green-500" /> Table Optimization</li>
                <li className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle className="w-4 h-4 text-green-500" /> Automated Reviews</li>
              </ul>
            </div>
            <div className="p-8 bg-white border rounded-2xl shadow-sm">
              <h4 className="text-xl font-bold mb-3">Back of House Focus</h4>
              <p className="text-gray-600 mb-4">Combine 7shifts with StockFlow to align your labor scheduling with delivery schedules and inventory prep-work requirements.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle className="w-4 h-4 text-green-500" /> Waste Reduction</li>
                <li className="flex items-center gap-2 text-sm text-gray-500"><CheckCircle className="w-4 h-4 text-green-500" /> Overtime Control</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-6xl mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <details key={index} className="bg-gray-50 p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold">{faq.question}</summary>
                <p className="mt-2 text-gray-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
        
      </section>

    </SeoPageLayout>
  );
}
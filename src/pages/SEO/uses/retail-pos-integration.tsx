import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import {
  Store,
  Puzzle,
  BarChart3,
  CreditCard,
  Signal,
  ArrowRight,
  Shield,
  Users,
  ClipboardCheck,
  Star
} from 'lucide-react';

export default function RetailPosIntegration() {
  usePageRefresh();

  const benefits = [
    {
      icon: Puzzle,
      title: 'Connect Leading POS Systems',
      description:
        'Synchronise inventory with Lightspeed, Shopify POS, Square and more using StockFlow integrations or API.'
    },
    {
      icon: Signal,
      title: 'Real-Time Stock Updates',
      description:
        'Automatically push sales, returns and transfers to StockFlow to prevent overselling or empty shelves.'
    },
    {
      icon: CreditCard,
      title: 'Unified Sales & Inventory',
      description:
        'Combine POS revenue data with stock insights so finance teams trust every order and reconciliation report.'
    },
    {
      icon: Shield,
      title: 'Permission-Based Access',
      description:
        'Limit who can adjust stock, approve transfers or manage pricing for each retail location in your network.'
    },
    {
      icon: Users,
      title: 'Empower Store Teams',
      description:
        'Give retail staff mobile access for cycle counts, incoming deliveries and product information updates.'
    },
    {
      icon: ClipboardCheck,
      title: 'Automated Replenishment',
      description:
        'Trigger reorder workflows when POS sales push items below safety stock, keeping the right products on the shelves.'
    }
  ];

  const faq = [
    {
      question: 'Which POS systems integrate with StockFlow?',
      answer:
        'StockFlow offers native connectors for popular POS suites including Shopify POS, Lightspeed, Square and Vend, with an open API for custom integrations.'
    },
    {
      question: 'Does the integration work across multiple stores?',
      answer:
        'Yes. Map individual POS locations to StockFlow warehouses or branches. Stock movements are tracked per location, while head office sees a consolidated view.'
    },
    {
      question: 'How fast are stock levels updated?',
      answer:
        'Sales and returns sync in real time. As soon as a transaction closes in the POS, StockFlow updates the available stock, triggers alerts and adjusts replenishment plans.'
    },
    {
      question: 'Can I manage purchase orders inside StockFlow?',
      answer:
        'Absolutely. Use StockFlow to issue POs, receive goods, and push landed stock levels back to your POS so front-of-house teams always see accurate availability.'
    }
  ];

  return (
    <SeoPageLayout title="Retail POS Integration">
      <SEO
        title="Retail POS Integration | Sync Stores & Stock | StockFlow"
        description="Connect your retail POS with StockFlow inventory management. Sync sales, automate replenishment, and keep every store stocked with the right products."
        keywords="retail POS integration, inventory POS sync, multi store inventory, Shopify POS stockflow integration"
        url="https://www.stockflow.be/retail-pos-integration"
      />

      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Retail POS Integration{' '}
                <span className="text-blue-600">for Connected Stores</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Keep store shelves replenished, sync online and offline sales, and manage stock in one system. StockFlow unites your POS, inventory and purchasing teams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Connect Your POS
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Explore Plans
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-2 text-sm text-gray-600">5.0/5</span>
                </div>
                <span className="text-sm text-gray-600">Retail teams across EU & UK</span>
              </div>
            </div>
            <div>
              <img
                src="/Inventory-Management.png"
                alt="Retail POS integration dashboard"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Integrate Once, Unlock Unified Retail Operations
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto text-center">
            Whether you run a single concept store or dozens of locations, StockFlow keeps stock positions, replenishment and analytics aligned with every POS transaction.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition">
                <benefit.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              From Counter to Warehouse, Everyone Sees the Same Data
            </h2>
            <p className="text-lg opacity-90">
              POS sales sync into StockFlow instantly, enabling automated pick lists, purchase orders and insights on margin by channel. Managers track KPIs while store staff stay focused on customers.
            </p>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="text-xl font-semibold">What you can automate</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• Push every sale/return to StockFlow in real time</li>
                <li>• Trigger replenishment when safety stock is breached</li>
                <li>• Generate cycle-count tasks for store teams</li>
                <li>• Sync product updates and pricing back to the POS</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Important analytics</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• Sell-through by store, supplier and channel</li>
                <li>• Gross margin impact of promotions</li>
                <li>• Shrinkage trends and exception reporting</li>
                <li>• Demand forecasting for seasonal collections</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">FAQ</h2>
          <div className="space-y-6">
            {faq.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-semibold mb-3">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Connect StockFlow to Your POS Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Replace manual reconciliations with a single source of inventory truth. StockFlow keeps every retail touchpoint aligned with live inventory data.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </SeoPageLayout>
  );
}



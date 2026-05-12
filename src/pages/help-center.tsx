import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  HelpCircle,
  Mail,
  ChevronRight,
  Play,
  Clock,
  Star,
  Package,
  Puzzle,
  Smartphone,
  Wrench,
  CreditCard,
} from 'lucide-react';

type FaqCategory =
  | 'Getting Started'
  | 'Inventory Management'
  | 'Billing & Subscriptions'
  | 'Integrations'
  | 'Mobile App'
  | 'Troubleshooting';

type FaqDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

interface FAQItem {
  question: string;
  answer: string;
  category: FaqCategory;
  tags?: string[];
  role?: 'admin' | 'staff';
  lastUpdated?: string;
  difficulty?: FaqDifficulty;
}

interface Category {
  name: FaqCategory;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const categories: Category[] = [
  {
    name: 'Getting Started',
    icon: <Play className="h-7 w-7" />,
    description: 'Set up your workspace, import stock and invite your team.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    name: 'Inventory Management',
    icon: <Package className="h-7 w-7" />,
    description: 'Manage products, track movements and run stock counts.',
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    name: 'Billing & Subscriptions',
    icon: <CreditCard className="h-7 w-7" />,
    description: 'Plans, invoices, payment details and upgrades.',
    color: 'text-violet-600 bg-violet-50',
  },
  {
    name: 'Integrations',
    icon: <Puzzle className="h-7 w-7" />,
    description: 'Connect StockFlow to your existing tools via API.',
    color: 'text-sky-600 bg-sky-50',
  },
  {
    name: 'Mobile App',
    icon: <Smartphone className="h-7 w-7" />,
    description: 'Scan barcodes and adjust stock from your phone.',
    color: 'text-teal-600 bg-teal-50',
  },
  {
    name: 'Troubleshooting',
    icon: <Wrench className="h-7 w-7" />,
    description: 'Diagnose common issues with counts, emails and syncing.',
    color: 'text-orange-600 bg-orange-50',
  },
];

const popularArticles = [
  { title: 'How to set up your first inventory', category: 'Getting Started', readTime: '5 min', views: 1250 },
  { title: 'Using barcode scanning effectively', category: 'Inventory Management', readTime: '3 min', views: 980 },
  { title: 'Mobile app installation guide', category: 'Mobile App', readTime: '4 min', views: 750 },
  { title: 'Understanding stock movements', category: 'Inventory Management', readTime: '6 min', views: 620 },
  { title: 'Setting up user permissions', category: 'Getting Started', readTime: '7 min', views: 580 },
];

const faqsData: FAQItem[] = [
  {
    question: 'How do I create a new inventory?',
    answer: 'Go to Dashboard → Inventory → Products and click on "Add product". Once your products are created, you can group them into locations and warehouses under Warehouse Management.',
    category: 'Getting Started',
    tags: ['inventory', 'products', 'onboarding'],
    difficulty: 'Beginner',
    lastUpdated: 'Jan 2026',
  },
  {
    question: 'What is the best way to onboard my existing stock?',
    answer: 'Use the Excel import option in the Products section to upload your existing items in bulk. We recommend starting with one warehouse and validating key SKUs before importing your full catalog.',
    category: 'Getting Started',
    tags: ['import', 'excel', 'migration'],
    difficulty: 'Intermediate',
    lastUpdated: 'Jan 2026',
  },
  {
    question: 'How do I track stock movements over time?',
    answer: 'Navigate to Inventory → Transactions to see all incoming and outgoing movements. You can filter by product, date range, user, or transaction type to investigate specific changes.',
    category: 'Inventory Management',
    tags: ['transactions', 'audit', 'history'],
    difficulty: 'Intermediate',
    lastUpdated: 'Dec 2025',
  },
  {
    question: 'Can I restrict access to certain products or warehouses?',
    answer: 'Yes. As an admin, go to Settings → Users to assign roles and permissions. You can limit access to specific features such as inventory edits, reporting, or billing settings.',
    category: 'Inventory Management',
    tags: ['permissions', 'roles', 'security'],
    role: 'admin',
    difficulty: 'Advanced',
    lastUpdated: 'Nov 2025',
  },
  {
    question: 'How does billing work and where can I download invoices?',
    answer: 'Billing is managed under Settings → Invoicing. From there you can review your current plan, update payment details, and download past invoices in PDF format.',
    category: 'Billing & Subscriptions',
    tags: ['billing', 'invoices', 'subscription'],
    role: 'admin',
    difficulty: 'Beginner',
    lastUpdated: 'Oct 2025',
  },
  {
    question: 'How do I invite new team members to StockFlow?',
    answer: 'Go to Settings → Users and click "Invite user". Enter their email address, assign a role (Admin or Staff), and they will receive an email with instructions to join your workspace.',
    category: 'Getting Started',
    tags: ['users', 'team', 'invite'],
    role: 'admin',
    difficulty: 'Beginner',
    lastUpdated: 'Sep 2025',
  },
  {
    question: 'How do I connect StockFlow to other systems?',
    answer: 'You can configure integrations from the Integrations page. Depending on the integration, you may need API keys or admin access in the external system. Our step‑by‑step guides walk you through each setup.',
    category: 'Integrations',
    tags: ['integrations', 'api', 'connections'],
    difficulty: 'Intermediate',
    lastUpdated: 'Aug 2025',
  },
  {
    question: 'Is there a mobile app and what can I do with it?',
    answer: 'Yes. The StockFlow mobile app allows you to scan barcodes, receive inventory, and adjust stock levels directly from your phone. It is optimized for warehouse and shop‑floor workflows.',
    category: 'Mobile App',
    tags: ['mobile', 'barcode', 'scanning'],
    difficulty: 'Beginner',
    lastUpdated: 'Aug 2025',
  },
  {
    question: 'What should I do if my stock counts are incorrect?',
    answer: 'Start by reviewing recent transactions for the affected products in the Transactions view. If needed, perform a stock correction from the product detail page and document the reason in the notes field.',
    category: 'Troubleshooting',
    tags: ['stock', 'corrections', 'discrepancies'],
    difficulty: 'Intermediate',
    lastUpdated: 'Jul 2025',
  },
  {
    question: 'Why am I not receiving notification emails?',
    answer: 'Check your spam folder first. If emails are missing, verify your email address under Settings → Profile and ensure that your organisation’s spam filters allow messages from StockFlow.',
    category: 'Troubleshooting',
    tags: ['notifications', 'email', 'support'],
    difficulty: 'Beginner',
    lastUpdated: 'Jul 2025',
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | 'All'>('All');

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return faqsData.filter((faq) => {
      const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
      if (!query) return matchesCategory;
      const haystack = [faq.question, faq.answer, faq.category, ...(faq.tags || [])].join(' ').toLowerCase();
      return matchesCategory && haystack.includes(query);
    });
  }, [searchQuery, selectedCategory]);

  const activeCategory = categories.find((c) => c.name === selectedCategory);

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className="-mx-4 md:-mx-8 -mt-4 md:-mt-8 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 rounded-xl shadow-lg">
        <div className="px-6 py-14 md:py-20 text-center">
          <p className="text-blue-200 text-sm font-medium tracking-wide uppercase mb-3">
            StockFlow Help Center
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Looking for answers? Start here.
          </h1>
          <p className="mt-3 text-blue-100 text-sm max-w-lg mx-auto">
            Guides, FAQs, and troubleshooting for every part of StockFlow.
          </p>
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for a topic, question, or keyword…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) setSelectedCategory('All');
              }}
              className="pl-10 pr-4 h-12 text-sm rounded-xl shadow-lg bg-white border-0 focus-visible:ring-2 focus-visible:ring-white/60"
            />
          </div>
        </div>
      </div>

      {/* ── Categories ──────────────────────────────────────────────────── */}
      <div className="-mx-4 md:-mx-8 ">
        <div className="px-4 md:px-8 py-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6 text-center">
            Browse by topic
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? 'All' : cat.name)}
                className={`flex flex-col items-center gap-3 rounded-xl border p-4 text-center transition-all hover:shadow-md ${
                  selectedCategory === cat.name
                    ? 'border-blue-400 bg-white shadow-md ring-2 ring-blue-200'
                    : 'border-gray-200 bg-white hover:border-blue-200'
                }`}
              >
                <div className={`rounded-lg p-2.5 ${cat.color}`}>{cat.icon}</div>
                <span className="text-xs font-semibold text-gray-800 leading-tight">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ + Popular Articles ───────────────────────────────────────── */}
      <div className="py-10 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Left: FAQ */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {selectedCategory === 'All' ? 'Frequently Asked Questions' : selectedCategory}
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                {filteredFaqs.length} {filteredFaqs.length === 1 ? 'result' : 'results'}
                {selectedCategory !== 'All' && (
                  <button
                    className="ml-2 text-blue-600 hover:underline"
                    onClick={() => setSelectedCategory('All')}
                  >
                    Clear filter
                  </button>
                )}
              </p>
            </div>
            <Badge variant="secondary" className="hidden md:inline-flex items-center gap-1 text-[11px]">
              <Clock className="h-3 w-3" />
              Updated regularly
            </Badge>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
              <HelpCircle className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700">No results found</p>
              <p className="mt-1 text-xs text-gray-500">Try a different keyword or browse all topics above.</p>
              <a href="mailto:support@stockflow.be" className="mt-4 inline-block">
                <Button size="sm" variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Email support
                </Button>
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <details className="group">
                    <summary className="cursor-pointer list-none px-5 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-open:text-blue-700 leading-snug">
                            {faq.question}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                            {activeCategory ? (
                              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${activeCategory.color}`}>
                                {faq.category}
                              </span>
                            ) : (
                              <Badge variant="secondary" className="text-[10px]">{faq.category}</Badge>
                            )}
                            {faq.role && (
                              <Badge variant="secondary" className="text-[10px]">
                                {faq.role === 'admin' ? 'Admin only' : 'Staff'}
                              </Badge>
                            )}
                            {faq.difficulty && (
                              <span className="text-[10px] text-gray-400">{faq.difficulty}</span>
                            )}
                            {faq.lastUpdated && (
                              <span className="text-[10px] text-gray-300">· {faq.lastUpdated}</span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-90" />
                      </div>
                    </summary>
                    <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4 text-xs text-gray-700 leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right: Popular articles + Contact */}
        <aside className="space-y-8">
          {/* Popular articles */}
          <section>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Popular Articles</h3>
            <div className="space-y-2">
              {popularArticles.map((article) => (
                <div
                  key={article.title}
                  className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-blue-200 hover:bg-blue-50/30 transition-colors cursor-pointer group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-800 leading-snug">{article.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" /> {article.readTime}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Star className="h-2.5 w-2.5" /> {article.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300 group-hover:text-blue-400 transition-colors" />
                </div>
              ))}
            </div>
          </section>


        </aside>
      </div>

      {/* ── Footer CTA ──────────────────────────────────────────────────── */}
      <div className="-mx-4 md:-mx-8 -mb-4 md:-mb-8 bg-gradient-to-r from-blue-700 to-blue-500 rounded-xl shadow-md">
        <div className="px-6 py-12 text-center">
          <h2 className="text-xl font-bold text-white">Contact support</h2>
          <p className="mt-2 text-blue-100 text-sm max-w-sm mx-auto">
            Our team is here to help. Reach out and we&apos;ll respond within one business day.
          </p>
          <a href="mailto:support@stockflow.be" className="inline-block mt-6">
            <Button
              size="sm"
              className="bg-white text-blue-700 hover:bg-blue-50 border-0 font-semibold px-6"
            >
              <Mail className="mr-2 h-4 w-4" />
              support@stockflow.be
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

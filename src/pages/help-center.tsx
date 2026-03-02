import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChatModal } from '@/components/ChatModal';


import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Mail,
  ChevronRight,
  Play,
  FileText,
  Users,
  Clock,
  Star
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import SupportModal from '@/components/SupportModal';
import { ContactForm } from '@/components/ContactForm';

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

const categories: {
  name: FaqCategory;
  icon: React.ReactNode;
  articles: number;
  description: string;
}[] = [
  {
    name: 'Getting Started',
    icon: <Play className="h-6 w-6" />,
    articles: 12,
    description: 'Learn the basics of StockFlow'
  },
  {
    name: 'Inventory Management',
    icon: <BookOpen className="h-6 w-6" />,
    articles: 25,
    description: 'Managing your stock and products'
  },
  {
    name: 'Mobile App',
    icon: <Users className="h-6 w-6" />,
    articles: 8,
    description: 'Using the StockFlow mobile app'
  },
  {
    name: 'Billing & Subscriptions',
    icon: <FileText className="h-6 w-6" />,
    articles: 6,
    description: 'Payment and subscription questions'
  },
  {
    name: 'Integrations',
    icon: <HelpCircle className="h-6 w-6" />,
    articles: 15,
    description: 'Connecting with other tools'
  },
  {
    name: 'Troubleshooting',
    icon: <MessageCircle className="h-6 w-6" />,
    articles: 18,
    description: 'Common issues and solutions'
  }
];

const popularArticles = [
  {
    title: 'How to set up your first inventory',
    category: 'Getting Started',
    readTime: '5 min',
    views: 1250
  },
  {
    title: 'Using barcode scanning effectively',
    category: 'Inventory Management',
    readTime: '3 min',
    views: 980
  },
  {
    title: 'Mobile app installation guide',
    category: 'Mobile App',
    readTime: '4 min',
    views: 750
  },
  {
    title: 'Understanding stock movements',
    category: 'Inventory Management',
    readTime: '6 min',
    views: 620
  },
  {
    title: 'Setting up user permissions',
    category: 'Getting Started',
    readTime: '7 min',
    views: 580
  }
];

const faqsData: FAQItem[] = [
  {
    question: 'How do I create a new inventory?',
    answer:
      'Go to Dashboard \u2192 Inventory \u2192 Products and click on \u201cAdd product\u201d. Once your products are created, you can group them into locations and warehouses under Warehouse Management.',
    category: 'Getting Started',
    tags: ['inventory', 'products', 'onboarding'],
    difficulty: 'Beginner',
    lastUpdated: 'Jan 2026',
  },
  {
    question: 'What is the best way to onboard my existing stock?',
    answer:
      'Use the Excel import option in the Products section to upload your existing items in bulk. We recommend starting with one warehouse and validating key SKUs before importing your full catalog.',
    category: 'Getting Started',
    tags: ['import', 'excel', 'migration'],
    difficulty: 'Intermediate',
    lastUpdated: 'Jan 2026',
  },
  {
    question: 'How do I track stock movements over time?',
    answer:
      'Navigate to Inventory \u2192 Transactions to see all incoming and outgoing movements. You can filter by product, date range, user, or transaction type to investigate specific changes.',
    category: 'Inventory Management',
    tags: ['transactions', 'audit', 'history'],
    difficulty: 'Intermediate',
    lastUpdated: 'Dec 2025',
  },
  {
    question: 'Can I restrict access to certain products or warehouses?',
    answer:
      'Yes. As an admin, go to Settings \u2192 Users to assign roles and permissions. You can limit access to specific features such as inventory edits, reporting, or billing settings.',
    category: 'Inventory Management',
    tags: ['permissions', 'roles', 'security'],
    role: 'admin',
    difficulty: 'Advanced',
    lastUpdated: 'Nov 2025',
  },
  {
    question: 'How does billing work and where can I download invoices?',
    answer:
      'Billing is managed under Settings \u2192 Invoicing. From there you can review your current plan, update payment details, and download past invoices in PDF format.',
    category: 'Billing & Subscriptions',
    tags: ['billing', 'invoices', 'subscription'],
    role: 'admin',
    difficulty: 'Beginner',
    lastUpdated: 'Oct 2025',
  },
  {
    question: 'How do I invite new team members to StockFlow?',
    answer:
      'Go to Settings \u2192 Users and click \u201cInvite user\u201d. Enter their email address, assign a role (Admin or Staff), and they will receive an email with instructions to join your workspace.',
    category: 'Getting Started',
    tags: ['users', 'team', 'invite'],
    role: 'admin',
    difficulty: 'Beginner',
    lastUpdated: 'Sep 2025',
  },
  {
    question: 'How do I connect StockFlow to other systems?',
    answer:
      'You can configure integrations from the Integrations page. Depending on the integration, you may need API keys or admin access in the external system. Our step\u2011by\u2011step guides walk you through each setup.',
    category: 'Integrations',
    tags: ['integrations', 'api', 'connections'],
    difficulty: 'Intermediate',
    lastUpdated: 'Aug 2025',
  },
  {
    question: 'Is there a mobile app and what can I do with it?',
    answer:
      'Yes. The StockFlow mobile app allows you to scan barcodes, receive inventory, and adjust stock levels directly from your phone. It is optimized for warehouse and shop\u2011floor workflows.',
    category: 'Mobile App',
    tags: ['mobile', 'barcode', 'scanning'],
    difficulty: 'Beginner',
    lastUpdated: 'Aug 2025',
  },
  {
    question: 'What should I do if my stock counts are incorrect?',
    answer:
      'Start by reviewing recent transactions for the affected products in the Transactions view. If needed, perform a stock correction from the product detail page and document the reason in the notes field.',
    category: 'Troubleshooting',
    tags: ['stock', 'corrections', 'discrepancies'],
    difficulty: 'Intermediate',
    lastUpdated: 'Jul 2025',
  },
  {
    question: 'Why am I not receiving notification emails?',
    answer:
      'Check your spam folder first. If emails are missing, verify your email address under Settings \u2192 Profile and ensure that your organization\u2019s spam filters allow messages from StockFlow.',
    category: 'Troubleshooting',
    tags: ['notifications', 'email', 'support'],
    difficulty: 'Beginner',
    lastUpdated: 'Jul 2025',
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | 'All'>('All');
  const { unreadCount: unreadMessages, resetUnreadCount } = useUnreadMessages();
  const supportOptions = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: <MessageCircle className="h-8 w-8" />,
      availability: 'Available 24/7',
      responseTime: '< 5 minutes',
      button: 'Start Chat',
      onClick: () => setChatOpen(true)
    },
    {
      title: 'Email Support',
      description: 'Send us your questions via email',
      icon: <Mail className="h-8 w-8" />,
      availability: 'Monday - Friday: 9:00 - 17:00',
      responseTime: 'Typical response within 1 business day',
      button: 'info@stockflow.be',
      onClick: () => {
        const link = document.createElement('a');
        link.href = 'mailto:info@stockflow.be';
        link.click();
      }
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      icon: <Video className="h-8 w-8" />,
      availability: 'Always available',
      responseTime: 'Instant access',
      button: 'Open tutorials',
      onClick: () => window.open('/videos')
    }
  ];

  const filteredFaqs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return faqsData.filter((faq) => {
      const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;

      if (!query) {
        return matchesCategory;
      }

      const haystack = [
        faq.question,
        faq.answer,
        faq.category,
        ...(faq.tags || []),
      ]
        .join(' ')
        .toLowerCase();

      return matchesCategory && haystack.includes(query);
    });
  }, [searchQuery, selectedCategory]);

  const filteredArticles = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return popularArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'All' || article.category === selectedCategory;

      if (!query) {
        return matchesCategory;
      }

      const haystack = `${article.title} ${article.category}`.toLowerCase();
      return matchesCategory && haystack.includes(query);
    });
  }, [searchQuery, selectedCategory]);

  const hasSearchResults = filteredFaqs.length > 0 || filteredArticles.length > 0;

  return (
    <>
      <div className="space-y-10">
        {/* Page header & search */}
        <section aria-labelledby="help-center-header">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                <HelpCircle className="h-4 w-4" />
                <span>Support &amp; Documentation</span>
              </div>
              <h1
                id="help-center-header"
                className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight text-gray-900"
              >
                Help Center
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600">
                Search best‑practice guides, FAQs, and troubleshooting steps for StockFlow. If
                you can&apos;t find what you need, our team is one click away.
              </p>
            </div>
            {typeof unreadMessages === 'number' && unreadMessages > 0 && (
              <div className="hidden md:flex flex-col items-end text-xs text-gray-500">
                <span className="font-medium text-gray-700">
                  {unreadMessages} unread message{unreadMessages === 1 ? '' : 's'}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-2"
                  onClick={() => setChatOpen(true)}
                >
                  Reopen chat
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by question, topic, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 text-sm"
              />
            </div>
            <p className="text-xs text-gray-500">
              Search looks through FAQs and popular articles. For urgent production issues,
              use live chat or email support.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-medium text-gray-500">Filter by topic:</span>
              <Button
                size="sm"
                variant={selectedCategory === 'All' ? 'default' : 'secondary'}
                className="text-xs"
                onClick={() => setSelectedCategory('All')}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.name}
                  size="sm"
                  variant={selectedCategory === category.name ? 'default' : 'secondary'}
                  className="text-xs"
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
          {/* Left column: FAQs */}
          <section aria-labelledby="faq-heading" className="space-y-6">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 id="faq-heading" className="text-lg font-semibold text-gray-900">
                  Frequently Asked Questions
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Curated answers for the most common workflows and configuration questions.
                </p>
              </div>
              <Badge variant="secondary" className="hidden md:inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Updated regularly</span>
              </Badge>
            </div>

            {filteredFaqs.length === 0 ? (
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-sm">No FAQs match your search</CardTitle>
                  <CardDescription className="text-xs">
                    Try a different keyword, or reach out to our team for personal assistance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button size="sm" onClick={() => setChatOpen(true)}>
                    Open live chat
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setSupportOpen(true)}>
                    Contact support
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {filteredFaqs.map((faq) => (
                  <Card
                    key={faq.question}
                    className="overflow-hidden border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all"
                  >
                    <details className="group">
                      <summary className="cursor-pointer list-none px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900 group-open:text-blue-700">
                              {faq.question}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <Badge variant="secondary" className="text-[10px]">
                                {faq.category}
                              </Badge>
                              {faq.role && (
                                <Badge variant="secondary" className="text-[10px]">
                                  {faq.role === 'admin' ? 'Admin' : 'Staff'}
                                </Badge>
                              )}
                              {faq.difficulty && (
                                <span className="text-[10px] text-gray-500">
                                  Difficulty: {faq.difficulty}
                                </span>
                              )}
                              {faq.lastUpdated && (
                                <span className="text-[10px] text-gray-400">
                                  Last updated {faq.lastUpdated}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform group-open:rotate-90" />
                        </div>
                      </summary>
                      <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-700">
                        {faq.answer}
                      </div>
                    </details>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Right column: Support options, contact & popular articles */}
          <section aria-labelledby="support-heading" className="space-y-6">
            <div>
              <h2 id="support-heading" className="text-lg font-semibold text-gray-900">
                Get Support
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                Choose the best way to reach our team for assistance.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {supportOptions.map((option, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        {option.icon}
                      </div>
                      <CardTitle className="text-sm">{option.title}</CardTitle>
                    </div>
                    <CardDescription className="text-xs">{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{option.availability}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Star className="h-3 w-3" />
                      <span>{option.responseTime}</span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-3"
                      onClick={option.onClick}
                    >
                      {option.button}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <section aria-labelledby="contact-heading" className="space-y-4">
              <div>
                <h3 id="contact-heading" className="text-sm font-semibold text-gray-900">
                  Contact Us
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Send us a message and we&apos;ll get back to you as soon as possible.
                </p>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <ContactForm />
                </CardContent>
              </Card>
            </section>

            <section aria-labelledby="popular-heading" className="space-y-4">
              <div>
                <h3 id="popular-heading" className="text-sm font-semibold text-gray-900">
                  Popular Articles
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Most viewed help articles and guides.
                </p>
              </div>
              {filteredArticles.length === 0 && hasSearchResults ? (
                <p className="text-xs text-gray-500">
                  No popular articles match your filters, but you may still find answers in
                  the FAQ section.
                </p>
              ) : (
                <div className="grid gap-3">
                  {filteredArticles.map((article, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary" className="text-[10px]">
                            {article.category}
                          </Badge>
                          <span className="text-xs text-gray-500">{article.readTime}</span>
                        </div>
                        <CardTitle className="text-sm hover:text-blue-600 transition-colors">
                          {article.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-xs text-gray-500">
                          <Users className="h-3 w-3 mr-1" />
                          {article.views.toLocaleString()} views
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </section>
        </div>
      </div>

      {/* Support & chat overlays */}
      {chatOpen && createPortal(
        <ChatModal
          open={chatOpen}
          onClose={() => {
            setChatOpen(false);
            resetUnreadCount();
          }}
          aria-describedby="chat-modal-description"
          resetUnreadMessages={resetUnreadCount}
        />,
        document.body
      )}

      {supportOpen && createPortal(
        <SupportModal
          open={supportOpen}
          onClose={() => setSupportOpen(false)}
          aria-describedby="support-modal-description"
        />,
        document.body
      )}
    </>
  );
}
import { Link, useLocation } from 'react-router-dom';
import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSidebarContent } from '@/utils/seoPageHelpers';
import { StructuredData } from '@/components/StructuredData';

type FAQ = {
  question: string;
  answer: string;
};

type GlossaryPageConfig = {
  path: string;
  title: string;
  shortDescription?: string;
  definition: string;
  metaDescription?: string;
  keywords?: string[];
  keyTakeaways?: string[];
  faqs?: FAQ[];
  relatedLinks?: Array<{ label: string; href: string }>;
};

export function createGlossaryPage(config: GlossaryPageConfig) {
  const {
    path,
    title,
    shortDescription = config.definition,
    definition,
    metaDescription = config.definition,
    keywords = [],
    keyTakeaways,
    faqs,
    relatedLinks = [],
  } = config;

  const baseKeywords = [
    title,
    `${title} definition`,
    `${title} meaning`,
    `${title} inventory`,
    `${title} stockflow`,
    'inventory glossary',
    'inventory definitions',
    'stockflow glossary',
  ];

  const pageKeywords = Array.from(new Set([...baseKeywords, ...keywords])).join(', ');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: title,
    description: definition,
    inDefinedTermSet: 'https://www.stockflow.be/glossary',
    url: `https://www.stockflow.be${path}`,
  };

  return function GlossaryPage() {
    usePageRefresh();
    const location = useLocation();

    const sidebarContent = generateSidebarContent(location.pathname, [
      { id: 'overview', title: `What is ${title}?`, level: 1 },
      { id: 'takeaways', title: 'Key Takeaways', level: 1 },
      { id: 'faq', title: 'FAQ', level: 1 },
    ]);

    const takeaways = keyTakeaways ?? [
      `Understand how ${title.toLowerCase()} fits into your inventory workflows.`,
      `Use StockFlow to measure and track ${title.toLowerCase()} in real time.`,
      `Automate updates and share ${title.toLowerCase()} insights with your team.`,
    ];

    const faqData: FAQ[] = faqs ?? [
      {
        question: `What does ${title} mean?`,
        answer: definition,
      },
      {
        question: `How does StockFlow support ${title.toLowerCase()}?`,
        answer: `StockFlow gives you real-time visibility into your inventory data so you can monitor ${title.toLowerCase()} trends, set alerts, and share updates across your team.`,
      },
    ];

    return (
      <SeoPageLayout 
        title={title} 
        heroTitle={title}
        updatedDate="20/11/2025"
        faqData={faqData}
         
        
      >
        <SEO
          title={`${title} 2025 - Inventory Management Glossary | StockFlow`}
          description={metaDescription}
          keywords={pageKeywords}
          url={`https://www.stockflow.be${path}`}
        />

      <StructuredData data={jsonLd} />

        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-6 py-16 text-white shadow-xl">
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" aria-hidden="true" />
          <div className="relative mx-auto flex max-w-4xl flex-col gap-6 text-center">
            <span className="inline-flex w-fit items-center justify-center rounded-full bg-white/10 px-4 py-1 text-sm font-medium uppercase tracking-wide">
              Inventory Glossary
            </span>
            <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">{title}</h2>
            <p className="text-lg text-white/90 md:text-xl">{shortDescription}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/auth"
                className="rounded-full bg-white px-6 py-3 text-base font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-xl"
              >
                Try StockFlow Free
              </Link>
              <a
                href="#overview"
                className="rounded-full border border-white/40 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Explore Definition
              </a>
            </div>
          </div>
        </header>

        <section id="overview" className="mt-16 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">What is {title}?</h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-700">{definition}</p>
        </section>

        <section id="takeaways" className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Key Takeaways</h2>
            <span className="rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-600">
              StockFlow Insights
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {takeaways.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                    ?
                  </span>
                  <p className="text-base text-slate-700">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mt-16 rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-inner">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-6">
            {faqData.map((faqItem) => (
              <details
                key={faqItem.question}
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200"
              >
                <summary className="cursor-pointer text-lg font-semibold text-slate-900">
                  {faqItem.question}
                </summary>
                <p className="mt-4 text-base leading-relaxed text-slate-700">{faqItem.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {relatedLinks.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900">Explore Related Glossary Terms</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-400 hover:text-blue-600"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        )}
      </SeoPageLayout>
    );
  };
}

export type { GlossaryPageConfig };




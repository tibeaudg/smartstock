import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
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
    inDefinedTermSet: 'https://www.stockflowsystems.com/glossary',
    url: `https://www.stockflowsystems.com${path}`,
  };

  return function GlossaryPage() {
    usePageRefresh();

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
        updatedDate="06/01/2026"
        faqData={faqData}
         
        
      >
        <SEO
          title={`${title} 2025 - Inventory Management Glossary | StockFlow`}
          description={metaDescription}
          keywords={pageKeywords}
          url={`https://www.stockflowsystems.com${path}`}
        />

      <StructuredData data={[jsonLd]} />

      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg black leading-relaxed mb-6">
          {definition}
        </p>
      </div>

      {/* Key Takeaway Box */}
      {takeaways.length > 0 && (
        <div className="my-12 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
          <p className="text-base text-slate-800 leading-relaxed m-0">
            <strong className="text-blue-900">Key Insight:</strong> {takeaways[0]}
          </p>
        </div>
      )}

      {/* Main Content Section */}
      <h1 className="text-5xl font-bold text-black mt-16 mb-6 pb-3 border-b-2 border-slate-200">
        What is {title}?
      </h1>
      <p className="text-lg text-black font-medium leading-relaxed mb-8">
        {shortDescription}
      </p>

      {takeaways.length > 1 && (
        <div className="space-y-10 mb-12">
          {takeaways.slice(1).map((item, index) => (
            <div key={index}>
              <h3 className="text-2xl font-semibold text-black mb-4 mt-8">
                {index + 2}. Key Takeaway
              </h3>
              <p className="text-base black leading-relaxed mb-4">
                {item}
              </p>
            </div>
          ))}
        </div>
      )}

      {relatedLinks.length > 0 && (
        <div className="my-12 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <h2 className="text-2xl font-bold text-black mb-4">
            Related Glossary Terms
          </h2>
          <div className="flex flex-wrap gap-3">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="inline-flex items-center rounded-full border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 transition hover:border-blue-400 hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
      </SeoPageLayout>
    );
  };
}

export type { GlossaryPageConfig };




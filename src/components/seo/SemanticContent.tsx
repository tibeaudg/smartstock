import React from 'react';

/**
 * Semantic content wrapper components for better SEO
 */

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

/**
 * Semantic section wrapper with proper heading hierarchy
 */
export const SemanticSection: React.FC<SectionProps & { heading?: string; level?: 1 | 2 | 3 }> = ({
  id,
  heading,
  level = 2,
  children,
  className = '',
  ariaLabel
}) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <section 
      id={id}
      className={className}
      aria-labelledby={heading ? `${id}-heading` : undefined}
      aria-label={ariaLabel}
    >
      {heading && (
        <HeadingTag id={`${id}-heading`} className="scroll-mt-24">
          {heading}
        </HeadingTag>
      )}
      {children}
    </section>
  );
};

/**
 * Key points/benefits list with semantic markup
 */
interface KeyPointsProps {
  items: Array<{ title: string; description: string; icon?: React.ReactNode }>;
  columns?: 1 | 2 | 3;
}

export const KeyPoints: React.FC<KeyPointsProps> = ({ items, columns = 3 }) => {
  const gridCols = columns === 1 ? 'grid-cols-1' : columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  
  return (
    <ul className={`grid ${gridCols} gap-6`} role="list">
      {items.map((item, index) => (
        <li key={index} className="bg-white rounded-lg p-6 border border-slate-200 hover:shadow-md transition-shadow">
          {item.icon && <div className="mb-4">{item.icon}</div>}
          <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
          <p className="text-slate-600">{item.description}</p>
        </li>
      ))}
    </ul>
  );
};

/**
 * Statistics/numbers display with semantic markup
 */
interface StatisticsProps {
  items: Array<{ value: string; label: string; description?: string }>;
}

export const Statistics: React.FC<StatisticsProps> = ({ items }) => {
  return (
    <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <div key={index} className="text-center">
          <dt className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
            {item.value}
          </dt>
          <dd className="text-lg font-semibold text-slate-900 mb-1">
            {item.label}
          </dd>
          {item.description && (
            <dd className="text-sm text-slate-600">{item.description}</dd>
          )}
        </div>
      ))}
    </dl>
  );
};

/**
 * Comparison table with semantic markup
 */
interface ComparisonRow {
  feature: string;
  withSolution: string | React.ReactNode;
  withoutSolution: string | React.ReactNode;
}

interface ComparisonTableProps {
  title: string;
  rows: ComparisonRow[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ title, rows }) => {
  return (
    <figure className="overflow-x-auto my-8">
      <table className="min-w-full border-collapse border border-slate-300">
        <caption className="text-xl font-bold text-slate-900 mb-4 text-left">
          {title}
        </caption>
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-900">
              Feature
            </th>
            <th className="border border-slate-300 px-4 py-3 text-center font-semibold text-green-700">
              With StockFlow
            </th>
            <th className="border border-slate-300 px-4 py-3 text-center font-semibold text-red-700">
              Without Solution
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="hover:bg-slate-50">
              <td className="border border-slate-300 px-4 py-3 font-medium text-slate-900">
                {row.feature}
              </td>
              <td className="border border-slate-300 px-4 py-3 text-center text-green-700">
                {row.withSolution}
              </td>
              <td className="border border-slate-300 px-4 py-3 text-center text-red-700">
                {row.withoutSolution}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};

/**
 * Call-to-action within content
 */
interface InlineCTAProps {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const InlineCTA: React.FC<InlineCTAProps> = ({ 
  text, 
  href, 
  variant = 'primary',
  className = ''
}) => {
  const baseClasses = "inline-flex items-center gap-2 font-semibold rounded-lg px-4 py-2 transition-all hover:scale-105";
  const variantClasses = variant === 'primary' 
    ? "bg-blue-600 text-white hover:bg-blue-700"
    : "bg-slate-100 text-slate-900 hover:bg-slate-200";
  
  return (
    <a 
      href={href}
      className={`${baseClasses} ${variantClasses} ${className}`}
      data-analytics-id={`inline-cta-${href.replace(/\//g, '-')}`}
    >
      {text}
    </a>
  );
};


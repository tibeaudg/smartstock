import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SEO from '@/components/SEO';
import SeoPageLayout from '@/components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { generateSidebarContent } from '@/utils/seoPageHelpers';
import { StructuredData } from '@/components/StructuredData';

type GlossaryLink = {
  term: string;
  summary: string;
  href: string;
};

type GlossarySection = {
  letter: string;
  items: GlossaryLink[];
};

const glossarySections: GlossarySection[] = [
  {
    letter: '#',
    items: [
      {
        term: '80/20 Inventory Rule',
        summary:
          'The 80/20 inventory rule states that 80% of your profits should come from 20% of your inventory. The rule is based on the Pareto Principle, which suggests that 80% of effects come from 20% of causes.',
        href: '/glossary/80-20-inventory-rule',
      },
    ],
  },
  {
    letter: 'A',
    items: [
      {
        term: 'Asset Control',
        summary:
          'Asset control, also called asset tracking, is the process companies use to organize, track, audit, and record critical information about long-term assets.',
        href: '/glossary/asset-control',
      },
      {
        term: 'Asset Tracking',
        summary:
          'Asset tracking is the process of continually managing the assets your business owns—such as equipment, tools, and technology—as they change hands, locations, and value.',
        href: '/asset-tracking',
      },
    ],
  },
  {
    letter: 'B',
    items: [
      {
        term: 'Bill of Materials (BOM)',
        summary:
          'A bill of materials (BOM) is an itemized list of every raw material, part, and component needed to manufacture a product, including quantities and supporting documents.',
        href: '/glossary/bill-of-materials',
      },
    ],
  },
  {
    letter: 'C',
    items: [
      {
        term: 'Consignment Inventory',
        summary:
          'Consignment inventory is a strategy where a retailer sells products that remain owned by the supplier until the moment of sale.',
        href: '/glossary/consignment-inventory',
      },
    ],
  },
  {
    letter: 'E',
    items: [
      {
        term: 'Economic Order Quantity (EOQ)',
        summary:
          'Economic order quantity reveals precisely how much of a product you should order to meet demand while minimizing holding and ordering costs.',
        href: '/glossary/economic-order-quantity',
      },
    ],
  },
  {
    letter: 'H',
    items: [
      {
        term: 'Hedging Inventory',
        summary:
          'Hedging inventory is inventory purchased in anticipation of significant events that could make essential items too difficult or expensive to acquire later.',
        href: '/glossary/hedging-inventory',
      },
    ],
  },
  {
    letter: 'I',
    items: [
      {
        term: 'Inventory',
        summary: 'Inventory includes the goods, materials, and assets a business carries for day-to-day operations.',
        href: '/glossary/inventory',
      },
      {
        term: 'Inventory Asset',
        summary:
          'Inventory assets are reusable items a company owns—such as equipment or machinery—that support the creation of products or services.',
        href: '/glossary/inventory-asset',
      },
      {
        term: 'Inventory Automation',
        summary:
          'Inventory automation uses software and related technology, including barcodes or QR codes, to digitize inventory processes and eliminate manual tracking.',
        href: '/glossary/inventory-automation',
      },
      {
        term: 'Inventory Cycle Counting',
        summary:
          'Inventory cycle counting is an approach that counts specific portions of inventory on a rotating schedule throughout the year.',
        href: '/glossary/inventory-cycle-counting',
      },
      {
        term: 'Inventory List',
        summary:
          'An inventory list is a complete, itemized record of every product your business has in stock, including raw materials, WIP items, and finished goods.',
        href: '/glossary/inventory-list',
      },
      {
        term: 'Inventory Management',
        summary:
          'Inventory management is the process of ordering, organizing, storing, and utilizing inventory so your business runs smoothly.',
        href: '/inventory-management',
      },
      {
        term: 'Inventory Optimization',
        summary:
          'Inventory optimization keeps inventory levels “just right” so you can satisfy demand while avoiding stockouts, overstock, and obsolescence.',
        href: '/glossary/inventory-optimization',
      },
      {
        term: 'Inventory Turnover',
        summary:
          'Inventory turnover measures how many times inventory is sold and replaced over a specific period, revealing whether stock levels are excessive.',
        href: '/glossary/inventory-turnover',
      },
    ],
  },
  {
    letter: 'J',
    items: [
      {
        term: 'Just in Time Inventory',
        summary:
          'Just in time inventory (JIT) keeps stock levels as low as possible to reduce costs, increase efficiency, and minimize waste.',
        href: '/glossary/just-in-time-inventory',
      },
    ],
  },
  {
    letter: 'K',
    items: [
      {
        term: 'Kitting',
        summary:
          'Kitting bundles individual pieces or parts into a single tracked unit so the kit can be used or sold as one item.',
        href: '/glossary/kitting',
      },
    ],
  },
  {
    letter: 'L',
    items: [
      {
        term: 'Landed Cost',
        summary:
          'Landed cost (true cost) combines production costs with every tax, fee, and shipping charge required to get a product to its destination.',
        href: '/glossary/landed-cost',
      },
      {
        term: 'Lead Time',
        summary: 'Lead time is the number of days it takes to receive an order after it is placed.',
        href: '/what-is-lead-time',
      },
    ],
  },
  {
    letter: 'M',
    items: [
      {
        term: 'Minimum Order Quantity',
        summary: 'Minimum order quantity is the smallest amount of product a supplier will sell in a single order.',
        href: '/glossary/minimum-order-quantity',
      },
      {
        term: 'Moving Average Cost',
        summary:
          'Moving average cost combines the value of inventory on hand with the cost of recent purchases and divides by total units in stock.',
        href: '/glossary/moving-average-cost',
      },
      {
        term: 'MRO Inventory',
        summary:
          'MRO (maintenance, repair, and operations) inventory includes items that keep assets maintained and daily operations running, even though they are not sold to customers.',
        href: '/glossary/mro-inventory',
      },
    ],
  },
  {
    letter: 'P',
    items: [
      {
        term: 'Pick List',
        summary:
          'A pick list is a document that tells warehouse pickers exactly which items are needed to fulfill a customer order.',
        href: '/glossary/pick-list',
      },
      {
        term: 'Purchase Requisition',
        summary:
          'A purchase requisition is an internal document used to notify purchasing teams about inventory or assets the company intends to buy.',
        href: '/glossary/purchase-requisition',
      },
    ],
  },
  {
    letter: 'S',
    items: [
      {
        term: 'Safety Stock',
        summary:
          'Safety stock (buffer stock) is extra inventory kept on hand to cover unexpected delays, disruptions, or spikes in demand.',
        href: '/glossary/safety-stock',
      },
      {
        term: 'Supplier Relationship Management (SRM)',
        summary:
          'Supplier relationship management ensures supplier partnerships stay optimized, coordinated, and profitable.',
        href: '/glossary/supplier-relationship-management',
      },
    ],
  },
  {
    letter: 'U',
    items: [
      {
        term: 'UOM Inventory',
        summary:
          'Inventory units of measure (UoM) define the standardized units you use to count, order, and sell your stock.',
        href: '/glossary/uom-inventory',
      },
    ],
  },
  {
    letter: 'V',
    items: [
      {
        term: 'Vendor Managed Inventory (VMI)',
        summary:
          'Vendor managed inventory is a supply chain arrangement where a supplier or partner manages inventory levels and replenishment on behalf of the seller.',
        href: '/glossary/vendor-managed-inventory',
      },
    ],
  },
  {
    letter: 'W',
    items: [
      {
        term: 'Warehouse Management',
        summary:
          'Warehouse management covers daily warehouse operations, from ordering inventory to tracking, storing, and fulfilling orders.',
        href: '/warehouse-management',
      },
      {
        term: 'Warehouse Management System (WMS)',
        summary:
          'A warehouse management system (WMS) gives you visibility into inventory, assets, logistics, and fulfillment operations across your business.',
        href: '/warehouse-management-system',
      },
    ],
  },
];

export default function GlossaryHomePage() {
  usePageRefresh();
  const location = useLocation();


  const letterLinks = glossarySections.map((section) => section.letter);
  const itemListStructuredData = useMemo(() => {
    const items = glossarySections.flatMap((section, sectionIndex) =>
      section.items.map((item, itemIndex) => ({
        '@type': 'DefinedTerm',
        name: item.term,
        description: item.summary,
        url: `https://www.stockflow.be${item.href}`,
        position: sectionIndex * 10 + itemIndex + 1,
      })),
    );

    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Inventory Management Glossary',
      itemListElement: items,
    };
  }, []);

  return (
    <SeoPageLayout 
      title="Inventory Management Glossary"
      heroTitle="Your Guide to Inventory Management Terms"
    >
      <SEO
        title="Index 2025 - Index 2025 -"
        description="Find out how index to save time and money. Discover how index to choose the best software. Explore the. Try free now. StockFlow helps businesses manage inven..."
        keywords="inventory glossary, warehouse glossary, supply chain glossary, inventory definitions, stockflow glossary"
        url="https://www.stockflow.be/glossary"
      />

      <StructuredData data={itemListStructuredData} />

      <section id="overview" className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-lg text-gray-700 leading-relaxed">
            These key terms and concepts help you make educated decisions about how to manage your inventory. Browse the glossary to learn how each concept connects to better control, accuracy, and collaboration.
          </p>
        </div>
      </section>

      <section id="letters" className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900">Browse by Letter</h2>
        <p className="mt-3 text-base text-slate-600">
          Scroll to terms starting with:
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {letterLinks.map((letter) => {
            const anchorId = letter === '#' ? 'number' : letter.toLowerCase();
            return (
              <a
                key={letter}
                href={`#letter-${anchorId}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600"
              >
                {letter}
              </a>
            );
          })}
        </div>
      </section>

      <section id="glossary" className="mt-16 space-y-14">
        {glossarySections.map((section) => {
          const anchorId = section.letter === '#' ? 'number' : section.letter.toLowerCase();
          return (
            <div key={section.letter} id={`letter-${anchorId}`}>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                  {section.letter}
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">Terms starting with {section.letter}</h3>
              </div>
              <div className="mt-6 space-y-6">
                {section.items.map((item) => (
                  <div
                    key={item.term}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h4 className="text-xl font-semibold text-slate-900">{item.term}</h4>
                        <p className="mt-2 text-base text-slate-600">{item.summary}</p>
                      </div>
                      <Link
                        to={item.href}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700 md:mt-0"
                      >
                        Read definition
                        <span aria-hidden="true">?</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </SeoPageLayout>
  );
}




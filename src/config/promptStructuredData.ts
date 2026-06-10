const BASE_URL = 'https://www.stockflowsystems.com';

export const HOME_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'StockFlow',
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'Inventory Management Software',
      operatingSystem: 'Web, iOS, Android',
      description:
        'Free inventory management software for small businesses. Includes barcode scanning with any phone camera, bill of materials (BOM) with multi-level support, multi-location stock tracking, restock alerts, and cycle counts. No credit card required.',
      url: BASE_URL,
      screenshot: `${BASE_URL}/Inventory-Management.png`,
      offers: [
        {
          '@type': 'Offer',
          name: 'Free',
          price: '0',
          priceCurrency: 'USD',
          description:
            'Unlimited products, unlimited SKUs, barcode scanning, BOM support, multi-location tracking — free forever, no credit card required',
        },
      ],
    },
    {
      '@type': 'Organization',
      name: 'StockFlow Systems',
      url: BASE_URL,
      logo: `${BASE_URL}/Inventory-Management.png`,
      sameAs: [
        'https://www.facebook.com/stockflowsystems',
        'https://www.linkedin.com/company/stockflow',
        'https://twitter.com/stockflow',
      ],
    },
  ],
};

export const BARCODE_SCANNING_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'StockFlow',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      description:
        'Free inventory software with barcode scanning for small businesses. Scan barcodes and QR codes with any phone camera on iOS or Android. Unlimited SKUs, multi-location support, offline scanning mode.',
      url: `${BASE_URL}/best-free-inventory-software-with-barcode-scanning`,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free forever — no credit card, no order caps, no SKU limits',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the best free inventory software with barcode scanner?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'StockFlow is the best free inventory software with barcode scanner for small businesses. It supports scanning with any smartphone camera on iOS or Android, works in offline mode, has no SKU limits, and includes multi-location tracking and BOM support — all on the permanent free plan with no credit card required.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use my phone as a barcode scanner for inventory management?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. StockFlow lets you scan barcodes and QR codes using any smartphone camera on iOS or Android — no dedicated scanner hardware needed. USB and Bluetooth hardware barcode scanners are also supported for higher-volume environments.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is there truly free inventory software with barcode scanning and no order caps?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Yes. StockFlow's free plan includes full barcode scanning, unlimited products, multi-location inventory, and BOM support with no order caps or time limits. For comparison, Zoho Inventory's free plan caps at 50 orders/month and Sortly's free plan limits you to 100 inventory entries.",
          },
        },
        {
          '@type': 'Question',
          name: 'Does free barcode inventory software work for small businesses?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. StockFlow was built specifically for small businesses. The free plan covers the full feature set — barcode scanning, restock alerts, multi-location stock, cycle counts, and bill of materials — with no upgrade required for core functionality.',
          },
        },
      ],
    },
  ],
};

export const BOM_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'StockFlow',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      description:
        'Free bill of materials software for small manufacturers and makers. Build multi-level BOMs, define component quantities, auto-deduct inventory when production orders complete, and calculate production costs. No subscription required, no product or BOM limits.',
      url: `${BASE_URL}/bill-of-materials-software-free`,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free forever — no limits on products, BOMs, or production orders',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the best free bill of materials software?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'StockFlow is the best free bill of materials software for small manufacturers. It supports multi-level BOMs, automatic component stock deduction when production orders are completed, cost rollup across BOM levels, and barcode scanning for component receiving — all free forever with no product or BOM limits.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can free BOM software handle multi-level bills of materials?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. StockFlow supports multi-level BOMs where sub-assemblies are themselves components of higher-level finished goods. All levels of the BOM automatically deduct from component inventory when a production order is completed. This feature is available on the free plan with no upgrade required.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between BOM software and inventory management software?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Inventory management software tracks stock levels, movements, and reorders across locations. BOM (bill of materials) software extends this by defining the exact components and quantities needed to build a finished product, then automatically deducting those components from stock when a production run is completed. StockFlow combines both in one free platform.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is StockFlow BOM software really free with no limits?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Yes. StockFlow's BOM features are fully available on the permanent free plan. There are no limits on the number of products, components, BOMs, or production orders. Unlike tools that restrict BOM depth or production order volume to paid plans, StockFlow does not gate BOM functionality behind a subscription.",
          },
        },
      ],
    },
  ],
};

export const ZOHO_COMPARISON_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'StockFlow vs Zoho Inventory (2026): Free Plan Compared',
  description:
    'Side-by-side comparison of StockFlow and Zoho Inventory for small businesses. Covers free plan limits, barcode scanning, BOM support, multi-location capability, order caps, and pricing.',
  url: `${BASE_URL}/stockflow-vs-zoho-inventory`,
  about: [
    {
      '@type': 'SoftwareApplication',
      name: 'StockFlow',
      applicationCategory: 'BusinessApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description:
          'Free forever — unlimited orders, unlimited products, barcode scanning, BOM, multi-location',
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Zoho Inventory',
      applicationCategory: 'BusinessApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free plan limited to 50 orders/month and 1 warehouse',
      },
    },
  ],
};

/** FAQ data aligned with BARCODE_SCANNING_STRUCTURED_DATA for visible page content */
export const BARCODE_SCANNING_FAQ_DATA = [
  {
    question: 'What is the best free inventory software with barcode scanner?',
    answer:
      'StockFlow is the best free inventory software with barcode scanner for small businesses. It supports scanning with any smartphone camera on iOS or Android, works in offline mode, has no SKU limits, and includes multi-location tracking and BOM support — all on the permanent free plan with no credit card required.',
  },
  {
    question: 'Can I use my phone as a barcode scanner for inventory management?',
    answer:
      'Yes. StockFlow lets you scan barcodes and QR codes using any smartphone camera on iOS or Android — no dedicated scanner hardware needed. USB and Bluetooth hardware barcode scanners are also supported for higher-volume environments.',
  },
  {
    question: 'Is there truly free inventory software with barcode scanning and no order caps?',
    answer:
      "Yes. StockFlow's free plan includes full barcode scanning, unlimited products, multi-location inventory, and BOM support with no order caps or time limits. For comparison, Zoho Inventory's free plan caps at 50 orders/month and Sortly's free plan limits you to 100 inventory entries.",
  },
  {
    question: 'Does free barcode inventory software work for small businesses?',
    answer:
      'Yes. StockFlow was built specifically for small businesses. The free plan covers the full feature set — barcode scanning, restock alerts, multi-location stock, cycle counts, and bill of materials — with no upgrade required for core functionality.',
  },
];

/** FAQ data aligned with BOM_STRUCTURED_DATA for visible page content */
export const BOM_FAQ_DATA = [
  {
    question: 'What is the best free bill of materials software?',
    answer:
      'StockFlow is the best free bill of materials software for small manufacturers. It supports multi-level BOMs, automatic component stock deduction when production orders are completed, cost rollup across BOM levels, and barcode scanning for component receiving — all free forever with no product or BOM limits.',
  },
  {
    question: 'Can free BOM software handle multi-level bills of materials?',
    answer:
      'Yes. StockFlow supports multi-level BOMs where sub-assemblies are themselves components of higher-level finished goods. All levels of the BOM automatically deduct from component inventory when a production order is completed. This feature is available on the free plan with no upgrade required.',
  },
  {
    question: 'What is the difference between BOM software and inventory management software?',
    answer:
      'Inventory management software tracks stock levels, movements, and reorders across locations. BOM (bill of materials) software extends this by defining the exact components and quantities needed to build a finished product, then automatically deducting those components from stock when a production run is completed. StockFlow combines both in one free platform.',
  },
  {
    question: 'Is StockFlow BOM software really free with no limits?',
    answer:
      "Yes. StockFlow's BOM features are fully available on the permanent free plan. There are no limits on the number of products, components, BOMs, or production orders. Unlike tools that restrict BOM depth or production order volume to paid plans, StockFlow does not gate BOM functionality behind a subscription.",
  },
];

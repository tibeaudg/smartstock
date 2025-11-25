/**
 * Topic Cluster Configuration for Internal Linking
 * Maps all SEO pages to their respective pillar pages and clusters
 */

export interface PageMetadata {
  path: string;
  title: string;
  language: 'nl' | 'en';
  category: string;
  description?: string;
  image?: string;
}

export interface TopicCluster {
  pillar: PageMetadata;
  clusters: PageMetadata[];
}

const seoPageModules = {
  ...import.meta.glob('../pages/SEO/**/*.tsx'),
  ...import.meta.glob('../pages/seo/**/*.tsx'),
};

const legacyTopLevelSlugs = new Set([
  'asset-tracking',
  'inventory-management',
  'what-is-lead-time',
  'warehouse-management',
  'warehouse-management-system',
]);

const existingSeoPagePaths = new Set<string>(
  Object.keys(seoPageModules)
    .map((filePath) => {
      const normalized = filePath
        .replace(/^(\.\.\/)+/, '')
        .replace(/^pages\/(SEO|seo)\//, '')
        .replace(/\.tsx$/, '');

      const segments = normalized.split('/').filter(Boolean);
      if (segments.length === 0) return undefined;

      if (segments[segments.length - 1] === 'index') {
        segments.pop();
      }

      if (segments.length === 0) {
        return '/seo';
      }

      if (segments[0] === 'glossary') {
        if (segments.length === 1) {
          return '/glossary';
        }
        if (segments.length === 2 && legacyTopLevelSlugs.has(segments[1])) {
          return `/${segments[1]}`;
        }
        return `/glossary/${segments.slice(1).join('/')}`;
      }

      return `/${segments[segments.length - 1]}`;
    })
    .filter((path): path is string => Boolean(path))
);

const isExistingSeoPath = (path: string) => existingSeoPagePaths.has(path);

// Dutch Main Cluster - Voorraadbeheer Software
export const dutchMainCluster: TopicCluster = {
  pillar: {
    path: '/voorraadbeheer-software',
    title: 'Voorraadbeheer Software',
    language: 'nl',
    category: 'Voorraadbeheer',
    description: 'Complete voorraadbeheer software voor moderne bedrijven',
    image: '/dashboard.png'
  },
  clusters: [
    // Industry-specific
    {
      path: '/voorraadbeheer-horeca',
      title: 'Voorraadbeheer voor Horeca',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Gespecialiseerde voorraadbeheer oplossingen voor de horeca',
      image: '/dashboard.png'
    },
    {
      path: '/voorraadbeheer-bakkerij',
      title: 'Voorraadbeheer voor Bakkerij',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Voorraadbeheer software speciaal voor bakkerijen',
      image: '/dashboard.png'
    },
    {
      path: '/voorraadbeheer-webshop',
      title: 'Voorraadbeheer voor Webshop',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'E-commerce voorraadbeheer voor online winkels',
      image: '/dashboard.png'
    },
    {
      path: '/voorraadbeheer-kmo',
      title: 'Voorraadbeheer voor KMO',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Betaalbare voorraadbeheer software voor kleine bedrijven',
      image: '/dashboard.png'
    },
    {
      path: '/voorraadbeheer-voor-horeca',
      title: 'Voorraadbeheer Software voor Horeca',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Professionele voorraadbeheer voor restaurant en café',
      image: '/dashboard.png'
    },
    {
      path: '/voorraadbeheer-voor-starters',
      title: 'Voorraadbeheer voor Starters',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Beginnershandleiding voorraadbeheer voor nieuwe ondernemers',
      image: '/dashboard.png'
    },
    // Features & Solutions
    {
      path: '/gratis-voorraadbeheer',
      title: 'Gratis Voorraadbeheer',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Gratis voorraadbeheer software voor kleine bedrijven',
      image: '/dashboard.png'
    },
    {
      path: '/voorraadbeheer-app',
      title: 'Voorraadbeheer App',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Mobiele voorraadbeheer app voor iOS en Android',
      image: '/mobile.png'
    },
    {
      path: '/mobiel-voorraadbeheer',
      title: 'Mobiel Voorraadbeheer',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Beheer voorraad onderweg met mobiele app',
      image: '/mobile.png'
    },
    {
      path: '/voorraadbeheer-excel',
      title: 'Voorraadbeheer Excel',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Van Excel naar professionele voorraadbeheer software',
      image: '/dashboard.png'
    },
    {
      path: '/gratis-voorraadbeheer-app',
      title: 'Gratis Voorraadbeheer App',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Download gratis voorraadbeheer app',
      image: '/mobile.png'
    },
    {
      path: '/gratis-voorraadbeheer-software',
      title: 'Gratis Voorraadbeheer Software',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Volledig gratis voorraadbeheer software oplossing',
      image: '/dashboard.png'
    },

    // Guides & Resources
    {
      path: '/voorraadbeheer-tips',
      title: 'Voorraadbeheer Tips',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Praktische tips voor beter voorraadbeheer',
      image: '/dashboard.png'
    },
    {
      path: '/voorraadbeheer-automatiseren',
      title: 'Voorraadbeheer Automatiseren',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Automatiseer je voorraadbeheer processen',
      image: '/dashboard.png'
    },
    {
      path: '/voorraadbeheer-fouten-voorkomen',
      title: 'Voorraadbeheer Fouten Voorkomen',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Veelgemaakte fouten en hoe je ze voorkomt',
      image: '/dashboard.png'
    },
    {
      path: '/voorraadbeheer-software-vergelijken',
      title: 'Voorraadbeheer Software Vergelijken',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Vergelijk verschillende voorraadbeheer oplossingen',
      image: '/dashboard.png'
    },
    {
      path: '/voorraadbeheer-excel-vs-software',
      title: 'Voorraadbeheer Excel vs Software',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Verschil tussen Excel en professionele software',
      image: '/dashboard.png'
    },
    {
      path: '/wat-is-voorraadbeheer-software',
      title: 'Wat is Voorraadbeheer Software?',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Complete uitleg over voorraadbeheer software',
      image: '/dashboard.png'
    },
    {
      path: '/excel-vs-voorraadbeheer-software',
      title: 'Excel vs Voorraadbeheer Software',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Waarom professionele software beter is dan Excel',
      image: '/dashboard.png'
    },
    {
      path: '/checklist-voorraadbeheer-software-gereed',
      title: 'Checklist Voorraadbeheer Software',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Complete checklist voor het kiezen van software',
      image: '/dashboard.png'
    },
    {
      path: '/voorraadbeheer-automatiseren-5-stappen',
      title: 'Voorraadbeheer Automatiseren in 5 Stappen',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Stap-voor-stap handleiding automatisering',
      image: '/dashboard.png'
    },
    {
      path: '/voorraadbeheer-excel-template-gratis',
      title: 'Voorraadbeheer Excel Template Gratis',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Gratis Excel templates voor voorraadbeheer',
      image: '/dashboard.png'
    },
    {
      path: '/voorraadbeheer-excel-zelf-maken',
      title: 'Voorraadbeheer Excel Zelf Maken',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Maak je eigen Excel voorraadbeheer systeem',
      image: '/dashboard.png'
    },
    {
      path: '/voorraadbeheer',
      title: 'Voorraadbeheer',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Alles over effectief voorraadbeheer',
      image: '/dashboard.png'
    },
    {
      path: '/boekhoudprogramma-met-voorraadbeheer',
      title: 'Boekhoudprogramma met Voorraadbeheer',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Integratie met boekhoudsoftware',
      image: '/dashboard.png'
    }
  ]
};

// Dutch Stockbeheer Cluster
export const dutchStockbeheerCluster: TopicCluster = {
  pillar: {
    path: '/stockbeheer-software',
    title: 'Stockbeheer Software',
    language: 'nl',
    category: 'Stockbeheer',
    description: 'Professionele stockbeheer software oplossingen',
    image: '/dashboard.png'
  },
  clusters: [
    {
      path: '/stockbeheer',
      title: 'Stockbeheer',
      language: 'nl',
      category: 'Stockbeheer',
      description: 'Complete gids voor effectief stockbeheer',
      image: '/dashboard.png'
    },
    {
      path: '/stockbeheer-app',
      title: 'Stockbeheer App',
      language: 'nl',
      category: 'Stockbeheer',
      description: 'Mobiele stockbeheer applicatie',
      image: '/mobile.png'
    },
    {
      path: '/gratis-stockbeheer',
      title: 'Gratis Stockbeheer',
      language: 'nl',
      category: 'Stockbeheer',
      description: 'Gratis stockbeheer software voor kleine bedrijven',
      image: '/dashboard.png'
    },
    {
      path: '/simpelstockbeheer',
      title: 'Simpel Stockbeheer',
      language: 'nl',
      category: 'Stockbeheer',
      description: 'Eenvoudige stockbeheer oplossing',
      image: '/dashboard.png'
    },
    {
      path: '/software-stockbeheer',
      title: 'Software Stockbeheer',
      language: 'nl',
      category: 'Stockbeheer',
      description: 'Professionele stockbeheer software',
      image: '/dashboard.png'
    },
    {
      path: '/stockbeheer-programma',
      title: 'Stockbeheer Programma',
      language: 'nl',
      category: 'Stockbeheer',
      description: 'Het beste stockbeheer programma',
      image: '/dashboard.png'
    },
    {
      path: '/programma-stockbeheer',
      title: 'Programma Stockbeheer',
      language: 'nl',
      category: 'Stockbeheer',
      description: 'Kies het juiste stockbeheer programma',
      image: '/dashboard.png'
    },
    {
      path: '/programma-stockbeheer-gratis',
      title: 'Programma Stockbeheer Gratis',
      language: 'nl',
      category: 'Stockbeheer',
      description: 'Gratis stockbeheer programma',
      image: '/dashboard.png'
    }
  ]
};

// Dutch Magazijnbeheer Cluster
export const dutchMagazijnbeheerCluster: TopicCluster = {
  pillar: {
    path: '/magazijnbeheer-software',
    title: 'Magazijnbeheer Software',
    language: 'nl',
    category: 'Magazijnbeheer',
    description: 'Professionele magazijnbeheer software',
    image: '/dashboard.png'
  },
  clusters: [
    {
      path: '/magazijnbeheer',
      title: 'Magazijnbeheer',
      language: 'nl',
      category: 'Magazijnbeheer',
      description: 'Complete magazijnbeheer oplossingen',
      image: '/dashboard.png'
    },
    {
      path: '/magazijnbeheer-software-gratis',
      title: 'Magazijnbeheer Software Gratis',
      language: 'nl',
      category: 'Magazijnbeheer',
      description: 'Gratis magazijnbeheer software',
      image: '/dashboard.png'
    },
    {
      path: '/voorraad-software-gratis',
      title: 'Voorraad Software Gratis',
      language: 'nl',
      category: 'Magazijnbeheer',
      description: 'Gratis voorraad software',
      image: '/dashboard.png'
    }
  ]
};

// English Main Cluster - Inventory Management Software
export const englishMainCluster: TopicCluster = {
  pillar: {
    path: '/inventory-management-software',
    title: 'Inventory Management Software',
    language: 'en',
    category: 'Inventory Management',
    description: 'Professional inventory management software for growing businesses',
    image: '/dashboard.png'
  },
  clusters: [
    // Industry-specific
    {
      path: '/inventory-management-smb',
      title: 'Inventory Management for SMB',
      language: 'en',
      category: 'Inventory Management',
      description: 'Affordable inventory management for small and medium enterprises',
      image: '/dashboard.png'
    },
    {
      path: '/inventory-for-hospitality',
      title: 'Inventory for Hospitality',
      language: 'en',
      category: 'Inventory Management',
      description: 'Specialized inventory solutions for hospitality industry',
      image: '/dashboard.png'
    },
    {
      path: '/inventory-for-ecommerce',
      title: 'Inventory for E-commerce',
      language: 'en',
      category: 'Inventory Management',
      description: 'E-commerce inventory management solutions',
      image: '/dashboard.png'
    },
    {
      path: '/inventory-management-hospitality',
      title: 'Inventory Management for Hospitality',
      language: 'en',
      category: 'Inventory Management',
      description: 'Restaurant and hotel inventory management',
      image: '/dashboard.png'
    },
    {
      path: '/inventory-management-bakery',
      title: 'Inventory Management for Bakery',
      language: 'en',
      category: 'Inventory Management',
      description: 'Bakery-specific inventory solutions',
      image: '/dashboard.png'
    },
    {
      path: '/inventory-software-for-small-business',
      title: 'Inventory Software for Small Business',
      language: 'en',
      category: 'Inventory Management',
      description: 'Best inventory software for small businesses',
      image: '/dashboard.png'
    },
    {
      path: '/inventory-for-starters',
      title: 'Inventory for Starters',
      language: 'en',
      category: 'Inventory Management',
      description: 'Beginner guide to inventory management',
      image: '/dashboard.png'
    },
    // Features & Solutions
    {
      path: '/best-inventory-management-software',
      title: 'Best Inventory Management Software',
      language: 'en',
      category: 'Inventory Management',
      description: 'Compare the best inventory management software with detailed feature analysis, pricing comparison, and implementation guides',
      image: '/dashboard.png'
    },
    {
      path: '/online-inventory-management',
      title: 'Online Inventory Management',
      language: 'en',
      category: 'Inventory Management',
      description: 'Cloud-based inventory management',
      image: '/dashboard.png'
    },
    {
      path: '/online-inventory-software',
      title: 'Online Inventory Software',
      language: 'en',
      category: 'Inventory Management',
      description: 'Web-based inventory software solutions',
      image: '/dashboard.png'
    },
    {
      path: '/best-online-inventory-software',
      title: 'Best Online Inventory Software',
      language: 'en',
      category: 'Inventory Management',
      description: 'Top online inventory software platforms',
      image: '/dashboard.png'
    },
    {
      path: '/best-online-inventory-system',
      title: 'Best Online Inventory System',
      language: 'en',
      category: 'Inventory Management',
      description: 'Leading online inventory systems',
      image: '/dashboard.png'
    },
    {
      path: '/inventory-management',
      title: 'Inventory Management',
      language: 'en',
      category: 'Inventory Management',
      description: 'Complete guide to inventory management',
      image: '/dashboard.png'
    },
    {
      path: '/inventory-management-provider',
      title: 'Inventory Management Provider',
      language: 'en',
      category: 'Inventory Management',
      description: 'Partner with StockFlow for software, onboarding, and support',
      image: '/dashboard.png'
    },
    {
      path: '/inventory-management-software-solutions',
      title: 'Inventory Management Software Solutions',
      language: 'en',
      category: 'Inventory Management',
      description: 'Explore StockFlow’s inventory software solutions for growing brands',
      image: '/dashboard.png'
    },
    {
      path: '/inventory-management-systems-solutions',
      title: 'Inventory Management Systems Solutions',
      language: 'en',
      category: 'Inventory Management',
      description: 'Connected inventory system with hardware, barcode, and cloud workflows',
      image: '/dashboard.png'
    },
    {
      path: '/bill-of-material-management-software-free',
      title: 'Bill of Material Management Software Free',
      language: 'en',
      category: 'Inventory Management',
      description: 'Free BOM software for manufacturing and assembly teams',
      image: '/dashboard.png'
    },
    {
      path: '/inventory-software',
      title: 'Inventory Software',
      language: 'en',
      category: 'Inventory Management',
      description: 'Professional inventory software solutions',
      image: '/dashboard.png'
    },
    {
      path: '/solutions/inventory-software-management',
      title: 'Inventory Software Management',
      language: 'en',
      category: 'Inventory Management',
      description: 'Manage inventory with modern software',
      image: '/dashboard.png'
    },
    {
      path: '/software-for-inventory-management',
      title: 'Software for Inventory Management',
      language: 'en',
      category: 'Inventory Management',
      description: 'Choose the right inventory management software',
      image: '/dashboard.png'
    },
    {
      path: '/softwares-for-inventory-management',
      title: 'Softwares for Inventory Management',
      language: 'en',
      category: 'Inventory Management',
      description: 'Compare inventory management software options',
      image: '/dashboard.png'
    },
    {
      path: '/warehouse-management-system',
      title: 'Warehouse Management System',
      language: 'en',
      category: 'Inventory Management',
      description: 'Complete warehouse management solutions',
      image: '/dashboard.png'
    },
    {
      path: '/warehouse-management',
      title: 'Warehouse Management',
      language: 'en',
      category: 'Inventory Management',
      description: 'Professional warehouse management',
      image: '/dashboard.png'
    },
    {
      path: '/warehouse-software',
      title: 'Warehouse Software',
      language: 'en',
      category: 'Inventory Management',
      description: 'Modern warehouse software solutions',
      image: '/dashboard.png'
    },
    {
      path: '/inventory-tracker',
      title: 'Inventory Tracker',
      language: 'en',
      category: 'Inventory Management',
      description: 'Track inventory in real-time',
      image: '/dashboard.png'
    },
    {
      path: '/inventory-app',
      title: 'Inventory App',
      language: 'en',
      category: 'Inventory Management',
      description: 'Mobile inventory management app',
      image: '/mobile.png'
    },
    {
      path: '/mobile-inventory-management',
      title: 'Mobile Inventory Management',
      language: 'en',
      category: 'Inventory Management',
      description: 'Manage inventory on the go',
      image: '/mobile.png'
    },
    {
      path: '/home-inventory-app',
      title: 'Home Inventory App',
      language: 'en',
      category: 'Inventory Management',
      description: 'Manage home inventory with app',
      image: '/mobile.png'
    },
    // Guides & Resources
    {
      path: '/inventory-management-tips',
      title: 'Inventory Management Tips',
      language: 'en',
      category: 'Inventory Management',
      description: 'Practical tips for better inventory management',
      image: '/dashboard.png'
    },
    {
      path: '/automate-inventory-management',
      title: 'Automate Inventory Management',
      language: 'en',
      category: 'Inventory Management',
      description: 'Automation strategies for inventory',
      image: '/dashboard.png'
    },
    {
      path: '/avoid-inventory-mistakes',
      title: 'Avoid Inventory Mistakes',
      language: 'en',
      category: 'Inventory Management',
      description: 'Common mistakes and how to avoid them',
      image: '/dashboard.png'
    },
    {
      path: '/compare-inventory-software',
      title: 'Compare Inventory Software',
      language: 'en',
      category: 'Inventory Management',
      description: 'Software comparison guide',
      image: '/dashboard.png'
    },
    {
      path: '/inventory-excel-vs-software',
      title: 'Inventory Excel vs Software',
      language: 'en',
      category: 'Inventory Management',
      description: 'Why software beats spreadsheets',
      image: '/dashboard.png'
    },
    {
      path: '/inventory-excel',
      title: 'Inventory Excel',
      language: 'en',
      category: 'Inventory Management',
      description: 'From Excel to professional software',
      image: '/dashboard.png'
    },
    {
      path: '/free-inventory-excel-template',
      title: 'Free Inventory Excel Template',
      language: 'en',
      category: 'Inventory Management',
      description: 'Download free Excel templates',
      image: '/dashboard.png'
    },
    {
      path: '/create-inventory-excel',
      title: 'Create Inventory Excel',
      language: 'en',
      category: 'Inventory Management',
      description: 'Build your own Excel inventory system',
      image: '/dashboard.png'
    },
    {
      path: '/free-inventory-management',
      title: 'Free Inventory Management',
      language: 'en',
      category: 'Inventory Management',
      description: 'Free inventory management solutions',
      image: '/dashboard.png'
    },
    {
      path: '/free-inventory-app',
      title: 'Free Inventory App',
      language: 'en',
      category: 'Inventory Management',
      description: 'Free mobile inventory app',
      image: '/mobile.png'
    },
    {
      path: '/free-stock-management',
      title: 'Free Stock Management',
      language: 'en',
      category: 'Inventory Management',
      description: 'Free stock management software',
      image: '/dashboard.png'
    },
    {
      path: '/free-stock-program',
      title: 'Free Stock Program',
      language: 'en',
      category: 'Inventory Management',
      description: 'Free stock control program',
      image: '/dashboard.png'
    },
    {
      path: '/free-warehouse-software',
      title: 'Free Warehouse Software',
      language: 'en',
      category: 'Inventory Management',
      description: 'Free warehouse management software',
      image: '/dashboard.png'
    },
    {
      path: '/accounting-software-with-inventory',
      title: 'Accounting Software with Inventory',
      language: 'en',
      category: 'Inventory Management',
      description: 'Integrated accounting and inventory solutions',
      image: '/dashboard.png'
    }
  ]
};

// Comparison Cluster
export const comparisonCluster: TopicCluster = {
  pillar: {
    path: '/best-voorraadbeheer-software-kmo',
    title: 'Best Voorraadbeheer Software KMO',
    language: 'nl',
    category: 'Vergelijkingen',
    description: 'Vergelijk de beste voorraadbeheer software voor KMO',
    image: '/dashboard.png'
  },
  clusters: [
    {
      path: '/stockflow-vs-sortly',
      title: 'StockFlow vs Sortly',
      language: 'en',
      category: 'Vergelijkingen',
      description: 'Compare StockFlow and Sortly inventory software',
      image: '/dashboard.png'
    },
    {
      path: '/stockflow-vs-exact-online',
      title: 'StockFlow vs Exact Online',
      language: 'en',
      category: 'Vergelijkingen',
      description: 'StockFlow vs Exact Online comparison',
      image: '/dashboard.png'
    },
    {
      path: '/stockflow-vs-fishbowl',
      title: 'StockFlow vs Fishbowl',
      language: 'en',
      category: 'Vergelijkingen',
      description: 'Compare StockFlow and Fishbowl',
      image: '/dashboard.png'
    },
    {
      path: '/stockflow-vs-zoho-inventory',
      title: 'StockFlow vs Zoho Inventory',
      language: 'en',
      category: 'Vergelijkingen',
      description: 'StockFlow vs Zoho Inventory comparison',
      image: '/dashboard.png'
    },
    {
      path: '/stockflow-vs-inflow',
      title: 'StockFlow vs inFlow',
      language: 'en',
      category: 'Vergelijkingen',
      description: 'Compare StockFlow and inFlow',
      image: '/dashboard.png'
    },
    {
      path: '/stockflow-vs-cin7',
      title: 'StockFlow vs Cin7',
      language: 'en',
      category: 'Vergelijkingen',
      description: 'StockFlow vs Cin7 comparison',
      image: '/dashboard.png'
    },
    {
      path: '/stockflow-vs-tradegecko',
      title: 'StockFlow vs TradeGecko',
      language: 'en',
      category: 'Vergelijkingen',
      description: 'Compare StockFlow and TradeGecko',
      image: '/dashboard.png'
    },
    {
      path: '/stockflow-vs-katana',
      title: 'StockFlow vs Katana',
      language: 'en',
      category: 'Vergelijkingen',
      description: 'StockFlow vs Katana comparison',
      image: '/dashboard.png'
    },
    {
      path: '/stockflow-vs-dear-systems',
      title: 'StockFlow vs DEAR Systems',
      language: 'en',
      category: 'Vergelijkingen',
      description: 'Compare StockFlow and DEAR Systems',
      image: '/dashboard.png'
    },
    {
      path: '/stockflow-vs-unleashed',
      title: 'StockFlow vs Unleashed',
      language: 'en',
      category: 'Vergelijkingen',
      description: 'StockFlow vs Unleashed comparison',
      image: '/dashboard.png'
    },
    {
      path: '/stockflow-vs-skulabs',
      title: 'StockFlow vs SKULabs',
      language: 'en',
      category: 'Vergelijkingen',
      description: 'Compare StockFlow and SKULabs',
      image: '/dashboard.png'
    },
    {
      path: '/stockflow-vs-ordoro',
      title: 'StockFlow vs Ordoro',
      language: 'en',
      category: 'Vergelijkingen',
      description: 'StockFlow vs Ordoro comparison',
      image: '/dashboard.png'
    },
    {
      path: '/stockflow-vs-inventory-planner',
      title: 'StockFlow vs Inventory Planner',
      language: 'en',
      category: 'Vergelijkingen',
      description: 'Compare StockFlow and Inventory Planner',
      image: '/dashboard.png'
    },
    {
      path: '/stockflow-vs-skuvault',
      title: 'StockFlow vs SkuVault',
      language: 'en',
      category: 'Vergelijkingen',
      description: 'StockFlow vs SkuVault comparison',
      image: '/dashboard.png'
    },
    {
      path: '/stockflow-vs-brightpearl',
      title: 'StockFlow vs Brightpearl',
      language: 'en',
      category: 'Vergelijkingen',
      description: 'Compare StockFlow and Brightpearl',
      image: '/dashboard.png'
    },
    {
      path: '/stockflow-vs-linnworks',
      title: 'StockFlow vs Linnworks',
      language: 'en',
      category: 'Vergelijkingen',
      description: 'StockFlow vs Linnworks comparison',
      image: '/dashboard.png'
    },
    {
      path: '/stockflow-vs-teamleader',
      title: 'StockFlow vs Teamleader',
      language: 'en',
      category: 'Vergelijkingen',
      description: 'Compare StockFlow and Teamleader',
      image: '/dashboard.png'
    },
    {
      path: '/stockflow-vs-visma',
      title: 'StockFlow vs Visma',
      language: 'en',
      category: 'Vergelijkingen',
      description: 'StockFlow vs Visma comparison',
      image: '/dashboard.png'
    }
  ]
};

// Industry Vertical Cluster
export const industryVerticalCluster: TopicCluster = {
  pillar: {
    path: '/inventory-management-software',
    title: 'Inventory Management Software by Industry',
    language: 'en',
    category: 'Industries',
    description: 'Industry-specific inventory management solutions',
    image: '/dashboard.png'
  },
  clusters: [
    { path: '/inventory-management-healthcare', title: 'Healthcare Inventory Management', language: 'en', category: 'Industries', description: 'Medical supplies and healthcare inventory software', image: '/dashboard.png' },
    { path: '/inventory-management-manufacturing', title: 'Manufacturing Inventory Management', language: 'en', category: 'Industries', description: 'Manufacturing inventory control and tracking', image: '/dashboard.png' },
    { path: '/inventory-management-food', title: 'Food & Beverage Inventory Management', language: 'en', category: 'Industries', description: 'Food service inventory tracking and expiry management', image: '/dashboard.png' },
    { path: '/inventory-management-fashion', title: 'Fashion & Apparel Inventory Management', language: 'en', category: 'Industries', description: 'Fashion retail inventory and stock control', image: '/dashboard.png' },
    { path: '/inventory-management-electronics', title: 'Electronics Inventory Management', language: 'en', category: 'Industries', description: 'Electronics and tech inventory tracking', image: '/dashboard.png' },
    { path: '/inventory-management-construction', title: 'Construction Inventory Management', language: 'en', category: 'Industries', description: 'Construction materials and equipment tracking', image: '/dashboard.png' },
    { path: '/inventory-management-automotive', title: 'Automotive Inventory Management', language: 'en', category: 'Industries', description: 'Auto parts and automotive inventory control', image: '/dashboard.png' },
    { path: '/inventory-management-pharmaceutical', title: 'Pharmaceutical Inventory Management', language: 'en', category: 'Industries', description: 'Pharma inventory and compliance tracking', image: '/dashboard.png' },
    { path: '/inventory-management-agriculture', title: 'Agriculture Inventory Management', language: 'en', category: 'Industries', description: 'Agricultural supplies and farm inventory software', image: '/dashboard.png' },
    { path: '/inventory-management-wine', title: 'Wine Inventory Management', language: 'en', category: 'Industries', description: 'Wine cellar and beverage inventory tracking', image: '/dashboard.png' },
    { path: '/inventory-management-pets', title: 'Pet Store Inventory Management', language: 'en', category: 'Industries', description: 'Pet supplies and animal product inventory', image: '/dashboard.png' },
    { path: '/inventory-management-beauty', title: 'Beauty & Cosmetics Inventory Management', language: 'en', category: 'Industries', description: 'Beauty products and cosmetics inventory', image: '/dashboard.png' },
    { path: '/inventory-management-sports', title: 'Sports & Recreation Inventory Management', language: 'en', category: 'Industries', description: 'Sports equipment and recreation inventory', image: '/dashboard.png' },
    { path: '/inventory-management-jewelry', title: 'Jewelry Inventory Management', language: 'en', category: 'Industries', description: 'Jewelry and precious metals inventory tracking', image: '/dashboard.png' },
    { path: '/inventory-management-books', title: 'Bookstore Inventory Management', language: 'en', category: 'Industries', description: 'Book and media inventory control', image: '/dashboard.png' },
    { path: '/inventory-management-hardware', title: 'Hardware Store Inventory Management', language: 'en', category: 'Industries', description: 'Hardware and tools inventory tracking', image: '/dashboard.png' },
    { path: '/inventory-management-hvac', title: 'HVAC Inventory Management', language: 'en', category: 'Industries', description: 'HVAC parts and equipment inventory', image: '/dashboard.png' },
    { path: '/inventory-management-furniture', title: 'Furniture Inventory Management', language: 'en', category: 'Industries', description: 'Furniture and home goods inventory', image: '/dashboard.png' },
    { path: '/inventory-management-toys', title: 'Toy Store Inventory Management', language: 'en', category: 'Industries', description: 'Toys and games inventory tracking', image: '/dashboard.png' },
    { path: '/inventory-management-office', title: 'Office Supply Inventory Management', language: 'en', category: 'Industries', description: 'Office supplies and stationery inventory', image: '/dashboard.png' },
    { path: '/contractor-inventory-management', title: 'Contractor Inventory Management', language: 'en', category: 'Industries', description: 'Inventory management for contractors and construction professionals', image: '/dashboard.png' },
    { path: '/wholesaler-inventory-management', title: 'Wholesaler Inventory Management', language: 'en', category: 'Industries', description: 'Inventory management solutions for wholesalers and distributors', image: '/dashboard.png' }
  ]
};

// Feature Cluster
export const featureCluster: TopicCluster = {
  pillar: {
    path: '/inventory-management-features',
    title: 'Inventory Management Features',
    language: 'en',
    category: 'Features',
    description: 'Key features and capabilities of inventory management software',
    image: '/dashboard.png'
  },
  clusters: [
    { path: '/barcode-scanning-inventory', title: 'Barcode Scanning for Inventory', language: 'en', category: 'Features', description: 'Mobile barcode scanning and inventory tracking', image: '/dashboard.png' },
    { path: '/multi-location-inventory', title: 'Multi-Location Inventory Management', language: 'en', category: 'Features', description: 'Manage inventory across multiple locations', image: '/dashboard.png' },
    { path: '/inventory-api', title: 'Inventory Management API', language: 'en', category: 'Features', description: 'RESTful API for inventory system integration', image: '/dashboard.png' },
    { path: '/automated-reordering', title: 'Automated Reordering System', language: 'en', category: 'Features', description: 'Automatic purchase order generation', image: '/dashboard.png' },
    { path: '/real-time-inventory-tracking', title: 'Real-Time Inventory Tracking', language: 'en', category: 'Features', description: 'Live stock levels and instant updates', image: '/dashboard.png' },
    { path: '/inventory-analytics', title: 'Inventory Analytics & Reporting', language: 'en', category: 'Features', description: 'Advanced inventory reports and insights', image: '/dashboard.png' },
    { path: '/inventory-alerts', title: 'Inventory Alerts & Notifications', language: 'en', category: 'Features', description: 'Low stock and expiry date alerts', image: '/dashboard.png' },
    { path: '/batch-tracking', title: 'Batch & Lot Tracking', language: 'en', category: 'Features', description: 'Track products by batch or lot number', image: '/dashboard.png' },
    { path: '/purchase-order-management', title: 'Purchase Order Management', language: 'en', category: 'Features', description: 'PO creation and supplier management', image: '/dashboard.png' },
    { path: '/inventory-forecasting', title: 'Inventory Forecasting & Planning', language: 'en', category: 'Features', description: 'Demand forecasting and inventory planning', image: '/dashboard.png' },
    { path: '/mobile-inventory-app', title: 'Mobile Inventory App', language: 'en', category: 'Features', description: 'Mobile inventory management on iOS and Android', image: '/dashboard.png' },
    { path: '/inventory-valuation', title: 'Inventory Valuation Methods', language: 'en', category: 'Features', description: 'FIFO, LIFO, and weighted average costing', image: '/dashboard.png' },
    { path: '/supplier-management', title: 'Supplier Management System', language: 'en', category: 'Features', description: 'Supplier database and relationship management', image: '/dashboard.png' },
    { path: '/inventory-returns', title: 'Inventory Returns Management', language: 'en', category: 'Features', description: 'Handle returns and reverse logistics', image: '/dashboard.png' },
    { path: '/inventory-kitting', title: 'Inventory Kitting & Assembly', language: 'en', category: 'Features', description: 'Bundle products and manage assembly', image: '/dashboard.png' },
    { path: '/inventory-scanning-system', title: 'Inventory Scanning System', language: 'en', category: 'Features', description: 'Barcode and QR code scanning system for inventory tracking', image: '/dashboard.png' },
    { path: '/inventory-turnover-ratio', title: 'Inventory Turnover Ratio', language: 'en', category: 'Features', description: 'Calculate and optimize inventory turnover ratio for better cash flow', image: '/dashboard.png' },
    { path: '/purchase-order-form', title: 'Purchase Order Form', language: 'en', category: 'Features', description: 'Create and manage purchase orders with professional forms', image: '/dashboard.png' }
  ]
};

// Buyer Intent Cluster
export const buyerIntentCluster: TopicCluster = {
  pillar: {
    path: '/inventory-management-guides',
    title: 'Inventory Management Guides',
    language: 'en',
    category: 'Guides',
    description: 'Comprehensive guides for choosing and implementing inventory software',
    image: '/dashboard.png'
  },
  clusters: [
    { path: '/how-to-choose-inventory-management-software', title: 'How to Choose Inventory Management Software', language: 'en', category: 'Guides', description: 'Complete buyer guide for selecting inventory software', image: '/dashboard.png' },
    { path: '/free-inventory-management-software', title: 'Free Inventory Management Software', language: 'en', category: 'Guides', description: 'Best free inventory management solutions', image: '/dashboard.png' },
    { path: '/inventory-management-software-cost', title: 'Inventory Management Software Cost Guide', language: 'en', category: 'Guides', description: 'Pricing comparison and cost breakdown', image: '/dashboard.png' },
    { path: '/small-business-inventory-software', title: 'Small Business Inventory Software', language: 'en', category: 'Guides', description: 'Best inventory solutions for small businesses', image: '/dashboard.png' },
    { path: '/inventory-management-implementation', title: 'Inventory Management Implementation Guide', language: 'en', category: 'Guides', description: 'Step-by-step implementation process', image: '/dashboard.png' },
    { path: '/inventory-management-alternatives', title: 'Inventory Management Software Alternatives', language: 'en', category: 'Guides', description: 'Alternative solutions to traditional inventory systems', image: '/dashboard.png' },
    { path: '/cloud-inventory-software', title: 'Cloud Inventory Management Software', language: 'en', category: 'Guides', description: 'Best cloud-based inventory solutions', image: '/dashboard.png' },
    { path: '/inventory-management-integration', title: 'Inventory Management Integration Guide', language: 'en', category: 'Guides', description: 'Integrating inventory with other business systems', image: '/dashboard.png' },
    { path: '/inventory-management-roi', title: 'Inventory Management ROI Calculator', language: 'en', category: 'Guides', description: 'Calculate return on investment for inventory software', image: '/dashboard.png' },
    { path: '/replacing-excel-inventory', title: 'Replacing Excel for Inventory Management', language: 'en', category: 'Guides', description: 'Move from spreadsheets to inventory software', image: '/dashboard.png' },
    { path: '/inventory-management-checklist', title: 'Inventory Management Software Checklist', language: 'en', category: 'Guides', description: 'Essential features checklist for buyers', image: '/dashboard.png' },
    { path: '/inventory-management-migration', title: 'Inventory Management Migration Guide', language: 'en', category: 'Guides', description: 'How to migrate from one system to another', image: '/dashboard.png' },
    { path: '/inventory-management-training', title: 'Inventory Management Training Resources', language: 'en', category: 'Guides', description: 'Training materials and best practices', image: '/dashboard.png' },
    { path: '/inventory-management-security', title: 'Inventory Management Security Best Practices', language: 'en', category: 'Guides', description: 'Data security and compliance for inventory systems', image: '/dashboard.png' },
    { path: '/inventory-management-pitfalls', title: 'Common Inventory Management Mistakes', language: 'en', category: 'Guides', description: 'Avoid common pitfalls when implementing inventory software', image: '/dashboard.png' },
    { path: '/how-to-generate-barcode', title: 'How to Generate Barcode', language: 'en', category: 'Guides', description: 'Step-by-step guide to generating barcodes for inventory products', image: '/dashboard.png' }
  ]
};

// Extended Comparison Cluster
export const extendedComparisonCluster: TopicCluster = {
  pillar: {
    path: '/inventory-software-comparison',
    title: 'Inventory Software Comparison',
    language: 'en',
    category: 'Comparisons',
    description: 'Compare inventory management software solutions',
    image: '/dashboard.png'
  },
  clusters: [
    { path: '/stockflow-vs-quickbooks-commerce', title: 'StockFlow vs QuickBooks Commerce', language: 'en', category: 'Comparisons', description: 'Compare StockFlow and QuickBooks Commerce', image: '/dashboard.png' },
    { path: '/stockflow-vs-netsuite', title: 'StockFlow vs NetSuite', language: 'en', category: 'Comparisons', description: 'StockFlow vs NetSuite inventory comparison', image: '/dashboard.png' },
    { path: '/stockflow-vs-sap', title: 'StockFlow vs SAP', language: 'en', category: 'Comparisons', description: 'Compare StockFlow and SAP inventory solutions', image: '/dashboard.png' },
    { path: '/stockflow-vs-odoo', title: 'StockFlow vs Odoo', language: 'en', category: 'Comparisons', description: 'StockFlow vs Odoo inventory management', image: '/dashboard.png' },
    { path: '/stockflow-vs-monday', title: 'StockFlow vs Monday.com', language: 'en', category: 'Comparisons', description: 'Compare StockFlow and Monday.com', image: '/dashboard.png' },
    { path: '/stockflow-vs-airtable', title: 'StockFlow vs Airtable', language: 'en', category: 'Comparisons', description: 'StockFlow vs Airtable for inventory', image: '/dashboard.png' },
    { path: '/stockflow-vs-shipstation', title: 'StockFlow vs ShipStation', language: 'en', category: 'Comparisons', description: 'Compare StockFlow and ShipStation', image: '/dashboard.png' },
    { path: '/stockflow-vs-shopify', title: 'StockFlow vs Shopify', language: 'en', category: 'Comparisons', description: 'StockFlow vs Shopify inventory features', image: '/dashboard.png' },
    { path: '/stockflow-vs-square', title: 'StockFlow vs Square', language: 'en', category: 'Comparisons', description: 'Compare StockFlow and Square inventory', image: '/dashboard.png' },
    { path: '/stockflow-vs-lightspeed', title: 'StockFlow vs Lightspeed', language: 'en', category: 'Comparisons', description: 'StockFlow vs Lightspeed POS comparison', image: '/dashboard.png' },
    { path: '/stockflow-vs-vend', title: 'StockFlow vs Vend', language: 'en', category: 'Comparisons', description: 'Compare StockFlow and Vend', image: '/dashboard.png' },
    { path: '/stockflow-vs-clover', title: 'StockFlow vs Clover', language: 'en', category: 'Comparisons', description: 'StockFlow vs Clover inventory management', image: '/dashboard.png' },
    { path: '/stockflow-vs-tradegecko', title: 'StockFlow vs TradeGecko', language: 'en', category: 'Comparisons', description: 'Compare StockFlow and TradeGecko', image: '/dashboard.png' },
    { path: '/stockflow-vs-megaventory', title: 'StockFlow vs Megaventory', language: 'en', category: 'Comparisons', description: 'StockFlow vs Megaventory comparison', image: '/dashboard.png' },
    { path: '/stockflow-vs-finale', title: 'StockFlow vs Finale Inventory', language: 'en', category: 'Comparisons', description: 'Compare StockFlow and Finale Inventory', image: '/dashboard.png' }
  ]
};

// All clusters
export const allClusters: TopicCluster[] = [
  dutchMainCluster,
  dutchStockbeheerCluster,
  dutchMagazijnbeheerCluster,
  englishMainCluster,
  comparisonCluster,
  industryVerticalCluster,
  featureCluster,
  buyerIntentCluster,
  extendedComparisonCluster
];

// Helper function to find cluster for a given page
export function findClusterForPage(pagePath: string): TopicCluster | undefined {
  for (const cluster of allClusters) {
    if (cluster.pillar.path === pagePath) {
      return cluster;
    }
    if (cluster.clusters.some(page => page.path === pagePath)) {
      return cluster;
    }
  }
  return undefined;
}

// Helper function to get related pages
export function getRelatedPages(currentPath: string, limit: number = 6): PageMetadata[] {
  const cluster = findClusterForPage(currentPath);
  if (!cluster) return [];

  const allPages = [cluster.pillar, ...cluster.clusters];
  const relatedPages = allPages.filter(
    (page) => page.path !== currentPath && isExistingSeoPath(page.path)
  );
  
  // Shuffle and limit
  return relatedPages.sort(() => 0.5 - Math.random()).slice(0, limit);
}

// Helper function to get ALL SEO pages from all clusters
export function getAllSeoPages(): PageMetadata[] {
  const allPages: PageMetadata[] = [];
  
  for (const cluster of allClusters) {
    // Add pillar page
    if (isExistingSeoPath(cluster.pillar.path)) {
      allPages.push(cluster.pillar);
    }
    // Add all cluster pages
    for (const page of cluster.clusters) {
      if (isExistingSeoPath(page.path)) {
        allPages.push(page);
      }
    }
  }
  
  // Remove duplicates (in case a page appears in multiple clusters)
  const uniquePages = new Map<string, PageMetadata>();
  for (const page of allPages) {
    if (!uniquePages.has(page.path)) {
      uniquePages.set(page.path, page);
    }
  }
  
  // Sort by title for consistency
  return Array.from(uniquePages.values()).sort((a, b) => a.title.localeCompare(b.title));
}

// Helper function to get breadcrumb path
export function getBreadcrumbPath(pagePath: string): Array<{ name: string; path: string }> {
  // Always start with Home
  const breadcrumbs: Array<{ name: string; path: string }> = [
    { name: 'Home', path: '/' }
  ];

  // Normalize path
  const normalizedPath = pagePath || '/';
  const pathSegments = normalizedPath.split('/').filter(Boolean);

  // If it's just the home page, return early
  if (pathSegments.length === 0 || normalizedPath === '/') {
    return breadcrumbs;
  }

  // Map path segments to category names
  const categoryMap: Record<string, string> = {
    'blog': 'Blog',
    'glossary': 'Glossary',
    'best-of': 'Best Of',
    'dutch': 'Dutch',
    'solutions': 'Solutions',
    'voorraadbeheer': 'Voorraadbeheer'
  };

  const firstSegment = pathSegments[0];
  const isCategoryPage = pathSegments.length === 1 && categoryMap[firstSegment];
  
  // Find the current page title from cluster or use path
  const cluster = findClusterForPage(normalizedPath);
  let pageTitle = pathSegments[pathSegments.length - 1]
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (cluster) {
    const currentPage = cluster.clusters.find(p => p.path === normalizedPath) || cluster.pillar;
    if (currentPage) {
      pageTitle = currentPage.title;
    }
  }

  // If it's a category index page (e.g., /blog, /glossary), don't add duplicate
  if (isCategoryPage) {
    breadcrumbs.push({ 
      name: categoryMap[firstSegment] || firstSegment, 
      path: normalizedPath 
    });
  } else {
    // Add category breadcrumb if it exists and is not the current page
    if (categoryMap[firstSegment]) {
      breadcrumbs.push({ 
        name: categoryMap[firstSegment], 
        path: `/${firstSegment}` 
      });
    }
    
    // Add current page (only if it's different from the category)
    if (!categoryMap[firstSegment] || pathSegments.length > 1) {
      breadcrumbs.push({ 
        name: pageTitle, 
        path: normalizedPath 
      });
    }
  }

  // Ensure we always return at least Home
  return breadcrumbs.length > 0 ? breadcrumbs : [{ name: 'Home', path: '/' }];
}


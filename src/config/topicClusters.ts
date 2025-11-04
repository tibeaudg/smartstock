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
    {
      path: '/app-voorraadbeheer-thuis',
      title: 'App Voorraadbeheer Thuis',
      language: 'nl',
      category: 'Voorraadbeheer',
      description: 'Beheer je thuisvoorraad met handige app',
      image: '/mobile.png'
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
      description: 'Top-rated inventory management solutions',
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
      path: '/inventory-software',
      title: 'Inventory Software',
      language: 'en',
      category: 'Inventory Management',
      description: 'Professional inventory software solutions',
      image: '/dashboard.png'
    },
    {
      path: '/inventory-software-management',
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

// All clusters
export const allClusters: TopicCluster[] = [
  dutchMainCluster,
  dutchStockbeheerCluster,
  dutchMagazijnbeheerCluster,
  englishMainCluster,
  comparisonCluster
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
  const relatedPages = allPages.filter(page => page.path !== currentPath);
  
  // Shuffle and limit
  return relatedPages.sort(() => 0.5 - Math.random()).slice(0, limit);
}

// Helper function to get ALL SEO pages from all clusters
export function getAllSeoPages(): PageMetadata[] {
  const allPages: PageMetadata[] = [];
  
  for (const cluster of allClusters) {
    // Add pillar page
    allPages.push(cluster.pillar);
    // Add all cluster pages
    allPages.push(...cluster.clusters);
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
  const cluster = findClusterForPage(pagePath);
  if (!cluster) {
    return [{ name: 'Home', path: '/' }];
  }

  const currentPage = cluster.clusters.find(p => p.path === pagePath) || cluster.pillar;
  
  return [
    { name: 'Home', path: '/' },
    { name: cluster.pillar.title, path: cluster.pillar.path },
    ...(currentPage.path !== cluster.pillar.path ? [{ name: currentPage.title, path: currentPage.path }] : [])
  ];
}


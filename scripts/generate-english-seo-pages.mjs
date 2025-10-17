import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SEO_PAGES_DIR = path.join(__dirname, '..', 'src', 'pages', 'SEO');

// Mapping of pages to create with their SEO data
const pagesToCreate = [
  {
    filename: 'stock-management-app.tsx',
    componentName: 'StockManagementApp',
    title: 'Stock Management App: Mobile Inventory Control | StockFlow',
    description: 'Manage your stock on-the-go with our mobile app. Real-time tracking, barcode scanning, and instant updates from anywhere.',
    h1: 'Stock Management App',
    subtitle: 'Control Your Inventory Anywhere, Anytime',
    keywords: 'stock management app, mobile inventory, inventory app, stock control app, mobile stock management',
    url: '/stock-management-app'
  },
  {
    filename: 'stock-management-software.tsx',
    componentName: 'StockManagementSoftware',
    title: 'Stock Management Software for Small Business | StockFlow',
    description: 'Professional stock management software designed for SMEs. Track inventory, optimize stock levels, and streamline operations.',
    h1: 'Stock Management Software',
    subtitle: 'All-in-One Solution for Business Growth',
    keywords: 'stock management software, inventory software, stock control, warehouse software, SME stock',
    url: '/stock-management-software'
  },
  {
    filename: 'free-stock-management.tsx',
    componentName: 'FreeStockManagement',
    title: 'Free Stock Management Software - Start Today | StockFlow',
    description: 'Free stock management for up to 30 products. No credit card required. Perfect for small businesses and startups.',
    h1: 'Free Stock Management',
    subtitle: 'Professional Tools at Zero Cost',
    keywords: 'free stock management, free inventory software, free stock control, no cost inventory',
    url: '/free-stock-management'
  },
  {
    filename: 'free-inventory-management.tsx',
    componentName: 'FreeInventoryManagement',
    title: 'Cloud-based Inventory Management Platform | StockFlow',
    description: 'Start with free inventory management. Track up to 30 products at no cost. Upgrade when you grow.',
    h1: 'Free Inventory Management',
    subtitle: 'Get Started Without Spending a Dollar',
    keywords: 'free inventory management, free stock software, no cost inventory, free warehouse management',
    url: '/free-inventory-management'
  },
  {
    filename: 'free-inventory-app.tsx',
    componentName: 'FreeInventoryApp',
    title: 'Free Inventory App - Mobile Stock Control | StockFlow',
    description: 'Download our free inventory app. Manage stock from your phone or tablet. Free for up to 30 products.',
    h1: 'Free Inventory App',
    subtitle: 'Mobile Inventory Management at No Cost',
    keywords: 'free inventory app, mobile stock app, free warehouse app, inventory tracker app',
    url: '/free-inventory-app'
  },
  {
    filename: 'mobile-inventory-management.tsx',
    componentName: 'MobileInventoryManagement',
    title: 'Mobile Inventory Management: Stock Control On-The-Go | StockFlow',
    description: 'Manage inventory from anywhere with mobile inventory management. Real-time updates, barcode scanning, and offline mode.',
    h1: 'Mobile Inventory Management',
    subtitle: 'Your Warehouse in Your Pocket',
    keywords: 'mobile inventory management, mobile stock control, inventory mobile app, on-the-go inventory',
    url: '/mobile-inventory-management'
  },
  {
    filename: 'inventory-app.tsx',
    componentName: 'InventoryApp',
    title: 'Inventory App: Best Mobile Inventory Solution | StockFlow',
    description: 'The best inventory app for businesses. Track stock, scan barcodes, manage orders from your mobile device.',
    h1: 'Inventory App',
    subtitle: 'Powerful Inventory Control in Your Pocket',
    keywords: 'inventory app, mobile inventory, stock app, warehouse app, inventory management app',
    url: '/inventory-app'
  },
  {
    filename: 'inventory-management-tips.tsx',
    componentName: 'InventoryManagementTips',
    title: 'Inventory Management Tips: 10 Expert Strategies | StockFlow',
    description: 'Discover 10 proven inventory management tips to reduce costs, prevent stockouts, and optimize your operations.',
    h1: 'Inventory Management Tips',
    subtitle: '10 Proven Strategies to Optimize Your Stock',
    keywords: 'inventory management tips, stock tips, warehouse tips, inventory best practices, inventory optimization',
    url: '/inventory-management-tips'
  },
  {
    filename: 'inventory-for-starters.tsx',
    componentName: 'InventoryForStarters',
    title: 'Inventory Management for Beginners: Complete Guide | StockFlow',
    description: 'New to inventory management? Learn the basics with our complete beginner guide. Start managing stock like a pro.',
    h1: 'Inventory Management for Beginners',
    subtitle: 'Everything You Need to Get Started',
    keywords: 'inventory for beginners, inventory basics, beginner inventory management, starter guide inventory',
    url: '/inventory-for-starters'
  },
  {
    filename: 'automate-inventory-management.tsx',
    componentName: 'AutomateInventoryManagement',
    title: 'Automate Inventory Management: Save 70% Time | StockFlow',
    description: 'Automate your inventory processes and save hours every week. Auto-reordering, alerts, and streamlined workflows.',
    h1: 'Automate Inventory Management',
    subtitle: 'Work Smarter, Not Harder',
    keywords: 'automate inventory, inventory automation, automated stock management, inventory process automation',
    url: '/automate-inventory-management'
  },
  {
    filename: 'inventory-excel.tsx',
    componentName: 'InventoryExcel',
    title: 'Inventory Excel vs Software: Which is Better? | StockFlow',
    description: 'Compare Excel inventory management vs dedicated software. Discover why 90% of businesses switch to software.',
    h1: 'Inventory Excel Management',
    subtitle: 'Excel vs Software: The Complete Comparison',
    keywords: 'inventory excel, excel stock management, excel vs software, inventory spreadsheet',
    url: '/inventory-excel'
  },
  {
    filename: 'free-inventory-excel-template.tsx',
    componentName: 'FreeInventoryExcelTemplate',
    title: 'Free Inventory Excel Template - Download Now | StockFlow',
    description: 'Download free inventory Excel templates. Ready-to-use spreadsheets for stock management. Or switch to better software.',
    h1: 'Free Inventory Excel Template',
    subtitle: 'Ready-Made Templates for Stock Tracking',
    keywords: 'free inventory excel template, inventory spreadsheet template, stock excel template, free warehouse template',
    url: '/free-inventory-excel-template'
  },
  {
    filename: 'inventory-excel-vs-software.tsx',
    componentName: 'InventoryExcelVsSoftware',
    title: 'Excel vs Inventory Software: Pros & Cons | StockFlow',
    description: 'Excel or inventory software? Compare features, costs, and benefits. Make the right choice for your business.',
    h1: 'Excel vs Inventory Software',
    subtitle: 'Making the Right Choice for Your Business',
    keywords: 'excel vs inventory software, spreadsheet vs software, inventory solution comparison',
    url: '/inventory-excel-vs-software'
  },
  {
    filename: 'avoid-inventory-mistakes.tsx',
    componentName: 'AvoidInventoryMistakes',
    title: 'Avoid Inventory Mistakes: 7 Common Errors & Solutions | StockFlow',
    description: 'Learn how to avoid costly inventory mistakes. Discover the 7 most common errors and how to prevent them.',
    h1: 'Avoid Inventory Mistakes',
    subtitle: 'Prevent Costly Errors Before They Happen',
    keywords: 'inventory mistakes, stock errors, inventory problems, avoid inventory errors, common inventory mistakes',
    url: '/avoid-inventory-mistakes'
  },
  {
    filename: 'inventory-management-hospitality.tsx',
    componentName: 'InventoryManagementHospitality',
    title: 'Inventory Management for Hospitality | StockFlow',
    description: 'Specialized inventory management for hotels, restaurants, and hospitality. Reduce waste, control costs, improve service.',
    h1: 'Inventory Management for Hospitality',
    subtitle: 'Tailored for Hotels, Restaurants & More',
    keywords: 'inventory hospitality, hotel inventory management, restaurant stock management, hospitality software',
    url: '/inventory-management-hospitality'
  },
  {
    filename: 'compare-inventory-software.tsx',
    componentName: 'CompareInventorySoftware',
    title: 'Compare Inventory Software: Find the Best Solution | StockFlow',
    description: 'Compare top inventory management software solutions. Features, pricing, and reviews to help you choose.',
    h1: 'Compare Inventory Software',
    subtitle: 'Find the Perfect Solution for Your Business',
    keywords: 'compare inventory software, inventory software comparison, best inventory software, software reviews',
    url: '/compare-inventory-software'
  },
  {
    filename: 'inventory-for-hospitality.tsx',
    componentName: 'InventoryForHospitality',
    title: 'Inventory Software for Hospitality Industry | StockFlow',
    description: 'Optimize inventory for hospitality businesses. Track F&B, supplies, and equipment efficiently.',
    h1: 'Inventory for Hospitality',
    subtitle: 'Specialized Solutions for the Hospitality Industry',
    keywords: 'hospitality inventory, hotel stock management, restaurant inventory, hospitality supply chain',
    url: '/inventory-for-hospitality'
  },
  {
    filename: 'inventory-for-ecommerce.tsx',
    componentName: 'InventoryForEcommerce',
    title: 'Inventory Management for Ecommerce | StockFlow',
    description: 'Perfect inventory solution for online stores. Sync with your webshop, prevent overselling, and automate fulfillment.',
    h1: 'Inventory for Ecommerce',
    subtitle: 'Seamless Integration with Your Online Store',
    keywords: 'ecommerce inventory, webshop inventory, online store stock management, ecommerce fulfillment',
    url: '/inventory-for-ecommerce'
  },
  {
    filename: 'home-inventory-app.tsx',
    componentName: 'HomeInventoryApp',
    title: 'Home Inventory App: Track Personal Items | StockFlow',
    description: 'Manage your home inventory with ease. Track belongings, organize storage, and keep records for insurance.',
    h1: 'Home Inventory App',
    subtitle: 'Organize and Protect Your Personal Belongings',
    keywords: 'home inventory app, personal inventory, household inventory, home organization app',
    url: '/home-inventory-app'
  },
  {
    filename: 'accounting-software-with-inventory.tsx',
    componentName: 'AccountingSoftwareWithInventory',
    title: 'Accounting Software with Inventory Management | StockFlow',
    description: 'Combine accounting and inventory in one platform. Streamline finances and stock control together.',
    h1: 'Accounting Software with Inventory',
    subtitle: 'All-in-One Financial & Stock Management',
    keywords: 'accounting with inventory, inventory accounting software, integrated accounting inventory',
    url: '/accounting-software-with-inventory'
  },
  {
    filename: 'free-warehouse-software.tsx',
    componentName: 'FreeWarehouseSoftware',
    title: 'Free Warehouse Management Software | StockFlow',
    description: 'Free warehouse software for small businesses. Manage locations, track movements, optimize warehouse operations.',
    h1: 'Free Warehouse Software',
    subtitle: 'Professional Warehouse Management at No Cost',
    keywords: 'free warehouse software, free warehouse management, no cost warehouse system',
    url: '/free-warehouse-software'
  },
  {
    filename: 'free-stock-program.tsx',
    componentName: 'FreeStockProgram',
    title: 'Free Stock Management Program | StockFlow',
    description: 'Download free stock management program. Easy to use, powerful features, no hidden costs.',
    h1: 'Free Stock Program',
    subtitle: 'Complete Stock Management Without the Price Tag',
    keywords: 'free stock program, free inventory program, stock management download',
    url: '/free-stock-program'
  },
  {
    filename: 'simple-stock-management.tsx',
    componentName: 'SimpleStockManagement',
    title: 'Simple Stock Management: Easy Inventory Control | StockFlow',
    description: 'Simple stock management that just works. No complexity, just results. Perfect for small businesses.',
    h1: 'Simple Stock Management',
    subtitle: 'Inventory Control Made Simple',
    keywords: 'simple stock management, easy inventory, simple inventory software, straightforward stock control',
    url: '/simple-stock-management'
  },
  {
    filename: 'inventory-management-bakery.tsx',
    componentName: 'InventoryManagementBakery',
    title: 'Inventory Management for Bakeries | StockFlow',
    description: 'Specialized inventory for bakeries. Track ingredients, manage recipes, reduce waste, and control costs.',
    h1: 'Inventory Management for Bakeries',
    subtitle: 'Tailored for Bakers and Pastry Shops',
    keywords: 'bakery inventory, bakery stock management, ingredient tracking, bakery software',
    url: '/inventory-management-bakery'
  },
  {
    filename: 'create-inventory-excel.tsx',
    componentName: 'CreateInventoryExcel',
    title: 'Create Inventory Excel Spreadsheet: Step-by-Step Guide | StockFlow',
    description: 'Learn how to create an inventory Excel spreadsheet. Free templates and tips, or discover why software is better.',
    h1: 'Create Inventory Excel',
    subtitle: 'Build Your Own Inventory Spreadsheet',
    keywords: 'create inventory excel, make inventory spreadsheet, build stock excel, DIY inventory',
    url: '/create-inventory-excel'
  }
];

// Template for generating SEO pages
const generatePageTemplate = (page) => `import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import SeoPageLayout from '../../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { 
  Package, 
  BarChart3, 
  Zap, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

export default function ${page.componentName}() {
  usePageRefresh();
  
  return (
    <SeoPageLayout title="${page.h1}">
      <SEO
        title="${page.title}"
        description="${page.description}"
        keywords="${page.keywords}"
        url="https://www.stockflow.be${page.url}"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                ${page.h1}: <span className="text-blue-600">${page.subtitle}</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                ${page.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth" className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/pricing" className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition">
                  View Pricing
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
                <span className="text-sm text-gray-600">500+ Businesses</span>
              </div>
            </div>
            <div>
              <img 
                src="/Inventory-Management.png" 
                alt="${page.h1}" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Package, title: "Real-Time Tracking", description: "Monitor stock levels in real-time with instant updates" },
              { icon: BarChart3, title: "Analytics & Reports", description: "Make data-driven decisions with comprehensive insights" },
              { icon: Zap, title: "Automation", description: "Automate processes and save hours every week" },
              { icon: Shield, title: "Secure & Reliable", description: "Enterprise-grade security with automatic backups" },
              { icon: Clock, title: "Save Time", description: "Reduce manual work by up to 70%" },
              { icon: CheckCircle, title: "Easy to Use", description: "Intuitive interface that anyone can master" }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition">
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Started Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Free for up to 30 products. No credit card required.
          </p>
          <Link to="/auth" className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </SeoPageLayout>
  );
}`;

// Generate all pages
console.log(`🚀 Generating ${pagesToCreate.length} English SEO pages...\n`);

let created = 0;
let skipped = 0;

for (const page of pagesToCreate) {
  const filePath = path.join(SEO_PAGES_DIR, page.filename);
  
  if (fs.existsSync(filePath)) {
    console.log(`⏭️  Skipped: ${page.filename} (already exists)`);
    skipped++;
    continue;
  }
  
  const content = generatePageTemplate(page);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Created: ${page.filename}`);
  created++;
}

console.log(`\n✨ Complete!`);
console.log(`   Created: ${created} files`);
console.log(`   Skipped: ${skipped} files`);
console.log(`   Total:   ${pagesToCreate.length} files`);
console.log(`\n📝 Next steps:`);
console.log(`   1. Add routes to App.tsx`);
console.log(`   2. Regenerate sitemap`);
console.log(`   3. Test the new pages`);

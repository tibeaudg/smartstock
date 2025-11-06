import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import SeoPageLayout from '../components/SeoPageLayout';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { Package, Globe, MapPin, BarChart3, Users, FileText, Search, ExternalLink } from 'lucide-react';

export default function SEOOverviewPage() {
  usePageRefresh();

  const seoCategories = [
    {
      title: "English Inventory Management Pages",
      icon: Globe,
      pages: [
        { name: "Best Inventory Management Software", url: "/best-inventory-management-software" },
        { name: "Inventory Management Software", url: "/inventory-management-software" },
        { name: "Inventory Software", url: "/inventory-software" },
        { name: "Inventory Software Management", url: "/inventory-software-management" },
        { name: "Inventory Management Provider", url: "/inventory-management-provider" },
        { name: "Inventory Management Software Solutions", url: "/inventory-management-software-solutions" },
        { name: "Inventory Management Systems Solutions", url: "/inventory-management-systems-solutions" },
        { name: "Inventory Software for Small Business", url: "/inventory-software-for-small-business" },
        { name: "Software for Inventory Management", url: "/software-for-inventory-management" },
        { name: "Softwares for Inventory Management", url: "/softwares-for-inventory-management" },
        { name: "Best Online Inventory Software", url: "/best-online-inventory-software" },
        { name: "Best Online Inventory System", url: "/best-online-inventory-system" },
        { name: "Online Inventory Management", url: "/online-inventory-management" },
        { name: "Online Inventory Software", url: "/online-inventory-software" },
        { name: "Bill of Material Management Software Free", url: "/bill-of-material-management-software-free" },
        { name: "Free Inventory Management", url: "/free-inventory-management" },
        { name: "Free Inventory App", url: "/free-inventory-app" },
        { name: "Inventory Management", url: "/inventory-management" },
        { name: "Inventory Management SMB", url: "/inventory-management-smb" },
        { name: "Inventory Management Tips", url: "/inventory-management-tips" },
        { name: "Inventory Tracker", url: "/inventory-tracker" },
        { name: "Inventory App", url: "/inventory-app" },
        { name: "Inventory Excel", url: "/inventory-excel" },
        { name: "Inventory Excel vs Software", url: "/inventory-excel-vs-software" },
        { name: "Create Inventory Excel", url: "/create-inventory-excel" },
        { name: "Free Inventory Excel Template", url: "/free-inventory-excel-template" },
        { name: "Inventory for E-commerce", url: "/inventory-for-ecommerce" },
        { name: "Inventory for Hospitality", url: "/inventory-for-hospitality" },
        { name: "Inventory for Starters", url: "/inventory-for-starters" },
        { name: "Inventory Management Bakery", url: "/inventory-management-bakery" },
        { name: "Inventory Management Hospitality", url: "/inventory-management-hospitality" },
        { name: "Mobile Inventory Management", url: "/mobile-inventory-management" },
        { name: "Retail Inventory Management", url: "/retail-inventory-management" },
        { name: "Retail Multi Location", url: "/retail-multi-location" },
        { name: "Retail POS Integration", url: "/retail-pos-integration" },
        { name: "Retail Seasonal Inventory", url: "/retail-seasonal-inventory" },
        { name: "Compare Inventory Software", url: "/compare-inventory-software" },
        { name: "Automate Inventory Management", url: "/automate-inventory-management" },
        { name: "Avoid Inventory Mistakes", url: "/avoid-inventory-mistakes" }
      ]
    },
    {
      title: "Dutch Voorraadbeheer Pages",
      icon: FileText,
      pages: [
        { name: "Voorraadbeheer Software", url: "/voorraadbeheer-software" },
        { name: "Gratis Voorraadbeheer Software", url: "/gratis-voorraadbeheer-software" },
        { name: "Gratis Voorraadbeheer", url: "/gratis-voorraadbeheer" },
        { name: "Gratis Voorraadbeheer App", url: "/gratis-voorraadbeheer-app" },
        { name: "Voorraadbeheer", url: "/voorraadbeheer" },
        { name: "Voorraadbeheer App", url: "/voorraadbeheer-app" },
        { name: "Voorraadbeheer Automatiseren", url: "/voorraadbeheer-automatiseren" },
        { name: "Voorraadbeheer Automatiseren 5 Stappen", url: "/voorraadbeheer-automatiseren-5-stappen" },
        { name: "Voorraadbeheer Bakkerij", url: "/voorraadbeheer-bakkerij" },
        { name: "Voorraadbeheer Excel", url: "/voorraadbeheer-excel" },
        { name: "Voorraadbeheer Excel Template Gratis", url: "/voorraadbeheer-excel-template-gratis" },
        { name: "Voorraadbeheer Excel vs Software", url: "/voorraadbeheer-excel-vs-software" },
        { name: "Voorraadbeheer Excel Zelf Maken", url: "/voorraadbeheer-excel-zelf-maken" },
        { name: "Voorraadbeheer Fouten Voorkomen", url: "/voorraadbeheer-fouten-voorkomen" },
        { name: "Voorraadbeheer Horeca", url: "/voorraadbeheer-horeca" },
        { name: "Voorraadbeheer KMO", url: "/voorraadbeheer-kmo" },
        { name: "Voorraadbeheer Software Vergelijken", url: "/voorraadbeheer-software-vergelijken" },
        { name: "Voorraadbeheer Tips", url: "/voorraadbeheer-tips" },
        { name: "Voorraadbeheer voor Horeca", url: "/voorraadbeheer-voor-horeca" },
        { name: "Voorraadbeheer voor Starters", url: "/voorraadbeheer-voor-starters" },
        { name: "Voorraadbeheer Webshop", url: "/voorraadbeheer-webshop" },
        { name: "Voorraad Software Gratis", url: "/voorraad-software-gratis" },
        { name: "Wat is Voorraadbeheer Software", url: "/wat-is-voorraadbeheer-software" },
        { name: "Excel vs Voorraadbeheer Software", url: "/excel-vs-voorraadbeheer-software" },
        { name: "Checklist Voorraadbeheer Software Gereed", url: "/checklist-voorraadbeheer-software-gereed" },
        { name: "Best Voorraadbeheer Software KMO", url: "/best-voorraadbeheer-software-kmo" },
        { name: "Mobiel Voorraadbeheer", url: "/mobiel-voorraadbeheer" },
        { name: "App Voorraadbeheer Thuis", url: "/app-voorraadbeheer-thuis" }
      ]
    },
    {
      title: "Stock Management Pages",
      icon: BarChart3,
      pages: [
        { name: "Stock Management", url: "/stock-management" },
        { name: "Stock Management App", url: "/stock-management-app" },
        { name: "Stock Management Software", url: "/stock-management-software" },
        { name: "Free Stock Management", url: "/free-stock-management" },
        { name: "Free Stock Program", url: "/free-stock-program" },
        { name: "Simple Stock Management", url: "/simple-stock-management" },
        { name: "Small Shop Stock Control", url: "/small-shop-stock-control" },
        { name: "Stockbeheer", url: "/stockbeheer" },
        { name: "Stockbeheer App", url: "/stockbeheer-app" },
        { name: "Stockbeheer Software", url: "/stockbeheer-software" },
        { name: "Simpelstockbeheer", url: "/simpelstockbeheer" },
        { name: "Gratis Stockbeheer", url: "/gratis-stockbeheer" },
        { name: "Programma Stockbeheer Gratis", url: "/programma-stockbeheer-gratis" }
      ]
    },
    {
      title: "Warehouse Management Pages",
      icon: Package,
      pages: [
        { name: "Warehouse Management", url: "/warehouse-management" },
        { name: "Warehouse Management System", url: "/warehouse-management-system" },
        { name: "Warehouse Software", url: "/warehouse-software" },
        { name: "Free Warehouse Software", url: "/free-warehouse-software" },
        { name: "Magazijnbeheer", url: "/magazijnbeheer" },
        { name: "Magazijnbeheer Software Gratis", url: "/magazijnbeheer-software-gratis" }
      ]
    },
    {
      title: "Accounting & Integration Pages",
      icon: Users,
      pages: [
        { name: "Accounting Software with Inventory", url: "/accounting-software-with-inventory" },
        { name: "Boekhoudprogramma met Voorraadbeheer", url: "/boekhoudprogramma-met-voorraadbeheer" }
      ]
    },
    {
      title: "Comparison Pages",
      icon: Search,
      pages: [
        { name: "StockFlow vs Sortly", url: "/stockflow-vs-sortly" },
        { name: "StockFlow vs Sortly NL", url: "/stockflow-vs-sortly-nl" },
        { name: "StockFlow vs Exact Online", url: "/stockflow-vs-exact-online" },
        { name: "StockFlow vs Exact Online NL", url: "/stockflow-vs-exact-online-nl" },
        { name: "StockFlow vs Fishbowl", url: "/stockflow-vs-fishbowl" },
        { name: "StockFlow vs Zoho Inventory", url: "/stockflow-vs-zoho-inventory" },
        { name: "StockFlow vs InFlow", url: "/stockflow-vs-inflow" },
        { name: "StockFlow vs Cin7", url: "/stockflow-vs-cin7" },
        { name: "StockFlow vs TradeGecko", url: "/stockflow-vs-tradegecko" },
        { name: "StockFlow vs Katana", url: "/stockflow-vs-katana" },
        { name: "StockFlow vs Dear Systems", url: "/stockflow-vs-dear-systems" },
        { name: "StockFlow vs Unleashed", url: "/stockflow-vs-unleashed" },
        { name: "StockFlow vs SKULabs", url: "/stockflow-vs-skulabs" },
        { name: "StockFlow vs Brightpearl", url: "/stockflow-vs-brightpearl" },
        { name: "StockFlow vs Inventory Planner", url: "/stockflow-vs-inventory-planner" },
        { name: "StockFlow vs Linnworks", url: "/stockflow-vs-linnworks" },
        { name: "StockFlow vs Ordoro", url: "/stockflow-vs-ordoro" },
        { name: "StockFlow vs SkuVault", url: "/stockflow-vs-skuvault" },
        { name: "StockFlow vs Teamleader", url: "/stockflow-vs-teamleader" },
        { name: "StockFlow vs Visma", url: "/stockflow-vs-visma" },
        { name: "StockFlow vs Visma NL", url: "/stockflow-vs-visma-nl" }
      ]
    }
  ];

  const totalPages = seoCategories.reduce((total, category) => total + category.pages.length, 0);

  return (
    <SeoPageLayout title="SEO Pages Overview">
      <SEO
        title="SEO Pages Overview - All StockFlow Content Pages"
        description="Complete overview of all StockFlow SEO pages including inventory management, warehouse management, and regional content in English and Dutch."
        keywords="seo pages, inventory management pages, warehouse management, stock management, voorraadbeheer, content overview"
        url="https://www.stockflow.be/seo"
      />



      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {seoCategories.map((category, index) => (
            <div key={index} className="mb-12">
              <div className="flex items-center mb-6">
                <category.icon className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {category.title}
                </h2>
                <span className="ml-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {category.pages.length} pages
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.pages.map((page, pageIndex) => (
                  <Link
                    key={pageIndex}
                    to={page.url}
                    className="group bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                          {page.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {page.url}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </SeoPageLayout>
  );
}

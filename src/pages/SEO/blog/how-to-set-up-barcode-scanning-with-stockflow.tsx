import { Link, useLocation } from "react-router-dom";
import SEO from "@/components/SEO";
import SeoPageLayout from "@/components/SeoPageLayout";
import { usePageRefresh } from "@/hooks/usePageRefresh";
import { StructuredData } from "@/components/StructuredData";
import { CheckCircle, Target, BarChart3, Lightbulb, Camera, Smartphone, Settings, Zap } from "lucide-react";

const topicTitle = "How to Set Up Barcode Scanning with StockFlow";
const canonicalPath = "/blog/how-to-set-up-barcode-scanning-with-stockflow";
const metaDescription = "Step-by-step tutorial for setting up barcode scanning in StockFlow. Learn how to configure barcode scanning, generate barcodes, use mobile scanning, and optimize your inventory tracking workflow.";
const keywords = "set up barcode scanning StockFlow, StockFlow barcode setup, barcode scanning tutorial, inventory barcode scanning, mobile barcode scanning, barcode setup guide";
const heroBadge = "Tutorial Guide • Updated December 2024";

const faqData = [
  {
    question: "How do I set up barcode scanning in StockFlow?",
    answer: "Setting up barcode scanning in StockFlow is straightforward: 1) Access settings in your StockFlow dashboard, 2) Enable barcode scanning feature, 3) Generate or import barcodes for your products, 4) Download the mobile app on your smartphone/tablet, 5) Grant camera permissions for scanning, 6) Test scanning with a sample product. StockFlow supports both barcodes and QR codes and works with any smartphone camera—no special hardware needed."
  },
  {
    question: "Do I need special hardware for barcode scanning in StockFlow?",
    answer: "No! StockFlow uses your smartphone or tablet camera for barcode scanning. No expensive barcode scanners or dedicated hardware required. Simply download the StockFlow mobile app, grant camera permissions, and start scanning. This makes barcode scanning affordable and accessible for businesses of all sizes."
  },
  {
    question: "Can StockFlow generate barcodes for products that don't have them?",
    answer: "Yes, StockFlow can generate barcodes or QR codes for products that don't have existing barcodes. When adding products to StockFlow, you can automatically generate unique barcodes. Print these barcodes on labels and attach them to products. StockFlow supports standard barcode formats and QR codes, so you can choose the best option for your needs."
  },
  {
    question: "What types of barcodes does StockFlow support?",
    answer: "StockFlow supports common 1D barcode formats (UPC, EAN, Code 128) and 2D QR codes. You can use existing product barcodes or generate new ones. QR codes are particularly useful because they can store more information and are easier to scan with smartphone cameras. Compare <Link to=\"/blog/barcodes-vs-qr-codes-for-inventory-management\" className=\"text-blue-600 hover:underline\">barcode vs QR code options</Link> to choose what works best for your inventory."
  },
  {
    question: "How do I scan barcodes with the StockFlow mobile app?",
    answer: "To scan barcodes: 1) Open the StockFlow mobile app, 2) Navigate to the scanning feature (usually in inventory or products section), 3) Point your camera at the barcode/QR code, 4) Wait for automatic detection and scan confirmation, 5) The product information appears automatically. The app works in real-time, updating inventory levels immediately. You can scan for receiving inventory, checking stock levels, recording sales, or updating quantities."
  },
  {
    question: "Can I use barcode scanning offline with StockFlow?",
    answer: "Yes, StockFlow mobile app supports offline barcode scanning. You can scan barcodes even without internet connection. Scans are stored locally on your device and automatically sync when connectivity is restored. This is especially useful for remote job sites, warehouses with poor connectivity, or field operations where internet access is limited."
  },
  {
    question: "How accurate is barcode scanning in StockFlow?",
    answer: "Barcode scanning in StockFlow achieves 99%+ accuracy when compared to manual data entry (which has 10-15% error rates). Scanning eliminates typing errors, misreads, and data entry mistakes. The mobile app includes error correction and validation to ensure scanned data is accurate. For best results, ensure barcodes are clearly printed, undamaged, and well-lit when scanning."
  },
  {
    question: "Can multiple team members use barcode scanning simultaneously?",
    answer: "Yes, multiple team members can use barcode scanning simultaneously with StockFlow. Each user logs into their own account on the mobile app and scans independently. All scans sync in real-time, so inventory levels update immediately across all devices. This is perfect for teams working at different locations or multiple people updating inventory simultaneously."
  },
  {
    question: "What should I do if a barcode won't scan?",
    answer: "If a barcode won't scan: check that barcode is clearly printed and undamaged, ensure good lighting (barcode scanning works best with adequate light), clean the barcode if dirty, try scanning from different angles, check camera focus (move phone closer/farther), verify barcode format is supported, generate a new barcode if damaged. StockFlow also allows manual entry as backup if scanning fails."
  }
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "How to Set Up Barcode Scanning with StockFlow",
    "description": "Step-by-step tutorial for setting up barcode scanning in StockFlow inventory management software.",
    "author": {
      "@type": "Organization",
      "name": "StockFlow"
    },
    "publisher": {
      "@type": "Organization",
      "name": "StockFlow",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.stockflow.be/logo.png"
      }
    },
    "datePublished": "2024-12-01",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://www.stockflow.be/blog/how-to-set-up-barcode-scanning-with-stockflow"
    }
  }
];

export default function HowToSetUpBarcodeScanningWithStockFlowPage() {
  usePageRefresh();
  const location = useLocation();

  const pageStructuredData = structuredData.map((item) => ({
    ...item,
    dateModified: new Date().toISOString().split("T")[0],
  }));

  return (
    <SeoPageLayout 
      title={topicTitle} 
      heroTitle={topicTitle} 
      updatedDate="12/1/2024"
      faqData={faqData}
    >
      <SEO
        title={`How to Set Up Barcode Scanning with StockFlow 2024 | StockFlow`}
        description={metaDescription}
        keywords={keywords}
        url={`https://www.stockflow.be${canonicalPath}`}
      />

      <StructuredData data={pageStructuredData} />

      {/* Introduction */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            <strong>Setting up barcode scanning with StockFlow</strong> transforms your inventory management by dramatically improving speed and accuracy. Instead of manually typing product codes or quantities, simply scan barcodes to instantly update inventory levels, receive stock, record sales, or check quantities.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            This step-by-step guide walks you through setting up barcode scanning in StockFlow, from initial configuration to optimizing your scanning workflow. StockFlow's mobile-first approach means you can use any smartphone or tablet—no expensive barcode scanners required. Whether you're new to barcode scanning or looking to optimize your setup, this guide provides everything you need.
          </p>
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            For more background on barcode options, see our comparison of <Link to="/blog/barcodes-vs-qr-codes-for-inventory-management" className="text-blue-600 hover:underline font-semibold">barcodes vs QR codes for inventory management</Link>. For small businesses getting started, check our <Link to="/blog/inventory-management-for-small-business-complete-guide" className="text-blue-600 hover:underline font-semibold">complete guide to inventory management for small business</Link>.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Benefits of Barcode Scanning</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span><strong>99%+ accuracy</strong> compared to 10-15% error rate with manual entry</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span><strong>10-20x faster</strong> than typing product codes manually</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span><strong>No special hardware</strong>—uses your smartphone camera</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span><strong>Real-time updates</strong> across all devices and locations</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Step-by-Step Setup */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Step-by-Step Setup Guide</h2>
          <p className="text-lg leading-relaxed text-gray-700 mb-8">
            Follow these steps to set up barcode scanning in StockFlow:
          </p>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border-l-4 border-blue-600">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Settings className="h-6 w-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Enable Barcode Scanning</h3>
                  </div>
                  <p className="text-gray-700 mb-3">
                    Log into your StockFlow dashboard. Navigate to Settings → Features, and enable "Barcode Scanning." This activates barcode scanning functionality across your account. The feature is available on all StockFlow plans.
                  </p>
                  <p className="text-gray-700">
                    Once enabled, you'll see barcode scanning options throughout the interface, including in product management, inventory receiving, and mobile app sections.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border-l-4 border-green-600">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Camera className="h-6 w-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Generate or Import Barcodes</h3>
                  </div>
                  <p className="text-gray-700 mb-3">
                    For products with existing barcodes: StockFlow automatically recognizes standard barcode formats. Simply enter or scan the barcode when adding products, and StockFlow stores it for future scanning.
                  </p>
                  <p className="text-gray-700 mb-3">
                    For products without barcodes: StockFlow can generate unique barcodes or QR codes. When adding products, select "Generate Barcode" to create a unique identifier. You can choose between standard barcodes (1D) or QR codes (2D) based on your needs.
                  </p>
                  <p className="text-gray-700">
                    Compare <Link to="/blog/barcodes-vs-qr-codes-for-inventory-management" className="text-blue-600 hover:underline font-semibold">barcode vs QR code options</Link> to decide which format works best for your inventory. QR codes store more information and are easier to scan with smartphones.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border-l-4 border-yellow-600">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Smartphone className="h-6 w-6 text-yellow-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Download Mobile App</h3>
                  </div>
                  <p className="text-gray-700 mb-3">
                    Download the StockFlow mobile app from the App Store (iOS) or Google Play Store (Android). The mobile app includes built-in barcode scanning that uses your device's camera—no additional hardware needed.
                  </p>
                  <p className="text-gray-700 mb-3">
                    After downloading, log into your StockFlow account using the same credentials as your web dashboard. Your inventory data syncs automatically between web and mobile.
                  </p>
                  <p className="text-gray-700">
                    The mobile app works offline, allowing you to scan barcodes even without internet connection. Scans sync automatically when connectivity is restored.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border-l-4 border-purple-600">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="h-6 w-6 text-purple-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Grant Camera Permissions</h3>
                  </div>
                  <p className="text-gray-700 mb-3">
                    When you first open the scanning feature in the mobile app, your device will prompt for camera permissions. Grant camera access to enable barcode scanning functionality.
                  </p>
                  <p className="text-gray-700">
                    Camera permissions are required only for scanning—your camera isn't accessed at other times. If you denied permissions initially, you can enable them later in your device settings under Apps → StockFlow → Permissions.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border-l-4 border-indigo-600">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">5</div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="h-6 w-6 text-indigo-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Test Scanning</h3>
                  </div>
                  <p className="text-gray-700 mb-3">
                    Test barcode scanning with a sample product. Open the StockFlow mobile app, navigate to the scanning feature (usually in Products or Inventory section), and point your camera at a product barcode.
                  </p>
                  <p className="text-gray-700 mb-3">
                    The app will automatically detect and scan the barcode. You should see product information appear immediately. If scanning doesn't work, check: barcode is clearly visible and well-lit, camera is focused, barcode format is supported, and camera permissions are granted.
                  </p>
                  <p className="text-gray-700">
                    Practice scanning different products to get comfortable with the process. Scanning becomes faster with practice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Printing Barcodes */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Printing Barcode Labels</h2>
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            If you generated barcodes for products that didn't have them, you'll need to print labels:
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Printing Options</h3>
            <div className="space-y-3 text-gray-700">
              <div>
                <strong>1. Export Barcodes from StockFlow:</strong> In your product list, select products and export barcodes as images or PDFs. StockFlow generates print-ready barcode images.
              </div>
              <div>
                <strong>2. Use Label Printer:</strong> For professional results, use a thermal label printer (DYMO, Brother, Zebra). These printers produce durable, smudge-resistant labels perfect for inventory.
              </div>
              <div>
                <strong>3. Standard Printer:</strong> You can also print barcodes on standard paper and use clear tape or label sheets to attach them. This works for temporary or low-volume applications.
              </div>
              <div>
                <strong>4. Label Sizes:</strong> StockFlow supports standard label sizes. Choose labels large enough to scan easily but small enough to fit your products. Common sizes: 1"×2" or 2"×1" for small items, 2"×3" for larger items.
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Label Placement Tips</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Place barcodes on flat, visible surfaces</li>
                <li>• Avoid curved or textured surfaces when possible</li>
                <li>• Protect labels from damage (use clear tape if needed)</li>
                <li>• Ensure consistent placement across similar items</li>
                <li>• Use durable labels for frequently handled items</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Scanning Best Practices</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Ensure good lighting when scanning</li>
                <li>• Hold phone steady, 4-6 inches from barcode</li>
                <li>• Wait for autofocus before scanning</li>
                <li>• Clean barcodes if dirty or damaged</li>
                <li>• Scan from multiple angles if needed</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Using Barcode Scanning */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Using Barcode Scanning in Your Workflow</h2>
          <p className="text-lg leading-relaxed text-gray-700 mb-8">
            Once set up, barcode scanning integrates seamlessly into common inventory operations:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Receiving Inventory</h3>
              <p className="text-gray-700 text-sm mb-3">
                When receiving stock from suppliers, scan barcodes to automatically update quantities. This eliminates manual data entry and ensures accuracy. StockFlow recognizes the product and updates inventory levels instantly.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Recording Sales</h3>
              <p className="text-gray-700 text-sm mb-3">
                Scan barcodes at point of sale to record transactions and automatically reduce inventory. This provides real-time stock levels and eliminates manual updates after sales.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Stock Checks</h3>
              <p className="text-gray-700 text-sm mb-3">
                Quickly verify stock levels by scanning product barcodes. The mobile app shows current quantities, location, and recent movement history instantly.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cycle Counts</h3>
              <p className="text-gray-700 text-sm mb-3">
                Conduct inventory counts by scanning items. The app records quantities automatically, making cycle counts faster and more accurate than manual methods.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Troubleshooting Common Issues</h2>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Barcode Won't Scan</h3>
              <ul className="space-y-1 text-gray-700 text-sm ml-4">
                <li>• Check barcode is clearly printed and undamaged</li>
                <li>• Ensure adequate lighting (avoid glare and shadows)</li>
                <li>• Clean barcode if dirty</li>
                <li>• Try different angles and distances</li>
                <li>• Verify barcode format is supported</li>
                <li>• Generate new barcode if damaged beyond repair</li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Not Working</h3>
              <ul className="space-y-1 text-gray-700 text-sm ml-4">
                <li>• Grant camera permissions in device settings</li>
                <li>• Restart the StockFlow mobile app</li>
                <li>• Check other apps aren't using the camera</li>
                <li>• Update mobile app to latest version</li>
                <li>• Restart device if issues persist</li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Not Found</h3>
              <ul className="space-y-1 text-gray-700 text-sm ml-4">
                <li>• Verify barcode is associated with product in StockFlow</li>
                <li>• Check barcode was entered correctly when adding product</li>
                <li>• Manually add product if barcode isn't recognized</li>
                <li>• Contact support if barcode format issues persist</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Scanning Today</h2>
          <p className="text-lg leading-relaxed text-white/90 mb-6">
            Barcode scanning with StockFlow transforms your inventory management, improving accuracy to 99%+ and speeding up operations 10-20x. Setup takes just minutes, and the mobile app makes it accessible to your entire team.
          </p>
          <p className="text-lg leading-relaxed text-white/90 mb-8">
            Ready to get started? <Link to="/solutions/inventory-management-software" className="text-white underline font-semibold">Try StockFlow free for 14 days</Link> and set up barcode scanning today. For more guidance, see our <Link to="/blog/inventory-management-for-small-business-complete-guide" className="text-white underline font-semibold">complete inventory management guide</Link> or compare <Link to="/blog/barcodes-vs-qr-codes-for-inventory-management" className="text-white underline font-semibold">barcode vs QR code options</Link>.
          </p>
        </div>
      </section>
    </SeoPageLayout>
  );
}

import React from 'react';
import { CheckCircle2, Package, Warehouse, Tags, History, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export const PlatformFeaturesSection = () => {
  // Variants Mockup
  const VariantsMockup = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm h-full flex items-center justify-center">
      <div className="bg-gray-50 rounded-lg p-6 w-full h-full flex items-center justify-center">
      <div className="relative w-full flex items-center justify-center gap-3">
        {/* Variant X - Leftmost */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-bold">X</span>
          </div>
        </div>

        {/* Variant S - Left */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-bold">S</span>
          </div>
        </div>

        {/* Connection line left */}
        <svg className="w-8 h-1" style={{ overflow: 'visible' }}>
          <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#9ca3af" strokeWidth="2" strokeDasharray="4,4" />
        </svg>

        {/* Parent Product - Center */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <Package className="w-10 h-10 text-white" />
          </div>
          <div className="mt-2 text-center">
            <p className="text-xs font-semibold text-gray-900">Parent Product</p>
          </div>
        </div>

        {/* Connection line right */}
        <svg className="w-8 h-1" style={{ overflow: 'visible' }}>
          <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#9ca3af" strokeWidth="2" strokeDasharray="4,4" />
        </svg>

        {/* Variant L - Right */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-bold">L</span>
          </div>
        </div>

        {/* Variant M - Rightmost */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-bold">M</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );

  // Warehouse Management Mockup
  const WarehouseManagementMockup = () => (
    <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-6 shadow-lg h-full flex items-center justify-center">
      <div className="relative w-full flex items-center justify-center gap-4">
        {/* East - Left */}
        <div className="bg-gray-200 rounded-lg px-4 py-3 shadow-md">
          <div className="text-xs font-semibold text-gray-900">East</div>
          <div className="text-sm font-bold text-gray-900">156 products</div>
        </div>

        {/* Connection line left */}
        <svg className="w-12 h-1" style={{ overflow: 'visible' }}>
          <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#3b82f6" strokeWidth="2" />
        </svg>

        {/* Central warehouse icon */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-600 rounded flex items-center justify-center shadow-lg">
            <Warehouse className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Connection line right */}
        <svg className="w-12 h-1" style={{ overflow: 'visible' }}>
          <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#3b82f6" strokeWidth="2" />
        </svg>

        {/* South - Right */}
        <div className="bg-gray-200 rounded-lg px-4 py-3 shadow-md">
          <div className="text-xs font-semibold text-gray-900">South</div>
          <div className="text-sm font-bold text-gray-900">92 products</div>
        </div>

        {/* Connection line further right */}
        <svg className="w-12 h-1" style={{ overflow: 'visible' }}>
          <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#3b82f6" strokeWidth="2" />
        </svg>

        {/* North - Further right */}
        <div className="bg-gray-200 rounded-lg px-4 py-3 shadow-md">
          <div className="text-xs font-semibold text-gray-900">North</div>
          <div className="text-sm font-bold text-gray-900">128 products</div>
        </div>
      </div>
    </div>
  );

  // Categories Management Mockup
  const CategoriesManagementMockup = () => (
    <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-6 shadow-lg h-full">
      <div className="relative w-full h-full flex flex-col items-center">
        {/* Root category - All Products */}
        <div className="mb-6">
          <div className="bg-blue-600 rounded-lg px-4 py-3 shadow-md">
            <div className="flex items-center gap-2">
              <Tags className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">All Products</span>
            </div>
            <div className="text-white text-xs mt-1">48 products</div>
          </div>
        </div>

        {/* Connection line down */}
        <svg className="w-1 h-8 mb-2" style={{ overflow: 'visible' }}>
          <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#3b82f6" strokeWidth="2" />
        </svg>

        {/* Child categories */}
        <div className="flex gap-6">
          {[
            { name: 'Phones', count: '12' },
            { name: 'Laptops', count: '18' },
            { name: 'Accessories', count: '18' },
          ].map((cat, idx) => (
            <div key={idx} className="relative">
              <div className="bg-gray-200 rounded-lg px-3 py-2 shadow-md">
                <div className="text-xs font-semibold text-gray-900">{cat.name}</div>
                <div className="text-xs text-gray-600">{cat.count} products</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Transactions History Mockup
  const TransactionsHistoryMockup = () => (
    <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-4 shadow-lg h-full">
      <div className="space-y-2">
        {/* Header */}
        <div className="bg-white rounded-lg p-3 shadow-sm mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Recent Transactions</h3>
        </div>

        {/* Transaction entries */}
        {[
          { type: 'Incoming', product: 'T-Shirt Blue', qty: '+10', date: '2024-05-14', color: 'bg-green-500', textColor: 'text-green-600' },
          { type: 'Outgoing', product: 'Jeans Black', qty: '-12', date: '2024-05-14', color: 'bg-red-500', textColor: 'text-red-600' },
          { type: 'Adjustment', product: 'Shoes White', qty: '+5', date: '2024-05-14', color: 'bg-blue-500', textColor: 'text-blue-600' },
          { type: 'Incoming', product: 'Socks Red', qty: '+20', date: '2024-05-14', color: 'bg-green-500', textColor: 'text-green-600' },
        ].map((txn, idx) => (
          <div key={idx} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-3 h-3 rounded-full ${txn.color}`}></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-900">{txn.type}</span>
                  </div>
                  <div className="text-xs text-gray-600">{txn.product}</div>
                  <div className="text-xs text-gray-400">{txn.date}</div>
                </div>
              </div>
              <div className={`text-sm font-bold ${txn.textColor}`}>{txn.qty}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Bill of Materials Mockup
  const BillOfMaterialsMockup = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm h-full flex items-center justify-center">
      <div className="bg-gray-50 rounded-lg p-6 w-full h-full flex flex-col items-center justify-center">
        <div className="relative w-full max-w-md h-full flex flex-col items-center justify-center">
          {/* Parent product - Bicycle at top */}
          <div className="relative mb-6">
            <div className="bg-blue-600 rounded-lg px-4 py-3 shadow-md">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-white" />
                <span className="text-white text-sm font-semibold">Bicycle</span>
              </div>
              <div className="text-white text-xs mt-1">Buildable: 12 units</div>
            </div>
          </div>

          {/* Components - arranged horizontally with vertical connection lines */}
          <div className="relative flex justify-center gap-6 mt-6">
            {[
              { name: 'Frame', qty: '1x', stock: '15' },
              { name: 'Wheels', qty: '2x', stock: '24' },
              { name: 'Chain', qty: '1x', stock: '18' },
            ].map((comp, idx) => (
              <div key={idx} className="relative flex flex-col items-center">
                {/* Vertical connection line from Bicycle bottom center to component top center */}
                <svg 
                  className="absolute -top-6 left-1/2 transform -translate-x-1/2" 
                  style={{ overflow: 'visible', width: '2px', height: '24px' }}
                >
                  <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#3b82f6" strokeWidth="2" />
                </svg>
                {/* Component box */}
                <div className="bg-gray-200 rounded-lg px-3 py-2 shadow-sm min-w-[80px] mt-6">
                  <div className="text-xs font-semibold text-gray-900">{comp.name}</div>
                  <div className="text-xs text-gray-600">{comp.qty}</div>
                  <div className="text-xs text-gray-700">Stock: {comp.stock}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const features = [
    {
      id: 'variants',
      title: 'Manage Product Variants',
      description: 'Handle product variations like sizes, colors, and styles with ease. Track each variant\'s stock, pricing, and attributes separately while maintaining a unified product structure.',
      bullets: [
        'Create unlimited variants for any product',
        'Track stock levels per variant independently',
        'Manage variant-specific pricing and SKUs',
        'Organize variants with custom attributes',
      ],
      mockup: <VariantsMockup />,
      icon: Package,
      alignLeft: true,
    },
    {
      id: 'warehouse',
      title: 'Multi-Location Warehouse Management',
      description: 'Manage inventory across multiple warehouses, locations, and storage facilities. Get real-time visibility into stock levels at each location and transfer items seamlessly.',
      bullets: [
        'Create and manage unlimited warehouse locations',
        'Track stock levels per location in real-time',
        'Transfer inventory between locations easily',
        'Get location-specific low stock alerts',
      ],
      mockup: <WarehouseManagementMockup />,
      icon: Warehouse,
      alignLeft: false,
    },
    {
      id: 'categories',
      title: 'Organize with Hierarchical Categories',
      description: 'Organize your inventory with flexible category structures. Create parent and child categories to match your business needs and find products quickly.',
      bullets: [
        'Build unlimited category hierarchies',
        'Assign products to multiple categories',
        'View product counts per category',
        'Customize category icons and colors',
      ],
      mockup: <CategoriesManagementMockup />,
      icon: Tags,
      alignLeft: true,
    },
    {
      id: 'transactions',
      title: 'Complete Transaction History',
      description: 'Track every stock movement with a comprehensive transaction history. See who made changes, when they happened, and why, giving you full audit trail visibility.',
      bullets: [
        'View complete transaction history for all products',
        'Filter by date, user, and transaction type',
        'Export transaction data for reporting',
        'Track adjustments, incoming, and outgoing movements',
      ],
      mockup: <TransactionsHistoryMockup />,
      icon: History,
      alignLeft: false,
    },
    {
      id: 'bom',
      title: 'Build Complex Products with BOM',
      description: 'Create and manage bills of materials for assembled products. Track component requirements, calculate buildable quantities, and manage multiple BOM versions.',
      bullets: [
        'Define component requirements for assembled products',
        'Calculate buildable quantities automatically',
        'Manage multiple BOM versions per product',
        'Track component stock levels and availability',
      ],
      mockup: <BillOfMaterialsMockup />,
      icon: Layers,
      alignLeft: true,
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="inline-block mb-4 sm:mb-6">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
              Platform Features
            </span>
          </div>
          <h2 className="max-w-3xl mx-auto text-balance text-5xl sm:text-6xl md:text-6xl lg:text-6xl leading-none font-bold text-blue-800">
            Everything You Need to Manage Your Inventory
          </h2>
          <p className="text-md pt-4 text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
            Powerful features designed to streamline your inventory management workflow
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-24 sm:space-y-32">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center"
            >
              {/* Content */}
              <div className={feature.alignLeft ? '' : 'md:order-2'}>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mockup */}
              <div className={`${feature.alignLeft ? '' : 'md:order-1'} h-[300px] sm:h-[400px] md:h-[400px]`}>
                {feature.mockup}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


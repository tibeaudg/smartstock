import type { GlossaryPageConfig } from './createGlossaryPage';

export const glossaryEntries: Record<string, GlossaryPageConfig> = {
  '80-20-inventory-rule': {
    path: '/glossary/80-20-inventory-rule',
    title: '80/20 Inventory Rule',
    definition:
      'The 80/20 inventory rule states that 80% of your profits should come from 20% of your inventory. The rule is based on the Pareto Principle, a management consulting principle that suggests that 80% of effects come from 20% of causes.',
  },
  'asset-control': {
    path: '/glossary/asset-control',
    title: 'Asset Control',
    definition:
      'Asset control, also called asset tracking, refers to the asset management process companies use to organize, track, audit, and record essential details about long-term assets. A critical part of inventory management, asset control requires a company to adopt an effective asset management system, such as asset management software.',
  },
  'bill-of-materials': {
    path: '/glossary/bill-of-materials',
    title: 'Bill of Materials (BOM)',
    definition:
      'A bill of materials, or BOM, is an itemized list of every single raw material, part, and component needed to manufacture a product. A BOM also lists how much of each item is required and even includes secondary requirements like manuals, guides, and packaging.',
  },
  'consignment-inventory': {
    path: '/glossary/consignment-inventory',
    title: 'Consignment Inventory',
    definition:
      'Consignment inventory, or consigned inventory, is a supply chain strategy in which a retailer sells a supplier’s inventory to its customers, but that inventory remains owned by the supplier until the product is sold.',
  },
  'economic-order-quantity': {
    path: '/glossary/economic-order-quantity',
    title: 'Economic Order Quantity (EOQ)',
    shortDescription: 'A mathematical formula that determines the optimal order quantity to minimize total inventory costs, balancing ordering costs and holding costs.',
    definition:
      'Economic order quantity, or EOQ, reveals precisely how much of a product a company should order to meet customer demand while minimizing holding and ordering costs. The EOQ formula calculates the ideal order size that minimizes the total cost of inventory management, including the cost of ordering and the cost of holding inventory. This helps businesses optimize cash flow and reduce waste while ensuring adequate stock levels.',
    metaDescription: 'Learn what Economic Order Quantity (EOQ) is and how to calculate optimal order quantities to minimize inventory costs. Complete guide with formula and examples.',
    keywords: ['EOQ', 'economic order quantity', 'optimal order quantity', 'inventory ordering', 'EOQ formula', 'inventory cost optimization'],
    keyTakeaways: [
      'EOQ helps determine the optimal order quantity that minimizes total inventory costs.',
      'The formula balances ordering costs (costs of placing orders) with holding costs (costs of storing inventory).',
      'EOQ assumes constant demand and fixed costs, so it works best for stable inventory items.',
      'Modern inventory management software automatically calculates EOQ and adjusts for real-world variability.',
    ],
    faqs: [
      {
        question: 'What is the Economic Order Quantity (EOQ) formula?',
        answer: 'The EOQ formula is: EOQ = √(2DS/H), where D = annual demand, S = ordering cost per order, and H = holding cost per unit per year. This calculates the order quantity that minimizes total inventory costs. However, most businesses use inventory management software that automatically calculates optimal order quantities based on real-time data.',
      },
      {
        question: 'When should I use EOQ?',
        answer: 'EOQ works best for items with stable, predictable demand and fixed ordering and holding costs. It\'s ideal for standard inventory items with consistent usage patterns. For items with variable demand or seasonal fluctuations, use inventory management software that adjusts for real-world conditions.',
      },
      {
        question: 'What are the limitations of EOQ?',
        answer: 'EOQ assumes constant demand, fixed ordering costs, and fixed holding costs. In reality, demand fluctuates, suppliers offer volume discounts, and storage costs vary. Modern inventory management systems account for these variables to provide more accurate ordering recommendations.',
      },
      {
        question: 'How does EOQ relate to reorder points?',
        answer: 'EOQ determines how much to order, while reorder point determines when to order. Together, they form a complete inventory management strategy. When inventory reaches the reorder point, you place an order for the EOQ amount. Learn more about reorder points and safety stock in our inventory management guides.',
      },
    ],
    relatedLinks: [
      { label: 'Reorder Point', href: '/glossary/reorder-point' },
      { label: 'Safety Stock', href: '/glossary/safety-stock' },
      { label: 'Inventory Management', href: '/glossary/inventory-management' },
      { label: 'Inventory Optimization', href: '/glossary/inventory-optimization' },
    ],
  },
  'hedging-inventory': {
    path: '/glossary/hedging-inventory',
    title: 'Hedging Inventory',
    definition:
      'Hedging inventory, or hedge inventory, is inventory that a business has purchased in anticipation of a significant, uncontrollable event that will likely make the inventory a business needs too challenging to acquire or too expensive to buy.',
  },
  inventory: {
    path: '/glossary/inventory',
    title: 'Inventory',
    definition:
      'Inventory refers to the goods, materials, and assets that a business carries for day-to-day operations.',
  },
  'inventory-asset': {
    path: '/glossary/inventory-asset',
    title: 'Inventory Asset',
    shortDescription: 'Inventory assets are reusable items owned by a business that are used to create products or services but are not sold to customers or consumed by employees.',
    definition:
      'An inventory asset is an item your business owns and uses on a continual basis, such as equipment, tools, machinery, vehicles, and more. Inventory assets are not sold to customers nor are they consumed by employees; they are the reusable items that your company uses to create its product or services. Unlike consumable inventory that gets used up, inventory assets retain their value and are tracked for depreciation, maintenance, and operational purposes. Effective inventory asset management ensures these valuable items are properly maintained, tracked, and utilized to maximize their value and lifespan.',
    metaDescription: 'Learn what inventory assets are, how to track and manage inventory assets effectively, and best practices for inventory asset management. Complete guide to tracking inventory assets.',
    keywords: ['inventory asset', 'asset inventory', 'inventory asset management', 'tracking inventory assets', 'business assets', 'equipment inventory', 'asset tracking'],
    keyTakeaways: [
      'Inventory assets are reusable items used to create products or services but not sold to customers.',
      'Unlike consumable inventory, assets retain value and are tracked for depreciation and maintenance.',
      'Effective asset management ensures proper maintenance, tracking, and utilization.',
      'Modern inventory management software helps track assets, maintenance schedules, and depreciation.',
    ],
    faqs: [
      {
        question: 'What is an inventory asset?',
        answer: 'An inventory asset is a reusable item owned by a business that is used to create products or services but is not sold to customers or consumed by employees. Examples include equipment, tools, machinery, vehicles, computers, and other long-term operational items that retain value over time.',
      },
      {
        question: 'What is the difference between inventory assets and regular inventory?',
        answer: 'Inventory assets are reusable items that retain value and are used repeatedly in operations, while regular inventory consists of consumable items that are sold to customers or used up in production. Assets are tracked for depreciation and maintenance, while inventory is tracked for sales and cost of goods sold.',
      },
      {
        question: 'What are examples of inventory assets?',
        answer: 'Examples of inventory assets include manufacturing equipment, vehicles, tools and machinery, computers and IT equipment, office furniture, specialized equipment, safety equipment, and any other reusable items that support business operations but are not part of the final product sold to customers.',
      },
      {
        question: 'Why is tracking inventory assets important?',
        answer: 'Tracking inventory assets is important for financial reporting (depreciation), maintenance scheduling, loss prevention, insurance purposes, tax compliance, and operational efficiency. Proper asset tracking ensures items are maintained, utilized effectively, and accounted for in financial records.',
      },
      {
        question: 'How do you manage inventory assets?',
        answer: 'Manage inventory assets by creating a comprehensive asset register, assigning unique identifiers (barcodes or serial numbers), tracking asset locations, scheduling preventive maintenance, monitoring asset utilization, recording depreciation, and using inventory management software for centralized tracking and reporting.',
      },
      {
        question: 'What is asset inventory management?',
        answer: 'Asset inventory management is the process of tracking, maintaining, and managing all business assets throughout their lifecycle. It includes asset registration, location tracking, maintenance scheduling, depreciation tracking, and disposal management. Modern asset management software automates these processes.',
      },
      {
        question: 'How can inventory software help track inventory assets?',
        answer: 'Inventory management software helps track assets by providing barcode scanning, location tracking, maintenance scheduling, depreciation calculations, utilization monitoring, and comprehensive reporting. Software like StockFlow enables real-time asset visibility, automated maintenance reminders, and detailed asset history tracking.',
      },
      {
        question: 'What information should be tracked for inventory assets?',
        answer: 'Track asset information including unique identifier, description, purchase date and cost, current location, assigned user or department, maintenance schedule and history, depreciation value, warranty information, serial numbers, and photos. This comprehensive data enables effective asset management and financial reporting.',
      },
    ],
    relatedLinks: [
      { label: 'Inventory Management', href: '/glossary/inventory-management' },
      { label: 'MRO Inventory', href: '/glossary/mro-inventory' },
      { label: 'Asset Control', href: '/glossary/asset-control' },
      { label: 'Inventory Optimization', href: '/glossary/inventory-optimization' },
    ],
  },
  'inventory-automation': {
    path: '/glossary/inventory-automation',
    title: 'Inventory Automation',
    shortDescription: 'The use of technology and software to automate inventory tracking, reordering, and management processes, reducing manual work and errors.',
    definition:
      'Inventory management automation is a way to track, analyze, and control items using inventory management software and related technology, including barcodes or QR codes. By automating and digitizing your inventory processes, you can avoid tracking inventory manually or on a spreadsheet which frees up valuable time and reduces the risk of costly errors. Automation includes automatic reorder point alerts, barcode scanning, real-time synchronization, automated reporting, and integration with other business systems.',
    metaDescription: 'Learn what inventory automation is and how automated inventory management systems can save time, reduce errors, and improve efficiency. Complete automation guide.',
    keywords: ['inventory automation', 'automated inventory', 'inventory software', 'inventory technology', 'barcode automation', 'inventory digitization'],
    keyTakeaways: [
      'Inventory automation uses software and technology to eliminate manual tracking and reduce errors.',
      'Key automation features include barcode scanning, automatic reordering, and real-time synchronization.',
      'Automation saves time, reduces costs, and improves inventory accuracy significantly.',
      'Modern inventory management software provides comprehensive automation capabilities.',
    ],
    faqs: [
      {
        question: 'What is inventory automation?',
        answer: 'Inventory automation is the use of technology and software to automate inventory management tasks like tracking, reordering, and reporting. This includes barcode scanning, automatic reorder point alerts, real-time synchronization, and integration with other business systems. Automation eliminates manual data entry and reduces errors.',
      },
      {
        question: 'What are the benefits of inventory automation?',
        answer: 'Benefits include reduced manual labor, fewer errors, real-time visibility, faster processes, lower costs, better accuracy, and the ability to scale operations without proportionally increasing staff. Automation also provides better data for decision-making.',
      },
      {
        question: 'How does barcode scanning automate inventory?',
        answer: 'Barcode scanning automates data entry by instantly recording inventory movements with 99.9% accuracy. Instead of manually typing product codes and quantities, staff scan barcodes to update inventory levels in real-time. This speeds up receiving, picking, and cycle counting processes significantly.',
      },
      {
        question: 'What inventory tasks can be automated?',
        answer: 'You can automate reorder point alerts, purchase order generation, inventory tracking via barcode scanning, stock level synchronization, reporting, low stock notifications, and integration with accounting and e-commerce systems. Learn more about inventory management software features.',
      },
    ],
    relatedLinks: [
      { label: 'Inventory Management Software', href: '/inventory-management-software' },
      { label: 'Barcode Scanning', href: '/barcode-scanning-inventory' },
      { label: 'Inventory Management', href: '/glossary/inventory-management' },
      { label: 'Reorder Point', href: '/glossary/reorder-point' },
    ],
  },
  'inventory-cycle-counting': {
    path: '/glossary/inventory-cycle-counting',
    title: 'Inventory Cycle Counting',
    shortDescription: 'An inventory auditing method where specific inventory items are counted on a rotating schedule throughout the year, rather than counting everything at once.',
    definition:
      'Inventory cycle counting is an inventory strategy in which specific, defined portions of inventory are counted on a rotating, recurrent schedule. The schedule specifies exactly when each portion of inventory will be counted, spreading the work throughout the year instead of all at once. This approach is more efficient than annual physical inventory counts, allows for continuous accuracy monitoring, and minimizes business disruption. High-value or fast-moving items are typically counted more frequently than low-value items.',
    metaDescription: 'Learn what inventory cycle counting is, how it works, and best practices for implementing cycle counting to maintain inventory accuracy year-round.',
    keywords: ['cycle counting', 'inventory cycle count', 'continuous counting', 'inventory audit', 'physical inventory', 'stock counting'],
    keyTakeaways: [
      'Cycle counting spreads inventory audits throughout the year instead of doing one annual count.',
      'High-value and fast-moving items should be counted more frequently than low-value items.',
      'Cycle counting minimizes business disruption and provides continuous accuracy monitoring.',
      'Use inventory management software to schedule and track cycle counts efficiently.',
    ],
    faqs: [
      {
        question: 'What is inventory cycle counting?',
        answer: 'Cycle counting is an inventory auditing method where you count specific items on a rotating schedule throughout the year, rather than counting all inventory at once. This approach is more efficient, less disruptive, and provides continuous accuracy monitoring compared to annual physical inventory counts.',
      },
      {
        question: 'How often should you cycle count inventory?',
        answer: 'Frequency depends on item value and movement. High-value items (A-items) might be counted monthly or quarterly, medium-value items (B-items) quarterly or semi-annually, and low-value items (C-items) annually. Fast-moving items should be counted more frequently than slow-moving ones.',
      },
      {
        question: 'What is the difference between cycle counting and physical inventory?',
        answer: 'Cycle counting counts specific items on a rotating schedule throughout the year, while physical inventory counts everything at once, typically annually. Cycle counting is less disruptive, provides continuous monitoring, and is more efficient for most businesses.',
      },
      {
        question: 'How do you perform a cycle count?',
        answer: 'To perform a cycle count, schedule specific items or locations, use barcode scanners for accuracy, count items and record quantities in your inventory management system, investigate and resolve discrepancies, and update records. Modern inventory software helps schedule and track cycle counts. Learn more in our cycle counting guide.',
      },
    ],
    relatedLinks: [
      { label: 'Cycle Count', href: '/cycle-count' },
      { label: 'Inventory Management', href: '/glossary/inventory-management' },
      { label: '80/20 Inventory Rule', href: '/glossary/80-20-inventory-rule' },
      { label: 'How to Perform Cycle Count', href: '/how-to-perform-an-inventory-cycle-count' },
    ],
  },
  'inventory-list': {
    path: '/glossary/inventory-list',
    title: 'Inventory List',
    definition:
      'An inventory list is a complete, itemized list of every product your business has in stock. This includes your raw materials, work-in-progress, and finished goods.',
  },
  'inventory-optimization': {
    path: '/glossary/inventory-optimization',
    title: 'Inventory Optimization',
    shortDescription: 'The process of maintaining optimal inventory levels to balance customer demand satisfaction with cost minimization, avoiding both stockouts and overstock.',
    definition:
      'Inventory optimization occurs when a business maintains a "just right" amount of inventory to satisfy customer demand. By optimizing inventory, a business reduces costs while avoiding stockouts, excess inventory, and inventory obsolescence. This involves analyzing demand patterns, setting appropriate reorder points and safety stock levels, implementing ABC analysis, and using data-driven decision-making to balance service levels with inventory investment. Effective inventory optimization requires continuous monitoring, regular analysis of demand trends, supplier performance evaluation, and adjustment of inventory policies based on changing market conditions and business objectives.',
    metaDescription: 'Learn what inventory optimization is, strategies for optimal stock levels, tools and techniques for inventory balance, and how to achieve inventory efficiency. Complete guide to stock level optimization.',
    keywords: ['inventory optimization', 'optimal inventory', 'stock optimization', 'inventory balance', 'inventory efficiency', 'stock level optimization', 'inventory management optimization', 'inventory cost optimization'],
    keyTakeaways: [
      'Inventory optimization balances customer service levels with inventory investment costs.',
      'Key strategies include ABC analysis, demand forecasting, and setting optimal reorder points.',
      'Modern inventory management software uses AI and analytics to automatically optimize stock levels.',
      'Regular review and adjustment of inventory policies is essential as demand patterns change.',
      'Effective optimization requires analyzing multiple factors including demand variability, lead times, and carrying costs.',
    ],
    faqs: [
      {
        question: 'What is inventory optimization?',
        answer: 'Inventory optimization is the process of maintaining the right amount of inventory to meet customer demand while minimizing costs. It involves balancing the risk of stockouts against the cost of carrying excess inventory, using data and analytics to make informed decisions. The goal is to achieve optimal stock levels that maximize service levels while minimizing total inventory costs.',
      },
      {
        question: 'How do you optimize inventory levels?',
        answer: 'Optimize inventory by analyzing demand patterns, setting appropriate reorder points and safety stock, implementing ABC analysis to prioritize high-value items, using accurate demand forecasting, leveraging inventory management software that provides real-time insights and automated recommendations, reviewing supplier performance, and regularly adjusting policies based on changing conditions.',
      },
      {
        question: 'What are the benefits of inventory optimization?',
        answer: 'Benefits include reduced carrying costs, improved cash flow, fewer stockouts, less waste from obsolescence, better customer service, increased profitability, freed warehouse space, and better capital allocation. Optimized inventory also enables businesses to respond more quickly to market changes and customer demands.',
      },
      {
        question: 'What tools help with inventory optimization?',
        answer: 'Modern inventory management software like StockFlow provides real-time analytics, demand forecasting, automated reorder point calculations, ABC analysis, optimization recommendations, and reporting. These tools use historical data, algorithms, and AI to suggest optimal stock levels for each item and identify optimization opportunities.',
      },
      {
        question: 'What is ABC analysis in inventory optimization?',
        answer: 'ABC analysis categorizes inventory items into three groups: A-items (high value, low quantity), B-items (moderate value and quantity), and C-items (low value, high quantity). This helps prioritize optimization efforts, with A-items receiving more attention and tighter controls, while C-items can use simpler management approaches.',
      },
      {
        question: 'How does demand forecasting help with inventory optimization?',
        answer: 'Demand forecasting predicts future customer demand based on historical data, trends, and external factors. Accurate forecasting helps set optimal inventory levels, plan purchasing, reduce stockouts, and minimize excess inventory. Modern inventory software uses machine learning to improve forecast accuracy over time.',
      },
      {
        question: 'What factors affect optimal inventory levels?',
        answer: 'Factors affecting optimal inventory levels include demand variability, supplier lead times, order costs, carrying costs, service level targets, storage capacity, cash flow constraints, and product characteristics (perishability, obsolescence risk). Effective optimization considers all these factors together.',
      },
      {
        question: 'How often should you review and optimize inventory?',
        answer: 'Review and optimize inventory regularly, with frequency depending on business characteristics. High-velocity items may need weekly reviews, while slower-moving items might be reviewed monthly or quarterly. Continuous monitoring through inventory management software enables real-time optimization adjustments as conditions change.',
      },
      {
        question: 'What is the relationship between inventory optimization and cash flow?',
        answer: 'Inventory optimization directly impacts cash flow by reducing the amount of capital tied up in inventory. Lower inventory levels free up cash for other business investments, while still maintaining service levels. Optimized inventory also reduces costs from obsolescence, storage, and financing, improving overall cash flow.',
      },
    ],
    relatedLinks: [
      { label: 'Inventory Management', href: '/glossary/inventory-management' },
      { label: 'Safety Stock', href: '/glossary/safety-stock' },
      { label: 'Economic Order Quantity', href: '/glossary/economic-order-quantity' },
      { label: '80/20 Inventory Rule', href: '/glossary/80-20-inventory-rule' },
      { label: 'Reorder Point', href: '/glossary/reorder-point' },
    ],
  },
  'inventory-turnover': {
    path: '/glossary/inventory-turnover',
    title: 'Inventory Turnover',
    shortDescription: 'A key performance metric that measures how many times a company sells and replaces its inventory over a specific period, indicating inventory efficiency.',
    definition:
      'Inventory turnover refers to how many times a company has sold and replaced inventory over a specific time period, typically a year. It reveals whether your business stocks excessive inventory relative to what your company actually uses or sells. A higher turnover ratio generally indicates efficient inventory management and strong sales, while a lower ratio may suggest overstocking, slow-moving items, or poor sales performance. The formula is: Inventory Turnover = Cost of Goods Sold / Average Inventory.',
    metaDescription: 'Learn what inventory turnover is, how to calculate it, and what good inventory turnover ratios look like. Essential KPI for inventory management efficiency.',
    keywords: ['inventory turnover', 'inventory turnover ratio', 'stock turnover', 'inventory efficiency', 'turnover rate', 'inventory KPI'],
    keyTakeaways: [
      'Inventory turnover measures how efficiently a business sells and replaces its inventory.',
      'Higher turnover ratios generally indicate better inventory management and stronger sales.',
      'Optimal turnover ratios vary by industry - compare against industry benchmarks.',
      'Use inventory management software to track turnover ratios and identify slow-moving items.',
    ],
    faqs: [
      {
        question: 'What is a good inventory turnover ratio?',
        answer: 'Good inventory turnover ratios vary by industry. Retail typically sees 4-6 turns per year, while manufacturing may see 6-12 turns. A ratio that\'s too high might indicate stockouts, while too low suggests overstocking. Compare your ratio to industry benchmarks and track trends over time.',
      },
      {
        question: 'How do you calculate inventory turnover?',
        answer: 'Inventory Turnover = Cost of Goods Sold (COGS) / Average Inventory. Average Inventory = (Beginning Inventory + Ending Inventory) / 2. Calculate this over a specific period, typically one year. Most inventory management software automatically calculates this metric.',
      },
      {
        question: 'What does low inventory turnover mean?',
        answer: 'Low inventory turnover suggests you\'re holding too much inventory relative to sales, which ties up capital and increases carrying costs. It may indicate overstocking, slow-moving items, or declining sales. Review your inventory levels and identify items that need attention.',
      },
      {
        question: 'How can I improve my inventory turnover ratio?',
        answer: 'Improve turnover by reducing excess inventory, identifying and clearing slow-moving items, improving demand forecasting, negotiating better terms with suppliers, and using inventory management software to optimize stock levels. Learn more in our inventory turnover ratio guide.',
      },
    ],
    relatedLinks: [
      { label: 'Inventory Management', href: '/glossary/inventory-management' },
      { label: 'Inventory Optimization', href: '/glossary/inventory-optimization' },
      { label: 'Inventory Turnover Ratio Guide', href: '/inventory-turnover-ratio' },
      { label: '80/20 Inventory Rule', href: '/glossary/80-20-inventory-rule' },
    ],
  },
  'just-in-time-inventory': {
    path: '/glossary/just-in-time-inventory',
    title: 'Just in Time Inventory',
    shortDescription: 'An inventory management strategy that minimizes inventory levels by ordering and receiving goods only when needed for production or sale.',
    definition:
      'The just-in-time (JIT) inventory system is about having the lowest inventory amounts possible in order to minimize inventory costs, increase efficiency, and reduce waste. JIT requires precise coordination with suppliers, accurate demand forecasting, and reliable delivery schedules. When implemented correctly, JIT reduces carrying costs, minimizes waste from obsolescence, and improves cash flow by freeing up capital that would otherwise be tied up in inventory.',
    metaDescription: 'Learn what Just-in-Time (JIT) inventory management is, its benefits, challenges, and how to implement it effectively. Complete guide to JIT inventory systems.',
    keywords: ['JIT inventory', 'just in time', 'lean inventory', 'JIT manufacturing', 'inventory reduction', 'lean management'],
    keyTakeaways: [
      'JIT minimizes inventory levels by receiving goods only when needed, reducing carrying costs and waste.',
      'Successful JIT requires reliable suppliers, accurate demand forecasting, and efficient logistics.',
      'JIT works best for businesses with stable demand patterns and strong supplier relationships.',
      'Modern inventory management software helps implement JIT by providing real-time visibility and automated reordering.',
    ],
    faqs: [
      {
        question: 'What is Just-in-Time (JIT) inventory management?',
        answer: 'Just-in-Time inventory management is a strategy that minimizes inventory levels by ordering and receiving goods only when they\'re needed for production or sale. This reduces carrying costs, minimizes waste, and improves cash flow. JIT requires close coordination with suppliers and accurate demand forecasting.',
      },
      {
        question: 'What are the benefits of JIT inventory?',
        answer: 'JIT benefits include reduced inventory carrying costs, less waste from obsolescence, improved cash flow, better space utilization, and increased efficiency. However, it requires reliable suppliers and accurate demand forecasting to avoid stockouts.',
      },
      {
        question: 'What are the risks of JIT inventory?',
        answer: 'JIT risks include vulnerability to supply chain disruptions, potential stockouts if demand exceeds forecasts, and dependency on supplier reliability. Businesses need backup suppliers and safety stock for critical items to mitigate these risks.',
      },
      {
        question: 'How do I implement JIT inventory management?',
        answer: 'To implement JIT, start by analyzing demand patterns, building strong supplier relationships, implementing real-time inventory tracking, and using inventory management software for automated reordering. Start with non-critical items and gradually expand as you gain experience. Learn more in our JIT management guide.',
      },
    ],
    relatedLinks: [
      { label: 'Inventory Management', href: '/glossary/inventory-management' },
      { label: 'Safety Stock', href: '/glossary/safety-stock' },
      { label: 'JIT Management Guide', href: '/jit-management' },
      { label: 'Inventory Optimization', href: '/glossary/inventory-optimization' },
    ],
  },
  kitting: {
    path: '/glossary/kitting',
    title: 'Kitting',
    shortDescription: 'Kitting is an inventory management strategy where individual items are bundled together into a single kit that is tracked, used, or sold as one unit.',
    definition:
      'Kitting is an inventory management strategy in which individual pieces, parts, or items are bundled into a kit. This kit is tracked, used, and even sold as a single piece of inventory, even though it has several parts. Kitting simplifies inventory management by reducing the number of individual items to track, improves picking efficiency, ensures all required components are available together, and can reduce packaging and shipping costs. Common kitting applications include assembly kits, repair kits, starter kits, and product bundles.',
    metaDescription: 'Learn what kitting is, how the kitting process works, benefits of inventory kitting, and best practices for implementing kitting in your inventory management. Complete guide to product kitting.',
    keywords: ['kitting', 'inventory kitting', 'kitting process', 'product kitting', 'assembly kitting', 'kit inventory', 'inventory bundling'],
    keyTakeaways: [
      'Kitting bundles individual items into a single tracked unit, simplifying inventory management.',
      'Kitting improves picking efficiency and ensures all required components are available together.',
      'Common kitting applications include assembly kits, repair kits, and product bundles.',
      'Modern inventory management software supports kitting with bill of materials and automated tracking.',
    ],
    faqs: [
      {
        question: 'What is kitting in inventory management?',
        answer: 'Kitting in inventory management is the process of bundling individual items, parts, or components together into a single kit that is tracked, used, or sold as one unit. Instead of managing each component separately, the kit is managed as a single inventory item, simplifying tracking and improving efficiency.',
      },
      {
        question: 'What are the benefits of kitting?',
        answer: 'Benefits of kitting include simplified inventory tracking, improved picking efficiency, reduced errors by ensuring all components are available together, faster order fulfillment, reduced packaging costs, better inventory organization, and the ability to sell bundled products at a premium. Kitting also helps maintain consistent quality by ensuring all required parts are included.',
      },
      {
        question: 'What are examples of kitting?',
        answer: 'Examples of kitting include assembly kits (all parts needed to assemble a product), repair kits (components needed for a specific repair), starter kits (items for new customers or projects), product bundles (multiple products sold together), maintenance kits (parts for scheduled maintenance), and first aid kits (medical supplies bundled together).',
      },
      {
        question: 'How does the kitting process work?',
        answer: 'The kitting process involves identifying items to bundle, creating a bill of materials (BOM) for the kit, assembling components into kits, assigning a unique identifier to each kit, tracking kits as single inventory units, and updating component inventory when kits are created or used. Inventory management software automates much of this process.',
      },
      {
        question: 'What is the difference between kitting and bundling?',
        answer: 'Kitting typically refers to bundling items that are used together in operations or assembly, while bundling often refers to selling multiple products together. However, the terms are sometimes used interchangeably. Kitting is more commonly used in manufacturing and operations, while bundling is more common in sales and marketing.',
      },
      {
        question: 'How can inventory software help with kitting?',
        answer: 'Inventory management software helps with kitting by managing bill of materials (BOM), tracking component inventory levels, automating kit creation, updating component inventory when kits are assembled, providing kitting reports, and ensuring all required components are available before kit assembly. Software like StockFlow supports comprehensive kitting workflows.',
      },
      {
        question: 'What are the challenges of kitting?',
        answer: 'Challenges of kitting include managing component inventory levels, ensuring all components are available when needed, tracking kit assembly and disassembly, handling partial kits, managing kit variations, and coordinating kitting with production schedules. Inventory management software addresses these challenges with automation and real-time tracking.',
      },
      {
        question: 'When should you use kitting?',
        answer: 'Use kitting when you frequently use the same combination of items together, want to improve picking efficiency, need to ensure all required components are available, want to reduce packaging and shipping costs, or want to sell bundled products. Kitting is especially beneficial for assembly operations, repair services, and product bundling.',
      },
    ],
    relatedLinks: [
      { label: 'Bill of Materials', href: '/glossary/bill-of-materials' },
      { label: 'Inventory Management', href: '/glossary/inventory-management' },
      { label: 'Inventory Optimization', href: '/glossary/inventory-optimization' },
      { label: 'Inventory Asset', href: '/glossary/inventory-asset' },
    ],
  },
  'landed-cost': {
    path: '/glossary/landed-cost',
    title: 'Landed Cost',
    definition:
      'Landed cost, also known as true cost, is the sum of all the different taxes and fees associated with shipping a product plus the cost of creating the product itself. It includes customs, risk, and overhead.',
  },
  'minimum-order-quantity': {
    path: '/glossary/minimum-order-quantity',
    title: 'Minimum Order Quantity',
    definition:
      'A minimum order quantity is the smallest amount of product a supplier will sell to a business placing an order.',
  },
  'moving-average-cost': {
    path: '/glossary/moving-average-cost',
    title: 'Moving Average Cost',
    definition:
      'Moving average cost is the cost of existing inventory on hand plus the cost of new inventory ordered divided by the exact number of items in stock.',
  },
  'mro-inventory': {
    path: '/glossary/mro-inventory',
    title: 'MRO Inventory',
    shortDescription: 'Maintenance, repair, and operations inventory includes all items used to maintain equipment, repair assets, and keep business operations running smoothly, but are not sold to customers.',
    definition:
      'MRO inventory stands for maintenance, repair, and operations inventory. While not sold to a customer, this inventory is utilized by a business to conduct preventive and corrective maintenance on an asset or keep day-to-day business activities running efficiently. MRO inventory includes spare parts, tools, consumables, safety equipment, cleaning supplies, and other items necessary for maintaining production equipment, facilities, and operational infrastructure. Effective MRO inventory management ensures that maintenance teams have the right parts and supplies when needed, preventing equipment downtime and operational disruptions.',
    metaDescription: 'Learn what MRO inventory is, how to manage maintenance repair and operations inventory effectively, and best practices for MRO inventory management. Complete guide to MRO inventory.',
    keywords: ['mro inventory', 'maintenance repair operations inventory', 'mro inventory management', 'mro stock', 'maintenance inventory', 'repair inventory', 'operations inventory'],
    keyTakeaways: [
      'MRO inventory includes all items used for maintenance, repair, and operations but not sold to customers.',
      'Effective MRO inventory management prevents equipment downtime and operational disruptions.',
      'MRO inventory typically includes spare parts, tools, consumables, and safety equipment.',
      'Modern inventory management software helps optimize MRO inventory levels and reduce carrying costs.',
    ],
    faqs: [
      {
        question: 'What is MRO inventory?',
        answer: 'MRO inventory stands for maintenance, repair, and operations inventory. It includes all items used to maintain equipment, repair assets, and keep business operations running, but are not sold to customers. This includes spare parts, tools, consumables, safety equipment, cleaning supplies, and other operational necessities.',
      },
      {
        question: 'What are examples of MRO inventory?',
        answer: 'Examples of MRO inventory include spare parts (bearings, belts, filters), tools and equipment, lubricants and fluids, safety equipment (gloves, goggles, hard hats), cleaning supplies, office supplies, electrical components, plumbing supplies, and any items used to maintain facilities and equipment.',
      },
      {
        question: 'Why is MRO inventory management important?',
        answer: 'MRO inventory management is important because it ensures maintenance teams have the right parts and supplies when needed, preventing equipment downtime and operational disruptions. Poor MRO management can lead to production delays, increased maintenance costs, and reduced equipment reliability. Effective management optimizes stock levels, reduces carrying costs, and improves maintenance efficiency.',
      },
      {
        question: 'How do you manage MRO inventory?',
        answer: 'Manage MRO inventory by categorizing items by criticality and usage frequency, setting appropriate reorder points, using inventory management software for tracking, implementing barcode scanning for accuracy, analyzing usage patterns to optimize stock levels, and establishing relationships with reliable suppliers. Modern inventory management software like StockFlow automates many of these processes.',
      },
      {
        question: 'What is the difference between MRO inventory and production inventory?',
        answer: 'MRO inventory consists of items used to maintain and repair equipment and facilities but are not part of the finished product. Production inventory includes raw materials, components, and work-in-progress that become part of the final product sold to customers. MRO inventory supports operations, while production inventory is transformed into products.',
      },
      {
        question: 'How can inventory software help with MRO inventory management?',
        answer: 'Inventory management software helps with MRO inventory by providing real-time tracking, automated reorder points, usage analytics, multi-location support, barcode scanning, and reporting. Software like StockFlow helps optimize MRO stock levels, reduce carrying costs, prevent stockouts, and improve maintenance efficiency through data-driven decision-making.',
      },
      {
        question: 'What are common challenges in MRO inventory management?',
        answer: 'Common challenges include tracking inventory across multiple locations, preventing stockouts of critical parts, managing a wide variety of low-value items, controlling carrying costs, ensuring parts availability for maintenance schedules, and maintaining accurate inventory counts. Inventory management software addresses these challenges with automation and real-time visibility.',
      },
      {
        question: 'How do you calculate optimal MRO inventory levels?',
        answer: 'Calculate optimal MRO inventory levels by analyzing historical usage patterns, considering lead times from suppliers, assessing the criticality of items, factoring in maintenance schedules, and balancing the cost of carrying inventory against the cost of stockouts. Inventory management software automatically calculates optimal levels based on these factors.',
      },
    ],
    relatedLinks: [
      { label: 'Inventory Management', href: '/glossary/inventory-management' },
      { label: 'Inventory Optimization', href: '/glossary/inventory-optimization' },
      { label: 'Safety Stock', href: '/glossary/safety-stock' },
      { label: 'Inventory Asset', href: '/glossary/inventory-asset' },
    ],
  },
  'pick-list': {
    path: '/glossary/pick-list',
    title: 'Pick List',
    definition:
      'A pick list is an essential document that communicates precisely what inventory a warehouse picker will need to pick to fulfill a customer’s order.',
  },
  'purchase-requisition': {
    path: '/glossary/purchase-requisition',
    title: 'Purchase Requisition',
    definition:
      'A purchase requisition is an unofficial, internal document your company uses to inform your purchasing department about inventory or assets your company intends to buy.',
  },
  'safety-stock': {
    path: '/glossary/safety-stock',
    title: 'Safety Stock',
    shortDescription: 'Extra inventory kept on hand to protect against stockouts caused by unexpected demand spikes, supplier delays, or forecasting errors.',
    definition:
      'Safety stock inventory, also referred to as buffer stock, is extra inventory your business keeps on hand in the event of unexpected disruptions or delays. This buffer protects against stockouts when demand exceeds forecasts, suppliers deliver late, or production issues occur. Calculating optimal safety stock levels balances the cost of carrying extra inventory against the risk and cost of stockouts.',
    metaDescription: 'Learn what safety stock is and how to calculate optimal buffer stock levels to prevent stockouts while minimizing inventory costs. Essential guide for inventory management.',
    keywords: ['safety stock', 'buffer stock', 'inventory buffer', 'stockout prevention', 'safety stock calculation'],
    keyTakeaways: [
      'Safety stock protects against stockouts from demand variability, supplier delays, and forecasting errors.',
      'Optimal safety stock balances carrying costs against stockout costs.',
      'Use inventory management software to automatically calculate and adjust safety stock based on real-time demand patterns.',
      'Regularly review and adjust safety stock levels as demand patterns and lead times change.',
    ],
    faqs: [
      {
        question: 'What is safety stock in inventory management?',
        answer: 'Safety stock is extra inventory kept on hand to protect against stockouts caused by unexpected demand spikes, supplier delays, or forecasting errors. It acts as a buffer to ensure you can meet customer demand even when things don\'t go as planned.',
      },
      {
        question: 'How do you calculate safety stock?',
        answer: 'Safety stock calculation typically considers average demand, demand variability, lead time, and lead time variability. The formula is: Safety Stock = (Maximum Daily Usage × Maximum Lead Time) - (Average Daily Usage × Average Lead Time). Modern inventory management software like StockFlow automatically calculates optimal safety stock levels based on historical data.',
      },
      {
        question: 'What is the difference between safety stock and reorder point?',
        answer: 'Safety stock is the buffer inventory you keep on hand, while reorder point is the inventory level at which you should place a new order. Reorder point = (Average Daily Usage × Lead Time) + Safety Stock. Learn more about reorder points in our inventory management guide.',
      },
      {
        question: 'How much safety stock should I keep?',
        answer: 'The optimal safety stock level depends on your demand variability, supplier reliability, and the cost of stockouts versus carrying costs. Businesses with high demand variability or unreliable suppliers need more safety stock. Use inventory management software to calculate optimal levels based on your specific data.',
      },
    ],
    relatedLinks: [
      { label: 'Reorder Point', href: '/glossary/reorder-point' },
      { label: 'Inventory Management', href: '/glossary/inventory-management' },
      { label: 'How to Calculate Safety Stock', href: '/how-to-calculate-safety-stock' },
      { label: 'Inventory Optimization', href: '/glossary/inventory-optimization' },
    ],
  },
  'supplier-relationship-management': {
    path: '/glossary/supplier-relationship-management',
    title: 'Supplier Relationship Management (SRM)',
    definition:
      'Supplier relationship management, also known as SRM, is a big-picture strategy businesses implement to ensure their relationships with suppliers are as optimized, coordinated, and profitable as possible.',
  },
  'uom-inventory': {
    path: '/glossary/uom-inventory',
    title: 'UOM Inventory',
    definition:
      'Inventory units of measure, or UoM, are the standardized, physical units by which your business quantifies its stock. Units of measure help businesses understand how much of a given product they really have in stock and how much they’re ordering or selling.',
  },
  'vendor-managed-inventory': {
    path: '/glossary/vendor-managed-inventory',
    title: 'Vendor Managed Inventory (VMI)',
    definition:
      'Vendor-managed inventory is a supply chain arrangement where a supplier, manufacturer, or other qualified third-party controls the inventory and inventory-related decisions on behalf of the seller.',
  },
};

export function getGlossaryEntry(slug: string): GlossaryPageConfig {
  const entry = glossaryEntries[slug];
  if (!entry) {
    throw new Error(`Glossary entry not found for slug: ${slug}`);
  }
  return entry;
}




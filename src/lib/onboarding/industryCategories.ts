// Rule-based industry to categories and sample products mapper
// This can be upgraded to use AI later

export type IndustryType = 
  | 'retail'
  | 'restaurant'
  | 'warehouse'
  | 'pharmacy'
  | 'electronics'
  | 'clothing'
  | 'grocery'
  | 'hardware'
  | 'automotive'
  | 'other';

export interface CategorySuggestion {
  name: string;
  description?: string;
  sampleProducts: string[];
}

export interface IndustryMapping {
  industry: IndustryType;
  displayName: string;
  categories: CategorySuggestion[];
}

export const industryMappings: Record<IndustryType, IndustryMapping> = {
  retail: {
    industry: 'retail',
    displayName: 'Retail',
    categories: [
      {
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        sampleProducts: ['Laptop', 'Smartphone', 'Headphones', 'Tablet', 'Charging Cable']
      },
      {
        name: 'Clothing',
        description: 'Apparel and fashion items',
        sampleProducts: ['T-Shirt', 'Jeans', 'Jacket', 'Shoes', 'Accessories']
      },
      {
        name: 'Home & Garden',
        description: 'Home improvement and garden supplies',
        sampleProducts: ['Garden Tools', 'Furniture', 'Decorations', 'Lighting', 'Plants']
      },
      {
        name: 'Beauty & Personal Care',
        description: 'Cosmetics and personal hygiene products',
        sampleProducts: ['Shampoo', 'Soap', 'Perfume', 'Makeup', 'Skincare']
      },
      {
        name: 'Sports & Outdoors',
        description: 'Sports equipment and outdoor gear',
        sampleProducts: ['Bicycle', 'Tennis Racket', 'Camping Tent', 'Running Shoes', 'Yoga Mat']
      },
      {
        name: 'Toys & Games',
        description: 'Toys, games, and entertainment items',
        sampleProducts: ['Board Games', 'Action Figures', 'Puzzles', 'Dolls', 'Building Blocks']
      },
      {
        name: 'Books & Media',
        description: 'Books, magazines, and media products',
        sampleProducts: ['Novels', 'Cookbooks', 'Children\'s Books', 'DVDs', 'Magazines']
      },
      {
        name: 'Kitchen & Dining',
        description: 'Kitchenware and dining essentials',
        sampleProducts: ['Cookware Set', 'Dinner Plates', 'Cutlery', 'Coffee Maker', 'Blender']
      },
      {
        name: 'Health & Wellness',
        description: 'Health supplements and wellness products',
        sampleProducts: ['Vitamins', 'Protein Powder', 'Fitness Tracker', 'Massage Oil', 'Essential Oils']
      }
    ]
  },
  restaurant: {
    industry: 'restaurant',
    displayName: 'Restaurant',
    categories: [
      {
        name: 'Food & Beverages',
        description: 'Food items and drinks',
        sampleProducts: ['Pasta', 'Rice', 'Cooking Oil', 'Spices', 'Beverages']
      },
      {
        name: 'Kitchen Supplies',
        description: 'Kitchen equipment and utensils',
        sampleProducts: ['Plates', 'Cutlery', 'Cooking Pots', 'Cleaning Supplies', 'Napkins']
      },
      {
        name: 'Fresh Produce',
        description: 'Fresh fruits and vegetables',
        sampleProducts: ['Tomatoes', 'Lettuce', 'Onions', 'Potatoes', 'Carrots']
      },
      {
        name: 'Meat & Seafood',
        description: 'Fresh and frozen meat products',
        sampleProducts: ['Chicken Breast', 'Beef Steak', 'Salmon', 'Pork Chops', 'Shrimp']
      },
      {
        name: 'Dairy & Eggs',
        description: 'Dairy products and eggs',
        sampleProducts: ['Milk', 'Cheese', 'Butter', 'Eggs', 'Yogurt']
      },
      {
        name: 'Bakery Items',
        description: 'Bread, pastries, and baked goods',
        sampleProducts: ['Bread Loaf', 'Croissants', 'Muffins', 'Bagels', 'Dinner Rolls']
      },
      {
        name: 'Beverages & Drinks',
        description: 'Non-alcoholic and alcoholic beverages',
        sampleProducts: ['Soft Drinks', 'Juice', 'Coffee Beans', 'Tea', 'Wine']
      },
      {
        name: 'Frozen Foods',
        description: 'Frozen food items',
        sampleProducts: ['Frozen Vegetables', 'Ice Cream', 'Frozen Pizza', 'Frozen Fries', 'Frozen Meals']
      },
      {
        name: 'Condiments & Sauces',
        description: 'Sauces, condiments, and dressings',
        sampleProducts: ['Ketchup', 'Mustard', 'Mayonnaise', 'Hot Sauce', 'Salad Dressing']
      }
    ]
  },
  warehouse: {
    industry: 'warehouse',
    displayName: 'Distribution',
    categories: [
      {
        name: 'Raw Materials',
        description: 'Raw materials and components',
        sampleProducts: ['Steel Sheets', 'Plastic Pellets', 'Wood Planks', 'Fabric Rolls', 'Components']
      },
      {
        name: 'Packaging',
        description: 'Packaging materials',
        sampleProducts: ['Boxes', 'Bubble Wrap', 'Tape', 'Labels', 'Pallets']
      },
      {
        name: 'Finished Goods',
        description: 'Completed products ready for shipment',
        sampleProducts: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E']
      },
      {
        name: 'Electronics Components',
        description: 'Electronic parts and components',
        sampleProducts: ['Circuit Boards', 'Wires', 'Connectors', 'Batteries', 'Sensors']
      },
      {
        name: 'Textiles & Fabrics',
        description: 'Fabric and textile materials',
        sampleProducts: ['Cotton Fabric', 'Polyester', 'Leather', 'Wool', 'Synthetic Materials']
      },
      {
        name: 'Hardware & Fasteners',
        description: 'Hardware items and fastening materials',
        sampleProducts: ['Screws', 'Bolts', 'Nails', 'Rivets', 'Washers']
      },
      {
        name: 'Chemicals & Supplies',
        description: 'Chemical products and industrial supplies',
        sampleProducts: ['Cleaning Chemicals', 'Lubricants', 'Adhesives', 'Solvents', 'Sealants']
      },
      {
        name: 'Tools & Equipment',
        description: 'Warehouse tools and equipment',
        sampleProducts: ['Forklift Parts', 'Hand Trucks', 'Pallet Jacks', 'Scales', 'Label Printers']
      },
      {
        name: 'Safety Equipment',
        description: 'Safety and protective equipment',
        sampleProducts: ['Hard Hats', 'Safety Vests', 'Gloves', 'Safety Glasses', 'First Aid Kits']
      }
    ]
  },
  pharmacy: {
    industry: 'pharmacy',
    displayName: 'Healthcare',
    categories: [
      {
        name: 'Prescription Medications',
        description: 'Prescription drugs',
        sampleProducts: ['Antibiotics', 'Blood Pressure Medication', 'Diabetes Medication', 'Pain Management', 'Heart Medication']
      },
      {
        name: 'Over-the-Counter',
        description: 'OTC health products',
        sampleProducts: ['Pain Relievers', 'Vitamins', 'First Aid', 'Cough Syrup', 'Bandages']
      },
      {
        name: 'Health & Wellness',
        description: 'Wellness and personal care',
        sampleProducts: ['Supplements', 'Skincare', 'Hygiene Products', 'Medical Devices', 'Probiotics']
      },
      {
        name: 'Baby Care',
        description: 'Infant and baby care products',
        sampleProducts: ['Baby Formula', 'Diapers', 'Baby Wipes', 'Baby Shampoo', 'Baby Lotion']
      },
      {
        name: 'Personal Care',
        description: 'Personal hygiene and care items',
        sampleProducts: ['Toothpaste', 'Shampoo', 'Deodorant', 'Soap', 'Body Wash']
      },
      {
        name: 'Medical Supplies',
        description: 'Medical equipment and supplies',
        sampleProducts: ['Thermometers', 'Blood Pressure Monitors', 'Glucose Meters', 'Nebulizers', 'Stethoscopes']
      },
      {
        name: 'Nutrition & Supplements',
        description: 'Nutritional supplements and vitamins',
        sampleProducts: ['Multivitamins', 'Protein Supplements', 'Omega-3', 'Calcium', 'Iron Supplements']
      },
      {
        name: 'Skincare & Cosmetics',
        description: 'Skincare and cosmetic products',
        sampleProducts: ['Moisturizers', 'Sunscreen', 'Anti-aging Cream', 'Acne Treatment', 'Face Masks']
      },
      {
        name: 'Home Health Care',
        description: 'Home healthcare products',
        sampleProducts: ['Wheelchairs', 'Walkers', 'Compression Stockings', 'Hot/Cold Packs', 'Orthopedic Supports']
      }
    ]
  },
  electronics: {
    industry: 'electronics',
    displayName: 'Electronics',
    categories: [
      {
        name: 'Computers & Laptops',
        description: 'Computer hardware',
        sampleProducts: ['Desktop PC', 'Laptop', 'Monitor', 'Keyboard', 'Mouse']
      },
      {
        name: 'Mobile Devices',
        description: 'Smartphones and tablets',
        sampleProducts: ['Smartphone', 'Tablet', 'Smartwatch', 'Earbuds', 'Chargers']
      },
      {
        name: 'Accessories',
        description: 'Electronic accessories',
        sampleProducts: ['Cables', 'Cases', 'Screen Protectors', 'Stands', 'Power Banks']
      },
      {
        name: 'Audio Equipment',
        description: 'Audio and sound equipment',
        sampleProducts: ['Headphones', 'Speakers', 'Soundbars', 'Microphones', 'Amplifiers']
      },
      {
        name: 'TV & Home Theater',
        description: 'Televisions and home theater systems',
        sampleProducts: ['Smart TV', 'Sound System', 'Streaming Device', 'TV Mount', 'Projector']
      },
      {
        name: 'Gaming',
        description: 'Gaming consoles and accessories',
        sampleProducts: ['Gaming Console', 'Gaming Mouse', 'Gaming Keyboard', 'Game Controller', 'Gaming Headset']
      },
      {
        name: 'Cameras & Photography',
        description: 'Cameras and photography equipment',
        sampleProducts: ['Digital Camera', 'DSLR', 'Action Camera', 'Camera Lens', 'Tripod']
      },
      {
        name: 'Smart Home',
        description: 'Smart home devices and automation',
        sampleProducts: ['Smart Speaker', 'Smart Light Bulbs', 'Security Camera', 'Smart Thermostat', 'Smart Doorbell']
      },
      {
        name: 'Storage & Memory',
        description: 'Data storage and memory devices',
        sampleProducts: ['USB Drive', 'External Hard Drive', 'SSD', 'Memory Card', 'Cloud Storage Device']
      }
    ]
  },
  clothing: {
    industry: 'clothing',
    displayName: 'Fashion',
    categories: [
      {
        name: 'Men\'s Clothing',
        description: 'Men\'s apparel',
        sampleProducts: ['Men\'s Shirt', 'Men\'s Pants', 'Men\'s Jacket', 'Men\'s Shoes', 'Men\'s Shorts']
      },
      {
        name: 'Women\'s Clothing',
        description: 'Women\'s apparel',
        sampleProducts: ['Women\'s Dress', 'Women\'s Blouse', 'Women\'s Jeans', 'Women\'s Shoes', 'Women\'s Skirt']
      },
      {
        name: 'Accessories',
        description: 'Fashion accessories',
        sampleProducts: ['Bags', 'Belts', 'Jewelry', 'Hats', 'Sunglasses']
      },
      {
        name: 'Children\'s Clothing',
        description: 'Kids and children\'s apparel',
        sampleProducts: ['Kids T-Shirt', 'Kids Jeans', 'Kids Dress', 'Kids Shoes', 'Kids Jacket']
      },
      {
        name: 'Activewear',
        description: 'Sports and activewear clothing',
        sampleProducts: ['Athletic Shorts', 'Sports Bra', 'Yoga Pants', 'Running Shirt', 'Gym Bag']
      },
      {
        name: 'Underwear & Lingerie',
        description: 'Underwear and intimate apparel',
        sampleProducts: ['Boxers', 'Briefs', 'Bras', 'Underwear', 'Socks']
      },
      {
        name: 'Outerwear',
        description: 'Coats, jackets, and outerwear',
        sampleProducts: ['Winter Coat', 'Rain Jacket', 'Leather Jacket', 'Windbreaker', 'Parka']
      },
      {
        name: 'Footwear',
        description: 'Shoes and footwear',
        sampleProducts: ['Sneakers', 'Boots', 'Sandals', 'Dress Shoes', 'Flip Flops']
      },
      {
        name: 'Swimwear',
        description: 'Swimming and beachwear',
        sampleProducts: ['Swim Trunks', 'Bikini', 'One-Piece Swimsuit', 'Beach Cover-Up', 'Rash Guard']
      }
    ]
  },
  grocery: {
    industry: 'grocery',
    displayName: 'Grocery Store',
    categories: [
      {
        name: 'Fresh Produce',
        description: 'Fresh fruits and vegetables',
        sampleProducts: ['Apples', 'Bananas', 'Lettuce', 'Tomatoes', 'Carrots']
      },
      {
        name: 'Dairy Products',
        description: 'Dairy and eggs',
        sampleProducts: ['Milk', 'Cheese', 'Yogurt', 'Butter', 'Eggs']
      },
      {
        name: 'Pantry Items',
        description: 'Dry goods and canned items',
        sampleProducts: ['Pasta', 'Rice', 'Canned Goods', 'Cereal', 'Flour']
      },
      {
        name: 'Meat & Seafood',
        description: 'Fresh and packaged meat products',
        sampleProducts: ['Ground Beef', 'Chicken Breast', 'Salmon Fillet', 'Pork Chops', 'Shrimp']
      },
      {
        name: 'Bakery',
        description: 'Fresh baked goods and bread',
        sampleProducts: ['White Bread', 'Whole Wheat Bread', 'Bagels', 'Croissants', 'Muffins']
      },
      {
        name: 'Beverages',
        description: 'Drinks and beverages',
        sampleProducts: ['Water', 'Soft Drinks', 'Juice', 'Coffee', 'Tea']
      },
      {
        name: 'Frozen Foods',
        description: 'Frozen food products',
        sampleProducts: ['Frozen Vegetables', 'Ice Cream', 'Frozen Pizza', 'Frozen Meals', 'Frozen Fruits']
      },
      {
        name: 'Snacks & Confectionery',
        description: 'Snacks, chips, and sweets',
        sampleProducts: ['Potato Chips', 'Chocolate Bars', 'Cookies', 'Crackers', 'Nuts']
      },
      {
        name: 'Organic & Health Foods',
        description: 'Organic and health-focused products',
        sampleProducts: ['Organic Vegetables', 'Gluten-Free Products', 'Plant-Based Alternatives', 'Superfoods', 'Health Bars']
      }
    ]
  },
  hardware: {
    industry: 'hardware',
    displayName: 'Hardware',
    categories: [
      {
        name: 'Tools',
        description: 'Hand and power tools',
        sampleProducts: ['Hammer', 'Drill', 'Screwdriver Set', 'Wrench', 'Saw']
      },
      {
        name: 'Building Materials',
        description: 'Construction materials',
        sampleProducts: ['Nails', 'Screws', 'Wood Planks', 'Paint', 'Tiles']
      },
      {
        name: 'Hardware Supplies',
        description: 'General hardware items',
        sampleProducts: ['Locks', 'Hinges', 'Bolts', 'Rope', 'Tape']
      },
      {
        name: 'Electrical Supplies',
        description: 'Electrical components and wiring',
        sampleProducts: ['Electrical Wire', 'Light Switches', 'Outlet Plugs', 'Circuit Breakers', 'LED Bulbs']
      },
      {
        name: 'Plumbing',
        description: 'Plumbing supplies and fixtures',
        sampleProducts: ['Pipe Fittings', 'Faucets', 'Toilet Parts', 'Pipe Wrenches', 'Plumber\'s Tape']
      },
      {
        name: 'Paint & Supplies',
        description: 'Paint and painting supplies',
        sampleProducts: ['Interior Paint', 'Exterior Paint', 'Paint Brushes', 'Rollers', 'Paint Thinner']
      },
      {
        name: 'Garden & Outdoor',
        description: 'Garden tools and outdoor supplies',
        sampleProducts: ['Garden Hose', 'Shovels', 'Lawn Mower', 'Garden Tools', 'Plant Pots']
      },
      {
        name: 'Safety Equipment',
        description: 'Safety and protective gear',
        sampleProducts: ['Safety Glasses', 'Work Gloves', 'Hard Hats', 'Ear Protection', 'Safety Vests']
      },
      {
        name: 'Storage & Organization',
        description: 'Storage solutions and organization',
        sampleProducts: ['Toolboxes', 'Shelving Units', 'Storage Bins', 'Cabinets', 'Hooks']
      }
    ]
  },
  automotive: {
    industry: 'automotive',
    displayName: 'Automotive',
    categories: [
      {
        name: 'Engine Parts',
        description: 'Engine components',
        sampleProducts: ['Oil Filter', 'Spark Plugs', 'Air Filter', 'Battery', 'Belts']
      },
      {
        name: 'Body Parts',
        description: 'Exterior and body components',
        sampleProducts: ['Bumper', 'Headlight', 'Mirror', 'Door Handle', 'Windshield']
      },
      {
        name: 'Accessories',
        description: 'Automotive accessories',
        sampleProducts: ['Floor Mats', 'Car Cover', 'Phone Mount', 'USB Charger', 'Air Freshener']
      },
      {
        name: 'Brake System',
        description: 'Brake components and parts',
        sampleProducts: ['Brake Pads', 'Brake Rotors', 'Brake Fluid', 'Brake Lines', 'Brake Calipers']
      },
      {
        name: 'Suspension & Steering',
        description: 'Suspension and steering components',
        sampleProducts: ['Shock Absorbers', 'Struts', 'Tie Rods', 'Control Arms', 'Steering Wheel']
      },
      {
        name: 'Tires & Wheels',
        description: 'Tires, wheels, and related items',
        sampleProducts: ['All-Season Tires', 'Winter Tires', 'Wheel Rims', 'Tire Pressure Gauge', 'Wheel Covers']
      },
      {
        name: 'Electrical & Lighting',
        description: 'Electrical components and lighting',
        sampleProducts: ['Headlight Bulbs', 'Tail Lights', 'Fuses', 'Alternator', 'Starter Motor']
      },
      {
        name: 'Interior Parts',
        description: 'Interior components and trim',
        sampleProducts: ['Seat Covers', 'Dashboard Cover', 'Steering Wheel Cover', 'Carpet Mats', 'Sun Visors']
      },
      {
        name: 'Maintenance & Fluids',
        description: 'Maintenance supplies and fluids',
        sampleProducts: ['Motor Oil', 'Coolant', 'Transmission Fluid', 'Windshield Washer Fluid', 'Grease']
      }
    ]
  },
  other: {
    industry: 'other',
    displayName: 'Other',
    categories: []
  }
};

export function getIndustryMapping(industry: IndustryType): IndustryMapping {
  return industryMappings[industry] || industryMappings.other;
}

export function getSuggestedCategories(industry: IndustryType): CategorySuggestion[] {
  const mapping = getIndustryMapping(industry);
  return mapping.categories;
}

export function getAllIndustries(): Array<{ value: IndustryType; label: string }> {
  return Object.values(industryMappings).map(mapping => ({
    value: mapping.industry,
    label: mapping.displayName
  }));
}


/**
 * Curated list of icons for categories
 * Using lucide-react icon names
 */

export const categoryIcons = [
  // General
  'Package',
  'Box',
  'ShoppingCart',
  'Tag',
  'Tags',
  
  // Electronics
  'Smartphone',
  'Laptop',
  'Monitor',
  'Headphones',
  'Radio',
  'Camera',
  'Gamepad2',
  'Tv',
  'Watch',
  
  // Food & Beverage
  'Utensils',
  'Coffee',
  'Wine',
  'Beer',
  'Apple',
  'Carrot',
  'Fish',
  'ChefHat',
  'IceCream',
  
  // Clothing & Fashion
  'Shirt',
  'ShirtIcon',
  'Shoe',
  'Glasses',
  'Watch',
  'Bag',
  'Handbag',
  
  // Home & Garden
  'Home',
  'Sofa',
  'Lamp',
  'Bed',
  'Bath',
  'Kitchen',
  'Flower',
  'TreePine',
  'Sprout',
  
  // Tools & Hardware
  'Wrench',
  'Hammer',
  'Screwdriver',
  'Drill',
  'Paintbrush',
  'Paintbrush2',
  'Ruler',
  
  // Sports & Recreation
  'Dumbbell',
  'Bike',
  'Football',
  'Basketball',
  'Tennis',
  'Swimming',
  'Gamepad2',
  
  // Health & Beauty
  'Heart',
  'Pill',
  'Stethoscope',
  'Scissors',
  'Sparkles',
  'Droplet',
  
  // Books & Media
  'Book',
  'BookOpen',
  'Library',
  'Music',
  'Film',
  'Video',
  
  // Automotive
  'Car',
  'Truck',
  'Bike',
  'Fuel',
  'Wrench',
  
  // Office & Stationery
  'Pen',
  'PenTool',
  'FileText',
  'Folder',
  'Printer',
  'Calculator',
  'Briefcase',
  
  // Toys & Games
  'ToyBrick',
  'Puzzle',
  'Gamepad2',
  'Baby',
  
  // Pets
  'Dog',
  'Cat',
  'Fish',
  'Bird',
  
  // Miscellaneous
  'Gift',
  'Star',
  'Heart',
  'Diamond',
  'Gem',
  'Crown',
  'Trophy',
  'Award',
  'Zap',
  'Flame',
  'Snowflake',
  'Sun',
  'Moon',
  'Cloud',
] as const;

export type CategoryIcon = typeof categoryIcons[number];

/**
 * Get icon by name (case-insensitive)
 */
export function getIconByName(name: string): CategoryIcon | null {
  const icon = categoryIcons.find(
    icon => icon.toLowerCase() === name.toLowerCase()
  );
  return icon || null;
}

/**
 * Search icons by keyword
 */
export function searchIcons(keyword: string): CategoryIcon[] {
  if (!keyword.trim()) {
    return [...categoryIcons];
  }
  
  const lowerKeyword = keyword.toLowerCase();
  return categoryIcons.filter(icon => 
    icon.toLowerCase().includes(lowerKeyword)
  );
}

/**
 * Get icon suggestions based on category name
 */
export function getIconSuggestions(categoryName: string): CategoryIcon[] {
  const name = categoryName.toLowerCase();
  const suggestions: CategoryIcon[] = [];
  
  // Electronics
  if (name.includes('electronic') || name.includes('tech') || name.includes('computer')) {
    suggestions.push('Laptop', 'Smartphone', 'Monitor', 'Headphones');
  }
  
  // Food
  if (name.includes('food') || name.includes('restaurant') || name.includes('cafe')) {
    suggestions.push('Utensils', 'Coffee', 'ChefHat', 'Apple');
  }
  
  // Clothing
  if (name.includes('cloth') || name.includes('fashion') || name.includes('wear')) {
    suggestions.push('Shirt', 'Shoe', 'Bag');
  }
  
  // Home
  if (name.includes('home') || name.includes('furniture') || name.includes('decor')) {
    suggestions.push('Home', 'Sofa', 'Lamp', 'Bed');
  }
  
  // Tools
  if (name.includes('tool') || name.includes('hardware') || name.includes('equipment')) {
    suggestions.push('Wrench', 'Hammer', 'Screwdriver');
  }
  
  // Sports
  if (name.includes('sport') || name.includes('fitness') || name.includes('gym')) {
    suggestions.push('Dumbbell', 'Bike', 'Football');
  }
  
  // Health
  if (name.includes('health') || name.includes('medical') || name.includes('beauty')) {
    suggestions.push('Heart', 'Pill', 'Stethoscope', 'Sparkles');
  }
  
  // Books
  if (name.includes('book') || name.includes('media') || name.includes('music')) {
    suggestions.push('Book', 'BookOpen', 'Music');
  }
  
  // Automotive
  if (name.includes('car') || name.includes('auto') || name.includes('vehicle')) {
    suggestions.push('Car', 'Truck', 'Bike');
  }
  
  // Office
  if (name.includes('office') || name.includes('stationery') || name.includes('supply')) {
    suggestions.push('Pen', 'FileText', 'Briefcase');
  }
  
  // Toys
  if (name.includes('toy') || name.includes('game') || name.includes('play')) {
    suggestions.push('ToyBrick', 'Puzzle', 'Gamepad2');
  }
  
  // Pets
  if (name.includes('pet') || name.includes('animal')) {
    suggestions.push('Dog', 'Cat', 'Fish', 'Bird');
  }
  
  // Default fallback
  if (suggestions.length === 0) {
    suggestions.push('Package', 'Tag', 'Box');
  }
  
  return suggestions.slice(0, 6); // Return top 6 suggestions
}


/**
 * Predefined color palette for categories
 */

export const categoryColors = [
  // Primary colors
  { name: 'Blue', value: '#3B82F6', textColor: '#FFFFFF' },
  { name: 'Green', value: '#10B981', textColor: '#FFFFFF' },
  { name: 'Red', value: '#EF4444', textColor: '#FFFFFF' },
  { name: 'Yellow', value: '#F59E0B', textColor: '#000000' },
  { name: 'Purple', value: '#8B5CF6', textColor: '#FFFFFF' },
  { name: 'Pink', value: '#EC4899', textColor: '#FFFFFF' },
  { name: 'Orange', value: '#F97316', textColor: '#FFFFFF' },
  { name: 'Indigo', value: '#6366F1', textColor: '#FFFFFF' },
  
  // Secondary colors
  { name: 'Teal', value: '#14B8A6', textColor: '#FFFFFF' },
  { name: 'Cyan', value: '#06B6D4', textColor: '#FFFFFF' },
  { name: 'Lime', value: '#84CC16', textColor: '#000000' },
  { name: 'Amber', value: '#FBBF24', textColor: '#000000' },
  { name: 'Rose', value: '#F43F5E', textColor: '#FFFFFF' },
  { name: 'Violet', value: '#A855F7', textColor: '#FFFFFF' },
  { name: 'Sky', value: '#0EA5E9', textColor: '#FFFFFF' },
  { name: 'Emerald', value: '#059669', textColor: '#FFFFFF' },
  
  // Neutral colors
  { name: 'Gray', value: '#6B7280', textColor: '#FFFFFF' },
  { name: 'Slate', value: '#64748B', textColor: '#FFFFFF' },
  { name: 'Stone', value: '#78716C', textColor: '#FFFFFF' },
  { name: 'Zinc', value: '#71717A', textColor: '#FFFFFF' },
] as const;

export type CategoryColor = typeof categoryColors[number];

/**
 * Get color by value
 */
export function getColorByValue(value: string): CategoryColor | null {
  return categoryColors.find(color => color.value.toLowerCase() === value.toLowerCase()) || null;
}

/**
 * Get color by name
 */
export function getColorByName(name: string): CategoryColor | null {
  return categoryColors.find(color => color.name.toLowerCase() === name.toLowerCase()) || null;
}

/**
 * Validate hex color code
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Get contrast color (black or white) for a given background color
 */
export function getContrastColor(backgroundColor: string): string {
  // Remove # if present
  const hex = backgroundColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Check if a color has sufficient contrast with white text
 */
export function hasGoodContrast(color: string): boolean {
  const contrastColor = getContrastColor(color);
  return contrastColor === '#FFFFFF';
}

/**
 * Get color suggestions based on category name
 */
export function getColorSuggestions(categoryName: string): CategoryColor[] {
  const name = categoryName.toLowerCase();
  const suggestions: CategoryColor[] = [];
  
  // Electronics - Blue/Indigo
  if (name.includes('electronic') || name.includes('tech') || name.includes('computer')) {
    suggestions.push(
      categoryColors.find(c => c.name === 'Blue')!,
      categoryColors.find(c => c.name === 'Indigo')!,
      categoryColors.find(c => c.name === 'Cyan')!
    );
  }
  
  // Food - Orange/Red
  if (name.includes('food') || name.includes('restaurant') || name.includes('cafe')) {
    suggestions.push(
      categoryColors.find(c => c.name === 'Orange')!,
      categoryColors.find(c => c.name === 'Red')!,
      categoryColors.find(c => c.name === 'Amber')!
    );
  }
  
  // Clothing - Pink/Purple
  if (name.includes('cloth') || name.includes('fashion') || name.includes('wear')) {
    suggestions.push(
      categoryColors.find(c => c.name === 'Pink')!,
      categoryColors.find(c => c.name === 'Purple')!,
      categoryColors.find(c => c.name === 'Rose')!
    );
  }
  
  // Home - Green/Teal
  if (name.includes('home') || name.includes('furniture') || name.includes('garden')) {
    suggestions.push(
      categoryColors.find(c => c.name === 'Green')!,
      categoryColors.find(c => c.name === 'Teal')!,
      categoryColors.find(c => c.name === 'Emerald')!
    );
  }
  
  // Tools - Gray/Slate
  if (name.includes('tool') || name.includes('hardware') || name.includes('equipment')) {
    suggestions.push(
      categoryColors.find(c => c.name === 'Gray')!,
      categoryColors.find(c => c.name === 'Slate')!,
      categoryColors.find(c => c.name === 'Stone')!
    );
  }
  
  // Sports - Red/Orange
  if (name.includes('sport') || name.includes('fitness') || name.includes('gym')) {
    suggestions.push(
      categoryColors.find(c => c.name === 'Red')!,
      categoryColors.find(c => c.name === 'Orange')!,
      categoryColors.find(c => c.name === 'Rose')!
    );
  }
  
  // Health - Red/Pink
  if (name.includes('health') || name.includes('medical') || name.includes('beauty')) {
    suggestions.push(
      categoryColors.find(c => c.name === 'Red')!,
      categoryColors.find(c => c.name === 'Pink')!,
      categoryColors.find(c => c.name === 'Rose')!
    );
  }
  
  // Books - Purple/Indigo
  if (name.includes('book') || name.includes('media') || name.includes('music')) {
    suggestions.push(
      categoryColors.find(c => c.name === 'Purple')!,
      categoryColors.find(c => c.name === 'Indigo')!,
      categoryColors.find(c => c.name === 'Violet')!
    );
  }
  
  // Default fallback
  if (suggestions.length === 0) {
    suggestions.push(
      categoryColors.find(c => c.name === 'Blue')!,
      categoryColors.find(c => c.name === 'Green')!,
      categoryColors.find(c => c.name === 'Purple')!
    );
  }
  
  return suggestions.filter(Boolean).slice(0, 6); // Return top 6 suggestions
}

/**
 * Generate a random color from the palette
 */
export function getRandomColor(): CategoryColor {
  const randomIndex = Math.floor(Math.random() * categoryColors.length);
  return categoryColors[randomIndex];
}


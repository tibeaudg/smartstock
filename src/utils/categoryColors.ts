/**
 * Category Color Utility
 * 
 * Generates consistent colors for categories based on their names.
 * Uses a simple hash function to map category names to a color palette.
 */

// Color palette with good contrast for readability
const CATEGORY_COLORS = [
  { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
] as const;

/**
 * Simple hash function to convert string to number
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Get color classes for a category based on its name
 * @param categoryName - The name of the category
 * @returns Object with bg, text, and border class names
 */
export function getCategoryColor(categoryName: string | null | undefined): {
  bg: string;
  text: string;
  border: string;
} {
  if (!categoryName) {
    return {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
    };
  }

  const hash = hashString(categoryName);
  const colorIndex = hash % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[colorIndex];
}

/**
 * Get combined className string for category badge
 * @param categoryName - The name of the category
 * @returns Combined className string
 */
export function getCategoryBadgeClasses(categoryName: string | null | undefined): string {
  const colors = getCategoryColor(categoryName);
  return `${colors.bg} ${colors.text} ${colors.border}`;
}



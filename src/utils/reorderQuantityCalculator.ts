/**
 * Calculate suggested reorder quantity based on historical demand and stock levels
 */

export interface ReorderQuantityParams {
  currentStock: number;
  minimumStockLevel: number;
  velocity30Days: number; // Average daily consumption over 30 days
  leadTimeDays?: number; // Supplier lead time in days (optional)
  safetyStockMultiplier?: number; // Multiplier for safety stock (default 1.5)
}

export interface ReorderQuantityResult {
  suggestedQuantity: number;
  reasoning: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Calculate suggested reorder quantity
 */
export function calculateReorderQuantity(
  params: ReorderQuantityParams
): ReorderQuantityResult {
  const {
    currentStock,
    minimumStockLevel,
    velocity30Days,
    leadTimeDays = 0,
    safetyStockMultiplier = 1.5,
  } = params;

  const reasoning: string[] = [];
  let suggestedQuantity = 0;
  let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low';

  // If no demand history, suggest enough to reach minimum stock level
  if (velocity30Days <= 0 || minimumStockLevel <= 0) {
    const deficit = Math.max(0, minimumStockLevel - currentStock);
    suggestedQuantity = deficit > 0 ? deficit : minimumStockLevel;
    reasoning.push('No demand history available');
    reasoning.push(`Suggested: ${suggestedQuantity} units to reach minimum stock level`);
    urgency = currentStock <= 0 ? 'critical' : 'medium';
    return { suggestedQuantity, reasoning, urgency };
  }

  // Calculate daily consumption rate
  const dailyConsumption = velocity30Days / 30;

  // Calculate days until stock runs out
  const daysUntilRunout = currentStock > 0 && dailyConsumption > 0
    ? Math.floor(currentStock / dailyConsumption)
    : 0;

  // Determine urgency
  if (daysUntilRunout <= 0 || currentStock <= minimumStockLevel) {
    urgency = 'critical';
  } else if (daysUntilRunout <= 7) {
    urgency = 'high';
  } else if (daysUntilRunout <= 14) {
    urgency = 'medium';
  } else {
    urgency = 'low';
  }

  // Calculate demand during lead time
  const leadTimeDemand = leadTimeDays > 0
    ? dailyConsumption * leadTimeDays
    : dailyConsumption * 7; // Default to 7 days if no lead time

  // Calculate safety stock
  const safetyStock = minimumStockLevel * safetyStockMultiplier;

  // Calculate target stock level (minimum + lead time demand + safety stock)
  const targetStockLevel = minimumStockLevel + leadTimeDemand + safetyStock;

  // Calculate how much we need to order
  const stockDeficit = Math.max(0, targetStockLevel - currentStock);

  // Round up to nearest reasonable quantity (round to nearest 5 for small orders, 10 for larger)
  if (stockDeficit <= 0) {
    suggestedQuantity = 0;
    reasoning.push('Current stock is sufficient');
  } else if (stockDeficit < 20) {
    suggestedQuantity = Math.ceil(stockDeficit / 5) * 5;
    reasoning.push(`Deficit: ${Math.round(stockDeficit)} units`);
  } else {
    suggestedQuantity = Math.ceil(stockDeficit / 10) * 10;
    reasoning.push(`Deficit: ${Math.round(stockDeficit)} units`);
  }

  // Add reasoning details
  if (dailyConsumption > 0) {
    reasoning.push(`Daily consumption: ${dailyConsumption.toFixed(1)} units/day`);
    if (daysUntilRunout > 0) {
      reasoning.push(`Will run out in ${daysUntilRunout} days`);
    } else {
      reasoning.push('Stock is depleted or below minimum');
    }
  }

  if (leadTimeDays > 0) {
    reasoning.push(`Lead time: ${leadTimeDays} days`);
    reasoning.push(`Demand during lead time: ${Math.round(leadTimeDemand)} units`);
  }

  reasoning.push(`Target stock: ${Math.round(targetStockLevel)} units`);

  return {
    suggestedQuantity,
    reasoning,
    urgency,
  };
}

/**
 * Calculate days until stock runs out based on current stock and consumption rate
 */
export function calculateDaysUntilRunout(
  currentStock: number,
  dailyConsumption: number
): number | null {
  if (dailyConsumption <= 0) {
    return null;
  }

  if (currentStock <= 0) {
    return 0;
  }

  return Math.floor(currentStock / dailyConsumption);
}



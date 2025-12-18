/**
 * Calculate days of cover based on stock quantity and daily consumption rate
 * @param quantity Current stock quantity
 * @param dailyConsumption Average daily consumption/sales
 * @returns Days of cover, or null if calculation cannot be performed
 */
export function calculateDaysOfCover(
  quantity: number,
  dailyConsumption: number | null | undefined
): number | null {
  if (dailyConsumption === null || dailyConsumption === undefined || dailyConsumption <= 0) {
    return null;
  }

  if (quantity <= 0) {
    return 0;
  }

  return quantity / dailyConsumption;
}

/**
 * Estimate daily consumption from stock movements over a period
 * @param stockMovements Array of stock movement quantities (negative for outgoing)
 * @param days Number of days in the period
 * @returns Average daily consumption (always positive)
 */
export function estimateDailyConsumption(
  stockMovements: number[],
  days: number
): number {
  if (days <= 0 || stockMovements.length === 0) {
    return 0;
  }

  // Sum all outgoing movements (negative values)
  const totalOutgoing = stockMovements
    .filter(m => m < 0)
    .reduce((sum, m) => sum + Math.abs(m), 0);

  return totalOutgoing / days;
}

/**
 * Calculate daily consumption from a 7-day velocity
 * This is useful when you already have velocity data from useProductDemandForecast
 */
export function velocityToDailyConsumption(velocity7Days: number): number {
  return velocity7Days / 7;
}

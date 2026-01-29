/**
 * Bulk import utilities: CSV parsing and format-agnostic column mapping
 * so any Excel/CSV file works regardless of header names.
 */

export interface ProductRow {
  name: string;
  description?: string;
  stock: number;
  minimum_level: number;
  purchase_price: number;
  sale_price: number;
  location?: string;
  category?: string;
  sku?: string;
  barcode?: string;
}

/** Product fields we can map from file columns */
export type ProductField = keyof ProductRow;

/** Synonyms for each product field (normalized: lowercase, trim). First match wins. */
export const COLUMN_SYNONYMS: Record<ProductField, string[]> = {
  name: [
    'name',
    'product name',
    'product',
    'article',
    'item',
    'naam',
    'artikel',
    'productnaam',
    'title',
    'product title',
  ],
  description: [
    'description',
    'desc',
    'omschrijving',
    'beschrijving',
    'notes',
    'remarks',
  ],
  stock: [
    'stock',
    'quantity',
    'qty',
    'voorraad',
    'in stock',
    'current stock',
    'quantity in stock',
    'inventory',
    'aantal',
  ],
  minimum_level: [
    'minimum level',
    'minimum_level',
    'min level',
    'min stock',
    'reorder point',
    'minimum stock',
    'minimum stock level',
    'min. level',
  ],
  purchase_price: [
    'purchase price',
    'purchase_price',
    'cost',
    'cost price',
    'buy price',
    'inkoopprijs',
    'aankoopprijs',
  ],
  sale_price: [
    'sale price',
    'sale_price',
    'price',
    'selling price',
    'unit price',
    'retail price',
    'prijs',
    'verkoopprijs',
    'selling price',
  ],
  location: [
    'location',
    'storage',
    'warehouse',
    'locatie',
    'opslag',
    'bin',
    'shelf',
  ],
  category: [
    'category',
    'categories',
    'categorie',
    'type',
    'group',
    'product group',
  ],
  sku: [
    'sku',
    'stock keeping unit',
    'article number',
    'artikelnummer',
    'product code',
    'code',
    'item number',
  ],
  barcode: [
    'barcode',
    'ean',
    'gtin',
    'upc',
  ],
};

function normalizeHeader(h: string): string {
  return String(h ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/**
 * Parse CSV text handling quoted fields and commas inside quotes.
 * Returns array of objects keyed by header (first row).
 */
export function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let j = 0; j < text.length; j++) {
    const c = text[j];
    if (inQuotes) {
      if (c === '"') {
        if (text[j + 1] === '"') {
          current += '"';
          j += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        currentRow.push(current.trim());
        current = '';
      } else if (c === '\n' || c === '\r') {
        currentRow.push(current.trim());
        rows.push(currentRow);
        currentRow = [];
        current = '';
        if (c === '\r' && text[j + 1] === '\n') j += 1;
      } else {
        current += c;
      }
    }
  }
  currentRow.push(current.trim());
  rows.push(currentRow);

  if (rows.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = rows[0].map(h => h.replace(/^"|"$/g, '').trim());
  const dataRows = rows.slice(1).filter(row => row.some(cell => String(cell).trim() !== ''));
  const out: Record<string, string>[] = [];

  for (const row of dataRows) {
    const obj: Record<string, string> = {};
    headers.forEach((header, idx) => {
      const value = row[idx] ?? '';
      obj[header] = value.replace(/^"|"$/g, '').trim();
    });
    out.push(obj);
  }

  return { headers, rows: out };
}

/**
 * Build mapping from file column names to product fields using synonym list.
 * fileHeaders: raw headers from the file (will be normalized for matching).
 */
export function buildColumnMapping(
  fileHeaders: string[]
): Record<ProductField, string | null> {
  const normalizedHeaders = fileHeaders.map(h => ({
    raw: h,
    norm: normalizeHeader(h),
  }));

  const mapping: Record<ProductField, string | null> = {
    name: null,
    description: null,
    stock: null,
    minimum_level: null,
    purchase_price: null,
    sale_price: null,
    location: null,
    category: null,
    sku: null,
    barcode: null,
  };

  const usedRaw = new Set<string>();

  for (const field of Object.keys(COLUMN_SYNONYMS) as ProductField[]) {
    const synonyms = COLUMN_SYNONYMS[field];
    let found: { raw: string } | null = null;
    for (const { raw, norm } of normalizedHeaders) {
      if (usedRaw.has(raw)) continue;
      const matches =
        norm === field.replace(/_/g, ' ') ||
        norm === field ||
        synonyms.some(syn => normalizeHeader(syn) === norm);
      if (matches) {
        found = { raw };
        usedRaw.add(raw);
        break;
      }
    }
    if (found) mapping[field] = found.raw;
  }

  return mapping;
}

/**
 * Normalize a raw row (keyed by file headers) into ProductRow using the column mapping.
 */
export function normalizeRow(
  row: Record<string, unknown>,
  mapping: Record<ProductField, string | null>
): ProductRow {
  const get = (field: ProductField): string | undefined => {
    const col = mapping[field];
    if (!col) return undefined;
    const v = row[col];
    if (v === null || v === undefined) return undefined;
    return String(v).trim();
  };

  const num = (field: ProductField): number => {
    const s = get(field);
    if (s === undefined || s === '') return 0;
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  };

  return {
    name: get('name') ?? '',
    description: get('description'),
    stock: num('stock'),
    minimum_level: num('minimum_level'),
    purchase_price: num('purchase_price'),
    sale_price: num('sale_price'),
    location: get('location'),
    category: get('category'),
    sku: get('sku'),
    barcode: get('barcode'),
  };
}

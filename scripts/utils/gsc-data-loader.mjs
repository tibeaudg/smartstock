import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');

/**
 * Load GSC data from PageResults.xlsx
 * @returns {Array<{url: string, clicks: number, impressions: number, ctr: number, position: number}>}
 */
export function loadGSCPageData() {
  const excelPath = path.join(repoRoot, 'src', 'pages', 'SEO', 'PageResults.xlsx');
  
  if (!fs.existsSync(excelPath)) {
    console.warn(`⚠️  GSC data file not found: ${excelPath}`);
    return [];
  }

  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  // Skip header row
  const data = rows.slice(1).map(row => {
    const url = row[0] || '';
    const clicks = parseInt(row[1]) || 0;
    const impressions = parseInt(row[2]) || 0;
    const ctr = parseFloat(row[3]) || 0;
    const position = parseFloat(row[4]) || 0;
    
    return { url, clicks, impressions, ctr, position };
  }).filter(row => row.url);
  
  return data;
}

/**
 * Normalize URL to match file path mapping
 * @param {string} url - Full URL from GSC
 * @returns {string} - Normalized path (e.g., "/best-inventory-management-software")
 */
export function normalizeGSCUrl(url) {
  if (!url) return '';
  
  // Remove protocol and domain
  let path = url.replace(/^https?:\/\/[^\/]+/, '');
  
  // Remove trailing slash except for root
  if (path.length > 1) {
    path = path.replace(/\/$/, '');
  }
  
  return path || '/';
}

/**
 * Get URLs that have impressions (traffic)
 * @returns {Set<string>} - Set of normalized URLs with impressions > 0
 */
export function getURLsWithImpressions() {
  const data = loadGSCPageData();
  return new Set(
    data
      .filter(row => row.impressions > 0)
      .map(row => normalizeGSCUrl(row.url))
  );
}

/**
 * Get URLs mapped to their performance data
 * @returns {Map<string, {clicks: number, impressions: number, ctr: number, position: number}>}
 */
export function getGSCDataMap() {
  const data = loadGSCPageData();
  const map = new Map();
  
  data.forEach(row => {
    const normalizedUrl = normalizeGSCUrl(row.url);
    map.set(normalizedUrl, {
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position
    });
  });
  
  return map;
}

/**
 * Check if URL is language-prefixed
 * @param {string} url - URL to check
 * @returns {boolean}
 */
export function isLanguagePrefixedUrl(url) {
  const languagePrefixes = ['/it/', '/fr/', '/de/', '/th/', '/hu/', '/sv/', '/si/', '/ro/', '/pl/', '/es/'];
  return languagePrefixes.some(prefix => url.startsWith(prefix));
}

/**
 * Check if URL is Dutch-prefixed (to keep for Belgium market)
 * @param {string} url - URL to check
 * @returns {boolean}
 */
export function isDutchPrefixedUrl(url) {
  return url.startsWith('/nl/') && url !== '/nl';
}


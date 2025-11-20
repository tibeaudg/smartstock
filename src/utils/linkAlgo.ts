// @/utils/linkAlgo.ts

/**
 * Fisher-Yates shuffle with a seeded random generator.
 * This ensures the "random" links are the same every time a crawler visits THIS specific page,
 * preserving link equity stability, but distinct across different pages.
 */
function seededRandom(seed: number) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }
  
  export const getStableRelatedArticles = (
    allArticles: any[], 
    currentPath: string, 
    limit: number = 3
  ) => {
    // Convert path to a numeric seed
    const seed = currentPath.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Filter out current page
    const candidates = allArticles.filter(a => a.path !== currentPath);
    
    // Shuffle deterministically
    let m = candidates.length, t, i;
    let currentSeed = seed;
    
    while (m) {
      i = Math.floor(seededRandom(currentSeed) * m--);
      currentSeed++; 
      t = candidates[m];
      candidates[m] = candidates[i];
      candidates[i] = t;
    }
  
    return candidates.slice(0, limit);
  };
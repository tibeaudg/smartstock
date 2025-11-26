import { createGlossaryPage } from './createGlossaryPage';
import { getGlossaryEntry } from './glossaryData';
// SEO component is included via createGlossaryPage
import SEO from '@/components/SEO';
import { StructuredData } from '@/components/StructuredData';

export default createGlossaryPage(getGlossaryEntry('just-in-time-inventory'));




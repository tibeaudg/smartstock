import SeoCategoryHubPage from '@/components/seo/SeoCategoryHubPage';

const canonicalPath = '/nl';

const routeFilter = (path: string) => path.startsWith('/nl/') || path === '/voorraadbeheer-horeca';

export default function NlHubPage() {
  return (
    <SeoCategoryHubPage
      canonicalPath={canonicalPath}
      title="Voorraadbeheer (NL)"
      seoTitle="Voorraadbeheer Software Gidsen (NL) | StockFlow"
      seoDescription="Nederlandstalige gidsen over voorraadbeheer, software vergelijkingen en branchespecifieke oplossingen."
      heroTitle="Voorraadbeheer Gidsen"
      heroDescription="Nederlandstalige artikelen over voorraadbeheer software, horeca, bouw, e-commerce en productie."
      routeFilter={routeFilter}
      emptyMessage="Nederlandstalige pagina's worden binnenkort toegevoegd."
    />
  );
}

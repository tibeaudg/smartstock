# Admin Onboarding Tracking

Deze documentatie beschrijft de admin onboarding tracking functionaliteit die is geïmplementeerd voor het bijhouden van gebruikers onboarding antwoorden.

## Overzicht

De admin onboarding tracking functionaliteit biedt:
- **Real-time tracking** van alle onboarding antwoorden
- **Statistieken dashboard** met overzichten en trends
- **Filtering en zoeken** door onboarding data
- **CSV export** functionaliteit
- **Gedetailleerde weergave** van individuele antwoorden

## Database Schema

### Onboarding Responses Tabel
```sql
CREATE TABLE public.onboarding_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sector TEXT NOT NULL,
    business_size TEXT NOT NULL,
    important_features JSONB NOT NULL DEFAULT '[]'::jsonb,
    specific_needs TEXT,
    expectations TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);
```

### Indexes
- `idx_onboarding_responses_user_id` - Voor snelle user lookups
- `idx_onboarding_responses_profile_id` - Voor profile joins
- `idx_onboarding_responses_sector` - Voor sector filtering
- `idx_onboarding_responses_business_size` - Voor business size filtering
- `idx_onboarding_responses_completed_at` - Voor date-based queries

## Componenten

### OnboardingTracking.tsx
Het hoofdcomponent voor admin onboarding tracking met:

#### Features:
- **Statistics Cards**: Totaal, vandaag, deze week, deze maand
- **Filtering**: Sector, bedrijfsgrootte, zoekterm
- **Data Table**: Overzicht van alle onboarding antwoorden
- **Details Modal**: Gedetailleerde weergave van individuele antwoorden
- **CSV Export**: Download functionaliteit
- **Real-time Updates**: Automatische data synchronisatie

#### Data Fetching:
```typescript
// Fetch onboarding responses with user data
const { data: responses } = useQuery({
  queryKey: ['onboardingResponses'],
  queryFn: fetchOnboardingResponses,
  refetchInterval: 30000, // Refresh every 30 seconds
});

// Fetch statistics
const { data: stats } = useQuery({
  queryKey: ['onboardingStats'],
  queryFn: fetchOnboardingStats,
  refetchInterval: 60000, // Refresh every minute
});
```

### useOnboardingSync.tsx
Hook voor real-time data synchronisatie:

#### Features:
- **Real-time subscriptions** voor database changes
- **Automatic query invalidation** bij data wijzigingen
- **Manual sync function** voor handmatige updates
- **Error handling** voor sync failures

## Admin Interface

### Navigatie
- **Tab**: "Onboarding Tracking" in admin dashboard
- **Route**: `/admin` → Onboarding Tracking tab
- **Access**: Alleen voor admin users (is_owner = true)

### Statistics Dashboard
- **Totaal Onboarding**: Alle voltooide onboarding
- **Vandaag**: Voltooid vandaag
- **Deze Week**: Voltooid deze week  
- **Deze Maand**: Voltooid deze maand

### Data Table
- **Gebruiker**: Naam en email
- **Sector**: Bedrijfssector
- **Bedrijfsgrootte**: Grootte van het bedrijf
- **Features**: Belangrijke features (max 2 + count)
- **Voltooid**: Datum van voltooiing
- **Acties**: Bekijk details knop

### Filtering & Search
- **Zoekterm**: Email, naam of sector
- **Sector Filter**: Dropdown met alle sectoren
- **Bedrijfsgrootte Filter**: Dropdown met alle groottes
- **Real-time Results**: Instant filtering

### Details Modal
- **Gebruikersinformatie**: Naam, email, voltooiingsdatum
- **Sector & Grootte**: Met badges
- **Belangrijke Features**: Alle features met badges
- **Specifieke Behoeften**: Volledige tekst
- **Verwachtingen**: Volledige tekst

## Data Synchronisatie

### Real-time Updates
```typescript
// Subscribe to database changes
const channel = supabase
  .channel('onboarding-responses-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'onboarding_responses',
  }, (payload) => {
    // Invalidate queries for real-time updates
    queryClient.invalidateQueries({ queryKey: ['onboardingResponses'] });
    queryClient.invalidateQueries({ queryKey: ['onboardingStats'] });
  })
  .subscribe();
```

### Manual Sync
```typescript
const { syncOnboardingData } = useOnboardingSync();

// Manual sync function
const handleRefresh = async () => {
  await syncOnboardingData();
  await refetchResponses();
};
```

## Export Functionaliteit

### CSV Export
- **Format**: CSV met headers
- **Data**: Alle gefilterde resultaten
- **Fields**: Email, naam, sector, bedrijfsgrootte, features, behoeften, verwachtingen, datum
- **Filename**: `onboarding-responses-YYYY-MM-DD.csv`

### Export Code
```typescript
const exportToCSV = () => {
  const csvContent = [
    ['Email', 'Naam', 'Sector', 'Bedrijfsgrootte', 'Belangrijke Features', 'Specifieke Behoeften', 'Verwachtingen', 'Voltooid Op'],
    ...filteredResponses.map(response => [
      response.user_email || '',
      response.user_name || '',
      response.sector,
      response.business_size,
      response.important_features.join(', '),
      response.specific_needs || '',
      response.expectations || '',
      new Date(response.completed_at).toLocaleDateString('nl-NL')
    ])
  ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `onboarding-responses-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};
```

## Testing

### Database Test
```bash
node scripts/test-admin-onboarding.js
```

### Manual Testing
1. Start applicatie: `npm run dev`
2. Login als admin user
3. Navigeer naar `/admin`
4. Klik op "Onboarding Tracking" tab
5. Verificeer dat onboarding responses worden getoond
6. Test filtering en zoekfunctionaliteit
7. Test CSV export functionaliteit
8. Test details modal

## Security

### Row Level Security (RLS)
```sql
-- Admins can view all onboarding responses
CREATE POLICY "Admins can view all onboarding responses" ON public.onboarding_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Users can view own onboarding response
CREATE POLICY "Users can view own onboarding response" ON public.onboarding_responses
    FOR SELECT USING (auth.uid() = user_id);
```

### Access Control
- **Admin Only**: Alleen users met `is_owner = true`
- **Protected Routes**: Admin routes zijn beschermd
- **Data Privacy**: Users kunnen alleen eigen data zien

## Performance

### Optimizations
- **Indexes**: Voor snelle queries op veelgebruikte velden
- **Pagination**: Voor grote datasets (toekomstige uitbreiding)
- **Caching**: React Query voor data caching
- **Real-time**: Efficiënte subscriptions

### Query Optimization
```sql
-- Optimized query with joins
SELECT 
  or.*,
  p.email,
  p.first_name,
  p.last_name
FROM onboarding_responses or
JOIN profiles p ON or.profile_id = p.id
ORDER BY or.completed_at DESC;
```

## Toekomstige Uitbreidingen

- **Advanced Analytics**: Charts en graphs
- **Segmentation**: User segmentation based on responses
- **Automated Insights**: AI-powered insights
- **Email Campaigns**: Targeted campaigns based on responses
- **A/B Testing**: Different onboarding flows
- **Integration**: CRM/Email marketing integration

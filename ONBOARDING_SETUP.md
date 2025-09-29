# Onboarding Flow Setup

Deze documentatie beschrijft de onboarding flow die is geïmplementeerd voor nieuwe gebruikers van StockFlow.

## Overzicht

De onboarding flow wordt automatisch getriggerd voor:
- Nieuwe gebruikers na registratie
- Bestaande gebruikers die de onboarding nog niet hebben voltooid
- Gebruikers na het aanmaken van hun eerste branch

## Database Schema

### Nieuwe kolommen in `profiles` tabel:
- `onboarding_completed` (BOOLEAN, DEFAULT FALSE): Geeft aan of de gebruiker de onboarding heeft voltooid
- `onboarding_data` (JSONB, DEFAULT NULL): Slaat de onboarding antwoorden op

### Database Migrations:
- `20250811000000_add_onboarding_field.sql`: Voegt `onboarding_completed` kolom toe
- `20250132000000_add_onboarding_data_column.sql`: Voegt `onboarding_data` kolom toe

## Componenten

### OnboardingModal.tsx
Het hoofdcomponent voor de onboarding flow met 4 stappen:

1. **Sector selectie**: Gebruiker kiest hun bedrijfssector
2. **Bedrijfsgrootte**: Gebruiker selecteert de grootte van hun bedrijf
3. **Feature voorkeuren**: Gebruiker selecteert belangrijke features
4. **Specifieke behoeften**: Open vragen over uitdagingen en verwachtingen

### Trigger Logica
De onboarding wordt getriggerd in `App.tsx` in de `ProtectedRoute` component:
```typescript
if (userProfile && !userProfile.onboarding_completed) {
  return (
    <>
      <OnboardingModal isOpen={true} onClose={() => setShowOnboarding(false)} />
      {children}
    </>
  );
}
```

## Features

### Sector Opties:
- Retail / Detailhandel
- Groothandel
- Productie / Manufacturing
- E-commerce
- Logistiek / Transport
- Voedselindustrie
- Farmaceutisch
- Anders

### Bedrijfsgrootte:
- Micro (1-5 werknemers)
- Klein (6-50 werknemers)
- Middelgroot (51-250 werknemers)
- Groot (250+ werknemers)

### Feature Opties:
- Voorraadbeheer
- Barcode Scanning
- Analytics & Rapporten
- Multi-locatie
- API Integratie
- Gebruikersbeheer
- Mobiele App
- Automatisering

## Testen

### 1. Database Test
```bash
node scripts/test-onboarding.js
```

### 2. Reset voor Testing
```sql
-- Voer dit uit in je database om alle gebruikers terug te zetten
\i scripts/reset-onboarding-for-testing.sql
```

### 3. Manual Testing
1. Start de applicatie: `npm run dev`
2. Login met een gebruiker die `onboarding_completed = false` heeft
3. De onboarding modal zou automatisch moeten verschijnen
4. Voltooi de onboarding flow
5. Controleer dat `onboarding_completed = true` is in de database

## Data Structuur

De `onboarding_data` kolom slaat de volgende informatie op:
```json
{
  "sector": "retail",
  "businessSize": "small",
  "importantFeatures": ["inventory_tracking", "barcode_scanning"],
  "specificNeeds": "Better inventory tracking for our retail store",
  "expectations": "Automated stock management and reporting",
  "completedAt": "2025-01-31T10:30:00.000Z"
}
```

## Implementatie Details

### State Management
- Gebruikt React useState voor form state
- 4-stappen wizard met validatie
- Progress indicator
- Responsive design voor mobile en desktop

### Database Updates
- Automatische update van `onboarding_completed` naar `true`
- Opslaan van alle onboarding antwoorden in `onboarding_data`
- Page refresh na voltooiing om auth state te updaten

### Error Handling
- Try-catch voor database operaties
- Toast notifications voor success/error states
- Loading states tijdens database updates

## Toekomstige Uitbreidingen

- A/B testing voor verschillende onboarding flows
- Personalisatie gebaseerd op sector en bedrijfsgrootte
- Analytics tracking voor onboarding completion rates
- Email follow-up voor incomplete onboardings

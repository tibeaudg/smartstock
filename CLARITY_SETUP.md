# Microsoft Clarity Setup Guide

Microsoft Clarity is nu geïntegreerd in StockFlow! Deze gids legt uit hoe je Clarity configureert en gebruikt.

## 📋 Overzicht

Microsoft Clarity is een gratis behavioral analytics tool die je helpt om gebruikersgedrag op je website te begrijpen met:
- **Session Replays**: Bekijk hoe gebruikers door je site navigeren
- **Heatmaps**: Zie waar gebruikers klikken en scrollen
- **Insights**: Automatische inzichten over gebruikersgedrag
- **Clarity Copilot**: AI-gestuurde aanbevelingen

## 🚀 Setup Instructies

### Stap 1: Maak een Clarity Project aan

1. Ga naar [Microsoft Clarity](https://clarity.microsoft.com/)
2. Log in met je Microsoft account (of maak er een aan)
3. Klik op "Add new project"
4. Vul de projectdetails in:
   - **Project name**: StockFlow
   - **Website URL**: https://www.stockflow.be (of je domein)
5. Nadat het project is aangemaakt, ga naar **Settings > Overview**
6. Kopieer je **Project ID** (een string van letters en cijfers)

### Stap 2: Configureer de Environment Variabele

Voeg de volgende environment variabele toe aan je project:

```bash
# Voor lokale ontwikkeling (.env.local)
VITE_CLARITY_PROJECT_ID=your_project_id_here

# Voor productie (Vercel, Netlify, etc.)
# Voeg deze variabele toe in je hosting platform dashboard
```

**Belangrijk**: Vervang `your_project_id_here` met je daadwerkelijke Clarity Project ID.

### Stap 3: Herstart de Development Server

```bash
npm run dev
```

## ✅ Verificatie

Na het configureren van Clarity:

1. Open je website in de browser
2. Controleer de browser console - je zou moeten zien:
   ```
   [Clarity] Initialized successfully
   ```
3. Ga naar je Clarity dashboard - binnen een paar minuten zou je je eerste sessies moeten zien

## 🎯 Gebruik

### Automatische Tracking

De Clarity integratie tracked automatisch:

- **Page Views**: Elke pagina die een gebruiker bezoekt
- **User Identification**: Ingelogde gebruikers worden geïdentificeerd met hun user ID
- **User Tags**: Automatische tags voor rol, subscription tier, en account status
- **Session Replays**: Alle gebruikersinteracties worden opgenomen

### Custom Events Tracken

Je kunt custom events tracken met de `useClarity` hook:

```typescript
import { useClarity } from '@/hooks/useClarity';

function MyComponent() {
  const { trackEvent, setTag, upgradeSession } = useClarity();

  const handleImportantAction = () => {
    // Track een custom event
    trackEvent('important_action_completed');
    
    // Upgrade de session prioriteit (voor belangrijke acties)
    upgradeSession('user_completed_checkout');
    
    // Set een custom tag
    setTag('feature_used', 'advanced_analytics');
  };

  return <button onClick={handleImportantAction}>Actie</button>;
}
```

### Direct API Gebruik

Je kunt ook de Clarity service direct gebruiken:

```typescript
import { trackEvent, setTag, upgradeSession } from '@/services/clarityService';

// Track een event
trackEvent('subscription_upgraded');

// Set een tag
setTag('payment_method', 'credit_card');

// Upgrade session prioriteit
upgradeSession('high_value_transaction');
```

## 🔐 Privacy & Cookie Consent

Als je project cookie consent vereist, gebruik dan:

```typescript
import { setCookieConsent } from '@/services/clarityService';

// Na het krijgen van consent
setCookieConsent(true);

// Als de gebruiker consent intrekt
setCookieConsent(false);
```

## 🛠️ Beschikbare Functies

### In de Service (`clarityService.ts`)

- `initClarity()`: Initialiseer Clarity (wordt automatisch aangeroepen)
- `identifyUser(customId, sessionId?, pageId?, friendlyName?)`: Identificeer een gebruiker
- `setTag(key, value)`: Set een custom tag
- `trackEvent(eventName)`: Track een custom event
- `setCookieConsent(hasConsent)`: Configureer cookie consent
- `upgradeSession(reason)`: Upgrade session prioriteit

### In de Hook (`useClarity`)

De `useClarity` hook retourneert dezelfde functies en tracked automatisch:
- Gebruiker identificatie bij login
- Page views bij route wijzigingen
- User tags (rol, subscription, status)

## 🎨 Best Practices

### 1. Session Prioriteit Upgraden

Upgrade sessies voor belangrijke gebruikersacties:

```typescript
upgradeSession('checkout_completed');
upgradeSession('first_time_login');
upgradeSession('error_encountered');
```

### 2. Meaningful Tags Gebruiken

Gebruik tags om sessies te categoriseren:

```typescript
setTag('user_segment', 'enterprise');
setTag('feature_flag', 'new_dashboard_enabled');
setTag('experiment_group', 'variant_a');
```

### 3. Custom Events voor Conversies

Track belangrijke business events:

```typescript
trackEvent('subscription_started');
trackEvent('trial_converted');
trackEvent('feature_discovered');
```

## 🚫 Tracking Uitschakelen

Clarity tracking is automatisch uitgeschakeld in:
- Development environment (`NODE_ENV=development`)
- Test environment (`NODE_ENV=test`)
- Localhost URLs

Dit wordt gecontroleerd door de `shouldDisableTracking()` functie in `config/tracking.ts`.

## 📊 Dashboard Features

In je Clarity dashboard kun je:

1. **Recordings** bekijken - Zie hoe gebruikers je app gebruiken
2. **Heatmaps** analyseren - Begrijp waar gebruikers klikken
3. **Filters** gebruiken - Filter op tags, events, of user properties
4. **Insights** bekijken - Automatische inzichten over gebruikersgedrag
5. **Copilot** raadplegen - AI-gestuurde aanbevelingen

## 🔍 Troubleshooting

### Clarity werkt niet

1. **Check de console**: Kijk of er errors zijn
2. **Verify project ID**: Controleer of `VITE_CLARITY_PROJECT_ID` correct is
3. **Check environment**: Clarity is disabled in development/test
4. **Restart server**: Herstart je dev server na het toevoegen van env vars

### Gebruikers worden niet geïdentificeerd

1. Controleer of de gebruiker is ingelogd
2. Check de console voor `[Clarity] User identified` logs
3. Verify dat `user.id` beschikbaar is

### Events worden niet getrackt

1. Check of tracking is enabled voor je environment
2. Verify dat het project ID correct is geconfigureerd
3. Wacht een paar minuten - data kan vertraagd zijn

## 📚 Resources

- [Microsoft Clarity Website](https://clarity.microsoft.com/)
- [Clarity Documentation](https://docs.microsoft.com/en-us/clarity/)
- [NPM Package](https://www.npmjs.com/package/@microsoft/clarity)
- [Privacy & GDPR](https://docs.microsoft.com/en-us/clarity/setup-and-installation/privacy)

## 🆘 Support

Voor vragen over de Clarity integratie:
1. Check deze documentatie
2. Bekijk de console logs
3. Raadpleeg de Microsoft Clarity docs
4. Neem contact op met het development team

---

**Gemaakt voor StockFlow** • Laatste update: September 2025

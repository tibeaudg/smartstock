# Website Tracking Setup

## IP-adres Uitsluiting Configureren

Om je eigen operaties uit te sluiten van de website analytics, volg deze stappen:

### 1. Je IP-adres vinden

**Optie A: Via website**
- Ga naar https://whatismyipaddress.com/
- Kopieer je publieke IP-adres

**Optie B: Via terminal/command prompt**
```bash
# Windows
curl ifconfig.me

# Mac/Linux
curl ifconfig.me
```

### 2. IP-adres toevoegen aan configuratie

Open het bestand `src/config/tracking.ts` en voeg je IP-adres toe:

```typescript
export const TRACKING_CONFIG = {
  // ... andere instellingen ...
  
  // Admin IP addresses to exclude (add your IPs here)
  adminIPs: [
    '192.168.1.100', // Vervang door je eigen IP
    '203.0.113.1',   // Voeg extra IP's toe indien nodig
    // '10.0.0.50',   // VPN IP (uncomment indien nodig)
  ],
  
  // ... rest van configuratie ...
};
```

### 3. Meerdere IP-adressen toevoegen

Voeg alle relevante IP-adressen toe:
- **Thuis IP**: Je thuis internetverbinding
- **Kantoor IP**: Je werkplek internetverbinding  
- **VPN IP**: Als je een VPN gebruikt
- **Mobiel IP**: Je mobiele data IP (kan variëren)

### 4. Automatische IP-detectie

Het systeem detecteert automatisch je IP-adres via de `getUserIP()` functie. Dit gebeurt:
- Bij elke tracking event
- Asynchroon (blokkeert de UI niet)
- Met fallback (als IP-detectie faalt, wordt tracking gewoon uitgevoerd)

### 5. Localhost Uitsluiting

Localhost wordt automatisch uitgesloten:
- `localhost`
- `127.0.0.1`
- `0.0.0.0`
- `::1`
- Elke hostname die "localhost" bevat

### 6. Development Mode

In development mode (`NODE_ENV=development`) wordt tracking automatisch uitgeschakeld.

## Database Cleanup

### Bestaande localhost data verwijderen

De migratie `20250127000001_cleanup_localhost_events.sql` verwijdert automatisch:
- Alle bestaande localhost events
- Voegt een trigger toe om toekomstige localhost events te blokkeren
- Creëert "clean" analytics functies

### Database functies

Nieuwe "clean" functies zijn beschikbaar:
- `get_clean_website_analytics()` - Dagelijkse stats zonder localhost
- `get_clean_page_analytics()` - Pagina stats zonder localhost  
- `get_clean_click_analytics()` - Klik stats zonder localhost

## Verificatie

### Test of tracking werkt

1. **In development**: Tracking moet uitgeschakeld zijn
2. **Op localhost**: Tracking moet uitgeschakeld zijn
3. **Op productie**: Tracking moet werken voor echte bezoekers
4. **Met je IP**: Tracking moet uitgeschakeld zijn voor jou

### Controleer in admin dashboard

Ga naar `/admin` → "Website Analytics" tab:
- Je zou geen localhost URLs moeten zien
- Je eigen bezoeken zouden niet getrackt moeten worden
- Alleen echte bezoekers data zou zichtbaar moeten zijn

## Troubleshooting

### Tracking werkt niet
- Controleer of `NODE_ENV` niet op 'development' staat
- Controleer of hostname niet localhost bevat
- Controleer browser console voor errors

### Mijn IP wordt nog steeds getrackt
- Controleer of je IP correct is toegevoegd aan `adminIPs` array
- Controleer of IP-detectie werkt (kijk in browser console)
- Voeg je IP handmatig toe als automatische detectie faalt

### Localhost data verschijnt nog steeds
- Run de database migratie: `supabase db reset` of `supabase migration up`
- Controleer of de trigger correct is geïnstalleerd
- Verwijder handmatig: `DELETE FROM website_events WHERE page_url LIKE '%localhost%';`

## Geavanceerde Configuratie

### User Agent Uitsluiting

Voeg specifieke user agents toe om uit te sluiten:

```typescript
adminUserAgents: [
  'Mozilla/5.0 (compatible; AdminBot/1.0)',
  'MyCustomAdminTool/1.0',
],
```

### Specifieke Features Uitschakelen

```typescript
features: {
  pageViews: true,
  clicks: true,
  scrollDepth: false,  // Schakel scroll tracking uit
  formAbandonment: true,
  timeOnPage: true,
  pageExit: true,
}
```

## Privacy & GDPR

- Alle tracking gebeurt anoniem
- Geen persoonlijke data wordt opgeslagen
- IP-adressen worden niet permanent opgeslagen
- Gebruikers kunnen tracking uitschakelen via browser instellingen

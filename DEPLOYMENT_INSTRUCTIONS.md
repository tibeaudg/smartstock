# Edge Function Deployment Instructies

## Probleem
De `create-checkout-session` Edge Function geeft een 500 error omdat Stripe de parameter `product_data[description]` niet meer ondersteunt in API versie 2023-10-16.

## Oplossing
De code is aangepast om:
1. Eerst een Stripe product aan te maken (zonder description in product_data)
2. Dan een price aan te maken voor dat product
3. De description wordt opgeslagen in de metadata van het product

## Deployment
Om de gefixte Edge Function te deployen, voer het volgende commando uit:

```bash
supabase functions deploy create-checkout-session
```

Of als je npx gebruikt:
```bash
npx supabase functions deploy create-checkout-session
```

## Verificatie
Na deployment kun je de payment flow testen. De fout "Received unknown parameter: product_data[description]" zou niet meer moeten optreden.

## Belangrijke wijzigingen
- `product_data.description` verwijderd
- Product wordt eerst aangemaakt met `stripe.products.create()`
- Price wordt aangemaakt met `stripe.prices.create()` en verwijst naar het product
- Description wordt opgeslagen in product metadata
- Verbeterde error handling voor betere debugging

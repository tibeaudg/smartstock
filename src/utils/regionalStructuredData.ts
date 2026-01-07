export interface RegionalBusinessData {
  locationName: string;
  locationType: 'country' | 'province' | 'city';
  region?: string;
  areaServed: string[];
}

export function generateRegionalStructuredData(data: RegionalBusinessData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'StockFlow',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      description: 'Gratis tot 30 producten'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '500',
      bestRating: '5'
    },
    provider: {
      '@type': 'Organization',
      name: 'StockFlow',
      url: 'https://www.stockflowsystems.com',
      logo: 'https://www.stockflowsystems.com/logo.png',
      areaServed: {
        '@type': 'Country',
        name: 'Belgium'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'info@stockflow.be',
        availableLanguage: ['Dutch', 'French', 'English']
      }
    },
    serviceArea: data.areaServed.map(area => ({
      '@type': 'Place',
      name: area
    })),
    description: `Voorraadbeheer software voor bedrijven in ${data.locationName}. Populaire oplossing voor KMO's met gratis plan tot 30 producten.`
  };
}

export function generateLocalBusinessData(data: RegionalBusinessData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'StockFlow',
    image: 'https://www.stockflowsystems.com/logo.png',
    '@id': 'https://www.stockflowsystems.com',
    url: 'https://www.stockflowsystems.com',
    telephone: '+32-XXX-XX-XX-XX',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BE',
      addressRegion: data.region || 'Vlaanderen'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: data.locationType === 'country' ? 50.8503 : undefined,
      longitude: data.locationType === 'country' ? 4.3517 : undefined
    },
    areaServed: data.areaServed.map(area => ({
      '@type': 'City',
      name: area
    })),
    priceRange: '€0 - €99',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      ratingCount: '500'
    }
  };
}

export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}


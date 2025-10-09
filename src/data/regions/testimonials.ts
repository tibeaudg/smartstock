export interface RegionalTestimonial {
  id: string;
  name: string;
  business: string;
  location: string; // city slug
  province: string; // province slug
  industry: string;
  quote: string;
  avatar?: string;
  rating: number;
}

export const regionalTestimonials: RegionalTestimonial[] = [
  // Oost-Vlaanderen
  {
    id: 'gent-1',
    name: 'Jan Janssens',
    business: 'Gents Koffiehuis',
    location: 'gent',
    province: 'oost-vlaanderen',
    industry: 'Horeca',
    quote: 'Als horecazaak in het drukke Gentse centrum hebben we real-time voorraadbeheer nodig. StockFlow helpt ons om nooit zonder koffie of gebak te zitten.',
    rating: 5
  },
  {
    id: 'gent-2',
    name: 'Laura Vermeulen',
    business: 'Mode Boutique Laura',
    location: 'gent',
    province: 'oost-vlaanderen',
    industry: 'Retail',
    quote: 'Onze boutique in de Veldstraat draait nu soepeler. We weten altijd welke maten en kleuren op voorraad zijn, en klanten zijn tevreden.',
    rating: 5
  },
  {
    id: 'aalst-1',
    name: 'Pieter De Smet',
    business: 'Bouwmaterialen De Smet',
    location: 'aalst',
    province: 'oost-vlaanderen',
    industry: 'Bouw',
    quote: 'Met meerdere projecten in Aalst en omgeving is het cruciaal om onze bouwmaterialen goed te beheren. StockFlow maakt het simpel.',
    rating: 5
  },
  {
    id: 'sint-niklaas-1',
    name: 'Anke Peeters',
    business: 'Bloemen Anke',
    location: 'sint-niklaas',
    province: 'oost-vlaanderen',
    industry: 'Retail',
    quote: 'Verse bloemen vragen nauwkeurig voorraadbeheer. Met StockFlow kunnen we snel werken en weten we altijd wat er op voorraad is.',
    rating: 5
  },

  // West-Vlaanderen
  {
    id: 'brugge-1',
    name: 'Thomas Maes',
    business: 'Brugse Chocolaterie',
    location: 'brugge',
    province: 'west-vlaanderen',
    industry: 'Horeca',
    quote: 'Ons chocoladeatelier in Brugge ontvangt dagelijks toeristen. Dankzij StockFlow weten we exact hoeveel pralines we nog hebben en wanneer we moeten produceren.',
    rating: 5
  },
  {
    id: 'brugge-2',
    name: 'Sophie Claeys',
    business: 'Kant & Linnen Sophie',
    location: 'brugge',
    province: 'west-vlaanderen',
    industry: 'Retail',
    quote: 'Onze winkel verkoopt authentieke Brugse kant. Met StockFlow beheren we onze unieke collectie perfect en kunnen we klanten snel helpen.',
    rating: 5
  },
  {
    id: 'kortrijk-1',
    name: 'Michaël Vandewalle',
    business: 'Tech Solutions Kortrijk',
    location: 'kortrijk',
    province: 'west-vlaanderen',
    industry: 'Technologie',
    quote: 'Als IT-bedrijf in Kortrijk hebben we honderden componenten en devices. StockFlow geeft ons het overzicht dat we nodig hebben.',
    rating: 5
  },
  {
    id: 'oostende-1',
    name: 'Kris Delrue',
    business: 'Visrestaurant De Zee',
    location: 'oostende',
    province: 'west-vlaanderen',
    industry: 'Horeca',
    quote: 'Verse vis vraagt dagelijks voorraadbeheer. StockFlow helpt ons onze voorraad perfect te timen met de aanvoer uit de haven.',
    rating: 5
  },

  // Antwerpen
  {
    id: 'antwerpen-1',
    name: 'Sarah Mertens',
    business: 'Fashion Store Zuid',
    location: 'antwerpen',
    province: 'antwerpen-provincie',
    industry: 'Mode',
    quote: 'In het modieuze Antwerpse Zuid draait alles om trendy voorraad. StockFlow helpt ons bij te blijven met de laatste trends en onze collectie te beheren.',
    rating: 5
  },
  {
    id: 'antwerpen-2',
    name: 'Ahmed Hassan',
    business: 'Diamant Trading AH',
    location: 'antwerpen',
    province: 'antwerpen-provincie',
    industry: 'Diamant',
    quote: 'In de diamantsector is nauwkeurige voorraadregistratie essentieel. StockFlow biedt de betrouwbaarheid die we nodig hebben.',
    rating: 5
  },
  {
    id: 'mechelen-1',
    name: 'Els Wouters',
    business: 'Biologische Bakkerij Mechelen',
    location: 'mechelen',
    province: 'antwerpen-provincie',
    industry: 'Horeca',
    quote: 'Onze biologische bakkerij groeit snel in Mechelen. StockFlow helpt ons ingrediënten te beheren en verspilling te voorkomen.',
    rating: 5
  },
  {
    id: 'turnhout-1',
    name: 'Marc Hermans',
    business: 'Drukkerij Hermans',
    location: 'turnhout',
    province: 'antwerpen-provincie',
    industry: 'Grafische industrie',
    quote: 'Met honderden papiersoorten en inktcartridges was voorraadbeheer een uitdaging. StockFlow bracht structuur in onze voorraad.',
    rating: 5
  },

  // Limburg
  {
    id: 'hasselt-1',
    name: 'Lisa Geens',
    business: 'Mode Lisa Hasselt',
    location: 'hasselt',
    province: 'limburg',
    industry: 'Mode',
    quote: 'Hasselt is modestad en onze klanten verwachten de nieuwste collecties. StockFlow helpt ons snel te schakelen en voorraad bij te houden.',
    rating: 5
  },
  {
    id: 'genk-1',
    name: 'David Smeets',
    business: 'Logistiek Centrum Genk',
    location: 'genk',
    province: 'limburg',
    industry: 'Logistiek',
    quote: 'Ons distributiecentrum in Genk verwerkt dagelijks duizenden producten. StockFlow geeft ons het real-time overzicht dat cruciaal is.',
    rating: 5
  },
  {
    id: 'sint-truiden-1',
    name: 'Karen Claes',
    business: 'Fruithandel Claes',
    location: 'sint-truiden',
    province: 'limburg',
    industry: 'Fruitteelt',
    quote: 'Met seizoensgebonden fruit is nauwkeurig voorraadbeheer essentieel. StockFlow helpt ons verse voorraad te beheren en verspilling te minimaliseren.',
    rating: 5
  },

  // Vlaams-Brabant
  {
    id: 'leuven-1',
    name: 'Tom Coppens',
    business: 'Tech Startup Lab',
    location: 'leuven',
    province: 'vlaams-brabant',
    industry: 'Technologie',
    quote: 'Als startup in Leuven hebben we een flexibel systeem nodig. StockFlow groeit mee met onze ambitieuze plannen.',
    rating: 5
  },
  {
    id: 'leuven-2',
    name: 'Marie Vandenberghe',
    business: 'Café De Oude Markt',
    location: 'leuven',
    province: 'vlaams-brabant',
    industry: 'Horeca',
    quote: 'Met de drukte van studenten op de Oude Markt is het belangrijk om altijd voldoende voorraad te hebben. StockFlow waarschuwt ons op tijd.',
    rating: 5
  },
  {
    id: 'vilvoorde-1',
    name: 'Youssef El Amrani',
    business: 'Distributie Center VL',
    location: 'vilvoorde',
    province: 'vlaams-brabant',
    industry: 'Logistiek',
    quote: 'Onze strategische ligging in Vilvoorde vraagt om professioneel voorraadbeheer. StockFlow levert exact wat we nodig hebben.',
    rating: 5
  }
];

// Get testimonials for a specific location
export function getTestimonialsByLocation(locationSlug: string): RegionalTestimonial[] {
  return regionalTestimonials.filter(t => t.location === locationSlug);
}

// Get testimonials for a province (includes all cities in that province)
export function getTestimonialsByProvince(provinceSlug: string): RegionalTestimonial[] {
  return regionalTestimonials.filter(t => t.province === provinceSlug);
}

// Get random testimonials from a location or province
export function getRandomTestimonials(locationSlug: string, count: number = 2): RegionalTestimonial[] {
  const locationTestimonials = getTestimonialsByLocation(locationSlug);
  
  if (locationTestimonials.length >= count) {
    return locationTestimonials.slice(0, count);
  }
  
  // If not enough location-specific testimonials, get from province
  const testimonial = regionalTestimonials.find(t => t.location === locationSlug);
  if (testimonial) {
    const provinceTestimonials = getTestimonialsByProvince(testimonial.province);
    const shuffled = [...provinceTestimonials].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  return [];
}


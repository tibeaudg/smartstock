export interface City {
  name: string;
  slug: string;
  province: string;
  population: number;
  keyIndustries: string[];
  businessProfile: string;
  neighborhoods?: string[];
  uniqueCharacteristics: string;
}

export interface Province {
  name: string;
  slug: string;
  capital: string;
  population: number;
  keyIndustries: string[];
  economicProfile: string;
  majorCities: string[];
  uniqueCharacteristics: string;
}

export interface Country {
  name: string;
  slug: string;
  description: string;
  totalBusinesses: number;
  kmoPercentage: number;
  keyIndustries: string[];
}

export const belgiumCountry: Country = {
  name: 'België',
  slug: 'belgie',
  description: 'België telt meer dan 1,5 miljoen ondernemingen, waarvan 99% KMO\'s zijn. Van retail in Antwerpen tot horeca in Brugge, van logistiek in Limburg tot technologie in Leuven - Belgische bedrijven hebben nood aan efficiënt voorraadbeheer.',
  totalBusinesses: 1500000,
  kmoPercentage: 99,
  keyIndustries: ['Retail', 'Horeca', 'Logistiek', 'E-commerce', 'Productie', 'Bouw']
};

export const provinces: Province[] = [
  {
    name: 'Oost-Vlaanderen',
    slug: 'oost-vlaanderen',
    capital: 'Gent',
    population: 1525255,
    keyIndustries: ['Textiel', 'Logistiek', 'Retail', 'Horeca', 'E-commerce'],
    economicProfile: 'Oost-Vlaanderen is een dynamische provincie met sterke retail, horeca en logistieke sector. De haven van Gent en de uitgebreide transportsector maken voorraadbeheer cruciaal.',
    majorCities: ['Gent', 'Aalst', 'Sint-Niklaas', 'Dendermonde', 'Oudenaarde'],
    uniqueCharacteristics: 'Sterke textielindustrie en logistieke hub met toegang tot internationale markten'
  },
  {
    name: 'West-Vlaanderen',
    slug: 'west-vlaanderen',
    capital: 'Brugge',
    population: 1195796,
    keyIndustries: ['Toerisme', 'Horeca', 'Retail', 'Voedingsindustrie', 'Productie'],
    economicProfile: 'West-Vlaanderen combineert toerisme met sterke productiesector. Kusttoerisme, horeca in steden als Brugge en Kortrijk, en voedingsproductie domineren.',
    majorCities: ['Brugge', 'Kortrijk', 'Oostende', 'Roeselare', 'Ieper'],
    uniqueCharacteristics: 'Kusttoerisme en sterke horecasector met uitgebreide retail en productie inland'
  },
  {
    name: 'Antwerpen',
    slug: 'antwerpen-provincie',
    capital: 'Antwerpen',
    population: 1857986,
    keyIndustries: ['Havenlogistiek', 'Diamant', 'Retail', 'E-commerce', 'Mode'],
    economicProfile: 'De provincie Antwerpen, met de grootste haven van Europa, is economisch centrum voor logistiek, diamanthandel en internationale trade. Sterke retail en e-commerce sector.',
    majorCities: ['Antwerpen', 'Mechelen', 'Turnhout', 'Mol', 'Lier'],
    uniqueCharacteristics: 'Europese havenstad en diamantcentrum met internationale handel en logistiek'
  },
  {
    name: 'Limburg',
    slug: 'limburg',
    capital: 'Hasselt',
    population: 877370,
    keyIndustries: ['Logistiek', 'Retail', 'Productie', 'Bouw', 'Fruitteelt'],
    economicProfile: 'Limburg kent sterke logistieke sector dankzij centrale ligging. Fruitteelt, retail en productie zijn belangrijke pijlers met groeiende e-commerce sector.',
    majorCities: ['Hasselt', 'Genk', 'Tongeren', 'Sint-Truiden', 'Beringen'],
    uniqueCharacteristics: 'Fruitteelt en logistieke hub in het hart van Europa'
  },
  {
    name: 'Vlaams-Brabant',
    slug: 'vlaams-brabant',
    capital: 'Leuven',
    population: 1146175,
    keyIndustries: ['Technologie', 'Farma', 'Logistiek', 'Retail', 'Horeca'],
    economicProfile: 'Vlaams-Brabant, met universitaire stad Leuven, combineert technologie en farma met sterke logistieke sector rondom Brussel. Groeiende e-commerce en retail.',
    majorCities: ['Leuven', 'Vilvoorde', 'Tienen', 'Aarschot', 'Halle'],
    uniqueCharacteristics: 'Technologie en kenniseconomie met sterke connectie naar Brussel'
  }
];

export const cities: City[] = [
  // Oost-Vlaanderen
  {
    name: 'Gent',
    slug: 'gent',
    province: 'Oost-Vlaanderen',
    population: 262219,
    keyIndustries: ['Logistiek', 'Retail', 'Horeca', 'Technologie', 'Haven'],
    businessProfile: 'Gent is economisch hart van Oost-Vlaanderen met sterke retail in het centrum, uitgebreide horeca sector en belangrijke haven. Veel KMO\'s in logistiek en e-commerce.',
    neighborhoods: ['Centrum', 'Dampoort', 'Rabot', 'Ledeberg', 'Gentbrugge'],
    uniqueCharacteristics: 'Studentenstad met levendige retail, horeca en groeiende tech sector'
  },
  {
    name: 'Aalst',
    slug: 'aalst',
    province: 'Oost-Vlaanderen',
    population: 88000,
    keyIndustries: ['Retail', 'Productie', 'Logistiek', 'Bouw'],
    businessProfile: 'Aalst kent sterke retail sector en groeiende logistieke bedrijven. Centrale ligging maakt het aantrekkelijk voor distributie en groothandel.',
    neighborhoods: ['Centrum', 'Hofstade', 'Erembodegem', 'Nieuwerkerken'],
    uniqueCharacteristics: 'Handelsstad met sterke retailtraditie en groeiende logistiek'
  },
  {
    name: 'Sint-Niklaas',
    slug: 'sint-niklaas',
    province: 'Oost-Vlaanderen',
    population: 78000,
    keyIndustries: ['Retail', 'Logistiek', 'E-commerce', 'Groothandel'],
    businessProfile: 'Sint-Niklaas is belangrijke retailstad met grootste marktplein van België. Groeiende logistiek en e-commerce sector.',
    neighborhoods: ['Centrum', 'Nieuwkerken-Waas', 'Sinaai', 'Belsele'],
    uniqueCharacteristics: 'Grootste marktplein van België met sterke retailfocus'
  },
  {
    name: 'Dendermonde',
    slug: 'dendermonde',
    province: 'Oost-Vlaanderen',
    population: 46000,
    keyIndustries: ['Retail', 'Horeca', 'Voedingsindustrie', 'Bouw'],
    businessProfile: 'Dendermonde combineert historische handel met moderne retail. Voedingsindustrie en horeca zijn belangrijke werkgevers.',
    uniqueCharacteristics: 'Handelsstad aan kruispunt van Dender en Schelde'
  },
  {
    name: 'Wetteren',
    slug: 'wetteren',
    province: 'Oost-Vlaanderen',
    population: 26000,
    keyIndustries: ['Retail', 'Bouw', 'Diensten', 'Productie'],
    businessProfile: 'Wetteren kent diverse KMO-sector met retail, bouw en kleine productie. Nabijheid Gent zorgt voor groei.',
    uniqueCharacteristics: 'Groeiende voorstad van Gent met actieve KMO-sector'
  },
  {
    name: 'Lochristi',
    slug: 'lochristi',
    province: 'Oost-Vlaanderen',
    population: 22000,
    keyIndustries: ['Tuinbouw', 'Retail', 'Logistiek', 'Diensten'],
    businessProfile: 'Lochristi staat bekend om tuinbouw en sierteelt. Groeiende retail en logistieke bedrijven door ligging nabij Gent.',
    uniqueCharacteristics: 'Tuinbouwcentrum met groeiende retail en logistiek'
  },
  {
    name: 'Eeklo',
    slug: 'eeklo',
    province: 'Oost-Vlaanderen',
    population: 20500,
    keyIndustries: ['Retail', 'Diensten', 'Bouw', 'Horeca'],
    businessProfile: 'Eeklo is regionaal centrum voor Meetjesland met sterke retail en dienstensector voor omliggende gemeenten.',
    uniqueCharacteristics: 'Centrum van Meetjesland met regionale retailfunctie'
  },
  {
    name: 'Oudenaarde',
    slug: 'oudenaarde',
    province: 'Oost-Vlaanderen',
    population: 31000,
    keyIndustries: ['Textiel', 'Retail', 'Toerisme', 'Horeca'],
    businessProfile: 'Oudenaarde combineert textieltraditie met toerisme en horeca. Wielrennen en Vlaamse Ardennen trekken bezoekers.',
    uniqueCharacteristics: 'Textielstad en wielertoerisme centrum'
  },
  {
    name: 'Geraardsbergen',
    slug: 'geraardsbergen',
    province: 'Oost-Vlaanderen',
    population: 33500,
    keyIndustries: ['Voedingsindustrie', 'Retail', 'Toerisme', 'Productie'],
    businessProfile: 'Geraardsbergen kent voedingsindustrie (Mattentaart) en groeiende toerisme. Retail bedient ruime regio.',
    uniqueCharacteristics: 'Voedingstraditie en toerisme in Vlaamse Ardennen'
  },
  {
    name: 'Ninove',
    slug: 'ninove',
    province: 'Oost-Vlaanderen',
    population: 39000,
    keyIndustries: ['Productie', 'Retail', 'Logistiek', 'Bouw'],
    businessProfile: 'Ninove heeft diverse productiesector en groeiende retail. Logistieke bedrijven profiteren van centrale ligging.',
    uniqueCharacteristics: 'Productiestad met groeiende logistiek'
  },
  {
    name: 'Zottegem',
    slug: 'zottegem',
    province: 'Oost-Vlaanderen',
    population: 26500,
    keyIndustries: ['Productie', 'Retail', 'Bouw', 'Diensten'],
    businessProfile: 'Zottegem combineert productie met retail en diensten. Sterke KMO-sector met diverse bedrijven.',
    uniqueCharacteristics: 'Diverse KMO-sector in hart van Vlaamse Ardennen'
  },
  {
    name: 'Hamme',
    slug: 'hamme',
    province: 'Oost-Vlaanderen',
    population: 25000,
    keyIndustries: ['Fruitteelt', 'Retail', 'Logistiek', 'Bouw'],
    businessProfile: 'Hamme kent fruitteelt en groeiende logistieke sector. Retail bedient lokale gemeenschap.',
    uniqueCharacteristics: 'Fruitteelt en groeiende logistiek aan Schelde'
  },

  // West-Vlaanderen
  {
    name: 'Brugge',
    slug: 'brugge',
    province: 'West-Vlaanderen',
    population: 118000,
    keyIndustries: ['Toerisme', 'Horeca', 'Retail', 'Cultuur'],
    businessProfile: 'Brugge is toeristisch centrum met uitgebreide horeca en retail. Werelderfgoed trekt miljoenen bezoekers met grote impact op lokale economie.',
    neighborhoods: ['Centrum', 'Sint-Andries', 'Sint-Michiels', 'Assebroek'],
    uniqueCharacteristics: 'UNESCO werelderfgoed met toptoerisme en horeca'
  },
  {
    name: 'Kortrijk',
    slug: 'kortrijk',
    province: 'West-Vlaanderen',
    population: 76000,
    keyIndustries: ['Retail', 'Technologie', 'Productie', 'Diensten'],
    businessProfile: 'Kortrijk is economisch centrum met sterke retail, technologie en diensten. Moderne handelsstad met internationale uitstraling.',
    neighborhoods: ['Centrum', 'Marke', 'Heule', 'Bellegem'],
    uniqueCharacteristics: 'Modern economisch centrum met sterke retail en tech'
  },
  {
    name: 'Oostende',
    slug: 'oostende',
    province: 'West-Vlaanderen',
    population: 71000,
    keyIndustries: ['Toerisme', 'Horeca', 'Visserij', 'Haven', 'Retail'],
    businessProfile: 'Oostende combineert badtoerisme met haven en visserij. Seizoensgebonden horeca en retail met sterke zomerpieken.',
    neighborhoods: ['Centrum', 'Mariakerke', 'Raversijde', 'Stene'],
    uniqueCharacteristics: 'Badstad en haven met seizoenstoerisme'
  },
  {
    name: 'Roeselare',
    slug: 'roeselare',
    province: 'West-Vlaanderen',
    population: 63000,
    keyIndustries: ['Retail', 'Productie', 'Voedingsindustrie', 'Logistiek'],
    businessProfile: 'Roeselare is regionaal retailcentrum met sterke voedingsindustrie en productie. Groeiende logistieke sector.',
    neighborhoods: ['Centrum', 'Rumbeke', 'Beveren'],
    uniqueCharacteristics: 'Retailcentrum met sterke voedingsindustrie'
  },
  {
    name: 'Ieper',
    slug: 'ieper',
    province: 'West-Vlaanderen',
    population: 35000,
    keyIndustries: ['Toerisme', 'Horeca', 'Retail', 'Landbouw'],
    businessProfile: 'Ieper leeft van WO I toerisme met uitgebreide horeca sector. Retail en landbouw vormen economische basis.',
    uniqueCharacteristics: 'WO I erfgoedtoerisme met sterke horecasector'
  },
  {
    name: 'Waregem',
    slug: 'waregem',
    province: 'West-Vlaanderen',
    population: 37000,
    keyIndustries: ['Textiel', 'Retail', 'Productie', 'Paardensport'],
    businessProfile: 'Waregem combineert textieltraditie met moderne retail. Koerse en paardensport brengen toerisme.',
    uniqueCharacteristics: 'Textiel en paardensport centrum'
  },
  {
    name: 'Knokke-Heist',
    slug: 'knokke-heist',
    province: 'West-Vlaanderen',
    population: 34000,
    keyIndustries: ['Toerisme', 'Horeca', 'Luxe retail', 'Kunst'],
    businessProfile: 'Knokke-Heist is exclusieve badplaats met luxe retail, horeca en kunst. Seizoensgebonden met welgesteld publiek.',
    uniqueCharacteristics: 'Exclusieve badplaats met luxe retail en kunst'
  },
  {
    name: 'Menen',
    slug: 'menen',
    province: 'West-Vlaanderen',
    population: 33000,
    keyIndustries: ['Retail', 'Productie', 'Grenshandel', 'Logistiek'],
    businessProfile: 'Menen profiteert van grensligging met Frankrijk. Retail, productie en logistiek profiteren van internationale positie.',
    uniqueCharacteristics: 'Grensstad met internationale handel'
  },
  {
    name: 'Izegem',
    slug: 'izegem',
    province: 'West-Vlaanderen',
    population: 27000,
    keyIndustries: ['Schoenenindustrie', 'Retail', 'Productie', 'Borstelmuseum'],
    businessProfile: 'Izegem staat bekend om schoenen- en borstelproductie. Retail en moderne productie groeien.',
    uniqueCharacteristics: 'Schoenen- en borstelindustrie centrum'
  },
  {
    name: 'Harelbeke',
    slug: 'harelbeke',
    province: 'West-Vlaanderen',
    population: 28000,
    keyIndustries: ['Textiel', 'Vloerbedekking', 'Retail', 'Productie'],
    businessProfile: 'Harelbeke is centrum voor vloerbedekking en textiel. Sterke productiebedrijven met internationale uitstraling.',
    uniqueCharacteristics: 'Vloerbedekkings- en textielcentrum'
  },
  {
    name: 'Poperinge',
    slug: 'poperinge',
    province: 'West-Vlaanderen',
    population: 20000,
    keyIndustries: ['Hopteelt', 'Toerisme', 'Horeca', 'Landbouw'],
    businessProfile: 'Poperinge is hopstad met sterke landbouw en toerisme. Horeca profiteert van WO I erfgoed.',
    uniqueCharacteristics: 'Hopstad met toerisme en landbouw'
  },
  {
    name: 'Tielt',
    slug: 'tielt',
    province: 'West-Vlaanderen',
    population: 20000,
    keyIndustries: ['Retail', 'Diensten', 'Landbouw', 'Bouw'],
    businessProfile: 'Tielt is regionaal centrum met retail en diensten voor omliggende gemeenten. Landbouw blijft belangrijk.',
    uniqueCharacteristics: 'Regionaal centrum met retail en diensten'
  },
  {
    name: 'Diksmuide',
    slug: 'diksmuide',
    province: 'West-Vlaanderen',
    population: 16500,
    keyIndustries: ['Toerisme', 'Horeca', 'Retail', 'Landbouw'],
    businessProfile: 'Diksmuide combineert WO I toerisme met landbouw. IJzertoren trekt bezoekers, retail bedient lokale markt.',
    uniqueCharacteristics: 'WO I erfgoed met IJzertoren en toerisme'
  },

  // Antwerpen
  {
    name: 'Antwerpen',
    slug: 'antwerpen',
    province: 'Antwerpen',
    population: 530000,
    keyIndustries: ['Havenlogistiek', 'Diamant', 'Mode', 'Retail', 'E-commerce'],
    businessProfile: 'Antwerpen is economisch hart van Vlaanderen. Grootste haven van Europa, wereldcentrum voor diamant, mode en sterke retail maken het tot hotspot voor voorraadbeheer.',
    neighborhoods: ['Centrum', 'Zuid', 'Linkeroever', 'Berchem', 'Deurne', 'Borgerhout'],
    uniqueCharacteristics: 'Havenstad, diamantcentrum en modestad met internationale handel'
  },
  {
    name: 'Mechelen',
    slug: 'mechelen',
    province: 'Antwerpen',
    population: 86000,
    keyIndustries: ['Retail', 'Logistiek', 'Technologie', 'Horeca'],
    businessProfile: 'Mechelen groeit als retailstad met sterke logistieke sector door centrale ligging. Technologie en horeca bloeien.',
    neighborhoods: ['Centrum', 'Nekkerspoel', 'Heffen', 'Muizen'],
    uniqueCharacteristics: 'Centrale ligging met groeiende retail en logistiek'
  },
  {
    name: 'Turnhout',
    slug: 'turnhout',
    province: 'Antwerpen',
    population: 45000,
    keyIndustries: ['Grafische industrie', 'Retail', 'Technologie', 'Productie'],
    businessProfile: 'Turnhout is centrum van Kempen met grafische industrie traditie. Moderne retail en tech sector groeien.',
    neighborhoods: ['Centrum', 'Parkhof', 'Zandberg', 'Herentals Kwartier'],
    uniqueCharacteristics: 'Grafische industrie en regionaal retailcentrum Kempen'
  },
  {
    name: 'Mol',
    slug: 'mol',
    province: 'Antwerpen',
    population: 37000,
    keyIndustries: ['Nucleaire technologie', 'Retail', 'Toerisme', 'Diensten'],
    businessProfile: 'Mol combineert nucleair onderzoek met toerisme (Postel) en retail. Groeiende dienstensector.',
    uniqueCharacteristics: 'Nucleair onderzoekscentrum met toerisme'
  },
  {
    name: 'Geel',
    slug: 'geel',
    province: 'Antwerpen',
    population: 40000,
    keyIndustries: ['Zorg', 'Retail', 'Diensten', 'Productie'],
    businessProfile: 'Geel kent unieke psychiatrische zorgsector. Retail en diensten bedienen Kempen regio.',
    uniqueCharacteristics: 'Zorgsector en regionaal centrum Kempen'
  },
  {
    name: 'Heist-op-den-Berg',
    slug: 'heist-op-den-berg',
    province: 'Antwerpen',
    population: 43000,
    keyIndustries: ['Retail', 'Logistiek', 'Bouw', 'Diensten'],
    businessProfile: 'Heist-op-den-Berg groeit met retail en logistiek door ligging tussen Antwerpen en Leuven.',
    uniqueCharacteristics: 'Groeiende voorstad met retail en logistiek'
  },
  {
    name: 'Lier',
    slug: 'lier',
    province: 'Antwerpen',
    population: 35500,
    keyIndustries: ['Retail', 'Horeca', 'Toerisme', 'Productie'],
    businessProfile: 'Lier combineert historisch centrum met moderne retail. Toerisme en horeca groeien, productie blijft belangrijk.',
    uniqueCharacteristics: 'Historische stad met groeiende retail en toerisme'
  },
  {
    name: 'Mortsel',
    slug: 'mortsel',
    province: 'Antwerpen',
    population: 25500,
    keyIndustries: ['Retail', 'Diensten', 'Technologie', 'Bouw'],
    businessProfile: 'Mortsel is voorstad van Antwerpen met sterke retail en groeiende dienstensector.',
    uniqueCharacteristics: 'Antwerpse voorstad met actieve retailsector'
  },
  {
    name: 'Boom',
    slug: 'boom',
    province: 'Antwerpen',
    population: 18000,
    keyIndustries: ['Evenementen', 'Horeca', 'Retail', 'Productie'],
    businessProfile: 'Boom leeft van Tomorrowland en andere evenementen. Horeca en retail profiteren, productie blijft aanwezig.',
    uniqueCharacteristics: 'Evenementenstad (Tomorrowland) met sterke horeca'
  },
  {
    name: 'Brasschaat',
    slug: 'brasschaat',
    province: 'Antwerpen',
    population: 38000,
    keyIndustries: ['Retail', 'Diensten', 'Militair', 'Bouw'],
    businessProfile: 'Brasschaat combineert militaire traditie met moderne retail en diensten. Welvarende voorstad van Antwerpen.',
    uniqueCharacteristics: 'Welvarende voorstad met retail en diensten'
  },
  {
    name: 'Duffel',
    slug: 'duffel',
    province: 'Antwerpen',
    population: 17500,
    keyIndustries: ['Productie', 'Retail', 'Logistiek', 'Bouw'],
    businessProfile: 'Duffel kent diverse productiesector met groeiende logistiek. Retail bedient lokale markt.',
    uniqueCharacteristics: 'Productie en logistiek aan Nete'
  },
  {
    name: 'Schoten',
    slug: 'schoten',
    province: 'Antwerpen',
    population: 34000,
    keyIndustries: ['Retail', 'Diensten', 'Bouw', 'Technologie'],
    businessProfile: 'Schoten is groeiende voorstad van Antwerpen met sterke retail en dienstensector.',
    uniqueCharacteristics: 'Groeiende Antwerpse voorstad met retail'
  },

  // Limburg
  {
    name: 'Hasselt',
    slug: 'hasselt',
    province: 'Limburg',
    population: 78000,
    keyIndustries: ['Retail', 'Mode', 'Logistiek', 'Diensten'],
    businessProfile: 'Hasselt is modestad en retailcentrum van Limburg. Sterke logistieke sector en groeiende e-commerce bedrijven.',
    neighborhoods: ['Centrum', 'Kiewit', 'Spalbeek', 'Kuringen'],
    uniqueCharacteristics: 'Modestad en shoppingcentrum met sterke retail'
  },
  {
    name: 'Genk',
    slug: 'genk',
    province: 'Limburg',
    population: 66000,
    keyIndustries: ['Logistiek', 'Retail', 'Productie', 'E-commerce'],
    businessProfile: 'Genk transformeerde van mijnstad naar logistiek centrum. Sterke retail en groeiende e-commerce met Thor Park innovatie.',
    neighborhoods: ['Centrum', 'Waterschei', 'Zwartberg', 'Winterslag'],
    uniqueCharacteristics: 'Van mijnstad naar logistiek en innovatiecentrum'
  },
  {
    name: 'Tongeren',
    slug: 'tongeren',
    province: 'Limburg',
    population: 31000,
    keyIndustries: ['Antiek', 'Toerisme', 'Retail', 'Horeca'],
    businessProfile: 'Tongeren is oudste stad van België met beroemde antiekmarkt. Toerisme, horeca en retail drijven economie.',
    uniqueCharacteristics: 'Oudste stad met antiekmarkt en toerisme'
  },
  {
    name: 'Sint-Truiden',
    slug: 'sint-truiden',
    province: 'Limburg',
    population: 41000,
    keyIndustries: ['Fruitteelt', 'Voedingsindustrie', 'Retail', 'Logistiek'],
    businessProfile: 'Sint-Truiden is fruitcentrum met sterke voedingsindustrie. Retail en logistiek bedienen Haspengouw.',
    uniqueCharacteristics: 'Fruitstreek met voedingsindustrie en retail'
  },
  {
    name: 'Beringen',
    slug: 'beringen',
    province: 'Limburg',
    population: 46000,
    keyIndustries: ['Retail', 'Logistiek', 'Recreatie', 'Diensten'],
    businessProfile: 'Beringen transformeerde van mijnstad naar retail en recreatie centrum. Be-Mine site trekt bezoekers.',
    uniqueCharacteristics: 'Van mijnstad naar recreatie en retail'
  },
  {
    name: 'Bilzen',
    slug: 'bilzen',
    province: 'Limburg',
    population: 32000,
    keyIndustries: ['Fruitteelt', 'Retail', 'Toerisme', 'Wijnbouw'],
    businessProfile: 'Bilzen combineert fruitteelt met groeiende wijnbouw en toerisme. Retail bedient lokale en toeristische markt.',
    uniqueCharacteristics: 'Fruitteelt en opkomende wijnbouw'
  },
  {
    name: 'Lommel',
    slug: 'lommel',
    province: 'Limburg',
    population: 35000,
    keyIndustries: ['Productie', 'Retail', 'Logistiek', 'Toerisme'],
    businessProfile: 'Lommel combineert productie met natuurtoerisme. Retail en logistiek groeien door centrale ligging.',
    uniqueCharacteristics: 'Productie en natuurtoerisme in de Kempen'
  },
  {
    name: 'Heusden-Zolder',
    slug: 'heusden-zolder',
    province: 'Limburg',
    population: 32000,
    keyIndustries: ['Motorsport', 'Retail', 'Logistiek', 'Productie'],
    businessProfile: 'Heusden-Zolder kent circuit Zolder en transformeert naar retail en logistiek centrum.',
    uniqueCharacteristics: 'Motorsport erfgoed met groeiende retail'
  },

  // Vlaams-Brabant
  {
    name: 'Leuven',
    slug: 'leuven',
    province: 'Vlaams-Brabant',
    population: 102000,
    keyIndustries: ['Technologie', 'Farma', 'Horeca', 'Retail', 'Onderwijs'],
    businessProfile: 'Leuven is universitaire stad met sterke technologie en farmasector. Levendige horeca, retail en groeiende startups rond innovatie.',
    neighborhoods: ['Centrum', 'Heverlee', 'Kessel-Lo', 'Wilsele'],
    uniqueCharacteristics: 'Universitaire stad met tech, farma en innovatie'
  },
  {
    name: 'Vilvoorde',
    slug: 'vilvoorde',
    province: 'Vlaams-Brabant',
    population: 46000,
    keyIndustries: ['Logistiek', 'Retail', 'Productie', 'E-commerce'],
    businessProfile: 'Vilvoorde is logistiek centrum door ligging bij kanaal Brussel-Schelde. Sterke retail en e-commerce distributie.',
    neighborhoods: ['Centrum', 'Koningslo', 'Peutie', 'Kassei'],
    uniqueCharacteristics: 'Logistiek centrum aan Brusselse rand'
  },
  {
    name: 'Tienen',
    slug: 'tienen',
    province: 'Vlaams-Brabant',
    population: 34000,
    keyIndustries: ['Voedingsindustrie', 'Suikerproductie', 'Retail', 'Logistiek'],
    businessProfile: 'Tienen kent voedingsindustrie met suikertraditie. Retail en logistiek groeien door centrale ligging.',
    uniqueCharacteristics: 'Voedingsindustrie met suikertraditie'
  },
  {
    name: 'Aarschot',
    slug: 'aarschot',
    province: 'Vlaams-Brabant',
    population: 30000,
    keyIndustries: ['Retail', 'Bouw', 'Diensten', 'Productie'],
    businessProfile: 'Aarschot is regionaal centrum met retail en diensten. Bouw en productie blijven belangrijke sectoren.',
    uniqueCharacteristics: 'Regionaal centrum met diverse KMO-sector'
  },
  {
    name: 'Diest',
    slug: 'diest',
    province: 'Vlaams-Brabant',
    population: 24000,
    keyIndustries: ['Retail', 'Toerisme', 'Horeca', 'Bouw'],
    businessProfile: 'Diest combineert historisch toerisme met moderne retail. Horeca profiteert van bezoekers.',
    uniqueCharacteristics: 'Historische stad met toerisme en retail'
  },
  {
    name: 'Halle',
    slug: 'halle',
    province: 'Vlaams-Brabant',
    population: 40000,
    keyIndustries: ['Logistiek', 'Retail', 'Productie', 'Diensten'],
    businessProfile: 'Halle groeit als voorstad van Brussel met sterke logistiek en retail. Productie blijft aanwezig.',
    uniqueCharacteristics: 'Groeiende Brusselse voorstad met logistiek'
  },
  {
    name: 'Zaventem',
    slug: 'zaventem',
    province: 'Vlaams-Brabant',
    population: 32000,
    keyIndustries: ['Luchtvaart', 'Logistiek', 'Horeca', 'Retail'],
    businessProfile: 'Zaventem leeft van luchthaven met sterke logistiek, horeca en retail. Internationale bedrijven aanwezig.',
    uniqueCharacteristics: 'Luchthavengemeente met internationale logistiek'
  },
  {
    name: 'Grimbergen',
    slug: 'grimbergen',
    province: 'Vlaams-Brabant',
    population: 37500,
    keyIndustries: ['Brouwerij', 'Retail', 'Diensten', 'Bouw'],
    businessProfile: 'Grimbergen kent abdijbrouwerij traditie en groeit als Brusselse voorstad met retail en diensten.',
    uniqueCharacteristics: 'Abdijstad met brouwerijtraditie'
  },
  {
    name: 'Dilbeek',
    slug: 'dilbeek',
    province: 'Vlaams-Brabant',
    population: 43000,
    keyIndustries: ['Retail', 'Diensten', 'Bouw', 'Technologie'],
    businessProfile: 'Dilbeek is welvarende Brusselse voorstad met sterke retail en dienstensector.',
    uniqueCharacteristics: 'Welvarende voorstad met retail en diensten'
  },
  {
    name: 'Tervuren',
    slug: 'tervuren',
    province: 'Vlaams-Brabant',
    population: 21500,
    keyIndustries: ['Toerisme', 'Retail', 'Diensten', 'Bouw'],
    businessProfile: 'Tervuren combineert toerisme (Afrika Museum) met welvarende residentiële sector en retail.',
    uniqueCharacteristics: 'Toerisme en welvarende woongemeente'
  }
];

// Get cities by province
export function getCitiesByProvince(provinceSlug: string): City[] {
  return cities.filter(city => {
    const province = provinces.find(p => p.slug === provinceSlug);
    return province && city.province === province.name;
  });
}

// Get province by slug
export function getProvinceBySlug(slug: string): Province | undefined {
  return provinces.find(p => p.slug === slug);
}

// Get city by slug
export function getCityBySlug(slug: string): City | undefined {
  return cities.find(c => c.slug === slug);
}


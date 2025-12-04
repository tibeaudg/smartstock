export interface CaseStudy {
  id: string;
  title: string;
  company: string;
  industry: string;
  thumbnail?: string;
  challenge: string;
  solution: string;
  results: string[];
  metrics: {
    [key: string]: string;
  };
  link?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "hardware-store-chain",
    title: "From Excel Chaos to Organized Success",
    company: "Hardware Store Chain",
    industry: "Retail",
    challenge: "Managing inventory across 3 locations with Excel spreadsheets was becoming impossible. Staff were spending 8+ hours weekly on manual counting.",
    solution: "Implemented StockFlow with mobile scanning and multi-location tracking.",
    results: [
      "75% reduction in counting time",
      "€12,000 saved annually in labor costs",
      "Real-time visibility across all stores",
      "Zero stockouts on popular items",
    ],
    metrics: {
      timeSaved: "6 hours/week",
      costSaved: "€12,000/year",
      locations: "3 stores",
      products: "2,500 SKUs",
    },
    link: "/customers",
  },
  {
    id: "restaurant-group",
    title: "Eliminating Food Waste in Restaurant Operations",
    company: "Local Restaurant Group",
    industry: "Food & Beverage",
    challenge: "Food waste was costing €2,400 monthly due to poor inventory tracking and expiry management.",
    solution: "Deployed StockFlow with expiry alerts and consumption tracking.",
    results: [
      "60% reduction in food waste",
      "€1,440 saved monthly",
      "Better supplier relationships",
      "Improved food quality",
    ],
    metrics: {
      wasteReduction: "60%",
      costSaved: "€1,440/month",
      locations: "2 restaurants",
      products: "800 ingredients",
    },
    link: "/customers",
  },
];


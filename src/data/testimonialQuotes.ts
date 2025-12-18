export interface TestimonialQuote {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  savings?: string;
}

export const testimonialQuotes: TestimonialQuote[] = [
  {
    id: "laura-peeters",
    quote: "StockFlow stopped us from wasting €4,800 annually on expired inventory. We now invest that capital into bestselling items.",
    author: "Laura Peeters",
    role: "Owner",
    company: "De Koffieboetiek",
    rating: 5,
    savings: "€4,800/year saved",
  },
  {
    id: "sophie-martens",
    quote: "StockFlow helped us identify €8,500 worth of slow-moving inventory. We cleared it at 30% margin instead of letting it sit.",
    author: "Tom Demuynck",
    role: "Owner",
    company: "Maison Belle Boutique",
    rating: 5,
    savings: "€8,500 recovered",
  },
  {
    id: "anke-willems",
    quote: "We used to over-order seasonal items tying up €3,200 in capital. StockFlow's alerts help us order just enough.",
    author: "Anke Willems",
    role: "Owner",
    company: "Artisan & Co.",
    rating: 5,
    savings: "€3,200 freed",
  },
];





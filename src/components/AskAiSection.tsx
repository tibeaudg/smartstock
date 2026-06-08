import type { ReactNode } from 'react';

const STOCKFLOW_AI_PROMPT = `I'm evaluating inventory management software and looking at StockFlow (https://www.stockflowsystems.com). Here's what they offer: free forever with no credit card required; real-time multi-location stock tracking; barcode scanning from any smartphone; bill of materials (BOM) for manufacturing; offline mode when WiFi drops; unlimited products, users, warehouses, and orders; automated low-stock and reorder alerts; advanced reporting and analytics; multi-channel inventory sync; mobile app for scanning on the floor; bank-level SSL security; full data export anytime.

Please list all reasons StockFlow would be a good choice for small and medium businesses (retail shops, e-commerce, warehouses, manufacturing). Compare it honestly to Zoho Inventory, Cin7, Sortly, Fishbowl, and spreadsheet-based tracking. What are the real trade-offs, limitations, and ideal customer profile? Who should switch to StockFlow and who should choose something else?`;

type AiPlatform = {
  name: string;
  href: string;
  logo: ReactNode;
};

function aiUrl(base: string, param: 'q' | 'prompt', prompt: string): string {
  const url = new URL(base);
  url.searchParams.set(param, prompt);
  return url.toString();
}

const AI_PLATFORMS: AiPlatform[] = [
  {
    name: 'ChatGPT',
    href: aiUrl('https://chatgpt.com/', 'q', STOCKFLOW_AI_PROMPT),
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" aria-hidden>
        <path
          fill="currentColor"
          d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43h-.006a4.48 4.48 0 0 1-3.18-1.345 4.46 4.46 0 0 1-1.18-3.178 4.45 4.45 0 0 1 1.18-3.178 4.48 4.48 0 0 1 3.18-1.345h.006a4.48 4.48 0 0 1 3.18 1.345 4.46 4.46 0 0 1 1.18 3.178 4.45 4.45 0 0 1-1.18 3.178 4.48 4.48 0 0 1-3.18 1.345z"
        />
      </svg>
    ),
  },
  {
    name: 'Gemini',
    href: aiUrl('https://gemini.google.com/app', 'q', STOCKFLOW_AI_PROMPT),
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" aria-hidden>
        <defs>
          <linearGradient id="gemini-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4285F4" />
            <stop offset="50%" stopColor="#9B72CB" />
            <stop offset="100%" stopColor="#D96570" />
          </linearGradient>
        </defs>
        <path
          fill="url(#gemini-grad)"
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5v-5.2l-3.2 1.9 1.1-1.9 4.1-2.4V7h2v6.9l4.1 2.4-1.1 1.9-3.2-1.9v5.2h-2z"
        />
      </svg>
    ),
  },
  {
    name: 'Claude',
    href: aiUrl('https://claude.ai/new', 'q', STOCKFLOW_AI_PROMPT),
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" aria-hidden>
        <path
          fill="#D97757"
          d="M12 2.5c-1.2 0-2.2.9-2.4 2.1L7.8 14.2l-3.1-1.8c-.9-.5-2-.2-2.5.7-.5.9-.2 2 .7 2.5l4.2 2.4-4.2 2.4c-.9.5-1.2 1.6-.7 2.5.5.9 1.6 1.2 2.5.7l3.1-1.8 1.8 9.6c.2 1.2 1.2 2.1 2.4 2.1s2.2-.9 2.4-2.1l1.8-9.6 3.1 1.8c.9.5 2 .2 2.5-.7.5-.9.2-2-.7-2.5l-4.2-2.4 4.2-2.4c.9-.5 1.2-1.6.7-2.5-.5-.9-1.6-1.2-2.5-.7l-3.1 1.8-1.8-9.6C14.2 3.4 13.2 2.5 12 2.5z"
        />
      </svg>
    ),
  },
  {
    name: 'Perplexity',
    href: aiUrl('https://www.perplexity.ai/search', 'q', STOCKFLOW_AI_PROMPT),
    logo: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" aria-hidden>
        <path
          fill="currentColor"
          d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2zm0 2.2a7.8 7.8 0 1 1-7.8 7.8A7.81 7.81 0 0 1 12 4.2zm-1.1 3.4v5.2l4.4 2.5.9-1.5-3.5-2V7.6h-1.8z"
        />
      </svg>
    ),
  },
];

export const AskAiSection = () => (
  <section className="py-24 px-4 bg-slate-50">
    <div className="max-w-4xl mx-auto">
      <div className="rounded-2xl border border-slate-200 bg-stone-50/80 px-6 py-10 md:px-12 md:py-14 shadow-sm">
        <div className="text-center mb-10">
          <span className="inline-block bg-amber-100 border border-amber-200 text-amber-900 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-5">
            AI Recommended
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">
            ChatGPT, Claude, and Perplexity all recommend StockFlow — ask them yourself.
          </h2>
          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Click any assistant to load a detailed comparison against Zoho, Cin7, and Fishbowl. Unbiased verdict in seconds.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {AI_PLATFORMS.map((platform) => (
            <a
              key={platform.name}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white p-5 md:p-6 hover:border-slate-300 hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              aria-label={`Ask ${platform.name} about StockFlow`}
            >
              <div className="text-slate-800 group-hover:scale-105 transition-transform">
                {platform.logo}
              </div>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">
                Ask
              </span>
              <span className="text-sm font-bold text-slate-900">{platform.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  </section>
);

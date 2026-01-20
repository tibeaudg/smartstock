import React from 'react';
import SeoPageLayout from '@/components/SeoPageLayout';
import HeaderPublic from '@/components/HeaderPublic';
import FooterPublic from '@/components/Footer';
import { Link } from 'react-router-dom';

const Page = () => {
  return (
    <>
      <HeaderPublic
        title="Bill of Materials Software | Automate BOM Management & Cut Production Costs by 40% | StockFlow"
        description="Master manufacturing costs with automated Bill of Materials software. Real-time inventory tracking, multi-level assembly management, and instant COGS calculations. Free trial, no credit card required."
      />

      <div className="font-sans antialiased">
        
        {/* Hero Section - The "What & Why" */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxZTI5M2IiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yIDIuMi00IDUtNHM1IDIgNSA0YzAgMi0yLjIgNC01IDRzLTUtMi01LTR6bTAgMTBjMC0yIDIuMi00IDUtNHM1IDIgNSA0YzAgMi0yLjIgNC01IDRzLTUtMi01LTR6bS0xMCAwYzAtMiAyLjItNCA1LTRzNSAyIDUgNGMwIDItMi4yIDQtNSA0cy01LTItNS00em0wLTEwYzAtMiAyLjItNCA1LTRzNSAyIDUgNGMwIDItMi4yIDQtNSA0cy01LTItNS00em0tMTAgMGMwLTIgMi4yLTQgNS00czUgMiA1IDRjMCAyLTIuMiA0LTUgNHMtNS0yLTUtNHptMCAxMGMwLTIgMi4yLTQgNS00czUgMiA1IDRjMCAyLTIuMiA0LTUgNHMtNS0yLTUtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
          
          <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-400/20 rounded-full text-blue-300 text-sm font-medium backdrop-blur-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Trusted by 2,400+ Manufacturing Teams
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
                  Master Your Manufacturing Costs with <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">Automated Bill of Materials</span>
                </h1>
                
                <p className="text-xl text-slate-300 leading-relaxed">
                  Stop losing money to manual BOM errors and production delays. StockFlow's intelligent Bill of Materials software gives you real-time visibility, instant cost calculations, and automated inventory deductions across multi-level assemblies.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold text-white text-lg shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all hover:scale-105">
                    <Link to="/auth?mode=register">Create Free Account</Link>
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 blur transition-opacity -z-10"></span>
                  </button>

                </div>
                
                <div className="flex items-center gap-8 pt-4 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    No credit card required
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Setup in 10 minutes
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 blur-3xl"></div>
                <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                      <span className="text-slate-400 text-sm font-medium">Assembly: PROD-2024-001</span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">IN STOCK</span>
                    </div>
                    {[
                      { name: 'Steel Frame A200', qty: '4 units', cost: '$124.00', status: 'Available' },
                      { name: 'Motor Assembly M-500', qty: '1 unit', cost: '$890.00', status: 'Available' },
                      { name: 'Control Board CB-X', qty: '2 units', cost: '$245.00', status: 'Available' },
                      { name: 'Fastener Kit FK-100', qty: '1 kit', cost: '$45.00', status: 'Available' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-mono text-xs">
                            {i + 1}
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">{item.name}</div>
                            <div className="text-slate-500 text-xs">{item.qty}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold text-sm">{item.cost}</div>
                          <div className="text-green-400 text-xs">{item.status}</div>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                      <span className="text-slate-300 font-bold">Total Unit Cost</span>
                      <span className="text-2xl font-black text-white">$1,304.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof - Logo Bar */}
        <section className="py-16 bg-slate-50 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-slate-500 text-sm font-semibold uppercase tracking-wider mb-8">
              Powering Bill of Materials for Industry Leaders
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale">
              {['Acme Manufacturing', 'TechParts Inc', 'GlobalAssembly', 'Precision Tools', 'IndustrialCo', 'MakerSpace'].map((company, i) => (
                <div key={i} className="text-2xl font-black text-slate-700">{company}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Pain & Solution - Feature Highlights */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 space-y-32">
            
            {/* Feature 1 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold uppercase tracking-wide">
                  Multi-Level Assembly Tracking
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                  Eliminate Production Delays with Real-Time Assembly Tracking
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Track every component across unlimited assembly levels. When raw materials arrive, StockFlow instantly updates availability across all dependent products. No more production stoppages from outdated inventory data.
                </p>
                <ul className="space-y-4">
                  {[
                    'Unlimited nested BOM levels (assemblies within assemblies)',
                    'Real-time stock deductions across all parent products',
                    'Automated component substitution alerts',
                    'Visual dependency mapping for complex products'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-slate-700 text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl -rotate-3"></div>
                <div className="relative bg-white border-4 border-slate-900 rounded-2xl p-8 shadow-2xl rotate-1">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-900">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-black text-xl">A</div>
                      <div>
                        <div className="font-black text-slate-900">Final Product A</div>
                        <div className="text-sm text-slate-600">Assembly Level 1</div>
                      </div>
                    </div>
                    <div className="pl-8 space-y-4">
                      <div className="flex items-center gap-3 pb-3 border-b border-slate-300">
                        <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center text-white font-bold">B</div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-900">Sub-Assembly B</div>
                          <div className="text-xs text-slate-500">Assembly Level 2</div>
                        </div>
                        <div className="text-green-600 font-bold text-sm">15 in stock</div>
                      </div>
                      <div className="pl-8 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-orange-400 rounded flex items-center justify-center text-white font-bold text-sm">C1</div>
                          <div className="flex-1 text-sm text-slate-700">Component C1 × 4</div>
                          <div className="text-orange-600 font-bold text-xs">48 needed</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-orange-400 rounded flex items-center justify-center text-white font-bold text-sm">C2</div>
                          <div className="flex-1 text-sm text-slate-700">Component C2 × 2</div>
                          <div className="text-green-600 font-bold text-xs">85 available</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-8 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                      <span className="text-slate-300 font-bold">Cost Calculation</span>
                      <span className="text-green-400 text-sm font-mono">REAL-TIME</span>
                    </div>
                    {[
                      { label: 'Raw Materials', amount: '$2,450.00', percent: '45%' },
                      { label: 'Components', amount: '$1,890.00', percent: '35%' },
                      { label: 'Labor (Auto-calc)', amount: '$650.00', percent: '12%' },
                      { label: 'Overhead', amount: '$420.00', percent: '8%' }
                    ].map((cost, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-sm">{cost.label}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-white font-bold">{cost.amount}</span>
                            <span className="text-slate-500 text-xs font-mono">{cost.percent}</span>
                          </div>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{width: cost.percent}}></div>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                      <span className="text-slate-300 font-bold text-lg">Total COGS</span>
                      <span className="text-3xl font-black text-white">$5,410.00</span>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="text-green-400 text-sm font-bold">✓ 100% Accurate Cost Tracking</div>
                      <div className="text-green-300/70 text-xs mt-1">Updates automatically with every inventory change</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 space-y-6">
                <div className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold uppercase tracking-wide">
                  Instant COGS Calculation
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                  Know Your True Production Costs in Real-Time
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Stop guessing at profit margins. StockFlow automatically calculates Cost of Goods Sold (COGS) by tracking every component, material cost, and labor input across your entire Bill of Materials.
                </p>
                <ul className="space-y-4">
                  {[
                    'Automatic COGS updates when supplier prices change',
                    'Multi-currency support for global manufacturing',
                    'Historical cost tracking for trend analysis',
                    'Instant profitability alerts when margins compress'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-slate-700 text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold uppercase tracking-wide">
                  Automated Inventory Deduction
                </div>
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                  Stop Overselling Products You Can't Build
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed">
                  When you sell a finished product, StockFlow automatically deducts all component parts from inventory. No more discovering missing components mid-production or overselling products you don't have materials to build.
                </p>
                <ul className="space-y-4">
                  {[
                    'Automatic component reservation on order creation',
                    'Real-time available-to-promise (ATP) calculations',
                    'Prevents overselling across all sales channels',
                    'Smart reorder triggers for low-stock components'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-slate-700 text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">Order #5028</div>
                          <div className="text-xs text-slate-500">Product: Widget Pro</div>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">PROCESSING</span>
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm font-bold text-slate-700 uppercase tracking-wide">Auto-Deduction in Progress:</div>
                      {[
                        { name: 'Steel Plate A', before: '245', after: '240', unit: 'units' },
                        { name: 'Motor M-100', before: '89', after: '84', unit: 'units' },
                        { name: 'Bearing Set', before: '412', after: '402', unit: 'sets' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                          <span className="text-sm text-slate-700 font-medium">{item.name}</span>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-slate-400 line-through">{item.before}</span>
                            <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                            </svg>
                            <span className="font-bold text-purple-600">{item.after}</span>
                            <span className="text-slate-500 text-xs">{item.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-sm text-green-700 font-medium">All components reserved & deducted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Quantifiable Value Section */}
        <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
                The StockFlow Advantage: By The Numbers
              </h2>
              <p className="text-xl text-blue-100">
                Real results from manufacturing teams who switched to automated Bill of Materials
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  number: '40%',
                  label: 'Reduction in Manual Data Entry',
                  description: 'Automated BOM updates eliminate repetitive inventory tasks',
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  )
                },
                {
                  number: '100%',
                  label: 'Accurate COGS Tracking',
                  description: 'Know your true production costs in real-time, always',
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  number: '10 min',
                  label: 'Setup Time to First BOM',
                  description: 'Import existing BOMs or build new ones in minutes, not days',
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                }
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center space-y-4 hover:bg-white/15 transition-all">
                  <div className="flex justify-center text-blue-200">
                    {stat.icon}
                  </div>
                  <div className="text-6xl font-black text-white">{stat.number}</div>
                  <div className="text-xl font-bold text-blue-100">{stat.label}</div>
                  <p className="text-blue-200 text-sm">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof - Wall of Love */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                Loved by Production Managers & CFOs Alike
              </h2>
              <p className="text-xl text-slate-600">
                See what manufacturing teams say about StockFlow's Bill of Materials software
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "StockFlow's BOM feature eliminated our monthly inventory reconciliation nightmare. We went from 3 days of manual checking to real-time accuracy. Our COGS calculations are finally reliable.",
                  name: "Sarah Chen",
                  title: "Operations Director",
                  company: "Precision Manufacturing Inc.",
                  image: "SC"
                },
                {
                  quote: "The multi-level assembly tracking is a game-changer. We build complex products with 50+ components, and StockFlow shows us exactly what we can build right now. No more production delays.",
                  name: "Michael Rodriguez",
                  title: "Production Manager",
                  company: "TechAssembly Solutions",
                  image: "MR"
                },
                {
                  quote: "As a CFO, accurate COGS is everything for pricing decisions. StockFlow gives us instant visibility into component costs across our entire product line. It paid for itself in the first quarter.",
                  name: "Jennifer Walsh",
                  title: "Chief Financial Officer",
                  company: "Industrial Components Ltd.",
                  image: "JW"
                }
              ].map((testimonial, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex gap-1 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-700 text-lg leading-relaxed italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.image}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-600">{testimonial.title}</div>
                      <div className="text-sm text-slate-500">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                Seamlessly Integrates with Your Existing Workflow
              </h2>
              <p className="text-xl text-slate-600">
                StockFlow's Bill of Materials connects with the tools you already use
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {[
                { name: 'Shopify', category: 'E-commerce' },
                { name: 'QuickBooks', category: 'Accounting' },
                { name: 'Xero', category: 'Accounting' },
                { name: 'Salesforce', category: 'CRM' },
                { name: 'WooCommerce', category: 'E-commerce' },
                { name: 'NetSuite', category: 'ERP' },
                { name: 'Zapier', category: 'Automation' },
                { name: 'Amazon', category: 'Marketplace' },
                { name: 'eBay', category: 'Marketplace' },
                { name: 'Stripe', category: 'Payments' },
                { name: 'SAP', category: 'ERP' },
                { name: 'Slack', category: 'Communication' }
              ].map((integration, i) => (
                <div key={i} className="group bg-slate-50 border border-slate-200 rounded-xl p-6 text-center space-y-3 hover:border-blue-500 hover:shadow-lg transition-all">
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-lg flex items-center justify-center mx-auto font-bold text-slate-700 text-xs group-hover:border-blue-500 transition-colors">
                    {integration.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{integration.name}</div>
                    <div className="text-xs text-slate-500">{integration.category}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-slate-600 mb-4">Can't find your tool? We offer custom API integrations.</p>
              <button className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                View All Integrations →
              </button>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxZTI5M2IiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yIDIuMi00IDUtNHM1IDIgNSA0YzAgMi0yLjIgNC01IDRzLTUtMi01LTR6bTAgMTBjMC0yIDIuMi00IDUtNHM1IDIgNSA0YzAgMi0yLjIgNC01IDRzLTUtMi01LTR6bS0xMCAwYzAtMiAyLjItNCA1LTRzNSAyIDUgNGMwIDItMi4yIDQtNSA0cy01LTItNS00em0wLTEwYzAtMiAyLjItNCA1LTRzNSAyIDUgNGMwIDItMi4yIDQtNSA0cy01LTItNS00em0tMTAgMGMwLTIgMi4yLTQgNS00czUgMiA1IDRjMCAyLTIuMiA0LTUgNHMtNS0yLTUtNHptMCAxMGMwLTIgMi4yLTQgNS00czUgMiA1IDRjMCAyLTIuMiA0LTUgNHMtNS0yLTUtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
          
          <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
            <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight">
              Ready to Streamline Your Production?
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Join 2,400+ manufacturing teams who've eliminated manual BOM errors and gained real-time cost visibility with StockFlow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group relative px-10 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold text-white text-lg shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all hover:scale-105">
                Start Your Free Trial
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100 blur transition-opacity -z-10"></span>
              </button>
     7
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                Cancel anytime
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-slate-600">
                Everything you need to know about Bill of Materials in StockFlow
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  q: "Is there a free Bill of Materials software for small businesses?",
                  a: "StockFlow offers a 14-day free trial with full access to all Bill of Materials features, including multi-level assembly tracking, automated inventory deductions, and real-time COGS calculations. After your trial, our Starter plan begins at $49/month and includes unlimited BOMs for small manufacturers. Unlike generic free tools, StockFlow is purpose-built for manufacturing and includes integrations with QuickBooks, Shopify, and other business tools you already use."
                },
                {
                  q: "What is a software Bill of Materials (BOM)?",
                  a: "A software Bill of Materials is a digital system that tracks all the components, raw materials, and sub-assemblies required to manufacture a finished product. Unlike a traditional spreadsheet BOM, software BOMs automatically update inventory levels, calculate costs in real-time, and track dependencies across multi-level assemblies. StockFlow's BOM software connects directly to your inventory management system, so when you sell a finished product, all component parts are automatically deducted from stock."
                },
                {
                  q: "What does BOM mean in software?",
                  a: "BOM stands for 'Bill of Materials' in manufacturing software. It's a comprehensive list of all parts, components, materials, and quantities needed to build a product. In software like StockFlow, a BOM isn't just a static list—it's a dynamic system that tracks real-time availability, calculates accurate production costs, prevents overselling, and automates inventory deductions across complex assemblies. Modern BOM software also handles lot tracking, serialization, and component substitutions."
                },
                {
                  q: "Which software tool is commonly used to create a Bill of Materials?",
                  a: "Manufacturing companies typically use specialized inventory management software like StockFlow to create and manage Bills of Materials. While some businesses start with spreadsheets or CAD software exports, dedicated BOM software like StockFlow offers critical advantages: real-time inventory synchronization, multi-level assembly tracking, automated cost calculations, and seamless integration with accounting systems like QuickBooks and Xero. StockFlow also connects to sales channels (Shopify, Amazon) to prevent overselling products you don't have materials to build."
                },
                {
                  q: "Can StockFlow handle multi-level nested Bill of Materials?",
                  a: "Yes. StockFlow supports unlimited BOM levels, allowing you to create assemblies within assemblies. For example, if your final product contains a motor assembly, and that motor assembly contains a bearing kit, StockFlow tracks all dependencies automatically. When you sell the final product, the system deducts quantities at every level. You can also view visual dependency maps to understand which components affect multiple products."
                },
                {
                  q: "How does BOM software integrate with my existing accounting system?",
                  a: "StockFlow integrates directly with QuickBooks, Xero, NetSuite, and other major accounting platforms. When a product is manufactured or sold, StockFlow automatically syncs COGS data to your accounting system, ensuring your financial records stay accurate without manual data entry. The integration works bidirectionally—component costs from your accounting system automatically update your BOM cost calculations in StockFlow."
                },
                {
                  q: "What's the difference between a BOM and a production planning system?",
                  a: "A Bill of Materials defines what components are needed to build a product, while production planning schedules when and how many to build. StockFlow combines both: our BOM system shows you what you can build right now based on available inventory, while our production planning features help you schedule manufacturing runs, manage work orders, and optimize material ordering. This integrated approach prevents production delays caused by missing components."
                },
                {
                  q: "Can I import my existing Bills of Materials from Excel or CSV?",
                  a: "Yes. StockFlow includes a BOM import wizard that accepts CSV, Excel, and standard BOM file formats. You can map your existing columns (part number, quantity, cost, supplier) to StockFlow fields, and the system validates the data before import. If you're migrating from another system, our team provides free onboarding support to ensure all your BOMs transfer correctly with full assembly structures intact."
                }
              ].map((faq, i) => (
                <details key={i} className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <summary className="cursor-pointer list-none px-8 py-6 font-bold text-slate-900 text-lg flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <span className="pr-8">{faq.q}</span>
                    <svg className="w-6 h-6 text-slate-400 flex-shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-8 pb-6 text-slate-600 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-slate-600 mb-4">Still have questions about Bill of Materials software?</p>
              <button className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                Contact Our Sales Team →
              </button>
            </div>
          </div>
        </section>

      </div>

      <FooterPublic />
    </>
  );
};

export default Page;
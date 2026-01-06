import { SEO } from '@/components/SEO';
import { usePageRefresh } from '@/hooks/usePageRefresh';
import { 
  PlayCircle, 
  Search, 
  BookOpen, 
  Settings, 
  ShieldCheck, 
  Layers,
  Clock,
  Video,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

import Header from '@/components/HeaderPublic';
import Footer from '@/components/Footer';

const TUTORIAL_CATEGORIES = [
  {
    id: 'setup',
    title: 'Initial Setup',
    icon: <Settings className="w-6 h-6" />,
    videos: [
      { id: 'v1', title: 'Setting up your first Warehouse', duration: '3:45', thumbnail: '/api/placeholder/400/225' },
      { id: 'v2', title: 'Importing SKUs via CSV', duration: '5:12', thumbnail: '/api/placeholder/400/225' },
    ]
  },
  {
    id: 'workflows',
    title: 'Daily Workflows',
    icon: <Layers className="w-6 h-6" />,
    videos: [
      { id: 'v3', title: 'Managing Stock Movements', duration: '4:20', thumbnail: '/api/placeholder/400/225' },
      { id: 'v4', title: 'Barcode Scanning on Mobile', duration: '2:55', thumbnail: '/api/placeholder/400/225' },
    ]
  },
  {
    id: 'security',
    title: 'Security & Access',
    icon: <ShieldCheck className="w-6 h-6" />,
    videos: [
      { id: 'v5', title: 'Configuring Role-Based Permissions', duration: '6:10', thumbnail: '/api/placeholder/400/225' },
    ]
  }
];

export default function KnowledgeBase() {
  usePageRefresh();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "VideoGallery",
    "name": "StockFlow Learning Center",
    "description": "Video instructions for StockFlow inventory management.",
    "url": "https://www.stockflowsystems.com/videos"
  };

  return (
    <>
      <SEO
        title="Video Tutorials | StockFlow Learning Center"
        description="Master StockFlow with our comprehensive video instruction library. Step-by-step visual guides for inventory orchestration."
        keywords="stockflow tutorials, inventory management videos, training, stockflow help"
        url="https://www.stockflowsystems.com/videos"
        structuredData={structuredData}
      />

      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-slate-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Video className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Learning Center
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Visual step-by-step guides designed to help your team master inventory orchestration in minutes.
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search for a tutorial (e.g. 'Barcode Scanning')..." 
                className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-16">
            
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Subject Categories</h3>
                <nav className="space-y-2">
                  {TUTORIAL_CATEGORIES.map(cat => (
                    <button 
                      key={cat.id}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all font-medium text-left group"
                    >
                      <span className="text-gray-400 group-hover:text-blue-600 transition-colors">{cat.icon}</span>
                      {cat.title}
                    </button>
                  ))}
                </nav>
                
                <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <HelpCircle className="w-8 h-8 text-blue-600 mb-4" />
                  <p className="text-sm text-blue-900 font-bold mb-2">Personal Training</p>
                  <p className="text-xs text-blue-700 mb-4 leading-relaxed">Book a 1-on-1 session with our customer success team.</p>
                  <button className="text-sm font-bold text-blue-700 flex items-center gap-1 hover:gap-2 transition-all">
                    Schedule <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </aside>

            {/* Video Feed */}
            <main className="lg:col-span-3 space-y-20">
              {TUTORIAL_CATEGORIES.map(category => (
                <div key={category.id} className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-6">
                    <div className="w-12 h-12 bg-gray-50 text-blue-600 rounded-xl flex items-center justify-center border border-gray-100">
                      {category.icon}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{category.title}</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-10">
                    {category.videos.map(video => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </div>
                </div>
              ))}
            </main>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Request a specific tutorial?</h2>
          <p className="text-gray-600 mb-10 max-w-xl mx-auto">
            Our library is built by user demand. If a specific workflow is missing, our engineering team will record it for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Submit Request
            </button>
            <button className="px-8 py-4 bg-white border border-gray-200 text-gray-900 font-bold rounded-xl hover:border-gray-300 transition-all">
              Full Documentation
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function VideoCard({ video }: { video: any }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-200 mb-5 shadow-sm transition-all group-hover:shadow-xl group-hover:scale-[1.01]">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/40 transition-colors flex items-center justify-center">
          <PlayCircle className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100" />
        </div>
        <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {video.duration}
        </div>
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
        {video.title}
      </h4>
      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
        <BookOpen className="w-4 h-4 text-blue-500" />
        <span>StockFlow University</span>
      </div>
    </div>
  );
}
import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import VideoModal from '@/components/VideoModal';
import { faqSlug, getYoutubeThumbnail } from '@/utils/helpCenter';
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
  HelpCircle,
} from 'lucide-react';

import Header from '@/components/HeaderPublic';
import Footer from '@/components/Footer';

const DEMO_VIDEO_URL = import.meta.env.VITE_DEMO_VIDEO_URL as string | undefined;

interface TutorialVideo {
  id: string;
  title: string;
  duration: string;
  helpFaqQuestion: string;
  videoUrl?: string;
  thumbnail?: string;
}

interface TutorialCategory {
  id: string;
  title: string;
  icon: ReactNode;
  videos: TutorialVideo[];
}

const TUTORIAL_CATEGORIES: TutorialCategory[] = [
  {
    id: 'setup',
    title: 'Initial Setup',
    icon: <Settings className="w-6 h-6" />,
    videos: [
      {
        id: 'v1',
        title: 'Setting up your first Warehouse',
        duration: '3:45',
        helpFaqQuestion: 'How do I create a new inventory?',
      },
      {
        id: 'v2',
        title: 'Importing SKUs via CSV',
        duration: '5:12',
        helpFaqQuestion: 'What is the best way to onboard my existing stock?',
      },
    ],
  },
  {
    id: 'workflows',
    title: 'Daily Workflows',
    icon: <Layers className="w-6 h-6" />,
    videos: [
      {
        id: 'v3',
        title: 'Managing Stock Movements',
        duration: '4:20',
        helpFaqQuestion: 'How do I track stock movements over time?',
      },
      {
        id: 'v4',
        title: 'Barcode Scanning on Mobile',
        duration: '2:55',
        helpFaqQuestion: 'Is there a mobile app and what can I do with it?',
      },
    ],
  },
  {
    id: 'security',
    title: 'Security & Access',
    icon: <ShieldCheck className="w-6 h-6" />,
    videos: [
      {
        id: 'v5',
        title: 'Configuring Role-Based Permissions',
        duration: '6:10',
        helpFaqQuestion: 'Can I restrict access to certain products or warehouses?',
      },
    ],
  },
];

function getVideoThumbnail(video: TutorialVideo): string | null {
  const url = video.videoUrl || DEMO_VIDEO_URL;
  if (!url) return null;
  return video.thumbnail || getYoutubeThumbnail(url);
}

export default function KnowledgeBase() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'VideoGallery',
    name: 'StockFlow Learning Center',
    description: 'Video instructions for StockFlow inventory management.',
    url: 'https://www.stockflowsystems.com/videos',
  };

  const normalizedQuery = searchQuery.toLowerCase().trim();

  const filteredCategories = TUTORIAL_CATEGORIES.map((category) => ({
    ...category,
    videos: category.videos.filter((video) => {
      if (!normalizedQuery) return true;
      const haystack = [video.title, category.title, video.helpFaqQuestion].join(' ').toLowerCase();
      return haystack.includes(normalizedQuery);
    }),
  })).filter((category) => category.videos.length > 0);

  const scrollToCategory = (categoryId: string) => {
    document.getElementById(`category-${categoryId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openTutorial = (video: TutorialVideo) => {
    const url = video.videoUrl || DEMO_VIDEO_URL;
    if (url) {
      setActiveVideo({ url, title: video.title });
      return;
    }
    navigate(`/help-center#${faqSlug(video.helpFaqQuestion)}`);
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Learning Center</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Visual step-by-step guides designed to help your team master inventory orchestration in minutes.
            </p>

            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                  {TUTORIAL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => scrollToCategory(cat.id)}
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
                  <p className="text-xs text-blue-700 mb-4 leading-relaxed">
                    Book a 1-on-1 session with our customer success team.
                  </p>
                  <Link
                    to="/contact"
                    className="text-sm font-bold text-blue-700 flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Schedule <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </aside>

            {/* Video Feed */}
            <main className="lg:col-span-3 space-y-20">
              {filteredCategories.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-8 py-16 text-center">
                  <p className="text-lg font-semibold text-gray-800">No tutorials match your search</p>
                  <p className="mt-2 text-sm text-gray-500">Try another keyword or browse the help center.</p>
                  <Link
                    to="/help-center"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Browse Help Center <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                filteredCategories.map((category) => (
                  <div key={category.id} id={`category-${category.id}`} className="scroll-mt-32">
                    <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-6">
                      <div className="w-12 h-12 bg-gray-50 text-blue-600 rounded-xl flex items-center justify-center border border-gray-100">
                        {category.icon}
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">{category.title}</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                      {category.videos.map((video) => (
                        <VideoCard key={video.id} video={video} onPlay={() => openTutorial(video)} />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </main>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Request a specific tutorial?</h2>
          <p className="text-gray-600 mb-10 max-w-xl mx-auto">
            Our library is built by user demand. If a specific workflow is missing, our engineering team will record it
            for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Submit Request
            </Link>
            <Link
              to="/help-center"
              className="px-8 py-4 bg-white border border-gray-200 text-gray-900 font-bold rounded-xl hover:border-gray-300 transition-all"
            >
              Full Documentation
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <VideoModal
        isOpen={!!activeVideo}
        onClose={() => setActiveVideo(null)}
        videoUrl={activeVideo?.url}
        title={activeVideo?.title}
        description="Watch this StockFlow tutorial to learn the workflow step by step."
      />
    </>
  );
}

function VideoCard({ video, onPlay }: { video: TutorialVideo; onPlay: () => void }) {
  const thumbnail = getVideoThumbnail(video);

  return (
    <button type="button" onClick={onPlay} className="group cursor-pointer text-left w-full">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-slate-700 to-blue-900 mb-5 shadow-sm transition-all group-hover:shadow-xl group-hover:scale-[1.01]">
        {thumbnail ? (
          <img src={thumbnail} alt={video.title} className="w-full h-full object-cover opacity-90" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <PlayCircle className="w-16 h-16 text-white/80" />
          </div>
        )}
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
        <span>{DEMO_VIDEO_URL || video.videoUrl ? 'StockFlow University' : 'Read step-by-step guide'}</span>
      </div>
    </button>
  );
}

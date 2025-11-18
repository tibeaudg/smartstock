import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Maximize2, LayoutDashboard, Package, Settings, Scan, X, CheckCircle, Info, List, Search, Filter, Plus, Upload, Download, MapPin, MoreVertical, ChevronLeft, ChevronRight, Euro, TrendingUp, TrendingDown, AlertTriangle, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const PlatformPreviewSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Mockup components for screenshots
  const DashboardMockup = () => (
    <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-4 shadow-lg h-full">
      <div className="space-y-4">
        {/* KPI Cards Grid (2x2) */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Stock Value */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Stock Value</span>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Euro className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">€ 15.782,13</div>
          </div>

          {/* Added Today */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Added Today</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <div className="w-4 h-3 bg-green-100 rounded"></div>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600">0</div>
          </div>

          {/* Sent Today */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Sent Today</span>
              <div className="flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <div className="w-4 h-3 bg-red-100 rounded"></div>
              </div>
            </div>
            <div className="text-2xl font-bold text-red-600">0</div>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Low Stock Alerts</span>
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-orange-500">99</div>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">History</h3>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg bg-white">
              <span className="text-sm text-gray-700">This Month</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Chart Area */}
          <div className="relative h-48">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
              <span>8</span>
              <span>6</span>
              <span>4</span>
              <span>2</span>
              <span>0</span>
            </div>

            {/* Chart content */}
            <div className="ml-8 h-full relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-t border-gray-100"></div>
                ))}
              </div>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 pb-1">
                <span>2025-11-02</span>
                <span>2025-11-07</span>
                <span>2025-11-12</span>
                <span>2025-11-17</span>
              </div>

              {/* Data points and line */}
              <div className="absolute inset-0">
                {/* Red data points at 0 for most dates */}
                <div className="absolute bottom-0 left-0 w-full flex justify-between items-end" style={{ height: '20%' }}>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </div>

                {/* Green line with spike on 2025-11-12 */}
                <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                  {/* Base line at 0 */}
                  <line
                    x1="0%"
                    y1="80%"
                    x2="100%"
                    y2="80%"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                  />
                  {/* Spike line on 2025-11-12 (middle point) */}
                  <line
                    x1="50%"
                    y1="80%"
                    x2="50%"
                    y2="10%"
                    stroke="#22c55e"
                    strokeWidth="2"
                  />
                  <line
                    x1="50%"
                    y1="10%"
                    x2="100%"
                    y2="80%"
                    stroke="#22c55e"
                    strokeWidth="2"
                  />
                  {/* Green data point at spike */}
                  <circle
                    cx="50%"
                    cy="10%"
                    r="4"
                    fill="#22c55e"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts Section (partially visible) */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900">Low Stock Alerts</h3>
        </div>
      </div>
    </div>
  );

  const InventoryListMockup = () => (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-lg h-full">
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <List className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-white border-2 border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50">
            <Scan className="w-4 h-4" />
            Scan
          </button>
          <button className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Manual
          </button>
          <button className="bg-white border-2 border-gray-300 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="bg-white border-2 border-gray-300 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <button className="bg-white border-2 border-gray-300 p-2 rounded-lg text-gray-700 hover:bg-gray-50">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Pagination - Centered */}
        <div className="flex items-center justify-center gap-2">
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-medium">1</button>
          <button className="px-4 py-1.5 bg-white border-2 border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50">2</button>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product List */}
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-4 hover:bg-gray-50">
              {/* Checkbox */}
              <input type="checkbox" className="w-4 h-4" />

              {/* Product Image Placeholder */}
              <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center flex-shrink-0">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 mb-1">Example Product</div>
                <div className="text-xs text-gray-500 mb-1">This is a description</div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>10 in stock</span>
                  <span className="text-gray-400">•</span>
                  <span>General</span>
                </div>
              </div>

              {/* More Options */}
              <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


  const MobileScannerMockup = () => (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-lg h-full">
      <div className="space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Barcode Scanner</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Feed Area */}
        <div className="relative bg-gray-900 rounded-lg p-6 aspect-[4/4] flex items-center justify-center">
          {/* Dashed blue border outline */}
          <div className="absolute inset-2 border-2 border-blue-500 rounded-lg border-dashed"></div>
          
          {/* Scanning line - solid blue horizontal line in center */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1 bg-blue-500"></div>
          
          {/* Camera OK badge in top right */}
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Camera OK
          </div>
        </div>

        {/* Stop Camera Button */}
        <button className="w-full bg-white border-2 border-gray-300 rounded-lg px-4 py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <X className="w-5 h-5 text-gray-700" />
          <span className="text-gray-700 font-medium">Stop Camera</span>
        </button>

        {/* Information Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">How does it work?</h4>
          </div>
          <ul className="space-y-1.5 text-sm text-gray-700 ml-7">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Start the camera and point it at a barcode</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Hold the camera still for better detection</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Or enter the barcode manually</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span className="text-xs text-gray-600">Supported formats: EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="inline-block mb-4 sm:mb-6">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
              Platform Preview
            </span>
          </div>
          <h2 className="max-w-3xl mx-auto text-balance text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none font-bold">
            Know What To Expect.
          </h2>
          <p className="text-md pt-4 text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
            Get a visual preview of StockFlow's interface and features before you sign up
          </p>
        </div>

        {/* Screenshots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </div>
            <DashboardMockup />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Package className="w-4 h-4" />
              Inventory List
            </div>
            <InventoryListMockup />
          </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Scan className="w-4 h-4" />
              Mobile Scanner
            </div>
            <MobileScannerMockup />
          </motion.div>
        </div>

        {/* Video Demo Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
 

          </div>
          
          <Card className="overflow-hidden">
            <CardContent className="p-0 relative">
              <div className="relative aspect-video bg-gray-900 group">
                <video
                  ref={videoRef}
                  src="/intro_vid.mp4"
                  className="w-full h-full object-cover relative z-0"
                  muted
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onLoadedMetadata={() => {
                    // Auto-play when loaded (muted for browser compatibility)
                    if (videoRef.current) {
                      videoRef.current.play().catch(() => {
                        // Autoplay may be blocked, that's okay
                      });
                    }
                  }}
                />
                
                {/* Video Controls Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors z-[100] pointer-events-none">
                  <button
                    onClick={handlePlayPause}
                    className="rounded-full w-20 h-20 bg-white hover:bg-gray-100 text-gray-900 shadow-2xl pointer-events-auto z-[101] flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? (
                      <Pause className="w-10 h-10 text-gray-900" />
                    ) : (
                      <Play className="w-10 h-10 text-gray-900 ml-1" />
                    )}
                  </button>
                </div>

                {/* Fullscreen Button */}
                <Button
                  onClick={handleFullscreen}
                  size="sm"
                  variant="ghost"
                  className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Video duration: ~45 seconds
          </p>
        </div>
      </div>
    </section>
  );
};


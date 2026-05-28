import React, { useState } from 'react';
import {
  Smartphone, Wifi, Home, RefreshCw, ChevronDown, ChevronUp,
  Bell, Package, MoreVertical, ArrowUp, Search,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

/* ─── Shared mockup primitives ─────────────────────────────────── */

const MockupShell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`mt-3 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 select-none ${className}`}>
    {children}
  </div>
);

const SkeletonLine = ({ w = 'w-3/4', dim = false }: { w?: string; dim?: boolean }) => (
  <div className={`h-1.5 rounded-full ${dim ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gray-200 dark:bg-gray-700'} ${w}`} />
);

const TapRing = () => (
  <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-50 pointer-events-none" />
);

/* ─── iOS Mockups ───────────────────────────────────────────────── */

/* Safari compass icon — SVG recreation of the real icon */
function SafariIcon({ size = 40 }: { size?: number }) {
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angle = (i * 6 * Math.PI) / 180;
    const major = i % 5 === 0;
    const outerR = 44;
    const innerR = major ? 38 : 41;
    return {
      x1: 50 + outerR * Math.sin(angle), y1: 50 - outerR * Math.cos(angle),
      x2: 50 + innerR * Math.sin(angle), y2: 50 - innerR * Math.cos(angle),
      major,
    };
  });
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="sfBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4fc3f7" />
          <stop offset="100%" stopColor="#1565c0" />
        </linearGradient>
      </defs>
      {/* App icon background */}
      <rect width="100" height="100" rx="22" fill="url(#sfBg)" />
      {/* Outer ring */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      {/* Tick marks */}
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke="rgba(255,255,255,0.85)" strokeWidth={t.major ? 2 : 1} strokeLinecap="round" />
      ))}
      {/* White needle (N — upper-right) */}
      <polygon points="50,12 54,50 50,88 46,50" fill="white"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
        transform="rotate(40 50 50)" />
      {/* Red needle (S — lower-left) */}
      <polygon points="50,12 54,50 50,88 46,50" fill="#e53935"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
        transform="rotate(220 50 50)" />
      {/* Centre pin */}
      <circle cx="50" cy="50" r="4" fill="white" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
    </svg>
  );
}

const IosSafariDock = () => {
  const appIcons: Array<{ bg: string; label: string }> = [
    { bg: 'bg-yellow-400',  label: 'Weather'   },
    { bg: 'bg-gray-600',    label: 'Clock'     },
    { bg: 'bg-green-500',   label: 'Maps'      },
    { bg: 'bg-red-400',     label: 'Videos'    },
    { bg: 'bg-yellow-100',  label: 'Notes'     },
    { bg: 'bg-red-500',     label: 'Reminders' },
    { bg: 'bg-green-600',   label: 'Stocks'    },
    { bg: 'bg-blue-400',    label: 'Mail'      },
    { bg: 'bg-orange-700',  label: 'News'      },
    { bg: 'bg-pink-500',    label: 'Music'     },
    { bg: 'bg-blue-500',    label: 'App Store' },
    { bg: 'bg-red-500',     label: 'Health'    },
  ];
  const dockIcons = [
    { bg: 'bg-green-500',  label: 'Phone' },
    { bg: 'bg-blue-600',   label: 'Mail'  },
    { bg: 'bg-purple-500', label: 'Music' },
  ];
  return (
    <div className="mt-3 flex justify-center select-none">
      {/* Phone outer shell */}
      <div className="relative" style={{ width: 220 }}>
        {/* Phone body */}
        <div
          className="relative rounded-[36px] bg-gray-900 shadow-2xl overflow-hidden"
          style={{
            padding: '10px',
            boxShadow: '0 0 0 1px #333, 0 0 0 3px #1a1a1a, 0 24px 48px rgba(0,0,0,0.5)',
          }}
        >
          {/* Side buttons (volume) */}
          <div className="absolute -left-[3px] top-20 w-[3px] h-8 bg-gray-700 rounded-l-sm" />
          <div className="absolute -left-[3px] top-32 w-[3px] h-8 bg-gray-700 rounded-l-sm" />
          {/* Power button */}
          <div className="absolute -right-[3px] top-24 w-[3px] h-12 bg-gray-700 rounded-r-sm" />

          {/* Screen */}
          <div className="rounded-[28px] overflow-hidden bg-gradient-to-b from-sky-300 via-blue-400 to-blue-600 relative" style={{ minHeight: 340 }}>
            {/* Status bar */}
            <div className="flex items-center justify-between px-5 pt-3 pb-1">
              <span className="text-white text-[10px] font-semibold">9:41</span>
              <div className="flex items-center gap-1">
                {/* Signal dots */}
                {[3,4,4,4].map((h,i) => (
                  <div key={i} className="w-1 bg-white rounded-sm" style={{ height: h * 2, opacity: i < 3 ? 1 : 0.4 }} />
                ))}
                {/* WiFi */}
                <svg viewBox="0 0 16 12" width="12" height="10" className="mx-0.5">
                  <path d="M8 10l1.5-1.5a2 2 0 00-3 0L8 10z" fill="white"/>
                  <path d="M8 7l3-3a5 5 0 00-6 0l3 3z" fill="white" opacity="0.8"/>
                  <path d="M8 4L12 0a9 9 0 00-8 0l4 4z" fill="white" opacity="0.5"/>
                </svg>
                {/* Battery */}
                <div className="flex items-center gap-0.5">
                  <div className="w-5 h-2.5 rounded-sm border border-white/80 relative p-px">
                    <div className="h-full w-[70%] bg-white rounded-[1px]" />
                  </div>
                  <div className="w-0.5 h-1.5 bg-white/60 rounded-r-sm" />
                </div>
              </div>
            </div>

            {/* Dynamic Island / notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full" />

            {/* App grid */}
            <div className="grid grid-cols-4 gap-x-3 gap-y-3 px-4 pt-2 mb-3">
              {appIcons.map(({ bg, label }) => (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <div className={`w-10 h-10 rounded-[14px] ${bg} shadow-sm`} />
                  <span className="text-white/90 text-[7px] font-medium text-center leading-tight drop-shadow">{label}</span>
                </div>
              ))}
            </div>

            {/* Page dots */}
            <div className="flex justify-center gap-1 mb-2">
              {[1,2,3].map((_, i) => (
                <div key={i} className={`rounded-full ${i === 0 ? 'w-1.5 h-1.5 bg-white' : 'w-1 h-1 bg-white/40'}`} />
              ))}
            </div>

            {/* Dock */}
            <div className="mx-3 mb-3 bg-white/25 backdrop-blur-md rounded-2xl px-2 py-2 flex items-end justify-around">
              {dockIcons.map(({ bg, label }) => (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <div className={`w-10 h-10 rounded-[14px] ${bg} shadow-sm`} />
                  <span className="text-white/70 text-[7px] font-medium">{label}</span>
                </div>
              ))}
              {/* Safari — highlighted */}
              <div className="flex flex-col items-center gap-0.5">
                <div className="relative">
                  <div className="absolute -inset-1.5 rounded-2xl bg-white/40 animate-pulse blur-sm" />
                  <div className="relative rounded-[14px] shadow-xl ring-2 ring-white/90">
                    <SafariIcon size={40} />
                  </div>
                </div>
                <span className="text-white text-[7px] font-bold drop-shadow">Safari</span>
              </div>
            </div>

            {/* Home indicator */}
            <div className="flex justify-center pb-2">
              <div className="w-20 h-1 bg-white/60 rounded-full" />
            </div>
          </div>
        </div>

        {/* Caption below phone */}
        <p className="text-center text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-3">
          Tap Safari to open
        </p>
      </div>
    </div>
  );
};

const IosBrowserNav = () => (
  <MockupShell>
    {/* Safari chrome */}
    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 py-2">
      <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-1.5 flex items-center gap-2 border border-gray-200 dark:border-gray-600">
        <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
        <span className="text-[10px] text-gray-500 dark:text-gray-300 font-mono flex-1">app.stockflowsystems.com</span>
        <div className="w-3 h-3 rounded-sm border border-gray-300 dark:border-gray-500 flex items-center justify-center">
          <span className="text-[7px] text-gray-400">↑↓</span>
        </div>
      </div>
    </div>
    {/* StockFlow page skeleton */}
    <div className="px-3 py-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
          <Package className="w-3 h-3 text-white" />
        </div>
        <SkeletonLine w="w-20" />
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[1,2,3].map(i => (
          <div key={i} className="h-8 rounded-lg bg-gray-100 dark:bg-gray-800" />
        ))}
      </div>
    </div>
  </MockupShell>
);

const PhoneScreenshot = ({ src, alt }: { src: string; alt: string }) => (
  <div className="mt-3 flex justify-center select-none">
    <div
      className="relative rounded-[36px] bg-gray-900 overflow-hidden"
      style={{
        width: 200,
        boxShadow: '0 0 0 1px #333, 0 0 0 3px #1a1a1a, 0 20px 40px rgba(0,0,0,0.45)',
        padding: 8,
      }}
    >
      {/* Side buttons */}
      <div className="absolute -left-[3px] top-16 w-[3px] h-7 bg-gray-700 rounded-l-sm" />
      <div className="absolute -left-[3px] top-28 w-[3px] h-7 bg-gray-700 rounded-l-sm" />
      <div className="absolute -right-[3px] top-20 w-[3px] h-10 bg-gray-700 rounded-r-sm" />
      {/* Screen area */}
      <div className="rounded-[28px] overflow-hidden bg-black relative">
        <img src={src} alt={alt} className="w-full block object-cover" draggable={false} />
      </div>
    </div>
  </div>
);

const IosSafariShareBar = () => (
  <PhoneScreenshot src="/ios-step-share.png" alt="Safari share button at the bottom of the browser" />
);


/* ─── Android Mockups ───────────────────────────────────────────── */

const AndroidAppDrawer = () => (
  <MockupShell>
    <div className="bg-gray-900 px-3 py-3">
      <div className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1.5 mb-3">
        <Search className="w-3 h-3 text-gray-400" />
        <span className="text-[10px] text-gray-400">Search apps</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {['bg-blue-500/60','bg-red-500/60','bg-yellow-500/60'].map((c,i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={`w-10 h-10 rounded-full ${c}`} />
            <span className="text-white/40 text-[7px]">App</span>
          </div>
        ))}
        {/* Chrome — highlighted */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative">
            <div className="absolute -inset-1.5 rounded-full bg-blue-400/30 animate-pulse" />
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white ring-2 ring-blue-400 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-yellow-400 to-green-500" />
              <div className="absolute inset-[4px] rounded-full bg-blue-600" />
              <div className="absolute inset-[7px] rounded-full bg-white" />
              <div className="absolute inset-[9px] rounded-full bg-blue-600" />
            </div>
          </div>
          <span className="text-white text-[7px] font-semibold">Chrome</span>
        </div>
      </div>
    </div>
    <div className="px-3 py-1.5 text-center text-[10px] text-blue-600 dark:text-blue-400 font-medium">Tap Chrome to open</div>
  </MockupShell>
);

const AndroidBrowserNav = () => (
  <MockupShell>
    <div className="bg-gray-100 dark:bg-gray-800 px-2 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
      <div className="flex-1 bg-white dark:bg-gray-700 rounded-full px-3 py-1.5 flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
        <span className="text-[10px] text-gray-500 dark:text-gray-300 font-mono">app.stockflowsystems.com</span>
      </div>
      <MoreVertical className="w-4 h-4 text-gray-500 flex-shrink-0" />
    </div>
    <div className="px-3 py-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
          <Package className="w-3 h-3 text-white" />
        </div>
        <SkeletonLine w="w-20" />
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[1,2,3].map(i => <div key={i} className="h-8 rounded-lg bg-gray-100 dark:bg-gray-800" />)}
      </div>
    </div>
  </MockupShell>
);

const AndroidThreeDotMenu = () => (
  <MockupShell>
    {/* Chrome top bar */}
    <div className="bg-gray-100 dark:bg-gray-800 px-2 py-2 flex items-center gap-2">
      <div className="flex-1 bg-white dark:bg-gray-700 rounded-full px-2 py-1 flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
        <span className="text-[9px] text-gray-500 font-mono">app.stockflowsystems.com</span>
      </div>
      {/* Three-dot — highlighted */}
      <div className="relative flex-shrink-0">
        <TapRing />
        <div className="relative w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-800/60 flex items-center justify-center ring-2 ring-blue-400">
          <MoreVertical className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
    {/* Content skeleton */}
    <div className="px-3 py-2 space-y-1.5">
      <SkeletonLine w="w-2/3" dim />
      <SkeletonLine w="w-1/2" dim />
    </div>
    <div className="px-3 py-1 text-[10px] text-blue-600 dark:text-blue-400 font-medium text-center">Tap ⋮ to open menu</div>
  </MockupShell>
);

const AndroidChromeMenu = () => (
  <MockupShell className="max-w-[240px]">
    {/* Chrome bar */}
    <div className="bg-gray-100 dark:bg-gray-800 px-2 py-1.5 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
      <div className="flex-1 bg-white dark:bg-gray-700 rounded-full px-2 py-1">
        <span className="text-[9px] text-gray-400 font-mono">app.stockflowsystems.com</span>
      </div>
      <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
    </div>
    {/* Dropdown menu */}
    <div className="divide-y divide-gray-100 dark:divide-gray-800">
      {['New tab', 'New incognito tab', 'Bookmarks', 'History'].map(label => (
        <div key={label} className="flex items-center gap-3 px-4 py-2">
          <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
          <span className="text-[10px] text-gray-500 dark:text-gray-400">{label}</span>
        </div>
      ))}
      {/* Highlighted */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/30">
        <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center flex-shrink-0">
          <Home className="w-2.5 h-2.5 text-white" />
        </div>
        <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300">Add to Home screen</span>
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
      </div>
    </div>
  </MockupShell>
);

const AndroidHomeScreen = () => (
  <MockupShell>
    <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 p-3">
      {/* Status bar */}
      <div className="flex justify-between px-1 mb-2">
        <span className="text-white/60 text-[8px]">9:41</span>
        <div className="flex gap-1 items-center">
          <div className="w-3 h-1.5 rounded-sm border border-white/40 relative">
            <div className="absolute inset-y-0 left-0 w-[70%] bg-white/40 rounded-sm" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {['bg-blue-500/60','bg-red-500/60','bg-yellow-500/60',
          'bg-green-500/60','bg-purple-500/60','bg-pink-500/60','bg-teal-500/60'].map((c,i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <div className={`w-10 h-10 rounded-2xl ${c}`} />
            <span className="text-white/30 text-[7px]">App</span>
          </div>
        ))}
        {/* StockFlow newly installed */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-blue-400/30 animate-pulse" />
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 flex items-center justify-center ring-2 ring-blue-300 shadow-xl">
              <Package className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="text-white text-[7px] font-semibold">StockFlow</span>
        </div>
      </div>
    </div>
    <div className="px-3 py-1.5 text-center text-[10px] text-blue-600 dark:text-blue-400 font-medium">
      Tap to launch as standalone app
    </div>
  </MockupShell>
);

/* ─── Step data ─────────────────────────────────────────────────── */

const iPhoneSteps = [
  {
    step: 1,
    title: 'Open Safari on your iPhone or iPad',
    description: "The install option only appears in Safari — it won't work in Chrome or other browsers on iOS.",
    mockup: <IosSafariDock />,
  },
  {
    step: 2,
    title: 'Navigate to our platform',
    description: "Go to your platform URL in the Safari address bar and make sure you're logged in.",
    mockup: <IosBrowserNav />,
  },
  {
    step: 3,
    title: 'Tap the Share button',
    description: 'At the bottom of the screen, tap the share icon — a box with an arrow pointing up.',
    mockup: <IosSafariShareBar />,
  },
  {
    step: 4,
    title: 'Tap "Add to Home Screen"',
    description: 'Scroll through the share menu and tap Add to Home Screen, then tap Add in the top right corner.',
  },
  {
    step: 5,
    title: 'Open from your home screen',
    description: 'The app icon appears on your home screen. Tap it to launch as a full-screen app — no browser bar.',
  },
];

const androidSteps = [
  {
    step: 1,
    title: 'Open Chrome on your Android device',
    description: 'Chrome gives the most reliable PWA installation experience on Android.',
    mockup: <AndroidAppDrawer />,
  },
  {
    step: 2,
    title: 'Navigate to our platform',
    description: "Open your platform URL in Chrome and log in to your account.",
    mockup: <AndroidBrowserNav />,
  },
  {
    step: 3,
    title: 'Look for the install banner or menu',
    description: 'Chrome may show an "Add to home screen" banner automatically. Otherwise, tap the three-dot menu.',
    mockup: <AndroidThreeDotMenu />,
  },
  {
    step: 4,
    title: 'Tap "Add to Home screen" or "Install app"',
    description: 'In the menu, tap Add to Home screen or Install app. Confirm by tapping Add or Install.',
    mockup: <AndroidChromeMenu />,
  },
  {
    step: 5,
    title: 'Launch from your home screen',
    description: 'The app icon is added to your home screen and app drawer. It runs in its own window like a native app.',
    mockup: <AndroidHomeScreen />,
  },
];

const faqItems = [
  {
    question: 'Is this a real app or just a shortcut?',
    answer: "It's a Progressive Web App — more than a shortcut. It installs like a native app, works offline, receives push notifications, and runs in its own window without any browser interface.",
  },
  {
    question: "Why isn't there an app in the App Store or Google Play?",
    answer: 'Building a PWA lets us ship improvements to all users instantly — no waiting for app store reviews or manual updates on your end. You always get the latest version automatically.',
  },
  {
    question: 'Will I get updates automatically?',
    answer: "Yes. Every time you open the app with an internet connection, you're automatically on the latest version — no manual updates required.",
  },
];

/* ─── Phone mockup for hero ─────────────────────────────────────── */

function PhoneMockup() {
  return (
    <div className="relative flex-shrink-0 select-none" aria-hidden>
      <div className="relative w-28 h-56 rounded-[22px] bg-gray-900 shadow-2xl ring-1 ring-white/10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-6 bg-gray-900 flex items-center justify-between px-3 z-10">
          <span className="text-white text-[7px] font-semibold">9:41</span>
          <div className="w-2.5 h-1.5 rounded-sm border border-white/60 relative">
            <div className="absolute inset-y-0 left-0 w-[70%] bg-white/60 rounded-sm" />
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-4 bg-gray-900 rounded-b-xl z-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400" />
        <div className="absolute inset-0 pt-8 px-2.5 pb-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center gap-0.5">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-800 via-blue-600 to-blue-500 shadow-lg ring-2 ring-white/50 flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-white text-[6px] font-medium">StockFlow</span>
            </div>
            {['bg-green-500','bg-red-500','bg-yellow-500','bg-purple-500','bg-pink-500','bg-teal-500','bg-orange-500'].map((c,i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className={`w-10 h-10 rounded-xl ${c} opacity-70`} />
                <span className="text-white/50 text-[6px]">App</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-2 left-2 right-2 h-12 rounded-2xl bg-white/20 flex items-center justify-around px-2">
          {['bg-green-400','bg-blue-400','bg-purple-400','bg-red-400'].map((c,i) => (
            <div key={i} className={`w-8 h-8 rounded-xl ${c} opacity-80`} />
          ))}
        </div>
        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-white/40" />
      </div>
      <div className="absolute inset-0 rounded-[22px] blur-xl bg-blue-500/20 -z-10 scale-110" />
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default function MobileAppPage() {
  const [activeTab, setActiveTab] = useState<'ios' | 'android'>('ios');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const steps = activeTab === 'ios' ? iPhoneSteps : androidSteps;

  return (
    <div className="space-y-6">

      {/* Hero — bleeds to the edges like help-center */}
      <div className="-mx-4 md:-mx-8 -mt-4 md:-mt-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 px-6 md:px-10 py-10 md:py-14 rounded-xl shadow-lg">
          <div className="flex items-center justify-between gap-6 max-w-3xl">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-medium px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                available on all devices
              </span>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">Get the app on your phone</h1>
                <p className="mt-3 text-blue-100 text-sm md:text-base max-w-md leading-relaxed">
                  Our platform works as a Progressive Web App (PWA) — no app store needed. Install directly from your browser in seconds.
                </p>
              </div>
            </div>
            <div className="hidden sm:block flex-shrink-0">
              <PhoneMockup />
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Wifi,      title: 'Works offline',     desc: 'Access your inventory even without a connection.',              color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/40',    iconColor: 'text-blue-600 dark:text-blue-400',   iconBg: 'bg-blue-100 dark:bg-blue-800/40'   },
          { icon: Home,      title: 'Home screen icon',  desc: 'Launches like a native app — no browser bar, no clutter.',     color: 'bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-800/40', iconColor: 'text-violet-600 dark:text-violet-400', iconBg: 'bg-violet-100 dark:bg-violet-800/40' },
          { icon: RefreshCw, title: 'Always up to date', desc: 'No manual updates — always on the latest version automatically.', color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/40', iconColor: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-800/40' },
        ].map(({ icon: Icon, title, desc, color, iconColor, iconBg }) => (
          <div key={title} className={`rounded-xl border p-5 space-y-3 ${color}`}>
            <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
              <Icon className={`w-4.5 h-4.5 ${iconColor}`} style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-1">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Install instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Install instructions</CardTitle>
          <CardDescription>Follow the steps below for your device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Platform tabs */}
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
            {([{ id: 'ios', label: 'iPhone / iPad' }, { id: 'android', label: 'Android' }] as const).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-300 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Timeline steps */}
          <div className="relative">
            <div className="absolute left-[15px] top-8 bottom-8 w-px bg-gradient-to-b from-blue-400 via-blue-300 to-gray-200 dark:from-blue-600 dark:via-blue-700 dark:to-gray-700" />
            <div className="space-y-1">
              {steps.map((item, idx) => (
                <div key={item.step} className="flex gap-5 py-4">
                  <div className="flex-shrink-0 relative z-10 mt-0.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ring-2 ring-white dark:ring-gray-900 ${
                      idx === 0
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700'
                    }`}>
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
          </div>

          {activeTab === 'ios' && (
            <img
              src="/pwa_ios.png"
              alt="iOS PWA installation steps"
              className="w-full mx-auto block rounded-lg"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}

          {activeTab === 'android' && (
            <img
              src="/pwa_android.png"
              alt="Android PWA installation steps"
              className="w-full mx-auto block rounded-lg"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}





          {/* Push notifications note */}
          <div className="flex gap-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 p-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center">
              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">Push notifications supported</p>
              <p className="text-sm text-blue-600 dark:text-blue-300 leading-relaxed mt-0.5">
                {activeTab === 'ios'
                  ? 'On iOS 16.4 and later, the PWA can send push notifications. Allow notifications when prompted after installing.'
                  : 'Android PWAs fully support push notifications and background sync. You may be asked to allow notifications on first launch.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Common questions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {faqItems.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{item.question}</span>
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${openFaq === i ? 'bg-blue-100 dark:bg-blue-800/40' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    {openFaq === i
                      ? <ChevronUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    }
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

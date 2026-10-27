import React from 'react';
import { Download, Sparkles, Phone, MapPin, Eye, FileText, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onDownloadAll: () => void;
  isDownloadingAll: boolean;
  downloadProgress: { current: number; total: number } | null;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  activeView: 'grid' | 'feed' | 'captions';
  onViewChange: (view: 'grid' | 'feed' | 'captions') => void;
  totalPosts: number;
}

export const Header: React.FC<HeaderProps> = ({
  onDownloadAll,
  isDownloadingAll,
  downloadProgress,
  activeFilter,
  onFilterChange,
  activeView,
  onViewChange,
  totalPosts,
}) => {
  const filterCategories = [
    { id: 'all', label: 'সবগুলো (১০টি পোস্ট)' },
    { id: 'residential', label: 'ফ্ল্যাট ও রেসিডেন্সিয়াল' },
    { id: 'land', label: 'জমি ও প্লট' },
    { id: 'investment', label: 'বিনিয়োগ ও রিটার্ন' },
    { id: 'guide', label: 'গাইডলাইন ও প্রসেস' },
    { id: 'legal', label: 'আইনি যাচাই' },
    { id: 'commercial', label: 'বাণিজ্যিক স্পেস' },
    { id: 'locations', label: 'ঢাকার লোকেশন' },
    { id: 'comparison', label: 'ভাড়া বনাম নিজের বাড়ি' },
    { id: 'trust', label: 'কেন বেস্ট আবাসন' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl transition-all">
      {/* Top Notification / Info Bar */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-emerald-950 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-sky-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-sky-400" />
              ১০টি ভিন্ন ক্যাটাগরির ফেসবুক পোস্ট রেডি (1080x1080 HD)
            </span>
            <span className="hidden md:inline-block text-slate-500">•</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <MapPin className="w-3 h-3 text-red-400" /> ঢাকা, বাংলাদেশ
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="tel:+8801714395378" 
              className="flex items-center gap-1.5 text-sky-300 hover:text-white font-medium bg-sky-950/60 hover:bg-sky-900/80 px-2.5 py-0.5 rounded-full border border-sky-800/50 transition-colors"
            >
              <Phone className="w-3 h-3 text-sky-400" />
              <span>+880 1714-395378</span>
            </a>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-emerald-400 font-medium hidden sm:flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> রিয়েল এস্টেট রেডি কন্টেন্ট
            </span>
          </div>
        </div>
      </div>

      {/* Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shadow-lg shadow-sky-500/20 border border-sky-400/30 flex-shrink-0">
              {/* Stylized Modern Best Abashon Logo Symbol */}
              <svg className="w-8 h-8 text-white" viewBox="0 0 40 40" fill="none">
                <path d="M6 32V20L20 8L34 20V32H24V22H16V32H6Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M20 13L27 19V30" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                <circle cx="20" cy="16" r="2.5" fill="#38bdf8" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-sky-400 via-sky-200 to-emerald-300 bg-clip-text text-transparent">
                  BEST ABASHON
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  FB Studio
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                <span>Real Estate & Property Services</span>
                <span className="text-slate-600">•</span>
                <span className="text-sky-400/90 italic">Building Trust, Creating Homes.</span>
              </p>
            </div>
          </div>

          {/* Action Tools & View Switcher */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => onViewChange('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeView === 'grid'
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>১০টি পোস্ট গ্রিড</span>
              </button>
              <button
                onClick={() => onViewChange('feed')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeView === 'feed'
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>ফেসবুক ফিড প্রিভিউ</span>
              </button>
              <button
                onClick={() => onViewChange('captions')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeView === 'captions'
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>ক্যাপশন লাইব্রেরি</span>
              </button>
            </div>

            {/* Batch ZIP Download Button */}
            <button
              onClick={onDownloadAll}
              disabled={isDownloadingAll}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg shadow-emerald-900/30 border border-emerald-500/30 transition-all transform active:scale-95 cursor-pointer"
            >
              <Download className={`w-4 h-4 ${isDownloadingAll ? 'animate-bounce' : ''}`} />
              <span>
                {isDownloadingAll
                  ? `ডাউনলোড হচ্ছে (${downloadProgress?.current || 0}/${downloadProgress?.total || 10})...`
                  : 'সবগুলো (১০টি) ইমেজ ডাউনলোড (ZIP)'}
              </span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        {activeView === 'grid' && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap mr-1 flex items-center gap-1">
              ফিল্টার:
            </span>
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onFilterChange(cat.id)}
                className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all font-medium border ${
                  activeFilter === cat.id
                    ? 'bg-sky-500/20 text-sky-300 border-sky-400/50 shadow-sm shadow-sky-500/20'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

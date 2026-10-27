import React, { useState } from 'react';
import { POSTS_DATA, PostItem } from './data/postsData';
import { Header } from './components/Header';
import { PostCard } from './components/PostCard';
import { PostDetailModal } from './components/PostDetailModal';
import { FacebookFeedSimulator } from './components/FacebookFeedSimulator';
import { CaptionLibraryModal } from './components/CaptionLibraryModal';
import { downloadAllPostsAsZip } from './utils/canvasRenderer';
import { 
  Sparkles, CheckCircle2, Download, ShieldCheck, 
  MapPin, Phone, Building2, Layers, Award, FileText, Check 
} from 'lucide-react';

export default function App() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeView, setActiveView] = useState<'grid' | 'feed' | 'captions'>('grid');
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ current: number; total: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active post for simulator
  const [simulatorPost, setSimulatorPost] = useState<PostItem>(POSTS_DATA[0]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Filter posts
  const filteredPosts = POSTS_DATA.filter((post) => {
    if (activeFilter === 'all') return true;
    return post.category === activeFilter;
  });

  const handleDownloadAll = async () => {
    if (isDownloadingAll) return;
    setIsDownloadingAll(true);
    setDownloadProgress({ current: 0, total: 10 });
    try {
      await downloadAllPostsAsZip(POSTS_DATA, (current, total) => {
        setDownloadProgress({ current, total });
      });
      showToast('সবগুলো ১০টি পোস্ট এবং ক্যাপশন টেক্সট সফলভাবে ডাউনলোড হয়েছে!');
    } catch (err) {
      console.error(err);
      showToast('ডাউনলোডে সমস্যা হয়েছে, দয়া করে পুনরায় চেষ্টা করুন।');
    } finally {
      setIsDownloadingAll(false);
      setDownloadProgress(null);
    }
  };

  const handleOpenFeed = (post: PostItem) => {
    setSimulatorPost(post);
    setActiveView('feed');
  };

  const handleCopyCaption = (post: PostItem) => {
    showToast(`পোস্ট #${post.numberStr}-এর ক্যাপশন সফলভাবে কপি করা হয়েছে!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Hind_Siliguri','Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-emerald-400/40 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <Check className="w-4 h-4 text-white" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        onDownloadAll={handleDownloadAll}
        isDownloadingAll={isDownloadingAll}
        downloadProgress={downloadProgress}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        activeView={activeView}
        onViewChange={setActiveView}
        totalPosts={POSTS_DATA.length}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Grid View */}
        {activeView === 'grid' && (
          <div className="space-y-8">
            {/* Hero / Studio Intro Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950/60 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-semibold uppercase tracking-wider mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    রিয়েল এস্টেট ফেসবুক মার্কেটিং কিট
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    Best Abashon: <span className="bg-gradient-to-r from-sky-400 via-sky-200 to-teal-300 bg-clip-text text-transparent">১০টি ভিন্ন টাইপের</span> ফেসবুক পোস্ট ইমেজ
                  </h2>

                  <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                    রিয়েল এস্টেট ব্যবসায় ফেসবুক পেজ রিচ ও সেলস বাড়াতে ১০টি সম্পূর্ণ ভিন্ন আঙ্গিকের গ্রাফিক্স ও বাংলা কপিরাইটিং। সরাসরি ১০৮০x১০৮০ পিক্সেলে ডাউনলোড করুন অথবা লাইভ এডিট করে ব্যবহার করুন।
                  </p>

                  {/* 4 Feature Badges */}
                  <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs flex items-center gap-2 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                      <span>১০৮০x১০৮০ HD কোয়ালিটি</span>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs flex items-center gap-2 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                      <span>১০টি ভিন্ন কনসেপ্ট</span>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs flex items-center gap-2 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <span>রেডি বাংলা ক্যাপশন</span>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs flex items-center gap-2 text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>১-ক্লিকে ZIP ডাউনলোড</span>
                    </div>
                  </div>
                </div>

                {/* Right Side Quick Actions Card */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl w-full lg:w-80 flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-semibold text-slate-400">অফিসিয়াল যোগাযোগ</span>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      সরাসরি প্রস্তুত
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-sky-400" />
                      <strong className="text-white">+880 1714-395378</strong>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span>ঢাকা, বাংলাদেশ</span>
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadAll}
                    disabled={isDownloadingAll}
                    className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
                  >
                    <Download className={`w-4 h-4 ${isDownloadingAll ? 'animate-bounce' : ''}`} />
                    <span>
                      {isDownloadingAll
                        ? `প্রস্তুত হচ্ছে (${downloadProgress?.current || 0}/${downloadProgress?.total || 10})...`
                        : 'সবগুলো (১০টি) পোস্ট জিপ (ZIP) ডাউনলোড'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Posts Grid (Responsive 1, 2, 3 cols) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>পোস্ট গ্যালারি</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-sky-400 border border-slate-700">
                    {filteredPosts.length} টি পোস্ট
                  </span>
                </h3>
                <span className="text-xs text-slate-400">
                  যেকোনো পোস্টের ওপর ক্লিক করে বিস্তারিত দেখুন ও ডাউনলোড করুন
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onOpenDetails={(p) => setSelectedPost(p)}
                    onOpenFeed={handleOpenFeed}
                    onCopyCaption={handleCopyCaption}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Facebook Feed Simulator View */}
        {activeView === 'feed' && (
          <FacebookFeedSimulator
            currentPost={simulatorPost}
            allPosts={POSTS_DATA}
            onSelectPost={(p) => setSimulatorPost(p)}
            onCopyCaption={handleCopyCaption}
          />
        )}

        {/* Captions Library View */}
        {activeView === 'captions' && (
          <CaptionLibraryModal
            onCopyCaption={handleCopyCaption}
            onSelectPost={(p) => {
              setSelectedPost(p);
              setActiveView('grid');
            }}
          />
        )}
      </main>

      {/* Post Detail & Customization Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          allPosts={POSTS_DATA}
          onClose={() => setSelectedPost(null)}
          onSelectPost={(p) => setSelectedPost(p)}
          onOpenFeed={(p) => {
            setSelectedPost(null);
            handleOpenFeed(p);
          }}
          onCopyCaption={handleCopyCaption}
        />
      )}

      {/* Footer */}
      <footer className="mt-12 bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold">
              BA
            </div>
            <div>
              <p className="font-bold text-white text-sm">BEST ABASHON</p>
              <p className="text-[11px] text-slate-400">Real Estate & Property Services • Building Trust, Creating Homes.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>হটলাইন: <strong className="text-sky-400">+880 1714-395378</strong></span>
            <span>•</span>
            <span>ঢাকা, বাংলাদেশ</span>
          </div>

          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} Best Abashon. Facebook Post Graphics & Marketing Suite.
          </p>
        </div>
      </footer>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { 
  X, Download, Copy, Check, ChevronLeft, ChevronRight, 
  Smartphone, Share2, Layers, MessageCircle, Phone, 
  MapPin, Edit3, Sparkles, CheckCircle2, Sliders, Info
} from 'lucide-react';
import { PostItem } from '../data/postsData';
import { renderPostToCanvas, downloadCanvas, copyCanvasToClipboard } from '../utils/canvasRenderer';

interface PostDetailModalProps {
  post: PostItem;
  allPosts: PostItem[];
  onClose: () => void;
  onSelectPost: (post: PostItem) => void;
  onOpenFeed: (post: PostItem) => void;
  onCopyCaption: (post: PostItem) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  allPosts,
  onClose,
  onSelectPost,
  onOpenFeed,
  onCopyCaption,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<'caption' | 'customize' | 'strategy'>('caption');
  const [format, setFormat] = useState<'square' | 'portrait'>('square');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Customizer state
  const [customPhone, setCustomPhone] = useState(post.phone);
  const [customLocation, setCustomLocation] = useState(post.location);
  const [customHeadline, setCustomHeadline] = useState(post.headline);

  // Re-sync with post when switched
  useEffect(() => {
    setCustomPhone(post.phone);
    setCustomLocation(post.location);
    setCustomHeadline(post.headline);
  }, [post]);

  // Render high-res canvas
  useEffect(() => {
    let active = true;
    async function updateCanvas() {
      try {
        const fullCanvas = await renderPostToCanvas(post, {
          size: 1080,
          format,
          customPhone,
          customLocation,
        });
        if (!active || !canvasRef.current) return;
        const target = canvasRef.current;
        target.width = fullCanvas.width;
        target.height = fullCanvas.height;
        const ctx = target.getContext('2d');
        if (ctx) {
          ctx.drawImage(fullCanvas, 0, 0);
        }
      } catch (err) {
        console.error('Canvas render error in modal:', err);
      }
    }
    updateCanvas();
    return () => {
      active = false;
    };
  }, [post, format, customPhone, customLocation]);

  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : allPosts[allPosts.length - 1];
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : allPosts[0];

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const fullCanvas = await renderPostToCanvas(post, {
        size: 1080,
        format,
        customPhone,
        customLocation,
      });
      const safeTitle = post.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      downloadCanvas(fullCanvas, `best_abashon_post_${post.numberStr}_${safeTitle}_1080x1080.png`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyImage = async () => {
    try {
      const fullCanvas = await renderPostToCanvas(post, {
        size: 1080,
        format,
        customPhone,
        customLocation,
      });
      const success = await copyCanvasToClipboard(fullCanvas);
      if (success) {
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyCaptionText = () => {
    const fullText = `${post.captionBn}\n\n${post.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
    onCopyCaption(post);
  };

  // WhatsApp click to chat
  const cleanPhone = customPhone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`হ্যালো Best Abashon, আমি ফেসবুক পোস্ট #${post.numberStr} ("${post.headline}") দেখে যোগাযোগ করছি।`)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 font-bold text-sm flex items-center justify-center border border-sky-500/40">
              #{post.numberStr}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                  {post.headline}
                </h2>
                <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-slate-700 text-sky-300 font-medium">
                  {post.categoryLabel.split('/')[0]}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                পোস্ট টাইপ: {post.titleEn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev / Next buttons */}
            <div className="flex items-center bg-slate-700/60 rounded-xl p-0.5 border border-slate-600">
              <button
                onClick={() => onSelectPost(prevPost)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"
                title="পূর্ববর্তী পোস্ট"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-400 px-2 font-mono">
                {currentIndex + 1} / {allPosts.length}
              </span>
              <button
                onClick={() => onSelectPost(nextPost)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"
                title="পরবর্তী পোস্ট"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Left Column: Canvas Preview (lg:col-span-6) */}
          <div className="lg:col-span-6 p-4 sm:p-6 bg-slate-950 flex flex-col items-center justify-center gap-4">
            {/* Format toggle (for posts 7-10) */}
            {post.id > 6 && (
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setFormat('square')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    format === 'square'
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  স্কয়ার ১:১ (১০৮০x১০৮০)
                </button>
                <button
                  onClick={() => setFormat('portrait')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    format === 'portrait'
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ফেসবুক পোর্ট্রেট ৩:৪ (১০৮০x১৪৪০)
                </button>
              </div>
            )}

            {/* Canvas Display */}
            <div className="relative max-w-md w-full aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Canvas Action Bar */}
            <div className="w-full max-w-md flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'ডাউনলোড হচ্ছে...' : '১০৮০x১০৮০ PNG ডাউনলোড'}</span>
              </button>

              <button
                onClick={handleCopyImage}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm py-2.5 px-3.5 rounded-xl border border-slate-700 transition-colors"
                title="ক্লিপবোর্ডে কপি করুন"
              >
                {copiedImage ? <Check className="w-4 h-4 text-emerald-400" /> : <Layers className="w-4 h-4" />}
                <span>{copiedImage ? 'কপাইড!' : 'ইমেজ কপি'}</span>
              </button>

              <button
                onClick={() => onOpenFeed(post)}
                className="flex items-center gap-1.5 bg-blue-700/80 hover:bg-blue-600 text-white text-xs sm:text-sm py-2.5 px-3.5 rounded-xl border border-blue-600 transition-colors"
                title="ফেসবুক ফিড সিমুলেটর"
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">ফিড প্রিভিউ</span>
              </button>
            </div>
          </div>

          {/* Right Column: Controls, Captions, Strategy (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col bg-slate-900">
            {/* Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-900/60 p-2 gap-1.5">
              <button
                onClick={() => setActiveTab('caption')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'caption'
                    ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>ফেসবুক ক্যাপশন</span>
              </button>
              <button
                onClick={() => setActiveTab('customize')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'customize'
                    ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>কাস্টমাইজ</span>
              </button>
              <button
                onClick={() => setActiveTab('strategy')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'strategy'
                    ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Info className="w-4 h-4" />
                <span>মার্কেটিং টিপস</span>
              </button>
            </div>

            {/* Tab 1: Facebook Caption Content */}
            {activeTab === 'caption' && (
              <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between gap-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> রেডি ফেসবুক পোস্ট টেক্সট
                    </span>
                    <button
                      onClick={handleCopyCaptionText}
                      className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs py-1.5 px-3 rounded-lg shadow-sm transition-all"
                    >
                      {copiedCaption ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCaption ? 'কপাইড!' : 'সম্পূর্ণ ক্যাপশন কপি'}</span>
                    </button>
                  </div>

                  {/* Caption Box */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-sans text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap select-text max-h-[320px] overflow-y-auto">
                    {post.captionBn}
                  </div>

                  {/* Hashtags list */}
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-1.5">
                      জনপ্রিয় রিয়েল এস্টেট হ্যাশট্যাগ:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {post.hashtags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-slate-800 hover:bg-slate-700 text-sky-300 px-2 py-0.5 rounded-md border border-slate-700 select-all cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* WhatsApp & Phone Quick Action */}
                <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm py-2 px-3 rounded-xl shadow-md transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp-এ সরাসরি মেসেজ</span>
                  </a>
                  <a
                    href={`tel:${customPhone}`}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm py-2 px-3 rounded-xl border border-slate-700 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-sky-400" />
                    <span>কল করুন</span>
                  </a>
                </div>
              </div>
            )}

            {/* Tab 2: Customizer */}
            {activeTab === 'customize' && (
              <div className="p-4 sm:p-6 flex-1 space-y-4 overflow-y-auto">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    পোস্ট ইনফরমেশন কাস্টমাইজ করুন
                  </h4>
                  <p className="text-xs text-slate-400">
                    ফোন নম্বর পরিবর্তন করলে স্বয়ংক্রিয়ভাবে লাইভ প্রিভিউতে আপডেট হবে।
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      হটলাইন / ফোন নম্বর
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={customPhone}
                        onChange={(e) => setCustomPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      ঠিকানা / লোকেশন
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={customLocation}
                        onChange={(e) => setCustomLocation(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      পোস্টের মূল স্লোগান / হেডলাইন
                    </label>
                    <input
                      type="text"
                      value={customHeadline}
                      onChange={(e) => setCustomHeadline(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-800/40 text-xs text-sky-200">
                    <p className="font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      সহজ এক্সপোর্ট সুবিধা:
                    </p>
                    <p className="mt-1 text-slate-300">
                      পরিবর্তন শেষে বাম পাশের "১০৮০x১০৮০ PNG ডাউনলোড" বাটনে ক্লিক করলেই আপনার আপডেট করা ইমেজ ডাউনলোড হয়ে যাবে।
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Marketing Strategy */}
            {activeTab === 'strategy' && (
              <div className="p-4 sm:p-6 flex-1 space-y-4 overflow-y-auto text-xs sm:text-sm text-slate-300">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-sky-400 flex items-center gap-1.5">
                    🎯 টার্গেট অডিয়েন্স (Target Audience)
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    {post.category === 'residential' && 'প্রবাসী বাংলাদেশি, ঢাকার কর্পোরেট চাকরিজীবী ও নতুন পরিবার যারা ৩ বা ৪ বেডরুমের রেডি ফ্ল্যাট খুঁজছেন।'}
                    {post.category === 'land' && 'দীর্ঘমেয়াদি বিনিয়োগকারী, ব্যবসায়ী এবং যারা পূর্বাচল, বসুন্ধরা বা কেরানীগঞ্জে নিরাপদ প্লট কিনতে চান।'}
                    {post.category === 'family' && 'পারিবারিক অভিভাবক যারা গেটেড কমিউনিটিতে শিশুদের জন্য নিরাপদ খেলার পরিবেশ ও সুইমিং পুল চান।'}
                    {post.category === 'investment' && 'উচ্চ সম্পদশালী ব্যক্তি ও প্রবাসী যারা বাৎসরিক ৮-১২% মূলধনী রিটার্ন চান।'}
                    {post.category === 'guide' && 'প্রথমবারের মতো প্রপার্টি ক্রেতা যারা জটিলতা ও দালালের ঝামেলা এড়িয়ে ধাপে ধাপে কিনতে চান।'}
                    {post.category === 'legal' && 'সচেতন ক্রেতা যারা পূর্বে প্রতারণার শিকার হয়েছেন বা লিগ্যাল ক্লিয়ারেন্স ছাড়া এক টাকাও দেন না।'}
                    {post.category === 'commercial' && 'শোরুম, রেস্টুরেন্ট, ব্যাংক ও স্টার্টআপ মালিক যারা প্রাইম রোডে স্পেস খুঁজছেন।'}
                    {post.category === 'locations' && 'লোকেশন-নির্দিষ্ট ক্রেতা যারা উত্তরা বা ধানমন্ডির বাইরে যেতে চান না।'}
                    {post.category === 'comparison' && 'ভাড়া বাসায় ক্লান্ত ভাড়াটিয়ারা যাদের মাসিক কিস্তি দেওয়ার সামর্থ্য আছে।'}
                    {post.category === 'trust' && 'যেকোনো ক্রেতা যারা Best Abashon এর ব্র্যান্ড ভ্যালু ও সততা জানতে চান।'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                    ⏰ ফেসবুক বুস্টিং ও পোস্ট করার সেরা সময়
                  </h4>
                  <p className="text-slate-300">
                    🕒 রাত ৮:০০ টা থেকে ১০:৩০ টা (সপ্তাহের কর্মদিবসে সর্বোচ্চ রিচ পাওয়া যায়)
                  </p>
                  <p className="text-slate-300">
                    🕒 শুক্রবার ও শনিবার সকাল ১০:০০ টা থেকে দুপুর ১:০০ টা (ফ্রি সময় পরিবার নিয়ে সাইট ভিজিটের প্ল্যান হয়)
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-sky-300 flex items-center gap-1.5">
                    💡 বুস্টিং কল-টু-অ্যাকশন (CTA)
                  </h4>
                  <p className="text-slate-300">
                    বুস্ট করার সময় "Send WhatsApp Message" বা "Call Now" বাটন যুক্ত করুন।
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

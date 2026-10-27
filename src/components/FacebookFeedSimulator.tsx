import React, { useEffect, useRef, useState } from 'react';
import { 
  ThumbsUp, MessageSquare, Share2, MoreHorizontal, Globe, 
  Smartphone, Monitor, ChevronLeft, ChevronRight, CheckCircle2,
  Download, MessageCircle, Phone, Copy, Check
} from 'lucide-react';
import { PostItem } from '../data/postsData';
import { renderPostToCanvas, downloadCanvas } from '../utils/canvasRenderer';

interface FacebookFeedSimulatorProps {
  currentPost: PostItem;
  allPosts: PostItem[];
  onSelectPost: (post: PostItem) => void;
  onCopyCaption: (post: PostItem) => void;
  onClose?: () => void;
}

export const FacebookFeedSimulator: React.FC<FacebookFeedSimulatorProps> = ({
  currentPost,
  allPosts,
  onSelectPost,
  onCopyCaption,
}) => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const [isExpanded, setIsExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(482);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let active = true;
    async function updateFeedImage() {
      try {
        const fullCanvas = await renderPostToCanvas(currentPost, { size: 800 });
        if (!active || !canvasRef.current) return;
        const target = canvasRef.current;
        target.width = fullCanvas.width;
        target.height = fullCanvas.height;
        const ctx = target.getContext('2d');
        if (ctx) {
          ctx.drawImage(fullCanvas, 0, 0);
        }
      } catch (err) {
        console.error(err);
      }
    }
    updateFeedImage();
    return () => {
      active = false;
    };
  }, [currentPost]);

  const currentIndex = allPosts.findIndex((p) => p.id === currentPost.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : allPosts[allPosts.length - 1];
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : allPosts[0];

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleCopyCaption = () => {
    const text = `${currentPost.captionBn}\n\n${currentPost.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
    onCopyCaption(currentPost);
  };

  const handleDownloadImage = async () => {
    const canvas = await renderPostToCanvas(currentPost, { size: 1080 });
    const safeTitle = currentPost.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    downloadCanvas(canvas, `facebook_feed_post_${currentPost.numberStr}_${safeTitle}.png`);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Top Controller Bar */}
      <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-2xl p-4 mb-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>📱 ফেসবুক লাইভ ফিড সিমুলেটর</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-300 border border-blue-500/30">
              Facebook Feed Preview
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ফেসবুকে পোস্ট করার পর মোবাইল বা ডেস্কটপ স্ক্রিনে আপনার বিজ্ঞাপনটি ঠিক কেমন দেখাবে তা পরীক্ষা করুন।
          </p>
        </div>

        {/* View Switchers & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Post Navigation */}
          <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-700 text-xs">
            <button
              onClick={() => onSelectPost(prevPost)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
              title="পূর্ববর্তী পোস্ট"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-slate-300">
              পোস্ট #{currentPost.numberStr} ({currentIndex + 1}/10)
            </span>
            <button
              onClick={() => onSelectPost(nextPost)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
              title="পরবর্তী পোস্ট"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Device Switcher */}
          <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-700 text-xs">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>মোবাইল</span>
            </button>
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>ডেস্কটপ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Post Selector Carousel / Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
        {allPosts.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectPost(p)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all border ${
              p.id === currentPost.id
                ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30 font-bold'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>#{p.numberStr}</span>
            <span>{p.titleBn.slice(0, 15)}...</span>
          </button>
        ))}
      </div>

      {/* Simulator Device Wrapper */}
      <div className="flex justify-center">
        <div
          className={`w-full transition-all duration-300 ${
            deviceMode === 'mobile'
              ? 'max-w-md bg-slate-950 p-3 sm:p-4 rounded-[40px] border-4 border-slate-700 shadow-2xl ring-1 ring-slate-800'
              : 'max-w-2xl bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-2xl'
          }`}
        >
          {/* Mobile Speaker / Notch */}
          {deviceMode === 'mobile' && (
            <div className="flex justify-center mb-3">
              <div className="w-20 h-4 bg-slate-800 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700"></div>
              </div>
            </div>
          )}

          {/* Facebook Post Mockup Container (White card like FB) */}
          <article className="bg-[#242526] text-[#E4E6EB] rounded-xl border border-[#3A3B3C] shadow-lg overflow-hidden font-sans">
            {/* Header: Page info */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {/* Best Abashon FB Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-md border border-sky-400/40 relative">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 40 40" fill="none">
                    <path d="M6 32V20L20 8L34 20V32H24V22H16V32H6Z" stroke="white" strokeWidth="2.5" />
                    <circle cx="20" cy="16" r="2.5" fill="#38bdf8" />
                  </svg>
                  {/* Active dot */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#242526] rounded-full"></span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-[#E4E6EB] hover:underline cursor-pointer">
                      Best Abashon - Real Estate & Property Services
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#B0B3B8]">
                    <span>Sponsored</span>
                    <span>•</span>
                    <Globe className="w-3 h-3" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#B0B3B8]">
                <button className="p-1.5 hover:bg-[#3A3B3C] rounded-full transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Post Text / Caption */}
            <div className="px-3.5 pb-3 text-xs sm:text-sm text-[#E4E6EB] leading-relaxed">
              <p className="whitespace-pre-line font-['Hind_Siliguri']">
                {isExpanded
                  ? currentPost.captionBn
                  : `${currentPost.captionBn.slice(0, 180)}...`}
              </p>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[#2D88FF] font-semibold text-xs mt-1 hover:underline cursor-pointer block"
              >
                {isExpanded ? 'See less' : 'See more'}
              </button>
            </div>

            {/* Post Image (Canvas) */}
            <div className="relative aspect-square w-full bg-black flex items-center justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Facebook Ad CTA Banner Bar */}
            <div className="bg-[#2E2F30] px-4 py-2.5 flex items-center justify-between border-t border-b border-[#3A3B3C]">
              <div>
                <span className="text-[11px] text-[#B0B3B8] uppercase tracking-wider block font-medium">
                  BESTABASHON.COM
                </span>
                <span className="font-semibold text-xs sm:text-sm text-[#E4E6EB] line-clamp-1">
                  {currentPost.headline}
                </span>
              </div>
              <a
                href={`https://wa.me/8801714395378?text=${encodeURIComponent(`ফেসবুক পোস্ট #${currentPost.numberStr} থেকে যোগাযোগ করছি`)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#3A3B3C] hover:bg-[#4E4F50] text-[#E4E6EB] font-semibold text-xs px-3.5 py-1.5 rounded-lg border border-[#4E4F50] transition-colors whitespace-nowrap"
              >
                Send WhatsApp
              </a>
            </div>

            {/* Engagement Counts */}
            <div className="px-3.5 py-2 flex items-center justify-between text-xs text-[#B0B3B8] border-b border-[#3A3B3C]">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px]">
                  👍
                </span>
                <span className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-white text-[10px]">
                  ❤️
                </span>
                <span>{likeCount}</span>
              </div>
              <div className="flex items-center gap-3">
                <span>54 comments</span>
                <span>•</span>
                <span>19 shares</span>
              </div>
            </div>

            {/* Like, Comment, Share Action Buttons */}
            <div className="px-2 py-1 flex items-center justify-between text-xs font-semibold text-[#B0B3B8]">
              <button
                onClick={handleLike}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 hover:bg-[#3A3B3C] rounded-lg transition-colors cursor-pointer ${
                  liked ? 'text-[#2D88FF]' : ''
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-[#2D88FF]' : ''}`} />
                <span>Like</span>
              </button>

              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 hover:bg-[#3A3B3C] rounded-lg transition-colors cursor-pointer">
                <MessageSquare className="w-4 h-4" />
                <span>Comment</span>
              </button>

              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 hover:bg-[#3A3B3C] rounded-lg transition-colors cursor-pointer">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </article>

          {/* Quick tools under simulator */}
          <div className="mt-4 flex items-center justify-between gap-2 px-1">
            <button
              onClick={handleCopyCaption}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 font-medium text-xs py-2 px-3 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCaption ? 'কপাইড!' : 'ক্যাপশন কপি করুন'}</span>
            </button>

            <button
              onClick={handleDownloadImage}
              className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs py-2 px-3.5 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ইমেজ ডাউনলোড (১০৮০x১০৮০)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

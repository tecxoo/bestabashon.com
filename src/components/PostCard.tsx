import React, { useEffect, useRef, useState } from 'react';
import { Download, Copy, Check, Eye, Smartphone, Share2, Layers, Sparkles } from 'lucide-react';
import { PostItem } from '../data/postsData';
import { renderPostToCanvas, downloadCanvas, copyCanvasToClipboard } from '../utils/canvasRenderer';

interface PostCardProps {
  post: PostItem;
  onOpenDetails: (post: PostItem) => void;
  onOpenFeed: (post: PostItem) => void;
  onCopyCaption: (post: PostItem) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onOpenDetails,
  onOpenFeed,
  onCopyCaption,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  useEffect(() => {
    let active = true;
    async function drawThumbnail() {
      try {
        const fullCanvas = await renderPostToCanvas(post, { size: 600 });
        if (!active || !canvasRef.current) return;
        const target = canvasRef.current;
        target.width = fullCanvas.width;
        target.height = fullCanvas.height;
        const ctx = target.getContext('2d');
        if (ctx) {
          ctx.drawImage(fullCanvas, 0, 0);
          setIsRendered(true);
        }
      } catch (err) {
        console.error('Error drawing thumbnail:', err);
      }
    }

    drawThumbnail();
    return () => {
      active = false;
    };
  }, [post]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      const fullCanvas = await renderPostToCanvas(post, { size: 1080 });
      const safeTitle = post.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      downloadCanvas(fullCanvas, `best_abashon_post_${post.numberStr}_${safeTitle}_1080x1080.png`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const fullCanvas = await renderPostToCanvas(post, { size: 1080 });
      const success = await copyCanvasToClipboard(fullCanvas);
      if (success) {
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div 
      onClick={() => onOpenDetails(post)}
      className="group relative bg-slate-800/70 hover:bg-slate-800/90 rounded-2xl border border-slate-700/80 hover:border-sky-500/50 shadow-lg hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Top Banner Tag */}
      <div className="p-3.5 pb-2 flex items-center justify-between gap-2 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-300 font-bold text-xs flex items-center justify-center border border-sky-500/40 shadow-sm">
            #{post.numberStr}
          </span>
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-slate-700/80 text-sky-200 border border-slate-600">
            {post.categoryLabel.split('/')[0]}
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          {post.titleEn}
        </span>
      </div>

      {/* Image Preview Canvas Container */}
      <div className="relative aspect-square w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {!isRendered && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-2">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">পোস্ট ইমেজ লোড হচ্ছে...</span>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
        />

        {/* Hover Quick Actions Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs py-2 px-3 rounded-xl shadow-lg transition-transform active:scale-95"
              title="1080x1080 হাই-রেস ইমেজ ডাউনলোড করুন"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'ডাউনলোড...' : 'ডাউনলোড'}</span>
            </button>

            <button
              onClick={handleCopyImage}
              className="flex items-center justify-center gap-1 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs py-2 px-3 rounded-xl border border-slate-600 transition-colors"
              title="ক্লিপবোর্ডে কপি করুন"
            >
              {copiedImage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Layers className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedImage ? 'কপাইড!' : 'ইমেজ কপি'}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenFeed(post);
              }}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white text-xs p-2 rounded-xl transition-colors"
              title="ফেসবুক ফিড সিমুলেটর"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Info & Caption Bar */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-sky-300 transition-colors line-clamp-1">
            {post.headline}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {post.tagline}
          </p>
        </div>

        {/* Feature Pills Preview */}
        <div className="flex flex-wrap gap-1.5">
          {post.features.slice(0, 3).map((feat, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-slate-900/80 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60"
            >
              {feat.title}
            </span>
          ))}
          {post.features.length > 3 && (
            <span className="text-[10px] bg-sky-950/60 text-sky-400 px-1.5 py-0.5 rounded-md border border-sky-800/40">
              +{post.features.length - 3}টি
            </span>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopyCaption(post);
            }}
            className="flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium py-1 px-2 rounded-lg hover:bg-sky-950/50 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>ক্যাপশন কপি</span>
          </button>

          <button
            onClick={() => onOpenDetails(post)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white font-medium py-1 px-2 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>বিস্তারিত ও এডিট</span>
          </button>
        </div>
      </div>
    </div>
  );
};

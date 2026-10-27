import React, { useState } from 'react';
import { Copy, Check, FileDown, Search, Hash, MessageCircle } from 'lucide-react';
import { PostItem, POSTS_DATA } from '../data/postsData';
import { saveAs } from 'file-saver';

interface CaptionLibraryModalProps {
  onCopyCaption: (post: PostItem) => void;
  onSelectPost: (post: PostItem) => void;
}

export const CaptionLibraryModal: React.FC<CaptionLibraryModalProps> = ({
  onCopyCaption,
  onSelectPost,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredPosts = POSTS_DATA.filter(
    (p) =>
      p.titleBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.captionBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (post: PostItem) => {
    const text = `${post.captionBn}\n\n${post.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
    onCopyCaption(post);
  };

  const handleDownloadAllCaptions = () => {
    let content = `BEST ABASHON - REAL ESTATE & PROPERTY SERVICES\n`;
    content += `১০টি ফেসবুক পোস্টের রেডি ক্যাপশন ও হ্যাশট্যাগ সংগ্রহ\n`;
    content += `হটলাইন: +880 1714-395378 | ঢাকা, বাংলাদেশ\n\n`;

    POSTS_DATA.forEach((post) => {
      content += `====================================================\n`;
      content += `পোস্ট #${post.numberStr}: ${post.titleBn} (${post.titleEn})\n`;
      content += `ক্যাটাগরি: ${post.categoryLabel}\n`;
      content += `====================================================\n`;
      content += post.captionBn + `\n\n`;
      content += `হ্যাশট্যাগ:\n` + post.hashtags.join(' ') + `\n\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'Best_Abashon_10_Facebook_Captions_Bangla.txt');
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* Top Banner */}
      <div className="bg-slate-800/80 backdrop-blur rounded-2xl p-5 border border-slate-700/80 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>📝 ফেসবুক ক্যাপশন ও হ্যাশট্যাগ লাইব্রেরি</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ১০টি রেডি ক্যাপশন
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            প্রতিটি পোস্টের জন্য হাই-কনভার্টিং বাংলা ক্যাপশন, কল-টু-অ্যাকশন এবং টার্গেটেড হ্যাশট্যাগ প্রস্তুত করা আছে।
          </p>
        </div>

        <button
          onClick={handleDownloadAllCaptions}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm py-2 px-4 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <FileDown className="w-4 h-4" />
          <span>সবগুলো ক্যাপশন টেক্সট ফাইল হিসেবে সেভ (.txt)</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="ক্যাপশন খুঁজুন (উদাঃ জমি, ফ্ল্যাট, বিনিয়োগ, আইনি)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Captions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-slate-800/70 rounded-2xl border border-slate-700 p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-md hover:border-slate-600 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-300 font-bold text-xs flex items-center justify-center border border-sky-500/40">
                    #{post.numberStr}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {post.titleBn}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium">
                  {post.categoryLabel.split('/')[0]}
                </span>
              </div>

              {/* Text Container */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-['Hind_Siliguri'] whitespace-pre-wrap max-h-56 overflow-y-auto select-text">
                {post.captionBn}
              </div>

              {/* Hashtags */}
              <div className="mt-2.5 flex flex-wrap gap-1">
                {post.hashtags.map((h, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-sky-950/60 text-sky-400 px-1.5 py-0.5 rounded border border-sky-800/40"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between gap-2">
              <button
                onClick={() => onSelectPost(post)}
                className="text-xs text-slate-400 hover:text-white font-medium py-1 px-2 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
              >
                ইমেজ ও এডিটর দেখুন ➔
              </button>

              <button
                onClick={() => handleCopy(post)}
                className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs py-1.5 px-3.5 rounded-xl shadow transition-all cursor-pointer"
              >
                {copiedId === post.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>কপাইড!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>ক্যাপশন কপি করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

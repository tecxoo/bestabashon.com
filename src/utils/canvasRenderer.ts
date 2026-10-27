import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { PostItem } from '../data/postsData';

const COLLAGE_IMAGE_URL = '/assets/aistudio/Best_Abashon_Real_Estate_Collage_f0e9e3ba.png';

let cachedCollageImg: HTMLImageElement | null = null;

export async function loadCollageImage(): Promise<HTMLImageElement> {
  if (cachedCollageImg && cachedCollageImg.complete) {
    return cachedCollageImg;
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = COLLAGE_IMAGE_URL;
    img.onload = () => {
      cachedCollageImg = img;
      resolve(img);
    };
    img.onerror = (err) => reject(err);
  });
}

export interface RenderOptions {
  size?: number; // default 1080
  customPhone?: string;
  customLocation?: string;
  customBrand?: string;
  format?: 'square' | 'portrait' | 'original';
}

/**
 * Extracts and enhances a single post image from the high-res 1254x1254 collage
 */
export async function renderPostToCanvas(
  post: PostItem,
  options: RenderOptions = {}
): Promise<HTMLCanvasElement> {
  const img = await loadCollageImage();
  const size = options.size || 1080;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Fine-tuned coordinates based on 1254x1254 collage
  // Row 1: y=0, height=418
  // Row 2: y=418, height=418
  // Row 3: y=836, height=418
  const crop = post.crop;

  if (post.id <= 6) {
    // 1 to 6 are square (418x418)
    canvas.width = size;
    canvas.height = size;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      img,
      crop.x,
      crop.y,
      crop.w,
      crop.h,
      0,
      0,
      size,
      size
    );
  } else {
    // Posts 7, 8, 9, 10 are vertical cards (313.5 x 418, ratio 3:4)
    if (options.format === 'portrait') {
      // 3:4 Facebook Portrait post (1080 x 1440)
      canvas.width = size;
      canvas.height = Math.round(size * (4 / 3));

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        img,
        crop.x,
        crop.y,
        crop.w,
        crop.h,
        0,
        0,
        canvas.width,
        canvas.height
      );
    } else {
      // Standard 1:1 Facebook Square (1080x1080)
      // Fit neatly with aesthetic background gradient or fill
      canvas.width = size;
      canvas.height = size;

      // Fill background matching Best Abashon theme
      const bgGrad = ctx.createLinearGradient(0, 0, size, size);
      bgGrad.addColorStop(0, '#0a192f');
      bgGrad.addColorStop(0.5, '#0d2538');
      bgGrad.addColorStop(1, '#071520');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, size, size);

      // Draw subtle modern geometric background accents
      ctx.fillStyle = 'rgba(0, 159, 227, 0.08)';
      ctx.beginPath();
      ctx.arc(size * 0.85, size * 0.15, size * 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Calculate fitted dimensions preserving 3:4 aspect ratio
      const cardHeight = size;
      const cardWidth = Math.round(cardHeight * (crop.w / crop.h));
      const offsetX = Math.round((size - cardWidth) / 2);

      // Draw drop shadow for the card
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 10;

      ctx.drawImage(
        img,
        crop.x,
        crop.y,
        crop.w,
        crop.h,
        offsetX,
        0,
        cardWidth,
        cardHeight
      );

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // Draw elegant branding sidebars if there are margins
      if (offsetX > 20) {
        // Left side badge
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.fillRect(0, 0, offsetX, size);
        ctx.fillRect(size - offsetX, 0, offsetX, size);

        // Best Abashon vertical text on left
        ctx.save();
        ctx.translate(offsetX / 2, size / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = 'rgba(0, 159, 227, 0.7)';
        ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '3px';
        ctx.fillText('BEST ABASHON', 0, 0);
        ctx.restore();

        // Phone on right
        ctx.save();
        ctx.translate(size - offsetX / 2, size / 2);
        ctx.rotate(Math.PI / 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('+880 1714-395378', 0, 0);
        ctx.restore();
      }
    }
  }

  // If user provided a customized phone or location, overlay modern contact bar
  if (options.customPhone && options.customPhone !== post.phone) {
    ctx.fillStyle = 'rgba(0, 159, 227, 0.95)';
    ctx.fillRect(size * 0.05, size * 0.91, size * 0.45, size * 0.06);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px "Plus Jakarta Sans", "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`📞 ${options.customPhone}`, size * 0.275, size * 0.95);
  }

  return canvas;
}

/**
 * Downloads a canvas as a PNG file
 */
export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  canvas.toBlob((blob) => {
    if (blob) {
      saveAs(blob, filename);
    }
  }, 'image/png');
}

/**
 * Copies canvas image to clipboard for quick paste
 */
export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return false;
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}

/**
 * Batch downloads all 10 Facebook posts inside a ZIP file
 */
export async function downloadAllPostsAsZip(
  posts: PostItem[],
  onProgress?: (index: number, total: number) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('best-abashon-10-facebook-posts');
  if (!folder) return;

  const total = posts.length;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    onProgress?.(i + 1, total);

    const canvas = await renderPostToCanvas(post, { size: 1080 });
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));

    if (blob) {
      const safeTitle = post.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      const filename = `post_${post.numberStr}_${safeTitle}_1080x1080.png`;
      folder.file(filename, blob);
    }
  }

  // Create Facebook captions txt file
  let captionsText = `========================================================\n`;
  captionsText += `BEST ABASHON - REAL ESTATE & PROPERTY SERVICES\n`;
  captionsText += `হটলাইন: +880 1714-395378 | ঢাকা, বাংলাদেশ\n`;
  captionsText += `১০টি ফেসবুক পোস্টের রেডি ক্যাপশন ও হ্যাশট্যাগ সমাহার\n`;
  captionsText += `========================================================\n\n`;

  posts.forEach((post) => {
    captionsText += `--------------------------------------------------------\n`;
    captionsText += `📌 পোস্ট #${post.numberStr}: ${post.titleBn} (${post.titleEn})\n`;
    captionsText += `ক্যাটাগরি: ${post.categoryLabel}\n`;
    captionsText += `ফাইল নেম: post_${post.numberStr}_${post.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_1080x1080.png\n`;
    captionsText += `--------------------------------------------------------\n`;
    captionsText += post.captionBn + `\n\n`;
    captionsText += `হ্যাশট্যাগ:\n` + post.hashtags.join(' ') + `\n\n\n`;
  });

  folder.file('Facebook_Ready_Captions_Bangla.txt', captionsText);

  // Generate ZIP
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'Best_Abashon_10_Facebook_Posts.zip');
}

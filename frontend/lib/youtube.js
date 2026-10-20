/**
 * YouTube and Video Media Helpers
 * Extracts video IDs, generates standard embed URLs, and gets high-resolution thumbnails.
 */

/**
 * Extracts a valid 11-character YouTube video ID from any format of YouTube URL:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - Raw 11-char ID
 */
export function getYoutubeVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // Standard regex matching various YouTube URL patterns
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/i
  );
  if (match && match[1]) {
    return match[1];
  }

  // Handle direct 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Converts any YouTube URL to an embeddable URL that can be loaded in an <iframe>
 * Without this, raw youtube.com/watch?v=... links will be blocked by YouTube with X-Frame-Options.
 */
export function getYoutubeEmbedUrl(url, autoplay = false) {
  if (!url || typeof url !== 'string') return '';
  const id = getYoutubeVideoId(url);
  if (id) {
    return `https://www.youtube.com/embed/${id}${autoplay ? '?autoplay=1&rel=0' : '?rel=0'}`;
  }
  return url;
}

/**
 * Returns the URL of the YouTube video thumbnail
 * Uses hqdefault (480x360) which is guaranteed to exist for all YouTube videos.
 */
export function getYoutubeThumbnail(url) {
  const id = getYoutubeVideoId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

/**
 * Determines whether a gallery/media item is a video
 */
export function isVideoItem(item) {
  if (!item) return false;
  if (item.mediaType === 'video') return true;

  const cat = (item.category || '').toLowerCase();
  if (cat === 'video' || cat === 'video footage' || cat.includes('video')) return true;

  const url = item.videoUrl || item.url || item.imageUrl || '';
  if (getYoutubeVideoId(url)) return true;
  if (/\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url)) return true;

  return Boolean(item.videoUrl && item.videoUrl.trim().length > 0);
}

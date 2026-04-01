export const getVideoThumbnail = (url: string | null): string | null => {
  if (!url) return null;
  
  if (url.includes('youtu.be') || url.includes('youtube.com')) {
    let videoId = '';
    if (url.includes('youtu.be')) {
      videoId = url.split('/').pop()?.split('?')[0] || '';
    } else if (url.includes('watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || '';
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0] || '';
    }
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
  }
  
  if (url.includes('vimeo.com')) {
    const vimeoId = url.split('vimeo.com/').pop()?.split('?')[0];
    if (vimeoId) {
      return `https://vumbnail.com/${vimeoId}.jpg`;
    }
  }
  return null;
};

export const getRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const pastDate = new Date(date);
  const diff = now.getTime() - pastDate.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export const escapeHtml = (str: string): string => {
  if (!str) return '';
  return str.replace(/[&<>]/g, (m) => {
    const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
    return map[m];
  });
};

export const getDomain = (url: string): string => {
  try {
    let u = url;
    if (!u.startsWith('http')) u = 'https://' + u;
    return new URL(u).hostname.replace('www.', '');
  } catch (e) {
    return 'link';
  }
};

export const getIconForUrl = (url: string): string => {
  const domain = getDomain(url).toLowerCase();
  if (domain.includes('youtube')) return '🎬';
  if (domain.includes('vimeo')) return '🎥';
  if (domain.includes('soundcloud')) return '🎵';
  if (domain.includes('instagram')) return '📸';
  if (domain.includes('spotify')) return '🎧';
  return '🔗';
};

export const renderMentionsInText = (text: string, onMentionClick: (username: string) => void): string => {
  return text.replace(/@(\w+)/g, (match, username) => {
    const escapedUsername = escapeHtml(username);
    return `<span class="mention" data-username="${escapedUsername}" onclick="event.stopPropagation(); window.handleMentionClick && window.handleMentionClick('${escapedUsername}');">@${escapedUsername}</span>`;
  });
};
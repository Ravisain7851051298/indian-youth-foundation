import api from '@/services/api';

export { api };
export const contentApi = api;

export function getContentImageUrl(path) {
  if (!path || typeof path !== 'string') return '';
  if (/^(?:https?:|blob:|data:|\/\/)/i.test(path)) return path;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const hostBase = apiBase.replace(/\/api\/?$/, '');
  return `${hostBase}${path.startsWith('/') ? '' : '/'}${path}`;
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function to combine class names with Tailwind merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting functions using Indonesian locale and Jakarta timezone
export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Jakarta'
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

export function formatDateShort(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Jakarta'
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Returns relative time string like "5 menit lalu"
export function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Baru saja';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} hari lalu`;

  return formatDateShort(dateString);
}

// Truncates text to max length and appends '...'
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substr(0, maxLength).trim() + '...';
}

// Converts string into URL-friendly slug
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with dashes
    .replace(/[^\w\-]+/g, '')   // Remove invalid chars
    .replace(/\-\-+/g, '-')     // Replace multiple dashes with one
    .replace(/^-+/, '')         // Trim dash from start
    .replace(/-+$/, '');        // Trim dash from end
}

// Capitalizes the first character of a string
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Capitalizes each word in a string
export function capitalizeWords(text: string): string {
  if (!text) return text;
  return text.split(' ').map(word => capitalize(word)).join(' ');
}

// Returns human-readable category label
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    akademik: 'Akademik',
    organisasi: 'Organisasi',
    kemahasiswaan: 'Kemahasiswaan',
    umum: 'Umum',
  };
  return labels[category] || capitalize(category);
}

// Returns Tailwind CSS color classes for categories
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    akademik: 'bg-blue-500 text-white',
    organisasi: 'bg-green-500 text-white',
    kemahasiswaan: 'bg-purple-500 text-white',
    umum: 'bg-gray-500 text-white',
  };
  return colors[category] || colors.umum;
}

// Validates URL string
export function isValidUrl(string: string): boolean {
  try {
    return Boolean(new URL(string));
  } catch {
    return false;
  }
}

// Validates email string format
export function validateEmail(email: string): boolean {
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


// Debounce utility to delay function calls
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Sanitizes HTML string by removing scripts and dangerous attributes
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

// Strips all HTML tags from a string
export function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').trim();
}

// Converts bytes into human readable size string
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Maps hex color to RGB object
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Generates a random color from a preset palette
export function generateRandomColor(): string {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Constants for defaults
export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_EXCERPT_LENGTH = 160;
export const DEBOUNCE_DELAY = 300;
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

'use client';
import React from 'react';
import { Loader2 } from 'lucide-react';

// =====================
// Props Definition
// =====================
export interface LoadingProps {
  message?: string;        // ✅ Pesan bisa ditampilkan (opsional)
  size?: 'sm' | 'md' | 'lg';
  fullscreen?: boolean;    // ✅ Jika true → overlay fullscreen
  variant?: 'default' | 'light' | 'dark'; // ✅ Warna loading
}

// =====================
// Component
// =====================
export function Loading({
  message = 'Memuat data...',
  size = 'md',
  fullscreen = false,
  variant = 'default',
}: LoadingProps) {
  const sizeClass =
    size === 'sm'
      ? 'w-4 h-4'
      : size === 'lg'
      ? 'w-10 h-10'
      : 'w-6 h-6';

  // ✅ Warna spinner berdasarkan varian
  const colorClass =
    variant === 'dark'
      ? 'text-gray-800'
      : variant === 'light'
      ? 'text-white'
      : 'text-primary-600';

  // ✅ Warna background jika fullscreen
  const bgOverlay =
    variant === 'dark'
      ? 'bg-white/60'
      : variant === 'light'
      ? 'bg-black/40'
      : 'bg-white/70 backdrop-blur-sm';

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullscreen
          ? `fixed inset-0 ${bgOverlay} z-50`
          : 'py-10 w-full mx-auto'
      }`}
    >
      <Loader2
        className={`animate-spin ${colorClass} ${sizeClass}`}
      />
      {message && (
        <p
          className={`mt-2 text-sm ${
            variant === 'light'
              ? 'text-gray-100'
              : variant === 'dark'
              ? 'text-gray-800'
              : 'text-gray-600'
          } font-medium`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

// =====================
// Eksport Default
// =====================
export default Loading;

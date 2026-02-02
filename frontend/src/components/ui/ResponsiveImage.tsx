'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ResponsiveImageProps {
  media: unknown;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'portrait';
  priority?: boolean;
  preferredSize?: 'thumbnail' | 'small' | 'medium' | 'large' | 'original';
}

export function ResponsiveImage({
  media,
  alt,
  className,
  aspectRatio = 'video',
  priority = false,
  preferredSize = 'medium'
}: ResponsiveImageProps) {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video', 
    wide: 'aspect-[21/9]',
    portrait: 'aspect-[3/4]',
  };

  const getOptimalImageUrl = (mediaObj: unknown): string => {
    if (!mediaObj || typeof mediaObj !== 'object') return '';
    
    const media = mediaObj as {
      url: string;
      formats?: Record<string, { url: string; width: number; height: number }>;
    };

    // Try to get preferred size from formats
    if (media.formats && typeof media.formats === 'object') {
      const preferredFormat = media.formats[preferredSize];
      if (preferredFormat?.url) {
        return preferredFormat.url.startsWith('http') 
          ? preferredFormat.url 
          : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${preferredFormat.url}`;
      }

      // Fallback to available formats
      const availableFormats = ['large', 'medium', 'small', 'thumbnail'];
      for (const format of availableFormats) {
        if (media.formats[format]?.url) {
          const url = media.formats[format].url;
          return url.startsWith('http') ? url : `https://victorious-animal-46b1eb6b21.strapiapp.com${url}`;
        }
      }
    }

    // Fallback to original URL
    if (media.url) {
      return media.url.startsWith('http') 
        ? media.url 
        : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${media.url}`;
    }

    return '';
  };

  const imageUrl = getOptimalImageUrl(media);

  if (!imageUrl) {
    return (
      <div className={cn(
        'relative w-full overflow-hidden bg-gray-100 flex items-center justify-center',
        aspectClasses[aspectRatio],
        className
      )}>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-sm text-gray-500">No Image</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'relative w-full overflow-hidden bg-gray-100',
      aspectClasses[aspectRatio],
      className
    )}>
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/images/placeholder.jpg';
        }}
      />
    </div>
  );
}

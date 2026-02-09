'use client';

import { cn } from '@/lib/utils';
import { ReactNode, MouseEvent, KeyboardEvent } from 'react';
import Image from 'next/image';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  hover?: boolean;
  loading?: boolean;
}

export function Card({ 
  children, 
  className, 
  onClick, 
  hover = false, 
  loading = false 
}: CardProps) {

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e as unknown as MouseEvent<HTMLDivElement>);
    }
  };

  // Jika tidak ada onClick, render sebagai div biasa tanpa ARIA
  if (!onClick) {
    return (
      <div 
        className={cn(
          'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300',
          hover && 'hover:shadow-lg hover:-translate-y-1',
          loading && 'animate-pulse',
          className
        )}
      >
        {children}
      </div>
    );
  }


  // Jika ada onClick, render dengan proper ARIA
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300',
        hover && 'hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        loading && 'animate-pulse',
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-disabled={loading ? true : undefined}
    >
      {children}
    </div>
  );
}

export function CardHeader({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn('p-6 pb-4', className)}>
      {children}
    </div>
  );
}

export function CardContent({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn('px-6 pb-6', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn('px-6 py-4 bg-gray-50 border-t border-gray-200', className)}>
      {children}
    </div>
  );
}

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'portrait';
  priority?: boolean;
  sizes?: string;
}

export function CardImage({ 
  src, 
  alt, 
  className, 
  aspectRatio = 'video',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: CardImageProps) {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
    portrait: 'aspect-[3/4]',
  };

  return (
    <div className={cn(
      'relative w-full overflow-hidden bg-gray-100',
      aspectClasses[aspectRatio],
      className
    )}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={priority}
          sizes={sizes}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder.svg';
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm text-gray-500">No Image</span>
          </div>
        </div>
      )}
    </div>
  );
}


// Specialized Card Components
export function ContentCard({
  title,
  excerpt,
  image,
  author,
  date,
  category,
  featured = false,
  onClick,
  className
}: {
  title: string;
  excerpt?: string;
  image?: string;
  author?: string;
  date?: string;
  category?: string;
  featured?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Card hover onClick={onClick} className={cn('group', className)}>
      {image && (
        <CardImage
          src={image}
          alt={title}
          className="group-hover:scale-105 transition-transform duration-300"
        />
      )}
      <CardContent className={image ? 'pt-4' : 'pt-6'}>
        <div className="flex items-center gap-2 mb-3">
          {featured && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Featured
            </span>
          )}
          {category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {category}
            </span>
          )}
          {date && !featured && !category && (
            <span className="text-xs text-gray-500">{date}</span>
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>
        
        {excerpt && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">
            {excerpt}
          </p>
        )}
        
        {(author || date) && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            {author && <span>By {author}</span>}
            {date && (featured || category) && <span>{date}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function StaffCard({
  name,
  position,
  department,
  photo,
  email,
  onClick,
  className
}: {
  name: string;
  position: string;
  department?: string;
  photo?: string;
  email?: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Card hover onClick={onClick} className={cn('text-center', className)}>
      <CardContent className="pt-6">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
          {photo ? (
            <Image
              src={photo}
              alt={name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary-100 to-primary-200">
              <span className="text-primary-600 font-semibold text-xl">
                {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
          )}
        </div>
        
        <h3 className="font-semibold text-sm line-clamp-1 mb-1">
          {name}
        </h3>
        <p className="text-primary-600 text-xs font-medium line-clamp-1 mb-1">
          {position}
        </p>
        {department && (
          <p className="text-gray-500 text-xs line-clamp-1 mb-2">
            {department}
          </p>
        )}
        {email && (
          <p className="text-gray-500 text-xs line-clamp-1">
            {email}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
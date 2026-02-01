'use client'

import { Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SearchInput } from '@/components/ui/SearchInput'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/berita/search?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Desktop Layout */}
        <div className="flex items-center justify-between md:justify-start md:gap-8">
          {/* Logo & Brand - FIXED Path */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Logo SENAT"
                fill
                className="object-contain"
                priority
                sizes="40px"
              />
            </div>
            <div className="hidden sm:flex flex-col gap-0">
              <span className="text-sm font-bold text-gray-900">SENAT MAHASISWA</span>
              <span className="text-xs text-gray-600">IAI PERSATUAN ISLAM GARUT</span>
            </div>
          </Link>

          {/* Desktop Navigation - FIXED className */}
          <nav className="hidden md:flex items-center gap-6 ml-auto pr-26">
            <Link href="/" className="text-gray-900 text-sm font-medium hover:text-green-600 transition-colors">
              Beranda
            </Link>
            <Link href="/berita" className="text-gray-900 text-sm font-medium hover:text-green-600 transition-colors">
              Berita
            </Link>
            <Link href="/tentang" className="text-gray-900 text-sm font-medium hover:text-green-600 transition-colors">
              Tentang
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden ml-auto p-2 text-gray-900"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="px-3 py-2 text-gray-900 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/tentang"
                className="px-3 py-2 text-gray-900 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Tentang
              </Link>
              
              <Link
                href="/berita"
                className="px-3 py-2 text-gray-900 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Berita
              </Link>
            </nav>
          </div>
        )}      
        </div>
    </header>
  )
}

'use client'

import { Facebook, Instagram, Globe, Mail } from 'lucide-react'
import Link from 'next/link'

export function FooterSection() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              HIMA IAI Persatuan Islam
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Senat Mahasiswa Institut Agama Islam Persatuan Islam Garut
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Jl. Raya Garut - Tasikmalaya, Garut, Jawa Barat
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              Link Cepat
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-white transition-colors">
                  Berita
                </Link>
              </li>
              <li>
                <Link href="/artikel" className="hover:text-white transition-colors">
                  Artikel
                </Link>
              </li>
              <li>
                <Link href="/pengumuman" className="hover:text-white transition-colors">
                  Pengumuman
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              Hubungi Kami
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@himaiaipi.ac.id" className="hover:text-white transition-colors">
                  info@himaiaipi.ac.id
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <a href="https://himaiaipi.ac.id" className="hover:text-white transition-colors">
                  himaiaipi.ac.id
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} HIMA IAI Persatuan Islam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
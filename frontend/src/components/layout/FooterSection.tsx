'use client'

import { Facebook, Instagram, Globe } from 'lucide-react'
import Link from 'next/link'

export function FooterSection() {
  return (
    <footer className="mt-20 bg-gray-900 text-gray-300 py-12 px-6 rounded-t-3xl">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-xl font-semibold text-white mb-3">Senat Mahasiswa IAIPI Garut</h4>
          <p className="text-sm text-gray-400">
            Himpunan Mahasiswa Institut Agama Islam Publik Indonesia.
            <br />
            Jl. KH. Ahmad Yani No. 15, Bandung.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-white mb-3">Navigasi</h4>
          <ul className="space-y-2">
            <li><Link href="/berita" className="hover:text-white">Berita</Link></li>
            <li><Link href="/artikel" className="hover:text-white">Artikel</Link></li>
            <li><Link href="/staff" className="hover:text-white">Staff</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-white mb-3">Ikuti Kami</h4>
          <div className="flex gap-3">
            <a href="https://facebook.com" className="hover:text-white"><Facebook /></a>
            <a href="https://instagram.com" className="hover:text-white"><Instagram /></a>
            <a href="https://hima-iaipi.id" className="hover:text-white"><Globe /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Senat Mahasiswa IAI Persatuan Islam Garut. All rights reserved.
      </div>
    </footer>
  )
}

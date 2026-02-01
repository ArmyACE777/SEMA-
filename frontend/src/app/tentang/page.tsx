'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FileText, Mail, Phone, MapPin, Download, ExternalLink, Book, Heart, Target, Users } from 'lucide-react'

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50 to-gray-50">
      {/* ============ HEADER ============ */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center gap-2 transition-colors">
            ← Kembali Beranda
          </Link>
        </div>
      </div>

      {/* ============ HERO SECTION ============ */}
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Content dengan Logo */}
            <div className="flex items-start gap-6 md:gap-16 mt-0 mb-0">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-lg shadow-lg overflow-hidden flex items-center justify-center p-1 md:mt-4">
                <Image
                  src="/images/logo-sema.png"
                  alt="Senat Mahasiswa IAIPI"
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Book className="w-6 h-6" />
                <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-semibold backdrop-blur">
                  Tentang Kami
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                Senat Mahasiswa IAIPI
              </h1>
              <p className="text-xl text-green-100">
                Himpunan Mahasiswa Istituto Agama Islam Persatuan Islam Garut
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ MAIN CONTENT ============ */}
      <div className="container mx-auto px-4 py-16">
        {/* ========== SECTION 1: VISI MISI ========== */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          </div>
        </section>

        {/* ========== SECTION 2: ATURAN DAN TATA TERTIB ========== */}
        <section className="mb-20">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Aturan & Tata Tertib</h2>
            <p className="text-gray-600 text-lg">
              Panduan dan peraturan yang mengatur jalannya organisasi Senat Mahasiswa IAIPI
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <div className="space-y-6">
              {/* Anggaran Dasar */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-start gap-4 mb-3">
                  <FileText className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Anggaran Dasar</h3>
                    <p className="text-gray-600 mb-4">
                      Dokumen dasar yang memuat ketentuan fundamental organisasi Senat Mahasiswa IAIPI, termasuk struktur, hak, dan kewajiban anggota.
                    </p>
                    <a
                      href="https://drive.google.com/file/d/AD_GANTI_LINK_ANGGARAN_DASAR/view"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Unduh Dokumen Lengkap
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Anggaran Rumah Tangga */}
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-start gap-4 mb-3">
                  <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Anggaran Rumah Tangga</h3>
                    <p className="text-gray-600 mb-4">
                      Peraturan pelaksanaan dari anggaran dasar yang merinci mekanisme operasional, prosedur, dan tata cara penyelenggaraan organisasi.
                    </p>
                    <a
                      href="https://drive.google.com/file/d/ART_GANTI_LINK_ANGGARAN_RUMAH_TANGGA/view"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Unduh Dokumen Lengkap
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Tata Tertib */}
              <div>
                <div className="flex items-start gap-4">
                  <FileText className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Tata Tertib</h3>
                    <p className="text-gray-600 mb-4">
                      Norma, standar etika, dan pedoman perilaku yang harus dipatuhi oleh seluruh anggota organisasi dalam menjalankan fungsi dan aktivitas mereka.
                    </p>
                    <a
                      href="https://drive.google.com/file/d/TT_GANTI_LINK_TATA_TERTIB/view"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Unduh Dokumen Lengkap
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex gap-4">
              <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Akses Dokumen Lengkap</h4>
                <p className="text-gray-600 mb-4">
                  Untuk melihat semua dokumen regulasi dan versi terbaru, silakan kunjungi folder Google Drive Senat Mahasiswa IAIPI
                </p>
                <a
                  href="https://drive.google.com/drive/folders/GANTI_FOLDER_ID"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Buka Folder Drive
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========== SECTION 3: INFORMASI ORGANISASI ========== */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Informasi Organisasi</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-8">
              <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Struktur Organisasi</h3>
              <p className="text-gray-600 mb-6">
                Mengenal lebih dekat struktur dan peran setiap divisi dalam organisasi kami
              </p>
              <Link href="#" className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center gap-2">
                Lihat Detail
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-8">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Program Kerja</h3>
              <p className="text-gray-600 mb-6">
                Kumpulan program dan kegiatan yang telah dan akan dilaksanakan organisasi
              </p>
              <Link href="#" className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-2">
                Lihat Detail
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-8">
              <div className="w-14 h-14 bg-amber-600 rounded-lg flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Nilai-Nilai Kami</h3>
              <p className="text-gray-600 mb-6">
                Prinsip dan nilai-nilai yang menjadi fondasi organisasi kami
              </p>
              <Link href="#" className="text-amber-600 hover:text-amber-700 font-semibold inline-flex items-center gap-2">
                Lihat Detail
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========== SECTION 4: KONTAK ========== */}
        <section>
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Hubungi Kami</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h3>
              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Anda
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pesan
                  </label>
                  <textarea
                    placeholder="Tulis pesan Anda di sini..."
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Phone */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Telepon</h4>
                    <p className="text-gray-600">+62 812-3456-7890</p>
                    <p className="text-gray-500 text-sm mt-1">Senin - Jumat, 09:00 - 17:00</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">senat@iaipi.ac.id</p>
                    <p className="text-gray-500 text-sm mt-1">Kami akan membalas dalam 24 jam</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Lokasi</h4>
                    <p className="text-gray-600">Jl. Pendidikan No. 123</p>
                    <p className="text-gray-600">Garut, Jawa Barat 44151</p>
                  </div>
                </div>
              </div>

              {/* Instagram */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Instagram</h4>
                    <p className="text-gray-600">@iaipi_senatmahasiswa</p>
                    <p className="text-gray-500 text-sm mt-1">Ikuti update dan berita terbaru</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

'use client'

import Image from 'next/image' 
import Link from 'next/link' 
import { ArrowLeft, Users, Mail } from 'lucide-react'
interface OrganisasiDetail {
  slug: string
  nama: string
  logo?: string
  fullName: string
  deskripsi: string
  judul: string
  subjudul: string[]
  anggota: number
  program: string[]
  kontak: {
    email: string
    phone: string
    lokasi: string
  }
  color: string
  bgColor: string
  textColor: string
}

const organisasiDetails: Record<string, OrganisasiDetail> = {
  kebma: {
    slug: 'kebma',
    nama: 'KEBMA',
    logo: '/images/Kebma.jpeg',
    fullName: 'Keluarga Besar Mahasiswa',
    deskripsi: 'Organisasi tertinggi tingkat mahasiswa yang bertanggung jawab untuk mewakili aspirasi seluruh mahasiswa.',
    judul: 'Senat Mahasiswa (SEMA).',
    subjudul: [],
    anggota: 50,
    program: [],
    kontak: {
      email: 'sema@hima-iaipi.ac.id',
      phone: '+62 812-3456-7890',
      lokasi: 'Ruang SEMA, Gedung Mahasiswa Lt. 2',
    },
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
}

const logos = [
  '/images/Aksara.png',
  '/images/Dema.png',
  '/images/HM-PS_ekosy.png',
  '/images/hmps_pai.png',
  '/images/Ikatan_Olahraga.png',
  '/images/Ilmu_tafsir.jpeg',
  '/images/pai.png',
  '/images/Penjelajah_Hima.png',
  '/images/pgmi.png',
  '/images/Prodi_Ilha.jpeg',
  '/images/Prodi_Manajemen.png',
  '/images/protokoler.png',
  '/images/TREKATA.png',
  '/images/UKM_SHURULKHAN.png',
]

export default function OrganisasiDetailPage() {

const org = { 
  slug: 'kebma', 
  nama: 'KEBMA', 
  logo: '/images/Kebma.jpeg', 
  fullName: 'Keluarga Besar Mahasiswa', 
  deskripsi: 'Organisasi tertinggi tingkat mahasiswa...', 
  anggota: 50, kontak: { email: 'sema@hima-iaipi.ac.id', 
    phone: '+62 812-3456-7890', lokasi: 'Ruang SEMA, Gedung Mahasiswa Lt. 2', }, 
    color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600', }
    
  if (!org) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Organisasi Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-4">Maaf, organisasi yang Anda cari tidak tersedia.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============ HERO SECTION ============ */}
      <div className={`bg-gradient-to-r ${org.color} text-white py-20 px-4 relative`}>
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={20} />
            <span>Kembali</span>
          </Link>

          {/* Content dengan Logo */}
          <div className="flex items-start gap-8 mt-8">
            {/* Logo */}
            {org.logo && (
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-lg shadow-lg overflow-hidden flex items-center justify-center p-2">
                  <Image
                    src={org.logo}
                    alt={org.fullName}
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {/* Text Content */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{org.fullName}</h1>
              <p className="text-xl opacity-90">{org.deskripsi}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ MAIN CONTENT ============ */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Deskripsi Section */}
          <section className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
            <div className="space-y-6">
              {/* Paragraf 1 */}
              <p
                className="leading-8 text-gray-700"
                style={{
                  textAlign: 'justify',
                  textIndent: '2rem',
                  textJustify: 'auto',
                }}
              >
                Keluarga Besar Mahasiswa (KEBMA) Institut Agama Islam Persis Garut merupakan satu kesatuan utuh yang menjadi wadah aspirasi, 
                pengabdian, dan pengembangan potensi mahasiswa dalam bingkai nilai-nilai keislaman dan intelektualitas. 
                KEBMA hadir sebagai ruang kolaboratif yang menumbuhkan semangat ukhuwah, kepemimpinan, serta tanggung jawab sosial demi terwujudnya mahasiswa yang berintegritas dan berdaya saing.
                Di tingkat institusional, KEBMA dinaungi oleh Senat Mahasiswa (SEMA) sebagai lembaga legislatif mahasiswa yang berperan dalam perumusan kebijakan serta pengawasan jalannya organisasi kemahasiswaan.
              </p>

              {/* Paragraf 2 */}
              <p
                className="leading-8 text-gray-700"
                style={{
                  textAlign: 'justify',
                  textIndent: '2rem',
                  textJustify: 'auto',
                }}
              >
                Bersinergi dengan SEMA, Dewan Eksekutif Mahasiswa (DEMA) menjadi motor penggerak eksekutif yang mengaktualisasikan program kerja, 
                aspirasi, dan gerakan mahasiswa di lingkungan kampus maupun masyarakat luas. Pada ranah keilmuan dan pengembangan akademik, 
                KEBMA diperkuat oleh Himpunan Mahasiswa Program Studi (HMPS) yang menjadi rumah intelektual bagi mahasiswa sesuai disiplin ilmunya. 
                HMPS tersebut meliputi HMPS Ilmu Al-Qur'an dan Tafsir (IAT), Ilmu Hadis (ILHA), Pendidikan Agama Islam (PAI), Bimbingan Konseling Pendidikan Islam (BKPI), 
                Pendidikan Guru Madrasah Ibtidaiyah (PGMI), Ekonomi Syariah (EKOSY), Manajemen Keuangan Syariah (MKS), Pendidikan Bahasa Arab (PBA), serta Sejarah Peradaban Islam (SPI). 
                Seluruh HMPS berperan aktif dalam mengembangkan tradisi keilmuan, riset, dan pengabdian yang berakar pada nilai Islam dan kebutuhan zaman.
              </p>

              {/* Paragraf 3 */}
              <p
                className="leading-8 text-gray-700"
                style={{
                  textAlign: 'justify',
                  textIndent: '2rem',
                  textJustify: 'auto',
                }}
              >
                Selain itu, KEBMA juga menjadi ruang aktualisasi minat dan bakat mahasiswa melalui berbagai Unit Kegiatan Mahasiswa (UKM). 
                UKM Protokoler membentuk karakter profesional dan tata kelola acara yang beretika; UKM Terkata mewadahi seni retorika dan literasi; 
                UKM Aksara menjadi pusat kreativitas tulis dan jurnalistik; HIMPARA mengembangkan kepedulian sosial dan kepanduan; Shurulkan menguatkan spiritualitas dan syiar Islam; 
                serta IMARAGA menjadi wadah pengembangan olahraga dan kebugaran jasmani. Dengan semangat kebersamaan dan sinergi antar lembaga, KEBMA IAI Persis Garut terus berkomitmen melahirkan 
                mahasiswa yang tidak hanya unggul secara akademik, tetapi juga matang secara spiritual, sosial, dan kepemimpinan, demi kontribusi nyata bagi umat, bangsa, dan agama.
              </p>
            </div>
          </section>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Statistics Card */}
          <div className={`${org.bgColor} rounded-lg p-6 border border-gray-200`}>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Statistik
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Anggota</p>
                <p className={`text-3xl font-bold ${org.textColor}`}>{org.anggota}</p>
              </div>
              <div className={`h-px bg-gradient-to-r ${org.color} opacity-20`}></div>
            </div>
          </div>

          <div className={`${org.bgColor} rounded-lg p-6 border border-gray-200`}>
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Organisasi Kami
            </h3>
            <div className="space-y-4">
              {/* Bagian kumpulan logo */} 
              <div className="grid grid-cols-3 gap-4"> {logos.map((logo, index) => ( <div key={index} className="flex justify-center items-center"> <img src={logo} alt={`Logo ${index}`} className="h-16 w-auto object-contain" /> </div> ))} </div>
              <div className={`h-px bg-gradient-to-r ${org.color} opacity-20`}></div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Hubungi Kami
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                <a href={`mailto:${org.kontak.email}`} className={`${org.textColor} hover:underline font-medium text-sm`}>
                  {org.kontak.email}
                </a>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Telepon</p>
                <a href={`tel:${org.kontak.phone}`} className={`${org.textColor} hover:underline font-medium text-sm`}>
                  {org.kontak.phone}
                </a>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Lokasi</p>
                <p className="text-gray-700 font-medium text-sm">{org.kontak.lokasi}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

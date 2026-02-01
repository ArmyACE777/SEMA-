'use client'

export function HeroSection() {
  return (
    <section className="relative bg-linear-to-r from-primary-700 to-primary-500 text-white py-20 px-6 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-20" />
      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-5xl font-bold leading-tight">Himpunan Mahasiswa IAIPI</h1>
        <p className="text-lg text-primary-100">
          Mewujudkan mahasiswa unggul, berintegritas, dan berkontribusi nyata untuk masyarakat.
        </p>
        <a
          href="/berita"
          className="inline-block mt-6 bg-white text-primary-700 font-semibold px-6 py-3 rounded-lg hover:bg-primary-100 transition-colors"
        >
          Lihat Berita Terbaru
        </a>
      </div>
    </section>
  )
}

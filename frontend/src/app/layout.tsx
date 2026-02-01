import type { Metadata } from 'next'
import { ThemeProvider } from '@/context/ThemeContext'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Header } from '@/components/Header'
import './globals.css'

const geistSans = GeistSans
const geistMono = GeistMono

export const metadata: Metadata = {
  title: 'SEMA IAIPI Garut',
  description: 'Portal informasi resmi SEMA IAIPI - Berita, Pengumuman, dan Informasi Kegiatan Mahasiswa Institut Agama Islam PERSIS Garut.',
  keywords: 'SEMA, IAIPI, Berita, Pengumuman, Mahasiswa, Institut Agama Islam PERSIS Garut, IAI PERSIS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50`}>
        <ThemeProvider>
          <Header />
          
          <main className="min-h-screen">
            {children}
          </main>

        </ThemeProvider>
      </body>
    </html>
  )
}

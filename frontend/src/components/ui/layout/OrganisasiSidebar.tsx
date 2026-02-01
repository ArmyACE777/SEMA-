'use client'

import Link from 'next/link'
import { Users, Award, Zap, ArrowRight } from 'lucide-react'

interface Organisasi {
  id: string
  nama: string
  deskripsi: string
  icon: React.ReactNode
  color: string
  bgColor: string
  textColor: string
  href: string
  anggota: number
}

export function OrganisasiSidebar() {
  const organisasiList: Organisasi[] = [
    {
      id: 'kebma',
      nama: 'KEBMA',
      deskripsi: 'Keluarga Besar Mahasiswa',
      icon: <Users size={24} />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      href: '/organisasi/kebma',
      anggota: 0,
    },

  ]

  return (
    <aside className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Organisasi Kampus</h2>
        <p className="text-sm text-gray-600">Mengenal lebih dekat organisasi mahasiswa kami</p>
      </div>

      {/* Cards Container */}
      <div className="space-y-4">
        {organisasiList.map((org) => (
          <Link
            key={org.id}
            href={org.href}
            className={`block p-5 rounded-xl ${org.bgColor} border border-gray-200 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg group cursor-pointer`}
          >
            {/* Top Section - Icon & Title */}
            <div className="flex items-start justify-between mb-3">
              <div className={`inline-flex items-center justify-center p-3 rounded-lg bg-gradient-to-br ${org.color} text-white`}>
                {org.icon}
              </div>
              <ArrowRight
                size={20}
                className={`${org.textColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
            </div>

            {/* Organization Name & Description */}
            <div className="mb-3">
              <h3 className={`font-bold text-lg ${org.textColor}`}>{org.nama}</h3>
              <p className="text-sm text-gray-700">{org.deskripsi}</p>
            </div>

            {/* Divider */}
            <div className={`h-px bg-gradient-to-r ${org.color} opacity-30 my-3`}></div>

            {/* Stats - Hidden by default, visible on hover */}
            <div
              className="grid grid-cols-2 gap-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div>
                <p className="text-xs font-semibold text-gray-600">Anggota</p>
                <p className={`font-bold text-lg ${org.textColor}`}>{org.anggota}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  )
}
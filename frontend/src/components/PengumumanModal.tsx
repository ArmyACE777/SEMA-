'use client'

import React from 'react'
import { X, AlertCircle, Calendar, Clock, Bell } from 'lucide-react'
import { BlocksRenderer } from '@strapi/blocks-react-renderer'
import type { BlocksContent } from '@strapi/blocks-react-renderer'

interface PengumumanModalProps {
  item: {
    id: number
    title: string
    content: string | BlocksContent
    priority?: 'Mendesak' | 'Rutin' | 'Penting'
    publishedAt?: string
    startDate?: string
    endDate?: string
    documentId?: string
  } | null
  isOpen: boolean
  onClose: () => void
}

export default function PengumumanModal({
  item,
  isOpen,
  onClose,
}: PengumumanModalProps) {
  if (!isOpen || !item) return null

  // ========== DATE FORMATTING ==========
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    })
  }

  // ========== PRIORITY STYLING SYSTEM ==========
  const getPriorityStyles = () => {
    const styles = {
      Mendesak: {
        bg: 'bg-white-50',
        badge: 'bg-white-100 text-black-700',
        dot: 'bg-red-500',
        text: 'text-red-500',
      },
      Rutin: {
        bg: 'bg-white-50',
        badge: 'bg-white-100 text-black-500',
        dot: 'bg-green-500',
        text: 'text-green-500',
      },
      Penting: {
        bg: 'bg-white-50',
        badge: 'bg-white-100 text-black-700',
        dot: 'bg-amber-500',
        text: 'text-amber-700',
      },
    }
    return styles[item?.priority || 'Penting'] || styles.Penting
  }

  const priorityStyles = getPriorityStyles()

  // ========== CONTENT TYPE DETECTION ==========
  const isValidBlocksContent = (content: any): content is BlocksContent => {
    if (!content) return false
    if (typeof content === 'string') return false
    if (!Array.isArray(content)) return false
    if (content.length === 0) return false
    return content.every((block: any) => block && typeof block === 'object' && block.type)
  }

  const hasBlocksContent = isValidBlocksContent(item.content)

  return (
    <>
      {/* ========== BACKDROP ========== */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* ========== MODAL CONTAINER ========== */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ========== HEADER ========== */}
          <div className={`${priorityStyles.bg} px-6 py-5 border-b border-gray-100 flex items-start justify-between`}>
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2.5 h-2.5 rounded-full ${priorityStyles.dot}`} />
                <span className={`${priorityStyles.badge} text-lg md:text-xl font-bold text-gray-900 leading-tight`}>
                {item.title}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup modal"
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1.5"
            >
              <X size={20} />
            </button>
          </div>

          {/* ========== META INFO ========== */}
          <div className="px-6 py-4 border-b border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Diposting */}
            <div className="flex items-start gap-3">
              <Clock size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium mb-1">Diposting</p>
                <p className="text-sm text-gray-700 font-medium">{formatDate(item.publishedAt)}</p>
              </div>
            </div>

            {/* Tanggal Acara */}
            {item.startDate && (
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 font-medium mb-1">Tanggal Acara</p>
                  <p className="text-sm text-gray-700 font-medium break-words">
                    {formatDate(item.startDate)} {item.endDate && `s/d ${formatDate(item.endDate)}`}
                  </p>
                </div>
              </div>
            )}

            {/* Jenis Pengumuman */}
            <div className="flex items-start gap-3">
              <Bell size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium mb-1">Jenis</p>
                <p className={`text-sm font-medium ${priorityStyles.text}`}>{item.priority}</p>
              </div>
            </div>
          </div>

          {/* ========== CONTENT ========== */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="prose prose-sm max-w-none">
              {hasBlocksContent ? (
                <BlocksRenderer
                  content={item.content as BlocksContent}
                  blocks={{
                    paragraph: ({ children }) => (
                      <p className="text-gray-700 leading-relaxed mb-4 text-sm md:text-base">
                        {children}
                      </p>
                    ),
                    heading: ({ children, level }) => {
                      const headingClasses = {
                        1: 'text-xl md:text-2xl font-bold mb-4 text-gray-900 mt-4',
                        2: 'text-lg md:text-xl font-bold mb-3 text-gray-900 mt-3',
                        3: 'text-base md:text-lg font-semibold mb-2 text-gray-900 mt-2',
                      }
                      const className =
                        headingClasses[level as keyof typeof headingClasses] || 'text-base font-semibold mb-2'
                      const Tag = `h${level}` as React.ElementType
                      return React.createElement(Tag, { className }, children)
                    },
                    list: ({ children }) => (
                      <ul className="list-disc list-inside mb-4 text-gray-700 text-sm md:text-base space-y-1.5">
                        {children}
                      </ul>
                    ),
                    quote: ({ children }) => (
                      <blockquote className="border-l-4 border-gray-300 pl-4 py-2 mb-4 italic text-gray-600">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm font-mono">
                        {children}
                      </code>
                    ),
                  }}
                />
              ) : (
                <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {typeof item.content === 'string' ? item.content : 'Tidak ada konten yang tersedia'}
                </p>
              )}
            </div>
          </div>

          {/* ========== FOOTER ========== */}
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
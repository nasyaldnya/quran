import { useRef, useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface PortalDropdownProps {
  open: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement | null>
  children: React.ReactNode
  /** Where to anchor relative to trigger: 'above' opens upward, 'below' opens downward */
  anchor?: 'above' | 'below'
  /** Which horizontal edge to align: 'left' or 'right' */
  align?: 'left' | 'right'
  /** Fixed width in px */
  width?: number
  /** Max height with scroll */
  maxHeight?: number
  className?: string
}

export default function PortalDropdown({
  open,
  onClose,
  triggerRef,
  children,
  anchor = 'above',
  align = 'right',
  width = 192,
  maxHeight,
  className = '',
}: PortalDropdownProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  // Calculate position from trigger element
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const gap = 8

    let top: number
    if (anchor === 'above') {
      top = rect.top - gap // will be set as bottom of menu
    } else {
      top = rect.bottom + gap
    }

    let left: number
    if (align === 'right') {
      left = rect.right - width
    } else {
      left = rect.left
    }

    // Clamp to viewport
    left = Math.max(8, Math.min(left, window.innerWidth - width - 8))

    setPos({ top, left })
  }, [triggerRef, anchor, align, width])

  useEffect(() => {
    if (!open) return
    updatePosition()
    // Recalculate on scroll/resize
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, updatePosition])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, onClose, triggerRef])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && pos && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: anchor === 'above' ? 6 : -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: anchor === 'above' ? 6 : -6 }}
          transition={{ duration: 0.14 }}
          className={`fixed rounded-xl border border-border/60 bg-card shadow-2xl overflow-hidden ${className}`}
          style={{
            width,
            zIndex: 9999,
            ...(anchor === 'above'
              ? { bottom: window.innerHeight - pos.top, left: pos.left }
              : { top: pos.top, left: pos.left }),
            ...(maxHeight ? { maxHeight, overflowY: 'auto' } : {}),
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

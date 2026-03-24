import { cn } from '@/lib/utils'

interface GeometricPatternProps {
  className?: string
  opacity?: number
}

export default function GeometricPattern({ className, opacity = 0.07 }: GeometricPatternProps) {
  return (
    <svg
      className={cn('pointer-events-none select-none', className)}
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      {/* Outer star polygon */}
      <polygon
        points="200,20 240,100 330,80 290,160 370,200 290,240 330,320 240,300 200,380 160,300 70,320 110,240 30,200 110,160 70,80 160,100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Inner circle */}
      <circle cx="200" cy="200" r="80"  fill="none" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="200" cy="200" r="130" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="200" cy="200" r="170" fill="none" stroke="currentColor" strokeWidth="0.4" />
      {/* Cross lines */}
      <line x1="200" y1="20"  x2="200" y2="380" stroke="currentColor" strokeWidth="0.4" />
      <line x1="20"  y1="200" x2="380" y2="200" stroke="currentColor" strokeWidth="0.4" />
      {/* Diagonal lines */}
      <line x1="70"  y1="70"  x2="330" y2="330" stroke="currentColor" strokeWidth="0.4" />
      <line x1="330" y1="70"  x2="70"  y2="330" stroke="currentColor" strokeWidth="0.4" />
      {/* Octagon */}
      <polygon
        points="200,90 255,112 278,168 255,224 200,246 145,224 122,168 145,112"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      {/* Inner diamond */}
      <polygon
        points="200,130 235,165 200,200 165,165"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
      />
    </svg>
  )
}

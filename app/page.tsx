"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Pause, Play } from "lucide-react"

export default function ThreeGorgesDam() {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setSliderPosition((prev) => {
        if (prev >= 100) {
          setIsPlaying(false)
          return 100
        }
        return prev + 0.5
      })
    }, 20)

    return () => clearInterval(interval)
  }, [isPlaying])

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleMouseDown = () => {
    setIsDragging(true)
    setIsPlaying(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    handleMove(e.touches[0].clientX)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    document.addEventListener("mouseup", handleGlobalMouseUp)
    return () => document.removeEventListener("mouseup", handleGlobalMouseUp)
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-12 text-[#0a1628] tracking-tight">
          THE THREE GORGES DAM
        </h1>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Panel - Description */}
          <div className="bg-[#0a1628] rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <div className="space-y-6 leading-relaxed">
              <p className="text-lg">
                In 2000, Terra's MODIS satellite images showed the Yangtze River still flowing freely, with the Three
                Gorges Dam only partly built and construction sites visible on the banks.
              </p>

              <p className="text-lg">
                By 2006, just six years later, MODIS imagery revealed the dam complete, spanning the entire river. A
                massive reservoir had formed behind it, replacing the narrow river channel with a wide, calm lake. The
                MODIS comparison highlights how quickly the dam transformed the Yangtze River and its surroundings.
              </p>
            </div>
          </div>

          {/* Right Panel - Image Comparison */}
          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <div
              ref={containerRef}
              className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl cursor-col-resize select-none"
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onMouseUp={handleMouseUp}
              onTouchEnd={handleMouseUp}
            >
              {/* Before Image (2000) */}
              <div className="absolute inset-0">
                <img
                  src="/aerial-satellite-view-of-yangtze-river-with-three-.jpg"
                  alt="Three Gorges Dam in July 2000"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div className="absolute bottom-6 left-6 bg-[#0a1628] text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg">
                  July 2000
                </div>
              </div>

              {/* After Image (2006) - Clipped */}
              <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                <img
                  src="/aerial-satellite-view-of-three-gorges-dam-complete.jpg"
                  alt="Three Gorges Dam in May 2006"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div className="absolute bottom-6 right-6 bg-[#0a1628] text-white px-6 py-3 rounded-full font-semibold text-sm shadow-lg">
                  May 2006
                </div>
              </div>

              {/* Slider Line and Handle */}
              <div className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl" style={{ left: `${sliderPosition}%` }}>
                <button
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center cursor-col-resize hover:scale-110 transition-transform active:scale-95"
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleMouseDown}
                  onClick={() => {
                    if (sliderPosition >= 100) {
                      setSliderPosition(0)
                    }
                    setIsPlaying(!isPlaying)
                  }}
                  aria-label={isPlaying ? "Pause comparison" : "Play comparison"}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-[#0a1628]" />
                  ) : (
                    <Play className="w-6 h-6 text-[#0a1628] ml-1" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

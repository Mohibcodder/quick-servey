// pages/share-location.js
'use client'
import { useState } from 'react'

export default function ShareLocation() {
  const [status, setStatus] = useState('')
  const [showModal, setShowModal] = useState(true)

  async function requestLocation() {
    if (!navigator.geolocation) {
      setStatus('Browser does not support Geolocation API.')
      return
    }

    setStatus('Requesting permission... (You will see a browser prompt)')
    navigator.geolocation.getCurrentPosition(async (p) => {
      // DO NOT display coords on the page
      const payload = {
        lat: p.coords.latitude,
        lon: p.coords.longitude,
        accuracy: p.coords.accuracy,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      }

      // 1) Log to the browser console (visible only to anyone with DevTools open)
      console.log('User location (client):', payload)
      setStatus('Location obtained and logged to console.')

      // 2) OPTIONAL: Send to server API so it logs in server logs (uncomment if needed)
      try {
        await fetch('/api/save-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        // we still do not show coordinates to the user in UI
      } catch (err) {
        console.error('Failed to send to server:', err)
      }

    }, (err) => {
      setStatus('Permission denied or error: ' + (err.message || err.code))
    }, { enableHighAccuracy: true, timeout: 15000 })
  }

  function onAllow() {
    setShowModal(false)
    requestLocation()
  }

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, Arial' }}>
      <h1>Share your location (consent required)</h1>

      {showModal ? (
        <div style={{
          border: '1px solid #ddd',
          padding: 16,
          borderRadius: 8,
          maxWidth: 720,
          background: '#fbfbfb'
        }}>
          <h3>Permission request</h3>
          <p>
            We need your location for [purpose]. We will <b>not</b> display the coordinates on this page.
            By clicking <b>Allow</b>, you consent to share your current location.
          </p>
          <button onClick={onAllow} style={{ marginRight: 8 }}>Decline</button>
          <button onClick={() => { setShowModal(false); setStatus('User declined to provide location.') }}>ALLOW</button>
        </div>
      ) : null}

      <p style={{ marginTop: 12 }}>{status}</p>
    </div>
  )
}

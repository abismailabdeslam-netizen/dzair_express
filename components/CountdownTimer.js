'use client'
import { useState, useEffect } from 'react'

export default function CountdownTimer({ days = 1, hours = 3, minutes = 47 }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })

  useEffect(() => {
    const KEY = 'dzair_cd_end'
    const duration = (days * 86400 + hours * 3600 + minutes * 60) * 1000

    let endTime = localStorage.getItem(KEY)
    if (!endTime || Date.now() > parseInt(endTime)) {
      endTime = Date.now() + duration
      localStorage.setItem(KEY, endTime)
    }

    const tick = () => {
      const remaining = Math.max(0, parseInt(endTime) - Date.now())
      setTimeLeft({
        days: Math.floor(remaining / 86400000),
        hours: Math.floor((remaining % 86400000) / 3600000),
        mins: Math.floor((remaining % 3600000) / 60000),
        secs: Math.floor((remaining % 60000) / 1000),
      })
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [days, hours, minutes])

  const pad = n => String(n).padStart(2, '0')

  const unit = (num, label) => (
    <div style={{
      background: 'rgba(255,255,255,0.1)', borderRadius: '10px',
      padding: '10px 14px', textAlign: 'center', minWidth: '60px'
    }}>
      <span style={{ fontSize: '26px', fontWeight: 900, display: 'block', fontVariantNumeric: 'tabular-nums' }}>{pad(num)}</span>
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)' }}>{label}</span>
    </div>
  )

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a0a0f, #1a1a2e)',
      borderRadius: '16px', padding: '18px 22px', marginBottom: '20px', color: 'white'
    }}>
      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', marginBottom: '12px' }}>
        ⏰ ينتهي العرض خلال:
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        {unit(timeLeft.days, 'يوم')}
        <span style={{ fontSize: '20px', fontWeight: 900, color: '#f4a261', marginBottom: '12px' }}>:</span>
        {unit(timeLeft.hours, 'ساعة')}
        <span style={{ fontSize: '20px', fontWeight: 900, color: '#f4a261', marginBottom: '12px' }}>:</span>
        {unit(timeLeft.mins, 'دقيقة')}
        <span style={{ fontSize: '20px', fontWeight: 900, color: '#f4a261', marginBottom: '12px' }}>:</span>
        {unit(timeLeft.secs, 'ثانية')}
      </div>
    </div>
  )
}

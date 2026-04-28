'use client'
import { useState } from 'react'

const DEFAULT_RULE = { minQty: 2, pct: 10, freeShip: false, gift: false }

export default function DiscountRulesEditor({ rules = [], onChange }) {
  const addRule = () => {
    const last = rules[rules.length - 1]
    const nextMin = last ? last.minQty + 1 : 2
    onChange([...rules, { ...DEFAULT_RULE, minQty: nextMin }])
  }

  const removeRule = (i) => onChange(rules.filter((_, idx) => idx !== i))

  const updateRule = (i, key, val) => {
    const updated = rules.map((r, idx) => idx === i ? { ...r, [key]: val } : r)
    onChange(updated)
  }

  const inp = {
    padding: '8px 12px', border: '2px solid #e9ecef', borderRadius: '10px',
    fontFamily: 'Cairo, sans-serif', fontSize: '14px', outline: 'none',
    color: '#1a1a2e', background: 'white', width: '100%',
  }

  return (
    <div>
      <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '14px' }}>
        كل قاعدة: عند شراء الكمية المحددة أو أكثر → يُطبّق الخصم تلقائياً
      </p>

      {rules.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '12px', color: '#6c757d', fontSize: '13px', marginBottom: '12px' }}>
          لا توجد قواعد خصم — اضغط "إضافة قاعدة" لتفعيل النظام
        </div>
      )}

      {rules.map((rule, i) => (
        <div key={i} style={{
          background: '#f8f9fa', borderRadius: '14px', padding: '16px',
          marginBottom: '12px', border: '2px solid #e9ecef',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
          gap: '12px', alignItems: 'center',
        }}>
          {/* الكمية الدنيا */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#555', display: 'block', marginBottom: '4px' }}>الكمية الدنيا</label>
            <input type="number" min="2" max="20" style={inp}
              value={rule.minQty}
              onChange={e => updateRule(i, 'minQty', parseInt(e.target.value) || 2)} />
          </div>

          {/* نسبة الخصم */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#555', display: 'block', marginBottom: '4px' }}>الخصم %</label>
            <input type="number" min="0" max="100" style={inp}
              value={rule.pct}
              onChange={e => updateRule(i, 'pct', parseInt(e.target.value) || 0)} />
          </div>

          {/* توصيل مجاني */}
          <div style={{ textAlign: 'center' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#555', display: 'block', marginBottom: '8px' }}>توصيل مجاني 🚚</label>
            <button onClick={() => updateRule(i, 'freeShip', !rule.freeShip)} style={{
              padding: '8px 16px', borderRadius: '20px', border: 'none',
              background: rule.freeShip ? '#2a9d8f' : '#e9ecef',
              color: rule.freeShip ? 'white' : '#6c757d',
              fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {rule.freeShip ? '✓ مفعّل' : 'غير مفعّل'}
            </button>
          </div>

          {/* هدية */}
          <div style={{ textAlign: 'center' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#555', display: 'block', marginBottom: '8px' }}>هدية 🎁</label>
            <button onClick={() => updateRule(i, 'gift', !rule.gift)} style={{
              padding: '8px 16px', borderRadius: '20px', border: 'none',
              background: rule.gift ? '#d4820a' : '#e9ecef',
              color: rule.gift ? 'white' : '#6c757d',
              fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {rule.gift ? '✓ مفعّل' : 'غير مفعّل'}
            </button>
          </div>

          {/* حذف */}
          <button onClick={() => removeRule(i)} style={{
            width: '36px', height: '36px', borderRadius: '10px', border: 'none',
            background: 'rgba(230,57,70,0.1)', color: '#e63946',
            fontSize: '18px', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>
      ))}

      <button onClick={addRule} style={{
        padding: '10px 20px', borderRadius: '12px',
        border: '2px dashed #e9ecef', background: 'white',
        fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 700,
        color: '#6c757d', cursor: 'pointer', width: '100%',
        transition: 'all 0.2s',
      }}>
        + إضافة قاعدة خصم
      </button>

      {/* معاينة */}
      {rules.length > 0 && (
        <div style={{ marginTop: '14px', background: 'rgba(45,122,79,0.06)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(45,122,79,0.2)' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, marginBottom: '8px', color: '#2a9d8f' }}>📊 معاينة القواعد</div>
          {[...rules].sort((a, b) => a.minQty - b.minQty).map((r, i) => (
            <div key={i} style={{ fontSize: '12px', color: '#444', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 700, color: '#1B5C38' }}>عند {r.minQty}+ قطع:</span>
              {r.pct > 0  && <span style={{ background: '#e63946', color: 'white', padding: '1px 8px', borderRadius: '10px', fontSize: '11px' }}>خصم {r.pct}%</span>}
              {r.freeShip && <span style={{ background: '#2a9d8f', color: 'white', padding: '1px 8px', borderRadius: '10px', fontSize: '11px' }}>🚚 مجاني</span>}
              {r.gift     && <span style={{ background: '#d4820a', color: 'white', padding: '1px 8px', borderRadius: '10px', fontSize: '11px' }}>🎁 هدية</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

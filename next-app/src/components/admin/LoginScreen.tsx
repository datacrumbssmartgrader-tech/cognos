"use client"
import React, { useState } from "react"

export default function LoginScreen({ onLogin }: { onLogin?: () => void }) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    // mock auth: accept any 4-digit pin
    if (pin.length === 4) {
      setError("")
      onLogin && onLogin()
    } else {
      setError("Enter 4-digit PIN")
    }
  }

  return (
    <div id="login-screen">
      <div className="login-bg"></div>
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">
          <span className="login-logo-en">ROOSTER'S DEN</span>
          <span className="login-logo-ur">روایات</span>
        </div>
        <p className="login-subtitle">Staff Access</p>

        <div className="pin-field">
          <label className="pin-label">PIN</label>
          <input id="pin-input" type="password" inputMode="numeric" maxLength={4}
            placeholder="• • • •" autoComplete="off" value={pin}
            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))} />
        </div>

        <button id="btn-login" className="login-btn" type="submit">
          <i className="ri-login-circle-line"></i> Sign In
        </button>
        {error && <p id="login-error" className="login-error">{error}</p>}
      </form>
    </div>
  )
}

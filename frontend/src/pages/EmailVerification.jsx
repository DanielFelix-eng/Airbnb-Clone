import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader } from 'lucide-react' 
import { useAuthStore } from '../store/store'


export default function EmailVerification() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [message, setMessage] = useState('')
  const inputsRef = useRef([])
  const navigate = useNavigate()
   const {verifyEmail , isLoading ,error }  =useAuthStore()


  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return
    const nextCode = [...code]
    nextCode[index] = value
    setCode(nextCode)

    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (e) => { 
     try {
      await verifyEmail(verificationCode) ; 
      navigate("/")
     } catch (error) {
      
     }
    e.preventDefault()
    const verificationCode = code.join('')
    if (verificationCode.length < 6) {
      setMessage('Please enter the full 6-digit code.')
      return
    }

    try {
      setMessage('Verifying code...')
      const res = await fetch('/api/auth/verifyEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: verificationCode }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage(data?.message || 'Verification failed')
        return
      }
      setMessage(data?.message || 'Email verified successfully') 
      navigate("/")
    } catch (error) {
      setMessage(error?.message || 'Network error')
    }

  }

  const handleResend = async () => {
    try {
      setMessage('Resending verification email...')
      const res = await fetch('/api/auth/resendVerification', {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage(data?.message || 'Resend failed')
        return
      }
      setMessage(data?.message || 'Verification email resent. Check your inbox.')
       navigate("/login")
    } catch (error) {
      setMessage(error?.message || 'Network error')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-slate-900 shadow-xl shadow-black/20 overflow-hidden"
      >
        <div className="p-8 sm:p-10">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-500">Email verification</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-100">Verify your email</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Enter the 6-digit code sent to your inbox to complete account setup.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="grid grid-cols-6 gap-3">
              {code.map((digit, index) => (
                <label key={index} className="relative block">
                  <span className="sr-only">Digit {index + 1}</span>
                  <input
                    ref={(el) => (inputsRef.current[index] = el)}
                    value={digit}
                    onChange={(event) => handleChange(index, event.target.value)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    maxLength={1}
                    className="h-14 w-full rounded-3xl border border-slate-700 bg-slate-950 text-center text-xl text-slate-100 outline-none transition focus:border-emerald-500"
                  />
                </label>
              ))}
            </div>

            {message ? <p className="text-center text-sm text-slate-300">{message}</p> : null}

            <button
              type="submit"
              className="w-full rounded-3xl bg-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-600"
            >
                          {isLoading ?  <Loader className = 'animate-spin mx-auto' size ={24} /> : "verify email" }
            
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-3 text-sm text-slate-400 sm:flex-row sm:justify-between">
            <p>Didn’t receive the code?</p>
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-emerald-300 hover:text-emerald-200"
            >
              Resend code
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-slate-500">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-semibold text-slate-300 hover:text-slate-100"
            >
              Back to login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

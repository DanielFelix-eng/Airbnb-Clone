import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Input from '../components/input'
import { Mail, Loader, CheckCircle } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!email) {
      setMessage('Please enter your email address')
      setMessageType('error')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/auth/forgotPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email')
      }

      setMessage('Reset link sent successfully! Please check your spam folder too—our email may have been sent there.')
      setMessageType('success')
      setEmailSent(true)
      setEmail('')


      setTimeout(() => {
        navigate('/login')
      }, 4000)

    } catch (error) {
      setMessage(error.message || 'An error occurred. Please try again.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md rounded-[28px] border border-slate-800 bg-slate-900 shadow-xl shadow-black/20 overflow-hidden"
      >
        <div className="p-8 sm:p-10">
          {!emailSent ? (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-semibold text-slate-100">Forgot Password?</h1>
                <p className="mt-2 text-sm text-slate-400">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                {message && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-sm text-center py-2 px-3 rounded-lg ${
                      messageType === 'success'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                  >
                    {message}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-3xl bg-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-600 disabled:bg-slate-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-400">
                Remember your password?{' '}
                <Link to="/login" className="font-semibold text-emerald-300 hover:text-emerald-200 transition">
                  Back to login
                </Link>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="flex justify-center mb-4">
                <CheckCircle className="text-emerald-400" size={48} />
              </div>
              <h2 className="text-xl font-semibold text-slate-100 mb-2">Email Sent!</h2>
              <p className="text-sm text-slate-400 mb-6">
                We've sent a password reset link to <span className="text-emerald-300 font-medium">{email}</span>. Please check your spam folder too—our email may have been sent there.
              </p>
              <p className="text-xs text-slate-500 mb-6">Redirecting to login in a moment...</p>

              <button
                onClick={() => navigate('/login')}
                className="w-full rounded-3xl bg-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-600"
              >
                Back to Login
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}


import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Input from '../components/input'
import { Lock, Loader } from 'lucide-react'

export default function ResetPassword() {
  const params = useParams();
  const tokenFromParams = params?.token;
  const tokenFromQuery = new URLSearchParams(window.location.search).get('token');
  const token = tokenFromParams || tokenFromQuery;
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!password || !confirmPassword) {
      setMessage('Please fill in all fields')
      setMessageType('error')
      return
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      setMessageType('error')
      return
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long')
      setMessageType('error')
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/auth/resetPassword/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password')
      }

      setMessage('Password reset successful! Redirecting to login...')
      setMessageType('success')

      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      setMessage(error.message || 'An error occurred')
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
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-slate-100">Reset Password</h1>
            <p className="mt-2 text-sm text-slate-400">Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              icon={Lock}
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Remember your password?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-semibold text-emerald-300 hover:text-emerald-200 transition"
            >
              Back to login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '../components/input'
import { Mail, Lock  , Loader} from 'lucide-react'
 import { Link } from 'react-router-dom'
  import { useNavigate } from 'react-router-dom'
  import  { useAuthStore } from '../store/store'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate() 
   const {isLoading , error , login } = useAuthStore()
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setMessage('')
      await login(email, password)
      navigate('/')
    } catch (error) {
      setMessage(error?.message || 'Login failed')
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
            <h1 className="text-2xl font-semibold text-slate-100">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-400">Log in to continue to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              icon={Mail}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {message ? <p className="text-center text-sm text-slate-300">{message}</p> : null}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-3xl bg-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-600 disabled:bg-slate-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to={"/signup"} className="font-semibold text-emerald-300 hover:text-emerald-200">
              Create one
            </Link>
          </div>
          <div className="mt-6 text-center text-sm text-slate-400">
            forgot Password?{' '}
            <Link to={"/forgotPassword"} className="font-semibold text-emerald-300 hover:text-emerald-200">
              resetPassword
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

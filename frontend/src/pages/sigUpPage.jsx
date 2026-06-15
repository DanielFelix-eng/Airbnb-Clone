import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '../components/input'
import { User, Mail, Lock, Loader } from 'lucide-react'
import   {Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
 import {  useAuthStore ,  } from '../store/store'
 
export default function SignUpPage() {
  const handleSubmit = async (e) => {
    e.preventDefault()
     try {
      await signup(email , password , name) ; 
      navigate("/verifyEmail")
     } catch (error) {
      
     }

    try {
      setMessage('')

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setMessage(data?.message || 'Signup failed')
        return
      }

      setMessage(data?.message || 'Signup successful! Check your email for verification.')
      setName('')
      setEmail('')
      setPassword('')
       navigate("/verifyEmail")
    } catch (err) {
      setMessage(err?.message || 'Network error')
    }
  }

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('') 
  const navigate =  useNavigate()
   const {signup , error ,isLoading } = useAuthStore()
   

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md rounded-[32px] border border-slate-800 bg-slate-900 shadow-xl shadow-black/20 overflow-hidden"
      >
        <div className="p-8 sm:p-10">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              Create account
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-100">
              Start your secure journey
            </h1>
            <p className="mt-3 text-sm text-slate-400">
              Join now and manage your authentication with email verification and session support.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              icon={User}
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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

            {message ? (
              <p className="text-center text-sm text-slate-300">
                {message}
              </p>
            ) : null}
             

            <button
              type="submit"
              className="w-full rounded-3xl bg-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-600"
            >
              {isLoading ?  <Loader className = 'animate-spin mx-auto' size ={24} /> : "sign up" }
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to={"/login"} className="font-semibold text-emerald-300 hover:text-emerald-200">
              Log in
            </Link>
          </div>
        </div>
      </motion.div> 
    </div>
  )
}
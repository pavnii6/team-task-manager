import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Clear any stale local session before attempting login/signup.
  // This prevents "User already registered" ghost states and invalid
  // token errors when a user was deleted from Supabase but localStorage
  // still holds an old session.
  async function clearLocalSession() {
    try {
      await supabase.auth.signOut({ scope: 'local' })
    } catch (_) {
      // Ignore — we just want localStorage cleared
    }
  }

  async function handleLogin() {
    // Always clear stale session first so we start with a clean slate
    await clearLocalSession()

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      // Surface friendly messages for common cases
      if (error.message.includes('Invalid login credentials')) {
        setError('Incorrect email or password. Please try again.')
      } else if (error.message.includes('Email not confirmed')) {
        setError('Please confirm your email before logging in. Check your inbox.')
      } else {
        setError(error.message)
      }
      return false
    }
    return true
  }

  async function handleSignup() {
    // Clear any stale session so a re-signup after deletion works cleanly
    await clearLocalSession()

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      if (error.message.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.')
      } else if (error.message.includes('Password should be')) {
        setError('Password must be at least 6 characters.')
      } else {
        setError(error.message)
      }
      return false
    }

    // Supabase returns a session immediately when email confirmation is disabled.
    // If a session exists, the user is logged in. Otherwise prompt to confirm email.
    if (data.session) {
      // onAuthStateChange in App.jsx will pick this up automatically
      return true
    } else {
      setMessage('Account created! Check your email to confirm, then sign in.')
      setIsLogin(true)
      return false
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    if (isLogin) {
      await handleLogin()
    } else {
      await handleSignup()
    }

    setLoading(false)
  }

  function switchMode() {
    setIsLogin(!isLogin)
    setError('')
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8">

        {/* Logo + title */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Team Task Manager</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Success banner */}
        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
            {!isLogin && (
              <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={switchMode}
            className="text-indigo-600 hover:underline font-medium"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}

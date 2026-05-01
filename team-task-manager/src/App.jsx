import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import ProjectPage from './pages/ProjectPage'

export default function App() {
  // undefined = still loading, null = no session, object = active session
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    // On mount: validate the stored session against Supabase.
    // If the token is expired or the user was deleted, getSession()
    // will return null and we clear local storage automatically.
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        // Invalid / corrupt token — wipe it and start fresh
        console.warn('Session error on load, clearing:', error.message)
        clearStaleSession()
      } else {
        setSession(session)
      }
    })

    // Listen for all auth state changes (login, logout, token refresh, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setSession(null)
      } else if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        setSession(session)
      } else {
        setSession(session)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function clearStaleSession() {
    // Sign out silently to purge any bad tokens from localStorage
    await supabase.auth.signOut({ scope: 'local' })
    setSession(null)
  }

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <div className="text-gray-500 text-sm">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={session ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/auth"
          element={session ? <Navigate to="/dashboard" replace /> : <AuthPage />}
        />
        <Route
          path="/dashboard"
          element={session ? <DashboardPage session={session} /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/project/:id"
          element={session ? <ProjectPage session={session} /> : <Navigate to="/auth" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

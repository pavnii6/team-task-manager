import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Navbar({ email, isAdmin }) {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/auth')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 font-bold text-gray-900 hover:text-indigo-600 transition-colors"
      >
        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        Team Task Manager
      </button>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xs font-bold">
            {email?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm text-gray-600 hidden sm:block">{email}</span>
          {isAdmin && (
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

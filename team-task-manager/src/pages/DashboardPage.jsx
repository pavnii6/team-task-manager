import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import Navbar from '../components/Navbar'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || ''

export default function DashboardPage({ session }) {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [newProjectName, setNewProjectName] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const userEmail = session.user.email
  // Admin = first registered user OR email matches VITE_ADMIN_EMAIL
  // We store admin status in user_metadata set during signup
  const isAdmin =
    ADMIN_EMAIL
      ? userEmail === ADMIN_EMAIL
      : session.user.user_metadata?.role === 'admin'

  useEffect(() => {
    fetchProjects()
    fetchAllTasks()
  }, [])

  async function fetchProjects() {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setProjects(data || [])
    setLoading(false)
  }

  async function fetchAllTasks() {
    const { data } = await supabase
      .from('tasks')
      .select('*')
    setTasks(data || [])
  }

  async function createProject(e) {
    e.preventDefault()
    if (!newProjectName.trim()) return
    setCreating(true)
    setError('')

    const { error } = await supabase.from('projects').insert({
      name: newProjectName.trim(),
      created_by: session.user.id,
    })

    if (error) {
      setError(error.message)
    } else {
      setNewProjectName('')
      fetchProjects()
      fetchAllTasks()
    }
    setCreating(false)
  }

  // Dashboard stats
  const total = tasks.length
  const todo = tasks.filter(t => t.status === 'To Do').length
  const inProgress = tasks.filter(t => t.status === 'In Progress').length
  const done = tasks.filter(t => t.status === 'Done').length
  const today = new Date().toISOString().split('T')[0]
  const overdue = tasks.filter(t => t.due_date && t.due_date < today && t.status !== 'Done').length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar email={userEmail} isAdmin={isAdmin} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Tasks" value={total} color="bg-indigo-50 text-indigo-700" />
          <StatCard label="To Do" value={todo} color="bg-yellow-50 text-yellow-700" />
          <StatCard label="In Progress" value={inProgress} color="bg-blue-50 text-blue-700" />
          <StatCard label="Done" value={done} color="bg-green-50 text-green-700" />
        </div>

        {overdue > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <span className="text-red-700 text-sm font-medium">{overdue} overdue task{overdue > 1 ? 's' : ''} need attention</span>
          </div>
        )}

        {/* Projects */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
        </div>

        {isAdmin && (
          <form onSubmit={createProject} className="mb-6 flex gap-2">
            <input
              type="text"
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              placeholder="New project name..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={creating || !newProjectName.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {creating ? 'Creating...' : '+ Create Project'}
            </button>
          </form>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p className="text-sm">{isAdmin ? 'No projects yet. Create one above.' : 'No projects available.'}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => {
              const projectTasks = tasks.filter(t => t.project_id === project.id)
              const projectDone = projectTasks.filter(t => t.status === 'Done').length
              return (
                <button
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:border-indigo-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                  <p className="text-xs text-gray-500">
                    {projectTasks.length} task{projectTasks.length !== 1 ? 's' : ''} · {projectDone} done
                  </p>
                  {projectTasks.length > 0 && (
                    <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${(projectDone / projectTasks.length) * 100}%` }}
                      />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-xl p-4 ${color}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium mt-0.5 opacity-80">{label}</div>
    </div>
  )
}

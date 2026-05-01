import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || ''

const EMPTY_TASK = {
  title: '',
  description: '',
  status: 'To Do',
  due_date: '',
  assigned_to: '',
}

export default function ProjectPage({ session }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_TASK)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')

  const userEmail = session.user.email
  const isAdmin = ADMIN_EMAIL
    ? userEmail === ADMIN_EMAIL
    : session.user.user_metadata?.role === 'admin'

  useEffect(() => {
    fetchProject()
    fetchTasks()
  }, [id])

  async function fetchProject() {
    const { data } = await supabase.from('projects').select('*').eq('id', id).single()
    setProject(data)
  }

  async function fetchTasks() {
    setLoading(true)
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false })
    setTasks(data || [])
    setLoading(false)
  }

  async function createTask(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    setCreating(true)
    setError('')

    const { error } = await supabase.from('tasks').insert({
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      due_date: form.due_date || null,
      assigned_to: form.assigned_to.trim() || null,
      project_id: id,
    })

    if (error) {
      setError(error.message)
    } else {
      setForm(EMPTY_TASK)
      setShowForm(false)
      fetchTasks()
    }
    setCreating(false)
  }

  const STATUS_FILTERS = ['All', 'To Do', 'In Progress', 'Done']
  const filteredTasks = filter === 'All' ? tasks : tasks.filter(t => t.status === filter)

  const today = new Date().toISOString().split('T')[0]
  const overdueTasks = tasks.filter(t => t.due_date && t.due_date < today && t.status !== 'Done')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar email={userEmail} isAdmin={isAdmin} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navigate('/dashboard')} className="hover:text-indigo-600 transition-colors">
            Dashboard
          </button>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">{project?.name || 'Project'}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project?.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          )}
        </div>

        {/* Overdue alert */}
        {overdueTasks.length > 0 && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}
          </div>
        )}

        {/* Create Task Form */}
        {showForm && isAdmin && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">New Task</h3>
            {error && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
            )}
            <form onSubmit={createTask} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Task title"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Optional description"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={form.due_date}
                    onChange={e => setForm({ ...form, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Assign To</label>
                  <input
                    type="text"
                    value={form.assigned_to}
                    onChange={e => setForm({ ...form, assigned_to: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Email or name"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {creating ? 'Creating...' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setError('') }}
                  className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter tabs */}
        {tasks.length > 0 && (
          <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-lg w-fit">
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {f}
                {f !== 'All' && (
                  <span className="ml-1.5 text-xs opacity-60">
                    {tasks.filter(t => t.status === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Tasks */}
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p className="text-sm">
              {filter === 'All'
                ? isAdmin ? 'No tasks yet. Add one above.' : 'No tasks in this project.'
                : `No "${filter}" tasks.`}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} onUpdate={fetchTasks} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

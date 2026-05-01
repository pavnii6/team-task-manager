import { useState } from 'react'
import { supabase } from '../supabaseClient'

const STATUS_OPTIONS = ['To Do', 'In Progress', 'Done']

const STATUS_STYLES = {
  'To Do': 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Done': 'bg-green-100 text-green-800',
}

export default function TaskCard({ task, onUpdate }) {
  const [updating, setUpdating] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const isOverdue = task.due_date && task.due_date < today && task.status !== 'Done'

  async function handleStatusChange(newStatus) {
    setUpdating(true)
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', task.id)
    if (!error) onUpdate()
    setUpdating(false)
  }

  return (
    <div className={`bg-white border rounded-xl p-4 ${isOverdue ? 'border-red-200' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-gray-900 text-sm leading-snug">{task.title}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_STYLES[task.status] || 'bg-gray-100 text-gray-700'}`}>
          {task.status}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
        {task.assigned_to && (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {task.assigned_to}
          </span>
        )}
        {task.due_date && (
          <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {isOverdue ? 'Overdue · ' : ''}{task.due_date}
          </span>
        )}
      </div>

      <div className="flex gap-1 flex-wrap">
        {STATUS_OPTIONS.map(status => (
          <button
            key={status}
            disabled={updating || task.status === status}
            onClick={() => handleStatusChange(status)}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-colors disabled:opacity-40 ${
              task.status === status
                ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-default'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  )
}

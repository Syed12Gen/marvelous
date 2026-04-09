'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { GroupType, CreateGroupRequest, CreateGroupResponse } from '@/lib/types'

const GROUP_TYPES: { value: GroupType; label: string }[] = [
  { value: 'classroom',    label: 'Classroom'    },
  { value: 'workplace',    label: 'Workplace'    },
  { value: 'friend_group', label: 'Friend group' },
  { value: 'family',       label: 'Family'       },
]

export default function CreateGroupForm() {
  const [name, setName]           = useState('')
  const [groupType, setGroupType] = useState<GroupType | null>(null)
  const [error, setError]         = useState<string | null>(null)
  const [loading, setLoading]     = useState(false)
  const [createdId, setCreatedId] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!groupType) { setError('Please select a group type.'); return }
    setError(null)
    setLoading(true)
    try {
      const body: CreateGroupRequest = { name: name.trim(), group_type: groupType }
      const res = await fetch('/api/groups/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json() as CreateGroupResponse & { error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Failed to create group')
      setCreatedId(json.groupId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (createdId) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Group created successfully!
        </div>
        <div>
          <p className="mb-1 text-sm font-medium text-gray-700">
            Share this ID with people you want to invite:
          </p>
          <p className="rounded-lg bg-gray-100 px-4 py-3 font-mono text-sm text-gray-900 break-all">
            {createdId}
          </p>
        </div>
        <Link
          href={`/groups/${createdId}/chat`}
          className="block w-full rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Enter chat
        </Link>
        <Link
          href="/home"
          className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="group-name" className="block text-sm font-medium text-gray-700">
          Group name
        </label>
        <input
          id="group-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">Group type</p>
        <div className="grid grid-cols-2 gap-2">
          {GROUP_TYPES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setGroupType(value)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                groupType === value
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Creating…' : 'Create group'}
      </button>
    </form>
  )
}

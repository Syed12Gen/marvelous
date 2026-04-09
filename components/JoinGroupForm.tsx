'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import RelationshipTagPicker from '@/components/RelationshipTagPicker'
import type { RelationshipTag, JoinGroupRequest, JoinGroupResponse } from '@/lib/types'

type Step = 'id' | 'tag'

export default function JoinGroupForm() {
  const router = useRouter()
  const [step, setStep]               = useState<Step>('id')
  const [groupId, setGroupId]         = useState('')
  const [tag, setTag]                 = useState<RelationshipTag | null>(null)
  const [error, setError]             = useState<string | null>(null)
  const [loading, setLoading]         = useState(false)

  function handleContinue(e: React.FormEvent) {
    e.preventDefault()
    if (!groupId.trim()) { setError('Please enter a group ID.'); return }
    setError(null)
    setStep('tag')
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    if (!tag) { setError('Please choose your relationship to this group.'); return }
    setError(null)
    setLoading(true)
    try {
      const body: JoinGroupRequest = { groupId: groupId.trim(), relationshipTag: tag }
      const res = await fetch('/api/groups/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json() as JoinGroupResponse & { error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Failed to join group')
      router.push(`/groups/${json.groupId}/chat`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setLoading(false)
    }
  }

  if (step === 'id') {
    return (
      <form onSubmit={handleContinue} className="space-y-4">
        <div>
          <label htmlFor="group-id" className="block text-sm font-medium text-gray-700">
            Group ID
          </label>
          <input
            id="group-id"
            type="text"
            required
            placeholder="Paste the group ID here"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Continue
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleJoin} className="space-y-4">
      <div className="rounded-lg bg-gray-50 px-3 py-2">
        <p className="text-xs text-gray-500">Joining group</p>
        <p className="mt-0.5 font-mono text-sm text-gray-900 break-all">{groupId}</p>
      </div>

      <RelationshipTagPicker value={tag} onChange={setTag} />

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Joining…' : 'Join group'}
      </button>

      <button
        type="button"
        onClick={() => { setStep('id'); setError(null) }}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Back
      </button>
    </form>
  )
}

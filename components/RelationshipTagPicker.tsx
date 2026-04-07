'use client'

import type { RelationshipTag } from '@/lib/types'

const TAGS: RelationshipTag[] = ['Student', 'Coworker', 'Friend', 'Family']

interface Props {
  value: RelationshipTag | null
  onChange: (tag: RelationshipTag) => void
}

export default function RelationshipTagPicker({ value, onChange }: Props) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-gray-700">
        How do you know these people?
      </p>
      <div className="grid grid-cols-2 gap-2">
        {TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(tag)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              value === tag
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-indigo-400'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}

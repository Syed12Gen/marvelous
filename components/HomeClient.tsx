'use client'

import Link from 'next/link'
import type { Group, GroupType } from '@/lib/types'

const GROUP_EMOJI: Record<string, string> = {
  classroom:    '📚',
  workplace:    '💼',
  friend_group: '🌿',
  sports_team:  '⚽',
  family:       '🏡',
}

const GROUP_TYPE_LABELS: Record<GroupType, string> = {
  classroom:    'Classroom',
  workplace:    'Workplace',
  friend_group: 'Friend group',
  family:       'Family',
  sports_team:  'Sports team',
}

interface Props {
  communicationScore: number
  groups: Group[]
}

export default function HomeClient({ communicationScore, groups }: Props) {
  const score        = Math.min(100, Math.max(0, communicationScore))
  const ringRadius   = 36
  const circumference = 2 * Math.PI * ringRadius
  const dashOffset   = circumference * (1 - score / 100)

  return (
    <div className="mx-auto max-w-lg px-4 space-y-5 pb-10" style={{ marginTop: -18 }}>

      {/* Score card */}
      <div
        className="bg-white cursor-pointer select-none active:scale-[1.02] transition-transform"
        style={{
          borderRadius: 20,
          padding:      20,
          border:       '1px solid #E4E1F0',
          boxShadow:    '0 4px 24px -4px rgba(83,74,183,0.14)',
          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div className="flex items-center gap-5">

          {/* Ring */}
          <div className="relative shrink-0" style={{ width: 92, height: 92 }}>
            <svg width="92" height="92" viewBox="0 0 100 100" aria-hidden="true">
              {/* Track */}
              <circle
                cx="50" cy="50" r={ringRadius}
                fill="none"
                stroke="#E4E1F0"
                strokeWidth="6"
              />
              {/* Progress */}
              <circle
                cx="50" cy="50" r={ringRadius}
                fill="none"
                stroke="#534AB7"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold" style={{ fontSize: 14, color: '#1C1B2E' }}>
                {communicationScore}
              </span>
            </div>
          </div>

          {/* Score text */}
          <div className="min-w-0">
            <p
              className="uppercase font-semibold tracking-wider"
              style={{ fontSize: 12, color: '#9996AD' }}
            >
              Communication score
            </p>
            <p className="mt-1" style={{ fontSize: 14, color: '#3F3D5C' }}>
              You&apos;re kinder than 82% of folks this week.
            </p>
          </div>
        </div>
      </div>

      {/* Groups section */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold" style={{ fontSize: 15, color: '#1C1B2E' }}>
            Your groups
          </h2>
          <div className="flex gap-2">
            <Link
              href="/groups/join"
              className="rounded-full font-medium transition-colors"
              style={{
                border:     '1px solid #E4E1F0',
                padding:    '6px 14px',
                fontSize:   12,
                color:      '#3F3D5C',
                background: '#ffffff',
              }}
            >
              Join
            </Link>
            <Link
              href="/groups/create"
              className="rounded-full font-semibold transition-colors"
              style={{
                background: '#534AB7',
                padding:    '6px 14px',
                fontSize:   12,
                color:      '#ffffff',
              }}
            >
              + Create
            </Link>
          </div>
        </div>

        {groups.length === 0 ? (
          <div
            className="bg-white text-center"
            style={{
              borderRadius: 20,
              padding:      24,
              border:       '1px solid #E4E1F0',
            }}
          >
            <p style={{ fontSize: 14, color: '#6B6880' }}>
              No groups yet — create one to get started.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {groups.map((group) => (
              <li key={group.id}>
                <Link
                  href={`/groups/${group.id}/chat`}
                  className="flex items-center gap-3 bg-white transition-all hover:-translate-y-px"
                  style={{
                    borderRadius: 20,
                    padding:      '14px 18px',
                    border:       '1px solid #E4E1F0',
                    boxShadow:    '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#BFB9E4'
                    e.currentTarget.style.boxShadow   = '0 4px 16px -4px rgba(83,74,183,0.18)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E4E1F0'
                    e.currentTarget.style.boxShadow   = '0 1px 4px rgba(0,0,0,0.04)'
                  }}
                >
                  {/* Emoji icon */}
                  <div
                    className="flex shrink-0 items-center justify-center rounded-xl text-2xl"
                    style={{ width: 42, height: 42, background: '#EBE9F7' }}
                  >
                    {GROUP_EMOJI[group.group_type] ?? '💬'}
                  </div>

                  {/* Name + type */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold" style={{ fontSize: 15, color: '#1C1B2E' }}>
                      {group.name}
                    </p>
                    <p className="mt-0.5" style={{ fontSize: 12, color: '#6B6880' }}>
                      {GROUP_TYPE_LABELS[group.group_type] ?? group.group_type}
                    </p>
                  </div>

                  {/* Chevron */}
                  <span className="shrink-0 font-semibold" style={{ color: '#534AB7', fontSize: 16 }}>
                    ›
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  )
}

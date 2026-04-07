// ============================================================
// Shared TypeScript types — all types live here, nowhere else
// ============================================================

export type RelationshipTag = 'Student' | 'Coworker' | 'Friend' | 'Family'
export type MeterLevel      = 'safe' | 'tension' | 'targeted' | 'bullying'
export type MemberRole      = 'neutral' | 'victim' | 'bully' | 'bystander' | 'defender'
export type CardType        = 'victim' | 'bully' | 'bystander'
export type PauseOutcome    = 'cancelled' | 'rephrased' | 'sent_anyway'
export type GroupType       = 'classroom' | 'workplace' | 'friend_group' | 'family'

export interface User {
  id:                  string
  email:               string
  name:                string
  avatar_url:          string | null
  relationship_tag:    RelationshipTag | null
  communication_score: number
  safe_person_id:      string | null
  created_at:          string
}

export interface Group {
  id:           string
  name:         string
  group_type:   GroupType
  created_by:   string
  no_exit_mode: boolean
  created_at:   string
}

export interface GroupMember {
  id:          string
  group_id:    string
  user_id:     string
  member_role: MemberRole
  is_defender: boolean
  joined_at:   string
}

export interface Message {
  id:         string
  group_id:   string
  sender_id:  string
  content:    string
  is_flagged: boolean
  created_at: string
}

export interface MessageAnalysis {
  id:               string
  message_id:       string
  hostility_score:  number
  sarcasm_score:    number
  exclusion_score:  number
  support_score:    number
  neutrality_score: number
  analyzed_at:      string
}

export interface ConversationSnapshot {
  id:               string
  group_id:         string
  meter_level:      MeterLevel
  targeted_user_id: string | null
  pattern_summary:  string | null
  people_involved:  string[]
  detected_at:      string
}

export interface GuidanceCard {
  id:           string
  user_id:      string
  group_id:     string
  snapshot_id:  string | null
  card_type:    CardType
  content:      string
  was_opened:   boolean
  shown_at:     string
  dismissed_at: string | null
}

export interface ScoreHistory {
  id:          string
  user_id:     string
  score_delta: number
  reason:      string
  group_id:    string | null
  recorded_at: string
}

export interface EvidenceVault {
  id:           string
  user_id:      string
  group_id:     string
  snapshot_ids: string[]
  is_exported:  boolean
  locked_at:    string
  exported_at:  string | null
}

export interface BullyVictimFlag {
  id:              string
  user_id:         string
  victim_group_id: string
  bully_group_id:  string
  resolved:        boolean
  detected_at:     string
}

export interface PauseEvent {
  id:               string
  user_id:          string
  group_id:         string
  original_message: string
  outcome:          PauseOutcome | null
  triggered_at:     string
}

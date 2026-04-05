# Marvelous — CLAUDE.md

## What This App Does
AI-powered group chat app that detects bullying in real time and privately guides
victims, bullies, and bystanders — no public shaming, no censorship.

---

## Commands
```bash
npm run dev        # Start local dev server (localhost:3000)
npm run build      # Production build
npm run type-check # Run tsc --noEmit to check types (run this after every edit)
npm run lint       # ESLint check
```

---

## Project Structure
```
/app
  /api             # All API route handlers (server-side only)
    /analyze/      # Claude API: batch message analysis
    /guidance/     # Claude API: generate guidance cards
  /auth/           # Auth pages (login, signup)
  /chat/           # Chat UI pages
  /profile/        # User profile pages
/components        # Reusable UI components (keep small, single-purpose)
/lib
  supabase.ts      # ALL Supabase queries go here — nowhere else
  claude.ts        # ALL Claude API calls go here — nowhere else
  types.ts         # Shared TypeScript types
/hooks             # Custom React hooks
/utils             # Pure helper functions (no API calls, no DB)
```

---

## Current Build Status
> Update this section as features are completed.

- [x] Project scaffolded (Next.js + TypeScript + Tailwind + Supabase)
- [ ] Auth (sign up, log in, relationship tag selection)
- [ ] Group creation and joining
- [ ] Real-time messaging
- [ ] AI batch analysis (every 5 messages)
- [ ] Bullying meter UI
- [ ] Guidance cards
- [ ] Pause button
- [ ] Communication score
- [ ] Evidence vault

---

## Rules for Claude Code — Follow These Every Session

### Before writing any code:
1. Check this file to understand current build status
2. Ask if something already exists before creating it
3. Never install a new package without telling me first
4. Run `npm run type-check` after every edit — fix all errors before moving on

### File rules:
- All Supabase queries → `/lib/supabase.ts` only
- All Claude API calls → `/lib/claude.ts` only  
- All API routes → `/app/api/` only (never call Claude or Supabase directly from components)
- Components must be small and single-purpose — split if they grow past ~100 lines

### TypeScript rules:
- Strict mode is on — no `any` types, ever
- Define all types in `/lib/types.ts`
- Always type API request and response bodies

---

## Security — NEVER Break These
- NEVER hardcode API keys or secrets anywhere
- ALWAYS use `process.env.VARIABLE_NAME` — never import `.env`
- NEVER commit `.env` to git (it's in `.gitignore`)
- ALL Supabase tables must have Row Level Security (RLS) enabled
- API routes must validate input before passing to Claude or Supabase
- Never expose raw AI scores to the client — only meter level and card content

## Environment Variables
```
ANTHROPIC_API_KEY              # Claude API key
NEXT_PUBLIC_SUPABASE_URL       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY      # Server-only — never expose to client
```

---

## Database Schema (Supabase)
- `users` — id, email, name, avatar_url, relationship_tag, communication_score, safe_person_id, created_at
- `groups` — id, name, group_type, created_by, no_exit_mode, created_at
- `group_members` — id, group_id, user_id, current_role, is_defender, joined_at
- `messages` — id, group_id, sender_id, content, is_flagged, created_at
- `message_analysis` — id, message_id, hostility_score, sarcasm_score, exclusion_score, support_score, neutrality_score, analyzed_at
- `conversation_snapshots` — id, group_id, meter_level, targeted_user_id, pattern_summary, people_involved, detected_at
- `guidance_cards` — id, user_id, group_id, snapshot_id, card_type, content, was_opened, shown_at, dismissed_at
- `score_history` — id, user_id, score_delta, reason, group_id, recorded_at
- `evidence_vault` — id, user_id, group_id, snapshot_ids, is_exported, locked_at, exported_at
- `bully_victim_flags` — id, user_id, victim_group_id, bully_group_id, resolved, detected_at
- `pause_events` — id, user_id, group_id, original_message, outcome, triggered_at

---

## AI Logic Rules
- Batch analyze every **5 messages** as a group — never one at a time
- Score each message: hostility, sarcasm, exclusion, support, neutrality (0–10)
- Use `claude-haiku-4-5` for scoring (fast, cheap)
- Use `claude-sonnet-4-5` for guidance card generation (smarter, context-aware)
- Never expose raw scores to users — derive meter level server-side
- Guidance cards are private — victim, bully, and bystander each see different content

## Meter Levels
`safe` → `tension` → `targeted` → `bullying`

## Relationship Tags (affects guidance card tone)
`Student` | `Coworker` | `Friend` | `Family`
import { describe, it, expect } from 'vitest'
import { BUILD_TIERS } from './index'
import { ACCENT, BADGE_VARIANTS } from '@/components/ui'

// BUILD_TIERS drives Home's age-tier picker, the Build hub, the BuildTier
// route, and Layout's breadcrumb lookup — the 3 audience tiers (Sparks,
// Flames, Blaze) are a core concept repeated across the whole site per
// CLAUDE.md, so both the accent AND the badge variant tokens must resolve
// to real design-system keys or the tier UI silently falls back/breaks.

describe('BUILD_TIERS', () => {
  it('has exactly the 3 age tiers', () => {
    expect(BUILD_TIERS).toHaveLength(3)
  })

  it('has unique slugs in Sparks -> Flames -> Blaze order', () => {
    expect(BUILD_TIERS.map((t) => t.slug)).toEqual(['sparks', 'flames', 'blaze'])
  })

  it('every accent key is recognized by GlassCard', () => {
    for (const tier of BUILD_TIERS) {
      expect(Object.keys(ACCENT)).toContain(tier.accent)
    }
  })

  it('every badgeVariant key is recognized by Badge', () => {
    for (const tier of BUILD_TIERS) {
      expect(Object.keys(BADGE_VARIANTS)).toContain(tier.badgeVariant)
    }
  })

  it('every tier has a non-empty ageRange and vibe', () => {
    for (const tier of BUILD_TIERS) {
      expect(tier.ageRange.trim().length).toBeGreaterThan(0)
      expect(tier.vibe.trim().length).toBeGreaterThan(0)
    }
  })
})

import { describe, it, expect } from 'vitest'
import { DISCOVER_TOPICS } from './index'
import { ACCENT } from '@/components/ui'

// DISCOVER_TOPICS is the single source of truth read by the Discover hub
// page, DiscoverLesson's slug lookup, and Layout's breadcrumb label lookup
// (see CLAUDE.md's "content-as-data pattern"). A malformed entry here
// (duplicate slug, or an accent key GlassCard doesn't recognize) breaks
// three call sites silently, so the data itself is the testable unit.

describe('DISCOVER_TOPICS', () => {
  it('has exactly the 5 topics from the master plan', () => {
    expect(DISCOVER_TOPICS).toHaveLength(5)
  })

  it('has unique slugs', () => {
    const slugs = DISCOVER_TOPICS.map((t) => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('every accent key is a key GlassCard actually recognizes', () => {
    for (const topic of DISCOVER_TOPICS) {
      expect(Object.keys(ACCENT)).toContain(topic.accent)
    }
  })

  it('every topic has a non-empty title and summary', () => {
    for (const topic of DISCOVER_TOPICS) {
      expect(topic.title.trim().length).toBeGreaterThan(0)
      expect(topic.summary.trim().length).toBeGreaterThan(0)
    }
  })

  it('includes the what-is-ai topic used as the entry point', () => {
    const topic = DISCOVER_TOPICS.find((t) => t.slug === 'what-is-ai')
    expect(topic).toBeDefined()
    expect(topic?.title).toBe('What is AI, really?')
  })
})

import { describe, it, expect } from 'vitest'
import { SAFETY_TOPICS } from './index'

// SAFETY_TOPICS is the single source of truth for Stay Safe's 5 deeper-safety
// topics, read by the hub page, StaySafeTopic's slug lookup, and Layout's
// breadcrumb label lookup — a duplicate or malformed slug here would break
// the dynamic /stay-safe/:slug route silently (Navigate away with no error).

describe('SAFETY_TOPICS', () => {
  it('has exactly the 5 topics from the master plan', () => {
    expect(SAFETY_TOPICS).toHaveLength(5)
  })

  it('has unique, kebab-case slugs', () => {
    const slugs = SAFETY_TOPICS.map((t) => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z]+(-[a-z]+)*$/)
    }
  })

  it('every topic has a non-empty title and summary', () => {
    for (const topic of SAFETY_TOPICS) {
      expect(topic.title.trim().length).toBeGreaterThan(0)
      expect(topic.summary.trim().length).toBeGreaterThan(0)
    }
  })

  it('includes privacy-data as one of the topics', () => {
    const topic = SAFETY_TOPICS.find((t) => t.slug === 'privacy-data')
    expect(topic).toBeDefined()
    expect(topic?.title).toBe('Privacy & data')
  })
})

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { LessonBlockquote } from './LessonCallout'

// LessonBlockquote is react-markdown's `components.blockquote` override: it
// inspects the flattened text of a markdown blockquote and, if it starts
// with one of 4 recognized labels ("Fun fact:", "Try it:", "Heads up:",
// "Quick check:"), upgrades it into a styled callout box instead of a plain
// <blockquote>. This is the one piece of real branching logic in the
// content-rendering pipeline (CLAUDE.md's "content standard" requires at
// least one callout per lesson page), so it's worth locking down.

describe('LessonBlockquote', () => {
  it('renders a plain <blockquote> for text with no recognized label', () => {
    const { container } = render(<LessonBlockquote>Just a regular quote.</LessonBlockquote>)
    expect(container.querySelector('blockquote')).not.toBeNull()
    expect(container.querySelector('.not-prose')).toBeNull()
  })

  it('upgrades "Fun fact:" into a styled callout with no <blockquote>', () => {
    const { container } = render(<LessonBlockquote>Fun fact: AI can beat humans at chess.</LessonBlockquote>)
    expect(container.querySelector('blockquote')).toBeNull()
    const callout = container.querySelector('.not-prose')
    expect(callout).not.toBeNull()
    expect(callout?.querySelector('svg')).not.toBeNull()
    expect(container.textContent).toContain('Fun fact: AI can beat humans at chess.')
  })

  it.each([
    ['Try it: guess the next word.', 'rgba(251, 191, 36, 0.35)'],
    ['Heads up: never share your password.', 'rgba(248, 113, 113, 0.35)'],
    ['Quick check: what did you learn?', 'rgba(96, 165, 250, 0.35)'],
  ])('upgrades %s into its own styled color', (text, expectedBorder) => {
    const { container } = render(<LessonBlockquote>{text}</LessonBlockquote>)
    const callout = container.querySelector('.not-prose') as HTMLElement | null
    expect(callout).not.toBeNull()
    // jsdom normalizes the inline `border` shorthand's rgba() spacing.
    expect(callout?.style.border).toContain(expectedBorder)
  })

  it('matches labels case-insensitively', () => {
    const { container } = render(<LessonBlockquote>HEADS UP: this is loud.</LessonBlockquote>)
    expect(container.querySelector('blockquote')).toBeNull()
    expect(container.querySelector('.not-prose')).not.toBeNull()
  })

  it('does not match a label that only appears mid-sentence', () => {
    const { container } = render(<LessonBlockquote>Here is a fun fact: AI is everywhere.</LessonBlockquote>)
    expect(container.querySelector('blockquote')).not.toBeNull()
    expect(container.querySelector('.not-prose')).toBeNull()
  })
})

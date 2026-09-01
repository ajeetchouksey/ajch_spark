import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { LessonPage } from './LessonPage'

// LessonPage is the shared template for every Discover/Stay Safe/Build
// lesson (CLAUDE.md: "Rendering goes through the shared LessonPage.tsx
// template"). Its optional props (summary, badge, heroImage) are only
// rendered when actually passed, and the Golden Rule ribbon must always be
// present per the master plan ("must appear ... everywhere") — that
// conditional wiring is what's worth testing here.

function renderLessonPage(overrides: Partial<Parameters<typeof LessonPage>[0]> = {}) {
  return render(
    <MemoryRouter>
      <LessonPage
        icon={Sparkles}
        title="What is AI, really?"
        backTo="/discover"
        backLabel="All Discover topics"
        markdown="Some **lesson** body."
        {...overrides}
      />
    </MemoryRouter>,
  )
}

describe('LessonPage', () => {
  it('always renders the title, back link, markdown body, and Golden Rule ribbon', () => {
    renderLessonPage()
    expect(screen.getByRole('heading', { name: 'What is AI, really?' })).toBeInTheDocument()
    const backLink = screen.getByRole('link', { name: /All Discover topics/ })
    expect(backLink).toHaveAttribute('href', '/discover')
    expect(screen.getByText('lesson')).toBeInTheDocument() // from markdown bold text
    expect(screen.getByText(/AI is a helper, not the boss\./)).toBeInTheDocument()
  })

  it('omits the summary paragraph when no summary is passed', () => {
    renderLessonPage()
    expect(screen.queryByText(/pattern-guesser/)).not.toBeInTheDocument()
  })

  it('renders the summary when passed', () => {
    renderLessonPage({ summary: 'AI is a super-fast pattern-guesser.' })
    expect(screen.getByText('AI is a super-fast pattern-guesser.')).toBeInTheDocument()
  })

  it('omits the badge when none is passed, and renders it when passed', () => {
    const { rerender } = renderLessonPage()
    expect(screen.queryByText('New')).not.toBeInTheDocument()

    rerender(
      <MemoryRouter>
        <LessonPage
          icon={Sparkles}
          title="What is AI, really?"
          backTo="/discover"
          backLabel="All Discover topics"
          markdown="Body."
          badge={{ label: 'New', variant: 'emerald' }}
        />
      </MemoryRouter>,
    )
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('omits the hero image when none is passed, and renders it with a fallback alt when passed', () => {
    const { rerender } = renderLessonPage()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()

    rerender(
      <MemoryRouter>
        <LessonPage
          icon={Sparkles}
          title="What is AI, really?"
          backTo="/discover"
          backLabel="All Discover topics"
          markdown="Body."
          heroImage="/hero.png"
        />
      </MemoryRouter>,
    )
    const img = screen.getByRole('img', { name: 'What is AI, really?' })
    expect(img).toHaveAttribute('src', '/hero.png')
  })
})

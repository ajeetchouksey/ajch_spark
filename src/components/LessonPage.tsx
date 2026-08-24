import type { ElementType } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui';
import type { BadgeVariant } from '@/components/ui';
import { GoldenRuleRibbon } from '@/components/GoldenRuleRibbon';
import { LessonBlockquote } from '@/components/LessonCallout';

interface LessonPageProps {
  icon: ElementType;
  title: string;
  summary?: string;
  badge?: { label: string; variant: BadgeVariant };
  backTo: string;
  backLabel: string;
  markdown: string;
  /** Optional hero illustration — imported via Vite (src/assets/), not a public/ string path. */
  heroImage?: string;
  heroImageAlt?: string;
}

// Generic full-lesson template shared by Discover, Stay Safe, and Build's
// per-topic/per-tier pages — same markdown-rendering pattern already
// proven for the Privacy page (react-markdown + remark-gfm, ?raw import).
export function LessonPage({ icon: Icon, title, summary, badge, backTo, backLabel, markdown, heroImage, heroImageAlt }: LessonPageProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        to={backTo}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[var(--aarya-accent)] transition-colors mb-6"
      >
        <ArrowLeft size={13} /> {backLabel}
      </Link>

      <div className="flex items-center gap-2 mb-2">
        <Icon size={20} className="text-[var(--aarya-accent)]" />
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {badge && <Badge label={badge.label} variant={badge.variant} />}
      </div>
      {summary && <p className="text-sm text-slate-400 max-w-xl mb-8">{summary}</p>}

      {heroImage && (
        <img
          src={heroImage}
          alt={heroImageAlt ?? title}
          className="w-full max-w-md mx-auto rounded-2xl mb-8 border border-slate-700/40"
          loading="lazy"
        />
      )}

      <article className="prose prose-invert prose-sm sm:prose-base max-w-none prose-headings:font-black prose-a:text-[var(--aarya-accent)] mb-10">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ blockquote: LessonBlockquote }}>{markdown}</ReactMarkdown>
      </article>

      <GoldenRuleRibbon />
    </div>
  );
}

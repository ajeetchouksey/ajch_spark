import { useParams, Navigate } from 'react-router-dom';
import { DISCOVER_TOPICS } from '@/content/discover';
import { LessonPage } from '@/components/LessonPage';

import whatIsAi from '@/content/discover/what-is-ai.md?raw';
import howMachinesLearn from '@/content/discover/how-machines-learn.md?raw';
import aiInYourDay from '@/content/discover/ai-in-your-day.md?raw';
import aiVsHuman from '@/content/discover/ai-vs-human.md?raw';
import typesOfAi from '@/content/discover/types-of-ai.md?raw';

import whatIsAiHero from '@/assets/discover/what-is-ai-hero.png';
import howMachinesLearnHero from '@/assets/discover/how-machines-learn-hero.png';
import aiInYourDayHero from '@/assets/discover/ai-in-your-day-hero.png';
import aiVsHumanHero from '@/assets/discover/ai-vs-human-hero.png';
import typesOfAiHero from '@/assets/discover/types-of-ai-hero.png';

const CONTENT: Record<string, string> = {
  'what-is-ai': whatIsAi,
  'how-machines-learn': howMachinesLearn,
  'ai-in-your-day': aiInYourDay,
  'ai-vs-human': aiVsHuman,
  'types-of-ai': typesOfAi,
};

// Hero illustrations supplied by the user (C:\Users\ajeet.k.chouksey\Downloads\images).
// 4 were a clean 1:1 topic match; "How AI Works" (Ask→Think→Answer) had no exact
// match — used here for Types of AI since its content is a chatbot's ask/think/
// answer loop, one of the 5 "types" this lesson covers. Flagged in the summary,
// not a silent guess.
const HERO_IMAGES: Record<string, string> = {
  'what-is-ai': whatIsAiHero,
  'how-machines-learn': howMachinesLearnHero,
  'ai-in-your-day': aiInYourDayHero,
  'ai-vs-human': aiVsHumanHero,
  'types-of-ai': typesOfAiHero,
};

export default function DiscoverLesson() {
  const { slug = '' } = useParams();
  const topic = DISCOVER_TOPICS.find((t) => t.slug === slug);
  const markdown = CONTENT[slug];

  if (!topic || !markdown) return <Navigate to="/discover" replace />;

  return (
    <LessonPage
      icon={topic.icon}
      title={topic.title}
      summary={topic.summary}
      backTo="/discover"
      backLabel="All Discover topics"
      markdown={markdown}
      heroImage={HERO_IMAGES[slug]}
    />
  );
}

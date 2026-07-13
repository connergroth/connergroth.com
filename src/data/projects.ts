export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  figCaption: string;
  meta: { label: string; value: string }[];
  url?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    slug: 'spot',
    title: 'Spot',
    description:
      'AI gym coach that lives in iMessage. Plans your day around your goals and texts first when you slip.',
    longDescription:
      'A gym coach that lives in your texts. Spot plans your day so the treats fit, and texts you first when you are about to slip — proactive coaching instead of another app to open.',
    image: '/assets/images/spot.png',
    figCaption:
      'Spot landing page. The coach texts first — proactive check-ins in iMessage instead of another dashboard.',
    meta: [
      { label: 'role', value: 'founder, eng' },
      { label: 'year', value: '2026 —' },
      { label: 'status', value: 'in progress' },
      { label: 'site', value: 'spot-black-gamma.vercel.app' },
    ],
    url: 'https://spot-black-gamma.vercel.app',
  },
  {
    slug: 'sift',
    title: 'Sift',
    description:
      'AI academic assistant for iMessage. Canvas, Calendar, Gmail integration with LangChain workflows.',
    longDescription:
      'An AI academic assistant that lives in iMessage. Synthesizes your week across Canvas, Calendar, Gmail, and iCal into a single briefing you can actually act on.',
    image: '/assets/images/sift.png',
    figCaption:
      'Weekly briefing rendered in iMessage. Sift synthesizes calendar, assignments, and unread messages into a single conversational digest.',
    meta: [
      { label: 'role', value: 'founder, eng' },
      { label: 'year', value: '2025' },
      { label: 'stack', value: 'swift, fastapi, langchain' },
      { label: 'status', value: 'private beta' },
      { label: 'site', value: 'usesift.app' },
    ],
    url: 'https://usesift.app',
    github: 'https://github.com/lucencelabs/Sift-Public',
  },
  {
    slug: 'seqimprove',
    title: 'SeqImprove',
    description:
      'AI-assisted sequence annotation for synthetic biology researchers.',
    longDescription:
      'An AI-assisted sequence annotation tool to help synthetic biology researchers curate and annotate genetic designs in SBOL format. Provides automated annotation suggestions and an intuitive interface for adding metadata to genetic designs.',
    image: '/assets/images/seqimprove.png',
    figCaption:
      'Sequence annotation interface showing AI-suggested annotations for genetic parts in SBOL format.',
    meta: [
      { label: 'role', value: 'lead developer' },
      { label: 'year', value: '2024 —' },
      { label: 'stack', value: 'react, python, flask' },
      { label: 'status', value: 'live' },
      { label: 'site', value: 'seqimprove.synbiohub.org' },
    ],
    url: 'https://seqimprove.synbiohub.org',
    github: 'https://github.com/MyersResearchGroup/SeqImprove',
  },
];

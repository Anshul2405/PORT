export type HowIBuildStage = {
  id: number
  label: string
  title: string
  description: string
  deliverable: string
  duration: string
}

/** Same stages as the How I build section — used on the MacBook screen canvases too. */
export const HOW_I_BUILD_STAGES: HowIBuildStage[] = [
  {
    id: 1,
    label: 'STAGE 01 / DISCOVERY',
    title: 'Understanding the problem before writing a line.',
    description:
      'Every build starts with a deep requirements session. I map the business logic, user flows, and technical constraints before anything touches code.',
    deliverable: 'REQUIREMENTS DOC',
    duration: '2 DAYS',
  },
  {
    id: 2,
    label: 'STAGE 02 / ARCHITECTURE',
    title: "Designing systems that don't break at 3am.",
    description:
      'System design before UI design. I map the data flow, API contracts, and infrastructure topology so the codebase scales from day one.',
    deliverable: 'SYSTEM DESIGN DOC',
    duration: '3 DAYS',
  },
  {
    id: 3,
    label: 'STAGE 03 / DESIGN',
    title: 'Making it feel as good as it works.',
    description:
      'I build a minimal design system first — colors, type scale, spacing tokens. Then components. No Figma handoff chaos — I design in code.',
    deliverable: 'DESIGN SYSTEM + WIREFRAMES',
    duration: '4 DAYS',
  },
  {
    id: 4,
    label: 'STAGE 04 / DEVELOPMENT',
    title: "Writing code that future-me won't hate.",
    description:
      'TypeScript-first. Component-driven. Every function has a single responsibility. I ship features in isolated branches and merge with full context.',
    deliverable: 'WORKING CODEBASE',
    duration: '10 DAYS',
  },
  {
    id: 5,
    label: 'STAGE 05 / TESTING',
    title: 'Breaking it before the client does.',
    description:
      'Unit tests, integration tests, and manual QA across devices. I test on real devices, not just Chrome. Zero regressions policy before any deployment.',
    deliverable: 'TEST REPORT',
    duration: '3 DAYS',
  },
  {
    id: 6,
    label: 'STAGE 06 / DEPLOYMENT',
    title: 'Shipping to production. Zero downtime.',
    description:
      'CI/CD pipeline, environment variables locked, Vercel/AWS deployment with rollback capability. The client gets a live URL, not a Loom recording.',
    deliverable: 'LIVE URL',
    duration: '1 DAY',
  },
  {
    id: 7,
    label: 'STAGE 07 / ITERATION',
    title: "Shipped isn't finished. Iteration is.",
    description:
      'Post-launch monitoring, client feedback integration, and performance optimization. I stay on until the product is truly done, not just deployed.',
    deliverable: 'MAINTAINED PRODUCT',
    duration: 'ONGOING',
  },
]

export const HOW_I_BUILD_STAGE_NAV_SHORT = [
  'DISCOVERY',
  'ARCHITECTURE',
  'DESIGN SYSTEM',
  'DEVELOPMENT',
  'TESTING',
  'DEPLOYMENT',
  'FEEDBACK',
] as const

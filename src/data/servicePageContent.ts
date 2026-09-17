export interface ServicePageContent {
  process: { title: string; description: string }[];
  audience: { title: string; description: string }[];
  outcomes: string[];
  faqs: { q: string; a: string }[];
  testimonialIds: number[];
}

export const servicePageContent: Record<string, ServicePageContent> = {
  consulting: {
    process: [
      {
        title: 'Discovery & Entity Audit',
        description:
          'Deep audit of crawl logs, search intent patterns, knowledge graph entities, and indexation bottlenecks to pinpoint the true growth constraint.',
      },
      {
        title: 'Growth Architecture Plan',
        description:
          'A prioritized roadmap that re-architects taxonomy, entity schema, content intent, and conversion paths to compound over quarters.',
      },
      {
        title: 'Implementation & Enablement',
        description:
          'Work side-by-side with your engineering and content teams to ship technical fixes, intent-first assets, and AI-citation-ready content.',
      },
      {
        title: 'Measure, Iterate & Scale',
        description:
          'Pipeline-linked tracking with weekly iteration loops — doubling down on what drives qualified leads and pruning dead-weight URLs.',
      },
    ],
    audience: [
      {
        title: 'Founders & CEOs',
        description:
          'Leaders who want organic search to become a defensible, compounding revenue engine rather than an unpredictable cost center.',
      },
      {
        title: 'CMOs & Marketing VPs',
        description:
          'Marketing heads who need high-conviction architecture to scale organic acquisition, navigate AI search disruptions, and align their teams.',
      },
      {
        title: 'In-House Growth & SEO Teams',
        description:
          'Internal teams looking for a seasoned search veteran to solve complex crawl traps, build schema graphs, and raise the bar.',
      },
    ],
    outcomes: [
      'Comprehensive organic growth architecture roadmap',
      'Technical SEO, crawlability & entity schema plan',
      'Intent-first content strategy & information gain model',
      'Generative Engine Optimization (GEO) citation framework',
      'Conversion path & bottom-of-funnel re-architecture',
      'Internal team enablement & repeatable SOPs',
    ],
    faqs: [
      {
        q: 'How long does a consulting engagement last?',
        a: 'Engagements typically run 3–6 months with weekly strategic sprints, followed by a transition phase where your internal team is enabled to operate autonomously.',
      },
      {
        q: 'Do you work hands-on or strategy-only?',
        a: 'Both. Himani and the Missive Digital team provide high-level strategic direction while directly auditing code, schema markup, and editorial pieces with your team.',
      },
      {
        q: 'How do you measure success?',
        a: 'Every milestone ties back to pipeline and revenue: qualified inbound leads, demo requests, assisted conversions, and AI engine citation growth — never vanity rankings.',
      },
      {
        q: 'What makes your GEO (Generative Engine Optimization) approach different?',
        a: 'We architect brand entities, schema markup, and authoritative citations so your brand is referenced by ChatGPT, Perplexity, and Google AI Overviews while still capturing traditional search demand.',
      },
      {
        q: 'Will our team be trained as part of the engagement?',
        a: 'Yes. Every consulting engagement is designed to build organizational capability, ensuring your team can maintain and expand the growth engine long after the contract concludes.',
      },
    ],
    testimonialIds: [4, 5, 2],
  },

  coaching: {
    process: [
      {
        title: 'Assessment & Goal Setting',
        description:
          'A comprehensive audit of your current positioning, strengths, constraints, and the specific 90-day authority and pipeline outcomes you need.',
      },
      {
        title: 'Custom Advisory Path',
        description:
          'A bespoke curriculum across executive presence, organic growth, Generative AI workflows, and thought leadership — built around your real business context.',
      },
      {
        title: 'Weekly 1:1 Advisory Sessions',
        description:
          'Live deep-work sessions mixing strategic coaching, teardowns of your live marketing campaigns, and real-time decision support.',
      },
      {
        title: 'Apply, Review & Compound',
        description:
          'Practical sprint assignments between sessions, async review loops on your content and decks, and an enduring leadership playbook.',
      },
    ],
    audience: [
      {
        title: 'Marketing Leaders & Heads of Growth',
        description:
          'Leaders who want to sharpen their strategic authority, command boardroom respect, and master AI-first marketing.',
      },
      {
        title: 'Founders Building Category Authority',
        description:
          'Founders who want to build a personal brand and company narrative that attracts high-ticket inbound clients.',
      },
      {
        title: 'Independent Consultants & Strategists',
        description:
          'Consultants looking to scale their service pricing, win enterprise retainers, and build defensible market positioning.',
      },
    ],
    outcomes: [
      'Strategic clarity & executive decision-making framework',
      'Personal brand & LinkedIn thought leadership engine',
      'Custom AI co-piloting stack for marketing leadership',
      'High-converting content and presentation frameworks',
      'Stakeholder communication & cross-functional leadership toolkit',
      'A measurable 90-day executive roadmap',
    ],
    faqs: [
      {
        q: 'Who is executive coaching best for?',
        a: 'Founders, CMOs, heads of growth, and ambitious marketers who want 1-on-1 strategic guidance from a 15-year search veteran rather than generic courses.',
      },
      {
        q: 'How are sessions structured and delivered?',
        a: 'Sessions are 60-minute weekly video calls with dedicated WhatsApp/Slack async access between sessions for rapid feedback on live documents and campaigns.',
      },
      {
        q: 'What is the difference between coaching and consulting?',
        a: 'Coaching focuses on building you as a leader and strategist through 1:1 mentorship, whereas consulting involves auditing and re-architecting your company’s entire organic marketing engine.',
      },
      {
        q: 'Can coaching focus on LinkedIn personal branding?',
        a: 'Yes. Many executives work with Himani specifically to optimize their LinkedIn presence, ghostwrite authoritative posts, and generate inbound B2B pipeline.',
      },
      {
        q: 'How quickly will I see results?',
        a: 'Most clients experience immediate clarity and improved content engagement within 2–3 weeks, with significant inbound authority building within 60–90 days.',
      },
    ],
    testimonialIds: [2, 3, 4],
  },

  training: {
    process: [
      {
        title: 'Track Selection & Diagnostic Audit',
        description:
          'We evaluate your team or individual goals across our 4 specialized tracks: Content Writing, LinkedIn, Team Enablement, or the Symposium.',
      },
      {
        title: 'Bespoke Curriculum & Live Case Studies',
        description:
          'We build hands-on exercises, live audit rubrics, and teardowns drawn directly from your domain and competitors.',
      },
      {
        title: 'Interactive Delivery & Live Teardowns',
        description:
          'Immersive, interactive workshops featuring real-time writing clinics, prompt labs, and live audits — never passive slides.',
      },
      {
        title: 'Playbooks, SOPs & Ongoing Office Hours',
        description:
          'Teams receive permanent playbooks, templates, and office hour access so the training embeds into daily operational muscle.',
      },
    ],
    audience: [
      {
        title: 'Writers, Editors & Content Teams',
        description:
          'Content creators wanting to master Intent-First writing, Information Gain, and AI integration via Content Writing Training or the Symposium.',
      },
      {
        title: 'Founders, CEOs & Sales Executives',
        description:
          'Business leaders looking to build an undeniable personal brand and generate organic inbound pipeline through LinkedIn Training.',
      },
      {
        title: 'Enterprise & In-House Marketing Departments',
        description:
          'Organizations seeking a dedicated Marketing Trainer to build an autonomous, agency-free internal organic growth engine.',
      },
    ],
    outcomes: [
      'Mastery across selected training tracks (Content, LinkedIn, Teams, Symposium)',
      'Customized team playbooks, writing SOPs, and checklists',
      'Live audit teardowns and hands-on writing clinic feedback',
      'AI prompt libraries and research templates',
      'Recorded session repository for future company hires',
      'Certificates of Completion & Alumni Community Access',
    ],
    faqs: [
      {
        q: 'What are the 4 specialized training tracks offered?',
        a: '1. Intent-Led Content Strategy & Writing Masterclass; 2. LinkedIn Thought Leadership & Executive Presence; 3. Corporate Marketing Trainer for In-House Teams; 4. Content Writers’ Symposium (Community Workshops).',
      },
      {
        q: 'Can our company hire Himani as an in-house marketing trainer?',
        a: 'Yes. Himani regularly conducts 2-day on-site corporate bootcamps and multi-week team enablement programs for tech companies, SaaS brands, and agencies worldwide.',
      },
      {
        q: 'What is the Content Writers’ Symposium and how can I attend?',
        a: 'The Content Writers’ Symposium is a flagship community workshop founded by Himani Kankaria and Missive Digital in Ahmedabad. It features live writing teardowns, research clinics, and networking for writers and marketers. We offer both in-person and virtual editions.',
      },
      {
        q: 'How does the LinkedIn Personal Branding training work?',
        a: 'It is available as an executive 1:1 intensive or a team workshop, teaching profile optimization, algorithmic reach, storytelling carousels, and converting engagement into qualified inbound leads.',
      },
      {
        q: 'Are training sessions recorded for our team?',
        a: 'Yes. All virtual training sessions are recorded, indexed, and provided alongside slide decks, templates, and SOPs for your team’s permanent internal library.',
      },
    ],
    testimonialIds: [7, 2, 5],
  },

  speaking: {
    process: [
      {
        title: 'Event Theme & Brief Alignment',
        description:
          'We align on your conference audience profile, event theme, and the exact strategic takeaways attendees should bring back to their desks.',
      },
      {
        title: 'Custom Keynote Architecture',
        description:
          'A bespoke presentation built for your stage: proprietary data, battle-tested frameworks, and real client case teardowns.',
      },
      {
        title: 'Rehearsal & Narrative Tuning',
        description:
          'Dry runs, slide design polish, and timing checks to ensure delivery is sharp, energetic, and memorable.',
      },
      {
        title: 'High-Impact Delivery & Live Q&A',
        description:
          'Captivating stage delivery backed by actionable masterclass frameworks, audience Q&A, and post-event panel participation.',
      },
    ],
    audience: [
      {
        title: 'Global Search & Digital Summits',
        description:
          'Premier international conferences like brightonSEO, Semrush, and Whitespark looking for world-class search expertise.',
      },
      {
        title: 'Corporate Leadership Summits',
        description:
          'Enterprise offsites and executive gatherings seeking inspirational yet deeply actionable perspectives on AI search.',
      },
      {
        title: 'Universities & Industry Communities',
        description:
          'Academic institutions, WordCamps, and digital marketing associations looking for practitioner-led insights.',
      },
    ],
    outcomes: [
      'Custom keynote or masterclass tailored to your attendees',
      'Proprietary framework slides and visual takeaways',
      'Interactive live Q&A and panel participation',
      'Speaker one-pager, bio, and press-ready promotional assets',
      'Post-event attendee follow-up resource bundle',
      'Consistent top-rated speaker evaluations',
    ],
    faqs: [
      {
        q: 'What topics does Himani speak on?',
        a: 'Key topics include: The Future of Search in an AI-First World, Generative Engine Optimization (GEO), Citation Architecture for ChatGPT & Perplexity, Intent-Led Content, and Re-Architecting Organic Revenue.',
      },
      {
        q: 'What global conferences has Himani spoken at?',
        a: 'Himani has delivered keynotes and sessions at brightonSEO (UK), Whitespark Local Search Summit (US/Canada), Semrush, International Search Summit (Spain), WordCamp, and Meet Magento.',
      },
      {
        q: 'Can a keynote be paired with a hands-on workshop?',
        a: 'Yes. Many event organizers pair a 45-minute keynote with a 90-minute or half-day interactive writing or SEO audit masterclass for VIP attendees.',
      },
      {
        q: 'Does Himani travel internationally for events?',
        a: 'Yes. Himani travels globally for major conferences and corporate offsites, and is also available for high-production virtual keynotes.',
      },
      {
        q: 'How far in advance should we book?',
        a: 'Due to international travel and speaking schedules, organizers typically reach out 2–6 months in advance of the event date.',
      },
    ],
    testimonialIds: [1, 6, 3],
  },
};
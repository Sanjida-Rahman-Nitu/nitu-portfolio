/**
 * All of the site's text lives here.
 * To update the portfolio, edit this file — the components read from it.
 */

/** Text with optional inline links: plain strings, or { text, href } for a link. */
export type RichText = Array<string | { text: string; href: string }>;

export const profile = {
  firstName: 'Shah Sanjida',
  lastName: ['Rahman', 'Nitu'] as const,
  fullName: 'Shah Sanjida Rahman Nitu',
  role: 'Machine Learning Researcher',
  email: 'sanjidarahmannitu24@gmail.com',
  location: 'Rajshahi, Bangladesh',
  linkedin: 'https://www.linkedin.com/in/sanjida-rahman-nitu',
  github: 'https://github.com/Sanjida-Rahman-Nitu',
  photo: '/photo.jpg',
  cv: '/Shah_Sanjida_Rahman_Nitu_CV.pdf',
  kicker: 'Machine learning × exoplanets',
  tagline: {
    before: 'When a planet crosses its star, the light drops by less than one percent. I build ',
    highlight: 'machine learning that notices that dip',
    after: ", and that knows when it isn't sure.",
  },
};

export const catalogueStrip: Array<[string, string]> = [
  ['OBJECT', 'S. S. R. Nitu'],
  ['CLASS', 'ML researcher · CSE, Rajshahi University of Engineering & Technology (RUET)'],
  ['OBSERVED FROM', 'Rajshahi 24.37°N 88.60°E'],
  ['STATUS', 'Open to research & AI roles'],
];

export const about = {
  heading: ['Finding faint signals', 'in noisy data'],
  paragraphs: [
    "I'm a final-year Computer Science and Engineering student at Rajshahi University of Engineering & Technology (RUET), Bangladesh. My research uses machine learning on real astronomical data from NASA's TESS and Kepler missions. That means grouping thousands of stars by their light patterns, flagging signals nobody has catalogued, and asking how much a model's answer can be trusted.",
    'Outside the lab I lead. I managed a student startup to pre-seed funding, help run two university organisations, mentor new student researchers, and have hosted more than ten professional events.',
  ],
  facts: [
    ['Degree', 'B.Sc. in Computer Science & Engineering, Rajshahi University of Engineering & Technology (RUET)'],
    ['Graduating', 'March 2027'],
    ['CGPA', '3.34 / 4.00'],
    ['Focus', 'Unsupervised learning, anomaly detection, uncertainty estimation'],
    ['Languages', 'Bangla, English'],
  ] as Array<[string, string]>,
};

export type ResearchProject = {
  id: string;
  title: string;
  summary: string;
  meta: string[];
  status: string;
};

export const research: ResearchProject[] = [
  {
    id: 'OBS-01',
    title: 'Unsupervised Clustering Benchmark for TESS Light Curves',
    summary:
      'Grouping TESS light curves without labels, then testing whether some clusters hold more known planet-hosting stars than chance would predict.',
    meta: ['TESS · Sectors 1–5', '5,000 stars per sector'],
    status: 'In progress',
  },
  {
    id: 'OBS-02',
    title:
      'A Gap-Aware and Transit-Preserving Preprocessing Framework for Unsupervised Analysis of TESS Light Curves',
    summary:
      'Real light curves have gaps between observations. This pipeline handles those gaps without smoothing away the small transit dips the later models need.',
    meta: ['TESS · MAST archive', 'Time-series preprocessing'],
    status: 'In progress',
  },
  {
    id: 'OBS-03',
    title:
      'Unsupervised Discovery of Potentially Uncatalogued Exoplanets Using Self-Supervised Representation Learning and Anomaly Detection',
    summary:
      'Learning compact representations of light curves on their own, then searching for unusual, transit-like signals that may belong to planets not yet in any catalogue.',
    meta: ['TESS', 'Self-supervised · anomaly detection'],
    status: 'In progress',
  },
  {
    id: 'OBS-04',
    title: 'Uncertainty-Aware Machine Learning for Reliable Exoplanet Candidate Validation',
    summary:
      'Pairing every prediction with a measure of confidence, so that uncertain exoplanet candidates are sent for expert review instead of being accepted automatically.',
    meta: ['Kepler dataset', 'Uncertainty estimation'],
    status: 'In progress',
  },
];

export const researchNote =
  'All projects are ongoing under faculty supervision. No results or publications are claimed yet.';

export const dataSources: Array<{ big: string; title: string; body: RichText }> = [
  {
    big: '25,000',
    title: 'TESS light curves',
    body: [
      'Development set: 5,000 random stars from each of Sectors 1–5, from the ',
      { text: 'NASA MAST archive', href: 'https://archive.stsci.edu/tess/bulk_downloads/bulk_downloads_ffi-tp-lc-dv.html' },
      '.',
    ],
  },
  {
    big: '27.4 d',
    title: 'Per TESS sector',
    body: [
      'Each sector is about 27 days of brightness readings, with a gap in the middle. That gap is why the preprocessing project exists.',
    ],
  },
  {
    big: '2',
    title: 'Kepler exoplanet tables',
    body: [
      'A ',
      { text: 'standard', href: 'https://gitlab.com/mirsakhawathossain/new-dataset/-/raw/main/Final_Dataset/exodata.csv' },
      ' and an ',
      { text: 'extended', href: 'https://gitlab.com/mirsakhawathossain/new-dataset/-/raw/main/Final_Dataset/exodata_big.csv' },
      ' CSV, used for candidate validation.',
    ],
  },
];

export const skills: Array<[string, string[]]> = [
  ['Programming', ['Python', 'Git & GitHub']],
  ['Machine learning', ['Clustering', 'Anomaly detection', 'Uncertainty estimation', 'Classification']],
  ['Deep learning', ['TensorFlow', 'Neural networks', 'Self-supervised learning']],
  ['Environment', ['Google Colab', 'Time-series data', 'Data analysis']],
];

export type TimelineItem = {
  title: string;
  org?: RichText;
  when?: string;
  text?: string;
  /** LinkedIn posts that back up this item, shown as "LinkedIn post" badges. */
  posts?: Array<{ label: string; href: string }>;
  highlight?: boolean;
};

export const leadership: TimelineItem[] = [
  {
    highlight: true,
    title: 'Project Manager & Team Leader',
    org: ['SpaceShare Solutions · student startup'],
    text: "Led the team through refining the idea and building a scalable business model. We won pre-seed funding from the University Innovation Hub Program (UIHP) at Rajshahi University of Engineering & Technology (RUET) under the DEIED Project.",
    posts: [{ label: 'Funding announcement', href: 'https://www.linkedin.com/feed/update/urn:li:activity:7462529923300151296/' }],
  },
  { when: 'Sep 2026 – Mar 2027', title: 'Vice President, Monitoring & Evaluation', org: ['RUET Computing Society'] },
  {
    when: 'Sep 2026 – Mar 2027',
    title: 'Vice Chair, Program Management',
    org: ['RUET CORE · Collaborative Opportunities in Research and Education'],
  },
  { title: 'Research Mentor', org: ['RUET CORE'], text: 'Guide students who are starting their first research projects.' },
];

export const milestones: TimelineItem[] = [
  {
    highlight: true,
    when: 'UIHP · RUET',
    title: 'Pre-seed funding winner',
    org: ['SpaceShare Solutions'],
    posts: [{ label: 'Funding announcement', href: 'https://www.linkedin.com/feed/update/urn:li:activity:7462529923300151296/' }],
  },
  { highlight: true, when: '2025', title: 'Accomplished Competitor', org: ['University Physics Competition'] },
  {
    when: '2026',
    title: 'Competitor, Problem B',
    org: ['University Physics Competition'],
    text: 'Code and statistics lead in a team of three, predicting the path of a penalty kick.',
  },
  {
    title: 'AI/ML Training Program',
    org: ['Phitron'],
    text: 'Completed Python for ML, Machine Learning and Deep Learning; selected for a three-month thesis track on NLP and LLMs.',
    posts: [{ label: 'Selection post', href: 'https://www.linkedin.com/feed/update/urn:li:activity:7462883830224457728/' }],
  },
  {
    title: 'Anchor, National Android Development Bootcamp',
    org: ['Sponsored by bdapps with MIAKI'],
    posts: [{ label: 'Event post', href: 'https://www.linkedin.com/feed/update/urn:li:activity:7462881564134105089/' }],
  },
  {
    title: 'Volunteer, WordCamp Rajshahi 2026',
    org: ['WordPress and open-source community event'],
    posts: [
      { label: 'Contributor Day', href: 'https://lnkd.in/p/guPiG_dJ' },
      { label: 'Conference Day', href: 'https://lnkd.in/p/gZ6CcyKE' },
    ],
  },
  { title: 'Host of 10+ professional events', org: ['Technical programmes, club events, orientations, corporate events'] },
];

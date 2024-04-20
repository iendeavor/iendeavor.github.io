export type Project = {
  name: string
  href: string
  description: string
  status: string
  skills: string[]
  badges?: string[]
  preview?: string
}

export type Skill = {
  name: string
  count: number
}

export const projects: Project[] = [
  {
    name: 'Inspect Element',
    href: 'https://chrome.google.com/webstore/detail/flgcpmeleoikcibkiaiindbcjeldcogp',
    description: 'Chrome extension for inspecting element for content, and margin.',
    status: 'stable',
    skills: ['java script'],
    badges: [
      'https://img.shields.io/chrome-web-store/users/flgcpmeleoikcibkiaiindbcjeldcogp?labelColor=13171F&color=27292F'
    ]
  },
  {
    name: 'gRPC devtools',
    href: 'https://chrome.google.com/webstore/detail/fohdnlaeecihjiendkfhifhlgldpeopm',
    description: 'Browser DevTools extension for debugging gRPC network requests.',
    badges: [
      'https://img.shields.io/chrome-web-store/users/fohdnlaeecihjiendkfhifhlgldpeopm?labelColor=13171F&color=27292F'
    ],
    skills: ['java script', 'react', 'tailwindcss'],
    status: 'stable',
    preview: 'grpc-devtools.png'
  },
  {
    name: 'Find',
    href: 'https://chromewebstore.google.com/detail/akaeoepndhnhffnginkbdcoigbpnnljh',
    description: 'An extension for Regex Find. Search for regular expressions within webpages.',
    status: 'beta',
    skills: ['java script', 'react'],
    badges: [
      'https://img.shields.io/chrome-web-store/users/akaeoepndhnhffnginkbdcoigbpnnljh?labelColor=13171F&color=27292F'
    ],
    preview: 'find.png'
  },
  {
    name: '@import-meta-env',
    href: 'https://www.npmjs.com/package/@import-meta-env/cli',
    description: 'Startup/Runtime environment variables solution for JavaScript.',
    status: 'stable',
    skills: ['java script', 'rust', 'unplugin', 'babel', 'swc', 'type script'],
    badges: ['https://img.shields.io/npm/dw/@import-meta-env/cli?labelColor=13171F&color=27292F'],
    preview: 'import-meta-env.png'
  },
  {
    name: '@runtime-env',
    href: 'https://www.npmjs.com/package/@runtime-env/cli',
    description: 'General purpose runtime env var solution for JavaScript apps.',
    status: 'stable',
    skills: ['java script', 'type script'],
    badges: ['https://img.shields.io/npm/dw/@runtime-env/cli?labelColor=13171F&color=27292F']
  },
  {
    name: 'shorten-commit-sha',
    href: 'https://github.com/marketplace/actions/shorten-commit-sha',
    description: 'A Github Action to Export env and output sha with a shortened commit SHA.',
    skills: ['java script', 'github'],
    status: 'stable'
  },
  {
    name: 'zod-schema-faker',
    href: 'https://www.npmjs.com/package/zod-schema-faker',
    description: 'Fake data generator for zod.',
    status: 'stable',
    skills: ['java script'],
    badges: ['https://img.shields.io/npm/dw/zod-schema-faker?labelColor=13171F&color=27292F']
  },
  {
    name: 'yup-schema-faker',
    href: 'https://www.npmjs.com/package/yup-schema-faker',
    description: 'Fake data generator for yup.',
    status: 'stable',
    skills: ['java script'],
    badges: ['https://img.shields.io/npm/dw/yup-schema-faker?labelColor=13171F&color=27292F']
  },
  {
    name: 'object-visualizer',
    href: 'https://www.npmjs.com/package/object-visualizer',
    description: 'Vue JSON inspector with Chrome-like theme.',
    status: 'stable',
    skills: ['java script'],
    badges: ['https://img.shields.io/npm/dw/object-visualizer?labelColor=13171F&color=27292F'],
    preview: 'object-visualizer.png'
  },
  {
    name: 'vue-next-select',
    href: 'https://www.npmjs.com/package/vue-next-select',
    description: 'The selecting solution for Vue 3.',
    status: 'stable',
    skills: ['java script', 'vue'],
    badges: ['https://img.shields.io/npm/dw/vue-next-select?labelColor=13171F&color=27292F']
  },
  {
    name: 'pinia-plugin-persistedstate-2',
    href: 'https://www.npmjs.com/package/pinia-plugin-persistedstate-2',
    description: 'Persist and rehydrate your Pinia state between page reloads.',
    status: 'stable',
    skills: ['java script', 'vue', 'pinia'],
    badges: [
      'https://img.shields.io/npm/dw/pinia-plugin-persistedstate-2?labelColor=13171F&color=27292F'
    ],
    preview: 'pinia-plugin-persisted-state-2.png'
  },
  {
    name: 'assistive_touch',
    href: 'https://pub.dev/packages/assistive_touch',
    description: 'A widget just like iPhone Assistive Touch.',
    skills: ['dart', 'flutter'],
    status: 'stable',
    preview: 'assistive-touch.png'
  },
  {
    name: 'element-ui-sticky-table',
    href: 'https://www.npmjs.com/package/element-ui-sticky-table',
    description: 'Sticky for element-ui table.',
    status: 'stable',
    skills: ['java script'],
    badges: [
      'https://img.shields.io/npm/dw/element-ui-sticky-table?labelColor=13171F&color=27292F'
    ],
    preview: 'element-ui-sticky-table.png'
  },
  {
    name: 'namanager',
    href: 'https://pypi.org/project/namanager/',
    description:
      "A file or/and directory name manager which could determinenames are/aren't expectable, and you could also automatically rename it.",
    status: 'stable',
    skills: ['python'],
    badges: ['https://img.shields.io/pypi/dw/namanager?labelColor=13171F&color=27292F']
  }
]
  .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
  .sort((a, b) => +!!b.preview - +!!a.preview)
  .map((project) => ({
    ...project,
    skills: project.skills.map((skill) => skill.toLowerCase())
  }))

import {
  ContentRating,
  type ExtensionInfo,
  SourceIntents,
} from '@paperback/types'

export default {
  version: '2.1',
  name: 'Komga',
  icon: 'icon.png',
  developers: [
    {
      name: 'Faizan Durrani',
      github: 'FaizanDurrani',
    },
    {
      name: 'Lemon',
      github: 'FramboisePi',
    },
  ],
  description: 'Komga client extension for Paperback',
  contentRating: ContentRating.EVERYONE,
  badges: [
    {
      label: 'Self hosted',
      backgroundColor: '#000000',
      textColor: '#ffffff',
    },
  ],
  capabilities: [
    SourceIntents.SEARCH_RESULTS_PROVIDING,
    SourceIntents.CHAPTER_PROVIDING,
    SourceIntents.SETTINGS_FORM_PROVIDING,
  ],
} satisfies ExtensionInfo

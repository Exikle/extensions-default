import { ContentRating, SourceInfo, SourceIntents } from "@paperback/types"

export default {
    version: '2.0',
    name: 'Komga',
    icon: 'icon.png',
    developers: [
        {
            name: "Faizan Durrani",
            github: "FaizanDurrani"
        },
        {
            name: "Lemon",
            github: "FramboisePi"
        }
    ],
    description: 'Komga client extension for Paperback',
    contentRating: ContentRating.EVERYONE,
    badges: [
        {
            label: 'Self hosted',
            backgroundColor: "#000000",
            textColor: "#ffffff"
        },
    ],
    capabilities: SourceIntents.MANGA_CHAPTERS | SourceIntents.HOMEPAGE_SECTIONS | SourceIntents.SETTINGS_UI | SourceIntents.MANGA_TRACKING
} satisfies SourceInfo
// This source use Komga REST API
// https://komga.org/guides/rest.html
// Manga are represented by `series`
// Chapters are represented by `books`
// The Basic Authentication is handled by the interceptor
// Code and method used by both the source and the tracker are defined in the duplicated `KomgaCommon.ts` file
// Due to the self hosted nature of Komga, this source requires the user to enter its server credentials in the source settings menu
// Some methods are known to throw errors without specific actions from the user. They try to prevent this behavior when server settings are not set.
// This include:
//  - homepage sections
//  - getTags() which is called on the homepage
//  - search method which is called even if the user search in an other source

import {
  type Chapter,
  type ChapterDetails,
  type ChapterProviding,
  ContentRating,
  type Extension,
  Form,
  type MangaProviding,
  type PagedResults,
  type SearchFilter,
  type SearchQuery,
  type SearchResultItem,
  type SearchResultsProviding,
  type SettingsFormProviding,
  type SourceManga,
  type TagSection,
} from '@paperback/types'
import {
  getBookPages,
  getBooks as getBooksList,
  getSeriesById as getOneSeries,
  getSeries as getSeriesList,
} from './sdk/index.js'
import { client } from './sdk/client.gen.js'
import { KomgaImageInterceptor } from './interceptors/image_interceptor.js'
import { Operator } from './utils.js'
import { getKomgaBaseURL, getKomgaCredentials } from './utils/config.js'
import { SettingsForm } from './forms/settings_form.js'

const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
]
// Number of items requested for paged requests
const PAGE_SIZE = 40
export const parseMangaStatus = (komgaStatus: string): string => {
  return komgaStatus.toLowerCase()
}
export const capitalize = (tag: string): string => {
  return tag.replace(/^\w/, (c) => c.toUpperCase())
}

type IKomgaExtension = Extension &
  MangaProviding &
  SearchResultsProviding &
  ChapterProviding &
  SettingsFormProviding

export class KomgaExtension implements IKomgaExtension {
  imageInterceptor = new KomgaImageInterceptor('images')
  async initialise(): Promise<void> {
    this.imageInterceptor.registerInterceptor()

    client.setConfig({
      baseUrl: getKomgaBaseURL(),
      auth(auth) {
        const { username, password } = getKomgaCredentials()

        if (auth.type == 'http' && auth.scheme == 'basic') {
          return `${username}:${password}`
        }

        return undefined
      },
    })
  }

  async getMangaDetails(mangaId: string): Promise<SourceManga> {
    /*
      In Komga a manga is represented by a `serie`
      */
    const response = await getOneSeries({
      path: { seriesId: mangaId },
    })

    const result = response.data
    if (!result) {
      throw new Error('Series not found')
    }

    const metadata = result.metadata
    const booksMetadata = result.booksMetadata
    const tagSections: [TagSection, TagSection] = [
      { id: '0', title: 'genres', tags: [] },
      { id: '1', title: 'tags', tags: [] },
    ]
    // For each tag, we append a type identifier to its id and capitalize its label
    tagSections[0].tags = metadata.genres.map((elem: string) => ({
      id: 'genre-' + elem,
      title: capitalize(elem),
    }))

    tagSections[1].tags = metadata.tags.map((elem: string) => ({
      id: 'tag-' + elem,
      title: capitalize(elem),
    }))

    const authors: string[] = []
    const artists: string[] = []
    // Additional roles: colorist, inker, letterer, cover, editor
    for (const entry of booksMetadata.authors) {
      if (entry.role === 'writer') {
        authors.push(entry.name)
      }
      if (entry.role === 'penciller') {
        artists.push(entry.name)
      }
    }

    return {
      mangaId: mangaId,
      mangaInfo: {
        thumbnailUrl: `${
          client.getConfig().baseUrl
        }/api/v1/series/${mangaId}/thumbnail`,
        primaryTitle: metadata.title,
        secondaryTitles: [],
        contentRating: ContentRating.EVERYONE,

        status: parseMangaStatus(metadata.status),
        artist: artists.join(', '),
        author: authors.join(', '),
        synopsis: metadata.summary ? metadata.summary : booksMetadata.summary,
        tagGroups: tagSections,
      },
    }
  }

  async getSearchFilters(): Promise<SearchFilter[]> {
    return []
  }

  async getSearchResults(
    searchQuery: SearchQuery,
    metadata: { page: number } | undefined
  ): Promise<PagedResults<SearchResultItem>> {
    // This function is also called when the user search in an other source. It should not throw if the server is unavailable.
    // We won't use `await this.getKomgaAPI()` as we do not want to throw an error
    // const komgaAPI = await getKomgaAPI(stateManager);
    // const { orderResultsAlphabetically } = await getOptions(stateManager);
    const orderResultsAlphabetically = true

    const page: number = metadata?.page ?? 0

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any[] = []
    for (const filter of searchQuery.filters) {
      const value = filter.value

      if (typeof value === 'object') {
        const keys = Object.keys(value)
        for (const key of keys) {
          const operator = value[key]! == 'included' ? 'is' : 'isNot'

          // There are two types of tags: `tag` and `genre`
          if (key.substring(0, 4) == 'tag-') {
            const tag = encodeURIComponent(key.substring(4))
            filters.push({ tag: { operator, value: tag } })
          }

          if (key.substring(0, 6) == 'genre-') {
            const genre = encodeURIComponent(key.substring(6))
            filters.push({ tag: { operator, value: genre } })
          }

          if (key.substring(0, 11) == 'collection-') {
            const collectionId = encodeURIComponent(key.substring(11))
            filters.push({ tag: { operator, value: collectionId } })
          }

          if (key.substring(0, 8) == 'library-') {
            const libraryId = encodeURIComponent(key.substring(8))
            filters.push({ tag: { operator, value: libraryId } })
          }
        }
      }
    }

    const response = await getSeriesList({
      query: {
        page,
        size: PAGE_SIZE,
        sort: [orderResultsAlphabetically ? 'titleSort' : 'lastModified,desc'],
      },
      body: {
        fullTextSearch: searchQuery.title,
        ...(() => {
          if (filters.length > 0) {
            return { condition: { allOf: filters } }
          } else {
            return undefined
          }
        })(),
      },
    })

    const result = response.data
    if (!result) {
      throw new Error(JSON.stringify(response.error))
    }

    const tiles: SearchResultItem[] = []
    for (const serie of result.content ?? []) {
      tiles.push({
        imageUrl: `${client.getConfig().baseUrl}/api/v1/series/${
          serie
        }/thumbnail`,
        title: serie.metadata.title,
        mangaId: serie.id,
        subtitle: undefined,
      })
    }

    // If no series were returned we are on the last page
    metadata = tiles.length === 0 ? undefined : { page: page + 1 }
    return {
      items: tiles,
      metadata,
    }
  }

  async getChapters(sourceManga: SourceManga): Promise<Chapter[]> {
    /*
     * In Komga a chapter is a `book`
     */

    const { data, error } = await getBooksList({
      query: { unpaged: true },
      body: {
        condition: {
          seriesId: Operator({ operator: 'is', value: sourceManga.mangaId }),
          deleted: Operator({ operator: 'isFalse' }),
          mediaStatus: Operator({ operator: 'is', value: 'READY' }),
        },
      },
    })

    if (!data) {
      throw new Error(JSON.stringify(error, undefined, 2))
    }

    const booksResult = data
    const chapters: Chapter[] = []

    const languageCode =
      sourceManga.mangaInfo.additionalInfo?.['language']?.toUpperCase() ??
      'UNKNOWN'
    for (const book of booksResult.content ?? []) {
      chapters.push({
        chapterId: book.id,
        chapNum: parseFloat(book.metadata.number),
        langCode: languageCode,
        title: `${book.metadata.title} (${book.size})`,
        creationDate: new Date(book.fileLastModified),
        sortingIndex: book.metadata.numberSort,
        sourceManga: sourceManga,
      })
    }

    return chapters
  }

  async getChapterDetails(chapter: Chapter): Promise<ChapterDetails> {
    const { data, error } = await getBookPages({
      path: { bookId: chapter.chapterId }, //
    })

    if (!data) {
      throw new Error(JSON.stringify(error, undefined, 2))
    }

    const chapterId = chapter.chapterId
    const result = data
    const pages: string[] = []

    const komgaAPI = client.getConfig().baseUrl
    for (const page of result) {
      let pageUrl = `${komgaAPI}/api/v1/books/${chapterId}/pages/${page.number}`

      if (!SUPPORTED_IMAGE_TYPES.includes(page.mediaType)) {
        pageUrl += '?convert=png'
      }

      pages.push(pageUrl)
    }
    // Determine the preferred reading direction which is only available in the serie metadata
    // const readingDirection = chapter.sourceManga.mangaInfo.additionalInfo?.['readingDirection']
    // const longStrip = readingDirection ? ['VERTICAL', 'WEBTOON'].includes(readingDirection) : false

    return {
      id: chapterId,
      mangaId: chapter.sourceManga.mangaId,
      pages: pages,
    }
  }

  async getSettingsForm(): Promise<Form> {
    return new SettingsForm()
  }
}

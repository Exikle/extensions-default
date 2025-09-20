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
  type DiscoverSection,
  type DiscoverSectionItem,
  type DiscoverSectionProviding,
  DiscoverSectionType,
  type Extension,
  Form,
  type MangaProviding,
  type PagedResults,
  type SearchFilter,
  type SearchQuery,
  type SearchResultItem,
  type SearchResultsProviding,
  type SettingsFormProviding,
  type SortingOption,
  type SourceManga,
  type TagSection,
  type UpdateManager,
} from '@paperback/types'
import {
  getBookPages,
  getBooks as getBooksList,
  getBooksOnDeck,
  getSeriesById as getOneSeries,
  getSeries as getSeriesList,
  getSeriesNew,
  getSeriesUpdated,
} from './sdk/index.js'
import { client } from './sdk/client.gen.js'
import { KomgaImageInterceptor } from './interceptors/image_interceptor.js'
import { isEqualTo, isFalse, Operator } from './utils.js'
import {
  getKomgaBaseURL,
  getKomgaCredentials,
  getShowContinueReading,
  getShowOnDeck,
} from './utils/config.js'
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
  SettingsFormProviding &
  DiscoverSectionProviding

export class KomgaExtension implements IKomgaExtension {
  imageInterceptor = new KomgaImageInterceptor('images')
  async initialise(): Promise<void> {
    this.imageInterceptor.registerInterceptor()

    client.setConfig({
      baseUrl: getKomgaBaseURL(),
      auth(auth) {
        const { username, password } = getKomgaCredentials()
        console.log(JSON.stringify(auth))
        console.log(username)
        console.log(password)

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
      id: 'genre-' + encodeURIComponent(elem),
      title: capitalize(elem),
    }))

    tagSections[1].tags = metadata.tags.map((elem: string) => ({
      id: 'tag-' + encodeURIComponent(elem),
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

    const thumbnailUrl = `${client.getConfig().baseUrl}/api/v1/series/${mangaId}/thumbnail`
    return {
      mangaId: mangaId,
      mangaInfo: {
        thumbnailUrl: thumbnailUrl,
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
      const imageUrl = `${client.getConfig().baseUrl}/api/v1/series/${serie}/thumbnail`

      tiles.push({
        imageUrl: imageUrl,
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
        langCode: book.size,
        title: `${book.metadata.title}`,
        creationDate: new Date(book.fileLastModified),
        sortingIndex: book.metadata.numberSort,
        sourceManga: sourceManga,
        version: languageCode
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

  async getDiscoverSections(): Promise<DiscoverSection[]> {
    const sections: DiscoverSection[] = []

    const showOnDeck = getShowOnDeck()
    const showContinueReading = getShowContinueReading()

    if (showOnDeck) {
      sections.push({
        id: 'showOnDeck',
        title: 'On Deck',
        type: DiscoverSectionType.simpleCarousel,
      })
    }

    if (showContinueReading) {
      sections.push({
        id: 'continueReading',
        title: 'Continue Reading',
        type: DiscoverSectionType.simpleCarousel,
      })
    }

    sections.push({
      id: 'recentlyAdded',
      title: 'Recently Added',
      type: DiscoverSectionType.simpleCarousel,
    })

    sections.push({
      id: 'recentlyUpdated',
      title: 'Recently Updated',
      type: DiscoverSectionType.simpleCarousel,
    })

    return sections
  }

  async getDiscoverSectionItems(
    section: DiscoverSection,
    metadata: { page: number } | undefined
  ): Promise<PagedResults<DiscoverSectionItem>> {
    switch (section.id) {
      case 'showOnDeck': {
        const { data, error } = await getBooksOnDeck({
          query: { page: metadata?.page },
        })

        if (!data) {
          throw new Error(JSON.stringify(error, undefined, 2))
        }

        const items: DiscoverSectionItem[] = []
        for (const serie of data.content ?? []) {
          const thumbnailUrl = `${client.getConfig().baseUrl}/api/v1/books/${serie.id}/thumbnail`

          items.push({
            type: 'simpleCarouselItem',
            title: serie.seriesTitle,
            imageUrl: thumbnailUrl,
            mangaId: serie.seriesId,
            subtitle: undefined,
          })
        }

        return {
          items,
          metadata: data.last ? undefined : { page: (metadata?.page ?? 0) + 1 },
        }
      }
      case 'continueReading': {
        const { data, error } = await getBooksList({
          query: { sort: ['readProgress.readDate,desc'], page: metadata?.page },
          body: {
            condition: {
              deleted: isFalse(),
              readStatus: isEqualTo('IN_PROGRESS'),
            },
          },
        })

        if (!data) {
          throw new Error(JSON.stringify(error, undefined, 2))
        }

        const items: DiscoverSectionItem[] = []
        for (const serie of data.content ?? []) {
          const thumbnailUrl = `${client.getConfig().baseUrl}/api/v1/books/${serie.id}/thumbnail`

          items.push({
            type: 'simpleCarouselItem',
            title: serie.seriesTitle,
            imageUrl: thumbnailUrl,
            mangaId: serie.seriesId,
            subtitle: undefined,
          })
        }

        return {
          items,
          metadata: data.last ? undefined : { page: (metadata?.page ?? 0) + 1 },
        }
      }
      case 'recentlyAdded': {
        const { data, error } = await getSeriesNew({
          query: { page: metadata?.page, deleted: false },
        })

        if (!data) {
          throw new Error(JSON.stringify(error, undefined, 2))
        }

        const items: DiscoverSectionItem[] = []
        for (const serie of data.content ?? []) {
          const thumbnailUrl = `${client.getConfig().baseUrl}/api/v1/series/${serie.id}/thumbnail`

          items.push({
            type: 'simpleCarouselItem',
            title: serie.name,
            imageUrl: thumbnailUrl,
            mangaId: serie.id,
            subtitle: undefined,
          })
        }

        return {
          items,
          metadata: data.last ? undefined : { page: (metadata?.page ?? 0) + 1 },
        }
      }
      case 'recentlyUpdated': {
        const { data, error } = await getSeriesUpdated({
          query: { page: metadata?.page, deleted: false },
        })

        if (!data) {
          throw new Error(JSON.stringify(error, undefined, 2))
        }

        const items: DiscoverSectionItem[] = []
        for (const serie of data.content ?? []) {
          const thumbnailUrl = `${client.getConfig().baseUrl}/api/v1/series/${serie.id}/thumbnail`

          items.push({
            type: 'simpleCarouselItem',
            title: serie.name,
            imageUrl: thumbnailUrl,
            mangaId: serie.id,
            subtitle: undefined,
          })
        }

        return {
          items,
          metadata: data.last ? undefined : { page: (metadata?.page ?? 0) + 1 },
        }
      }
      default: {
        throw new Error('Unknown section')
      }
    }
  }
}

/*

    override async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        // This function is called on the homepage and should not throw if the server is unavailable
        // We won't use `await this.getKomgaAPI()` as we do not want to throw an error on
        // the homepage when server settings are not set
        const komgaAPI = await getKomgaAPI(this.stateManager)
        const { showOnDeck, showContinueReading } = await getOptions(this.stateManager)
        if (komgaAPI === null) {
            console.log('searchRequest failed because server settings are unset')
            const section = App.createHomeSection({
                id: 'unset',
                title: 'Go to source settings to set your Komga server credentials.',
                items: getServerUnavailableMangaTiles(),
                containsMoreItems: false,
                type: 'singleRowNormal'
            })
            sectionCallback(section)
            return
        }
        // The source define two homepage sections: new and latest
        const sections = []
        if (showOnDeck) {
            sections.push(App.createHomeSection({
                id: 'ondeck',
                title: 'On Deck',
                containsMoreItems: false,
                type: 'singleRowNormal'
            }))
        }
        if (showContinueReading) {
            sections.push(App.createHomeSection({
                id: 'continue',
                title: 'Continue Reading',
                containsMoreItems: false,
                type: 'singleRowNormal'
            }))
        }
        sections.push(App.createHomeSection({
            id: 'new',
            title: 'Recently added series',
            containsMoreItems: true,
            type: 'singleRowNormal'
        }))
        sections.push(App.createHomeSection({
            id: 'updated',
            title: 'Recently updated series',
            containsMoreItems: true,
            type: 'singleRowNormal'
        }))
        const promises: Promise<void>[] = []
        for (const section of sections) {
            // Let the app load empty tagSections
            sectionCallback(section)
            let apiPath: string, thumbPath: string, params: string, idProp: keyof BookDto
            switch (section.id) {
                case 'ondeck':
                    apiPath = `${komgaAPI}/books/${section.id}`
                    thumbPath = `${komgaAPI}/books`
                    params = '?page=0&size=20&deleted=false'
                    idProp = 'seriesId'
                    break
                case 'continue':
                    apiPath = `${komgaAPI}/books`
                    thumbPath = `${komgaAPI}/books`
                    params = '?sort=readProgress.readDate,desc&read_status=IN_PROGRESS&page=0&size=20&deleted=false'
                    idProp = 'seriesId'
                    break
                default:
                    apiPath = `${komgaAPI}/series/${section.id}`
                    thumbPath = `${komgaAPI}/series`
                    params = '?page=0&size=20&deleted=false'
                    idProp = 'id'
                    break
            }
            const request = App.createRequest({
                url: apiPath,
                param: params,
                method: 'GET'
            })
            // Get the section data
            promises.push((async () => {
                const data = await this.requestManager.schedule(request, 1)
                const result: PageBookDto = typeof data.data === 'string' ? JSON.parse(data.data) : data.data

                const tiles = []
                if (!result.content) {
                    return
                }

                for (const serie of result.content) {
                    tiles.push(App.createPartialSourceManga({
                        title: serie.metadata.title,
                        image: `${thumbPath}/${serie.id}/thumbnail`,
                        mangaId: serie[idProp],
                        subtitle: undefined
                    }))
                }

                section.items = tiles
                sectionCallback(section)
            })())
        }
        // Make sure the function completes
        await Promise.all(promises)
    }
    override async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults> {
        const komgaAPI = await getKomgaAPI(this.stateManager)
        const page: number = metadata?.page ?? 0
        const request = App.createRequest({
            url: `${komgaAPI}/series/${homepageSectionId}`,
            param: `?page=${page}&size=${PAGE_SIZE}&deleted=false`,
            method: 'GET'
        })
        const data = await this.requestManager.schedule(request, 1)
        const result: PageBookDto = typeof data.data === 'string' ? JSON.parse(data.data) : data.data
        const tiles: PartialSourceManga[] = []
        for (const serie of result.content ?? []) {
            tiles.push(App.createPartialSourceManga({
                title: serie.metadata.title,
                image: `${komgaAPI}/series/${serie.id}/thumbnail`,
                mangaId: serie.id,
                subtitle: undefined
            }))
        }
        // If no series were returned we are on the last page
        metadata = tiles.length === 0 ? undefined : { page: page + 1 }
        return App.createPagedResults({
            results: tiles,
            metadata: metadata
        })
    }
*/

import {
  Form,
  Section,
  SelectRow,
  ToggleRow,
  type FormSectionElement,
} from '@paperback/types'
import {
  getAdultGenres,
  getHideAdultContent,
  setAdultGenres,
  setHideAdultContent,
} from '../utils/config.js'
import { getGenres } from '../sdk/index.js'

export class ContentSettingsForm extends Form {
  private hideAdultContent = getHideAdultContent()
  private adultGenres = getAdultGenres()
  // Populated from the server; getSections is sync so the fetch happens in
  // formWillAppear and reloads the form when it lands
  private availableGenres: string[] = []

  override formWillAppear(): void {
    void this.loadGenres()
  }

  private async loadGenres(): Promise<void> {
    const genres = await getGenres()
      .then((r) => r.data ?? [])
      .catch(() => [])

    // Keep any configured genre the server no longer reports, otherwise
    // selecting it would silently vanish from the list
    this.availableGenres = [
      ...new Set([...genres.map((g) => g.toLowerCase()), ...this.adultGenres]),
    ].sort()

    this.reloadForm()
  }

  override getSections(): FormSectionElement<unknown>[] {
    return [
      Section(
        {
          id: 'adultContent',
          footer:
            'Hides series whose genres match the list below. Komga rarely sets an age rating, so this matches on genres instead. On Deck cannot be filtered because Komga does not expose genres on books.',
        },
        [
          ToggleRow('hideAdultContent', {
            title: 'Hide Adult Content',
            value: this.hideAdultContent,
            onValueChange: Application.Selector(
              this as ContentSettingsForm,
              'hideAdultContentDidChange'
            ),
          }),
          SelectRow('adultGenres', {
            title: 'Genres To Hide',
            value: this.adultGenres,
            minItemCount: 0,
            maxItemCount: this.availableGenres.length,
            layout: 'list',
            items: this.availableGenres.map((genre) => ({
              id: genre,
              title: genre,
            })),
            onValueChange: Application.Selector(
              this as ContentSettingsForm,
              'adultGenresDidChange'
            ),
          }),
        ]
      ),
    ]
  }

  async hideAdultContentDidChange(newValue: boolean): Promise<void> {
    this.hideAdultContent = newValue
    setHideAdultContent(newValue)
    Application.invalidateDiscoverSections()
    this.reloadForm()
  }

  async adultGenresDidChange(newValue: string[]): Promise<void> {
    this.adultGenres = newValue
    setAdultGenres(newValue)
    Application.invalidateDiscoverSections()
    this.reloadForm()
  }
}

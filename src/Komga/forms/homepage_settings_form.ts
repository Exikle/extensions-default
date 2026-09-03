import {
  Form,
  Section,
  ToggleRow,
  type FormSectionElement,
} from '@paperback/types'
import {
  getShowContinueReading,
  getShowOnDeck,
  getShowRecentlyAdded,
  getShowGenres,
  getShowRecentlyUpdated,
  setShowContinueReading,
  setShowOnDeck,
  setShowRecentlyAdded,
  setShowGenres,
  setShowRecentlyUpdated,
} from '../utils/config.js'

export class HomepageSettingsForm extends Form {
  override getSections(): FormSectionElement<unknown>[] {
    return [this.staticHomepageSection()]
  }

  staticHomepageSection(): FormSectionElement<unknown> {
    return Section(
      { id: 'staticHomepageSection', header: 'Static Homepage Sections' },
      [
        ToggleRow('showOnDeck', {
          title: 'On Deck',
          value: getShowOnDeck(),
          onValueChange: Application.Selector(
            this as HomepageSettingsForm,
            'showOnDeckDidChange'
          ),
        }),
        ToggleRow('showContinueReading', {
          title: 'Continue Reading',
          value: getShowContinueReading(),
          onValueChange: Application.Selector(
            this as HomepageSettingsForm,
            'showContinueReadingDidChange'
          ),
        }),
        ToggleRow('showRecentlyAdded', {
          title: 'Recently Added',
          value: getShowRecentlyAdded(),
          onValueChange: Application.Selector(
            this as HomepageSettingsForm,
            'showRecentlyAddedDidChange'
          ),
        }),
        ToggleRow('showRecentlyUpdated', {
          title: 'Recently Updated',
          value: getShowRecentlyUpdated(),
          onValueChange: Application.Selector(
            this as HomepageSettingsForm,
            'showRecentlyUpdatedDidChange'
          ),
        }),
        ToggleRow('showGenres', {
          title: 'Genres',
          value: getShowGenres(),
          onValueChange: Application.Selector(
            this as HomepageSettingsForm,
            'showGenresDidChange'
          ),
        }),
      ]
    )
  }

  async showOnDeckDidChange(newValue: boolean): Promise<void> {
    setShowOnDeck(newValue)
    Application.invalidateDiscoverSections()
  }

  async showContinueReadingDidChange(newValue: boolean): Promise<void> {
    setShowContinueReading(newValue)
    Application.invalidateDiscoverSections()
  }

  async showRecentlyAddedDidChange(newValue: boolean): Promise<void> {
    setShowRecentlyAdded(newValue)
    Application.invalidateDiscoverSections()
  }

  async showRecentlyUpdatedDidChange(newValue: boolean): Promise<void> {
    setShowRecentlyUpdated(newValue)
    Application.invalidateDiscoverSections()
  }

  async showGenresDidChange(newValue: boolean): Promise<void> {
    setShowGenres(newValue)
    Application.invalidateDiscoverSections()
  }
}

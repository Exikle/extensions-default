import {
  Form,
  Section,
  ToggleRow,
  type FormSectionElement,
} from '@paperback/types'
import {
  getShowContinueReading,
  getShowOnDeck,
  setShowContinueReading,
  setShowOnDeck,
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
}

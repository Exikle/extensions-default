import {
  Form,
  NavigationRow,
  Section,
  type FormSectionElement,
} from '@paperback/types'
import { ServerSettingsForm } from './server_settings_form.js'
import { HomepageSettingsForm } from './homepage_settings_form.js'

export class SettingsForm extends Form {
  override getSections(): FormSectionElement<unknown>[] {
    return [
      Section('authentication', [
        NavigationRow('authentication', {
          title: 'Server Settings',
          form: new ServerSettingsForm(),
        }),
      ]),

      Section('homepageSettings', [
        NavigationRow('homepageSettings', {
          title: 'Homepage Settings',
          form: new HomepageSettingsForm(),
        }),
      ]),
    ]
  }
}

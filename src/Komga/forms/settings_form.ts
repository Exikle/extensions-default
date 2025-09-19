import { Form, NavigationRow, Section, type FormSectionElement } from '@paperback/types'
import { AuthenticationForm } from './authentication_form.js'

export class SettingsForm extends Form {
  override getSections(): FormSectionElement[] {
    return [
      Section('authentication', [
        NavigationRow('authentication', {
          title: 'Authenciation',
          form: new AuthenticationForm(),
        }),
      ]),
    ]
  }
}

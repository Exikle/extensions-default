import {
  Form,
  InputRow,
  Section,
  type FormSectionElement,
} from '@paperback/types'
import {
  getKomgaBaseURL,
  getKomgaCredentials,
  setKomgaBaseURL,
  setKomgaCredentials,
} from '../utils/config.js'
import { getCurrentUser } from '../sdk/sdk.gen.js'

export class ServerSettingsForm extends Form {
  baseUrl = getKomgaBaseURL()
  credentials = getKomgaCredentials()

  async baseUrlDidChange(newValue: string) {
    this.baseUrl = newValue
  }

  baseUrlSection() {
    return Section(
      { id: 'baseUrl', footer: 'Example: https://demo.komga.org' },
      [
        InputRow('baseUrl', {
          title: 'Base URL',
          value: this.baseUrl,
          onValueChange: Application.Selector(
            this as ServerSettingsForm,
            'baseUrlDidChange'
          ),
        }),
      ]
    )
  }

  async usernameDidChange(newValue: string) {
    this.credentials.username = newValue
  }

  async passwordDidChange(newValue: string) {
    this.credentials.password = newValue
  }

  credentialsSection() {
    return Section(
      {
        id: 'credentials',
        footer: 'Example:\nU: demo@komga.org\nP: komga-demo',
      },
      [
        InputRow('username', {
          title: 'Username',
          value: this.credentials.username,
          onValueChange: Application.Selector(
            this as ServerSettingsForm,
            'usernameDidChange'
          ),
        }),
        InputRow('password', {
          title: 'Password',
          value: this.credentials.password,
          onValueChange: Application.Selector(
            this as ServerSettingsForm,
            'passwordDidChange'
          ),
        }),
      ]
    )
  }

  override getSections(): FormSectionElement[] {
    return [this.baseUrlSection(), this.credentialsSection()]
  }

  // Validate the credentials
  override get requiresExplicitSubmission(): boolean {
    return true
  }

  override async formDidSubmit(): Promise<void> {
    const { error, response } = await getCurrentUser({
      baseUrl: this.baseUrl,
      auth: (auth) => {
        if (auth.scheme === 'basic') {
          return `${this.credentials.username}:${this.credentials.password}`
        } else {
          return undefined
        }
      },
    })

    if (!error) {
      setKomgaBaseURL(this.baseUrl)
      setKomgaCredentials(this.credentials.username, this.credentials.password)
      return
    }

    switch (response.status) {
      case 401: {
        throw new Error('Error 401 Unauthorized: Invalid credentials')
      }
      default: {
        throw new Error(
          `Error ${response.status}: ${error.violations.map((x) => x.message).join('\n')}`
        )
      }
    }
  }
}

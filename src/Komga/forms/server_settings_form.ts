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
          isSecureEntry: true,
          onValueChange: Application.Selector(
            this as ServerSettingsForm,
            'passwordDidChange'
          ),
        }),
      ]
    )
  }

  override getSections(): FormSectionElement<unknown>[] {
    return [this.baseUrlSection(), this.credentialsSection()]
  }

  // Validate the credentials
  override requiresExplicitSubmission: boolean = true

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

    // Only a 400 is typed as carrying `violations`; every other failure (401,
    // 5xx, an unreachable host) has no such field, so reaching for it here
    // threw a TypeError instead of showing the real problem.
    switch (response?.status) {
      case undefined: {
        throw new Error(`Could not reach ${this.baseUrl}. Check the URL.`)
      }
      case 401:
      case 403: {
        throw new Error(`Error ${response.status}: invalid credentials`)
      }
      case 404: {
        throw new Error(
          `Error 404: no Komga server at ${this.baseUrl}. Check the URL.`
        )
      }
      default: {
        const violations = error?.violations?.map((x) => x.message).join('\n')
        throw new Error(
          `Error ${response.status}${violations ? `: ${violations}` : ''}`
        )
      }
    }
  }
}

import {
  ButtonRow,
  Form,
  InputRow,
  LabelRow,
  Section,
  type FormSectionElement,
  type LabelRowValue,
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

  // Result of the last `Test Connection` press, shown without saving anything
  private connectionStatus: LabelRowValue | undefined

  connectionSection() {
    // Section accepts undefined entries, so the status row can simply be absent
    // until a check has run
    return Section({ id: 'connection' }, [
      ButtonRow('testConnection', {
        title: 'Test Connection',
        onSelect: Application.Selector(
          this as ServerSettingsForm,
          'testConnection'
        ),
      }),
      this.connectionStatus
        ? LabelRow('connectionStatus', {
            title: 'Status',
            value: this.connectionStatus,
          })
        : undefined,
    ])
  }

  async testConnection(): Promise<void> {
    this.connectionStatus = { text: 'Checking...', style: 'tinted' }
    this.reloadForm()

    try {
      const { data, error, response } = await getCurrentUser({
        baseUrl: this.baseUrl,
        auth: (auth) =>
          auth.scheme === 'basic'
            ? `${this.credentials.username}:${this.credentials.password}`
            : undefined,
      })

      if (!error && data) {
        this.connectionStatus = {
          text: `Connected as ${data.email}`,
          style: 'success',
        }
      } else {
        this.connectionStatus = {
          text: this.describeFailure(response?.status),
          style: 'error',
        }
      }
    } catch {
      this.connectionStatus = {
        text: `Could not reach ${this.baseUrl}`,
        style: 'error',
      }
    }

    this.reloadForm()
  }

  private describeFailure(status: number | undefined): string {
    switch (status) {
      case undefined:
        return `Could not reach ${this.baseUrl}`
      case 401:
      case 403:
        return 'Invalid credentials'
      case 404:
        return 'No Komga server at that URL'
      default:
        return `Server returned ${status}`
    }
  }

  override getSections(): FormSectionElement<unknown>[] {
    return [
      this.baseUrlSection(),
      this.credentialsSection(),
      this.connectionSection(),
    ]
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

const KEY_KOMGA_BASE_URL = 'serverURL'
const KEY_KOMGA_USERNAME = 'serverUsername'
const KEY_KOMGA_PASSWORD = 'serverPassword'

const DEFAULT_KOMGA_BASE_URL = 'https://demo.komga.org'
const DEFAULT_KOMGA_USERNAME = 'demo@komga.org'
const DEFAULT_KOMGA_PASSWORD = 'komga-demo'

export function getKomgaBaseURL() {
  return Application.getState(KEY_KOMGA_BASE_URL) as string ?? DEFAULT_KOMGA_BASE_URL
}

export function setKomgaBaseURL(url: string) {
  return Application.setState(url, KEY_KOMGA_BASE_URL)
}

export function getKomgaCredentials() {
  return {
    username: Application.getSecureState(KEY_KOMGA_USERNAME) as string ?? DEFAULT_KOMGA_USERNAME,
    password: Application.getSecureState(KEY_KOMGA_PASSWORD) as string ?? DEFAULT_KOMGA_PASSWORD,
  }
}

export function setKomgaCredentials(username: string, password: string) {
  Application.setSecureState(username, KEY_KOMGA_USERNAME)
  Application.setSecureState(password, KEY_KOMGA_PASSWORD)
}

const KEY_KOMGA_BASE_URL = 'serverURL'
const KEY_KOMGA_USERNAME = 'serverUsername'
const KEY_KOMGA_PASSWORD = 'serverPassword'
const KEY_SHOW_ON_DECK = 'showOnDeck'
const KEY_SHOW_CONTINUE_READING = 'showContinueReading'

const DEFAULT_KOMGA_BASE_URL = 'https://demo.komga.org'
const DEFAULT_KOMGA_USERNAME = 'demo@komga.org'
const DEFAULT_KOMGA_PASSWORD = 'komga-demo'
const DEFAULT_SHOW_ON_DECK = true
const DEFAULT_SHOW_CONTINUE_READING = true

function getStateOrDefault<T>(key: string, def: T): T {
  return Application.getState(key) as T ?? def
}

export function getKomgaBaseURL() {
  return getStateOrDefault(KEY_KOMGA_BASE_URL, DEFAULT_KOMGA_BASE_URL)
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


export function getShowOnDeck() {
  return getStateOrDefault(KEY_SHOW_ON_DECK, DEFAULT_SHOW_ON_DECK)
}

export function setShowOnDeck(newValue: boolean) {
  Application.setState(newValue, KEY_SHOW_ON_DECK)
}

export function getShowContinueReading() {
  return getStateOrDefault(KEY_SHOW_CONTINUE_READING, DEFAULT_SHOW_CONTINUE_READING)
}

export function setShowContinueReading(newValue: boolean) {
  Application.setState(newValue, KEY_SHOW_CONTINUE_READING)
}
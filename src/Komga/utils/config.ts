const KEY_KOMGA_BASE_URL = 'serverURL'
const KEY_KOMGA_USERNAME = 'serverUsername'
const KEY_KOMGA_PASSWORD = 'serverPassword'
const KEY_SHOW_ON_DECK = 'showOnDeck'
const KEY_SHOW_CONTINUE_READING = 'showContinueReading'
const KEY_SHOW_RECENTLY_ADDED = 'showRecentlyAdded'
const KEY_SHOW_RECENTLY_UPDATED = 'showRecentlyUpdated'
const KEY_HIDE_ADULT_CONTENT = 'hideAdultContent'
const KEY_ADULT_GENRES = 'adultGenres'

const DEFAULT_KOMGA_BASE_URL = 'https://demo.komga.org'
const DEFAULT_KOMGA_USERNAME = 'demo@komga.org'
const DEFAULT_KOMGA_PASSWORD = 'komga-demo'
const DEFAULT_SHOW_ON_DECK = true
const DEFAULT_SHOW_CONTINUE_READING = true
const DEFAULT_SHOW_RECENTLY_ADDED = true
const DEFAULT_SHOW_RECENTLY_UPDATED = true
const DEFAULT_HIDE_ADULT_CONTENT = false
// Matched case-insensitively against a series' genres
const DEFAULT_ADULT_GENRES = [
  'adult',
  'hentai',
  'smut',
  'erotica',
  'pornographic',
  'mature',
  'ecchi',
]

function getStateOrDefault<T>(key: string, def: T): T {
  return (Application.getState(key) as T) ?? def
}

export function getKomgaBaseURL() {
  return getStateOrDefault(KEY_KOMGA_BASE_URL, DEFAULT_KOMGA_BASE_URL)
}

export function setKomgaBaseURL(url: string) {
  return Application.setState(url, KEY_KOMGA_BASE_URL)
}

export function getKomgaCredentials() {
  return {
    username:
      (Application.getSecureState(KEY_KOMGA_USERNAME) as string) ??
      DEFAULT_KOMGA_USERNAME,
    password:
      (Application.getSecureState(KEY_KOMGA_PASSWORD) as string) ??
      DEFAULT_KOMGA_PASSWORD,
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
  return getStateOrDefault(
    KEY_SHOW_CONTINUE_READING,
    DEFAULT_SHOW_CONTINUE_READING
  )
}

export function setShowContinueReading(newValue: boolean) {
  Application.setState(newValue, KEY_SHOW_CONTINUE_READING)
}

export function getShowRecentlyAdded() {
  return getStateOrDefault(KEY_SHOW_RECENTLY_ADDED, DEFAULT_SHOW_RECENTLY_ADDED)
}

export function setShowRecentlyAdded(newValue: boolean) {
  Application.setState(newValue, KEY_SHOW_RECENTLY_ADDED)
}

export function getShowRecentlyUpdated() {
  return getStateOrDefault(
    KEY_SHOW_RECENTLY_UPDATED,
    DEFAULT_SHOW_RECENTLY_UPDATED
  )
}

export function setShowRecentlyUpdated(newValue: boolean) {
  Application.setState(newValue, KEY_SHOW_RECENTLY_UPDATED)
}

export function getHideAdultContent() {
  return getStateOrDefault(KEY_HIDE_ADULT_CONTENT, DEFAULT_HIDE_ADULT_CONTENT)
}

export function setHideAdultContent(newValue: boolean) {
  Application.setState(newValue, KEY_HIDE_ADULT_CONTENT)
}

// Lower-cased so callers can compare directly against a series' genres
export function getAdultGenres(): string[] {
  const stored = Application.getState(KEY_ADULT_GENRES)
  const genres = Array.isArray(stored)
    ? (stored as string[])
    : DEFAULT_ADULT_GENRES
  return genres.map((genre) => genre.toLowerCase())
}

export function setAdultGenres(newValue: string[]) {
  Application.setState(newValue, KEY_ADULT_GENRES)
}

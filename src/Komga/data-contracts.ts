/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ValidationErrorResponse {
  violations: Violation[];
}

export interface Violation {
  fieldName?: string;
  message?: string;
}

export type JsonNode = object;

export interface Location {
  fragments: string[];
  /** @format float */
  progression?: number;
  /** @format int32 */
  position?: number;
  /** @format float */
  totalProgression?: number;
}

export interface R2Device {
  id: string;
  name: string;
}

export interface R2Locator {
  href: string;
  type: string;
  title?: string;
  locations?: Location;
  text?: Text;
  koboSpan?: string;
}

export interface R2Progression {
  /** @format date-time */
  modified: string;
  device: R2Device;
  locator: R2Locator;
}

export interface Text {
  after?: string;
  before?: string;
  highlight?: string;
}

export interface BookmarkDto {
  /** @format date-time */
  LastModified: string;
  /** @format float */
  ProgressPercent?: number;
  /** @format float */
  ContentSourceProgressPercent?: number;
  Location?: LocationDto;
}

export interface LocationDto {
  Value?: string;
  Type?: string;
  Source: string;
}

export interface ReadingStateDto {
  /** @format date-time */
  Created?: string;
  CurrentBookmark: BookmarkDto;
  EntitlementId: string;
  /** @format date-time */
  LastModified: string;
  /** @format date-time */
  PriorityTimestamp?: string;
  Statistics: StatisticsDto;
  StatusInfo: StatusInfoDto;
}

export interface ReadingStateStateUpdateDto {
  ReadingStates: ReadingStateDto[];
}

export interface StatisticsDto {
  /** @format date-time */
  LastModified: string;
  /** @format int32 */
  RemainingTimeMinutes?: number;
  /** @format int32 */
  SpentReadingMinutes?: number;
}

export interface StatusInfoDto {
  /** @format date-time */
  LastModified: string;
  Status: "ReadyToRead" | "Finished" | "Reading";
  /** @format int32 */
  TimesStartedReading?: number;
  /** @format date-time */
  LastTimeFinished?: string;
  /** @format date-time */
  LastTimeStartedReading?: string;
}

export interface TachiyomiReadProgressUpdateV2Dto {
  /** @format float */
  lastBookNumberSortRead: number;
}

export interface TachiyomiReadProgressUpdateDto {
  /** @format int32 */
  lastBookRead: number;
}

export interface PageHashCreationDto {
  hash: string;
  /** @format int64 */
  size?: number;
  action: "DELETE_AUTO" | "DELETE_MANUAL" | "IGNORE";
}

/** Fields to update. You can omit fields you don't want to update. */
export interface LibraryUpdateDto {
  name?: string;
  root?: string;
  importComicInfoBook?: boolean;
  importComicInfoSeries?: boolean;
  importComicInfoCollection?: boolean;
  importComicInfoReadList?: boolean;
  importComicInfoSeriesAppendVolume?: boolean;
  importEpubBook?: boolean;
  importEpubSeries?: boolean;
  importMylarSeries?: boolean;
  importLocalArtwork?: boolean;
  importBarcodeIsbn?: boolean;
  scanForceModifiedTime?: boolean;
  scanInterval?: "DISABLED" | "HOURLY" | "EVERY_6H" | "EVERY_12H" | "DAILY" | "WEEKLY";
  scanOnStartup?: boolean;
  scanCbx?: boolean;
  scanPdf?: boolean;
  scanEpub?: boolean;
  repairExtensions?: boolean;
  convertToCbz?: boolean;
  emptyTrashAfterScan?: boolean;
  seriesCover?: "FIRST" | "FIRST_UNREAD_OR_FIRST" | "FIRST_UNREAD_OR_LAST" | "LAST";
  hashFiles?: boolean;
  hashPages?: boolean;
  analyzeDimensions?: boolean;
  oneshotsDirectory?: string;
  /** @uniqueItems true */
  scanDirectoryExclusions?: string[];
}

export interface UserCreationDto {
  email: string;
  password: string;
  roles: string[];
}

export interface AgeRestrictionDto {
  /** @format int32 */
  age: number;
  restriction: "ALLOW_ONLY" | "EXCLUDE";
}

export interface UserDto {
  id: string;
  email: string;
  /** @uniqueItems true */
  roles: string[];
  sharedAllLibraries: boolean;
  /** @uniqueItems true */
  sharedLibrariesIds: string[];
  /** @uniqueItems true */
  labelsAllow: string[];
  /** @uniqueItems true */
  labelsExclude: string[];
  ageRestriction?: AgeRestrictionDto;
}

export interface ApiKeyRequestDto {
  comment: string;
}

export interface ApiKeyDto {
  id: string;
  userId: string;
  key: string;
  comment: string;
  /** @format date-time */
  createdDate: string;
  /** @format date-time */
  lastModifiedDate: string;
}

export interface ScanRequestDto {
  path: string;
}

export interface PageDto {
  /** @format int32 */
  number: number;
  fileName: string;
  mediaType: string;
  /** @format int32 */
  width?: number;
  /** @format int32 */
  height?: number;
  /** @format int64 */
  sizeBytes?: number;
  size: string;
}

export interface TransientBookDto {
  id: string;
  name: string;
  url: string;
  /** @format date-time */
  fileLastModified: string;
  /** @format int64 */
  sizeBytes: number;
  size: string;
  status: string;
  mediaType: string;
  pages: PageDto[];
  files: string[];
  comment: string;
  /** @format float */
  number?: number;
  seriesId?: string;
}

export interface ThumbnailSeriesDto {
  id: string;
  seriesId: string;
  type: string;
  selected: boolean;
  mediaType: string;
  /** @format int64 */
  fileSize: number;
  /** @format int32 */
  width: number;
  /** @format int32 */
  height: number;
}

export interface ReadListCreationDto {
  name: string;
  summary: string;
  ordered: boolean;
  bookIds: string[];
}

export interface ReadListDto {
  id: string;
  name: string;
  summary: string;
  ordered: boolean;
  bookIds: string[];
  /** @format date-time */
  createdDate: string;
  /** @format date-time */
  lastModifiedDate: string;
  filtered: boolean;
}

export interface ThumbnailReadListDto {
  id: string;
  readListId: string;
  type: string;
  selected: boolean;
  mediaType: string;
  /** @format int64 */
  fileSize: number;
  /** @format int32 */
  width: number;
  /** @format int32 */
  height: number;
}

export interface ReadListMatchDto {
  name: string;
  errorCode: string;
}

export interface ReadListRequestBookDto {
  /** @uniqueItems true */
  series: string[];
  number: string;
}

export interface ReadListRequestBookMatchBookDto {
  bookId: string;
  number: string;
  title: string;
}

export interface ReadListRequestBookMatchDto {
  series: ReadListRequestBookMatchSeriesDto;
  books: ReadListRequestBookMatchBookDto[];
}

export interface ReadListRequestBookMatchSeriesDto {
  seriesId: string;
  title: string;
  /** @format date */
  releaseDate?: string;
}

export interface ReadListRequestBookMatchesDto {
  request: ReadListRequestBookDto;
  matches: ReadListRequestBookMatchDto[];
}

export interface ReadListRequestMatchDto {
  readListMatch: ReadListMatchDto;
  requests: ReadListRequestBookMatchesDto[];
  errorCode: string;
}

export interface PageHashMatchDto {
  bookId: string;
  url: string;
  /** @format int32 */
  pageNumber: number;
  fileName: string;
  /** @format int64 */
  fileSize: number;
  mediaType: string;
}

export interface LibraryCreationDto {
  name: string;
  root: string;
  importComicInfoBook: boolean;
  importComicInfoSeries: boolean;
  importComicInfoCollection: boolean;
  importComicInfoReadList: boolean;
  importComicInfoSeriesAppendVolume: boolean;
  importEpubBook: boolean;
  importEpubSeries: boolean;
  importMylarSeries: boolean;
  importLocalArtwork: boolean;
  importBarcodeIsbn: boolean;
  scanForceModifiedTime: boolean;
  scanInterval: "DISABLED" | "HOURLY" | "EVERY_6H" | "EVERY_12H" | "DAILY" | "WEEKLY";
  scanOnStartup: boolean;
  scanCbx: boolean;
  scanPdf: boolean;
  scanEpub: boolean;
  /** @uniqueItems true */
  scanDirectoryExclusions: string[];
  repairExtensions: boolean;
  convertToCbz: boolean;
  emptyTrashAfterScan: boolean;
  seriesCover: "FIRST" | "FIRST_UNREAD_OR_FIRST" | "FIRST_UNREAD_OR_LAST" | "LAST";
  hashFiles: boolean;
  hashPages: boolean;
  analyzeDimensions: boolean;
  oneshotsDirectory?: string;
}

export interface LibraryDto {
  id: string;
  name: string;
  root: string;
  importComicInfoBook: boolean;
  importComicInfoSeries: boolean;
  importComicInfoCollection: boolean;
  importComicInfoReadList: boolean;
  importComicInfoSeriesAppendVolume: boolean;
  importEpubBook: boolean;
  importEpubSeries: boolean;
  importMylarSeries: boolean;
  importLocalArtwork: boolean;
  importBarcodeIsbn: boolean;
  scanForceModifiedTime: boolean;
  scanInterval: "DISABLED" | "HOURLY" | "EVERY_6H" | "EVERY_12H" | "DAILY" | "WEEKLY";
  scanOnStartup: boolean;
  scanCbx: boolean;
  scanPdf: boolean;
  scanEpub: boolean;
  /** @uniqueItems true */
  scanDirectoryExclusions: string[];
  repairExtensions: boolean;
  convertToCbz: boolean;
  emptyTrashAfterScan: boolean;
  seriesCover: "FIRST" | "FIRST_UNREAD_OR_FIRST" | "FIRST_UNREAD_OR_LAST" | "LAST";
  hashFiles: boolean;
  hashPages: boolean;
  analyzeDimensions: boolean;
  oneshotsDirectory?: string;
  unavailable: boolean;
}

export interface DirectoryRequestDto {
  path: string;
  showFiles: boolean;
}

export interface DirectoryListingDto {
  parent?: string;
  directories: PathDto[];
  files: PathDto[];
}

export interface PathDto {
  type: string;
  name: string;
  path: string;
}

export interface CollectionCreationDto {
  name: string;
  ordered: boolean;
  seriesIds: string[];
}

export interface CollectionDto {
  id: string;
  name: string;
  ordered: boolean;
  seriesIds: string[];
  /** @format date-time */
  createdDate: string;
  /** @format date-time */
  lastModifiedDate: string;
  filtered: boolean;
}

export interface ThumbnailSeriesCollectionDto {
  id: string;
  collectionId: string;
  type: string;
  selected: boolean;
  mediaType: string;
  /** @format int64 */
  fileSize: number;
  /** @format int32 */
  width: number;
  /** @format int32 */
  height: number;
}

export interface ThumbnailBookDto {
  id: string;
  bookId: string;
  type: string;
  selected: boolean;
  mediaType: string;
  /** @format int64 */
  fileSize: number;
  /** @format int32 */
  width: number;
  /** @format int32 */
  height: number;
}

export interface BookImportBatchDto {
  books: BookImportDto[];
  copyMode: "MOVE" | "COPY" | "HARDLINK";
}

export interface BookImportDto {
  sourceFile: string;
  seriesId: string;
  upgradeBookId?: string;
  destinationName?: string;
}

export interface AgeRestrictionUpdateDto {
  /** @format int32 */
  age: number;
  restriction: "ALLOW_ONLY" | "EXCLUDE";
}

export interface SharedLibrariesUpdateDto {
  all: boolean;
  /** @uniqueItems true */
  libraryIds: string[];
}

export interface UserUpdateDto {
  /** @uniqueItems true */
  roles?: string[];
  ageRestriction?: AgeRestrictionUpdateDto;
  /** @uniqueItems true */
  labelsAllow?: string[];
  /** @uniqueItems true */
  labelsExclude?: string[];
  sharedLibraries?: SharedLibrariesUpdateDto;
}

export interface PasswordUpdateDto {
  password: string;
}

export interface SettingsUpdateDto {
  deleteEmptyCollections?: boolean;
  deleteEmptyReadLists?: boolean;
  /** @format int64 */
  rememberMeDurationDays?: number;
  renewRememberMeKey?: boolean;
  thumbnailSize?: "DEFAULT" | "MEDIUM" | "LARGE" | "XLARGE";
  /** @format int32 */
  taskPoolSize?: number;
  koboProxy?: boolean;
  /**
   * @format int32
   * @max 65535
   */
  serverPort?: number;
  /** @pattern ^\/[\w-\/]*[a-zA-Z0-9]$ */
  serverContextPath?: string;
  /**
   * @format int32
   * @max 65535
   */
  koboPort?: number;
  kepubifyPath?: string;
}

export interface AlternateTitleUpdateDto {
  label: string;
  title: string;
}

/** Metadata fields to update. Set a field to null to unset the metadata. You can omit fields you don't want to update. */
export interface SeriesMetadataUpdateDto {
  status?: "ENDED" | "ONGOING" | "ABANDONED" | "HIATUS";
  statusLock?: boolean;
  title?: string;
  titleLock?: boolean;
  titleSort?: string;
  titleSortLock?: boolean;
  summary?: string;
  summaryLock?: boolean;
  publisher?: string;
  publisherLock?: boolean;
  readingDirectionLock?: boolean;
  ageRatingLock?: boolean;
  language?: string;
  languageLock?: boolean;
  genresLock?: boolean;
  tagsLock?: boolean;
  totalBookCountLock?: boolean;
  sharingLabelsLock?: boolean;
  linksLock?: boolean;
  alternateTitlesLock?: boolean;
  /** @uniqueItems true */
  tags?: string[];
  links?: WebLinkUpdateDto[];
  readingDirection?: "LEFT_TO_RIGHT" | "RIGHT_TO_LEFT" | "VERTICAL" | "WEBTOON";
  /** @format int32 */
  ageRating?: number;
  /** @uniqueItems true */
  genres?: string[];
  /** @format int32 */
  totalBookCount?: number;
  alternateTitles?: AlternateTitleUpdateDto[];
  /** @uniqueItems true */
  sharingLabels?: string[];
}

export interface WebLinkUpdateDto {
  label: string;
  url?: string;
}

export interface ReadListUpdateDto {
  name?: string;
  summary?: string;
  bookIds?: string[];
  ordered?: boolean;
}

export interface CollectionUpdateDto {
  name?: string;
  ordered?: boolean;
  seriesIds?: string[];
}

/** page can be omitted if completed is set to true. completed can be omitted, and will be set accordingly depending on the page passed and the total number of pages in the book. */
export interface ReadProgressUpdateDto {
  /** @format int32 */
  page?: number;
  completed?: boolean;
}

export interface AuthorUpdateDto {
  name: string;
  role: string;
}

/** Metadata fields to update. Set a field to null to unset the metadata. You can omit fields you don't want to update. */
export interface BookMetadataUpdateDto {
  title?: string;
  titleLock?: boolean;
  summaryLock?: boolean;
  number?: string;
  numberLock?: boolean;
  /** @format float */
  numberSort?: number;
  numberSortLock?: boolean;
  releaseDateLock?: boolean;
  authorsLock?: boolean;
  tagsLock?: boolean;
  isbnLock?: boolean;
  linksLock?: boolean;
  /** @uniqueItems true */
  tags?: string[];
  isbn?: string;
  links?: WebLinkUpdateDto[];
  authors?: AuthorUpdateDto[];
  summary?: string;
  /** @format date */
  releaseDate?: string;
}

export interface FacetDto {
  metadata: FeedMetadataDto;
  links: WPLinkDto[];
}

export interface FeedDto {
  metadata: FeedMetadataDto;
  links: WPLinkDto[];
  navigation: WPLinkDto[];
  facets: FacetDto[];
  groups: FeedGroupDto[];
  publications: WPPublicationDto[];
}

export interface FeedGroupDto {
  metadata: FeedMetadataDto;
  links: WPLinkDto[];
  navigation: WPLinkDto[];
  publications: WPPublicationDto[];
}

export interface FeedMetadataDto {
  title: string;
  subTitle?: string;
  type?: string;
  identifier?: string;
  /** @format date-time */
  modified?: string;
  description?: string;
  /** @format int32 */
  itemsPerPage?: number;
  /** @format int32 */
  currentPage?: number;
  /** @format int64 */
  numberOfItems?: number;
}

export interface WPBelongsToDto {
  series: WPContributorDto[];
  collection: WPContributorDto[];
}

export interface WPContributorDto {
  name: string;
  /** @format float */
  position?: number;
  links: WPLinkDto[];
}

export interface WPLinkDto {
  title?: string;
  rel?: string;
  href?: string;
  type?: string;
  templated?: boolean;
  /** @format int32 */
  width?: number;
  /** @format int32 */
  height?: number;
  properties: Record<string, Record<string, object>>;
}

export interface WPMetadataDto {
  title: string;
  identifier?: string;
  type?: string;
  conformsTo?: string;
  sortAs?: string;
  subtitle?: string;
  /** @format date-time */
  modified?: string;
  /** @format date */
  published?: string;
  language?: string;
  author: string[];
  translator: string[];
  editor: string[];
  artist: string[];
  illustrator: string[];
  letterer: string[];
  penciler: string[];
  colorist: string[];
  inker: string[];
  contributor: string[];
  publisher: string[];
  subject: string[];
  readingProgression?: "rtl" | "ltr" | "ttb" | "btt" | "auto";
  description?: string;
  /** @format int32 */
  numberOfPages?: number;
  belongsTo?: WPBelongsToDto;
  rendition: Record<string, object>;
}

export interface WPPublicationDto {
  context?: string;
  metadata: WPMetadataDto;
  links: WPLinkDto[];
  images: WPLinkDto[];
  readingOrder: WPLinkDto[];
  resources: WPLinkDto[];
  toc: WPLinkDto[];
  landmarks: WPLinkDto[];
  pageList: WPLinkDto[];
}

export type StreamingResponseBody = object;

export interface AuthenticationDocumentDto {
  authentication: AuthenticationFlowDto[];
  title: string;
  id: string;
  description?: string;
  links: WPLinkDto[];
}

export interface AuthenticationFlowDto {
  type:
    | "http://opds-spec.org/auth/basic"
    | "http://opds-spec.org/auth/oauth/implicit"
    | "http://opds-spec.org/auth/oauth/password";
  labels?: LabelsDto;
  links: WPLinkDto[];
}

export interface LabelsDto {
  login?: string;
  password?: string;
}

export interface OpdsAuthor {
  name: string;
  /** @format uri */
  uri?: string;
}

export interface OpdsEntry {
  title: string;
  /** @format date-time */
  updated: string;
  id: string;
  content: string;
}

export interface OpdsFeed {
  id: string;
  title: string;
  /** @format date-time */
  updated: string;
  author: OpdsAuthor;
  links: OpdsLink[];
  entries: OpdsEntry[];
}

export interface OpdsLink {
  type: string;
  rel: string;
  href: string;
}

export interface OpenSearchDescription {
  /**
   * @minLength 1
   * @maxLength 16
   */
  shortName: string;
  /**
   * @minLength 1
   * @maxLength 1024
   */
  description: string;
  inputEncoding: string;
  outputEncoding: string;
  url: OpenSearchUrl;
}

export interface OpenSearchUrl {
  template: string;
  type: string;
}

export interface ResourcesDto {
  Resources: JsonNode;
}

export interface AuthenticationActivityDto {
  userId?: string;
  email?: string;
  apiKeyId?: string;
  apiKeyComment?: string;
  ip?: string;
  userAgent?: string;
  success: boolean;
  error?: string;
  /** @format date-time */
  dateTime: string;
  source?: string;
}

export interface PageAuthenticationActivityDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  pageable?: PageableObject;
  /** @format int32 */
  size?: number;
  content?: AuthenticationActivityDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  /** @format int32 */
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface PageableObject {
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  pageSize?: number;
  paged?: boolean;
  unpaged?: boolean;
  /** @format int64 */
  offset?: number;
  sort?: SortObject;
}

export interface SortObject {
  sorted?: boolean;
  unsorted?: boolean;
  empty?: boolean;
}

export interface TachiyomiReadProgressV2Dto {
  /** @format int32 */
  booksCount: number;
  /** @format int32 */
  booksReadCount: number;
  /** @format int32 */
  booksUnreadCount: number;
  /** @format int32 */
  booksInProgressCount: number;
  /** @format float */
  lastReadContinuousNumberSort: number;
  /** @format float */
  maxNumberSort: number;
}

export interface AuthorDto {
  name: string;
  role: string;
}

export interface PageAuthorDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  pageable?: PageableObject;
  /** @format int32 */
  size?: number;
  content?: AuthorDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  /** @format int32 */
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface SettingMultiSourceInteger {
  /** @format int32 */
  configurationSource: number;
  /** @format int32 */
  databaseSource: number;
  /** @format int32 */
  effectiveValue: number;
}

export interface SettingMultiSourceString {
  configurationSource: string;
  databaseSource: string;
  effectiveValue: string;
}

export interface SettingsDto {
  deleteEmptyCollections: boolean;
  deleteEmptyReadLists: boolean;
  /** @format int64 */
  rememberMeDurationDays: number;
  thumbnailSize: "DEFAULT" | "MEDIUM" | "LARGE" | "XLARGE";
  /** @format int32 */
  taskPoolSize: number;
  serverPort: SettingMultiSourceInteger;
  serverContextPath: SettingMultiSourceString;
  koboProxy: boolean;
  /** @format int32 */
  koboPort?: number;
  kepubifyPath: SettingMultiSourceString;
}

export interface AlternateTitleDto {
  label: string;
  title: string;
}

export interface BookMetadataAggregationDto {
  authors: AuthorDto[];
  /** @uniqueItems true */
  tags: string[];
  /** @format date */
  releaseDate?: string;
  summary: string;
  summaryNumber: string;
  /** @format date-time */
  created: string;
  /** @format date-time */
  lastModified: string;
}

export interface PageSeriesDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  pageable?: PageableObject;
  /** @format int32 */
  size?: number;
  content?: SeriesDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  /** @format int32 */
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface SeriesDto {
  id: string;
  libraryId: string;
  name: string;
  url: string;
  /** @format date-time */
  created: string;
  /** @format date-time */
  lastModified: string;
  /** @format date-time */
  fileLastModified: string;
  /** @format int32 */
  booksCount: number;
  /** @format int32 */
  booksReadCount: number;
  /** @format int32 */
  booksUnreadCount: number;
  /** @format int32 */
  booksInProgressCount: number;
  metadata: SeriesMetadataDto;
  booksMetadata: BookMetadataAggregationDto;
  deleted: boolean;
  oneshot: boolean;
}

export interface SeriesMetadataDto {
  status: string;
  statusLock: boolean;
  title: string;
  titleLock: boolean;
  titleSort: string;
  titleSortLock: boolean;
  summary: string;
  summaryLock: boolean;
  readingDirection: string;
  readingDirectionLock: boolean;
  publisher: string;
  publisherLock: boolean;
  /** @format int32 */
  ageRating?: number;
  ageRatingLock: boolean;
  language: string;
  languageLock: boolean;
  /** @uniqueItems true */
  genres: string[];
  genresLock: boolean;
  /** @uniqueItems true */
  tags: string[];
  tagsLock: boolean;
  /** @format int32 */
  totalBookCount?: number;
  totalBookCountLock: boolean;
  /** @uniqueItems true */
  sharingLabels: string[];
  sharingLabelsLock: boolean;
  links: WebLinkDto[];
  linksLock: boolean;
  alternateTitles: AlternateTitleDto[];
  alternateTitlesLock: boolean;
  /** @format date-time */
  created: string;
  /** @format date-time */
  lastModified: string;
}

export interface WebLinkDto {
  label: string;
  url: string;
}

export interface BookDto {
  id: string;
  seriesId: string;
  seriesTitle: string;
  libraryId: string;
  name: string;
  url: string;
  /** @format int32 */
  number: number;
  /** @format date-time */
  created: string;
  /** @format date-time */
  lastModified: string;
  /** @format date-time */
  fileLastModified: string;
  /** @format int64 */
  sizeBytes: number;
  size: string;
  media: MediaDto;
  metadata: BookMetadataDto;
  readProgress?: ReadProgressDto;
  deleted: boolean;
  fileHash: string;
  oneshot: boolean;
}

export interface BookMetadataDto {
  title: string;
  titleLock: boolean;
  summary: string;
  summaryLock: boolean;
  number: string;
  numberLock: boolean;
  /** @format float */
  numberSort: number;
  numberSortLock: boolean;
  /** @format date */
  releaseDate?: string;
  releaseDateLock: boolean;
  authors: AuthorDto[];
  authorsLock: boolean;
  /** @uniqueItems true */
  tags: string[];
  tagsLock: boolean;
  isbn: string;
  isbnLock: boolean;
  links: WebLinkDto[];
  linksLock: boolean;
  /** @format date-time */
  created: string;
  /** @format date-time */
  lastModified: string;
}

export interface MediaDto {
  status: string;
  mediaType: string;
  /** @format int32 */
  pagesCount: number;
  comment: string;
  epubDivinaCompatible: boolean;
  epubIsKepub: boolean;
  mediaProfile: string;
}

export interface PageBookDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  pageable?: PageableObject;
  /** @format int32 */
  size?: number;
  content?: BookDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  /** @format int32 */
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface ReadProgressDto {
  /** @format int32 */
  page: number;
  completed: boolean;
  /** @format date-time */
  readDate: string;
  /** @format date-time */
  created: string;
  /** @format date-time */
  lastModified: string;
  deviceId: string;
  deviceName: string;
}

export interface GroupCountDto {
  group: string;
  /** @format int32 */
  count: number;
}

export interface PageReadListDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  pageable?: PageableObject;
  /** @format int32 */
  size?: number;
  content?: ReadListDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  /** @format int32 */
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface TachiyomiReadProgressDto {
  /** @format int32 */
  booksCount: number;
  /** @format int32 */
  booksReadCount: number;
  /** @format int32 */
  booksUnreadCount: number;
  /** @format int32 */
  booksInProgressCount: number;
  /** @format int32 */
  lastReadContinuousIndex: number;
}

export interface PageHashKnownDto {
  hash: string;
  /** @format int64 */
  size?: number;
  action: "DELETE_AUTO" | "DELETE_MANUAL" | "IGNORE";
  /** @format int32 */
  deleteCount: number;
  /** @format int32 */
  matchCount: number;
  /** @format date-time */
  created: string;
  /** @format date-time */
  lastModified: string;
}

export interface PagePageHashKnownDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  pageable?: PageableObject;
  /** @format int32 */
  size?: number;
  content?: PageHashKnownDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  /** @format int32 */
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface PagePageHashMatchDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  pageable?: PageableObject;
  /** @format int32 */
  size?: number;
  content?: PageHashMatchDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  /** @format int32 */
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface PageHashUnknownDto {
  hash: string;
  /** @format int64 */
  size?: number;
  /** @format int32 */
  matchCount: number;
}

export interface PagePageHashUnknownDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  pageable?: PageableObject;
  /** @format int32 */
  size?: number;
  content?: PageHashUnknownDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  /** @format int32 */
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface HistoricalEventDto {
  type: string;
  /** @format date-time */
  timestamp: string;
  bookId?: string;
  seriesId?: string;
  properties: Record<string, string>;
}

export interface PageHistoricalEventDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  pageable?: PageableObject;
  /** @format int32 */
  size?: number;
  content?: HistoricalEventDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  /** @format int32 */
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface PageCollectionDto {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  pageable?: PageableObject;
  /** @format int32 */
  size?: number;
  content?: CollectionDto[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  /** @format int32 */
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface ClaimStatus {
  isClaimed: boolean;
}

export interface R2Positions {
  /** @format int32 */
  total: number;
  positions: R2Locator[];
}

export interface MediaType {
  type?: string;
  subtype?: string;
  parameters?: Record<string, string>;
  /** @format double */
  qualityValue?: number;
  wildcardType?: boolean;
  wildcardSubtype?: boolean;
  subtypeSuffix?: string;
  concrete?: boolean;
  charset?: string;
}

export interface ItemDto {
  id: string;
  url?: string;
  title?: string;
  summary?: string;
  content_html?: string;
  /** @format date-time */
  date_modified?: string;
  author?: AuthorDto;
  /** @uniqueItems true */
  tags: string[];
  _komga?: KomgaExtensionDto;
}

export interface JsonFeedDto {
  version: string;
  title: string;
  home_page_url?: string;
  description?: string;
  items: ItemDto[];
}

export interface KomgaExtensionDto {
  read: boolean;
}

export interface OAuth2ClientDto {
  name: string;
  registrationId: string;
}

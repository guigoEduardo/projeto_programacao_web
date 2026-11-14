export const PAGINATION = Object.freeze({ DEFAULT_PAGE: 1, DEFAULT_LIMIT: 12, MAX_LIMIT: 50 })

export const VALIDATION = Object.freeze({
  USERNAME_MIN: 3,
  USERNAME_MAX: 20,
  PASSWORD_MIN: 6,
  BIO_MAX: 255,
  TITLE_MAX: 100,
  DESCRIPTION_MAX: 500,
  COMMENT_MAX: 500,
  FULL_NAME_MAX: 100,
  COLLECTION_TITLE_MIN: 3,
  COLLECTION_TITLE_MAX: 100,
  COLLECTION_DESCRIPTION_MAX: 500,
})

export const STORAGE_KEYS = Object.freeze({ TOKEN: 'token', USER: 'user' })
export const TOAST = Object.freeze({ SUCCESS_MS: 4000, ERROR_MS: 6000, MAX_VISIBLE: 4 })

export const SEARCH = Object.freeze({ MIN_LENGTH: 2, DEBOUNCE_MS: 400 })
export const LIMITS = Object.freeze({ COLLECTION_TITLE_MIN: 3, COLLECTION_TITLE_MAX: 100, COLLECTION_DESCRIPTION_MAX: 500 })
export const NOTIFICATIONS = Object.freeze({ POLL_MS: 30000 })
export const NOTIFICATION_TEXT = Object.freeze({ like: 'curtiu o seu destino', comment: 'comentou no seu destino', follow: 'começou a seguir você' })
export const REPORT_REASONS = Object.freeze([
  { value: 'inappropriate_content', label: 'Conteúdo impróprio' },
  { value: 'harassment', label: 'Assédio ou discurso de ódio' },
  { value: 'spam', label: 'Spam ou golpes' },
  { value: 'copyright', label: 'Violação de direitos autorais' },
  { value: 'other', label: 'Outro' },
])

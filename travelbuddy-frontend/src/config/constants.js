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
})

export const STORAGE_KEYS = Object.freeze({ TOKEN: 'token', USER: 'user' })
export const TOAST = Object.freeze({ SUCCESS_MS: 4000, ERROR_MS: 6000, MAX_VISIBLE: 4 })

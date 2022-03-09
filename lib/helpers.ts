export const toQueryString = (data: Record<string, unknown>): string => Object.keys(data)
  .map(key => `${key}=${urlsafe(data[key])}`)
  .join('&')

export const urlsafe = (v: unknown): string => {
  if (typeof v === 'string') return v.replace(/ /g, '%20')
  return `${v}`
}

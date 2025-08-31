export interface Response<T = undefined> {
  status: number
  body: T | { message: string; path?: string }[]
  headers?: { [key: string]: unknown }
}

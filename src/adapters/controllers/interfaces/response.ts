export interface Response<T> {
  status: number
  body: T | { message: string; path?: string }[]
  headers?: { [key: string]: unknown }
}

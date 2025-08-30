export interface Request<T> {
  body: T
  headers: Record<string, unknown>
  params: Record<string, unknown>
}

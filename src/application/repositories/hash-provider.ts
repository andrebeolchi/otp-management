export interface HashProvider {
  hash(raw: string): Promise<string>
  compare(raw: string, hashed: string): Promise<boolean>
}

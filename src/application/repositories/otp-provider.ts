interface GenerateParams {
  length: number
}

export interface OTPProvider {
  generate({ length }: GenerateParams): Promise<string>
  compare(first: string, second: string): Promise<boolean>
}

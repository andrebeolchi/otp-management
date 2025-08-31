interface GenerateParams {
  length: number
}

export interface OTPProvider {
  generate({ length }: GenerateParams): Promise<string>
}

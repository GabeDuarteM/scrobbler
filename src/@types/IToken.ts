interface IToken {
  readonly access_token: string
  readonly expires: number
  readonly refresh_token: string
}

export default IToken

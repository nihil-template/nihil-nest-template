interface DefaultTokenInfo {
  domain: string,
  path: string,
  httpOnly: boolean,
  maxAge: number,
}

export interface ITokenOptions {
  accessOption: DefaultTokenInfo;
  refreshOption: DefaultTokenInfo;
}

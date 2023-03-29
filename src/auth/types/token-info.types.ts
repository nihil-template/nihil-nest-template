interface DefaultTokenInfo {
  domain: string,
  path: string,
  httpOnly: boolean,
  maxAge: number,
}

export interface IAccessTokenInfo extends DefaultTokenInfo {
  AccessToken: string;
}

export interface IRefreshToken extends DefaultTokenInfo {
  RefreshToken: string;
}

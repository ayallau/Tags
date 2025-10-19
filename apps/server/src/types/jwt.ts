// JWT Token Types

export interface AccessTokenPayload {
  sub: string; // user ID
  email: string;
  roles: string[];
  provider: string;
  pv: number; // password version
  tv: number; // token version
}

export interface RefreshTokenPayload {
  sub: string; // user ID
  type: "refresh";
  tv: number; // token version
}

export interface DecodedToken extends AccessTokenPayload {
  iat: number;
  exp: number;
}


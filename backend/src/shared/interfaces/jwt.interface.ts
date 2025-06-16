export interface IJwtPayload {
  sub: string; // (Subject): Identifies the principal that is the subject of the JWT.
  iss?: string; // (Issuer): Identifies the principal that issued the JWT.
  aud?: string; // (Audience): Identifies the recipients that the JWT is intended for.
  exp: Date; // (Expiration Time): Specifies the time after which the JWT should not be accepted.
  nbf?: Date; // (Not Before): Specifies the time before which the JWT must not be accepted.
  iat: Date; // (Issued At): Specifies the time at which the JWT was issued.
  jti?: string; // (JWT ID): Provides a unique identifier for the JWT.
}

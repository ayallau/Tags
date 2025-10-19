import { type IUser } from "../models/User.js";

// JWT Payload interface
export interface JWTPayload {
  sub: string; // user ID
  email: string;
  roles: string[];
  provider: string;
  pv: number; // password version
  tv: number; // token version
  iat: number;
  exp: number;
}

// Extend Express Request interface
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends IUser {}
    
    interface Request {
      user?: IUser;
      auth?: JWTPayload;
    }
  }
}

export {};


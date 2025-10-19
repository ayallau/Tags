import bcrypt from "bcrypt";
import config from "../config.js";

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, config.BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

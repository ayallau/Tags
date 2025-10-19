import User, { type IUser } from "../models/User.js";
import type { CreateUserDto, GoogleUserDto } from "../dtos/index.js";

export async function findByEmailLower(email: string): Promise<IUser | null> {
  return await User.findOne({ emailLower: email.toLowerCase() });
}

export async function createUser(userData: CreateUserDto): Promise<IUser> {
  const user = new User({
    emailLower: userData.email.toLowerCase(),
    passwordHash: userData.passwordHash,
  });
  return await user.save();
}

export async function upsertGoogleUser({ googleId, email }: GoogleUserDto): Promise<IUser> {
  // חיפוש משתמש קיים לפי Google ID
  let user = await User.findOne({ "providers.google.id": googleId });
  
  if (user) {
    return user;
  }

  // אם לא נמצא לפי Google ID, חפש לפי אימייל
  if (email) {
    user = await User.findOne({ emailLower: email.toLowerCase() });
    
    if (user) {
      // עדכן את המשתמש הקיים עם פרטי Google
      if (!user.providers) {
        user.providers = {};
      }
      user.providers.google = { id: googleId, email };
      await user.save();
      return user;
    }
  }

  // יצירת משתמש חדש
  const newUser = new User({
    emailLower: email?.toLowerCase() || null,
    providers: {
      google: { id: googleId, email },
    },
  });

  return await newUser.save();
}
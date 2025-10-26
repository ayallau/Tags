import passport from "passport";
import {
  Strategy as GoogleStrategy,
  type Profile,
  type VerifyCallback,
} from "passport-google-oauth20";
import config from "../config.js";
import { upsertGoogleUser } from "./userService.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value || null;
        const displayName =
          profile.displayName || profile.name?.givenName || null;
        const avatarUrl = profile.photos?.[0]?.value || null;

        const user = await upsertGoogleUser({
          googleId,
          email,
          displayName,
          avatarUrl,
        });
        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);
export default passport;

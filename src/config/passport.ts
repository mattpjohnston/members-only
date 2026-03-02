import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { query } from "../db/pool.js";

type DbUser = {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  is_member: boolean;
  is_admin: boolean;
};

type SessionUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isMember: boolean;
  isAdmin: boolean;
};

const mapDbUserToSessionUser = (dbUser: DbUser): SessionUser => ({
  id: dbUser.id,
  email: dbUser.email,
  firstName: dbUser.first_name,
  lastName: dbUser.last_name,
  isMember: dbUser.is_member,
  isAdmin: dbUser.is_admin,
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const result = await query(
          `SELECT id, email, password_hash, first_name, last_name, is_member, is_admin
           FROM users
           WHERE email = $1`,
          [email],
        );

        const user = result.rows[0] as DbUser | undefined;

        if (!user) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        const passwordMatches = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatches) {
          return done(null, false, { message: "Incorrect email or password" });
        }

        return done(null, mapDbUserToSessionUser(user));
      } catch (error) {
        return done(error as Error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  const sessionUser = user as SessionUser;
  done(null, sessionUser.id);
});

passport.deserializeUser(async (id: unknown, done) => {
  if (typeof id !== "number") {
    return done(null, false);
  }

  try {
    const result = await query(
      `SELECT id, email, password_hash, first_name, last_name, is_member, is_admin
       FROM users
       WHERE id = $1`,
      [id],
    );

    const user = result.rows[0] as DbUser | undefined;

    if (!user) {
      return done(null, false);
    }

    return done(null, mapDbUserToSessionUser(user));
  } catch (error) {
    return done(error as Error);
  }
});

export default passport;

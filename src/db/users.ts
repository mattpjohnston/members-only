import { query } from "./pool.js";

type DbUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  is_member: boolean;
  is_admin: boolean;
};

type NewUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
};

const findUserByEmail = async (email: string): Promise<DbUser | undefined> => {
  const result = await query(
    `SELECT id, first_name, last_name, email, password_hash, is_member, is_admin
     FROM users
     WHERE email = $1`,
    [email],
  );

  return result.rows[0] as DbUser | undefined;
};

const createUser = async (input: NewUserInput): Promise<void> => {
  await query(
    `INSERT INTO users (first_name, last_name, email, password_hash)
     VALUES ($1, $2, $3, $4)`,
    [input.firstName, input.lastName, input.email, input.passwordHash],
  );
};

export { findUserByEmail, createUser };

import { query } from "./pool.js";

type NewMessageInput = {
  title: string;
  text: string;
  authorId: number;
};

type DbMessage = {
  id: number;
  title: string;
  text: string;
  created_at: string;
};

const createMessage = async (input: NewMessageInput): Promise<void> => {
  await query(
    `INSERT INTO messages (title, text, author_id)
     VALUES ($1, $2, $3)`,
    [input.title, input.text, input.authorId],
  );
};

const getAllMessages = async (): Promise<DbMessage[]> => {
  const result = await query(
    `SELECT id, title, text, created_at
     FROM messages
     ORDER BY created_at DESC`,
  );

  return result.rows as DbMessage[];
};

export { createMessage, getAllMessages };

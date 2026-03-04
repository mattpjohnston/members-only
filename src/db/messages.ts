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
  author_first_name: string;
  author_last_name: string;
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
    `SELECT
       messages.id,
       messages.title,
       messages.text,
       messages.created_at,
       users.first_name AS author_first_name,
       users.last_name AS author_last_name
     FROM messages
     JOIN users ON users.id = messages.author_id
     ORDER BY created_at DESC`,
  );

  return result.rows as DbMessage[];
};

const deleteMessageById = async (messageId: number): Promise<boolean> => {
  const result = await query(
    `DELETE FROM messages
     WHERE id = $1`,
    [messageId],
  );

  return result.rowCount === 1;
};

export { createMessage, getAllMessages, deleteMessageById };

import { pool } from "./pool.js";

export async function getAllMessages() {
    const { rows } = await pool.query(
        `
        SELECT * FROM messages;
        `
    );
    console.log(rows);
    return rows;
}
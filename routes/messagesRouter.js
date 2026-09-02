// creating, retrieving, deleting messages

import { Router } from "express";
import { getAllMessages } from "../db/queries.js";
import dotenv from "dotenv";
import { pool } from "../db/pool.js";
dotenv.config();

const messagesRouter = Router();

messagesRouter.get("/", async (req, res) => {
  const allMessages = await getAllMessages();
  res.render("messages", { user: res.locals.user, allMessages: allMessages });
});

messagesRouter.get("/new-message", (req, res) => {
    res.render("new-message");
});

messagesRouter.get("/one-of-us", (req, res) => {
    res.render("one-of-us");
});

messagesRouter.post("/one-of-us", async (req, res) => {
    if (req.body.membercode == process.env.MEMBERSHIP_CODE) {
        console.log('THEY SHALL BECOME ONE OF US');
        console.log(req.user);
        await pool.query(`
            UPDATE users 
            SET membership_status = true 
            WHERE username = $1;
        `,
        [req.user.username]);
    }

    res.redirect('/');
});

export default messagesRouter;

// creating, retrieving, deleting messages

import { Router } from "express";
import { getAllMessages } from "../db/queries.js";
import dotenv from "dotenv";
import { pool } from "../db/pool.js";
dotenv.config();

const messagesRouter = Router();

messagesRouter.get("/", async (req, res) => {
  const allMessages = await getAllMessages();
  res.render("messages", { user: req.user, allMessages: allMessages });
});

messagesRouter.get("/new-message", (req, res) => {
  res.render("new-message");
});

messagesRouter.get("/one-of-us", (req, res) => {
  res.render("one-of-us");
});

messagesRouter.post("/one-of-us", async (req, res) => {
  console.log("HITTING BEFORE THE IFFY");
  if (req.body.membercode == process.env.MEMBERSHIP_CODE) {
    console.log("THEY SHALL BECOME ONE OF US");
    console.log(req.user);
    await pool.query(
      `
            UPDATE users 
            SET membership_status = true 
            WHERE username = $1;
        `,
      [req.user.username],
    );
  } else if (req.body.admincode == process.env.ADMIN_CODE) {
    await pool.query(
      `
            UPDATE users
            SET admin_status = true
            WHERE username = $1;    
        `,
      [req.user.username],
    );
  }

  res.redirect("/");
});

// The form using this function has a POST method attribute because html form elements cannot accept DELETE
messagesRouter.post("/delete-message", async (req, res) => {
  console.log("I WILL DELETE YOU AND YOUR WHOLE FAMILY");
  if (req.user.admin_status) {
    await pool.query(
      `
        DELETE FROM messages
        WHERE id = $1
    `,
      [req.body.messageid],
    );
  }
  res.redirect("/messages");
});

export default messagesRouter;

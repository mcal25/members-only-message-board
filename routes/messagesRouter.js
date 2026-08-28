// creating, retrieving, deleting messages

import { Router } from "express";
import { getAllMessages } from "../db/queries.js";

const messagesRouter = Router();

messagesRouter.get("/", async (req, res) => {
  const allMessages = await getAllMessages();
  res.render("messages", { allMessages: allMessages });
});

messagesRouter.get("/new-message", (req, res) => {
    res.render("new-message");
});

messagesRouter.get("/one-of-us", (req, res) => {
    res.render("one-of-us");
})

export default messagesRouter;

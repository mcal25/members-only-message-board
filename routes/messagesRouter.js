// creating, retrieving, deleting messages

import { Router } from "express";
import { getAllMessages } from "../db/queries.js";

const messagesRouter = Router();

messagesRouter.get("/", async (req, res) => {
  const allMessages = await getAllMessages();
  res.render("messages", { allMessages: allMessages });
});

export default messagesRouter;

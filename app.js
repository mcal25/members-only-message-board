import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import indexRouter from "./routes/indexRouter.js";
import usersRouter from "./routes/usersRouter.js";
import messagesRouter from "./routes/messagesRouter.js";


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(session({ secret: "cats", resave: false, saveUninitialized: false}));
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/messages', messagesRouter);

app.use((req, res, next) => {
    res.locals.currentUser = req.user
});


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(3000, (error) => {
    if (error) {
        throw error;
    }
    console.log("Listening on port 3000.");
})
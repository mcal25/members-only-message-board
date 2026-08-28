// every route pertaining to user data
// signup, login, roles

import { Router } from "express";

const usersRouter = Router();

usersRouter.get("/sign-up", (req, res) => {
    res.render("sign-up");
});

usersRouter.get("/login", (req, res) => {
    res.render("login");
});

export default usersRouter;
// every route pertaining to user data
// signup, login, roles
import bcrypt from "bcryptjs";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Router } from "express";
import { pool } from "../db/pool.js";

const usersRouter = Router();

usersRouter.get("/sign-up", (req, res) => {
    res.render("sign-up");
});

usersRouter.get("/login", (req, res) => {
    res.render("login", { user: req.user });
});

usersRouter.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    })
});

usersRouter.post("/sign-up", async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        console.log('Req body:', req.body);
        await pool.query("INSERT INTO users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4)", [req.body.firstname, req.body.lastname, req.body.email, hashedPassword]);
        res.redirect("/");
    } catch (error) {
        console.error(error);
        next(error);
    }
});

usersRouter.post("/login",
    passport.authenticate("local", {
        successRedirect: "/",
        // failureRedirect: "/",
        // failureMessage: true,
    })
);

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password);

            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            if (!match) {
                return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);
        } catch(err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const user = rows[0];
        done(null, user);
    } catch(err) {
        done(err);
    }
});

export default usersRouter;
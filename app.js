import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    console.log('LANDING PAGE BEING HIT YEEE HAWWW');
});

app.listen(3000, (error) => {
    if (error) {
        throw error;
    }
    console.log("Listening on port 3000.");
})
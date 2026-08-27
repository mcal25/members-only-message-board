import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import indexRouter from "./routes/indexRouter.js";


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use('/', indexRouter);


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(3000, (error) => {
    if (error) {
        throw error;
    }
    console.log("Listening on port 3000.");
})
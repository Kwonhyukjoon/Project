const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
// const fileupload = require("express-fileupload");
const path = require("path");
const morgan = require("morgan");
const users = require("./route/users");
const question = require("./route/question");

const app = express();

app.use(express.json());
// app.use(fileupload());

app.use(express.static(path.join(__dirname, "public")));

app.use(morgan("combined"));

app.use("/api/v1/users", users);
app.use("/api/v1/question", question);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res, next) => {
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log("App listening on port 3000!");
});

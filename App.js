const express = require("express");
const pagesRouter = require("./routes/pages");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connectDB");
const { checkUser } = require("./middleware/auth");

require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
const port = 3000;

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("*", checkUser);
app.use(pagesRouter);

try {
  connectDB(process.env.MONGO_DB);
  app.listen(port, () => {
    console.log("Listening on port 3000...");
  });
} catch (error) {
  console.log(error);
}

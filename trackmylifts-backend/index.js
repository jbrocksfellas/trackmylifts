const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { MONGO_CONNECTION_STRING } = require("./startups/config");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Database
mongoose.connect(MONGO_CONNECTION_STRING);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// routes

const v1Router = express.Router();

app.use("/v1", v1Router);

v1Router.use("/users", require("./routes/user.routes"));
v1Router.use("/exercises", require("./routes/exercise.routes"));
v1Router.use("/training-sessions", require("./routes/training_session.routes"))

app.use((req, res) => {
  res.status(404).json({
    url: req.url,
    ip: req.ip,
    message: "The request has reached at the end. you must have missed in routes or controllers of the url.",
  });
});

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

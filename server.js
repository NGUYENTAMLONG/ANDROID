const express = require("express");

const app = express();

// const bodyParser = require("body-parser");
// c1:
app.use(express.urlencoded({ extended: true }));
// c2:
// app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
// BodyParser Middleware

app.use(express.json());
const PORT = process.env.PORT || 3333;
// MongoDB (database)
const { MONGO_URL } = require("./config");
const mongoose = require("mongoose");
// connect to DB
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((err) => {
    console.log(err);
  });
// *********************
// CORS
var cors = require("cors");
app.use(cors());
// *********************
const questionRoutes = require("./routes/question");
const userRoutes = require("./routes/user");
const pagingRoutes = require("./routes/paging");

app.use("/api/user", userRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/paging", pagingRoutes);

app.get("/", (req, res) => {
  res.send("Hello from Node.js by TAM LONG");
});
app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}  ^^ !`);
});

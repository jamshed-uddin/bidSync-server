const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/connnectDb");
const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDb();

app.get("/", async (req, res) => {
  res.send("welcome to auction server");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

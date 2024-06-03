const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/connnectDb");
const userRoutes = require("./routes/userRoutes");
const listingsRoutes = require("./routes/listingsRoutes");
const bidRoutes = require("./routes/bidRoutes");
const savedItemsRoutes = require("./routes/savedItemRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();

app.get("/", async (req, res) => {
  res.send("welcome to auction server");
});

// api routers
app.use("/api/user", userRoutes);
// app.use("/api/listings", listingsRoutes);
// app.use("/api/bids", bidRoutes);
// app.use("/api/savedItems", savedItemsRoutes);

//error handler mids
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

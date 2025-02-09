const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDb = require("./config/connnectDb");
const userRoutes = require("./routes/userRoutes");
const listingsRoutes = require("./routes/listingsRoutes");
const bidRoutes = require("./routes/bidRoutes");
const savedItemsRoutes = require("./routes/savedItemRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const Listings = require("./schemas/listingsSchema");
//cron jobs------
const checkEndedAuctionCronJob = require("./utils/cronJobs/checkEndedAuction");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const checkPaymentDeadlineCronJob = require("./utils/cronJobs/checkPaymentDeadline");
const configCloudinary = require("./config/cloudinaryConfig");
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configCloudinary();
connectDb();

app.get("/", async (req, res) => {
  res.send("welcome to BidSync server");
});

// api routers
app.use("/api/user", userRoutes);
app.use("/api/listings", listingsRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/savedItems", savedItemsRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/notifications", notificationRoutes);

// cron jobs---
// checkEndedAuctionCronJob();
// checkPaymentDeadlineCronJob()

//error handler middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

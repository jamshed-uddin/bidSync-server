const sellerTemplate = require("./sellerTemplate");
const winnerTemplate = require("./winnerTemplate");

const notifySellerAndWinner = async (auction) => {
  const emails = [];

  const winnerEmail = auction.highestBidder.email;
  const sellerEmail = auction.seller.email;

  const winnerSubject = "Congratulations! You won the auction";
  const winnerText = winnerTemplate();

  const sellerSubject = "Your item has been sold";
  const sellerText = sellerTemplate();

  emails.push(sendEmail(winnerEmail, winnerSubject, winnerText));
  emails.push(sendEmail(sellerEmail, sellerSubject, sellerText));

  // Send all emails in parallel
  await Promise.all(emails);
};

const sellerTemplate = require("./sellerTemplate");
const sendMail = require("./sendMail");
const winnerTemplate = require("./winnerTemplate");

const notifySellerAndWinner = async (auction) => {
  try {
    const emails = [];

    const winnerEmail = auction.highestBidder.email;
    const sellerEmail = auction.user.email;

    const winnerSubject = "Congratulations! You won the auction";
    const winnerHtml = winnerTemplate(auction);

    const sellerSubject = "Your item has been sold";
    const sellerHtml = sellerTemplate(auction);

    emails.push(
      sendMail({ to: winnerEmail, subject: winnerSubject, html: winnerHtml })
    );
    emails.push(
      sendMail({ to: sellerEmail, subject: sellerSubject, html: sellerHtml })
    );

    // Send all emails in parallel
    await Promise.all(emails);
  } catch (error) {
    console.log(error);
  }
};

module.exports = notifySellerAndWinner;

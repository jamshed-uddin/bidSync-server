const sellerTemplate = require("./sellerTemplate");
const sendMailHandler = require("./sendMailHandler");

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
      sendMailHandler({
        to: winnerEmail,
        subject: winnerSubject,
        html: winnerHtml,
      })
    );

    emails.push(
      sendMailHandler({
        to: sellerEmail,
        subject: sellerSubject,
        html: sellerHtml,
      })
    );

    // Send all emails in parallel
    await Promise.all(emails);
  } catch (error) {
    console.log(error);
  }
};

module.exports = notifySellerAndWinner;

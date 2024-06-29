const winnerTemplateHandler = (
  winnerName,
  auctionTitle,
  highestBid,
  paymentDeadline,
  auctionId
) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auction Winner Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            font-size: 24px;
           
        }
        p {
            font-size: 16px;
            line-height: 1.6;
        }
        .details {
            margin-top: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
          .button {
            display: inline-block;
           
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #000;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #aaa;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Congratulations! You Won the Auction</h1>
        <p>Dear ${winnerName},</p>
        <p>We are excited to inform you that you have won the auction for <strong>${auctionTitle}</strong> with a bid of <strong>${highestBid}</strong>.</p>
        <div class="details">
            <p><strong>Item:</strong> ${auctionTitle}</p>
            <p><strong>Winning Bid:</strong> ${highestBid}</p>
            <p><strong>Payment Deadline:</strong> ${paymentDeadline}</p>
        </div>
        <p>Please complete the payment by the deadline to proceed with the purchase.</p>
        <a href="http://localhost:5173/checkout/${auctionId}" class="button" target="_blank">Complete Payment</a>
        <p class="footer">Thank you for participating in our auction. We look forward to serving you again.</p>
    </div>
</body>
</html>
`;
};

module.exports = winnerTemplateHandler;

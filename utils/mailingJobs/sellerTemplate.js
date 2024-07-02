const sellerTemplateHandler = (auction) => {
  const { title, highestBid, highestBidder, user, _id } = auction;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auction Seller Notification</title>
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
       <h1>BidSync</h1>
        <h1>Your Item Has Been Sold!</h1>
        <p>Dear ${user.name},</p>
        <p>We are pleased to inform you that your item <strong>${title}</strong> has been sold for <strong>${highestBid}</strong>.</p>
        <div class="details">
            <p><strong>Item:</strong> ${title}</p>
            <p><strong>Winning Bid:</strong> ${highestBid}</p>
            <p><strong>Buyer:</strong> ${highestBidder.name}</p>
        </div>
        <p>Please prepare the item for shipment as soon as the payment is confirmed.</p>
        <a href="http://localhost:5173/auction/${_id}" class="button" target="_blank">See item</a>
        <p class="footer">Thank you for using our auction platform. We hope to assist you with your future sales.</p>
    </div>
</body>
</html>
`;
};

module.exports = sellerTemplateHandler;

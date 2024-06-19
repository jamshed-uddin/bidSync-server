# BidSync server
This is the server for BidSync. A platform for online auction.User can place bid for auctions and can create auction. 
**Client repository:** [https://github.com/jamshed-uddin/bidSync-client](https://github.com/jamshed-uddin/bidSync-client)

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Packages and Dependencies](#packages-and-dependencies)


## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: You need to have Node.js installed. You can download it from [here](https://nodejs.org/).
- **MongoDB**: You need a MongoDB database. You can set up a local MongoDB server or use a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- **Git**: Ensure you have Git installed for cloning the repository. You can download it from [here](https://git-scm.com/).

## Installation

1.**Clone the repository:**

  ```bash
   git clone https://github.com/jamshed-uddin/bidSync-server.git
   cd bidSync-server
   ```
   
  2.**Install the packages**
  
```sh
 npm install
   ```
   or
   ```sh
yarn install
   ```
   
  2.**Setup environment variables**
  Create a `.env` file in the root directory and add these environment variables.
```sh
PORT=port
MONGO_URI=your_mongodb_cluster_uri
JWT_SECRET=jwt_secret
   ```
   
## Running the server
  
```sh
 npm run dev
   ```


## API Endpoints
**Authorization:** Private APIs requires a authorization token in request header
``Authorization: {token}``

### User Routes

#### Data types

    
      {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        photoURL: { type: String },
        address: {
            country: { type: String },
            city: { type: String },
            addressLineOne: { type: String },
            addressLineTwo: { type: String },
            },
    }
   
    

#### Register a new user
- **URL:** `/api/users`
- **Method:** `POST`
-  **Access:** `Public`
- **Description:**  
> A public api to create new user that takes a object with email and password in request body.After succesfull registration, api response with a message of success and user data.

#### Get a single user
- **URL:** `/api/users/:email`
- **Method:** `GET`
-  **Access:** `Private`
- **Description:**
> A private api to get data of individual user that takes user email in params.After succesfull query in database, api responses with a message of  success and user data.

#### Update user
- **URL:** `/api/users/:id`
- **Method:** `PATCH`
-  **Access:** `Private`
- **Description:**
> A private api to update data of individual user that takes user id in params.After succesfull update of user in database, api responses with a message of  success and updated user data.
#### Delete user
- **URL:** `/api/users/:id`
- **Method:** `DELETE`
-  **Access:** `Private`
- **Description:**
> A private api to delete user that takes user id in params.After succesfully delete user from database, api responses with a message of  successfull deletation.

#### Generate jwt token
- **URL:** `/api/user/generateJwtToken`
- **Method:** `POST`
-  **Access:** `Public`
- **Description:**
> A public api to generate token after user login. It takes user email in request body then generate token using `jwt.sign()`.After that api responses with token.

### Auction listings routes

#### Data types

   
      {
          title: { type: String, required: true },
          photoURL: [{ type: String }],
          description: { type: String, required: true },
          startingPrice: { type: Number, required: true },
          clossesIn: { type: Date, required: true },
          highestBid: { type: Number, default: 0 },
          highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
         category: { type: String, required: true },
         user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
               },
     },
    

#### Create a auction
- **URL:** `/api/listings`
- **Method:** `POST`
-  **Access:** `Private`
- **Description:**  
> A private api to create new auction that takes a auction object in request body.After succesfull creation of the auction , api response with a message of success and auction data.
#### Get all auctions
- **URL:** `/api/listings`
- **Method:** `GET`
-  **Access:** `Public`
- **Description:**
> A public api to get all auctions.After succesfull query in database, api responses with a message of  success and all auctions data.

#### Get all auctions of an individual user
- **URL:** `/api/myListings/:userId`
- **Method:** `GET`
-  **Access:** `Private`
- **Description:**
> A private api to get all auctions of an individual user. It queries data base by id of user.After succesfull query in database, api responses with a message of  success and all auctions  data.

#### Get a single auction
- **URL:** `/api/listings/:id`
- **Method:** `GET`
-  **Access:** `Public`
- **Description:**
> A private api to get data of a single auction that takes auction id in params.After succesfull query in database, api responses with a message of  success and auction data.


#### Search auctions
- **URL:** `/api/listings/search?q=""`
- **Method:** `GET`
-  **Access:** `Public`
- **Description:**
> A public api to search auctions.After succesfull query in database, api responses with a message of  success and search result.

#### Update auction 
- **URL:** `/api/listings/:id`
- **Method:** `PATCH`
-  **Access:** `Private`
- **Description:**
> A private api to update auction data that takes data to update in request body.After succesfull update of course in database, api responses with a message of  success and updated auction data.
#### Delete auction 
- **URL:** `/api/listings/:id`
- **Method:** `DELETE`
-  **Access:** `Private`
- **Description:**
> A private api to delete course that takes auction id in params.After succesfully delete course from database, api responses with a message of  successfull delete.

### Bid routes
#### Data types

       {
        auctionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Listing",
        },
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
        amount: { type: Number, required: true },
      },

#### Create bid
- **URL:** `/api/bids`
- **Method:** `POST`
-  **Access:** `Private`
- **Description:**  
> A private api to create bid. It takes auction id and amount in request body and responses with a message of success  and created bid.

#### Get all bids of an auction
- **URL:** `/api/bids/:id`
- **Method:** `GET`
-  **Access:** `Public`
- **Description:**  
> A Public api to get all bids of an auction. It takes auction id in params.After successfull query in database it responses with  a message of success  and bids data.

#### Get all bids by an user
- **URL:** `/api/bids/mybids/:id`
- **Method:** `GET`
-  **Access:** `Private`
- **Description:**  
> A private api to get all bids placed by an user. It takes user id in params.After successfull query in database it responses with  a message of success  and bids data.


### Saved auctions routes

#### Data types

   
      {
        userId: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User",
           required: true,
         },
        auction: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Listing",
           required: true,
         },
     },
   
    
#### Save course
- **URL:** `/api/savedItems`
- **Method:** `POST`
-  **Access:** `Private`
- **Description:**  
> A private api to save auctions. It takes course and userId in request body and responses with a message of success

#### Get saved auctions of an individual user
- **URL:** `/api/savedItems`
- **Method:** `GET`
-  **Access:** `Private`
- **User id:**  `Gets user id from req.user that set by auth               middleware`
- **Description:**
> A private api to get all saved auctions of an individual user. It queries data base by id of user that comes from req.user. User in req.user set by auth middleware after succesfull token verification.After succesfull query in database, api responses with a message of  success and all auctions data.

#### Delete saved auctions 
- **URL:** `/api/savedItems/:id`
- **Method:** `DELETE`
-  **Access:** `Private`
- **Description:**
> A private api to delete auctions that takes auction id in params. It queries the database with auction id and user id from req.user and deletes the auction  from database, api responses with a message of  successfull delete.

## Packages and Dependencies

        "cors": "^2.8.5",
        "dotenv": "^16.4.5",
        "express": "^4.19.2",
        "jsonwebtoken": "^9.0.2",
        "mongoose": "^8.4.1"









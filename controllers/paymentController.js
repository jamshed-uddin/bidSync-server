//@desc save payment info
//route POST/api/payment
//access private
const savePaymentInfo = async () => {};
//@desc get all payment info.user id in query
//route GET/api/payment
//access private
const getAllPaymentInfo = async () => {};

//@desc connect and board user to stripe . may take some parameter in query
//route GET/api/payment/connectAndBoardUser
//access private
const connectAndBoardUser = async () => {};

//@desc create client_secret by create payment intent
//route GET/api/payment/secret
//access private
const createSecret = async () => {};

module.exports = {
  savePaymentInfo,
  getAllPaymentInfo,
  connectAndBoardUser,
  createSecret,
};

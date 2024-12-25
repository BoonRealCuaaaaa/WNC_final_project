import { models } from "../lib/utils/database/index.js";

export const tradeInterbank = async (req, res) => {
    const {
      payload: {  
        amount,
        desAccount,
        otp,
        paymentTransactionId
      },
    } = req.body;
  
    const transaction = await models.sequelize.transaction(); // Start a transaction
  
    try {
      const paymentTransaction = await models.Paymenttransaction.findOne({
        where: { id: paymentTransactionId },
      }, {
        transaction: transaction
      })
  
      if (!paymentTransaction) {
        return res.status(404).json({ message: "Payment transaction not found" });
      }
  
      if (paymentTransaction.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
    
      if (paymentTransaction.otpExpiredAt < new Date()) {
        return res.status(400).json({ message: "OTP expired" });
      }
  
      const receiverPaymentAccount = await models.Paymentaccount.findOne({
        accountNumber: paymentTransaction.desAccount,
      }, {
        transaction: transaction
      });
  
      if (!receiverPaymentAccount || !amount) {
        return res.status(400).json({ code: 0, message: "Bad request: Invalid account number or amount" });
      }
  
      paymentTransaction.status = "Đã thanh toán";
      const balance = new Decimal(receiverPaymentAccount.balance);
      receiverPaymentAccount.balance = balance.plus(new Decimal(amount)).toString();
  
      paymentTransaction.save()
      receiverPaymentAccount.save();
  
      await transaction.commit(); // Commit transaction
  
      const payload = {code: 1, message: "success"};
  
      return res.status(200).json({ ...payload, signature: generateSignature(payload) });
    } catch (error) {
      await transaction.rollback(); // Rollback on error
      console.error(error);
      const payload = {code: 1, message: "fail"};
      return res.status(400).json({ ...payload, signature: generateSignature(payload) });
    }
};
  

export const searchAccounts = async (req, res) => {
    const domain = req.body.domain;
    const banks = models.Partners.findAll({where: {domain: domain}})
    
    if (!banks) {
        return res.status(400).json( {code: 0, message: "fail"});
    }

    const {  
        accountNumber
    } = req.body.payload;
    
    try {
      const paymentTransaction = await models.Customer.findAll({
        where: {id: accountNumber}
      })  
  
      const payload = {code: 1, message: "success"};
  
      return res.status(200).json({ ...payload });
    } catch (error) {
      console.error(error);
      const payload = {code: 0, message: "fail"};
      return res.status(400).json({ ...payload });
    }
};
  
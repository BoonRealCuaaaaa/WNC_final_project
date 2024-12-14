import Mailjet from "node-mailjet";
import "dotenv/config";


const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY,
});

export const sendOtpMail = async (email, otp, subject) => {
  await mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "hiiback0608@gmail.com",
          Name: "Ngân hàng A",
        },
        To: [
          {
            Email: email,
            Name: email,
          },
        ],
        TemplateID: 6562220,
        Subject: subject,
        TemplateLanguage: true,
        Variables: {
          otp_code: otp,
        },
      },
    ],
  });
};

require("dotenv").config();

const PayTmConfig = {
  mid: process.env.PAYTM_MID,
  key: process.env.PAYTM_KEY,
  website: process.env.PAYTM_WEBSITE,
  callback_url: process.env.PAYTM_CALLBACK_URL,
  hostname: process.env.PAYTM_HOSTNAME,  // securegw.paytm.in production
};

module.exports.PayTmConfig = PayTmConfig;
